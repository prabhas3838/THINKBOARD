// src/controller/notescontroller.js
// src/controller/notescontroller.js
// backend/config/controller/notescontroller.js

// src/controller/notescontroller.js (top)
import Note from "../config/models/note.js";








export async function getnotebyid(req,res){
  try {
    
    const s=await Note.findById(req.params.id)
    if(!s) return res.status(404).json({ message: "note id not found" });
    res.status(200).json(s)
  } catch (error) {

    console.log("error in getnotebyid note controller", error);
    res.status(500).json({ message: "internal server error" });
    
  }
}

export async function getallnotes(req, res) {
  try {
    const notesList = await Note.find().sort({createdAt:-1});
    res.status(200).json(notesList);
  } catch (error) {
    console.log("error in getting allnotes controller", error);
    res.status(500).json({ message: "internal server error" });
  }
}

export async function createnote(req, res) {
  try {
    const { title, content } = req.body;
    const newnote = new Note({ title: title, content: content });
    const saved = await newnote.save();
    res.status(201).json(saved);
  } catch (error) {
    console.log("error in creating note controller", error);
    res.status(500).json({ message: "internal server error" });
  }
}

export async function updatenote(req, res) {
  try {
    const { title, content } = req.body;
    const updatednote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );
    if (!updatednote) return res.status(404).json({ message: "note id not found" });
    res.status(200).json(updatednote);
  } catch (error) {
    console.log("error in updating note controller", error);
    res.status(500).json({ message: "internal server error" });
  }
}

export async function deletenote(req, res) {
  try {
    const deletednote = await Note.findByIdAndDelete(req.params.id);   // FIXED
    if (!deletednote) return res.status(404).json({ message: "note id not found" });
    res.status(200).json(deletednote);
  } catch (error) {
    console.log("error in deleted note controller", error);
    res.status(500).json({ message: "internal server error" });
  }
}


