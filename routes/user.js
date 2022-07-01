const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt-nodejs");
const User = require("../models/user");
const City = require("../models/city");
const cityBounds = require("../util/citybounds");
require("dotenv").config();
const Password = require("./password");

router.post("/recover", Password.recover);

router.get("/reset/:token", Password.reset);

router.post("/reset/:token", Password.resetPassword);

//POST api/users/
//Register user
router.route("/").post(async (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const city = req.body.city;
  const state = req.body.state;
  const email = req.body.email;
  const password = req.body.password;
  const zip = req.body.zip;
  const streetAddress = req.body.streetAddress;
  try {
    let user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ errors: [{ message: "User with email already exists!" }] });
    }

    const newUser = new User({
      email,
      password,
      lastName,
      firstName,
      city,
      state,
      zip,
      streetAddress,
    });

    await newUser.save();

    City.findOne({ city: city }).then((response) => {
      if (response == null) {
        console.log("fetching boundaries");
        cityBounds.getCityBounds(city, state).then((response) => {
          const newCity = new City({
            city: city,
            data: response,
            state: state,
          });

          newCity.save().then((res) => {
            console.log(res);
          });
        });
      } else {
        console.log(response);
      }
    });
    //----- JWT -----
    const payload = {
      user: {
        id: newUser._id,
      },
    };

    jwt.sign(
      payload,
      "process.env.JWT_SECRET",
      { expiresIn: 360000 },
      async (err, token) => {
        if (err) throw err;
        let userInfo = await getUserInfo(token);
        console.log(userInfo);
        res.json({ token, userInfo });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
});

//GET users/
//Get list of users
router.route("/").get((req, res) => {
  User.find()
    .select("-password")
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

// @route   POST API/auth/
// @desc    login user
// @access  Public
router.post("/login", async (req, res, next) => {
  try {
    var user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).send("No user found!");
    }
    const isMatch = await bcrypt.compareSync(req.body.password, user.password);

    if (!isMatch) {
      return res.status(400).send("Invalid Credentials");
    }
    const payload = {
      user: {
        id: user._id,
      },
    };
    jwt.sign(
      payload,
      "process.env.JWT_SECRET",
      { expiresIn: 360000 }, // optional but recommended
      async (err, token) => {
        if (err) throw err;
        jwt.verify(
          token,
          "process.env.JWT_SECRET",
          function (err, decodedToken) {
            if (err) {
              /* handle token err */
            } else {
              //console.log(decodedToken.user.id);   // Add to req object
            }
          }
        );

        let userInfo = await getUserInfo(token);
        console.log(userInfo);
        res.json({ token, userInfo });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
});

async function getUserInfo(token) {
  let user = await jwt.verify(
    token,
    "process.env.JWT_SECRET",
    async function (err, decodedToken) {
      if (err) {
        console.log(err);
      } else {
        console.log("getUserInfo token", decodedToken.user.id); // Add to req object
        var id = decodedToken.user.id;
        var user2 = await User.findOne({ _id: id });
        //console.log(user)
        return user2;
      }
    }
  );
  return user;
}

module.exports = router;
