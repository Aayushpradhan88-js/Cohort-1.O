const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");
const { randomUUID } = require("node:crypto");

import http from "node:http";

const appDirectory = __dirname;
const dataFile = path.join(appDirectory, "tasks.txt");
const port = Number(process.env.PORT) || 3000;
const allowedStatuses = new Set([
    "Completed",
    "Pending",
    "Not completed",
    "Ongoing",
    "In progress"
]);

const mimeTypes = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    "pdf": "application/pdf",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".txt": "text/plain; charset=utf-8",
    ".webp": "image/webp"
};

let operationQueue = Promise.resolve();

function serialize(operation) {
    const result = operationQueue.then(operation);
    operationQueue = result.then(() => undefined, () => undefined);
    return result;
}

function sendJson(response, status, data) {
    response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
    response.end(JSON.stringify(data));
}

function validateTask(task) {
    if (!task || typeof task !== "object" || Array.isArray(task)) {
        return "Task data must be an object.";
    }
    if (typeof task.title !== "string" || !task.title.trim() || task.title.trim().length > 160) {
        return "Title is required and must be 160 characters or fewer.";
    }
    if (![1, 2, 3].includes(task.priority)) {
        return "Priority must be 1, 2, or 3.";
    }
    if (!allowedStatuses.has(task.status)) {
        return "Choose a valid task status.";
    }
    if (typeof task.dueDate !== "string") {
        return "Due date must be a date string.";
    }
    if (task.dueDate && (!/^\d{4}-\d{2}-\d{2}$/.test(task.dueDate) ||
        Number.isNaN(Date.parse(`${task.dueDate}T00:00:00Z`)) ||
        new Date(`${task.dueDate}T00:00:00Z`).toISOString().slice(0, 10) !== task.dueDate)) {
        return "Due date must be a valid calendar date.";
    }
    return null;
}

function validateChanges(changes) {
    if (!changes || typeof changes !== "object" || Array.isArray(changes)) {
        return "Task updates must be an object.";
    }
    const allowedFields = new Set(["title", "dueDate", "priority", "status"]);
    const fields = Object.keys(changes);
    if (!fields.length || fields.some((field) => !allowedFields.has(field))) {
        return "Provide one or more valid task fields to update.";
    }
    return null;
}

async function readTasks() {
    let contents;
    try {
        contents = await fs.readFile(dataFile, "utf8");
    } catch (error) {
        if (error.code === "ENOENT") return [];
        throw error;
    }

    const tasks = new Map();
    for (const [index, line] of contents.split(/\r?\n/).entries()) {
        if (!line.trim()) continue;
        let event;
        try {
            event = JSON.parse(line);
        } catch {
            throw new Error(`Invalid task log record on line ${index + 1}.`);
        }

        if (event.type === "delete" && typeof event.id === "string") {
            tasks.delete(event.id);
        } else if ((event.type === "create" || event.type === "update") &&
            event.task && typeof event.task.id === "string") {
            tasks.set(event.task.id, event.task);
        } else {
            throw new Error(`Unsupported task log record on line ${index + 1}.`);
        }
    }
    return [...tasks.values()];
}

async function appendEvent(event) {
    await fs.appendFile(dataFile, `${JSON.stringify(event)}\n`, "utf8");
}

async function readRequestBody(request) {
    const chunks = [];
    let totalLength = 0;
    for await (const chunk of request) {
        totalLength += chunk.length;
        if (totalLength > 16 * 1024) {
            const error = new Error("Request body is too large.");
            error.statusCode = 413;
            throw error;
        }
        chunks.push(chunk);
    }

    try {
        return JSON.parse(Buffer.concat(chunks).toString("utf8"));
    } catch {
        const error = new Error("Request body must be valid JSON.");
        error.statusCode = 400;
        throw error;
    }
}

