const mongoose = require('mongoose')

const destroySchema = new mongoose.Schema({
  target: {
    // Targets card by number: this is the card destroyed
    type: Number,
    required: true,
    owner: {
      // Owner of targeted card
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  source: {
    // Card the destroy is sourced from
    type: Number,
    required: true,
    owner: {
      // Owner of source card
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

module.exports = mongoose.model('Destroy', destroySchema)
