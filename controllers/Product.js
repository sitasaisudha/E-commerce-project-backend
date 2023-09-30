const MusicProducts = require("../models/MusicProduct");


exports.createProduct = async (req,res)=>{
  
    try{
    const {name, pricing, description , about, color, type, brand,featured,available, ratingStars,ratingCount, main_image, left_view,right_view, top_view,} = req.body ;
   
    const rating = {rate:ratingStars , count :ratingCount}
    const price = parseInt(pricing);
    console.log(name, price, description , about, color, type, brand,featured,available, main_image, left_view,right_view, top_view,rating)
    console.log(price, typeof(price ))
    await MusicProducts.create({name,  description , about,price, color, type, brand,featured,available, main_image, left_view,right_view, top_view,rating})   
    res.json({status:"success" , message:"product created successfully"})
    
    }catch(error){
    
        res.json({status:"fail" , message:"product is not added"})
    }
}

exports.getProductsById = async(req,res)=>{
  const id = req.query._id;
  
  try {
    const product = await MusicProducts.findById(req.query._id);
    res.json(product);
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
}

exports.getCartProducts = async(req,res) => {
  // console.log(req.body)
  try{
    const filter = {};
    console.log(req.params)
    const products = await MusicProducts.find({ cart: { $elemMatch: { $eq: req.params.user } } })
    res.json(products);
  }catch(err){
    console.log("error occured");
    res.status(400).json("Error :" + err);
  }
}

exports.setCart = async(req,res) => {
  try{

    const product = await MusicProducts.findById(req.params.id);
    let arr = product.cart;
    if(arr.indexOf(req.params.user) == -1){
      arr.push(req.params.user)
    }
    else{
      const newA = arr.slice(0,arr.indexOf(req.params.user)).concat(arr.slice(arr.indexOf(req.params.user)+1))
      arr = newA 
    }
    product.cart = arr;
    await product.save();
    res.json(product);
  }catch(err){
    console.log("error")
    res.status(400).json("Error : "+err)
  }
} 

exports.clearCart = async (req,res)=>{
  try{
    const username = req.params.user;
    console.log(username);
    await MusicProducts.updateMany(
      { 'cart': username },
      { $pull: { 'cart': username } }
    );

    res.json({ message: 'Order placed successfully' });
  }
  catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ error: 'An error occurred while placing the order' });
  }
}

exports.placeOrder = async (req,res)=>{
  try{
   
    const { itemId, username } = req.params;
    console.log(itemId,username);
    await MusicProducts.updateOne(
      { _id: itemId },
      { $pull: { cart: username } }
    );


   res.json({ message: 'Order placed successfully' });
  }
  catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ error: 'An error occurred while placing the order' });
  }
}

//to send thefilterd music products 
exports.getAllMusicProducts = async (req, res) => {
  const {
    type = 'all',
    color = 'all',
    brand = 'all',
    minPrice = 0,
    maxPrice = Infinity,
    sortBy = '',
    sortOrder = '',
    search = ''
  } = req.query;

  
  const isFeaturedFilter =
    type === 'featured' ||
    color === 'featured' ||
    brand === 'featured' ||
    minPrice === 'featured' ||
    maxPrice === 'featured' ||
    sortBy === 'featured' ||
    sortOrder === 'featured' ||
    search === 'featured';

  try {
    let filter = {};

    if (type !== 'all' && !isFeaturedFilter) {
      filter.type = type;
    }

    if (color !== 'all' && !isFeaturedFilter) {
      filter.color = color;
    }

    if (brand !== 'all' && !isFeaturedFilter) {
      filter.brand = brand;
    }

    if (!isFeaturedFilter) {
      filter.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
    }

    if (search && !isFeaturedFilter) {
      const searchRegex = new RegExp(search, 'i'); // 'i' for case-insensitive search
      filter.$or = [
        { name: { $regex: searchRegex, $options: 'i' } },
        { company: { $regex: searchRegex, $options: 'i' } },
      ];
    }

    if (isFeaturedFilter) {
      // If any filter parameter is specified as "featured", return products with featured: true
      filter.featured = true;
    }

    let result;

    if (!sortBy || !sortOrder) {
      result = await MusicProducts.find(filter);
    } else {
      let sortCriteria = {};

      if (sortBy === 'price') {
        sortCriteria = { price: sortOrder === 'asc' ? 1 : -1 }; 
        result = await MusicProducts.find(filter)
          .sort(sortCriteria)
          .collation({ locale: 'en', numericOrdering: true });
      }
       else if (sortBy === 'alphabetical') {
        result = await MusicProducts.find(filter)
          .sort({ name: sortOrder === 'asc' ? 1 : -1 })
          .collation({ locale: 'en', strength: 2 });
      }
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching products.' });
  }
};
