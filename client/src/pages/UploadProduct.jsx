import React, { useState } from 'react';
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from '../utils/UploadImage';
import Loading from '../components/Loading';
import ViewImage from '../components/ViewImage';
import { MdDelete } from "react-icons/md";
import { useSelector } from 'react-redux';
import { IoClose } from "react-icons/io5";
import AddFieldComponent from '../components/AddFieldComponent';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import successAlert from '../utils/SuccessAlert';
import { toast } from 'react-hot-toast';

const UploadProduct = () => {
  const [data, setData] = useState({
    name: "",
    image: [],
    category: [],
    subCategory: [],
    unit: "",
    stock: "",
    price: "",
    discount: "",
    description: "",
    more_details: {},
  });

  const [imageLoading, setImageLoading] = useState(false);
  const [ViewImageURL, setViewImageURL] = useState("");
  const allCategory = useSelector(state => state.product.allCategory);
  const [selectCategory, setSelectCategory] = useState("");
  const [selectSubCategory, setSelectSubCategory] = useState("");
  const allSubCategory = useSelector(state => state.product.allSubCategory);
  const [openAddField, setOpenAddField] = useState(false);
  const [fieldName, setFieldName] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error("Image too large (max 5MB)");
      return;
    }

    setImageLoading(true);
    try {
      const response = await uploadImage(file);
      
      // Handle different possible response structures
      const imageUrl = response?.data?.url || response?.url || response?.imageUrl;
      
      if (!imageUrl) {
        throw new Error("Image URL not found in response");
      }

      setData(prev => ({
        ...prev,
        image: [...prev.image, imageUrl]
      }));
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Image upload failed. Please try again.");
    } finally {
      setImageLoading(false);
    }
  };

  const handleDeleteImage = (index) => {
    const updatedImages = [...data.image];
    updatedImages.splice(index, 1);
    setData(prev => ({ ...prev, image: updatedImages }));
  };

  const handleRemoveCategory = (index) => {
    const updatedCategories = [...data.category];
    updatedCategories.splice(index, 1);
    setData(prev => ({ ...prev, category: updatedCategories }));
  };

  const handleRemoveSubCategory = (index) => {
    const updatedSubCategories = [...data.subCategory];
    updatedSubCategories.splice(index, 1);
    setData(prev => ({ ...prev, subCategory: updatedSubCategories }));
  };

  const handleAddField = () => {
    if (!fieldName.trim()) {
      toast.error("Field name cannot be empty");
      return;
    }
    
    setData(prev => ({
      ...prev,
      more_details: {
        ...prev.more_details,
        [fieldName]: ""
      }
    }));
    setFieldName("");
    setOpenAddField(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!data.name || !data.image.length || !data.category.length || 
        !data.unit || !data.stock || !data.price) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const response = await Axios({
        ...SummaryApi.createProduct,
        data: data
      });
      const { data: responseData } = response;

      if (responseData.success) {
        successAlert(responseData.message);
        setData({
          name: "",
          image: [],
          category: [],
          subCategory: [],
          unit: "",
          stock: "",
          price: "",
          discount: "",
          description: "",
          more_details: {},
        });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className=''>
      <div className='p-2 bg-white shadow-md flex items-center justify-between'>
        <h2 className='font-semibold'>Upload Product</h2>
      </div>
      
      <div className='grid p-3'>
        <form className='grid gap-4' onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className='grid gap-1'>
            <label htmlFor='name' className='font-medium'>Name*</label>
            <input 
              id='name'
              type='text'
              placeholder='Enter product name'
              name='name'
              value={data.name}
              onChange={handleChange}
              required
              className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
            />
          </div>

          {/* Description Field */}
          <div className='grid gap-1'>
            <label htmlFor='description' className='font-medium'>Description</label>
            <textarea 
              id='description'
              placeholder='Enter product description'
              name='description'
              value={data.description}
              onChange={handleChange}
              rows={3}
              className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded resize-none'
            />
          </div>

          {/* Image Upload */}
          <div>
            <p className='font-medium'>Images*</p>
            <div>
              <label htmlFor='productImage' className='bg-blue-50 h-24 border rounded flex justify-center items-center cursor-pointer'>
                <div className='text-center flex justify-center items-center flex-col'>
                  {imageLoading ? <Loading/> : (
                    <>
                      <FaCloudUploadAlt size={35}/>
                      <p>Upload Image</p>
                    </>
                  )}
                </div>
                <input 
                  type='file'
                  id='productImage'
                  className='hidden'
                  accept='image/*'
                  onChange={handleUploadImage}
                />
              </label>
              {imageLoading && <p className='text-sm text-gray-500 mt-1'>Uploading image...</p>}
              
              {/* Display uploaded images */}
              <div className='flex flex-wrap gap-4 mt-2'>
                {data.image.map((img, index) => (
                  <div key={img+index} className='h-20 w-20 min-w-20 bg-blue-50 border relative group'>
                    <img
                      src={img}
                      alt={`Product ${index}`}
                      className='w-full h-full object-scale-down cursor-pointer' 
                      onClick={() => setViewImageURL(img)}
                    />
                    <div 
                      onClick={() => handleDeleteImage(index)} 
                      className='absolute bottom-0 right-0 p-1 bg-red-600 hover:bg-red-700 rounded text-white hidden group-hover:block cursor-pointer'
                    >
                      <MdDelete/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Category Selection */}
          <div className='grid gap-1'>
            <label className='font-medium'>Category*</label>
            <div>
              <select
                className='bg-blue-50 border w-full p-2 rounded'
                value={selectCategory}
                onChange={(e) => {
                  const value = e.target.value;
                  if (!value) return;
                  
                  const category = allCategory.find(el => el._id === value);
                  if (!category) return;
                  
                  // Check if category already exists
                  const exists = data.category.some(c => c._id === category._id);
                  if (!exists) {
                    setData(prev => ({
                      ...prev,
                      category: [...prev.category, category]
                    }));
                  }
                  setSelectCategory("");
                }}
              >
                <option value="">Select Category</option>
                {allCategory.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
              <div className='flex flex-wrap gap-3 mt-2'>
                {data.category.map((c, index) => (
                  <div key={c._id+index} className='text-sm flex items-center gap-1 bg-blue-50 px-2 py-1 rounded'>
                    <p>{c.name}</p>
                    <div 
                      className='hover:text-red-500 cursor-pointer' 
                      onClick={() => handleRemoveCategory(index)}
                    >
                      <IoClose size={20}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sub-Category Selection */}
          <div className='grid gap-1'>
            <label className='font-medium'>Sub Category</label>
            <div>
              <select
                className='bg-blue-50 border w-full p-2 rounded'
                value={selectSubCategory}
                onChange={(e) => {
                  const value = e.target.value;
                  if (!value) return;
                  
                  const subCategory = allSubCategory.find(el => el._id === value);
                  if (!subCategory) return;
                  
                  // Check if subcategory already exists
                  const exists = data.subCategory.some(sc => sc._id === subCategory._id);
                  if (!exists) {
                    setData(prev => ({
                      ...prev,
                      subCategory: [...prev.subCategory, subCategory]
                    }));
                  }
                  setSelectSubCategory("");
                }}
              >
                <option value="">Select Sub Category</option>
                {allSubCategory.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
              <div className='flex flex-wrap gap-3 mt-2'>
                {data.subCategory.map((c, index) => (
                  <div key={c._id+index} className='text-sm flex items-center gap-1 bg-blue-50 px-2 py-1 rounded'>
                    <p>{c.name}</p>
                    <div 
                      className='hover:text-red-500 cursor-pointer' 
                      onClick={() => handleRemoveSubCategory(index)}
                    >
                      <IoClose size={20}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Unit Field */}
          <div className='grid gap-1'>
            <label htmlFor='unit' className='font-medium'>Unit*</label>
            <input 
              id='unit'
              type='text'
              placeholder='e.g., kg, piece, liter'
              name='unit'
              value={data.unit}
              onChange={handleChange}
              required
              className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
            />
          </div>

          {/* Stock Field */}
          <div className='grid gap-1'>
            <label htmlFor='stock' className='font-medium'>Stock*</label>
            <input 
              id='stock'
              type='number'
              placeholder='Enter available quantity'
              name='stock'
              value={data.stock}
              onChange={handleChange}
              min="0"
              required
              className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
            />
          </div>

          {/* Price Field */}
          <div className='grid gap-1'>
            <label htmlFor='price' className='font-medium'>Price*</label>
            <input 
              id='price'
              type='number'
              placeholder='Enter price in ₹'
              name='price'
              value={data.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
              className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
            />
          </div>

          {/* Discount Field */}
          <div className='grid gap-1'>
            <label htmlFor='discount' className='font-medium'>Discount</label>
            <input 
              id='discount'
              type='number'
              placeholder='Enter discount percentage'
              name='discount'
              value={data.discount}
              onChange={handleChange}
              min="0"
              max="100"
              className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
            />
          </div>

          {/* Additional Fields */}
          {Object.keys(data.more_details).map((key) => (
            <div key={key} className='grid gap-1'>
              <label htmlFor={key} className='font-medium capitalize'>{key}</label>
              <input 
                id={key}
                type='text'
                value={data.more_details[key]}
                onChange={(e) => {
                  const value = e.target.value;
                  setData(prev => ({
                    ...prev,
                    more_details: {
                      ...prev.more_details,
                      [key]: value
                    }
                  }));
                }}
                className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
              />
            </div>
          ))}

          {/* Add Field Button */}
          <div 
            onClick={() => setOpenAddField(true)} 
            className='hover:bg-primary-200 bg-white py-1 px-3 w-32 text-center font-semibold border border-primary-200 hover:text-neutral-900 cursor-pointer rounded'
          >
            Add Field
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            className='bg-primary-100 hover:bg-primary-200 py-2 rounded font-semibold mt-4'
          >
            Submit Product
          </button>
        </form>
      </div>

      {/* Image Preview Modal */}
      {ViewImageURL && (
        <ViewImage url={ViewImageURL} close={() => setViewImageURL("")}/>
      )}

      {/* Add Field Modal */}
      {openAddField && (
        <AddFieldComponent 
          value={fieldName}
          onChange={(e) => setFieldName(e.target.value)}
          submit={handleAddField}
          close={() => setOpenAddField(false)} 
        />
      )}
    </section>
  );
};

export default UploadProduct;