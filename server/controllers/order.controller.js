import Stripe from "../config/stripe.js";
import CartProductModel from "../models/cartproduct.model.js";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import ProductModel from "../models/product.model.js";
import mongoose from "mongoose";
import sendEmail from "../config/sendEmail.js";
import orderConfirmationTemplate from "../email/templates/orderConfirmationTemplate.js";
import AddressModel from "../models/address.model.js";
import CategoryModel from "../models/category.model.js";
import SubCategoryModel from "../models/subCategory.model.js";

export async function CashOnDeliveryOrderController(req, res) {
  try {
    const userId = req.userId;
    const { list_items, addressId, customImage } = req.body;

    if (!list_items || !addressId) {
      return res.status(400).json({
        message: "Provide list_items and addressId",
        error: true,
        success: false,
      });
    }

    const commonGroupId = `GRP-${new mongoose.Types.ObjectId()}`;

    const payload = await Promise.all(
      list_items.map(async (el) => {
        const cartItem = await CartProductModel.findById(el._id).populate("productId");
        if (!cartItem) {
          throw new Error(`Cart item ${el._id} not found`);
        }

        let productBasePrice = cartItem.selectedAttributes.reduce(
          (sum, attr) => sum + (attr.price || 0),
          0
        );

        const itemTotal = productBasePrice * el.quantity;

        return {
          userId,
          orderId: `ORD-${new mongoose.Types.ObjectId()}`,
          groupId: commonGroupId,
          productId: cartItem.productId._id,
          product_details: {
            name: cartItem.productId.name,
            image: cartItem.productId.image,
            selectedAttributes: cartItem.selectedAttributes,
          },
          quantity: el.quantity,
          paymentId: "",
          payment_status: "Online Payment",
          delivery_address: addressId,
          subTotalAmt: itemTotal,
          totalAmt: itemTotal,
          customImage: customImage || "",
        };
      })
    );

    const generatedOrder = await OrderModel.insertMany(payload);

    for (const item of list_items) {
      const cartItem = await CartProductModel.findById(item._id).populate("productId");
      const product = cartItem.productId;

      for (const selectedAttr of cartItem.selectedAttributes) {
        const attrGroup = product.attributes.find(
          (attr) => attr.name === selectedAttr.attributeName
        );
        const option = attrGroup?.options.find(
          (opt) => opt.name === selectedAttr.optionName
        );
        if (option && typeof option.stock === "number") {
          option.stock = Math.max(0, option.stock - item.quantity);
          product.markModified("attributes");
          await product.save();
        }
      }
    }

    await CartProductModel.deleteMany({ userId });
    await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });

    const user = await UserModel.findById(userId);
    const delivery = await AddressModel.findById(addressId); // Fetch delivery address details

    const emailPayload = {
      fullName: user.name,
      orderId: payload[0].orderId,
      orderDate: new Date().toLocaleDateString(),
      totalAmount: payload.reduce((sum, item) => sum + item.totalAmt, 0),
      items: payload.map(item => ({
        name: item.product_details.name,
        quantity: item.quantity,
        price: item.subTotalAmt,
        attributes: item.product_details.selectedAttributes
          .map(attr => `${attr.attributeName}: ${attr.optionName}`)
          .join(", "),
      })),
      deliveryAddress: {
        // --- ADDED fullName and mobile HERE ---
        fullName: delivery?.fullName || user.name, // Use delivery's full name, fallback to user's name
        mobile: delivery?.mobile || user.mobile, // Use delivery's mobile, fallback to user's mobile
        address_line: delivery.address_line,
        city: delivery.city,
        state: delivery.state,
        pincode: delivery.pincode,
        country: delivery.country,
      },
      customImageUrl: customImage || "",
    };

    await sendEmail({
      sendTo: user.email,
      subject: `Order Confirmation - ${emailPayload.orderId}`,
      html: orderConfirmationTemplate(emailPayload),
    });

    await sendEmail({
      sendTo: process.env.EMAIL_USER,
      subject: `New Order Received - ${emailPayload.orderId}`,
      html: orderConfirmationTemplate(emailPayload),
    });

    return res.json({
      message: "Order created successfully",
      error: false,
      success: true,
      data: generatedOrder,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to create order",
      error: true,
      success: false,
    });
  }
}

