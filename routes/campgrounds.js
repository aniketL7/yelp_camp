var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware")
// var Comment = require("../models/comment");

router.get("/campgrounds", function (req, res) {
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index.ejs", { campgrounds: allCampgrounds, currentUser: req.user });
        }
    })
});
// CREATE- add new campgrounds to database
router.post("/campgrounds", middleware.isLoggedIn, function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = { name: name,price: price, image: image, description: desc, author: author };
    Campground.create(newCampground, function (err, newlyCreated) {
        //create a new campground and add to db
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
    // res.send("Post route!");
});

// NEW- show form to create new campground
router.get("/campgrounds/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new.ejs");
});

router.get("/campgrounds/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            if (!foundCampground) {
                req.flash("error", "Item not found.");
                return res.redirect("back");
            }
            res.render("campgrounds/show.ejs", { campground: foundCampground });
        }
    });

});

// Edit campground route
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err) {
            console.log(err);
        }
        if (!foundCampground) {
            req.flash("error", "Item not found.");
            return res.redirect("back");
        }
        res.render("campgrounds/edit", { campground: foundCampground });
    });
});

router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function (req, res) {
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            if (!updatedCampground) {
                req.flash("error", "Item not found.");
                return res.redirect("back");
            }
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// destroy campground route
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/campgrounds");
        }
        Comment.deleteMany({ _id: { $in: campgroundRemoved.comments } }, (err) => {
            if (err) {
                console.log(err);
            }
            res.redirect("/campgrounds");
        });
    });
});

module.exports = router;