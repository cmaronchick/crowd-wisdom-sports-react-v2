const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
app.use(cors())

const apiRouter = require('./api');

//Route setup

// app.get('/api', (req, res) => {
//     console.log('getting game week')
// })
app.use('/api', apiRouter);
app.get('/', (req, res) => {
    console.log('req', req)
    res.send('root route');
})

//Start server
app.listen(port, (req, res) => {
    console.log(`server listening on port: ${port}`)
});