import mongoose from 'mongoose'

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 5
}

mongoose.connection.on('connected', () => {
  console.log('database is online')
})
mongoose.connection.on('reconnected', () => {
  console.log('server reconnect to the database')
})
mongoose.connection.on('error', err => {
  console.log(`database error :: ${err.message}`)
})


const connectDatabase = () => mongoose.connect(`mongodb://localhost:27017/bibat`,options)

export default connectDatabase