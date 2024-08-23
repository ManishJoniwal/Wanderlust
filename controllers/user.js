const User = require("../models/user.js")

module.exports.signUpForm =  (req, res) => {
    res.render("users/signup.ejs")
}

module.exports.signUp = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username })

        let ragisteredUser = await User.register(newUser, password)
        req.login(ragisteredUser, (err) => {
            if (err) {
                return next(err)
            }
            req.flash("success", "Successfully Signup")
            res.redirect("/listings")
        })
    }
    catch (err) {
        req.flash("error", err.message)
        res.redirect("/signup")
    }
}

module.exports.loginform = (req, res) => {
    res.render("users/login.ejs")
}

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome Back To Wanderlust")
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash("success", "LogOut Succfully")
        res.redirect("/listings")
    })
}