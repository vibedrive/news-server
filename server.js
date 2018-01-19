var http = require('http')
var express = require('express')
var helmet = require('helmet')
var cors = require('cors')
var bodyParser = require('body-parser')
var parallel = require('run-parallel')
var parser = require('rss-parser')
var url = require('url')

const PORT = 5823

var app = express()

app.use(helmet())
app.use(cors())
app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.status(200).end('cool')
})

app.post('/entries', async function (req, res) {
  var sources = req.body.sources

  fetchFeeds(sources, function (feeds) {
    res.send(feeds)
  })
})

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
})

console.log('Listening on port', PORT)

function fetchFeeds (sources, callback) {
  var jobs = sources.map(fetchingJob)

  parallel(jobs, function (feeds) {
    var entries = feeds
      .reduce((a, b) => a.concat(b), [])
      .sort(sortByDate)

    callback(entries)
  })
}

function fetchingJob (source) {
  var entries = []
  return function (done) {
    try {
      var u = new url.URL(source)
    } catch (err) {
      console.info(err)
      done([])
    }

    parser.parseURL(source, function (err, parsed) {
      if (err) return console.error(err)
      console.log(source, parsed.feed.entries.length)
      parsed.feed.entries.forEach(entry => {
        entry.date = new Date(entry.isoDate)
        entries.push(entry)
      })

      done(entries)
    })
  }
}

function sortByDate (a, b) {
  if (a.date > b.date) return -1
  if (a.date < b.date) return 1
  return 0
}
