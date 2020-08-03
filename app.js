var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Comment = require("./models/comment.js"),
    Campground = require("./models/campground.js"),
    User = require("./models/user.js"),
    seedDB = require("./seeds");

mongoose.connect("mongodb+srv://aniket:aniket@123@cluster0.b0tev.mongodb.net/yelp_camp?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    console.log("Connected to the db");
}).catch(err => {
    console.log("ERROR:",err.message);
});


// requiring routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

// mongoose.connect('mongodb://localhost/yelp_camp_v10', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
    // .then(() => console.log('Connected to DB!'))
    // .catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');
app.use(methodOverride("_method"));
app.use(flash());


// seedDB();

// Passport Configuration
app.use(require("express-session")({
    secret: "This is a secret!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req,res,next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes);

// INDEX -show all campgrounds

var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("The YelpCamp Server Has Started!");
});

// <%- include("partials/header") %>
