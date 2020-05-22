const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const path = require('path')
const cors = require('cors');
app.use(cors())

const apiRouter = require('./api');

// app.set('view engine', 'ejs');
//Route setup
app.use('/api', apiRouter);
app.get('/', (req, res) => {
    console.log('req', req)
    res.send('root route');
})

//Start server
app.listen(port, (req, res) => {
    console.log(`server listening on port: ${port}`)
});