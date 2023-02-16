const express = require('express');
const app = express();
require('dotenv').config()
const Document = require('../../Document')

app.get('/api/getAllDocuments', (req, res) => {
    Document.find({}, (err, docs) => {
        if (err) {
            console.log('ERROR')
        }
        else {
            res.send(docs)
        }



    });
})


module.exports = app;

