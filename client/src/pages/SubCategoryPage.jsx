import React, { useEffect, useState } from "react";
import UploadSubCategoryModel from "../components/UploadSubCategoryModel";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import ViewImage from "../components/ViewImage";
import EditSubCategory from "../components/EditSubCategory";
import CofirmBox from "../components/CofirmBox";
import { toast } from "sonner";
import { IoAdd } from "react-icons/io5";

const SubCategoryPage = () => {
  const [openAddSubCategory, setOpenAddSubCategory] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({ _id: "" });
  const [deleteSubCategory, setDeleteSubCategory] = useState({ _id: "" });
  const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (value) => {
    setCurrentPage(value);
  };

  const fetchSubCategory = async () => {
    try {
      setLoading(true);
      const response = await Axios({ ...SummaryApi.getSubCategory });
      const { data: responseData } = response;
      if (responseData.success) {
        setData(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteSubCategory,
        data: deleteSubCategory,
      });
      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        fetchSubCategory();
        setOpenDeleteConfirmBox(false);
        setDeleteSubCategory({ _id: "" });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  useEffect(() => {
    fetchSubCategory();
  }, []);

  return (
    <section className=''>
      {/* Header */}
      <div className='p-2 flex items-center justify-between gap-4 bg-white shadow-sm rounded'>
          <h2 className='font-semibold text-lg sm:text-xl'>Sub Category</h2>
          <button 
            onClick={() => setOpenAddSubCategory(true)}
            className='bg-primary-200 hover:bg-primary-300 text-white px-4 py-2 rounded flex items-center gap-2 transition-all font-medium text-sm sm:text-base'
          >
            <IoAdd size={24} />
            <span>Add Sub Category</span>
          </button>
      </div>

      {/* Grid */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 py-6'>
        {currentItems.map((item) => (
          <div key={item._id} className='bg-white group rounded shadow hover:shadow-md transition-all flex flex-col'>
            <div 
              className='aspect-square w-full p-4 flex items-center justify-center overflow-hidden cursor-pointer'
              onClick={() => setImageURL(item.image)}
            >
              <img
                src={item.image}
                alt={item.altText || item.name}
                className='h-full w-full object-scale-down transition-transform group-hover:scale-105'
              />
            </div>
            <div className='px-4 py-2 border-t flex-grow'>
              <h3 className='text-center font-medium truncate' title={item.name}>{item.name}</h3>
              <div className='flex flex-wrap justify-center gap-1 mt-1'>
                {item.category.map((cat) => (
                  <span key={cat._id} className='text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100'>
                    {cat.name}
                  </span>
                ))}
              </div>
            </div>
            <div className='p-2 grid grid-cols-2 gap-2 mt-auto'>
              <button
                onClick={() => {
                  setOpenEdit(true);
                  setEditData(item);
                }}
                className='text-sm bg-green-100 text-green-700 py-1 px-2 rounded hover:bg-green-200 transition-colors'
              >
                Edit
              </button>
              <button
                onClick={() => {
                  setOpenDeleteConfirmBox(true);
                  setDeleteSubCategory(item);
                }}
                className='text-sm bg-red-100 text-red-700 py-1 px-2 rounded hover:bg-red-200 transition-colors'
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {data.length > itemsPerPage && (
        <div className='flex items-center justify-center gap-2 mt-6 pb-10'>
             <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className='px-3 py-1 border rounded hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed'
             >
                Prev
             </button>
             {[...Array(Math.ceil(data.length / itemsPerPage))].map((_, i) => (
                <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-3 py-1 rounded border ${currentPage === i + 1 ? 'bg-primary-200 text-white border-primary-200' : 'hover:bg-neutral-100'}`}
                >
                    {i + 1}
                </button>
             ))}
             <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === Math.ceil(data.length / itemsPerPage)}
                className='px-3 py-1 border rounded hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed'
             >
                Next
             </button>
        </div>
      )}

      {/* Modals */}
      {openAddSubCategory && (
        <UploadSubCategoryModel
          fetchData={fetchSubCategory}
          close={() => setOpenAddSubCategory(false)}
        />
      )}

      {openEdit && (
        <EditSubCategory
          data={editData}
          fetchData={fetchSubCategory}
          close={() => setOpenEdit(false)}
        />
      )}

      {openDeleteConfirmBox && (
        <CofirmBox
          confirm={handleDeleteSubCategory}
          cancel={() => setOpenDeleteConfirmBox(false)}
          close={() => setOpenDeleteConfirmBox(false)}
        />
      )}

      {imageURL && <ViewImage url={imageURL} close={() => setImageURL("")} />}
    </section>
  );
};

export default SubCategoryPage;
