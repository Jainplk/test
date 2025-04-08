const jwt = require('jsonwebtoken')

const userAuth = (req, res, next) => {
    const {token} = req.cookies;

    if(!token){
        return res.json({success:false, message:"Not Authorized Login Again"})
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        console.log("tokenDecode ", tokenDecode)

        if(tokenDecode.id){
            req.userId = tokenDecode.id
            console.log("req.userId", req.userId)
            
        }else{
            return res.json({success:false, message:"Not Authorized Login Again"})
        }

        next()
    
    } catch (error) {
        return res.json({success:false, message:error.message})
    }

}

module.exports = userAuth;