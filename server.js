const path = require("path");
const colors = require("colors");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/error");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");

// Load env vars
dotenv.config({ path: "./config/config.env" });

connectDB();

// Logger
const logger = require("./middleware/logger");

// Router files
const bootcamps = require("./routes/bootcamps"); // Mounting bootcamp router
const courses = require("./routes/courses"); // Mounting bootcamp courses
const auth = require("./routes/auth");
const users = require("./routes/users");
const reviews = require("./routes/reviews");
const app = express();

//Body Parser
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// File uploading
app.use(fileupload());

// Sanitiza data
app.use(mongoSanitize());

app.use(helmet());

app.use(xss());

// Enable CORS
app.use(cors());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10mins
  max: 100,
});

app.use(limiter);

app.use(hpp());
// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Mount routers
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/reviews", reviews);

app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Event emmitter called. + ${err.message}`.red.bold);
});
