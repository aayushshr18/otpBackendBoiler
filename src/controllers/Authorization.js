const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/UserAuth");
const nodemailer = require("nodemailer");
const otpTemplate = require("../emailTemps/Otp");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.APPS_PASSWORD,
  },
});

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

exports.registration = async (req, res) => {
  try {
    const { email } = req.body;
    const newEmail = email.toLowerCase();
    const otp = generateOTP();
    const timestamp = new Date();
    timestamp.setMinutes(timestamp.getMinutes() + 3);

    if (!email) {
      return res
        .status(400)
        .json({ message: "Email is required", status: false });
    }

    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Email already exists", status: false });
    }

    const newUser = new User({
      ...req.body,
      email: newEmail,
      otp: otp,
      otpExpiry: timestamp,
    });
    await newUser.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: newEmail,
      subject: `${otp} is your OTP for authentication on your Collings Denture account`,
      html: otpTemplate(otp),
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        res.status(500).send(error.message);
      } else {
        res
          .status(200)
          .json({ success: true, message: "OTP Sent Successfully!" });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error", status: false });
  }
};

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const newEmail = email.toLowerCase();
    const otp = generateOTP();
    const timestamp = new Date();
    timestamp.setMinutes(timestamp.getMinutes() + 3);
    const user = await User.findOneAndUpdate(
      { email: newEmail },
      { $set: { otp, otpExpiry: timestamp } },
      { new: true }
    );

    if (!user) {
      return res.status(404).send("User not found");
    }

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: newEmail,
      subject: `${otp} is your OTP for authentication on your Collings Denture account`,
      html: otpTemplate(otp),
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        res.status(500).send(error.message);
      } else {
        res
          .status(200)
          .json({ success: true, message: "OTP Sent Successfully!" });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const newEmail = email.toLowerCase();
    const user = await User.findOne({ email: newEmail });

    if (!user || user.otp !== otp || user.otpExpiry < new Date()) {
      return res.status(400).json({
        msg: "Invalid or expired OTP",
        eq: user.otp !== otp,
        expi: user.otpExpiry < new Date(),
      });
    }
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.isEmailVerified = true;
    await user.save();

    const payload = {
      user: {
        id: user._id,
      },
    };

    const userToken = jwt.sign(payload, process.env.JWT_SECRET);

    res.status(200).json({ status: true, userToken: userToken });
  } catch (error) {}
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    const payload = {
      user: {
        id: user._id,
      },
    };

    const userToken = jwt.sign(payload, process.env.JWT_SECRET);
    res.status(200).json({ status: true, userToken });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.userDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select(
      "-password -createdDate -__v"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      status: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};

exports.allUserDetails = async (req, res) => {
  try {
    const users = await User.find();
    res.json({
      status: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const _id = req.user.id;
    const updates = req.body;
    if (updates.password) {
      const saltRounds = 10;
      updates.password = await bcrypt.hash(updates.password, saltRounds);
    }

    const updatedUser = await User.findByIdAndUpdate(_id, updates, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
        status: false,
      });
    }

    res.json({
      message: "User updated successfully",
      status: true,
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.user.id;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (deletedUser) {
      res.send({
        message: `Successfully deleted user ${req.user.email}`,
        status: true,
      });
    } else {
      res.send({ message: "User is not found", status: false });
    }
  } catch (error) {
    res.send({ message: "500 Internal Error", status: false });
  }
};
