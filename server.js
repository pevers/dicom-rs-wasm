var express = require('express')
var cors = require('cors')
var app = express()

app.use(express.static('public'), cors())

app.listen(8081, function () {
  console.log('CORS-enabled web server listening on port 80')
})