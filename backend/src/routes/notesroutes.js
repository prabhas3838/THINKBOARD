import express from "express";
// Note the relative path: from src/routes -> go up one level to src -> controller
import { createnote, getallnotes, updatenote, deletenote, getnotebyid } from "../controller/notescontroller.js";

const router = express.Router();

// GET → fetch notes
router.get("/", getallnotes);

router.get("/:id",getnotebyid);

// POST → create note
router.post("/", createnote);

// PUT → update note
router.put("/:id", updatenote);

// DELETE → delete note
router.delete("/:id", deletenote);

export default router;
