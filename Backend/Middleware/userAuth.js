import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    // Try to get token from cookies first, then from Authorization header
    let token = req.cookies.token;
    
    if (!token && req.headers.authorization) {
        token = req.headers.authorization.replace('Bearer ', '');
    }

    if (!token) {
        return res.status(401).json({ message: "Unauthorized, No token found" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if(decoded.id){
            req.user = decoded;
            req.userId = decoded.id;
        }else{
            return res.status(401).json({ message: "Unauthorized, Invalid token" });
        }
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized, Invalid token" });
    }
}


export default userAuth;
