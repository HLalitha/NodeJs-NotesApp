// // At the very top of your updateUserReferences.js file
// require('dotenv').config(); // This will load your .env variables

// const mongoose = require('mongoose');
// const Note = require('./server/models/Notes'); // Path to your Notes model

// // Log MongoDB URI to ensure it's loaded
// console.log('MongoDB URI:', process.env.MONGODB_URI);

// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI, { 
//   useNewUrlParser: true, 
//   useUnifiedTopology: true 
// })
//   .then(async () => {
//     const notes = await Note.find({});
//     for (let note of notes) {
//       if (typeof note.user === 'string') {
//         note.user = mongoose.Types.ObjectId(note.user); 
//         await note.save();
//         console.log(`Updated note for user: ${note.user}`);
//       } else {
//         console.log(`User field for note with title "${note.title}" is already an ObjectId.`);
//       }
//     }

//     console.log("User references updated!");
//     mongoose.disconnect(); // Disconnect after the update is done
//   })
//   .catch(error => {
//     console.error('Error:', error);
//     mongoose.disconnect(); // Disconnect on error as well
//   });
