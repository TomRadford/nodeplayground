const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument')
  process.exit()
}

const password = process.argv[2]

const url =
 `mongodb+srv://fullstack:${password}@fullstack.qrmkt.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean
})

const Note = mongoose.model('Note', noteSchema)

Note.find().then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})


//  const note = new Note({
//      content: 'New note',
//      date: new Date,
//      important: false
//  })

//  note.save().then(result => {
//      console.log('note saved')
//      console.log(result._id)
//      mongoose.connection.close()
//  })