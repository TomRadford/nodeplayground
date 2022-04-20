const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({})
  response.json(notes)
})

notesRouter.get('/:id', async (request, response ) => {
  const note = await Note.findById(request.params.id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }


  // Note.findById(request.params.id)
  //   .then(note => {
  //     if (note) {
  //       response.json(note)
  //     } else {
  //       response.status(404).end()
  //     }
  //   })
  //   .catch(error => { next(error) })
})

notesRouter.put('/:id',  (request, response, next) => {
  const { content, important } = request.body

  Note.findByIdAndUpdate(
    request.params.id,
    { content, important },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndRemove(request.params.id)
  response.status(204).end()
  // Note.findByIdAndRemove(request.params.id)
  //   .then(result => {
  //     response.status(204).end()
  //   })
  //   .catch(error => {
  //     next(error)
  //   })

})

notesRouter.post('/', async (request, response) => {

  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  const savedNote = await note.save()
  response.status(201).json(savedNote)
})


// if (request.body === undefined) {
//   return response.status(400).json({
//     error: 'content missing'
//   })
// }

// if (request.is('application/json')) {



//   if (!body.content) {
//     return response.status(400).json({
//       error: 'content missing!'
//     })
//   }

// const note = new Note({
//   content: body.content,
//   important: body.important || false,
//   date: new Date(),
// })

//   note.save().then(savedNote => {
//     response.status(201).json(savedNote)
//   })
//     .catch(error => next(error))

// } else { response.status(400).json({ error: 'Not JSON' }) }


module.exports = notesRouter