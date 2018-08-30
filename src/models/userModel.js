
'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TransactionsSchema = new Schema({
  id: { type: String, index: true},  
  description: String, 
  value: Number, 
  valueAsString: String
})

var ProductsSchema = new Schema({
  kernelid: String,
  description: String,
  balance: Number,
  balanceAsString: String,
  transactions: [TransactionsSchema]
})

var UserSchema = new Schema({
  userid: { type: String, index: true },
  kernelid: String,
  name: { type: String, required: 'Nome não informado' },
  email: { type: String, index: true },
  cellphone: Number, 
  cpfcnpj: Number, 
  products: [ProductsSchema]
});

module.exports = mongoose.model('User', UserSchema);
module.exports = mongoose.model('Product', ProductsSchema);
module.exports = mongoose.model('Transaction', TransactionsSchema);