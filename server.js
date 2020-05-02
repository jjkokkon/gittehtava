// Asenna ensin express npm install express --save

var express = require('express');
var cookieParser = require('cookie-parser');
var fs = require("fs");

var app = express();

var bodyParser = require('body-parser');
var customerController = require('./customerController');

const hostname = '127.0.0.1';
const port = process.env.PORT || 3002;


//CORS middleware
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}
app.use(allowCrossDomain);
app.use(cookieParser());

let aika = new Date();

let kayttajat = {
    Nimi: "Testikayttaja",
    Aikaleima: aika.toLocaleString(),
    sessionId: 1234
}

//Reitti keksin lisäykseen 
app.get('/setuser', (req, res) => {

    res.cookie("TestiKeksi", kayttajat, {
        maxAge: 1200000 // Keksin aikaraja 20 minuuttia (arvo millisekunteina)
    });
    res.send('Lisätty keksi');
});

//Haetaan kaikki keksit 
app.get('/getuser', (req, res) => {
    res.send(req.cookies);
});

//Reitti keksin poistoon 
app.get('/logout', (req, res) => {
    res.clearCookie('TestiKeksi');
    res.send('Kirjauduttu ulos ja keksi poistettu');
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


// Staattiset filut
app.use(express.static(__dirname + '/'));


// REST API Asiakas
// Asiakastyyppien haku
app.route('/Types')
    .get(customerController.fetchTypes);

// Asiakkaiden haku (.get) ja asiakkaan lisäys (.post)
app.route('/Asiakas')
    .get(customerController.fetchAll)
    .post(customerController.create);

// Asiakkaiden päivitys (.put) ja asiakkaiden poisto (.delete)
app.route('/Asiakas/:Avain')
    .put(customerController.update)
    .delete(customerController.delete);
//

app.get('/', function (request, response) {

    let username = request.cookies['TestiKeksi'];
    

    // jos keksiä ei ole luotu, tai keksin sessionId ei ole 1234, palautetaan serverin alkusivu
    if (!username || username.sessionId !== 1234) {
        console.log("Keksiä ei löytynyt, tai keksillä on väärä sessionId. Ohjataan alkusivulle.");

        fs.readFile("UI/login.html", function (err, data) {
            response.writeHead(200, {
                'Content-Type': 'text/html'
            });
            response.write(data);
            response.end();
        });
        // jos keksi löytyy ja keksin sessionId on 1234, palautetaan käyttöliittymä
    } else if (username && username.sessionId === 1234) {
        console.log("Keksi löytyi ja keksin sessionId = 1234. Ohjataan käyttöliittymään.");
        fs.readFile("UI/tehtävät50-54.html", function (err, data) {
            response.writeHead(200, {
                'Content-Type': 'text/html'
            });
            response.write(data);
            response.end();
        });
    }
});

app.listen(port, hostname, () => {
    console.log(`Server running AT http://${hostname}:${port}/`);
});