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

    try {
      const response = await uploadImage(file);
      const { data: imageResponse } = response || {};
      if (imageResponse?.data?.url) {
        setData((prev) => ({ ...prev, image: imageResponse.data.url }));
        toast.success('Image uploaded successfully');
      } else {
        toast.error('Image upload failed');
      }
    } catch (error) {
      toast.error('Image upload failed');
    }
  };

  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-800 bg-opacity-60">
      <div className="w-full max-w-2xl p-6 bg-white rounded shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-semibold">Add New Category</h1>
          <button onClick={close} className="text-neutral-700 hover:text-neutral-900">
            <IoClose size={25} />
          </button>
        </div>

        <form className="grid gap-6" onSubmit={handleSubmit}>
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
              className="p-2 border rounded bg-blue-50 border-blue-100 focus:border-primary-200 outline-none"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-700">Image</label>
            <div className="flex flex-col items-center gap-4 lg:flex-row">
              <div className="w-full h-36 lg:w-36 bg-blue-50 border flex items-center justify-center rounded overflow-hidden">
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

              <label htmlFor="uploadCategoryImage" className="cursor-pointer">
                <div
                  className={`px-4 py-2 rounded border font-medium transition ${
                    data.name
                      ? 'border-primary-200 hover:bg-primary-100'
                      : 'bg-gray-300 cursor-not-allowed'
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

          <button
            type="submit"
            disabled={!data.name || !data.image || loading}
            className={`py-2 font-semibold rounded text-white transition ${
              data.name && data.image && !loading
                ? 'bg-primary-200 hover:bg-primary-100'
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
