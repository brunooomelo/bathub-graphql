import User from '../../models/users'
import mail from '../../services/mail'
import crypto from 'crypto'

export default {
  Query :{
    getUsers: async () => User.find().lean(),
    getUser: async (_, { id }) => User.findOne({ _id: id }).lean()
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
    },
    activeUser: async (_, { id }) => {
      const response = await User.updateOne({ _id: id }, { isActive: true })
      return response
    },
    disableUser: async (_, { id }) => {
      const response = await User.updateOne({ _id: id }, { isActive: false })
      return response
    },
    forgotPassword: async (_, { credentials }) => {
      const user = await User.findOne({
        $or: [{
          email: credentials
        }, {
          username: credentials
        }]
      }).select('+passwordResetToken +passwordResetExpires')

      if (!user) {
        return false
      }

      const token = crypto.randomBytes(20).toString('hex')
      const now = new Date()
      now.setHours(now.getHours() + 1)

      user.passwordResetToken = token
      user.passwordResetExpires = now

      await user.save()

      await mail.send()

      return true
    },
    resetPassword: async (_, { data }) => {
      const user = await User.findOne({
        passwordResetToken: data.token
      }).select('+passwordResetToken +passwordResetExpires')

      const now = new Date()

      if (now > user.passwordResetExpires) {
        return false
      }

      user.password = data.password
      user.passwordResetExpires = undefined
      user.passwordResetToken = undefined

      await user.save()

      return true
    }
  }
}
