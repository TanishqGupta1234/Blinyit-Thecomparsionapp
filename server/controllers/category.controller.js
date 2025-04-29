import CategoryModel from "../models/category.model.js";
import SubCategoryModel from "../models/subCategory.model.js";
import ProductModel from "../models/product.model.js";

export const AddCategoryController = async (request, response) => {
    try {
        const { name, image } = request.body;

        // Ensure both name and image are provided
        if (!name) {
            return response.status(400).json({
                message: "Name and image are required fields",
                success: false,
                error: true,
                data: null  // Ensure 'data' is present in the response
            });
        }

        // Optionally, validate the image format or size here if needed
        // Example: Check if the image is a valid URL or base64 format
        // if (!isValidImage(image)) {
        //     return response.status(400).json({
        //         message: "Invalid image format",
        //         success: false,
        //         error: true,
        //         data: null
        //     });
        // }

        // Create a new category document
        const addCategory = new CategoryModel({
            name,
        });

        // Save the new category to the database
        const saveCategory = await addCategory.save();

        // Return success response if category was saved successfully
        return response.status(201).json({
            message: "Category added successfully",
            data: saveCategory, // Ensure this is correctly returned
            success: true,
            error: false
        });

    } catch (error) {
        // Catch any unexpected errors
        console.error(error); // Log the error for server-side debugging
        return response.status(500).json({
            message: error.message || "An unexpected error occurred",
            success: false,
            error: true,
            data: null // Ensure 'data' is present here as well
        });
    }
};


export const getCategoryController = async(request,response)=>{
    try {
        
        const data = await CategoryModel.find().sort({ createdAt : -1 })

        return response.json({
            data : data,
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : error.messsage || error,
            error : true,
            success : false
        })
    }
}

export const updateCategoryController = async(request,response)=>{
    try {
        const { _id ,name, image } = request.body 

        const update = await CategoryModel.updateOne({
            _id : _id
        },{
           name, 
           image 
        })

        return response.json({
            message : "Updated Category",
            success : true,
            error : false,
            data : update
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const deleteCategoryController = async(request,response)=>{
    try {
        const { _id } = request.body 

        const checkSubCategory = await SubCategoryModel.find({
            category : {
                "$in" : [ _id ]
            }
        }).countDocuments()

        const checkProduct = await ProductModel.find({
            category : {
                "$in" : [ _id ]
            }
        }).countDocuments()

        if(checkSubCategory >  0 || checkProduct > 0 ){
            return response.status(400).json({
                message : "Category is already use can't delete",
                error : true,
                success : false
            })
        }

        const deleteCategory = await CategoryModel.deleteOne({ _id : _id})

        return response.json({
            message : "Delete category successfully",
            data : deleteCategory,
            error : false,
            success : true
        })

    } catch (error) {
       return response.status(500).json({
            message : error.message || error,
            success : false,
            error : true
       }) 
    }
}