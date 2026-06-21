const request = require('supertest');
const app = require('../server');

describe('Carbon Footprint API Test Suite', () => {
    it('should successfully calculate carbon footprint metrics', (done) => {
        request(app)
            .post('/api/calculate')
            .send({
                travel: { distance: 100, mode: "car" },
                energy: { usage: 200, type: "electricity" },
                food: { meals: 10, diet: "meat" }
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                if (!res.body.hasOwnProperty('total_carbon_footprint_kg')) {
                    return done(new Error("Missing total score in response"));
                }
                done();
            });
    });

    it('should return 400 Bad Request if metrics payload is missing', (done) => {
        request(app)
            .post('/api/calculate')
            .send({})
            .expect(400, done);
    });
});