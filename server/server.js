const express = require("express");
const fetch = require("node-fetch");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
dotenv.config();

const app = express();

app.use(logger);
app.use(cors());

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory to save the uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Save with unique filename
  },
});

const upload = multer({ storage: storage });

app.get("/ping", async (req, res) => {
  const requestOptions = {
    method: "GET",
    headers: {
      "x-api-key": process.env.api_key,
    },
  };

  const response = await fetch(
    "https://api.etsy.com/v3/application/openapi-ping",
    requestOptions
  );

  if (response.ok) {
    const data = await response.json();
    res.send(data);
  } else {
    res.send("Couldn't get the Shop ID");
  }
});

// POST endpoint to handle file uploads
app.post("/uploadFile", upload.single("file"), (req, res) => {
  console.log(req.file);
  try {
    // req.file contains the information about the uploaded file
    const file = req.file;

    if (!file) {
      return res.status(400).send("No file uploaded.");
    }

    // Send success response
    res.json({
      message: "File uploaded successfully!",
      fileName: file.filename,
      originalName: file.originalname,
      path: file.path,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send("Error uploading file.");
  }
});

function logger(req, res, next) {
  console.log(req.originalUrl);
  next();
}

const port = 3003;
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
