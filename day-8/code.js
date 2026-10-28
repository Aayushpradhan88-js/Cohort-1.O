console.log("protoypical inheritance");

//example 

const userName = {
    fName: "Aayush",
    lName:"Pradhan",
}

const otherName = {
    userName
}

// console.log(userName.fName)
// console.log(userName.lName)
console.log(otherName.userName.fName)



// const value = "javascript" 
// const number = 12345


//__proto__

// let animal = {
//     animalEats: false
// }

// let rabbit = {
//     jumpsTo: true
// }

// rabbit.__proto__ = animal


// console.log(rabbit.animalEats)
// console.log(rabbit.jumpsTo);

//OBJECT SETPROTOTYPE OF METHOD

let rabbit = {
    rabbitJumps: true,
};
let animal = {
    animalEats: true,
};

Object.setPrototypeOf(rabbit, animal)
console.log(rabbit.animalEats);
console.log(rabbit.rabbitJumps);