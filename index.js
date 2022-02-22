const express = require('express')
const cors = require('cors')
const fs = require('fs')

const app = express()

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


let notes = JSON.parse(fs.readFileSync('db.json'))


app.get('/hi/:name', (request, response) => {
    const name = request.params.name
    console.log(`Greeting ${name}`)
    response.send(`<h1>Hello ${name}</h1>`)
})

app.get('/api/notes', (request, response) => {
    response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)
    if (note) {
        response.json(note)

    } else {
        response.statusMessage = 'Note ID not found'
        response.status(404).end()
    }
})

app.put('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    if (notes.find(note => note.id === id)) {
        const body = request.body

        notes = notes.map(note => note.id !== id
            ? note
            : body)
        response.json(body)
        fs.writeFileSync('db.json', JSON.stringify(notes, null, 2))
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
    if (request.is('application/json')) {

        const body = request.body

        if (!body.content) {
            return response.status(400).json({
                error: 'content missing!'
            })
        }

        const note = {
            content: body.content,
            important: body.important || false,
            date: new Date(),
            id: generateId()
        }


        notes = notes.concat(note)

        console.log(notes)
        response.json(note)

        fs.writeFileSync('db.json', JSON.stringify(notes, null, 2))

    } else { response.status(400).json({ error: 'Not JSON' }) }
}
)


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})