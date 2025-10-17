import UserModel from "../Model/User-Model.js";
import jwt from "jsonwebtoken";
import transporter from "../Config/nodemailer.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(401).json({ message: "All fields are required" });
  }

  try {
    const findUser = await UserModel.findOne({ email });
    if (findUser) {
      return res.status(401).json({ message: "User already exists" });
    }

    const user = await UserModel.create({
      name,
      email,
      password
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15min",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Welcome to Our Platform",
      text: `Hello ${user.name},\n\nThank you for registering on our platform.\n\nBest regards,\nTeam`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
    
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(401)
      .json({ message: "Email and password  are required" });
  }

  try {
    const user = await UserModel.findOne({
      email,
    });

    if (!user) {
      return res.status(401).json({ message: "User Not Found" });
    }

    const isPasswordMatched = await user.compare(password);
    if (!isPasswordMatched) {
      return res.status(401).json({ message: "Password did not match" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15min",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: "Login Successful" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const logOut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.status(200).json({ message: "Logout Successful" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};


const sendVerifyOtp = async (req, res) => {
  try {
    const {userId} = req.body;

    const user = await UserModel.findById(userId);
    if(user.isAccountVerified) {
      return res.status(404).json({message: "Account already verified"});
    }

 const otp = String(Math.floor(100000 + Math.random() * 900000));
   
  user.verifyOtp = otp;
  user.verifyOtpExpiry = Date.now() + 24 * 60 * 60 * 1000

  await user.save();

  //incomplete
  res.json({message: "OTP sent to your email"});
  } catch (error) {
    res.json({ message: error.message });
  }
}

const verifyEmail = async (req, res) => {
   const {userId, otp} = req.body;

   if(!userId || !otp) {
    return res.status(404).json({message: "Missing required params"});
   }

   try {
     const user = await UserModel.findById(userId);
     if(!user) {
      return res.status(404).json({message: "User not found"});
     }
     if(user.verifyOtp === '' || user.verifyOtp !== otp){
      return res.status(404).json({message: "Invalid OTP"});
     }

     if(user.verifyOtpExpiry < Date.now()){
      return res.status(404).json({message: "OTP Expired"});
     }

     user.isAccountVerified = true;
     user.verifyOtp = '';
     user.verifyOtpExpiry = 0;

     await user.save();
     return res.status(200).json({message: "Account verified successfully"});
   } catch (error) {
     return res.status(500).json({message: error.message});
   }
}

export { register, login, logOut, sendVerifyOtp, verifyEmail };
