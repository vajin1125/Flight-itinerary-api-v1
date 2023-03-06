process.env.NODE_ENV = "test"

import chai from 'chai'
import chaiHttp from 'chai-http'
import app from '../src/index'
import sampleData from '../src/sample_data.json'

const should = chai.should();

chai.use(chaiHttp)

describe("GET /", function() {

  it("should return status 200 and 'Hello, World!' message", (done) => {
    chai.request(app)
      .get('/')
      .end((err:any, res:any) => {
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.should.have.property('message').eq('Hello, World!')
        done()
      })
  });
});

describe("POST /flight-itinerary", function() {

  it("should return status 200 and success message", (done) => {
    chai.request(app)
      .post('/flight-itinerary')
      .send(sampleData)
      .end((err:any, res:any) => {
        res.should.have.status(200)
        res.body.should.have.property('message').eq('success')
        done()
      })
  });

  it("should return invalid message", (done) => {
    let invalidData = [
      {
        "from": "MIA",
        "to": "SFO"
      },
      {
          "from": "EZE",
          "to": "MIA"
      },
      
      {
          "from": "EZE", // invalid value
          "to": "GRU"
      },
      {
          "from": "GRU",
          "to": "SCL"
      }
    ]
    chai.request(app)
      .post('/flight-itinerary')
      .send(invalidData)
      .end((err:any, res:any) => {
        res.should.have.status(200)
        res.body.should.have.property('message').eq('invalid itinerary!')
        done()
      })
  });

});