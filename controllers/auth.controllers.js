const passport = require("passport");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require('crypto');
const User = require("../models/user.model");
const resettoken = require("../models/token.model");
const getScope = passport.authenticate("google", {
  scope: ["email", "profile"]}
);

const getCallback = passport.authenticate("google", {
  successRedirect: "/welcome",
  failureRedirect: "/auth/google/failure",
  successFlash: true,
  failureFlash: true
});

const getLogout = (req, res) => {
  req.logout(err => console.error(err));
  res.redirect("/");
};

const getFailure = (req, res) => {
  res.send("USER NOT FOUND!!! Go to dashboard and try again <a href=\"/\">frontPage</a>");
};

const getLogin = (req, res) => {
  res.render("login");
};

const initialize = require("../config/local.passport");
initialize(passport);
 
const postLogin = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/welcome",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
};

const getRegister = (req, res) => {
  res.render("register");
};


const postRegister = async (req, res, next) => {
  const {  email, password } = req.body;
  const name= req.body.username

    console.log(name)
    console.log(email)
    console.log(password)

  const errors=[]
  if (!name || !email || !password ) {
    errors.push("All fields are required!");
  }

  if (errors.length > 0) {
    res.status(400).json({ error: errors });
  } else {
    //Create New User
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push("User already exists with this email!");
        res.status(400).json({ error: errors });
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          if (err) {
            errors.push(err);
            res.status(400).json({ error: errors });
          } else {
            bcrypt.hash(password, salt, (err, hash) => {
              if (err) {
                errors.push(err);
                res.status(400).json({ error: errors });
              } else {
                const newUser = new User({
                  name,
                  email,
                  password: hash,
                });
                newUser
                  .save()
                  .then(() => {
                    res.redirect("/login");
                  })
                  .catch(() => {
                    errors.push("Please try again");
                    res.status(400).json({ error: errors });
                  });
              }
            });
          }
        });
      }
    });
  }
};


var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
  
});



const getForgotPass = async (req, res) => {
  res.render("forgotpassword");
};

const forgotpassword = async(req, res) => {
  // console.log(req.body)

  const {email} = req.body;

  try {
      const userfind = await User.findOne({email:email});


      // const userToken = await resettoken.findOne({ userId: userfind._id });
      //     if (userToken) await userToken.remove();

          const otp = crypto.randomBytes(2).toString("hex");
                  const rtoken = new resettoken({ user_id: userfind._id, token: otp});
                  const setusertoken = await rtoken.save();

          console.log("here")

      if(setusertoken){
          const mailOptions = {
              from:process.env.AUTH_EMAIL,
              to:email,
              subject:"Password Reset",
              html:`<h2>Please use this OTP to reset your password</h2>
              <h1>${otp}</h1>`
          }

          transporter.sendMail(mailOptions,(error,info)=>{
              if(error){
                  console.log("error",error);
                  res.send({message:"Could not send email"})
              }else{
                  console.log("Email sent",info.response);
                  res.redirect("/passreset")
              }
          })

      }

  } catch (error) {
      res.send({message:"Invalid user"})
  }
};

const getPassReset = async (req, res) => {
  res.render("passreset");
};  


const passreset = async(req,res)=>{

  const {otp, password} = req.body;

  try {
      const validtoken = await resettoken.findOne({token: otp});
      
      const validuser = await User.findOne({_id: validtoken.user_id})

      if(validuser && validtoken){
          const newpassword = await bcrypt.hash(password,10);

          // const setnewuserpass = await User.updateOne({_id:validuser._id},{password:newpassword});
          await User.updateOne({_id: validuser._id}, {$set: {password: newpassword}})

          // setnewuserpass.save();
          res.send({message:"Password has been reset"})

      }else{
          res.send({message:"User does not exist"})
      }
  } catch (error) {
      res.send({error})
  }
}


module.exports = {
  getScope,
  getCallback,
  getLogout,
  getFailure,
  getLogin,
  postLogin,
  getRegister,
  postRegister,
  getForgotPass,
  forgotpassword,
  getPassReset,
  passreset  
};