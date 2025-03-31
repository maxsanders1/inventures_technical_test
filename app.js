/*********************************************************************************
 * This app is to generate a shortened URL based on a full URL.
 * 
 * Created: 30/03/2025
*********************************************************************************/

/*********************************************************************************
 * Libreries for the aplication
*********************************************************************************/
// Librerie for web deployment
const express = require("express");
// Librerie to generate random string
var randomstring = require("randomstring");
// Librerie to get time with timezone ref
const moment = require('moment-timezone');

/*********************************************************************************
 * DB connection 
*********************************************************************************/
const { Client } = require('pg');
const client = new Client({
	user: 'inventures',
  password: 'entrevista',
	host: '127.0.0.1',
	database: 'url'
});

client.connect()
	.then(() => {console.log('Connected to PostgreSQL database');
	})
	.catch((err) => {console.error('Error connecting to PostgreSQL database', err);
	});


/*********************************************************************************
 * Middlewares
*********************************************************************************/
const app = express();
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false}))



/*********************************************************************************
 * This ENDPOINT it's the main page for deployment
 * 
 * Input ---> N/A
 * Output ---> Redirect to the main page
*********************************************************************************/

app.get('/', (req, res) => {
  // Select sentence for get all data
  client.query("SELECT * FROM urls", (err, result) => {
    if (err) {
      console.error('Error executing query', err);
    } else {
      res.render('index', {result : result})
    }
  });
})

/*********************************************************************************
 * This ENDPOINT it's for do the INSERT in the db.
 * 
 * Input ---> Original URL
 * Output ---> Redirect to the main page when inserting into the database
*********************************************************************************/

app.post('/URL_action', function (req, res) {
  //Parameters
  var url = req.body.URL_original
  var URL_personalizada = req.body.URL_personalizada
  // Random url
  var short_url = randomstring.generate({
    length: 12,
    charset: 'alphabetic'
  });
  // Condition for personalized url
  if (URL_personalizada != '') {
    short_url = URL_personalizada;
  }
  // Timestamp
  const date = moment.tz("America/Santiago").format('YYYY-MM-DD');
  const time = moment.tz("America/Santiago").format('HH:mm:ss');
  // Query for insert new short url
  client.query("INSERT INTO urls (url, short_url, clicks, fecha, hora) VALUES ('"+url+"', '"+short_url+"', "+0+" , '"+date+"', '"+time+"')", (err, result) => {
    if (err) {
      console.error('Error executing query', err);
    } else {
      res.redirect("/")
    }
  });
})

/*********************************************************************************
 * This ENDPOINT it's for any other path that don't belong to the others ENDPOINT.
 * In this case, to any short url that it's redirect
 * 
 * Input ---> Short Url 
 * Output ---> Redirect to the original URL or expired URL
*********************************************************************************/

app.get('/:url_acortada' , (req, res) => {
  // Parameters
  const short_url = req.params.url_acortada
	// Condition for null 
  if (short_url != "favicon.ico" && short_url != null) {
		// Update clicks
    client.query("UPDATE urls SET clicks = clicks + 1 WHERE short_url = '"+short_url+"' ", (err, result) => {
      if (err) {
        console.error('Error executing query', err);
      } else {
				// Get URL data
        client.query("SELECT * FROM urls WHERE short_url = '"+short_url+"';", (err, result2) => {
					//parameters for timestamp
          const dia_db = result2.rows[0].fecha
          const hora_db = result2.rows[0].hora
          const f = new Date(dia_db);
          const year = f.getFullYear();
          const month = String(f.getMonth() + 1).padStart(2, '0');
          const day = String(f.getDate()).padStart(2, '0');
          const aux_db = year + "-" + month + "-" + day;
          let fecha_db = aux_db + " " + hora_db;
          let fechaActual = moment();
					// Comparative for date diff 
          let diferenciaHoras = fechaActual.diff(fecha_db, 'hours');
					// condition for date diff in hours
          if (diferenciaHoras > 72) {
            let msg = "link caducado: "+short_url
            return res.send(msg)
          }

          if (err) {
            console.error('Error executing query', err);
          } else {
						// Redirect to original URL
            const u = result2.rows[0]
            console.log(u.url );
            res.redirect(""+u.url+"")
          }
        });
      }
    });
  }
  else{
    console.log("Not Updated");
    
  }
  
})


//Listen PORT 3000
app.listen(3000);
