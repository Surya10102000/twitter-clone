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
    
  } catch (error) {}
};


export const login = async (req, res) => {
  res.json({
    data: "You hit the login endpoint",
  });
};

export const logout = async (req, res) => {
  res.json({ data: "You hit the logout endpoint" });
};
