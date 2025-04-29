import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'

const uploadImage = async (image) => {
    try {
        const formData = new FormData();
        formData.append('image', image);

        const response = await Axios({
            ...SummaryApi.uploadImage,
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data', // Important!
                ...(SummaryApi.uploadImage.headers || {}),
            }
        });

        return response.data; // returning only the data part
    } catch (error) {
        console.error('Image upload failed:', error);
        throw error.response?.data || error.message || error; // better error throwing
    }
};

export default uploadImage;
