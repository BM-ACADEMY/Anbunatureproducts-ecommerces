import SiteReviewModel from "../models/siteReview.model.js";

export const submitSiteReview = async (req, res) => {
    try {
        const { name, rating, comment } = req.body;

        if (!name || !rating || !comment) {
            return res.status(400).json({
                message: "All fields are required",
                error: true,
                success: false
            });
        }

        const newReview = new SiteReviewModel({
            name,
            rating,
            comment
        });

        await newReview.save();

        return res.status(201).json({
            message: "Review submitted successfully. It will be visible after admin verification.",
            error: false,
            success: true,
            data: newReview
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

export const getVerifiedSiteReviews = async (req, res) => {
    try {
        const reviews = await SiteReviewModel.find({ isVerified: true }).sort({ createdAt: -1 });

        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0 
            ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
            : 0;

        return res.status(200).json({
            message: "Verified reviews fetched successfully",
            error: false,
            success: true,
            data: reviews,
            totalReviews,
            averageRating
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};


export const getAllSiteReviews = async (req, res) => {
    try {
        const reviews = await SiteReviewModel.find().sort({ createdAt: -1 });

        return res.status(200).json({
            message: "All reviews fetched successfully",
            error: false,
            success: true,
            data: reviews
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

export const verifySiteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { isVerified } = req.body;

        const updatedReview = await SiteReviewModel.findByIdAndUpdate(
            id,
            { isVerified },
            { new: true }
        );

        if (!updatedReview) {
            return res.status(404).json({
                message: "Review not found",
                error: true,
                success: false
            });
        }

        return res.status(200).json({
            message: `Review ${isVerified ? 'verified' : 'unverified'} successfully`,
            error: false,
            success: true,
            data: updatedReview
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

export const deleteSiteReview = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedReview = await SiteReviewModel.findByIdAndDelete(id);

        if (!deletedReview) {
            return res.status(404).json({
                message: "Review not found",
                error: true,
                success: false
            });
        }

        return res.status(200).json({
            message: "Review deleted successfully",
            error: false,
            success: true,
            data: deletedReview
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};
