const mongoose = require('mongoose');

const DB_URI = "mongodb+srv://niharsandhu25:LzgAAv9pk6UsBpYB@cluster0.tdiwi4h.mongodb.net/"; // replace with your DB

mongoose.connect(DB_URI)
  .then(async () => {
    console.log("Connected to MongoDB");
    await mongoose.connection.dropDatabase();
    console.log("Database dropped successfully!");
    process.exit(0);
  })
  .catch(err => {
    console.error("Error:", err);
    process.exit(1);
  });
