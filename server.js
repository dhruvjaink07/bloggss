const app = require('./app');
const db = require('mongoose');
const env = require('dotenv');

env.config({path: './config.env'});

const URI = process.env.LOCAL_DB;
db.connect(URI).then((data)=>{
    console.log("DB Connection Successful to "+ data.connection.host);
})

// Starting Server
const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Server Listening on ${PORT}...`)
});