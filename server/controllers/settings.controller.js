import SettingsModel from "../models/settings.model.js";

export const getSettings = async (req, res) => {
    try {
        let settings = await SettingsModel.findOne();
        if (!settings) {
            settings = await SettingsModel.create({ shippingCharge: 0 });
        }
        return res.json({
            message: "Settings fetched successfully",
            data: settings,
            success: true,
            error: false
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

export const updateSettings = async (req, res) => {
    try {
        const { shippingCharge, freeShippingThreshold } = req.body;
        
        let settings = await SettingsModel.findOne();
        if (settings) {
            settings.shippingCharge = shippingCharge;
            settings.freeShippingThreshold = freeShippingThreshold;
            await settings.save();
        } else {
            settings = await SettingsModel.create({ shippingCharge, freeShippingThreshold });
        }

        return res.json({
            message: "Settings updated successfully",
            data: settings,
            success: true,
            error: false
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};
