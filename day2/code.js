//Functions

//Function vaneko chai reusable block of code ho jasle chai specific task perform garnaa ko lagi use hunxa...
//DRY - Dont Repeat Your Code

//Example1: Without function

// console.log("Hello Aayush")
// console.log("Hello Naresh")
// console.log("Hello Samikshya")

//Types of example : Simple function
function greet(name) {
    console.log("Hello", name)
}

greet("Naresh")


// greet("Samikshya") //function calling

// Type2: Function that returns a value

// Type3: Age calculation of user 

// function calculateAge(currentYear, birthYear) {
//     // const output 
//     return currentYear - birthYear
// }

// const xyz = calculateAge("xyz",2083, 2049);
// const xyz2 = calculateAge(2083, 2049);
// const xyz3 = calculateAge(2083, 2049);

// console.log(`Your Age is ${xyz}`)
// Type4: Login example (email, password)
// && email: "test123", password: "12345"

// flow: user put details (it can put numbers we are expecting string) --> function process it --> gives output to user

// function process --> check the typeof value --> check the email and password using && operator

// TASK: check the type of email also like @ is available or not also check is there is empty value or not

//Task
/*
    - Read about arrow function, callback function, how can we cull another function, Clousers, HOF, Async fnx. 
    - Employee Salary calculation, Ecommerce Order Calculator (code)
*/

//Login function

//input values = email, password

function login(email, password) {
    //logic 1st type checking --> email formating checking  --> check uservalues(local values) --> return 

    //1st type checking
    if(typeof email !== "string"){
        return "Email must be string";
    }
    if(typeof password !== "string"){
        return "Password must be string";
    }

    //2nd Email formating
    if(!email.includes("@")){ //shankahr123
        return "Please enter the valid email";
    }

    //3rd check 
    if(email.trim() === "" || password.trim() === ""){
        return "The email or password you entered isn’t connected to an account."
    }

    //4th check values
    if(email === "admin@gmail.com" && password === "admin1234") {
        return "Login successful"
    }
    return "Invalid credientals check email or password";
}

//users
console.log(login("admin@gmail.com", "admin1234")) //login success
console.log(login("admin@gmail.com", "admin12345"))
console.log(login("admin@gmail.com", "admin12346"))
console.log(login("admin@gmail.com", "admin12347  "))
console.log(login(12345, " admin12348 "))
console.log(login("admin123", " admin12348 "))