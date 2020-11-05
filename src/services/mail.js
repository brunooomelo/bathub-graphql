import e from "express"

export default {
  send: () => {
    return new Promise((resolve) => {
      setTimeout(resolve, 3000)
    })
  }
}
