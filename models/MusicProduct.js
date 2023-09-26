const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const MusicProduct_schema  = new Schema({
    name: {
        type: String,
        required: true,
      },
    price:{
        type: Number,
        required: true,
      },
    rating:{
        type: Object,
        required: true,
      },
    description:{
        type: String,
        required: true,
      },
    about :{
        type: Array,
        required: true,
      },
    color:{
        type: String,
        required: true,
      },
    type:{
        type: String,
        required: true,
      },
    brand:{
        type: String,
        required: true,
      },
    featured:{
        type: String,
        required: true,
      },
    available:{
        type: String,
        required: true,
      },
    main_image:{
        type: String,
        required: true,
      },
    left_view:{
        type: String,
        required: true,
      },
    right_view:{
        type: String,
        required: true,
      },
    top_view:{
        type: String,
        required: true,
      }, 
      cart : {
        type : Array,
        required : true,
      }   
})

const MusicProducts = mongoose.model('music product' , MusicProduct_schema)
module.exports  = MusicProducts;