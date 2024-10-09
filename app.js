const express = require('express');
const cors = require('cors');
const app = express();
const AWS = require('aws-sdk');
let multer = require('multer');
let upload = multer();
let cookieParser = require('cookie-parser');


// const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/bank');
// mongoose.Promise = global.Promise;


const mongoose = require('mongoose');
const uri = "mongodb+srv://dailydevo9:mkaR9LkgWAn6HKbP@bank.7jobp.mongodb.net/?retryWrites=true&w=majority&appName=bank";
// mongodb+srv://trafik:Ediku126@cluster0.qrw9g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("MongoDB Connected…")
  })
  .catch(err => console.log(err))


app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(upload.array()); 
app.use(express.static('public'));
app.use(express.static('public/image'));
app.use('/api',require('./routes/api'));
app.use('/api',require('./routes/blog'));
app.use('/api',require('./routes/transaction'));

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });

app.use(function(err,req,res,next){
  res.status(422).send({error: err.message});
});














app.get('*', function(req, res){
  res.send('Sorry, this is an invalid URL.');
});



// app.listen("192.168.43.225" || 3000);
// console.log('Web Server is listening at port '+ ("192.168.43.225" || 3000));
app.listen(process.env.PORT || 3000);
console.log('Web Server is listening at port '+ (process.env.port || 3000));