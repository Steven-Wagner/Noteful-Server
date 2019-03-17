const {expect} = require('chai');
const knex = require('knex');
const app = require('../src/app');
const {makeTestNotes, newNoteTest, badNewNoteTest, updateNote, expectedUpdateNote} = require('./fixtures/note_fixtures')
const {makeTestFolders, newFolderTest, badNewFolderTest} = require('./fixtures/folder_fixtures')

describe.only('Notes Endpoints', () => {
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

    describe(`GET /api/notes`, () => {
        context(`Given data in notes`, () => {
            const testFolders = makeTestFolders();
            const testData = makeTestNotes();

            beforeEach(`add folder data`, () => {
                return db
                    .into('noteful_folders')
                    .insert(testFolders)
            })
            
            beforeEach(`add test data`, () => {
                return db
                    .into('noteful_notes')
                    .insert(testData)
            })

            it(`GET /api/notes responds with 200 and notes`, () => {
                return request(app)
                    .get('/api/notes')
                    .expect(200)
                    .expect(response => {
                        expect(response.body).to.eql(testData)
                    })
            })
        })
    })
    describe(`POST /api/notes`, () => {
        const testFolders = makeTestFolders()
        
        beforeEach(`add folder data`, () => {
            return db
                .into('noteful_folders')
                .insert(testFolders)
        })

        it(`POST /api/notes responds with 201 and new note`, () => {
            
            const newNote = newNoteTest();
            
            return request(app)
                .post('/api/notes')
                .send(newNote)
                .expect(201)
                .expect(response => {
                    expect(response.body.name).to.eql(newNote.name)
                    expect(response.headers.location).to.eql(`/api/notes/${response.body.id}`)
                })
        })
        //to do: test post validation of required fields
        it(`POST /api/notes responds with 400 and error when required field is empty`, () => {
            const testData = newNoteTest()
            delete testData.notes_name

            return request(app)
                .post(`/api/notes`)
                .send(testData)
                .expect(400, {error: {message: `Missing notes_name in request body`}})
        })
    })
    describe(`GET /api/notes/:id`, () => {
        context(`Given data in notes`, () => {
            const testFolders = makeTestFolders()
            
            beforeEach(`add folder data`, () => {
                return db
                    .into('noteful_folders')
                    .insert(testFolders)
            })
            const testData = makeTestNotes();

            beforeEach(`add test data`, () => {
                return db
                    .into('noteful_notes')
                    .insert(testData)
            })

            it(`GET /api/notes/:id responds with 200 and note`, () => {
                const idToGet = 2
                const expectedNote = testData[idToGet-1]
                
                return request(app)
                    .get(`/api/notes/${idToGet}`)
                    .expect(200)
                     .expect(response => {
                        expect(response.body).to.eql(expectedNote)
                    })
            })
            it(`GET /api/notes/:id responds with 404 with wrong id`, () => {
                const idToGet = 4356
                
                return request(app)
                    .get(`/api/notes/${idToGet}`)
                    .expect(404, {error: {message: `note does not exist`}})
            })
        })
        context(`Given no data in 'notes'`, () => {
            
            it(`GET /api/notes/:id responds with 404 with wrong id`, () => {
                const idToGet = 4356
                
                return request(app)
                    .get(`/api/notes/${idToGet}`)
                    .expect(404, {error: {message: `note does not exist`}})
            })
        })
    })
    describe(`DELETE /api/notes/:id`, () => {
        context(`Given data in notes`, () => {
            const testFolders = makeTestFolders()
            
            beforeEach(`add folder data`, () => {
                return db
                    .into('noteful_folders')
                    .insert(testFolders)
            })

            const testData = makeTestNotes();

            beforeEach(`add test data`, () => {
                return db
                    .into('noteful_notes')
                    .insert(testData)
            })

            it(`DELETE /api/notes/:id responds with 204 and note is deleted`, () => {
                const idToDelete = 2
                const expectedNotes = testData.filter(note => note.id !== idToDelete)
                
                return request(app)
                    .delete(`/api/notes/${idToDelete}`)
                    .expect(204)
                    .then(() => {
                        return request(app)
                            .get(`/api/notes`)
                            .expect(expectedNotes)
                        })
            })

            it(`DELETE /api/notes/:id responds with 404 with wrong id`, () => {
                const idToDelete = 4356
                
                return request(app)
                    .delete(`/api/notes/${idToDelete}`)
                    .expect(404, {error: {message: `note does not exist`}})
            })
        })
    })
    describe(`PATCH /api/notes/:id`, () => {
        context(`Given data in notes`, () => {
            const testFolders = makeTestFolders()
            
            beforeEach(`add folder data`, () => {
                return db
                    .into('noteful_folders')
                    .insert(testFolders)
            })

            const testData = makeTestNotes();

            beforeEach(`add test data`, () => {
                return db
                    .into('noteful_notes')
                    .insert(testData)
            })

            it(`PATCH /api/notes/:id responds with 204 and updates note`, () => {
                const updatedInfo = updateNote();
                const idToUpdate = 2
                const expectedNote = expectedUpdateNote()
                
                return request(app)
                    .patch(`/api/notes/${idToUpdate}`)
                    .send(updatedInfo)
                    .expect(204)
                    .then(resp => 
                        request(app)
                            .get(`/api/notes/${idToUpdate}`)
                            .expect(note => {
                                expect(note.body).to.eql(expectedNote)
                            })
                    )
            })
            it(`GET /api/notes/:id responds with 404 with wrong id`, () => {
                const idToGet = 4356
                
                return request(app)
                    .get(`/api/notes/${idToGet}`)
                    .expect(404, {error: {message: `note does not exist`}})
            })
        })
    })

})