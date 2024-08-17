const express = require("express");
const morgan = require("morgan");
const blogRouter = require("./routes/blogRoutes");
const userRouter = require('./routes/userRoutes');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();

const apiLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many request from this IP. Try again later',
    headers: true, // Include rate limit headers in the response
}); 

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser()); // Cookie parser middleware
app.use(apiLimit);
// Routes
app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/user", userRouter);

// Exporting app
module.exports = app;
