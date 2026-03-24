import React, { useEffect, useState } from 'react';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import Loading from '../components/Loading';
import CardProduct from '../components/CardProduct';
import { useSelector } from 'react-redux';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { FiFilter } from 'react-icons/fi';
import Breadcrumbs from '../components/Breadcrumbs';

const AllProducts = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [limit] = useState(12);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState("");
    
    const allCategory = useSelector((state) => state.product.allCategory || []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const apiCall = selectedCategory 
                ? { ...SummaryApi.getProductByCategory, data: { categoryId: selectedCategory, page, limit } }
                : { ...SummaryApi.getProduct, data: { page, limit } };

            const response = await Axios(apiCall);
            const { data: responseData } = response;

            if (responseData.success) {
                setData(responseData.data);
                setTotalPages(responseData.totalPages || 1);
                setTotalCount(responseData.totalCount || 0);
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page, selectedCategory]);

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        setPage(1); // Reset to first page on category change
    };

    const handlePrevPage = () => {
        if (page > 1) setPage(p => p - 1);
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage(p => p + 1);
    };

    return (
        <div className="min-h-screen bg-[#f9f9f9]">
            <div className="container mx-auto px-4 py-6">
                <Breadcrumbs />

                <div className="flex flex-col md:flex-row md:items-center justify-between mt-4 mb-8 gap-4">
                    <h1 className="text-2xl font-bold text-gray-800">
                        {selectedCategory 
                            ? allCategory.find(c => c._id === selectedCategory)?.name 
                            : "All Products"
                        }
                        <span className="ml-2 text-sm font-normal text-gray-500">
                            ({totalCount} products)
                        </span>
                    </h1>

                    <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm transition-all focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent">
                        <FiFilter className="text-gray-400" size={18} />
                        <select 
                            value={selectedCategory} 
                            onChange={handleCategoryChange}
                            className="bg-transparent border-none outline-none text-sm text-gray-700 font-medium cursor-pointer pr-4"
                        >
                            <option value="">All Categories</option>
                            {allCategory.map(category => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center p-20">
                        <Loading />
                    </div>
                ) : data.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {data.map((product) => (
                                <CardProduct key={product._id} data={product} />
                            ))}
                        </div>

                        {/* Pagination Buttons */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center space-x-4 mt-12 pb-10">
                                <button
                                    onClick={handlePrevPage}
                                    disabled={page === 1}
                                    className={`flex items-center space-x-2 px-6 py-2.5 rounded-full font-semibold transition-all shadow-md ${
                                        page === 1 
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                        : 'bg-[#98c17b] text-white hover:bg-[#86ad6a]'
                                    }`}
                                >
                                    <LuChevronLeft size={20} />
                                    <span>Previous</span>
                                </button>
                                
                                <div className="flex items-center space-x-1">
                                    <span className="text-sm font-medium text-gray-500">Page</span>
                                    <span className="font-bold text-gray-800">{page}</span>
                                    <span className="text-sm font-medium text-gray-500">of</span>
                                    <span className="font-bold text-gray-800">{totalPages}</span>
                                </div>

                                <button
                                    onClick={handleNextPage}
                                    disabled={page === totalPages}
                                    className={`flex items-center space-x-2 px-6 py-2.5 rounded-full font-semibold transition-all shadow-md ${
                                        page === totalPages 
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed mx-4' 
                                        : 'bg-[#70a139] text-white hover:bg-[#5e8730]'
                                    }`}
                                >
                                    <span>Next</span>
                                    <LuChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-lg mb-4">No products found in this category.</p>
                        <button 
                            onClick={() => setSelectedCategory("")}
                            className="text-green-600 font-semibold hover:underline"
                        >
                            View All Products
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllProducts;
