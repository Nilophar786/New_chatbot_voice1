import jwt from "jsonwebtoken"
const isAuth=async (req,res,next)=>{
    try {
        const token=req.cookies.token
        if(!token){
            return res.status(401).json({message:"token not found"})
        }
        const verifyToken=await jwt.verify(token,process.env.JWT_SECRET)
        req.userId=verifyToken.userId

        next()

    } catch (error) {
        console.log(error)
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({message:"invalid token"})
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({message:"token expired"})
        } else {
            return res.status(500).json({message:"authentication error"})
        }
    }
}

export default isAuth