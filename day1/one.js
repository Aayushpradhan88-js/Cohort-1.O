// //variables

// // var a = 7
// // var a = 8

// console.log(a);


// //es6 = let, const

// const a = 9
// // const a = 90

// Task
// 1. create a name, age, city, favouriate programming language in variables 

// 2. create a two variables then do (+,-,/,*, ||,&&,  etc.)

// 3. age = 16 thulo hunuparo message("vote garna paaucha"), age 15 ("garna paaudaina")
// condition: &&

const age = 20;
const isRegistered = true;
const hasCitizenShip = false;
const voterIdCard = false;

//combined (&& + ||)
const canVote = age >= 18 && isRegistered && (hasCitizenShip || voterIdCard )

console.log("output:", canVote);

// Task
// 4. shopping bill (productname, price, quantity, discount, date, shopkeeper name, total quantity, vat(13%))

const number = "2.343434"
const output = Number(number)
console.log(output)