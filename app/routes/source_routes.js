// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// // Passport docs: http://www.passportjs.org/docs/
// const passport = require('passport')

// pull in Mongoose model for sources
const Destroy = require('../models/destroy')
const Draw = require('../models/draw')
const Discard = require('../models/discard')
const Exile = require('../models/exile')

// // this is a collection of methods that help us detect situations when we need
// // to throw a custom error
// const customErrors = require('../../lib/custom_errors')
//
// // we'll use this function to send 404 when non-existant document is requested
// const handle404 = customErrors.handle404
// // we'll use this function to send 401 when a user tries to modify a resource
// // that's owned by someone else
// const requireOwnership = customErrors.requireOwnership
//
// // this is middleware that will remove blank fields from `req.body`, e.g.
// // { source: { title: '', text: 'foo' } } -> { source: { text: 'foo' } }
// const removeBlanks = require('../../lib/remove_blank_fields')
// // passing this as a second argument to `router.<verb>` will make it
// // so that a token MUST be passed for that route to be available
// // it will also set `req.user`
// const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX - destroy
// GET destroy sources
router.get('/card/:id/sources/destroy', (req, res, next) => {
  Destroy.find({ source: req.params.id })
    .then(sources => {
      // `sources` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return sources.map(source => source.toObject())
    })
    // respond with status 200 and JSON of the sources
    .then(sources => res.status(200).json({ sources: sources }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// INDEX - exile
// GET exile sources
router.get('/card/:id/sources/exile', (req, res, next) => {
  Exile.find({ source: req.params.id })
    .then(sources => {
      // `sources` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return sources.map(source => source.toObject())
    })
    // respond with status 200 and JSON of the sources
    .then(sources => res.status(200).json({ sources: sources }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// INDEX - draw
// GET draw sources
router.get('/card/:id/sources/draw', (req, res, next) => {
  Draw.find({ source: req.params.id })
    .then(sources => {
      // `sources` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return sources.map(source => source.toObject())
    })
    // respond with status 200 and JSON of the sources
    .then(sources => res.status(200).json({ sources: sources }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// INDEX - discard
// GET discard sources
router.get('/card/:id/sources/discard', (req, res, next) => {
  Discard.find({ source: req.params.id })
    .then(sources => {
      // `sources` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return sources.map(source => source.toObject())
    })
    // respond with status 200 and JSON of the sources
    .then(sources => res.status(200).json({ sources: sources }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
