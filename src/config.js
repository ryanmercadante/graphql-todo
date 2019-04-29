const Mongoose = require('mongoose')
const mongoDB = 'mongodb://test:test123@ds147746.mlab.com:47746/todos-api'

Mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
})

const db = Mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

