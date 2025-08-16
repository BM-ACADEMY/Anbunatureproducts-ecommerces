// cart.controller.js
import CartProductModel from "../models/cartproduct.model.js";
import UserModel from "../models/user.model.js";
import ProductModel from "../models/product.model.js";

export const addToCartItemController = async (request, response) => {
  try {
    const userId = request.userId;
    const { productId, selectedAttributes } = request.body;

    if (!productId || !selectedAttributes || !Array.isArray(selectedAttributes)) {
      return response.status(400).json({
        message: "Provide productId and valid selectedAttributes array",
        error: true,
        success: false,
      });
    }

    // Fetch product to validate attributes
    const product = await ProductModel.findById(productId);
    if (!product) {
      return response.status(404).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }

    // Validate selected attributes
    const validatedAttributes = [];
    for (const selected of selectedAttributes) {
      const { attributeName, optionName } = selected;
      const attrGroup = product.attributes.find((attr) => attr.name === attributeName);
      if (!attrGroup) {
        return response.status(400).json({
          message: `Attribute ${attributeName} not found`,
          error: true,
          success: false,
        });
      }
      const option = attrGroup.options.find((opt) => opt.name === optionName);
      if (!option) {
        return response.status(400).json({
          message: `Option ${optionName} not found for ${attributeName}`,
          error: true,
          success: false,
        });
      }
      if (option.stock !== null && option.stock < 1) {
        return response.status(400).json({
          message: `${optionName} for ${attributeName} is out of stock`,
          error: true,
          success: false,
        });
      }
      validatedAttributes.push({
        attributeName,
        optionName,
        price: option.price || 0,
        stock: option.stock,
        unit: option.unit || "",
      });
    }

    // Check if item with same attributes exists in cart
    const checkItemCart = await CartProductModel.findOne({
      userId,
      productId,
      selectedAttributes: {
        $all: validatedAttributes.map(({ attributeName, optionName }) => ({
          attributeName,
          optionName,
        })),
      },
    });

    if (checkItemCart) {
      return response.status(400).json({
        message: "Item with these attributes already in cart",
        error: true,
        success: false,
      });
    }

    const cartItem = new CartProductModel({
      quantity: 1,
      userId,
      productId,
      selectedAttributes: validatedAttributes,
    });
    const save = await cartItem.save();

    const updateCartUser = await UserModel.updateOne(
      { _id: userId },
      {
        $push: {
          shopping_cart: productId,
        },
      }
    );

    return response.json({
      data: save,
      message: "Item added successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Failed to add item to cart",
      error: true,
      success: false,
    });
  }
};

// Update other controllers (getCartItemController, updateCartItemQtyController, deleteCartItemQtyController) if needed
export const getCartItemController = async (request, response) => {
  try {
    const userId = request.userId;

    const cartItem = await CartProductModel.find({
      userId,
    }).populate("productId");

    return response.json({
      data: cartItem,
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
};

export const updateCartItemQtyController = async(request,response)=>{
    try {
        const userId = request.userId 
        const { _id,qty } = request.body

        if(!_id ||  !qty){
            return response.status(400).json({
                message : "provide _id, qty"
            })
        }

        const updateCartitem = await CartProductModel.updateOne({
            _id : _id,
            userId : userId
        },{
            quantity : qty
        })

        return response.json({
            message : "Update cart",
            success : true,
            error : false, 
            data : updateCartitem
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const deleteCartItemQtyController = async(request,response)=>{
    try {
      const userId = request.userId // middleware
      const { _id } = request.body 
      
      if(!_id){
        return response.status(400).json({
            message : "Provide _id",
            error : true,
            success : false
        })
      }

      const deleteCartItem  = await CartProductModel.deleteOne({_id : _id, userId : userId })

      return response.json({
        message : "Item remove",
        error : false,
        success : true,
        data : deleteCartItem
      })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}