async function serveStatic(pathname, response) {
    let requestedPath;
    try {
         requestedPath = decodeURIComponent(pathname);
    } catch {
        sendJson(response, 400, { error: "Invalid URL path." });
        return;
    }

    const relativePath = requestedPath === "/" ? "index.html" : requestedPath.slice(1);
    const filePath = path.resolve(appDirectory, relativePath);
    if (!filePath.startsWith(`${appDirectory}${path.sep}`)) {
        sendJson(response, 403, { error: "Access denied." });
        return;
    }

    try {
        const contents = await fs.readFile(filePath);
        response.writeHead(200, {
            "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream",
            "X-Content-Type-Options": "nosniff"
        });
        response.end(contents);
    } catch (error) {
        if (error.code === "ENOENT" || error.code === "EISDIR") {
            sendJson(response, 404, { error: "File not found." });
            return;
        }
        throw error;
    }
}

async function handleApi(request, response, pathname) {
    if (pathname === "/api/tasks" && request.method === "GET") {
        const tasks = await serialize(readTasks);
        sendJson(response, 200, tasks);
        return;
    }

    if (pathname === "/api/tasks" && request.method === "POST") {
        const payload = await readRequestBody(request);
        const payloadError = validateChanges(payload);
        if (payloadError) {
            sendJson(response, 400, { error: payloadError });
            return;
        }
        const task = {
            id: randomUUID(),
            title: payload.title,
            dueDate: payload.dueDate ?? "",
            priority: payload.priority,
            status: payload.status,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        const validationError = validateTask(task);
        if (validationError) {
            sendJson(response, 400, { error: validationError });
            return;
        }
        await serialize(() => appendEvent({ type: "create", task }));
        sendJson(response, 201, task);
        return;
    }

    const taskMatch = pathname.match(/^\/api\/tasks\/([^/]+)$/);
    if (taskMatch && request.method === "PATCH") {
        let id;
        try {
            id = decodeURIComponent(taskMatch[1]);
        } catch {
            sendJson(response, 400, { error: "Invalid task id." });
            return;
        }
        const changes = await readRequestBody(request);
        const changesError = validateChanges(changes);
        if (changesError) {
            sendJson(response, 400, { error: changesError });
            return;
        }
        const updatedTask = await serialize(async () => {
            const tasks = await readTasks();
            const currentTask = tasks.find((task) => task.id === id);
            if (!currentTask) return null;
            const task = {
                ...currentTask,
                ...changes,
                id,
                title: changes.title === undefined
                    ? currentTask.title
                    : typeof changes.title === "string"
                        ? changes.title.trim()
                        : changes.title,
                updatedAt: new Date().toISOString()
            };
            const validationError = validateTask(task);
            if (validationError) {
                const error = new Error(validationError);
                error.statusCode = 400;
                throw error;
            }
            await appendEvent({ type: "update", task });
            return task;
        });
        if (!updatedTask) {
            sendJson(response, 404, { error: "Task not found." });
            return;
        }
        sendJson(response, 200, updatedTask);
        return;
    }

    if (taskMatch && request.method === "DELETE") {
        let id;
        try {
            id = decodeURIComponent(taskMatch[1]);
        } catch {
            sendJson(response, 400, { error: "Invalid task id." });
            return;
        }
        const deleted = await serialize(async () => {
            const tasks = await readTasks();
            if (!tasks.some((task) => task.id === id)) return false;
            await appendEvent({ type: "delete", id, deletedAt: new Date().toISOString() });
            return true;
        });
        sendJson(response, deleted ? 200 : 404, deleted ? { id } : { error: "Task not found." });
        return;
    }

    sendJson(response, 404, { error: "API endpoint not found." });
}

const server = http.createServer(async (request, response) => {
    try {
        const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);
        if (url.pathname.startsWith("/api/")) {
            await handleApi(request, response, url.pathname);
        } else if (request.method === "GET") {
            await serveStatic(url.pathname, response);
        } else {
            sendJson(response, 405, { error: "Method not allowed." });
        }
    } catch (error) {
        const statusCode = error.statusCode || 500;
        if (statusCode === 500) console.error(error);
        if (!response.headersSent) sendJson(response, statusCode, { error: statusCode === 500 ? "Internal server error." : error.message });
        else response.destroy(error);
    }
});

server.listen(port, "127.0.0.1", () => {
    console.log(`Daylist is running at http://localhost:${port}`);
});
