const express = require('express')
const app = express()

const PORT = 9000
const PUBLIC = 'dist'

app.use(express.static(PUBLIC))

app.listen(PORT, function () {
  console.log(`Covid server started on ${PORT}`)
})