import SubCategory from "../models/subCategory.model.js";

export const AddSubCategoryController = async (request, response) => {
    try {
        const { name, image, category } = request.body;

        // Improved validation
        if (!name || !image || !category || category.length === 0) {
            return response.status(400).json({
                message: "Name, image, and at least one category are required",
                error: true,
                success: false
            });
        }

        const payload = {
            name,
            image,
            category
        };

        const newSubCategory = new SubCategory(payload); // Changed from SubCategoryModel to SubCategory
        const savedSubCategory = await newSubCategory.save();

        return response.status(201).json({ // Changed to 201 for resource creation
            message: "Sub Category Created Successfully",
            data: savedSubCategory,
            error: false,
            success: true
        });

    } catch (error) {
        console.error("AddSubCategory Error:", error); // Added error logging
        return response.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
};

export const getSubCategoryController = async (request, response) => {
    try {
        const data = await SubCategory.find() // Changed from SubCategoryModel to SubCategory
            .sort({ createdAt: -1 })
            .populate('category', 'name'); // Specify fields to populate for efficiency

        return response.json({
            message: "Sub Category data fetched successfully",
            data: data,
            error: false,
            success: true
        });
    } catch (error) {
        console.error("GetSubCategory Error:", error);
        return response.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
};

export const updateSubCategoryController = async (request, response) => {
    try {
        const { _id, name, image, category } = request.body;

        // Validate ID format first
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return response.status(400).json({
                message: "Invalid ID format",
                error: true,
                success: false
            });
        }

        const checkSub = await SubCategory.findById(_id); // Changed from SubCategoryModel

        if (!checkSub) {
            return response.status(404).json({ // Changed to 404 for not found
                message: "Sub Category not found",
                error: true,
                success: false
            });
        }

        const updateData = {
            name: name || checkSub.name, // Keep existing if not provided
            image: image || checkSub.image,
            category: category || checkSub.category
        };

        const updatedSubCategory = await SubCategory.findByIdAndUpdate(
            _id,
            updateData,
            { new: true } // Return the updated document
        ).populate('category');

        return response.json({
            message: 'Sub Category Updated Successfully',
            data: updatedSubCategory,
            error: false,
            success: true
        });

    } catch (error) {
        console.error("UpdateSubCategory Error:", error);
        return response.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
};

export const deleteSubCategoryController = async (request, response) => {
    try {
        const { _id } = request.body;

        // Validate ID format first
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return response.status(400).json({
                message: "Invalid ID format",
                error: true,
                success: false
            });
        }

        const deletedSub = await SubCategory.findByIdAndDelete(_id); // Changed from SubCategoryModel

        if (!deletedSub) {
            return response.status(404).json({
                message: "Sub Category not found",
                error: true,
                success: false
            });
        }

        return response.json({
            message: "Sub Category deleted successfully",
            data: deletedSub,
            error: false,
            success: true
        });
    } catch (error) {
        console.error("DeleteSubCategory Error:", error);
        return response.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
};