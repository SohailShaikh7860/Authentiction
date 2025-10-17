import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    verifyOtp:{
        type:String,
        default: ''
    },
    verifyOtpExpiry:{
        type:Number,
        default: 0
    },
    isAccountVerified:{
        type:Boolean,
        default:false
    },
    resetOtp:{
        type:String,
        default:''
    },
    resetOtpExpiry:{
        type:Number,
        default:0
    }
},{
    timestamps:true
})

userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password,10);
    next();
})

userSchema.methods.compare = async function(password){
    return await bcrypt.compare(password,this.password);
}

const UserModel = mongoose.model('User',userSchema);

export default UserModel;