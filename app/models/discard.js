const mongoose = require('mongoose')

const discardSchema = new mongoose.Schema({
  target: {
    // Targets player by email; this is the player discarding the card
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  source: {
    // Card the discard is sourced from
    type: Number,
    required: true,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  discarded: {
    // Numbers of cards discarded
    type: [Number],
    required: true
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

module.exports = mongoose.model('Discard', discardSchema)
