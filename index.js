require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()

const Note = require('./models/note')
const { json } = require('express/lib/response')

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })

}

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')

    next()
}

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    
    if (error.name === 'CastError') {
        return response.status(400).send({
            error: 'malformatted id'
        })
    }

    next(error)
}

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(requestLogger)



app.get('/hi/:name', (request, response) => {
    const name = request.params.name
    console.log(`Greeting ${name}`)
    response.send(`<h1>Hello ${name}</h1>`)
})

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})

app.get('/api/notes/:id', (request, response, next) => {
    Note.findById(request.params.id)
    .then(note => {
        if (note) {
            response.json(note)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => {next(error)
    })
})

app.put('/api/notes/:id', (request, response, next) => {
  const body = request.body

  const note = {
      content: body.content,
      important: body.important
  }

  Note.findByIdAndUpdate(request.params.id, note, {new: true})
  .then(updatedNote => {
      response.json(updatedNote)
  })
  .catch(error => next(error))
})

app.delete('/api/notes/:id', (request, response, next) => {
    Note.findByIdAndRemove(request.params.id) 
    .then(result => {
        response.status(204).end()
    })
    .catch(error => {next(error)
    })


})

const generateId = () => {
    maxId = notes.length > 0
        ? Math.max(...notes.map(note => note.id))
        : 0
    return maxId + 1
}

app.post('/api/notes', (request, response) => {
    const body = request.body
    
    if (request.body === undefined) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    if (request.is('application/json')) {

        

        if (!body.content) {
            return response.status(400).json({
                error: 'content missing!'
            })
        }

        const note = new Note({
            content: body.content,
            important: body.important || false,
            date: new Date(),
        })

        note.save().then(savedNote => {
            response.json(savedNote)
        })

        // fs.writeFileSync('db.json', JSON.stringify(notes, null, 2))

    } else { response.status(400).json({ error: 'Not JSON' }) }
}
)

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})