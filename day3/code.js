//arrow function
// -- shorter way of writing the normal function

//normal function
// function add(a,b){
//     return a+b
// }

// let add = (a,b) => a+b
//callbacks, react important, map(), filter(), foreach()

// console.log(add(1,2))

//Task1: Displaying Product Name
//data

const products = [
    {name: "laptop", price: 80000}, //i 0
    {name: "monitor", price: 12000}, //i:1
    {name: "mouse", price: 1000}     //i:2
];

// console.log(products)
const productName = products.map((product) => product.price)
console.log("output", productName)

//Task2: Calclate discount  (price, discount)
const totalPrice = (p1, p2) => {
    return p1 * (1 - p2/100);
}

console.log(totalPrice(3000, 10))

// 2. CALLBACK Function
// ->

//example
//main function
function main(name, shankhar, aayush) {
    console.log("Hello" + name)
    // callback() //calling comp component
    shankhar()
    aayush()
}

//component
function comp(){
    console.log("Welcome!")
}

function comp2(){
    console.log("shankhar")
}

main("Naren sir", comp, comp2)

//TASK: Payment processsing - account number, price