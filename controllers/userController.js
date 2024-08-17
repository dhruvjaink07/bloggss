const User = require("./../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require('crypto');

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check for missing fields
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "User already exists in the database" });
    }

    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Creating new user
    const user = new User({ ...req.body, password: hashedPassword });
    await user.save();

    // Generating JWT token
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    // Sending response with token
    return res
      .cookie("token", token, { httpOnly: true })
      .status(201)
      .json({
        success: true,
        message: "User Registered successfully",
        data: { user },
      });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "An error occurred while registering the user",
      error: error.message,
    });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if all fields are filled
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill in all the details" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if password is correct
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Generating JWT token
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    // Sending response with token
    return res
      .cookie("token", token, { httpOnly: true })
      .status(200)
      .json({
        status: "success",
        message: "Logged in successfully",
        data: { user },
      });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "An error occurred during login",
      error: error.message,
    });
  }
};

// Get Profile
exports.getProfile = async (req, res) => {
  try {
    // Accessing req.user populated by isAuthenticated middleware
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "An error occurred",
      error: error.message,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const {email} = req.body;
    const user = await User.findOne({email});

    if(!user){
        res.json({message:"Users Does not exist in Database"});
    }

    // Generate reset-token and set expiration date
    // const resetToken = crypto.randomBytes(20).toString('hex');
    // user.resetPasswordToken = resetToken;
    // user.resetPasswordExpires = Date.now()+3600000; // 1 hour
    // await user.save();

    // Send reset URL
    // const resetURL = `http://${req.headers.host}/reset/${resetToken}`;

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: "gmail", // Use "gmail" service
      secure: true,
      port: 465,
      auth: {
        user: process.env.EMAIL, // your Gmail address
        pass: process.env.PASS,  // your Gmail password or App-specific password
        
      },
    });

    // setup email data
    let info = await transporter.sendMail({
      from: '"Dhruv" <jaindhruv25006@gmail.com>', // sender address
      to: email, // list of receivers
      subject: 'Password Reset',
      text: "Hello"
      // html: `<p>You requested a password reset. Click the link below to reset your password:</p>
      //        <a href="${resetURL}">Reset Password</a>`,
    });

    console.log("Message sent: %s", info.messageId);
    res.json({ message: "Password reset email sent", info });
  } catch (error) {
    console.error("Error sending email: ", error);
    res.status(500).send({ message: "Failed to send email", error });
  }
};
