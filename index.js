let express = require('express');
let bodyParser = require('body-parser');
const db = require('./db/db.js');
var cookieParser = require('cookie-parser');
var session = require('express-session');
const Mustache = require('mustache');
let fs = require('fs');

require('dotenv').config();

const app = express();

const port = 3000

const dashboardTemplate = fs.readFileSync(`${__dirname}/dashboard.mst`, 'utf-8')

// Body Parser Middleware
app.use(bodyParser.urlencoded({extended: true})); // Set to true to allow the body to contain any type of vlue

// Set Static Path
//app.use(express.static(path.join(__dirname, 'public')))

// Setting the HTTP request methods to the functions on db
app.post('/', async (req, res) => {
    db.addSensordata(req, res)
    const {device, state, rpm, distance, mov_f, mov_s} = req.body
    
    
    
    
    
    
    
    
});

//Setting the app to listen
app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})


// Login options

app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
    key: 'user_sid',
    secret: "Secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');
    }
    next();
});


// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/dashboard');
    } else {
        next();
    }
};



app.get('/', sessionChecker, (req, res) => {
    res.redirect('/login');
});



app.route('/login')
    .get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/login.html');
    })
    .post((req, res) => {
        var username = req.body.username,
            password = req.body.password;

        if (username === process.env.WEB_USERNAME && (password === "")) {
        	req.session.user = username;
        	res.redirect('/dashboard');
        } 
        else {
        	res.redirect('/login');
        }
    });

app.get('/dashboard', async (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        try {
            //res.sendFile(__dirname + '/dashboard.html'); 
           let viewParams = {
                sensordata: []
            }
            viewParams.sensordata.push({
                published_at: "test",
                state: "test",
                rpm: "test",
                distance: "test",
                mov_f: "test",
                mov_s: "test",
                device: "test"
                });
            res.send(Mustache.render(dashboardTemplate, viewParams));
        }
        catch(err) {
            console.log(err);
            res.status(500).send();
        }
    } 
    else {
        res.redirect('/login');
    }
});


app.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/');
    } 
    else {
        res.redirect('/login');
    }
});

