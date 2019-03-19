require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const {NODE_ENV} = require('./config');
const foldersRouter = require('./folders/folders-router')
const notesRouter = require('./notes/notes-router');

const app = express();

const morganSetting = (NODE_ENV === 'production')
    ? 'tiny'
    : 'dev';

    app.use(morgan(morganSetting));
    app.use(cors());
    app.use(helmet());

    app.use('/api/folders', foldersRouter)

    app.use('/api/notes', notesRouter)

    app.use((error, req, res, next) => {
        let response
        if (process.env.NODE_ENV === 'production') {
          response = { error: { message: 'server error' }}
        } else {
          response = { error }
        }
        res.status(500).json(response)
      })

    module.exports = app;