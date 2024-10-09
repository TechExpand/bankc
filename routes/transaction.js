const express = require("express");
const router = express.Router();
const  Transaction = require("../models/transaction");
const Profile = require("../models/profile")
let multer = require("multer");
const fs = require("fs");
const AWS = require("aws-sdk");
const User = require("../models/user");


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


router.get("/transaction/clear", function (req, res, next) {
    Transaction.find({})
    .then(function (menus) {
        menus.map((v) => {
        return Transaction.findByIdAndDelete({ _id: v._id }).then(function (
            menus
        ) {});
      });
      res.send("done");
    })
    .catch(next);
});


//get all transaction
router.get("/transaction", function (req, res, next) {
    Transaction.find({})
    .then(function (vendor) {
      res.send(vendor);
    })
    .catch(next);
});






router.post("/transferprofile", function (req, res, next) {
  console.log(req.body)
  Profile.findOne({email: req.body.email})
  .then(function (vendor) {
    if(vendor){
      res.send(vendor);
    }else{
      res.send({});
    }
  
  })
  .catch(next);
});

// 'recieveremail': info.email,
// 'recievername': info.name,
// 'senderemail': email,
// 'sendername': name,
router.post("/transfer", async function (req, res, next) {
  console.log(req.body)
  const profile = await Profile.findOne({email: req.body.senderemail})
  const profile2 = await Profile.findOne({email: req.body.recieveremail})
  if(Number(profile.amount) < Number(req.body.amount)){

    res.status(400).send({message: "Insufficient Balance"})
  }else{
    await Profile.updateOne({email: req.body.senderemail}, {amount: (Number(profile.amount) - Number(req.body.amount)).toString() })
    await Profile.updateOne({email: req.body.recieveremail}, {amount: (Number(profile2.amount) + Number(req.body.amount)).toString() })
    const user = await User.findOne({email: req.body.senderemail})
    const user2 = await User.findOne({email: req.body.recieveremail})
    const date = new Date(); // Current date
const formattedDate = date.toISOString().slice(0, 10).replace(/-/g, '/'); 
    await  Transaction.create({
      user: user._id,
      email: user.email,
      name: "Transfer",
      type: "DEBIT",
      amount:  req.body.amount,
      date: formattedDate,
      status: false,
    })
    await  Transaction.create({
      user: user2._id,
      email: user2.email,
      name: "Transfer",
      type: "CREDIT",
      amount:  req.body.amount,
      date: formattedDate,
      status: false,
    })
    res.status(200).send({message: "Successful"})
  }
  
  })





//get the transaction that belong to a particular user
router.get("/transaction/:userid", function (req, res, next) {
    Transaction.find({user: req.params.userid})
  .then(function (transaction) {
    res.send(transaction);
  })
  .catch(next);
});


//get the particular details of a transaction
router.get("/transaction/:id", function (req, res, next) {
    Transaction.findById({ _id: req.params.id })
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
// router.post('/transaction/:balance', upload.single("image"), (req, res, next) => {


//   // Read content from the file
//   const fileContent = fs.readFileSync(req.file.path);

//   // Setting up S3 upload parameters
//   const params = {
//     Bucket: BUCKET_NAME,
//     Key: req.file.path, // File name you want to save as in S3
//     Body: fileContent,
//   };

//   // Uploading files to the bucket
//   s3.upload(params, function (err, data) {
//     var utc = new Date().toJSON().slice(0,10).replace(/-/g,'/');
//     var date = utc;
//     if (err) {
//       res.status(400).send(err);
//     }
//     console.log(`File uploaded successfully. ${data.Location}`);
//     Transaction.create({
//       user: req.body.user,
//       email: req.body.email,
//       name: req.body.name,
//       image: data.Location,
//       amount:  req.body.amount,
//       date: date.toString(),
//       status: false,
//     })
//     .then(function (menu){
//       let  totalAmount = Number(req.body.amount.toString())+  Number(req.params.balance.toString())
//         Profile.updateOne(
//             { user: req.body.user },
//             {
//                 user: req.body.user,
//                 name: req.body.name,
//                 email: req.body.email,
//                 amount:  totalAmount.toString(),
//                 image: "",
//             },
//             function (err, docs) {
//               if (err) {
//                 res.status(400).send({ message: "failed to update" });
//               } else {
//                 res.send(menu);
//               }
//             }
//           ).then(function(value){
//                 res.send(menu);
//           });
//     })
//     .catch(next);
//   });


// })







router.post('/transaction/:balance/:id', (req, res, next) => {
    var utc = new Date().toJSON().slice(0,10).replace(/-/g,'/');
        var date = utc;
      Transaction.create({
        user: req.body.user,
        email: req.body.email,
        name: req.body.name,
        type: "CREDIT",
        amount:  req.body.amount,
        date: date.toString(),
        status: false,
      })
      .then(function (menu){
        let  totalAmount = Number(req.body.amount.toString())+  Number(req.params.balance.toString())
       console.log(req.params.id)
       console.log(req.params.id)
        Profile.findByIdAndUpdate(
              {_id: req.params.id},
              {
                  user: req.body.user,
                  name: req.body.name,
                  email: req.body.email,
                  amount:  totalAmount.toString(),
                  image: "",
              },
              function (err, docs) {
                if (err) {
                  res.status(400).send({ message: "failed to update" });
                } else {
                  res.send(menu);
                }
              }
            )
      })
      .catch(next);  
  })





//edit a particular transaction 
router.put("/transaction/:id", function (req, res, next) {
    Transaction.findByIdAndUpdate({ _id: req.params.id }, req.body).then(function (menu) {
        Transaction.findOne({ _id: req.params.id })
      .then(function (transaction) {
        res.send(transaction);
      })
      .catch(next);
  });
});


//delete a particular menu
router.delete("/transaction/:id", function (req, res, next) {
    Transaction.findByIdAndDelete({ _id: req.params.id })
    .then(function (transaction) {
      res.send(transaction);
    })
    .catch(next);
});





module.exports = router;
