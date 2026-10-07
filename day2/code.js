//Functions

//Function vaneko chai reusable block of code ho jasle chai specific task perform garnaa ko lagi use hunxa...
//DRY - Dont Repeat Your Code

//Example1: Without function

// console.log("Hello Aayush")
// console.log("Hello Naresh")
// console.log("Hello Samikshya")

//Types of example : Simple function
function greet(name) {
    // return name
    console.log("Hello", name)
}

// const output = greet("Naresh")
// console.log(output)

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