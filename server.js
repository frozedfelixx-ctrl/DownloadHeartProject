const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Speicher für Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Static files
app.use(express.static("public"));
app.use("/files", express.static("uploads"));

// Upload endpoint
app.post("/upload", upload.single("file"), (req, res) => {
  res.redirect("/");
});

// Datei-Liste
app.get("/list", (req, res) => {
  const dir = "./uploads";
  if (!fs.existsSync(dir)) return res.json([]);

  const files = fs.readdirSync(dir).map((file) => ({
    name: file,
    url: "/files/" + file,
  }));

  res.json(files);
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});