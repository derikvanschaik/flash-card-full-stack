const mongoose = require('mongoose');

const flashCardDeckSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  flashCards: [
    {question: String, answer: String, index: Number}
  ],
  createDate: Date
});

module.exports = mongoose.model('FlashCardDeck', flashCardDeckSchema);