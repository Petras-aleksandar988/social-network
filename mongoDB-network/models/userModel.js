import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = mongoose.Schema({
    username :{
   type: String,
   requied: true
    },
    email:{
        type: String,
        requied: true,
        unique: true
    },
    logo :{

    },
    password:{
    type: String,
    requied: true
    }
}, {
    timestamps: true
})
userSchema.pre('save', async function (next){
if(!this.isModified('password')){
    next();
}
const salt = await bcrypt.genSalt(10)
this.password = await bcrypt.hash(this.password, salt)
})
const User = mongoose.model('User', userSchema)
export default User