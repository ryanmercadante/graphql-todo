const { ApolloError, ValidationError } = require('apollo-server-hapi')
const Mongoose = require('mongoose')
const TodoModel = require('../models/Todo')

const resolvers = {
  Query: {
    todos: async (root, args, context, info) => {
      try {
        const todos = await TodoModel.find({}).exec()
        return todos
      } catch (err) {
        throw new ApolloError(err)
      }
    },
    todo: async (root, { id }, context, info) => {
      try {
        if (!Mongoose.Types.ObjectId.isValid(id)) {
          throw new ValidationError(`${id} id not a valid todo ID.`)
        }
        const todo = await TodoModel.findById(id).exec()
        return todo
      } catch (err) {
        throw new ApolloError(err)
      }
    }
  }
}

module.exports = resolvers