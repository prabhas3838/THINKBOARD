import express from "express";
import {
  createnote,
  getallnotes,
  updatenote,
  deletenote,
  getnotebyid,
  togglepinnote,
} from "../controller/notescontroller.js";
import { protectRoute } from "../middlewere/auth.js";

const router = express.Router();

// All notes routes are protected and require a valid user token
router.use(protectRoute);

// GET → fetch notes (supports ?search=...&tag=...)
router.get("/", getallnotes);

// GET → fetch single note
router.get("/:id", getnotebyid);

// POST → create note
router.post("/", createnote);

// PUT → update note
router.put("/:id", updatenote);

// DELETE → delete note
router.delete("/:id", deletenote);

// PATCH → toggle pin
router.patch("/:id/pin", togglepinnote);

export default router;
