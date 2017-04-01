let express       = require('express')
let bodyParser    = require('body-parser')
let mongoose      = require('mongoose')
let keys		  = require('./config/keys.js')

let app           = express();

///////////////////////////////////////////////////////////////

let port = 3000
let db_uri = keys.db_uri
let db_status

app.set('port', port)
app.use(bodyParser.json({limit: '20mb'}))
app.use(bodyParser.urlencoded({ extended: false }))

require('./router.js')(app)
let meow = require('./app.js')
meow.start()

///////////////////////////////////////////////////////////////

app.listen(port, function() {
	mongoose.Promise = global.Promise
    mongoose.connect(db_uri, (err) => {
        err ? db_status = "errored" : db_status = "connected"
        console.log(port, db_uri, db_status)
    })
})