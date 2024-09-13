import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
    content:{
   type: String,
   requied: true
    },
    post_id:{
        type: String,
        requied: true
    },
    user_id :{
        type: String,
        requied: true
    }
}, {
    timestamps: true
})
// commentSchema.pre('save', async function (next){
// if(!this.isModified('password')){
//     next();
// }
// const salt = await bcrypt.genSalt(10)
// this.password = await bcrypt.hash(this.password, salt)
// })
const Comment = mongoose.model('Comment', commentSchema)
export default Comment