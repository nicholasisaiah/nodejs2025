const express = require("express");
const path = require("path");
const { collection, TimeRecord } = require("./config");
const bcrypt = require('bcrypt');

const app = express();
// convert data into json format
app.use(express.json());
// Static file
app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));
//use EJS as the view engine
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("about");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

// Register User
app.post("/signup", async (req, res) => {

    const data = {
        name: req.body.username,
        password: req.body.password
    }

    // Check if the username already exists in the database
    const existingUser = await collection.findOne({ name: data.name });

    if (existingUser) {
        res.send('User already exists. Please choose a different username.');
    } else {
        // Hash the password using bcrypt
        const saltRounds = 10; // Number of salt rounds for bcrypt
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword; // Replace the original password with the hashed one

        const userdata = await collection.insertMany(data);
        console.log(userdata);

        res.redirect("/");
    }

});

// Login user 
app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        if (!check) {
            return res.send("User name cannot found")
        }
        // Compare the hashed password from the database with the plaintext password
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (!isPasswordMatch) {
            res.send("wrong Password");
        }
        else {
            res.render("home");
        }
    }
    catch {
        res.send("wrong Details");
    }
});

app.get("/history-page", (req, res) => {
    res.render("history");
  });

  app.get("/home-page", (req, res) => {
    res.render("home");
  });
  
  
  

// Define Port for Application
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});

// Bagian history ----------
// const mongoose = require("mongoose");

// mongoose.connect("mongodb://localhost:27017/Login-tut", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// Schema riwayat stopwatch / countdown



  app.post("/save-time", async (req, res) => {
    const { type, startTime, endTime, duration } = req.body;
  
    try {
      const newRecord = new TimeRecord({ type, startTime, endTime, duration });
      await newRecord.save();
      res.status(201).json({ message: "Data berhasil disimpan!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Gagal menyimpan data" });
    }
  });

  app.get("/history", async (req, res) => {
    try {
      const filter = req.query.type;
      const query = filter === "stopwatch" || filter === "countdown" ? { type: filter } : {};
  
      const records = await TimeRecord.find(query).sort({ endTime: -1 });
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: "Gagal mengambil data" });
    }
  });

  app.delete("/history/:id", async (req, res) => {
    try {
      await TimeRecord.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, error: "Gagal menghapus data" });
    }
  });
  

// run: nodemon src/index.js