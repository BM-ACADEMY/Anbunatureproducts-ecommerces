import React, { useEffect, useState } from 'react';
import UploadCategoryModel from '../components/UploadCategoryModel';
import Loading from '../components/Loading';
import NoData from '../components/NoData';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import EditCategory from '../components/EditCategory';
import CofirmBox from '../components/CofirmBox';
import { toast } from 'sonner';
import AxiosToastError from '../utils/AxiosToastError';
import { IoAdd } from "react-icons/io5";

const CategoryPage = () => {
    const [openUploadCategory, setOpenUploadCategory] = useState(false);
    const [loading, setLoading] = useState(false);
    const [categoryData, setCategoryData] = useState([]);
    const [openEdit, setOpenEdit] = useState(false);
    const [editData, setEditData] = useState({
        name: "",
        image: "",
    });
    const [openConfimBoxDelete, setOpenConfirmBoxDelete] = useState(false);
    const [deleteCategory, setDeleteCategory] = useState({
        _id: ""
    });

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = categoryData.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (value) => {
        setCurrentPage(value);
    };

    const fetchCategory = async () => {
        try {
            setLoading(true);
            const response = await Axios({ ...SummaryApi.getCategory });
            const { data: responseData } = response;

            if (responseData.success) {
                setCategoryData(responseData.data);
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCategory = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.deleteCategory,
                data: deleteCategory
            });

            const { data: responseData } = response;

            if (responseData.success) {
                toast.success(responseData.message);
                fetchCategory();
                setOpenConfirmBoxDelete(false);
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    useEffect(() => {
        fetchCategory();
    }, []);

    return (
        <section className=''>
            {/* Header */}
            <div className='p-2 flex items-center justify-between gap-4 bg-white shadow-sm rounded'>
                <h2 className='font-semibold text-lg sm:text-xl'>Category</h2>
                <button 
                  onClick={() => setOpenUploadCategory(true)}
                  className='bg-primary-200 hover:bg-primary-300 text-white px-4 py-2 rounded flex items-center gap-2 transition-all font-medium text-sm sm:text-base'
                >
                  <IoAdd size={24} />
                  <span>Add Category</span>
                </button>
            </div>

            {/* No Data */}
            {!categoryData[0] && !loading && <NoData />}

            {/* Category Grid */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 py-6'>
                {currentItems.map((category) => (
                    <div key={category._id} className='bg-white group rounded shadow hover:shadow-md transition-all flex flex-col'>
                        <div className='aspect-square w-full p-4 flex items-center justify-center overflow-hidden'>
                            <img
                                src={category.image}
                                alt={category.altText || category.name}
                                className='h-full w-full object-scale-down transition-transform group-hover:scale-105'
                            />
                        </div>
                        <div className='px-4 py-2 border-t'>
                            <h3 className='text-center font-medium truncate' title={category.name}>{category.name}</h3>
                        </div>
                        <div className='p-2 grid grid-cols-2 gap-2 mt-auto'>
                            <button
                                onClick={() => {
                                    setOpenEdit(true);
                                    setEditData(category);
                                }}
                                className='text-sm bg-green-100 text-green-700 py-1 px-2 rounded hover:bg-green-200 transition-colors'
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => {
                                    setOpenConfirmBoxDelete(true);
                                    setDeleteCategory(category);
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
            {categoryData.length > itemsPerPage && (
                <div className='flex items-center justify-center gap-2 mt-6 pb-10'>
                     <button 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className='px-3 py-1 border rounded hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed'
                     >
                        Prev
                     </button>
                     {[...Array(Math.ceil(categoryData.length / itemsPerPage))].map((_, i) => (
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
                        disabled={currentPage === Math.ceil(categoryData.length / itemsPerPage)}
                        className='px-3 py-1 border rounded hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed'
                     >
                        Next
                     </button>
                </div>
            )}

            {/* Loading */}
            {loading && <Loading />}

            {/* Modals */}
            {openUploadCategory && (
                <UploadCategoryModel
                    fetchData={fetchCategory}
                    close={() => setOpenUploadCategory(false)}
                />
            )}

            {openEdit && (
                <EditCategory
                    data={editData}
                    fetchData={fetchCategory}
                    close={() => setOpenEdit(false)}
                />
            )}

            {openConfimBoxDelete && (
                <CofirmBox
                    confirm={handleDeleteCategory}
                    cancel={() => setOpenConfirmBoxDelete(false)}
                    close={() => setOpenConfirmBoxDelete(false)}
                />
            )}
        </section>
    );
};

export default CategoryPage;
