var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

// INDEX Route - Show all campgrounds
router.get("/", function(req, res) {
  //Get all campground from DB
  Campground.find({}, function(err, allCampgrounds) {
    if (err) console.log(err);
    res.render("campgrounds/index", {campgrounds: allCampgrounds});
  });
});

// CREATE route - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res) {
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newCampground = {name: name, image: image, description: desc, author: author};
  // create a new campground and save to DB
  Campground.create(newCampground, function(err, newlyCreated) {
    if (err) console.log(err);
    // redirect to campgrounds page
    else res.redirect("/campgrounds");
  });
});

// NEW route - add a new campground to the DB
router.get("/new", middleware.isLoggedIn, function(req, res) {
  res.render("campgrounds/new");
});

// SHOW route - shows more information about a selected campground.
router.get("/:id", function(req, res) {
  //find the campground with the provided ID
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
    if (err) console.log(err);
    //render show template with that campground
    else res.render("campgrounds/show", {campground: foundCampground});
    });
});

// EDIT route - form to submit updates (Restful routing)
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
      if (err) res.redirect("/campgrounds"); //techically we dont need this error handle as
      // if the middleware passes, then we are guaranteed to not have an error
      else res.render("campgrounds/edit", {campground: foundCampground});
  });
});

// UPDATE route - where our edit form submits to (Restful routing)
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
  // find and update the correct campground
  Campground.findByIdAndUpdate(req.params.id, req.body.editCampground, function(err, editedCampground) {
    if (err) res.redirect("/campgrounds");
    else res.redirect("/campgrounds/" + req.params.id)
  });
  // redirect to the show page
});

// DESTROY campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
  Campground.findByIdAndRemove(req.params.id, function(err) {
    if (err) res.redirect("/campgrounds");
    else res.redirect("/campgrounds");
  });
});

module.exports = router;