// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for casts
const Cast = require('../models/cast')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { cast: { title: '', text: 'foo' } } -> { cast: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /casts
router.get('/casts', requireToken, (req, res, next) => {
  Cast.find()
    .then(casts => {
      // `casts` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return casts.map(cast => cast.toObject())
    })
    // respond with status 200 and JSON of the casts
    .then(casts => res.status(200).json({ casts: casts }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW
// GET /casts/5a7db6c74d55bc51bdf39793
router.get('/casts/:id', requireToken, (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  Cast.findById(req.params.id)
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "cast" JSON
    .then(cast => res.status(200).json({ cast: cast.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// CREATE
// POST /casts
router.post('/casts', requireToken, (req, res, next) => {
  // set owner of new cast to be current user
  req.body.cast.owner = req.user.id

  Cast.create(req.body.cast)
    // respond to succesful `create` with status 201 and JSON of new "cast"
    .then(cast => {
      res.status(201).json({ cast: cast.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next)
})

// UPDATE
// PATCH /casts/5a7db6c74d55bc51bdf39793
router.patch('/casts/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.cast.owner

  Cast.findById(req.params.id)
    .then(handle404)
    .then(cast => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, cast)

      // pass the result of Mongoose's `.update` to the next `.then`
      return cast.updateOne(req.body.cast)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
// DELETE /casts/5a7db6c74d55bc51bdf39793
router.delete('/casts/:id', requireToken, (req, res, next) => {
  Cast.findById(req.params.id)
    .then(handle404)
    .then(cast => {
      // throw an error if current user doesn't own `cast`
      requireOwnership(req, cast)
      // delete the cast ONLY IF the above didn't throw
      cast.deleteOne()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
