// async/sync ,flow of apicalls., promises, callback hell

//ASYNC/sync

//SYNCHRONOUS JS - it executes the code line by line in a sequence..

//Baic Execution
// console.log("First")
// console.log("Second")
// console.log("Third")
// console.log("Fourth")
// console.log("Fifth")
// console.log("Sixth")

//Block Execution
// console.log("Start")

function calculation() { //Function Execution
    let total = 0;
    for (let index = 0; index < 5000000000; index++) {
        total = total + index
    }
    console.log("Calculation completed")
}
// calculation()

// console.log("End")

//Function Execution

function login() {
    console.log("Checking Credientals.....")
}

function output() {
    console.log("Verifying calculation")
}

function calculation() { //Function Execution
    let total = 0;
    for (let index = 0; index < 50; index++) {
        total = total + index
    }
    console.log("Calculation completed")
}


login()
output()
calculation()


//ASYNC FUNCTION
//syntax
// async function name(params) {
// }

//1: setTimeout
//syntax

console.log
// setTimeout(() => {
//     console.log("Execution")
// }, 2000);

//API CALLS USING ASYNC/AWAIT 
//FAKE REF: https://jsonplaceholder.typicode.com/



//task : in different functions we have to get the data of (GET, PUT, PATCH, DELETE, POST) & edge cases are handled gracefully...


//Optimized
const BASE_URL = process.env.API_BASE_URL ?? "https://jsonplaceholder.typicode.com";

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const backoff = (attempt) => 2 ** attempt * 300 + Math.random() * 100;

async function getPostById(id, { signal, timeoutMs = 5000, retries = 2 } = {}) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new TypeError("id must be a positive integer");
  }

  const url = `${BASE_URL}/posts/${encodeURIComponent(id)}`;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const timeout = AbortSignal.timeout(timeoutMs);
    const combined = signal ? AbortSignal.any([signal, timeout]) : timeout;

    try {
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: combined,
      });

      if (!res.ok) {
        const retryable = res.status >= 500 || res.status === 429;
        if (retryable && attempt < retries) {
          await sleep(backoff(attempt));
          continue;
        }
        throw new HttpError(res.status, `Request failed with status ${res.status}`);
      }

      const data = await res.json();

      if (typeof data?.id !== "number" || typeof data?.title !== "string") {
        throw new Error("Invalid response shape");
      }

      return data;
    } catch (err) {
      if (err instanceof HttpError) throw err;   // 4xx / final 5xx
      if (signal?.aborted) throw err;            // caller le cancel garyo
      if (attempt < retries) {                   // network / timeout
        await sleep(backoff(attempt));
        continue;
      }
      throw new Error("Failed to fetch post", { cause: err });
    }
  }
}