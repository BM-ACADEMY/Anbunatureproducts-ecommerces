import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        maxLength: [120, "Announcement text cannot exceed 120 characters"],
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const AnnouncementModel = mongoose.model("announcement", announcementSchema);

export default AnnouncementModel;
