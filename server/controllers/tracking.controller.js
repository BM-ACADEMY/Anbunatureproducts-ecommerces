import OrderModel from "../models/order.model";


export const getOrderTrackingController = async (request, response) => {
    try {
        const userId = request.userId; // From auth middleware
        const { productId } = request.body;

        if (!productId) {
            return response.status(400).json({
                message: "Provide productId",
                error: true,
                success: false
            });
        }

        const order = await OrderModel.findOne({
            userId: userId,
            productId: productId
        }).populate('productId delivery_address');

        if (!order) {
            return response.status(404).json({
                message: "No order found for this product and user",
                error: true,
                success: false
            });
        }

        return response.json({
            message: "Order tracking details",
            data: {
                orderId: order.orderId,
                product_details: order.product_details,
                tracking_status: order.tracking_status,
                delivery_address: order.delivery_address,
                updatedAt: order.updatedAt
            },
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
};

export const updateOrderTrackingController = async (request, response) => {
    try {
        const userId = request.userId; // From auth middleware
        const { orderId, tracking_status } = request.body;

        if (!orderId || !tracking_status) {
            return response.status(400).json({
                message: "Provide orderId and tracking_status",
                error: true,
                success: false
            });
        }

        // Validate tracking_status
        const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
        if (!validStatuses.includes(tracking_status)) {
            return response.status(400).json({
                message: "Invalid tracking status",
                error: true,
                success: false
            });
        }

        const order = await OrderModel.findOneAndUpdate(
            { orderId: orderId, userId: userId },
            { tracking_status: tracking_status },
            { new: true }
        );

        if (!order) {
            return response.status(404).json({
                message: "Order not found",
                error: true,
                success: false
            });
        }

        return response.json({
            message: "Tracking status updated successfully",
            data: {
                orderId: order.orderId,
                tracking_status: order.tracking_status,
                updatedAt: order.updatedAt
            },
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
};