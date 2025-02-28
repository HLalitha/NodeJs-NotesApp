

const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    title: String,
    body: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User model
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }

});

const Note = mongoose.model('Note', NoteSchema);
module.exports = Note;