// ... (rest of your controllers and functions remain unchanged) ...

export const pricewithDiscount = (price, dis = 0) => {
    const discountAmount = Math.ceil((Number(price) * Number(dis)) / 100);
    const actualPrice = Number(price) - Number(discountAmount);
    return actualPrice;
};

export async function paymentController(request, response) {
    try {
        const userId = request.userId; // From auth middleware
        const { list_items, addressId } = request.body;

        // Validate input
        if (!list_items || !addressId) {
            return response.status(400).json({
                message: "Provide list_items and addressId",
                error: true,
                success: false,
            });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return response.status(404).json({
                message: "User not found",
                error: true,
                success: false,
            });
        }

        // Create Stripe line items
        const line_items = list_items.map((item) => {
            let productBasePrice = 0;
            // Start of the fix: Extract price from the first option of the first attribute group
            if (item.productId.attributes && item.productId.attributes.length > 0) {
                const firstAttributeGroup = item.productId.attributes[0];
                if (firstAttributeGroup.options && firstAttributeGroup.options.length > 0) {
                    const firstOption = firstAttributeGroup.options[0];
                    if (typeof firstOption.price === 'number' && !isNaN(firstOption.price)) {
                        productBasePrice = firstOption.price;
                    }
                }
            }
            // End of the fix: Extract price

            return {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: item.productId.name,
                        images: item.productId.image,
                        metadata: {
                            productId: item.productId._id,
                        },
                    },
                    unit_amount: productBasePrice * 100, // Price in paise
                },
                adjustable_quantity: {
                    enabled: true,
                    minimum: 1,
                },
                quantity: item.quantity, // Quantity passed to Stripe
            };
        });

        const params = {
            submit_type: "pay",
            mode: "payment",
            payment_method_types: ["card"],
            customer_email: user.email,
            metadata: {
                userId: userId,
                addressId: addressId,
            },
            line_items: line_items,
            success_url: `${process.env.PRODUCTION_URL}/success`,
            cancel_url: `${process.env.PRODUCTION_URL}/cancel`,
        };

        const session = await Stripe.checkout.sessions.create(params);

        return response.status(200).json(session);
    } catch (error) {
        console.log("Payment error:", error.message);
        return response.status(500).json({
            message: error.message || "Failed to initiate payment",
            error: true,
            success: false,
        });
    }
}

export const getOrderProductItems = async ({ lineItems, userId, addressId, paymentId, payment_status, groupId }) => {
    const productList = [];

    if (lineItems?.data?.length) {
        for (const item of lineItems.data) {
            const product = await Stripe.products.retrieve(item.price.product);

            const payload = {
                userId: userId,
                orderId: `ORD-${new mongoose.Types.ObjectId()}`,
                groupId: groupId,
                productId: product.metadata.productId,
                product_details: {
                    name: product.name,
                    image: product.images,
                },
                quantity: item.quantity, // Explicitly set quantity from Stripe
                paymentId: paymentId,
                payment_status: payment_status,
                delivery_address: addressId,
                subTotalAmt: Number(item.amount_total / 100), // Amount for this product (includes quantity)
                totalAmt: Number(item.amount_total / 100), // Same as subTotalAmt
            };

            productList.push(payload);
        }
    }

    return productList;
};

