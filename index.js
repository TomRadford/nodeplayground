require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()

const Note = require('./models/note')



app.use(cors())
app.use(express.json())
app.use(express.static('build'))

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')

    next()
}

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

app.get('/api/notes/:id', (request, response) => {
    Note.findById(request.params.id).then(note => {
        response.json(note)
    })
})

app.put('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    if (notes.find(note => note.id === id)) {
        const body = request.body

        notes = notes.map(note => note.id !== id
            ? note
            : body)
        response.json(body)
        // fs.writeFileSync('db.json', JSON.stringify(notes, null, 2))
    } else {response.status(404).end()}


})

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
    console.log(notes)
    response.status(204).end()
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


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})