import genToken from "../config/token.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { isDisposableEmail } from "../utils/emailUtils.js"

export const signUp=async (req,res)=>{
    try {
        const {name,email,password}=req.body

        // Validate required fields
        if(!name || !email || !password){
            return res.status(400).json({message:"All fields are required"})
        }


        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if(!emailRegex.test(email)){
            return res.status(400).json({message:"Please enter a valid email address"})
        }

        // Check for disposable email domains
        if (isDisposableEmail(email)) {
            return res.status(400).json({message:"Disposable email addresses are not allowed. Please use a permanent email address."})
        }
        // Check if email already exists
        const existEmail=await User.findOne({email})
        if(existEmail){
            return res.status(400).json({message:"Email already exists!"})
        }

        // Validate password length
        if(password.length<6){
            return res.status(400).json({message:"Password must be at least 6 characters long"})
        }

        // Hash password
        const hashedPassword=await bcrypt.hash(password,10)

        // Create user
        const user=await User.create({
            name: name.trim(),
            password:hashedPassword,
            email: email.toLowerCase().trim()
        })

        // Generate token
        const token=await genToken(user._id)

        // Set cookie
        res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000
});

        console.log(`User created successfully: ${user.email}`)
        return res.status(201).json({
            message: "Account created successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })

    } catch (error) {
        console.error("SignUp error:", error)
        return res.status(500).json({message:`Sign up failed: ${error.message}`})
    }
}

export const Login=async (req,res)=>{
try {
    const {email,password}=req.body

    // Validate required fields
    if(!email || !password){
        return res.status(400).json({message:"Email and password are required"})
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if(!emailRegex.test(email)){
        return res.status(400).json({message:"Please enter a valid email address"})
    }

    // Check for disposable email domains
    if (isDisposableEmail(email)) {
        return res.status(400).json({message:"Disposable email addresses are not allowed. Please use a permanent email address."})
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    const user=await User.findOne({email: normalizedEmail})
    if(!user){
        return res.status(400).json({message:"Email does not exist!"})
    }
   const isMatch=await bcrypt.compare(password,user.password)

   if(!isMatch){
   return res.status(400).json({message:"Incorrect password"})
   }

    const token=await genToken(user._id)

res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  domain: ".onrender.com",
  maxAge: 7 * 24 * 60 * 60 * 1000
});

    return res.status(200).json(user)

} catch (error) {
       return res.status(500).json({message:`Login error: ${error.message}`})
}
}

export const logOut=async (req,res)=>{
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        })
         return res.status(200).json({message:"log out successfully"})
    } catch (error) {
         return res.status(500).json({message:`logout error ${error}`})
    }
}

// Google OAuth functions
export const googleAuth = async (req, res) => {
    try {
        const { credential } = req.body;

        // Decode the Google credential token
        const decodedToken = jwt.decode(credential);

        if (!decodedToken || !decodedToken.email) {
            return res.status(400).json({ message: "Invalid Google credential" });
        }

        const { email, name, picture } = decodedToken;

        // Check for disposable email domains
        if (isDisposableEmail(email)) {
            return res.status(400).json({ message: "Disposable email addresses are not allowed. Please use a permanent email address." });
        }

        // Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
            // Create new user for Google OAuth
            user = await User.create({
                name: name || email.split('@')[0],
                email,
                password: await bcrypt.hash(Math.random().toString(36), 10), // Random password for Google users
                avatar: picture
            });
        }

        const token = await genToken(user._id);
res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000
});


        return res.status(200).json(user);

    } catch (error) {
        console.error("Google auth error:", error);
        return res.status(500).json({ message: `Google authentication error: ${error.message}` });
    }
}
