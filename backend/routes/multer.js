const express = require("express");
const mongoose=require("mongoose")
const multer = require("multer");
const xlsx = require("xlsx");
const fs = require("fs");
const Agent = require("./agents"); 
const Task = require("./task"); 
const { v4: uuidv4 } = require("uuid");
const path = require("path");
 
const router = express.Router();

// Multer Storage Configuration

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "uploads/");
  },
   filename: function (req, file, cb) {
        const uniquename=uuidv4();
      cb(null,uniquename+path.extname(file.originalname));
    }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["text/csv", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file format. Only CSV, XLSX, and XLS are allowed."));
    }
  },
});

router.post("/upload", upload.single("file"), async (req, res) => {
    console.log(" Received a file upload request...");

  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);



    const formattedData = data.map((row, index) => ({
        firstName: row.FirstName || row.firstname || `Unknown_${index}`, // Handle different cases
        phone: row.Phone || row.phone || "0000000000",
        notes: row.Notes || row.notes || "No notes available",
      }));
  
    console.log("Checking database connection...");
    if (!mongoose.connection.readyState) {
      return res.status(500).json({ message: "Database not connected!" });
    }

    const agents = await Agent.find();
    console.log(agents)
    if (agents.length < 5) return res.status(400).json({ message: "At least 5 agents required" });

    let distributedData = [];
    data.forEach((item, index) => {
      const agentIndex = index % 5;
      distributedData.push({ assignedAgent: agents[agentIndex]._id, ...item });
    });

    await Task.insertMany(distributedData);

    fs.unlinkSync(req.file.path);

    res.status(200).json({ message: "File uploaded and tasks assigned successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error processing file" });
  }
});

module.exports = router;
