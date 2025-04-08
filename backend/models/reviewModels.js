const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    feedback :{
        type: String,
        required: true,
    },
    createdAt:{
        type:Date,
        default: Date.now(),
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
})

const Review =  mongoose.models.Review || mongoose.model("Review", reviewSchema);
module.exports = Review;