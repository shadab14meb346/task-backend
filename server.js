const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");
// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();
//import routes
const users = require("./routes/users");

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
app.use("/api/users", users);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
	PORT,
	console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
	console.log(`Error: ${err.message}`.red);
	// Close server & exit process
	// server.close(() => process.exit(1));
});
