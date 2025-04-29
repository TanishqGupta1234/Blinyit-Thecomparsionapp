import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import uploadImage from '../utils/UploadImage';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';

const UploadCategoryModal = ({ close, fetchData }) => {
  const [data, setData] = useState({
    name: '',
    image: '',
  });

  const [loading, setLoading] = useState(false);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.name || !data.image) {
      toast.error('Please provide both name and image');
      return;
    }
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.addCategory,
        data: data,
      });

      const { data: responseData } = response || {};
      if (responseData?.success) {
        toast.success(responseData.message || 'Category added successfully');
        close();
        fetchData();
      } else {
        toast.error(responseData?.message || 'Failed to add category');
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadCategoryImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type (optional: you can add more file types if needed)
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image');
      return;
    }

    try {
      const response = await uploadImage(file);
      const { data: imageResponse } = response || {};
      console.log(response);
      if (imageResponse?.url) {
        setData((prev) => ({ ...prev, image: imageResponse?.url }));
        toast.success('Image uploaded successfully');
      } else {
        toast.error('Image upload failed');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Image upload failed');
    }
  };

  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-gray-800">Add New Category</h1>
          <button onClick={close} className="text-gray-600 hover:text-gray-900">
            <IoClose size={24} />
          </button>
        </div>

        <form className="grid gap-6" onSubmit={handleSubmit}>
          {/* Category Name */}
          <div className="grid gap-2">
            <label htmlFor="categoryName" className="text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="categoryName"
              name="name"
              placeholder="Enter category name"
              value={data.name}
              onChange={handleOnChange}
              className="p-2 border rounded bg-blue-50 border-blue-200 focus:border-blue-400 outline-none"
            />
          </div>

          {/* Category Image */}
          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-700">Image</label>
            <div className="flex flex-col items-center gap-4 lg:flex-row">
              <div className="w-full h-36 lg:w-36 bg-blue-50 border border-blue-200 flex items-center justify-center rounded overflow-hidden">
                {data.image ? (
                  <img
                    src={data.image}
                    alt="Category Preview"
                    className="object-contain w-full h-full"
                  />
                ) : (
                  <p className="text-sm text-neutral-500">No Image</p>
                )}
              </div>

              <label htmlFor="uploadCategoryImage" className="cursor-pointer w-full lg:w-auto">
                <div
                  className={`px-4 py-2 rounded border text-center font-medium transition ${
                    data.name
                      ? 'border-blue-400 text-blue-600 hover:bg-blue-100'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Upload Image
                </div>
                <input
                  type="file"
                  id="uploadCategoryImage"
                  className="hidden"
                  disabled={!data.name}
                  onChange={handleUploadCategoryImage}
                />
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!data.name || !data.image || loading}
            className={`py-2 font-semibold rounded text-white transition ${
              data.name && data.image && !loading
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {loading ? 'Adding...' : 'Add Category'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default UploadCategoryModal;
