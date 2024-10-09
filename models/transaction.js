const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const TransactionScema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    email: String,
    name: String,
    amount:  String,
    type:  String,
    date: String,
    status: Boolean,
  });
  
  const Transaction = mongoose.model('transaction', TransactionScema);

  module.exports = Transaction;
