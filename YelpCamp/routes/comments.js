var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// Comments New
router.get("/new", middleware.isLoggedIn, function(req, res) {
  //find the campground with the provided ID
  Campground.findById(req.params.id, function(err, foundCampground) {
    if (err) console.log(err);
    else res.render("comments/new", {campground: foundCampground});
  });
});

// Comments Create
router.post("/", middleware.isLoggedIn, function(req, res) {
  // lookup campground using ID
  Campground.findById(req.params.id, function(err, foundCampground) {
    if (err) {
      req.flash("error", "Something went wrong.");
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      // create new comment
      Comment.create(req.body.comment, function(err, comment) {
        if (err) console.log(err);
        else {
          // add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // save comment
          comment.save();
          // connect new comment to campground
          foundCampground.comments.push(comment);
          foundCampground.save();
          req.flash("success", "Successfully added comment.");
          // redirect to show page of selected campground
          res.redirect("/campgrounds/" + foundCampground._id);
        }
      });
    }
  });
});

// Comments Edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
  Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err) res.redirect("back");
      else res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
  });
});

// Comments Update route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.editComment, function(err, updatedComment) {
    if (err) res.redirect("back");
    else {
      req.flash("success", "Comment deleted.");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// Comments destroy route (/campgrounds/:id/comments/:comment_id)
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
  // findByIdAndRemove
  Comment.findByIdAndRemove(req.params.comment_id, function(err) {
    if (err) res.redirect("back");
    else res.redirect("/campgrounds/" + req.params.id);
  });
});

module.exports = router;