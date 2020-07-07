// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for draws
const Draw = require('../models/draw')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { draw: { title: '', text: 'foo' } } -> { draw: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /draws
router.get('/draws', requireToken, (req, res, next) => {
  Draw.find()
    .then(draws => {
      // `draws` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return draws.map(draw => draw.toObject())
    })
    // respond with status 200 and JSON of the draws
    .then(draws => res.status(200).json({ draws: draws }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW
// GET /draws/5a7db6c74d55bc51bdf39793
router.get('/draws/:id', requireToken, (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  Draw.findById(req.params.id)
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "draw" JSON
    .then(draw => res.status(200).json({ draw: draw.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// CREATE
// POST /draws
router.post('/draws', requireToken, (req, res, next) => {
  // set owner of new draw to be current user
  req.body.draw.owner = req.user.id

  Draw.create(req.body.draw)
    // respond to succesful `create` with status 201 and JSON of new "draw"
    .then(draw => {
      res.status(201).json({ draw: draw.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next)
})

// UPDATE
// PATCH /draws/5a7db6c74d55bc51bdf39793
router.patch('/draws/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.draw.owner

  Draw.findById(req.params.id)
    .then(handle404)
    .then(draw => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, draw)

      // pass the result of Mongoose's `.update` to the next `.then`
      return draw.updateOne(req.body.draw)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
// DELETE /draws/5a7db6c74d55bc51bdf39793
router.delete('/draws/:id', requireToken, (req, res, next) => {
  Draw.findById(req.params.id)
    .then(handle404)
    .then(draw => {
      // throw an error if current user doesn't own `draw`
      requireOwnership(req, draw)
      // delete the draw ONLY IF the above didn't throw
      draw.deleteOne()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
