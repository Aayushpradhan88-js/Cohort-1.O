const taskList = document.querySelector("#task-list");
const dialog = document.querySelector("#task-dialog");
const form = document.querySelector("#task-form");
const titleInput = document.querySelector("#task-title");
const searchInput = document.querySelector("#search-input");
const formError = document.querySelector("#form-error");
const submitButton = document.querySelector("#submit-task");

const state = {
    tasks: [],
    view: "inbox",
    search: "",
    editingId: null
};

const viewTitles = {
    inbox: "Inbox",
    today: "Today",
    upcoming: "Upcoming"
};

function getLocalDateString(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

document.querySelector("#current-date").textContent = new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric"
}).format(new Date());

async function request(path, options = {}) {
    const response = await fetch(path, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        }
    });

    if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.error || `Request failed (${response.status})`);
    }

    return response.json();
}

function openDialog(task = null) {
    state.editingId = task ? task.id : null;
    form.reset();
    formError.textContent = "";
    document.querySelector("#dialog-title").textContent = task ? "Edit task" : "Create a task";
    submitButton.firstChild.textContent = task ? "Save changes " : "Done ";

    if (task) {
        titleInput.value = task.title;
        document.querySelector("#task-date").value = task.dueDate || "";
        document.querySelector("#task-priority").value = String(task.priority);
        document.querySelector("#task-status").value = task.status;
    } else {
        document.querySelector("#task-priority").value = "2";
        document.querySelector("#task-status").value = "Pending";
    }

    dialog.showModal();
    titleInput.focus();
}

function closeDialog() {
    dialog.close();
    state.editingId = null;
}

function formatDueDate(value) {
    if (!value) return "";
    const date = new Date(`${value}T12:00:00`);
    const today = new Date();
    const tomorrow = new Date(today);
    today.setHours(0, 0, 0, 0);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(date);
}

function getVisibleTasks() {
    const today = getLocalDateString();
    return state.tasks.filter((task) => {
        const matchesSearch = task.title.toLowerCase().includes(state.search.toLowerCase());
        if (!matchesSearch) return false;
        if (state.view === "today") return task.dueDate === today;
        if (state.view === "upcoming") return task.dueDate > today && task.status !== "Completed";
        return true;
    });
}

function makeTaskElement(task) {
    const item = document.createElement("article");
    item.className = `task-item${task.status === "Completed" ? " is-complete" : ""}`;

    const toggle = document.createElement("button");
    toggle.className = `complete-toggle${task.status === "Completed" ? " checked" : ""}`;
    toggle.type = "button";
    toggle.setAttribute("aria-label", task.status === "Completed" ? "Mark as pending" : "Mark as completed");
    toggle.textContent = task.status === "Completed" ? "✓" : "";
    toggle.addEventListener("click", () => changeTask(task.id, {
        status: task.status === "Completed" ? "Pending" : "Completed"
    }));

    const details = document.createElement("div");
    details.className = "task-details";
    const title = document.createElement("div");
    title.className = "task-title";
    title.textContent = task.title;
    details.append(title);

    const metadata = document.createElement("div");
    metadata.className = "task-metadata";
    const status = document.createElement("span");
    status.className = `status-chip status-${task.status.toLowerCase().replaceAll(" ", "-")}`;
    status.textContent = task.status;
    metadata.append(status);

    const priority = document.createElement("span");
    priority.className = `priority-chip priority-${task.priority}`;
    priority.textContent = `P${task.priority}`;
    metadata.append(priority);

    if (task.dueDate) {
        const dueDate = document.createElement("span");
        dueDate.className = "due-date";
        dueDate.textContent = `◷ ${formatDueDate(task.dueDate)}`;
        metadata.append(dueDate);
    }
    details.append(metadata);

    const actions = document.createElement("div");
    actions.className = "task-actions";
    const edit = document.createElement("button");
    edit.className = "icon-button";
    edit.type = "button";
    edit.setAttribute("aria-label", `Edit ${task.title}`);
    edit.textContent = "✎";
    edit.addEventListener("click", () => openDialog(task));
    const remove = document.createElement("button");
    remove.className = "icon-button delete-button";
    remove.type = "button";
    remove.setAttribute("aria-label", `Delete ${task.title}`);
    remove.textContent = "×";
    remove.addEventListener("click", () => deleteTask(task.id));
    actions.append(edit, remove);

    item.append(toggle, details, actions);
    return item;
}

