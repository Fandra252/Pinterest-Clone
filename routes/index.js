var express = require('express');
var router = express.Router();
const userModel = require('./users');
const postModel = require('./posts');
const passport = require('passport');
const upload = require('./multer');


// Passport Setup
const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));

/* GET Register page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

/* GET Login page. */
router.get('/login', function (req, res, next) {
  res.render('login', { error: req.flash('error') });
});

/* GET Profile page. */
router.get('/profile', isLoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  })
    .populate("posts");
  console.log(user)
  res.render("profile", { user });
});

/* GET Feed page. */
router.get('/feed', isLoggedIn, async function (req, res, next) {
  try {
    const posts = await postModel.find();
    const user = await userModel.findOne({
      username: req.session.passport.user
    })
      .populate("posts");
    console.log(user);
    res.render("feed", { post: posts, user });
  } catch (error) {
    next(error);
  }
});

/* GET Upload page. */
router.get('/upload', isLoggedIn, async (req, res) => {
  const user = await userModel.findOne({
    username: req.session.passport.user
  })
    .populate("posts");
  console.log(user);
  res.render("upload", { user });
})

// Upload functionality to create pen
router.post('/upload', isLoggedIn, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No files were uploaded');
  }
  // Getting the login user details
  const user = await userModel.findOne({ username: req.session.passport.user });
  // creating post in login user
  const post = await postModel.create({
    image: req.file.filename,
    postText: req.body.filecaption,
    user: user._id
  });
  user.posts.push(post._id);
  await user.save();
  res.redirect('/profile');

});

// register functionality
router.post('/register', (req, res) => {
  const { username, email} = req.body;
  const userData = new userModel({ username, email});

  userModel.register(userData, req.body.password)
    .then(function () {
      passport.authenticate("local")(req, res, function () {
        res.redirect('/profile');
      })
    })
})

// Login Functionality & Flash messages(error messages)
router.post('/login', passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true
}), (req, res) => {
});

// Logout route & Functionality for logout the user 
router.get('/logout', (req, res) => {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});

// Login Functionality (It check user login or not)
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
};

// router.get('/alluserposts', async(req, res) => {
//   let user = await userModel.findOne({_id: "65d4d1e30b009e6db416123d"}).populate('posts');
//   res.send(user);
// });

// router.get('/createuser', async (req, res) => {
//     let createduser = await userModel.create({
//       username: "nitin",
//       password: "nitin69",
//       posts:[],
//       email: "nitin@gmail.com",
//       fullName: "Nitin Choudhary",
//     });
//     res.send(createduser);
// });

// router.get('/createpost', async (req, res) => {
//   let createdpost = await postModel.create({
//     postText: "Gym post after workout",
//     user: "65d4d1e30b009e6db416123d"
//   });
//   let user = await userModel.findOne({_id: "65d4d1e30b009e6db416123d"});
//   user.posts.push(createdpost._id);
//   await user.save();
//   res.send("done");
// });

module.exports = router;
