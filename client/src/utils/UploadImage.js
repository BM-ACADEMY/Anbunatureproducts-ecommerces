import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'

const uploadImage = async(image, section = 'misc')=>{
    try {
        const formData = new FormData()
        formData.append('category', section)
        formData.append('image',image)

        const response = await Axios({
            ...SummaryApi.uploadImage,
            data : formData
        })

        return response
    } catch (error) {
        return error
    }
}

export default uploadImage