function render() {
    document.querySelector("#view-title").textContent = viewTitles[state.view];
    document.querySelectorAll(".nav-item").forEach((button) => {
        const active = button.dataset.view === state.view;
        button.classList.toggle("active", active);
        if (active) button.setAttribute("aria-current", "page");
        else button.removeAttribute("aria-current");
    });
    document.querySelector("#inbox-count").textContent = String(
        state.tasks.filter((task) => task.status !== "Completed").length
    );

    const visibleTasks = getVisibleTasks();
    taskList.replaceChildren();
    if (visibleTasks.length) {
        visibleTasks.forEach((task) => taskList.append(makeTaskElement(task)));
        return;
    }

    const empty = document.createElement("div");
    empty.className = "empty-state";
    const illustration = document.createElement("div");
    illustration.className = "empty-illustration";
    illustration.setAttribute("aria-hidden", "true");
    illustration.textContent = state.search ? "⌕" : "✦";
    const heading = document.createElement("h2");
    heading.textContent = state.search ? "No matching tasks" : state.view === "inbox" ? "All clear for now" : `Nothing planned for ${state.view}`;
    const message = document.createElement("p");
    message.textContent = state.search ? "Try another search, or clear the search field." : "A clear mind starts with a clear list. Add a task whenever you're ready.";
    const create = document.createElement("button");
    create.className = "empty-create";
    create.type = "button";
    create.textContent = "+  Create your first task";
    create.addEventListener("click", () => openDialog());
    empty.append(illustration, heading, message);
    if (!state.search) empty.append(create);
    taskList.append(empty);
}

async function loadTasks() {
    try {
        state.tasks = await request("/api/tasks");
        render();
    } catch (error) {
        taskList.replaceChildren();
        const message = document.createElement("p");
        message.className = "load-error";
        message.textContent = `Couldn't load your tasks: ${error.message}. Make sure you start the app with node server.js.`;
        taskList.append(message);
    }
}

async function changeTask(id, changes) {
    try {
        const updatedTask = await request(`/api/tasks/${encodeURIComponent(id)}`, {
            method: "PATCH",
            body: JSON.stringify(changes)
        });
        state.tasks = state.tasks.map((task) => task.id === id ? updatedTask : task);
        render();
    } catch (error) {
        window.alert(`Couldn't update task: ${error.message}`);
    }
}

async function deleteTask(id) {
    try {
        await request(`/api/tasks/${encodeURIComponent(id)}`, { method: "DELETE" });
        state.tasks = state.tasks.filter((task) => task.id !== id);
        render();
    } catch (error) {
        window.alert(`Couldn't delete task: ${error.message}`);
    }
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    formError.textContent = "";
    submitButton.disabled = true;

    const task = {
        title: titleInput.value.trim(),
        dueDate: document.querySelector("#task-date").value,
        priority: Number(document.querySelector("#task-priority").value),
        status: document.querySelector("#task-status").value
    };

    try {
        if (state.editingId) {
            const updatedTask = await request(`/api/tasks/${encodeURIComponent(state.editingId)}`, {
                method: "PATCH",
                body: JSON.stringify(task)
            });
            state.tasks = state.tasks.map((current) => current.id === updatedTask.id ? updatedTask : current);
        } else {
            state.tasks.push(await request("/api/tasks", {
                method: "POST",
                body: JSON.stringify(task)
            }));
        }
        closeDialog();
        render();
    } catch (error) {
        formError.textContent = error.message;
    } finally {
        submitButton.disabled = false;
    }
});

document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
        state.view = button.dataset.view;
        render();
    });
});

document.querySelectorAll("#open-create, #header-add, #inline-create").forEach((button) => {
    button.addEventListener("click", () => openDialog());
});
document.querySelector("#close-dialog").addEventListener("click", closeDialog);
document.querySelector("#cancel-dialog").addEventListener("click", closeDialog);
dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog();
});
searchInput.addEventListener("input", () => {
    state.search = searchInput.value.trim();
    render();
});
document.addEventListener("keydown", (event) => {
    if (event.key === "/" && document.activeElement !== searchInput && !dialog.open) {
        event.preventDefault();
        searchInput.focus();
    }
});

loadTasks();