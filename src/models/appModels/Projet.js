const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin', required: true },
 
  branch: { type: mongoose.Schema.ObjectId, ref: 'Branch' },
 
  name: {
    type: String,
    trim: true,
    required: true,
  },
  status:{
    type: String,
  },
  ville:{
    type: String,
  },
  description: {
    type: String,
  },
  ref: {
    type: String,
    trim: true,
  },
  //recurring: {
    //type: String,
    //enum: ['daily', 'weekly', 'monthly', 'annually', 'quarter'],
  //},
  //supplier: {
    //type: mongoose.Schema.ObjectId,
    //autopopulate: true,
  //},
  invoice: {
    type: mongoose.Schema.ObjectId,
    ref: 'Invoice',
    autopopulate: true,
    required: true,
  },
 
 
 // items: [
   // {
      // product: {
      //   type: mongoose.Schema.ObjectId,
      //   ref: 'Product',
      //   // required: true,
      // },
    //  itemName: {
      //  type: String,
        //required: true,
      //},
      description: {
        type: String,
      },
     // quantity: {
       // type: Number,
        //default: 1,
        //required: true,
      //},
      
    
//    },
  //],
  //taxRate: {
    //type: Number,
  //},
 // subTotal: {
   // type: Number,
  //},
  //taxTotal: {
    //type: Number,
  //},
  //total: {
    //type: Number,
  //},
  //paymentMode: {
    //type: mongoose.Schema.ObjectId,
    //ref: 'PaymentMode',
    //autopopulate: true,
  //},
  //receipt: String,
  //images: [
    //{
      //id: String,
      //name: String,
      //path: String,
      //description: String,
      //isPublic: {
        //type: Boolean,
        //default: false,
      //},
    //},
  //],
 /* files: [
    {
      id: String,
      name: String,
      path: String,
      description: String,
      isPublic: {
        type: Boolean,
        default: false,
      },
    },
  ],*/
  
  status: String,
  ville: String,
  
  approved: {
    type: Boolean,
    default: false,
  },
  tags: [
    {
      type: String,
      trim: true,
      lowercase: true,
    },
  ],
  
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },

  
}
);


schema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Projet', schema);
