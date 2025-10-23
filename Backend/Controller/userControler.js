import UserModel from "../Model/User-Model.js";

const getUserData = async (req,res)=>{
    try {
        const userId = req.userId;
        const user = await UserModel.findById(userId);

        if(!user){
            return res.status(404).json({message:"User not found"});
        }

        res.json({
            success:true,
            userData:{
                name:user.name,
                isAccountVerified:user.isAccountVerified,
            }
        });
    } catch (error) {
        res.json({message:error.message});
    }
}



export {
    getUserData,
}