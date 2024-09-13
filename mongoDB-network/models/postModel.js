import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    content:{
   type: String,
   requied: true
    },
    likes:{
        type: Number
    },
    user_id :{
        type: String,
        requied: true
    }
}, {
    timestamps: true
})
// postSchema.pre('save', async function (next){
// if(!this.isModified('password')){
//     next();
// }
// const salt = await bcrypt.genSalt(10)
// this.password = await bcrypt.hash(this.password, salt)
// })
const Post = mongoose.model('Post', postSchema)
export default Post