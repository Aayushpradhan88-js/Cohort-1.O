//import packages
import express from "express";
const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));-

//routing
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});