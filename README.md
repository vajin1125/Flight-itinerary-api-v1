# Flight Itinerary API v1

## Tech Stack
1. nodeJS
2. TypeScript
3. MySQL2
4. Mocha

## Want to use this project?

1. Fork/Clone
2. Install dependencies - `npm install`
3. Compile - `npm run build`
4. Run the development server - `npm start`
5. Test - `npm test`

## Access server

```
  http://localhost:3000
```
| **Method** | **URL**              	| **Description**            	                 |
|----------	|-------------------------|----------------------------------------------|
| GET     	| /     	                | Checking run server 	                       |
| POST    	| /flight-itinerary       | Main functionalities for this api of this requirements   |
|           |                         | Checking the invalid data, generating the correct intinerary and saving data to mysql database

## Main Algorithm for checking itinerary array 

```JavaScript
  let start:any = null
  let end:any = null

  flights.forEach((flight:any) => {
    if (!flights.some((f:any) => f.to === flight.from)) {
      start = flight.from
      end = start
      return false;
    }
  });

  console.log(`start=>${start}`)

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

  console.log(sortedFlights);
  console.log(`start=>${start}`, `end=>${end}`)
```

## Requirements

### Create a simple API using the following technologies:
    Node.js
    Typescript
    MySQL
    Mocha

### Endpoint:
Design an endpoint that will allow users to send an unordered Flight Itinerary array. The endpoint should order the itinerary and return the result to the user.
Each item will be an object containing the origin and destination airport code. Example:
```json
{
   "from": "EZE",
   "to": "MIA"
}
```

The endpoint should sort the itinerary in the correct order of the flights. Consider the following example, that is in the right order:
```json
[
           {
               from: 'EZE',
               to: 'MIA'
           },
           {
               from: 'MIA',
               to: 'SFO'
           },
           {
               from: 'SFO',
               to: 'GRU'
           },
           {
               from: 'GRU',
               to: 'SCL'
           }
]	
```
The first flight is EZE->MIA. The second flight should be MIA->SFO, because the last destination is MIA, and so on.
Flight destinations are unique, so the users should not be able to send the same destination airport more than once.
Flight itinerary needs to be validated to make sure it’s valid (for example, there is no orphan flight that departs from an airport that the user does not visit).

Once the input data is received and processed, the output should also be stored in a MySQL table containing the final itinerary, requester’s ip and timestamp.
Design the endpoint in the most optimized way that will allow the API to handle either big sets of data or a big amount of concurrent requests.

### Unit Tests
Develop the Unit Tests that you consider necessary to make sure that the endpoint handler works as expected.

### Key Points
  Use of typing
  Data validation
  Error handling
  Good performance
  Test coverage