export async function webhookStripe(request, response) {
    const event = request.body;
    const endPointSecret = process.env.STRIPE_ENPOINT_WEBHOOK_SECRET_KEY;

    try {
        switch (event.type) {
            case "checkout.session.completed":
                const session = event.data.object;
                const lineItems = await Stripe.checkout.sessions.listLineItems(session.id);
                const userId = session.metadata.userId;
                const addressId = session.metadata.addressId;

                const orderProduct = await getOrderProductItems({
                    lineItems: lineItems,
                    userId: userId,
                    addressId: addressId,
                    paymentId: session.payment_intent,
                    payment_status: session.payment_status,
                    groupId: session.id, // Use Stripe session ID as groupId
                });

                const order = await OrderModel.insertMany(orderProduct);

                // Start of the fix: Stock Reduction for Online orders
                // This assumes stock needs to be reduced for the first option of the first attribute group.
                // For precise stock reduction of selected variants, cart item needs to store selected attribute details.
                if (order.length > 0) { // Check if orders were successfully created
                    for (const item of order) { // Iterate through the created orders
                        const productId = item.productId; // This is the ObjectId of the product
                        const quantityToReduce = item.quantity;

                        // Fetch the product to update its specific attribute option stock
                        const product = await ProductModel.findById(productId);

                        if (product && product.attributes && product.attributes.length > 0) {
                            const firstAttributeGroup = product.attributes[0];
                            if (firstAttributeGroup.options && firstAttributeGroup.options.length > 0) {
                                const firstOption = firstAttributeGroup.options[0];

                                if (firstOption.stock !== null && typeof firstOption.stock === 'number' && !isNaN(firstOption.stock)) {
                                    firstOption.stock = Math.max(0, firstOption.stock - quantityToReduce);
                                } else {
                                    console.warn(`Product ${productId}, attribute option ${firstOption.name}: Stock is not a tracked number (null/undefined/NaN). Not reducing.`);
                                }
                            }
                            product.markModified('attributes'); // Mark nested array as modified for Mongoose to save changes
                            await product.save(); // Save the updated product with reduced stock
                        }
                    }
                }
                // End of the fix: Stock Reduction

                if (order.length > 0) {
                    await UserModel.findByIdAndUpdate(userId, { shopping_cart: [] });
                    await CartProductModel.deleteMany({ userId: userId });
                }

                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        response.json({ received: true });
    } catch (error) {
        console.log("Webhook error:", error.message);
        response.status(400).json({ error: error.message });
    }
}

export async function getOrderDetailsController(request, response) {
    try {
        const userId = request.userId;

        const orderList = await OrderModel.find({ userId })
            .sort({ createdAt: -1 })
            .populate("delivery_address")
            .populate("productId")
            .populate("userId", "name email");

        return response.json({
            message: "Order list",
            data: orderList,
            error: false,
            success: true,
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}

export async function getAllOrdersController(request, response) {
    try {
        const orderList = await OrderModel.find({ isDeleted: false })
            .sort({ createdAt: -1 })
            .populate("delivery_address")
            .populate("productId")
            .populate("userId", "name email");

        return response.json({
            message: "All orders",
            data: orderList,
            error: false,
            success: true,
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}

export async function cancelOrderController(request, response) {
    try {
        const userId = request.userId;
        const { orderId, cancellationReason } = request.body;

        if (!orderId || !cancellationReason) {
            return response.status(400).json({
                message: "Provide orderId and cancellationReason",
                error: true,
                success: false,
            });
        }

        const order = await OrderModel.findOne({ orderId, userId });

        if (!order) {
            return response.status(404).json({
                message: "Order not found",
                error: true,
                success: false,
            });
        }

        if (order.isCancelled) {
            return response.status(400).json({
                message: "Order is already cancelled",
                error: true,
                success: false,
            });
        }

        if (order.tracking_status === "Shipped" || order.tracking_status === "Delivered") {
            return response.status(400).json({
                message: "Cannot cancel order that is Shipped or Delivered",
                error: true,
                success: false,
            });
        }

        const updatedOrder = await OrderModel.findOneAndUpdate(
            { orderId, userId },
            {
                isCancelled: true,
                cancellationReason,
                cancellationDate: new Date(),
                tracking_status: "Cancelled",
            },
            { new: true }
        );

        return response.json({
            message: "Order cancelled successfully",
            data: updatedOrder,
            error: false,
            success: true,
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}

export async function updateTrackingStatusController(request, response) {
    try {
        const { orderId, tracking_status, groupId } = request.body;
        const userId = request.userId;

        if (!orderId && !groupId) {
            return response.status(400).json({
                message: "Provide orderId or groupId",
                error: true,
                success: false,
            });
        }

        const validStatuses = ["Pending", "Processing", "Shipped", "Delivered"];
        if (!validStatuses.includes(tracking_status)) {
            return response.status(400).json({
                message: "Invalid tracking status",
                error: true,
                success: false,
            });
        }

        // Find existing order(s)
        const filter = groupId ? { groupId, isDeleted: false } : { orderId, isDeleted: false };
        const orders = await OrderModel.find(filter);

        if (!orders.length) {
            return response.status(404).json({
                message: "Order(s) not found",
                error: true,
                success: false,
            });
        }

        // Check if any order in the group is cancelled
        const hasCancelled = orders.some(o => o.isCancelled);
        if (hasCancelled && !groupId) { // For individual order, block if cancelled
             return response.status(400).json({
                message: "Cannot update tracking for cancelled order",
                error: true,
                success: false,
            });
        }
        
        // For groups, we only update non-cancelled ones later, or block if all are cancelled
        const nonCancelledOrders = orders.filter(o => !o.isCancelled);
        if (!nonCancelledOrders.length) {
             return response.status(400).json({
                message: "All items in this group are cancelled",
                error: true,
                success: false,
            });
        }

        // Prevent moving backward (check against each order)
        const statusOrder = ["Pending", "Processing", "Shipped", "Delivered"];
        const newIndex = statusOrder.indexOf(tracking_status);
        
        for (const order of nonCancelledOrders) {
            const currentIndex = statusOrder.indexOf(order.tracking_status);
            if (newIndex < currentIndex && order.tracking_status !== "Pending") {
                return response.status(400).json({
                    message: `Cannot revert ${order.product_details.name} to a previous tracking status`,
                    error: true,
                    success: false,
                });
            }
        }

        // Update tracking status and add to history for all eligible orders
        const updateResult = await OrderModel.updateMany(
            { 
               _id: { $in: nonCancelledOrders.map(o => o._id) } 
            },
            {
                tracking_status,
                $push: {
                    tracking_history: {
                        status: tracking_status,
                        updatedBy: userId,
                    },
                },
            }
        );

        return response.json({
            message: "Tracking status updated successfully",
            data: updateResult,
            error: false,
            success: true,
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}

export async function deleteOrderController(request, response) {
    try {
        const { orderId } = request.params;
        const { groupId } = request.query; // Support groupId via query param

        if (!orderId && !groupId) {
            return response.status(400).json({
                message: "Provide orderId or groupId",
                error: true,
                success: false,
            });
        }

        const filter = groupId ? { groupId, isDeleted: false } : { orderId, isDeleted: false };
        const orders = await OrderModel.find(filter);

        if (!orders.length) {
            return response.status(404).json({
                message: "Order(s) not found",
                error: true,
                success: false,
            });
        }

        // Cannot delete if any item is delivered
        if (orders.some(o => o.tracking_status === "Delivered")) {
            return response.status(400).json({
                message: "Cannot delete a group with delivered items",
                error: true,
                success: false,
            });
        }

        const updateResult = await OrderModel.updateMany(
            { _id: { $in: orders.map(o => o._id) } },
            { isDeleted: true }
        );

        return response.json({
            message: "Order(s) deleted successfully",
            data: updateResult,
            error: false,
            success: true,
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || "Failed to delete order",
            error: true,
            success: false,
        });
    }
}

export async function getOrderStatsController(request, response) {
    try {
        const totalUsers = await UserModel.countDocuments({ role: "USER" });
        const totalOrders = await OrderModel.countDocuments({ isDeleted: false });
        const canceledOrders = await OrderModel.countDocuments({
            isDeleted: false,
            isCancelled: true,
        });
        const deliveredOrders = await OrderModel.countDocuments({
            isDeleted: false,
            tracking_status: "Delivered",
        });

        // Calculate total revenue from non-cancelled orders
        const revenueData = await OrderModel.aggregate([
            {
                $match: {
                    isDeleted: false,
                    isCancelled: false,
                    payment_status: { $in: ["Online Payment", "paid", "COD", "Cash On Delivery"] }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalAmt" }
                }
            }
        ]);

        const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;
        const totalProducts = await ProductModel.countDocuments({ publish: true });
        const totalCategories = await CategoryModel.countDocuments();
        const totalSubCategories = await SubCategoryModel.countDocuments();

        // Time periods for trending products
        const now = new Date();
        const startOfDay = new Date(now.setHours(0, 0, 0, 0));
        const startOfWeek = new Date(now.setDate(now.getDate() - 7));
        const startOfMonth = new Date(new Date().setMonth(new Date().getMonth() - 1));
        const startOfYear = new Date(new Date().setFullYear(new Date().getFullYear() - 1));

        const getTrendingProducts = async (startDate) => {
            return await OrderModel.aggregate([
                {
                    $match: {
                        isDeleted: false,
                        isCancelled: false,
                        createdAt: { $gte: startDate }
                    }
                },
                {
                    $group: {
                        _id: "$productId",
                        totalQuantity: { $sum: "$quantity" },
                        totalSales: { $sum: "$totalAmt" }
                    }
                },
                { $sort: { totalQuantity: -1 } },
                { $limit: 10 },
                {
                    $lookup: {
                        from: "products",
                        localField: "_id",
                        foreignField: "_id",
                        as: "productDetails"
                    }
                },
                { $unwind: "$productDetails" },
                {
                    $project: {
                        _id: 1,
                        totalQuantity: 1,
                        totalSales: 1,
                        name: "$productDetails.name",
                        image: "$productDetails.image"
                    }
                }
            ]);
        };

        const [trendingDay, trendingWeek, trendingMonth, trendingYear] = await Promise.all([
            getTrendingProducts(startOfDay),
            getTrendingProducts(startOfWeek),
            getTrendingProducts(startOfMonth),
            getTrendingProducts(startOfYear)
        ]);

        // Unsold Products
        const soldProductIds = await OrderModel.distinct("productId", { isDeleted: false, isCancelled: false });
        const unsoldProducts = await ProductModel.find({
            _id: { $nin: soldProductIds },
            publish: true
        }).select("name image").limit(20);

        // Cancellation stats for the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const cancellationStats = await OrderModel.aggregate([
            {
                $match: {
                    isDeleted: false,
                    isCancelled: true,
                    cancellationDate: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        day: { $dayOfMonth: "$cancellationDate" },
                        month: { $month: "$cancellationDate" },
                        year: { $year: "$cancellationDate" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
        ]);

        const formattedCancellationStats = cancellationStats.map(item => ({
            label: `${item._id.day}/${item._id.month}`,
            y: item.count
        }));

        // Monthly sales data for the last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlySales = await OrderModel.aggregate([
            {
                $match: {
                    isDeleted: false,
                    isCancelled: false,
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    },
                    revenue: { $sum: "$totalAmt" },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const formattedMonthlyStats = monthlySales.map(item => ({
            name: `${monthNames[item._id.month - 1]} ${item._id.year}`,
            revenue: item.revenue,
            orders: item.orders,
            y: item.revenue // For CanvasJS
        }));

        return response.json({
            message: "Dashboard statistics",
            data: {
                totalUsers,
                totalOrders,
                canceledOrders,
                deliveredOrders,
                receivedOrders: totalOrders - canceledOrders - deliveredOrders,
                totalRevenue,
                totalProducts,
                totalCategories,
                totalSubCategories,
                monthlyStats: formattedMonthlyStats,
                cancellationStats: formattedCancellationStats,
                trendingDay,
                trendingWeek,
                trendingMonth,
                trendingYear,
                unsoldProducts
            },
            error: false,
            success: true,
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || "Failed to fetch dashboard statistics",
            error: true,
            success: false,
        });
    }
}