import mongoose from "mongoose";

const foundationSchema = new mongoose.Schema({
    title: {
        type: String,
        default: "Donate to Foundation"
    },
    description: {
        type: String,
        default: "Support transformative social work in India"
    },
    amounts: {
        type: [Number],
        default: [10, 20, 50, 100]
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const FoundationModel = mongoose.model("foundation", foundationSchema);

export default FoundationModel;
