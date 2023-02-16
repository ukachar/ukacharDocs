const mongoose = require('mongoose')
require('dotenv').config()
const Document = require('./Document')
const bodyparser = require('body-parser')
const uri = process.env.MONGO
const apiRouter = require('./api/routes/router')

//Express server za API(bez socket.io)
const express = require('express')
const app = express();
app.listen(3002, () => {
    console.log("Connected to API server on http://localhost:3002");
})

// parse request to body-parser
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json());

//korištenje routera
app.use(apiRouter)




mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
}, () => {
    console.log("Connected to DB")
})


/*Document.find({}, (err, docs) => {
    if (err) {
        console.log('ERROR')
    }
    else {
        console.log(docs[0].data)
    }



});*/

const io = require("socket.io")(3001, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
})

const defaultValue = ""

io.on("connection", socket => {
    socket.on("get-document", async documentId => {
        const document = await findOrCreateDocument(documentId)
        socket.join(documentId)
        socket.emit("load-document", document.data)

        socket.on("send-changes", delta => {
            socket.broadcast.to(documentId).emit("receive-changes", delta)
        })

        socket.on("save-document", async data => {
            await Document.findByIdAndUpdate(documentId, { data })
        })


    })
})

async function findOrCreateDocument(id) {
    if (id == null) return

    const document = await Document.findById(id)
    if (document) return document
    return await Document.create({ _id: id, data: defaultValue })
}