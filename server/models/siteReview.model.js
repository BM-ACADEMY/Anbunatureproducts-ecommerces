import mongoose from "mongoose";

const siteReviewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    rating: {
        type: Number,
        required: [true, "Rating is required"],
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: [true, "Comment is required"],
        trim: true
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const SiteReviewModel = mongoose.model("siteReview", siteReviewSchema);

export default SiteReviewModel;
