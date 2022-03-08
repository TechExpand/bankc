const express = require("express");
const router = express.Router();
const  Blog = require("../models/blog");
const Profile = require("../models/profile")
let multer = require("multer");
const fs = require("fs");
const AWS = require("aws-sdk");


const ID = "AKIATM4GCCB2BOMJGDR3";
const SECRET = "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";
const BUCKET_NAME = "fybe-product";

const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET,
});




const imageStorage = multer.diskStorage({    
  destination: (req, file, cb) => {
        cb(null, './public/image')
  },
  filename: (req, file, cb) => {
    let filename = Date.now() + "--" + file.originalname;
    cb(null, filename.replace(/\s+/g, ''))
}
});



const upload = multer({
  storage: imageStorage,
}) 


router.get("/blog/clear", function (req, res, next) {
    Blog.find({})
    .then(function (menus) {
        menus.map((v) => {
        return Blog.findByIdAndDelete({ _id: v._id }).then(function (
            menus
        ) {});
      });
      res.send("done");
    })
    .catch(next);
});


//get all transaction
router.get("/blog", function (req, res, next) {
    Blog.find({})
    .then(function (vendor) {
      res.send(vendor);
    })
    .catch(next);
});




//get the transaction that belong to a particular user
router.get("/blog/:userid", function (req, res, next) {
    Blog.find({user: req.params.userid})
  .then(function (transaction) {
    res.send(transaction);
  })
  .catch(next);
});


//get the particular details of a transaction
router.get("/blog/:id", function (req, res, next) {
    Blog.findById({ _id: req.params.id })
    .then(function (transaction) {
      res.send(transaction);
    })
    .catch(next);
});



/**
 * 
 * accessed by only admins of fybe app
 * 
 * 
**/

//create the transaction of a user
// api to create a vendor
router.post('/blog', (req, res, next) => {
    Blog.create({
        title: req.body.title,
        detail: req.body.detail,
        author: req.body.name,
        image:  req.body.image,
        date:  req.body.date,
      })
      .then(function (menu){
          res.send(menu);
      })
      .catch(next);
  });









//edit a particular transaction 
router.put("/blog/:id", function (req, res, next) {
    Blog.findByIdAndUpdate({ _id: req.params.id }, req.body).then(function (menu) {
        Blog.findOne({ _id: req.params.id })
      .then(function (transaction) {
        res.send(transaction);
      })
      .catch(next);
  });
});


//delete a particular menu
router.delete("/blog/:id", function (req, res, next) {
    Blog.findByIdAndDelete({ _id: req.params.id })
    .then(function (transaction) {
      res.send(transaction);
    })
    .catch(next);
});





module.exports = router;
