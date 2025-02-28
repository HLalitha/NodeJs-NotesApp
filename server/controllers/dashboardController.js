const Note = require('../models/Notes');
const mongoose = require('mongoose');

/**
 * Get /dashboard
 * Display all notes with pagination
 */
exports.dashboard = async (req, res) => {
    const locals = {
        title: "Dashboard",
        description: 'Free NodeJs Notes App.'
    };

    let notes = [];
    let currentPage = Number(req.query.page) || 1;  // Get current page from query parameter
    const notesPerPage = 12;  // Number of notes to display per page
    let totalNotes = 0;

    try {
        totalNotes = await Note.countDocuments({});  // Get total number of notes
        const totalPages = Math.ceil(totalNotes / notesPerPage);  // Calculate total pages

        // Get notes for the current page
        notes = await Note.find({})
            .skip((currentPage - 1) * notesPerPage)  
            .limit(notesPerPage)
            .sort({ updatedAt: -1 });

         res.render('dashboard/index', {
            userName: req.user.firstName,
            locals,
            notes: notes,
            current: currentPage,  
            pages: totalPages,  
            layouts: '../views/layouts/dashboard'
        });
    } catch (error) {
        console.error(error); 
        notes = [];
        res.render('dashboard/index', {
            userName: req.user.firstName,
            locals,
            notes: notes,
            current: currentPage, 
            pages: 1,  
            layouts: '../views/layouts/dashboard'
        });
    }
};



exports.dashboardViewNote = async (req, res) => {
  try {
  
    const note = await Note.findOne({ 
      _id: req.params.id,
      user: req.user.id 
    }).lean();

    if (note) {
      res.render("dashboard/view-note", {
        noteID: req.params.id,
        note,
        layout: "../views/layouts/dashboard",
      });
    } else {
      console.log("Note not found or access denied.");
      res.send("Note not found or access denied.");
    }
  } catch (error) {
    console.error(error);
    res.send("Something went wrong.");
  }
};

exports.dashboardUpdateNote = async(req,res) =>{
  
  try {
    await Note.findOneAndUpdate(
      { _id: req.params.id },
      { title: req.body.title, body: req.body.body, updatedAt: Date.now() }
    ).where({ user: req.user.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
}

/**
 * DELETE /
 * Delete Note
 */
 exports.dashboardDeleteNote = async (req, res) => {
  try {
    await Note.deleteOne({ _id: req.params.id }).where({ user: req.user.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

/**
 * GET /
 * Add Notes
 */
 exports.dashboardAddNote = async (req, res) => {
  res.render("dashboard/add", {
    layout: "../views/layouts/dashboard",
  });
};

exports.dashboardAddNoteSubmit = async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Note.create(req.body);
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};


exports.dashboardSearch = async (req, res) => {
  try {
    res.render("dashboard/search", {
      searchResults: "",
      layout: "../views/layouts/dashboard",
    });
  } catch (error) {}
};

/**
 * POST /
 * Search For Notes
 */
exports.dashboardSearchSubmit = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    const searchResults = await Note.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChars, "i") } },
        { body: { $regex: new RegExp(searchNoSpecialChars, "i") } },
      ],
    }).where({ user: req.user.id });

    res.render("dashboard/search", {
      searchResults,
      layout: "../views/layouts/dashboard",
    });
  } catch (error) {
    console.log(error);
  }
};


