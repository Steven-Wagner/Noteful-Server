const {expect} = require('chai');
const knex = require('knex');
const app = require('../src/app');
const {makeTestFolders, newFolderTest, badNewFolderTest} = require('./fixtures/folder_fixtures')

describe('Folders Endpoints', () => {
    let db

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.DB_URL_TEST
        })
        app.set('db', db)
    });

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db.raw('TRUNCATE noteful_notes, noteful_folders RESTART IDENTITY CASCADE'))
    
    afterEach('clean the table', () => db.raw('TRUNCATE noteful_notes, noteful_folders RESTART IDENTITY CASCADE'))

    describe(`GET /api/folders`, () => {
        context(`Given data in folders`, () => {
            const testData = makeTestFolders();

            beforeEach(`add test data`, () => {
                return db
                    .into('noteful_folders')
                    .insert(testData)
            })

            it(`GET /api/folders responds with 200 and folders`, () => {
                return request(app)
                    .get('/api/folders')
                    .expect(200)
                    .expect(response => {
                        expect(response.body).to.eql(testData)
                    })
            })
        })
    })
    describe(`POST /api/folders`, () => {
        it(`POST /api/folders responds with 201 and new folder`, () => {
            const newFolder = newFolderTest();
            
            return request(app)
                .post('/api/folders')
                .send(newFolder)
                .expect(201)
                .expect(response => {
                    expect(response.body.name).to.eql(newFolder.name)
                    expect(response.headers.location).to.eql(`/api/folders/${response.body.id}`)
                })
        })
        it(`POST /api/folders responds with 400 and error when required field is empty`, () => {
            const testData = badNewFolderTest();

            return request(app)
                .post(`/api/folders`)
                .send(testData)
                .expect(400, {error: {message: `name field is required`}})
        })
    })
    describe(`GET /api/folders/:id`, () => {
        context(`Given data in folders`, () => {
            const testData = makeTestFolders();

            beforeEach(`add test data`, () => {
                return db
                    .into('noteful_folders')
                    .insert(testData)
            })

            it(`GET /api/folders/:id responds with 200 and folder`, () => {
                const idToGet = 2
                const expectedFolder = testData[idToGet-1]
                
                return request(app)
                    .get(`/api/folders/${idToGet}`)
                    .expect(200)
                     .expect(response => {
                        expect(response.body).to.eql(expectedFolder)
                    })
            })
            it(`GET /api/folders/:id responds with 404 with wrong id`, () => {
                const idToGet = 4356
                
                return request(app)
                    .get(`/api/folders/${idToGet}`)
                    .expect(404, {error: {message: `folder does not exist`}})
            })
        })
        context(`Given no data in 'folders'`, () => {
            
            it(`GET /api/folders/:id responds with 404 with wrong id`, () => {
                const idToGet = 4356
                
                return request(app)
                    .get(`/api/folders/${idToGet}`)
                    .expect(404, {error: {message: `folder does not exist`}})
            })
        })
    })
    describe(`DELETE /api/folders/:id`, () => {
        context(`Given data in folders`, () => {
            const testData = makeTestFolders();

            beforeEach(`add test data`, () => {
                return db
                    .into('noteful_folders')
                    .insert(testData)
            })

            it(`DELETE /api/folders/:id responds with 204 and folder is deleted`, () => {
                const idToDelete = 2
                const expectedFolders = testData.filter(folder => folder.id !== idToDelete)
                
                return request(app)
                    .delete(`/api/folders/${idToDelete}`)
                    .expect(204)
                    .then(() => {
                        return request(app)
                            .get(`/api/folders`)
                            .expect(expectedFolders)
                        })
            })

            it(`DELETE /api/folders/:id responds with 404 with wrong id`, () => {
                const idToDelete = 4356
                
                return request(app)
                    .delete(`/api/folders/${idToDelete}`)
                    .expect(404, {error: {message: `folder does not exist`}})
            })
        })
    })
    describe(`PATCH /api/folders/:id`, () => {
        context(`Given data in folders`, () => {
            const testData = makeTestFolders();

            beforeEach(`add test data`, () => {
                return db
                    .into('noteful_folders')
                    .insert(testData)
            })

            it(`PATCH /api/folders/:id responds with 204 and updates folder`, () => {
                const idToUpdate = 2
                const updatedInfo = {name: 'Updated Name'}
                const expectedFolder = {id: 2, name: 'Updated Name'}
                
                return request(app)
                    .patch(`/api/folders/${idToUpdate}`)
                    .send(updatedInfo)
                    .expect(204)
                    .then(resp => 
                        request(app)
                            .get(`/api/folders/${idToUpdate}`)
                            .expect(folder => {
                                expect(folder.body).to.eql(expectedFolder)
                            })
                    )
            })
            it(`GET /api/folders/:id responds with 404 with wrong id`, () => {
                const idToGet = 4356
                
                return request(app)
                    .get(`/api/folders/${idToGet}`)
                    .expect(404, {error: {message: `folder does not exist`}})
            })
        })
    })

})