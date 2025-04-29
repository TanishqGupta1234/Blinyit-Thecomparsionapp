import { v2 as cloudinary } from 'cloudinary';
// CLOUDINARY_CLOUD_NAME= "da6ep7ldb"
// CLOUDINARY_API_KEY=""
// CLOUDINARY_API_SECRET = 
cloudinary.config({
    cloud_name : "da6ep7ldb",
    api_key : "163373687421892",
    api_secret : "vSHXv99ukNa_uzgE7aQL5Glm0N8"
})

const uploadImageClodinary = async(image)=>{
    const buffer = image?.buffer || Buffer.from(await image.arrayBuffer())

    const uploadImage = await new Promise((resolve,reject)=>{
        cloudinary.uploader.upload_stream({ folder : "binkeyit"},(error,uploadResult)=>{
            return resolve(uploadResult)
        }).end(buffer)
    })

    return uploadImage
}

export default uploadImageClodinary
