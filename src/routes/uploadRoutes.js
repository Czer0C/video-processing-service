const express = require("express");
const multer = require("multer");
const path = require("path");
const { processVideo } = require("../workers/videoWorker");

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Temporary upload directory

router.post("/upload", upload.single("video"), async (req, res) => {
    try {
        const filePath = path.resolve(req.file.path);
        await processVideo(filePath, req.file.filename);
        res.status(200).json({ message: "Video uploaded and processing started" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
