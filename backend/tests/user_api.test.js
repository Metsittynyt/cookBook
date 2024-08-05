const bcrypt = require('bcrypt')
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const helper = require('./test_helper')
const User = require('../models/user')

describe('when there is initially one user at db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    describe('user registration', () => {
        test('Succeeds with a fresh username', async () => {
            const usersAtStart = await helper.usersInDb()

            const newUser = {
                username: 'mrTest',
                name: 'Mr Test',
                password: 'SuperSecretPassword1!',
            }

            await api
                .post('/api/users')
                .send(newUser)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const usersAtEnd = await helper.usersInDb()
            expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

            const usernames = usersAtEnd.map(u => u.username)
            expect(usernames).toContain(newUser.username)
        })

        test('Fails with proper statuscode and message if username already taken', async () => {
            const usersAtStart = await helper.usersInDb()

            const newUser = {
                username: 'root',
                name: 'Super User',
                password: 'SuperSecretPassword1!',
            }

            const result = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            expect(result.body.error).toContain('expected `username` to be unique')

            const usersAtEnd = await helper.usersInDb()
            expect(usersAtEnd).toHaveLength(usersAtStart.length)
        })

        test('Fails with proper statuscode and message if password is too short', async () => {
            const newUser = {
                username: 'shortPasswordUser',
                name: 'Short Password',
                password: 'Short1!',
            }

            const result = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            expect(result.body.message).toContain('Password must be at least 8 characters long.')
        })

        test('Fails with proper statuscode and message if password has no uppercase letter', async () => {
            const newUser = {
                username: 'noUppercaseUser',
                name: 'No Uppercase',
                password: 'lowercase1!',
            }

            const result = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            expect(result.body.message).toContain('Password must contain at least one uppercase letter.')
        })

        test('Fails with proper statuscode and message if password has no lowercase letter', async () => {
            const newUser = {
                username: 'noLowercaseUser',
                name: 'No Lowercase',
                password: 'UPPERCASE1!',
            }

            const result = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            expect(result.body.message).toContain('Password must contain at least one lowercase letter.')
        })

        test('Fails with proper statuscode and message if password has no number', async () => {
            const newUser = {
                username: 'noNumberUser',
                name: 'No Number',
                password: 'NoNumber!',
            }

            const result = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            expect(result.body.message).toContain('Password must contain at least one number.')
        })

        test('Fails with proper statuscode and message if password has no special character', async () => {
            const newUser = {
                username: 'noSpecialCharUser',
                name: 'No Special Character',
                password: 'NoSpecialChar1',
            }

            const result = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            expect(result.body.message).toContain('Password must contain at least one special character.')
        })
    })

    describe('user login', () => {
        test('Succeeds with correct credentials', async () => {
            const loginUser = {
                username: 'root',
                password: 'sekret',
            }

            await api
                .post('/api/login')
                .send(loginUser)
                .expect(200)
                .expect('Content-Type', /application\/json/)
        })

        test('Fails with invalid username', async () => {
            const loginUser = {
                username: 'wrongUsername',
                password: 'sekret',
            }

            const result = await api
                .post('/api/login')
                .send(loginUser)
                .expect(401)
                .expect('Content-Type', /application\/json/)

            expect(result.body.error).toContain('Invalid username or password')
        })

        test('Fails with invalid password', async () => {
            const loginUser = {
                username: 'root',
                password: 'wrongPassword',
            }

            const result = await api
                .post('/api/login')
                .send(loginUser)
                .expect(401)
                .expect('Content-Type', /application\/json/)

            expect(result.body.error).toContain('Invalid username or password')
        })
    })
})
