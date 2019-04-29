const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

const Todo = new Schema({
  task: {
    type: String,
    unique: true,
    required: true
  },
  completed: {
    type: Boolean,
    required: true
  }
})

module.exports = Mongoose.model('Todo', Todo)