import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
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
            next();
        }else{
            return res.status(401).json({ message: "Unauthorized, Invalid token" });
        }
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized, Invalid token" });
    }
}


export default userAuth;
