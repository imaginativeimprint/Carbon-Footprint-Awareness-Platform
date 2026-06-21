const request = require('supertest');
const app = require('../server');

describe('Carbon Footprint Framework Comprehensive Test Matrices', () => {
    // 1. Valid Calculation Suite
    it('should accurately process data calculations and return dynamic metrics responses', (done) => {
        request(app)
            .post('/api/calculate')
            .send({
                travel: { distance: 150, mode: "car" },
                energy: { usage: 300, type: "electricity" },
                food: { meals: 20, diet: "meat" }
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                if (res.body.success !== true) return done(new Error("Expected success parameter flag to be true"));
                if (!res.body.hasOwnProperty('total_carbon_footprint_kg')) return done(new Error("Missing core total footprint tally target"));
                done();
            });
    });

    // 2. Security Validation Rejection Suite
    it('should return 400 Bad Request when structural request matrices parameters are missing', (done) => {
        request(app)
            .post('/api/calculate')
            .send({
                travel: { distance: 50 }
            })
            .expect(400, done);
    });

    // 3. System Boundary & Zero Values Edge Cases Suite
    it('should cleanly handle zero-value inputs without calculations breakdown', (done) => {
        request(app)
            .post('/api/calculate')
            .send({
                travel: { distance: 0, mode: "public_transport" },
                energy: { usage: 0, type: "gas" },
                food: { meals: 0, diet: "vegan" }
            })
            .expect(200, done);
    });
});
