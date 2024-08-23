const express = require("express")
const router = express.Router()
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js")
const { listingSchema, reviewSchema } = require("../schema.js")
const ExpressError = require("../utils/ExpressError.js")
const listingController = require("../controllers/listing.js")
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js")

// require multer and cloudinary
const multer = require("multer")
const {storage} = require("../cloudConfig.js")
const upload = multer({storage})   


//Index Route
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,  upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing));

// new route
router.get("/new", isLoggedIn, wrapAsync(listingController.newListingForm))

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single("listing[image]"),validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));

module.exports = router;