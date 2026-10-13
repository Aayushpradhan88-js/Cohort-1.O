//Evolution of Asynchronous Javascript

// callbacks --> promises  ---> async/await

//callbacks
// getData(function (result) {
//     console.log("output", result)
// })

//promises
// getData()
//     .then(result => console.log(result))
//     .catch(err => console.error(err))

//async/await
// try {
//     const result = async () => {
//         const data = await getData()
//         console.log(data)
//     }
// } catch (error) {
//     console.error(error)
// }



//Promises - state(Pending, fulfilled, Rejected)
/*
    Pending: Kunaai operation completed vako xaina
    fulfilled: Kunaai operation completed vayo & produced value
    Rejected: Operation cahi fail vayo with rejection reason
*/

//example1: creating first Promise (promise: fulfilled state)
let order = new Promise((resolve, reject) => {
    let orderPlaced = false;

    if (orderPlaced) {
        resolve("Order Confirmed")
    } else {
        reject("order failed")
    }
})

order
    .then((message) => {
        console.log(message)
    })
    .catch((error) => {
        console.error(error)
    });

//delay of promse 1.5ms in (promise: pending state)
function getStudent() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const student = {
                id: 1,
                name: "Ram",
                marks: 85
            };

            if (student) {
                resolve(student);
            } else {
                reject(new Error("Student not found"));
            }
        }, 1500);
    });
}

getStudent()
    .then((student) => {
        console.log("Student:", student.name);
        console.log("Marks:", student.marks);
    })
    .catch((error) => {
        console.error(error.message);
    });


//Project discussion: New project or clone project