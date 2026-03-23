import BannerModel from "../models/banner.model.js";

export const addBannerController = async (request, response) => {
    try {
        const { desktopImage, mobileImage, altText, order, link } = request.body;

        if (!desktopImage || !mobileImage) {
            return response.status(400).json({
                message: "Provide both desktop and mobile image URLs",
                error: true,
                success: false
            });
        }

        // Check banner count limit (Max 5)
        const bannerCount = await BannerModel.countDocuments();
        if (bannerCount >= 5) {
            return response.status(400).json({
                message: "Maximum limit of 5 banners reached. Please delete one before adding another.",
                error: true,
                success: false
            });
        }

        const newBanner = new BannerModel({
            desktopImage,
            mobileImage,
            altText,
            order: order || 0,
            link: link || ""
        });

        const savedBanner = await newBanner.save();

        return response.json({
            message: "Banner added successfully",
            data: savedBanner,
            success: true,
            error: false
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

export const getBannersController = async (request, response) => {
    try {
        const banners = await BannerModel.find().sort({ order: 1 });

        return response.json({
            message: "Banners fetched successfully",
            data: banners,
            success: true,
            error: false
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

export const deleteBannerController = async (request, response) => {
    try {
        const { id } = request.body;

        if (!id) {
            return response.status(400).json({
                message: "Provide banner ID",
                error: true,
                success: false
            });
        }

        const deleteBanner = await BannerModel.findByIdAndDelete(id);

        if (!deleteBanner) {
            return response.status(404).json({
                message: "Banner not found",
                error: true,
                success: false
            });
        }

        return response.json({
            message: "Banner deleted successfully",
            data: deleteBanner,
            success: true,
            error: false
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

export const updateBannerController = async (request, response) => {
    try {
        const { _id, desktopImage, mobileImage, altText, order, link } = request.body;

        if (!_id) {
            return response.status(400).json({
                message: "Provide banner ID",
                error: true,
                success: false
            });
        }

        const updateBanner = await BannerModel.findByIdAndUpdate(_id, {
            desktopImage,
            mobileImage,
            altText,
            order,
            link
        }, { new: true });

        if (!updateBanner) {
            return response.status(404).json({
                message: "Banner not found",
                error: true,
                success: false
            });
        }

        return response.json({
            message: "Banner updated successfully",
            data: updateBanner,
            success: true,
            error: false
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};
