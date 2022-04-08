const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require('./../models').User;
const Response = require('./../config/response');

exports.signup = (req, res) => {
  User.findOne({ where: { email: req.body.email } }).then((user) => {
    if (user) {
      let response = Response.getResponse(false, null, "Email address already exists.");
      return res.status(400).json(response);
    }
    User.create({
      name: req.body.name,
      email: req.body.email,
      password: bcryptjs.hashSync(req.body.password, 8),
    })
      .then((userCreated) => {
        let response = Response.getResponse(true, {user_id: userCreated.id}, "User was registered successfully!")
        res.status(200).json(response);
      })
      .catch((err) => {
        let response = Response.getResponse(false, null, err.message);
        res.status(500).json(response);
      });
  });
};

exports.signIn = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (!user) {
        let response = Response.getResponse(false, null, "Email address not found.");
        return res.status(404).json(response);
      }
      var passwordIsValid = bcryptjs.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        let response = Response.getResponse(false, null, "Invalid Password!");
        return res.status(401).json(response);
      }

      user = {
        id: user.id,
        name: user.name,
        email: user.email,
      };

      var token = jwt.sign(user, process.env.APP_SECRET_KEY, {
        expiresIn: 60 * 10,
      });

      let data = {
        id: user.id,
        name: user.name,
        email: user.email,
        accessToken: token,
      };

      let response = Response.getResponse(true, data, "Success")
      res.status(200).json(response);
    })
    .catch((err) => {
      let response = Response.getResponse(false, null, err.message)
      res.status(500).json(response);
    });
};
