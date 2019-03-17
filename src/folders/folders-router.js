const express = require('express');
const FoldersService = require('./folders-service');
const xss = require('xss');
const path = require('path');

const foldersRouter = express.Router();
const jsonParser = express.json();

const serializeFolders = folder => ({
    id: folder.id,
    name: xss(folder.name)
})

foldersRouter
    .route('/')
    .get((req, res, next) => {
        FoldersService.getAllFolders(
            req.app.get('db')
        )
        .then(folders => {
            res.status(200).json(folders.map(serializeFolders))
        })
        .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
    const {name} = req.body;
    const newFolder = {name}

    if (!name) {
        return res.status(400).json({error: {message: `name field is required`}})
    }

        FoldersService.postNewFolder(
            req.app.get('db'),
            newFolder
        )
        .then(folder => {
            res.status(201)
            .location(path.posix.join(req.originalUrl, `/${folder.id}`))
            .json(serializeFolders(folder))
        })
        .catch(next)
    })

foldersRouter
    .route('/:id')
    .all((req, res, next) => {
        FoldersService.getFolderById(
            req.app.get('db'),
            req.params.id
        )
        .then(folder => {
            if (!folder) {
                return res.status(404).json({error: {message: `folder does not exist`}})
            }
            res.folder = folder
            next()
        })
        .catch(next)
    })
    .get((req, res, next) => {
        res.status(200).json(serializeFolders(res.folder))
    })
    .patch(jsonParser, (req, res, next) => {
        const {name} = req.body;
        updatedInfo = {name};

        if (!name) {
            return res.status(400).json({error: {message: `name field is required`}})
        }

        FoldersService.patchFolder(
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
        FoldersService.deleteById(
            req.app.get('db'),
            req.params.id
        )
        .then(resp => {
            res.status(204).end()
        })
        .catch(next)
    })
module.exports = foldersRouter