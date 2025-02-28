const mongoose = require('mongoose');
const Note = require('../models/Notes');  // Import your Note model

// Define your function to render the note
exports.dashboardViewNote = async (req, res) => {
  try {
    // Convert the user ID and note ID to ObjectId
    const noteId = mongoose.Types.ObjectId(req.params.id);  // Convert Note ID to ObjectId
    const userId = mongoose.Types.ObjectId(req.user.id);    // Convert User ID to ObjectId
    
    console.log('User ID:', userId);
    console.log('Note ID:', noteId);
    
    // Find the note by its ID and ensure it belongs to the logged-in user
    const note = await Note.findOne({
      _id: noteId,     // Using ObjectId for the note
      user: userId     // Using ObjectId for the user
    }).lean(); // Convert to plain JavaScript object
    
    if (note) {
      res.render("dashboard/view-note", {
        noteID: req.params.id,
        note,
        layout: "../views/layouts/dashboard",
      });
    } else {
      console.log("Note not found for the given ID and user.");
      res.status(404).send("Note not found.");
    }
  } catch (error) {
    console.error("Error in fetching note:", error);
    res.status(500).send("Something went wrong.");
  }
};
