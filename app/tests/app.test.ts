import request from 'supertest';
import app from '../app';

describe('Simple', () => {
    test('get /', async () => {
        return request(app)
            .get('/')
            .then((res) => {
                expect(res.status).toBe(200);
            });
    });

    test('get /user', async () => {
        return request(app)
            .get('/user')
            .then((res) => {
                expect(res.status).toBe(200);
            });
    });

    test('post /user', async () => {
        return request(app)
            .post('/user')
            .send({})
            .then((res) => {
                expect(res.status).toBe(200);
            });
    });
});
