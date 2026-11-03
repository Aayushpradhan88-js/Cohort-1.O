//Module Systems

// const http = require('http'); //kehi kura launa ko lagi
import http from 'http'; //kehi kura launa ko lagi

export const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World\n');
});

export const exampleFunction = () => {
    console.log('This is an example function');
}

// server.listen(3000, () => {
//     console.log('Server running at http://localhost:3000/');
// });

// module.exports = server; //dine kura
// export default server; //dine kura if there is single function....

// export { server, exampleFunction }; //For multiple function exports....