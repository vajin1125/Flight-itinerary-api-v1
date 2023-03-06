import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql2';
import * as dotenv from "dotenv"
import sampleData from './sample_data.json'

dotenv.config()

const app = express();
app.use(bodyParser.json());

console.log('Application starting ... ⏳')

// To connect to a MySQL database
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
})

connection.connect((error) => {
  console.log('Connecting to MySQL Server ... ⏳')
  if (error) {
    console.log('🤷‍♀️ MySQL Server is not running. Please check.', error);
    return;
  }
  console.log("Connected to MySQL successfully! ✔, checking your database...⏳")
  
  // Create the database if it doesn't exist
  connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`, (error, result) => {
    if (error) {
      console.error('Error creating MySQL database:', error);
      return;
    }
    console.log('MySQL database created!');
  });

  // Create the table if database doesn't exist
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${process.env.DB_NAME}.${process.env.DB_TB_NAME} (
      id INT(11) NOT NULL AUTO_INCREMENT,
      origin VARCHAR(255) NOT NULL,
      destination VARCHAR(255) NOT NULL,
      customer_ip VARCHAR(60) NOT NULL,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    )
  `
  connection.query(createTableQuery, (error, result) => {
    if (error) {
      console.error('Error creating MySQL table:', error);
      return;
    }
    console.log('MySQL table created!');
    console.log('Connected to MySQL database!, Enjoy! 🎉')
  });
})


app.get('/', (req, res) => {
  return res.json({ message: 'Hello, World!' });
});

app.post('/flight-itinerary', (req, res) => {

  // Find the starting point of the itinerary
  const flights = req.body
  let start:any = null
  let end:any = null

  flights.forEach((flight:any) => {
    if (!flights.some((f:any) => f.to === flight.from)) {
      start = flight.from
      end = start
      return false;
    }
  });

  // console.log(`start=>${start}`)

  // Traverse the array to find the correct order of flights
  const sortedFlights = [];
  while (flights.length > 0) {
    const nextFlight = flights.find((flight:any) => flight.from === end);
    sortedFlights.push(nextFlight);
    // checking validated request
    try {
      end = nextFlight.to
    } catch {
      return res.json({ message: 'invalid itinerary!' })
    }
    flights.splice(flights.indexOf(nextFlight), 1);
  }

  // console.log(sortedFlights);
  // console.log(`start=>${start}`, `end=>${end}`)

  //Get customer ipv6
  const customer_ip:any = req.socket.remoteAddress

  // Covert Array for save data if you want to store all itineraries.
  const all_data = sortedFlights.map(({ from, to }:any) => (
    [ from, to, customer_ip ]
  ))
  // console.log(all_data)

  let data:any = [[ start, end, customer_ip ]]
  // console.log(data)

  // Insert data into MySQL Table
  connection.query(`
    INSERT INTO ${process.env.DB_NAME}.${process.env.DB_TB_NAME} (origin, destination, customer_ip) VALUES ?`, 
    [data], 
    function (err, result) {
      if (err) throw err;
  });

  // return message
  return res.json({ message: 'success' })

})

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

export default app
