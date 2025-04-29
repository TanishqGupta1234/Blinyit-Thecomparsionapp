import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Subcategory name is required"],
        trim: true,
        unique: true
    },
    image: {
        type: String,
        required: [true, "Subcategory image is required"]
    },
    category: [
        {
            type: mongoose.Schema.Types.ObjectId,  // Corrected from Schema.ObjectId
            ref: "Category",  // Should match the model name exactly (case-sensitive)
            required: [true, "Category reference is required"]
        }
    ]
}, {
    timestamps: true
});

// Model name should be singular and capitalized (convention)
const SubCategory = mongoose.model('SubCategory', subCategorySchema);

export default SubCategory;