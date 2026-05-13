import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
    shippingCharge: {
        type: Number,
        default: 0
    },
    freeShippingThreshold: {
        type: Number,
        default: 0 // If 0, no threshold
    }
}, {
    timestamps: true
});

const SettingsModel = mongoose.model("Settings", settingsSchema);

export default SettingsModel;
