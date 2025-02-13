require("dotenv").config()



const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate") // it is used to use boilerpalte in ejs files like header and footer
const ExpressError = require("./utils/ExpressError.js")

const session = require("express-session")
const mongoStore = require("connect-mongo")
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local") // it is used to authnticate usename and password
const User = require("./models/user.js")


// routes
const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;


console.log(dbUrl)
main()
  .then(() => {
    console.log("Database Connect");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname, "public")))

const store = mongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("ERROR IN MONGO SESSION STORE", err);
});


const sessinOption = {
  store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
}

app.get("/", (req, res) => {
  res.redirect("/listings")
});



app.use(session(sessinOption))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success")
  res.locals.error = req.flash("error")
  res.locals.currentUser = req.user;
  next()
})

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not Found!"))
})
app.use((err, req, res, next) => {
  let { status = 500, message = "Something Went Wrong" } = err;
  // res.render(status).send(message)
  res.status(status).render("error.ejs", { message });
})



app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
