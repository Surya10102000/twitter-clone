import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import { generateTokenAndSetCookie } from "../lib/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { username, fullname, email, password } = req.body;

    const emailRegex = /^[a-zA-Z0–9._-]+@[a-zA-Z0–9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const existingUser = await User.findOne({username})
    if(existingUser){
        return res.status(400).json({ error : "Username is already taken"})
    }

    const existingEmail = await User.findOne({email})
    if(existingEmail){
        return res.status(400).json({ error : "Email is already registered"})
    }

    if(password.length < 6){
        return res.status(400).json({ error : "Password must be at least 6 characters long"})
    }

    //hash password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
        fullname ,
        username ,
        email ,
        password : hashedPassword
    })

    if(newUser){
         generateTokenAndSetCookie(newUser._id, res)
         await newUser.save();
 
         res.status(201).json({
            fullname : newUser.fullname,
            username : newUser.username,
            email : newUser.email,
            followers : newUser.followers,
            following : newUser.following,
            profileImg : newUser.profileImg,
            converImg: newUser.coverImg
         })
    }else{
        res.status(400).json({ error : "Invalid user data" })
    }
    
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error : "Internal Server Error"})
  }
};


export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({username});
    if(!user){
      return res.status(400).json({ error : "Invalid username"})
    }

    const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")
    if(!isPasswordCorrect){
      return res.status(400).json({ error : "Invalid password"})
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id : user._id,
      fullname : user.fullname,
      username : user.username,
      email : user.email,
      followers : user.followers,
      following : user.following,
      profileImg : user.profileImg,
      converImg: user.coverImg
   })


  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error : "Internal Server Error"})
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie('jwt',"",{maxAge : 0})
    res.status(200).json({ message : "Logged out successfully "})
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error : "Internal Server Error"})
  }
};

export const 