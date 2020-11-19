import express from 'express'
import cors from 'cors'
import { graphqlHTTP } from 'express-graphql'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { graphqlUploadExpress } from 'graphql-upload'
import schema from './modules/buildTypeDefs'
import resolvers from './modules/buildResolver'
import connectDatabase from './config/database'

import { MegaToBytes } from './utils'
const app = express()

app.use(express.json())
app.use(cors())
app.use(
  '/graphql',
  graphqlUploadExpress({ maxFileSize: MegaToBytes(10), maxFiles: 3 }),
  graphqlHTTP({
    schema: makeExecutableSchema({
      typeDefs: schema,
      resolvers
    }),
    graphiql: true
  })
)

connectDatabase()
  .then(() => app.listen(process.env.PORT))
  .then(() => console.log(`server listening on PORT ${process.env.PORT}`))
