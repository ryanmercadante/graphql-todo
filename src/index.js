const Hapi = require('hapi')
const { ApolloServer } = require('apollo-server-hapi')
const Joi = require('joi')
const Boom = require('boom')
require('./config')
const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')

const port = process.env.PORT || 3000
const app = new Hapi.Server({
  port
})

app.route({
  method: 'GET',
  path: '/',
  handler: async (request, h) => {
    return `
      <h1>Welcome to the server!</h1>
      <p>If you'd like to query data, you can do so at localhost:3000/graphql</p>
    `
  }
})

app.route({
  method: 'POST',
  path: '/todos',
  options: {
    validate: {
      payload: {
        task: Joi.string().required(),
        completed: Joi.boolean().required()
      },
      failAction: (request, h, error) => {
        return error.isJoi 
          ? h.response(error.details[0]).takeover() 
          : h.response(error).takeover()
      }
    }
  },
  handler: async (request, h) => {
    try {
      var todo = new TodoModel(request.payload)
      var result = await todo.save()
      console.log(result)
      return h.response(result)
    } catch (err) {
      return Boom.badImplementation('Bad implementation!', err)
    }
  }
})

app.route({
  method: 'GET',
  path: '/todos',
  handler: async (request, h) => {
    try {
      var todos = await TodoModel.find({}).exec()
      return h.response(todos)
    } catch (err) {
      return h.response(err).code(500)
    }
  }
})

app.route({
  method: 'GET',
  path: '/todos/{id}',
  handler: async (request, h) => {
    try {
      var todo = await TodoModel.findById(request.params.id).exec()
      return h.response(todo)
    } catch (err) {
      return h.response(err).code(500)
    }
  }
})

app.route({
  method: 'PUT',
  path: '/todos/{id}',
  options: {
    validate: {
      payload: {
        task: Joi.string().optional(),
        completed: Joi.boolean().optional()
      },
      failAction: (request, h, error) => {
        return error.isJoi 
          ? h.response(error.details[0]).takeover() 
          : h.response(error).takeover()
      }
    }
  },
  handler: async (request, h) => {
    try {
      var result = await TodoModel.findByIdAndUpdate(request.params.id, request.payload, { new: true })
      return h.response(result)
    } catch (err) {
      return h.response(err).code(500)
    }
  }
})

app.route({
  method: 'DELETE',
  path: '/todos/{id}',
  handler: async (request, h) => {
    try {
      var result = await TodoModel.findByIdAndDelete(request.params.id)
      return h.response(result)
    } catch (err) {
      return h.response(err).code(500)
    }
  }
})

const init = async () => {
  const server = new ApolloServer({
    typeDefs, 
    resolvers
  })
  await server.applyMiddleware({ app: app })
  await app.start()
  console.log(`🚀 Server running at http://localhost:${port}${server.graphqlPath}`)
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

init().catch(err => console.log(err)) 