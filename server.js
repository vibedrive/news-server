var fs = require('fs')
var path = require('path')
var http = require('http')
var https = require('https')
var express = require('express')
var helmet = require('helmet')
var cors = require('cors')
var bodyParser = require('body-parser')
var request = require('request-promise-native')

const PORT = 5823

var app = express()

app.use(helmet())
app.use(cors())
app.use(bodyParser.json({ limit: '50mb' }))
app.post('/stream', async function (req, res) => {
  var sources = req.body.sources
        
  res.send()
  
         
})

http.createServer(app).listen(PORT)

console.log('Listening on port', PORT)

function fetchFeeds () {
  var jobs = state.sources.map(fetchingJob)

  parallel(jobs, function () {
    state.entries.sort(sortByDate)
    state.fetching = false

    emitter.emit('render')
  })
}

  function fetchingJob (source) {
    return function (done) {
      try {
        var url = new URL(source)
        parser.parseURL(url.href, function (err, parsed) {
          if (err) return console.error(err)
          parsed.feed.entries.forEach(entry => {
            entry.date = new Date(entry.isoDate)
            state.entries.push(entry)
          })

          done()
        })
      } catch (err) {
        console.info(err)
      }
    }
  }
})

function sortByDate (a, b) {
  if (a.date > b.date) return -1
  if (a.date < b.date) return 1
  return 0
}
