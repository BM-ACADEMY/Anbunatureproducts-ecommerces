import uploadImageLocal from "../utils/uploadImageLocal.js"

const uploadImageController = async(request,response)=>{
    try {
        const file = request.file
        const category = request.body.category || 'misc'

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