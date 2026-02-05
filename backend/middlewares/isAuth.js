import jwt from "jsonwebtoken"

const isAuth = async (req, res, next) => {
  try {
    // Try cookie first, then Authorization header (Bearer)
    let token = null

    if (req.cookies && req.cookies.token) {
      token = req.cookies.token
    } else if (req.headers && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({ message: "token not found" })
    }

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = verifyToken.userId
    next()
  } catch (error) {
    console.error('isAuth error:', error)
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'invalid token' })
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'token expired' })
    } else {
      return res.status(500).json({ message: 'authentication error' })
    }
  }
}

export default isAuth
