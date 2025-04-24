const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const dbConnect = require("./config/dbConnect");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const { verifyToken, verifyAdmin } = require("./middlewares/authMiddleware");
const authorizeRoles = require("./middlewares/roleMiddleware");
dotenv.config();
const User = require("./models/userModel");
const Record = require("./models/recordModel");
const TimeRecord = require("./models/recordModel");

const app = express();
const router = express.Router();

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Template engine
app.set("view engine", "ejs");

// Database connection
dbConnect();

// Auth routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/", router);

// View routes
app.get("/", (req, res) => res.render("about"));
app.get("/login", (req, res) => res.render("login"));
app.get("/signup", (req, res) => res.render("signup"));
app.get("/home-page", verifyToken, (req, res) => res.render("home", { user: req.user }));
app.get("/history-page", verifyToken, (req, res) => res.render("history", { user: req.user }));

// Admin View
app.get("/admin-page", verifyAdmin, (req, res) => res.render("admin", { user: req.user }));

router.get("/admin-page", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const users = await User.find();
    const records = await Record.find().populate("userId");

    const recordsWithUsername = records.map((record) => ({
      _id: record._id,
      label: record.label || "",
      duration: record.duration,
      type: record.type,
      username: record.userId?.username || "Unknown"
    }));

    res.render("admin", { users, records: recordsWithUsername });
  } catch (error) {
    console.error("Gagal memuat halaman admin:", error);
    res.status(500).send("Terjadi kesalahan saat memuat data admin.");
  }
});

// API routes for time records
app.get("/api/records", verifyToken, async (req, res) => {
  try {
      const filter = req.query.type;
      const query = {};
      
      // Add userId filter if available
      if (req.user && req.user.id) {
          query.userId = req.user.id;
      }
      
      if (filter === "stopwatch" || filter === "countdown") {
          query.type = filter;
      }

      const records = await TimeRecord.find(query).sort({ endTime: -1 });
      return res.json(records);
  } catch (error) {
      return res.status(500).json({ error: "Gagal mengambil data" });
  }
});

app.post("/api/records", verifyToken, async (req, res) => {
  const { type, startTime, endTime, duration } = req.body;

  try {
      const recordData = { 
          type, 
          startTime, 
          endTime, 
          duration
      };
      
      // Add userId if available
      if (req.user && req.user.id) {
          recordData.userId = req.user.id;
      }
      
      const newRecord = new TimeRecord(recordData);
      await newRecord.save();
      return res.status(201).json({ message: "Data berhasil disimpan!" });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Gagal menyimpan data" });
  }
});

app.delete("/api/records/:id", verifyToken, async (req, res) => {
try {
  const record = await TimeRecord.findById(req.params.id);
  if (!record) return res.status(404).json({ success: false, error: "Record not found" });

  if (record.userId && req.user?.id && record.userId.toString() !== req.user.id) {
    return res.status(403).json({ success: false, error: "Not authorized" });
  }

  await TimeRecord.findByIdAndDelete(req.params.id);
  return res.json({ success: true });
} catch (error) {
  return res.status(500).json({ success: false, error: "Gagal menghapus data" });
}
});

router.post("/admin/record/delete/:id", verifyToken, authorizeRoles("admin"), async (req, res) => {
  const recordId = req.params.id;
  try {
      await Record.findByIdAndDelete(recordId);
      res.redirect("/admin-page");
  } catch (error) {
      console.error("Gagal menghapus record:", error);
      res.status(500).send("Terjadi kesalahan saat menghapus data.");
  }
});

// Admin Record Routes (Web)
app.post("/admin/record/label/:id", verifyToken, authorizeRoles("admin"), async (req, res) => {
    try {
      await Record.findByIdAndUpdate(req.params.id, {
        label: req.body.label,
      });
      res.redirect("/admin-page");
    } catch (err) {
      console.error("Gagal update label:", err);
      res.status(500).send("Gagal mengupdate label.");
    }
  });

  app.post("/admin/record/delete/:id", verifyToken, authorizeRoles("admin"), async (req, res) => {
    try {
      await Record.findByIdAndDelete(req.params.id);
      res.redirect("/admin-page");
    } catch (error) {
      console.error("Gagal menghapus record:", error);
      res.status(500).send("Terjadi kesalahan saat menghapus data.");
    }
  });

  // Admin User Routes (Web)
app.post("/admin/user/update/:id", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.params.id;

    await User.findByIdAndUpdate(userId, { role });

    res.redirect("/admin-page");
  } catch (error) {
    console.error("Gagal update role:", error);
    res.status(500).send("Gagal memperbarui role user.");
  }
});  

  app.post("/admin/user/delete/:id", verifyToken, authorizeRoles("admin"), async (req, res) => {
    try {
        if (req.user.id === req.params.id) {
            return res.status(403).send("Admin tidak bisa menghapus dirinya sendiri.");
          }          
      await User.findByIdAndDelete(req.params.id);
      res.redirect("/admin-page");
    } catch (error) {
      console.error("Gagal hapus user:", error);
      res.status(500).send("Gagal menghapus user.");
    }
  });

app.post('/admin/user/update-username/:id', async (req, res) => {
  const { id } = req.params;
  const { username } = req.body;

  try {
    await User.findByIdAndUpdate(id, { username });
    res.redirect('/admin-page');
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal mengupdate username');
  }
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// run: nodemon src/index.js