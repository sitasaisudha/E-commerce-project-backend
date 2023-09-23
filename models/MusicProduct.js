const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const MusicProduct_schema  = new Schema({
    name : String,
    price: Number,
    rating:Object,
    description:String,
    about :Array,
    color:String,
    type:String,
    brand:String,
    featured:String,
    available:String,
    main_image:String,
    left_view:String,
    right_view:String,
    top_view:String,

    
})

const MusicProducts = mongoose.model('music product' , MusicProduct_schema)
module.exports  = MusicProducts;
