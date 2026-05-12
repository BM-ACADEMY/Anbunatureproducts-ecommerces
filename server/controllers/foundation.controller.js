import FoundationModel from "../models/foundation.model.js";

export async function updateFoundationController(request, response) {
    try {
        const { title, description, amounts, isActive } = request.body;

        let foundation = await FoundationModel.findOne();

        if (foundation) {
            foundation.title = title;
            foundation.description = description;
            foundation.amounts = amounts;
            foundation.isActive = isActive;
            await foundation.save();
        } else {
            foundation = await FoundationModel.create({
                title,
                description,
                amounts,
                isActive
            });
        }

        return response.json({
            message: "Foundation settings updated successfully",
            error: false,
            success: true,
            data: foundation
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function getFoundationController(request, response) {
    try {
        let foundation = await FoundationModel.findOne();

        if (!foundation) {
            // Create default if not exists
            foundation = await FoundationModel.create({
                title: "Donate to Foundation",
                description: "Support transformative social work in India",
                amounts: [10, 20, 50, 100],
                isActive: true
            });
        }

        return response.json({
            message: "Foundation settings",
            data: foundation,
            error: false,
            success: true
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}
