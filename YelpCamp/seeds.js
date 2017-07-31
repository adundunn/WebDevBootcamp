var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
  {
    name: "Matarangi",
    image: "https://c1.staticflickr.com/5/4156/34533119056_51fca34dff_b.jpg",
    description: "Kielbasa boudin drumstick frankfurter hamburger pork loin. Flank ham picanha pork, doner t-bone hamburger kielbasa pig pork loin pastrami porchetta. Sausage turkey bresaola, ham drumstick chuck swine beef ribs cupim shankle ground round. Pastrami shoulder ham hock prosciutto brisket jowl kielbasa kevin chicken cupim shank ground round flank turducken hamburger. T-bone salami prosciutto, bacon spare ribs brisket capicola shank tail ham short ribs. Swine sausage drumstick rump turducken. Pig tail rump, meatloaf strip steak pork belly shank corned beef flank."
  },
  {
    name: "Whangamata",
    image: "https://farm8.staticflickr.com/7285/8737935921_47343b7a5d.jpg",
    description: "Kielbasa boudin drumstick frankfurter hamburger pork loin. Flank ham picanha pork, doner t-bone hamburger kielbasa pig pork loin pastrami porchetta. Sausage turkey bresaola, ham drumstick chuck swine beef ribs cupim shankle ground round. Pastrami shoulder ham hock prosciutto brisket jowl kielbasa kevin chicken cupim shank ground round flank turducken hamburger. T-bone salami prosciutto, bacon spare ribs brisket capicola shank tail ham short ribs. Swine sausage drumstick rump turducken. Pig tail rump, meatloaf strip steak pork belly shank corned beef flank."
  },
  {
    name: "Hot Water Beach",
    image: "https://farm5.staticflickr.com/4176/34533122526_117cf4db99_o_d.jpg",
    description: "Kielbasa boudin drumstick frankfurter hamburger pork loin. Flank ham picanha pork, doner t-bone hamburger kielbasa pig pork loin pastrami porchetta. Sausage turkey bresaola, ham drumstick chuck swine beef ribs cupim shankle ground round. Pastrami shoulder ham hock prosciutto brisket jowl kielbasa kevin chicken cupim shank ground round flank turducken hamburger. T-bone salami prosciutto, bacon spare ribs brisket capicola shank tail ham short ribs. Swine sausage drumstick rump turducken. Pig tail rump, meatloaf strip steak pork belly shank corned beef flank."
  }
];

function seedDB() {
  // Remove all campgrounds
  Campground.remove({}, function (err) {
    if (err) console.log(err);
    console.log("Removed Campgrounds!");
    
    // add a few campgrounds
    data.forEach(function(seed) {
      Campground.create(seed, function(err, campground) {
        if (err) console.log(err);
        else {
          console.log("Added a campground");
          
          // add a few comments
          Comment.create({
            text: "No internet, no dogs. 2/10",
            author: "yoMOM"
          }, function(err, comment) {
            if (err) console.log(err);
            else {
              campground.comments.push(comment);
              campground.save();
              console.log("Created new comment");
            }
          });
        }
      });
    });
  });
}

module.exports = seedDB; //no brackets as we don't it to execute here