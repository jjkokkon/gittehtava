'use strict'

// Asenna ensin mysql driver 
// npm install mysql --save

var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // HUOM! Älä käytä root:n tunnusta tuotantokoneella!!!!
  password: '',
  port: 3308, // Muuta portti samaksi kuin oman SQL-tietokantasi portti
  database: 'asiakas'
});

module.exports = {

  // Asiakastyyppien haku
  fetchTypes: function (req, res) {
    connection.query('SELECT Avain, Lyhenne, Selite FROM Asiakastyyppi', function (error, results, fields) {
      if (error) {
        console.log("Virhe haettaessa dataa Asiakas-taulusta, syy: " + error);
        res.send({
          "status": 500,
          "error": error,
          "response": null
        });
      } else {
        //      console.log("Data = " + JSON.stringify(results));
        res.json(results);
      }
    });

  },

  // Haetaan kaikki asiakkaat, tai hakuehtoja käyttäen
  fetchAll: function (req, res) {
    console.log("Hakuehdot: " + JSON.stringify(req.query)); // tulostaa hakuparametrit noden konsoliin

    let haku = "SELECT Avain, Nimi, Osoite, Postinro, Postitmp, DATE_FORMAT(Luontipvm, '%d.%m.%Y') as Luontipvm, asty_avain FROM Asiakas WHERE 1=1";

    if (req.query.Nimi != undefined)
      haku += " AND Nimi LIKE '" + req.query.Nimi + "%'";
    if (req.query.Osoite != undefined)
      haku += " AND Osoite LIKE '" + req.query.Osoite + "%'";
    if (req.query.asty_avain != undefined)
      haku += " AND asty_avain =" + req.query.asty_avain;

    //  console.log(haku);  // tulostaa lopullisen hakulauseen noden konsoliin

    connection.query(haku, function (error, results, fields) {
      if (error) {
        console.log("Virhe haettaessa dataa Asiakas-taulusta, syy: " + error);
        res.send(JSON.stringify({
          "status": 500,
          "error": error,
          "response": null
        }));
      } else {
        res.statusCode = 200;
        res.send(results);
      }
    });
  },


  // asiakkaan lisäys
  create: function (req, res) {
    let c = req.body;
    let lisays = "INSERT INTO asiakas(NIMI, OSOITE, POSTINRO, POSTITMP, LUONTIPVM, ASTY_AVAIN) VALUES ('" + c.nimi + "', '" + c.osoite +
      "', '" + c.postinro + "', '" + c.postitmp + "', " + "CURDATE(), '" + c.asty_avain + "')";

    // tyhjien kenttien tarkastus
    if (!c.nimi || !c.osoite || !c.postinro || !c.postitmp || !c.asty_avain) {
      // jos tyhjiä kenttiä lähetetty, lähettää serveri virheviestin front-endille
      return res.status(400).json({
        Virhe: "Kaikki kentät ovat pakollisia! Tämä viesti tuli back-endiltä."
      });

    } else {
      connection.query(lisays, (error, results, fields) => {
        if (error) {
          console.log(error.sqlMessage);
          throw error;
        } else {
          res.send(results);
        }
      });
      console.log("Lisättiin dataa: " + JSON.stringify(req.body));
    }
  },

  // Asiakkaan poistaminen
  delete: function (req, res) {
    let query = 'DELETE FROM asiakas WHERE avain=' + req.params.Avain;

    connection.query(query, function (error, results, fields) {
      if (error) {
        console.log("Error removing data from db, reason: " + error);
        res.statusCode = 500;
        res.send({
          code: "Virhe asiakasta poistaessa.",
          error_msg: error,
          data: ""
        });
      } else {
        console.log("Poistettu asiakas avaimella " + JSON.stringify(req.params.Avain)); 
        console.log("Data = " + JSON.stringify(results)); // Tulostaa deleten oletusrivit (näkyy postman-kuvassa).
        // console.log("Poistetut rivit: " + results.affectedRows );  // Tässä esimerkki kustomoidusta palautusviestistä.
        res.statusCode = 200;
        res.send(results);
      }
    });
  },

   // Asiakkaan tietojen päivittäminen
   update: function (req, res) {
    // Tämä ominaisuus on seuraavan paketin tehtävässä.
  },
}

