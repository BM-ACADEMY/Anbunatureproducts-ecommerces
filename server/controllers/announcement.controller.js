import AnnouncementModel from "../models/announcement.model.js";

// GET - Public: returns the active announcement
export const getAnnouncementController = async (request, response) => {
    try {
        const announcement = await AnnouncementModel.findOne({ isActive: true }).sort({ updatedAt: -1 });

        return response.json({
            message: "Announcement fetched successfully",
            data: announcement,
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

// PUT - Admin only: upsert the announcement text
export const updateAnnouncementController = async (request, response) => {
    try {
        const { text, isActive } = request.body;

        if (!text || text.trim().length === 0) {
            return response.status(400).json({
                message: "Announcement text is required",
                error: true,
                success: false
            });
        }

        if (text.length > 120) {
            return response.status(400).json({
                message: "Announcement text cannot exceed 120 characters",
                error: true,
                success: false
            });
        }

        // Upsert: find the existing active announcement or create one
        const announcement = await AnnouncementModel.findOneAndUpdate(
            {},
            {
                text: text.trim(),
                isActive: isActive !== undefined ? isActive : true
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return response.json({
            message: "Announcement updated successfully",
            data: announcement,
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
