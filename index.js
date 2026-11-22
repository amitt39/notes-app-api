const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
const PORT = 5000;

let notes = [];

app.use(express.json());

app.get("/api/notes", (req, res) => {
  res.json(notes);
});

app.post("/api/notes", (req, res) => {
  const note = req.body.note;
  notes.push({ id: Date.now(), note });
  res.json({ message: "Note added successfully." });
});

app.delete("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  notes = notes.filter((note) => note.id !== id);
  res.json({ message: "Note deleted successufully." });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
