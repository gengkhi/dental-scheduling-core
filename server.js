require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const routes = require("./routes");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Connect Database
connectDB();

app.use("/api", routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
