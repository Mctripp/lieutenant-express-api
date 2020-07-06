const mongoose = require('mongoose')

const exileSchema = new mongoose.Schema({
  target: {
    // Targets card by number: this is the card exiled
    type: Number,
    required: true,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  source: {
    // Card the exile is sourced from
    type: Number,
    required: true,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  game: {
    // Which game this action happened in
    type: Number,
    required: true,
    turn: {
      // Which turn of the game this happened in
      type: Number,
      required: true,
      action: {
        // Which action this was during the turn
        type: Number,
        required: true
      }
    }
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Exile', exileSchema)
