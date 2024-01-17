const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const User = require('../src/models/User');

describe('User Registration API', () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/test', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await User.deleteMany({});
    });

    it('should register a new user', async () => {
        const newUser = {
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'testpassword',
            phone: '1234567890',
            image: 'avatar.jpg',
            role: 'customer',
        };

        const response = await request(app)
            .post('/api/users/register')
            .send(newUser)
            .expect(201);

        expect(response.body).toHaveProperty('statusCode', 201);
        expect(response.body).toHaveProperty('message', 'User registered successfully');
    });

    it('should handle duplicate email during registration', async () => {
        const existingUser = {
            username: 'existinguser',
            email: 'existinguser@example.com',
            password: 'existingpassword',
            phone: '9876543210',
            image: 'existing_avatar.jpg',
            role: 'customer',
        };

        await request(app).post('/api/users/register').send(existingUser);

        const newUser = {
            username: 'newuser',
            email: 'existinguser@example.com',
            password: 'newpassword',
            phone: '5555555555',
            image: 'new_avatar.jpg',
            role: 'customer',
        };

        const response = await request(app)
            .post('/api/users/register')
            .send(newUser)
            .expect(400);

        expect(response.body).toHaveProperty('statusCode', 400);
        expect(response.body).toHaveProperty('message', 'Email already exists');
    });
});
