import uploadImageLocal from "../utils/uploadImageLocal.js"

const uploadImageController = async(request,response)=>{
    try {
        const file = request.file
        const category = request.body.category || 'misc'

        // Enforce 2MB limit for category, subCategory, and product
        const limitedCategories = ['category', 'subCategory', 'product', 'product-details']
        if (limitedCategories.includes(category) && file.size > 2 * 1024 * 1024) {
            return response.status(400).json({
                message: "Image size should be less than 2MB",
                error: true,
                success: false
            })
        }

        // Enforce 5MB limit for banner (though multer already limits to 5MB, we can be explicit)
        if (category === 'banner' && file.size > 5 * 1024 * 1024) {
             return response.status(400).json({
                message: "Banner image size should be less than 5MB",
                error: true,
                success: false
            })
        }

        const uploadImage = await uploadImageLocal(file, category)

        return response.json({
            message : "Upload done",
            data : uploadImage,
            success : true,
            error : false
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export default uploadImageController