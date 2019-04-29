const { gql } = require('apollo-server-hapi')

const typeDefs = gql`
  type Query {
    todos: [Todo]
    todo(id: ID!): Todo
  }

  type Todo {
    id: ID,
    task: String,
    completed: Boolean
  }
`;

module.exports = typeDefs