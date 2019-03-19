const express = require('express');
const NotesService = require('./notes-service');
const xss = require('xss');
const path = require('path');

const notesRouter = express.Router();
const jsonParser = express.json();

const serializeNotes = note => ({
    id: note.id,
    notes_name: xss(note.notes_name),
    content: xss(note.content),
    folder_id: note.folder_id,
    modified: note.modified
})

notesRouter
    .route('/')
    .get((req, res, next) => {
        console.log('getting notes')
        console.log('db', req.app.get('db'))
        NotesService.getAllNotes(
            req.app.get('db')
        )
        .then(notes => {
            res.status(200).json(notes.map(serializeNotes))
        })
        .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const {notes_name, content, folder_id} = req.body;
        const newNote = {notes_name, content, folder_id}

    //to do: validate
        for (const [key, value] of Object.entries(newNote)) {
            if (value == null) {
                return res.status(400).json({
                    error: {message: `Missing ${key} in request body`}
                })
            }
        }

        NotesService.postNewNote(
            req.app.get('db'),
            newNote
        )
        .then(note => {
            res.status(201)
            .location(path.posix.join(req.originalUrl, `/${note.id}`))
            .json(serializeNotes(note))
        })
        .catch(next)
    })

notesRouter
    .route('/:id')
    .all((req, res, next) => {
        NotesService.getNoteById(
            req.app.get('db'),
            req.params.id
        )
        .then(note => {
            if (!note) {
                return res.status(404).json({error: {message: `note does not exist`}
                })
            }
            res.note = note
            next()
        })
        .catch(next)
    })
    .get((req, res, next) => {
        res.status(200).json(serializeNotes(res.note))
    })
    .patch(jsonParser, (req, res, next) => {
        const {notes_name, content, folder_id} = req.body;
        updatedInfo = {notes_name, content, folder_id};

        const numberOfValues = Object.values(updatedInfo).filter(Boolean).length
        if(numberOfValues === 0) {
            return res.status(400).json({
                error: {message: `Request must contain 'notes_name', 'content', 'folder_id'`}
            })
        }
        
        NotesService.patchNote(
            req.app.get('db'),
            req.params.id,
            updatedInfo
        )
        .then(resp => {
            res.status(204).end()
        })
        .catch(next)
    })
    .delete((req, res, next) => {
        NotesService.deleteById(
            req.app.get('db'),
            req.params.id
        )
        .then(resp => {
            res.status(204).end()
        })
        .catch(next)
    })
module.exports = notesRouter