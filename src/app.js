const express = require("express");
const uploadRoutes = require("./routes/uploadRoutes");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));


// Routes
app.use("/api", uploadRoutes);



// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
