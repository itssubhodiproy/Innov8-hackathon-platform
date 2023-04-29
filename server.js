const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const { dbConnect } = require("./database/config/dbConnection");

// database connection
dbConnect();

// middleware functions
app.use(cors());
app.use(express.json());

// routes
// app.use("/", (req, res) => {
//   res.send("Hello from server");
// });
app.use("/api/auth", require("./routes/auth"));
app.use("/api/project", require("./routes/project"));
app.use("/api/invitation", require("./routes/invitation"));

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
