if(process.env.NODE_ENV != "Production"){
  require("dotenv").config()
}

// console.log(process.env)

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
})


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust-1',
      allowedFormats: ["png", "jpg", "jpeg"],
    },
  });

module.exports = {cloudinary, storage}