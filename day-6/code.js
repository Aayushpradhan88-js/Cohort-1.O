//Evolution of Asynchronous Javascript

// callbacks --> promises  ---> async/await

//callbacks
getData(function (result) {
    console.log("output", result)
})

//promises
getData()
    .then(result => console.log(result))
    .catch(err => console.error(err))

//async/await
try {
    const result = async () => {
        const data = await getData()
        console.log(data)
    }
} catch (error) {
    console.error(error)
}