require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pg = require("pg");

const app = express();
app.use(cors());
const PORT = 5000;

const { Pool } = pg;
const pool = new Pool({
  host: "127.0.0.1",
  port: 5432,
  user: "notes_app",
  database: "notes_practice",
  password: process.env.DB_PASSWORD,
});

// async function testConnection() {
//   try {
//     const result = await pool.query("SELECT NOW()");
//     console.log(result.rows);
//   } catch (error) {
//     console.error(error);
//   }
// }
// testConnection();

// TEST Connection
// pool
//   .query("SELECT NOW()")
//   .then((result) => {
//     console.log(result.rows);
//   })
//   .catch((error) => console.error(error));

app.use(express.json());

app.get("/api/notes", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM notes");
    console.log(result.rows);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

app.post("/api/notes", async (req, res) => {
  const note = req.body.note;
  try {
    await pool.query("INSERT INTO notes (note) VALUES ($1)", [note]);
    res.status(201).json({ message: "Note saved." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failt to save the note" });
  }
});

app.delete("/api/notes/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ message: "Invalid id." });
    return;
  }
  try {
    const result = await pool.query("DELETE FROM notes WHERE id=$1", [id]);
    if (result.rowCount === 0) {
      res.status(404).json({ message: "Cannot find note." });
      return;
    }
    res.status(200).json({ message: "Note Deleted." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failt to delete the note" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
