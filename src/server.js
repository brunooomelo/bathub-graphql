import express from 'express'
import cors from 'cors'
import { graphqlHTTP } from 'express-graphql'
import { makeExecutableSchema } from '@graphql-tools/schema'
import schema from './modules/buildTypeDefs'
import resolvers from './modules/buildResolver'
import connectDatabase from './config/database'

const app = express()

app.use(express.json())
app.use(cors())
app.use(
  '/graphql',
  graphqlHTTP({
    schema: makeExecutableSchema({
      typeDefs: schema,
      resolvers
    }),
    graphiql: true
  })
)

connectDatabase()
  .then(() => app.listen(3333))
  .then(() => console.log(`server listening`))
