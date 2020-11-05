import User from '../../database/models/users'

export default {
  Query :{
    getUser: () => ({
      username: 'String',
      email: 'String',
      password: 'String'
    })
  },
  Mutation: {
    createUser: async (_, { data }) => {
      const duplicate = await User.findOne({
        $or: [{
          email: data.email
        }, {
          username: data.username
        }]
      }).lean()


      // review default error
      if (duplicate) {
        return null
      }
      
      const response = await User.create(data)
      return response
    }
  }
}