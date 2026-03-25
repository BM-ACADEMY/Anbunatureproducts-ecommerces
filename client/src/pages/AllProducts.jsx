import React, { useEffect, useState } from 'react';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import Loading from '../components/Loading';
import CardProduct from '../components/CardProduct';
import { useSelector } from 'react-redux';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { FiFilter } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { Slider, Box, Typography } from '@mui/material';

const AllProducts = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [limit] = useState(12);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const location = useLocation();
    
    // Read category or search from URL query param
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const categoryId = params.get('category');
        const query = params.get('q');
        
        if (query) {
            setSearchQuery(query);
            setSelectedCategory(""); // Clear category when searching
            setPage(1);
        } else if (categoryId) {
            setSelectedCategory(categoryId);
            setSearchQuery(""); // Clear search when browsing category
            setPage(1);
        } else {
            // If neither, clear both to show all products
            setSearchQuery("");
            setSelectedCategory("");
        }
    }, [location.search]);
    
    // Filter states
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [maxPriceLimit, setMaxPriceLimit] = useState(5000);
    const [minRating, setMinRating] = useState(0);
    
    const allCategory = useSelector((state) => state.product.allCategory || []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const filterData = { 
                page, 
                limit,
                minPrice: minPrice ? Number(minPrice) : undefined,
                maxPrice: maxPrice ? Number(maxPrice) : undefined,
                minRating: minRating > 0 ? minRating : undefined
            };

            let apiCall;
            if (searchQuery) {
                apiCall = { ...SummaryApi.searchProduct, data: { ...filterData, search: searchQuery } };
            } else if (selectedCategory) {
                apiCall = { ...SummaryApi.getProductByCategory, data: { ...filterData, categoryId: selectedCategory } };
            } else {
                apiCall = { ...SummaryApi.getProduct, data: filterData };
            }

            const response = await Axios(apiCall);
            const { data: responseData } = response;

            if (responseData.success) {
                setData(responseData.data);
                setTotalPages(responseData.totalPages || 1);
                setTotalCount(responseData.totalCount || 0);
                if (responseData.maxPriceLimit !== undefined) {
                    setMaxPriceLimit(responseData.maxPriceLimit);
                    // If maxPrice is not set or higher than new limit, update it
                    if (!maxPrice || Number(maxPrice) > responseData.maxPriceLimit) {
                        // Avoid infinite loop if we are currently fetching based on maxPrice
                        // But since we use debounced/effect based on these, it should be fine
                    }
                }
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page, selectedCategory, searchQuery, minPrice, maxPrice, minRating]);

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

    const clearFilters = () => {
        setMinPrice("");
        setMaxPrice("");
        setMinRating(0);
        setSelectedCategory("");
        setSearchQuery("");
        setPage(1);
    };

    return (
        <div className="min-h-screen bg-[#fcf8ed]">
            <div className="container mx-auto px-4 py-8">
                <Breadcrumbs />

                <div className="flex flex-col md:flex-row md:items-center justify-between mt-6 mb-10 gap-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            {searchQuery 
                                ? `Results for "${searchQuery}"`
                                : selectedCategory 
                                ? allCategory.find(c => c._id === selectedCategory)?.name 
                                : "All Products"
                            }
                            <span className="ml-3 text-sm font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                                {totalCount} items
                            </span>
                        </h1>
                        <p className="text-gray-500 mt-1">Discover our authentic and natural product range.</p>
                    </div>

                    <div className="flex items-center space-x-3">
                        {/* Mobile category select - keeping for mobile users */}
                        <div className="flex lg:hidden items-center space-x-2 bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm transition-all focus-within:ring-2 focus-within:ring-green-500">
                            <FiFilter className="text-gray-400" size={18} />
                            <select 
                                value={selectedCategory} 
                                onChange={handleCategoryChange}
                                className="bg-transparent border-none outline-none text-sm text-gray-700 font-semibold cursor-pointer pr-4"
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
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Filter Sidebar - Large screens only */}
                    <aside className="hidden lg:block w-72 flex-shrink-0">
                        <div className="sticky top-24 bg-white rounded-3xl p-7 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
                                <h3 className="text-lg font-bold text-gray-800">Filters</h3>
                                <button 
                                    onClick={clearFilters}
                                    className="text-xs font-bold text-[#EA580C] hover:underline"
                                >
                                    Reset All
                                </button>
                            </div>

                            {/* Category Filter */}
                            <div className="mb-10">
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-5">Category</h4>
                                <div className="space-y-3">
                                    <button 
                                        onClick={() => { setSelectedCategory(""); setPage(1); }}
                                        className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${selectedCategory === "" ? 'bg-[#98c17b] text-white shadow-md shadow-green-100' : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        All Products
                                    </button>
                                    {allCategory.map(category => (
                                        <button
                                            key={category._id}
                                            onClick={() => { setSelectedCategory(category._id); setPage(1); }}
                                            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${selectedCategory === category._id ? 'bg-[#98c17b] text-white shadow-md shadow-green-100' : 'text-gray-600 hover:bg-gray-50'}`}
                                        >
                                            {category.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="mb-10">
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-5">Price Range</h4>
                                <div className="px-2">
                                    <Slider
                                        value={[minPrice || 0, maxPrice || maxPriceLimit]}
                                        onChange={(e, newValue) => {
                                            setMinPrice(newValue[0]);
                                            setMaxPrice(newValue[1]);
                                            setPage(1);
                                        }}
                                        valueLabelDisplay="auto"
                                        min={0}
                                        max={maxPriceLimit}
                                        sx={{
                                            color: '#98c17b',
                                            '& .MuiSlider-thumb': {
                                                backgroundColor: '#98c17b',
                                            },
                                            '& .MuiSlider-track': {
                                                backgroundColor: '#98c17b',
                                            },
                                        }}
                                    />
                                    <div className="flex justify-between mt-2">
                                        <span className="text-xs font-bold text-gray-600 font-outfit">₹{minPrice || 0}</span>
                                        <span className="text-xs font-bold text-gray-600 font-outfit">₹{maxPrice || maxPriceLimit}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Rating Filter */}
                            <div>
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-5">Minimum Rating</h4>
                                <div className="space-y-2">
                                    {[5, 4, 3, 2, 1].map((rating) => (
                                        <button
                                            key={rating}
                                            onClick={() => { setMinRating(rating); setPage(1); }}
                                            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all ${minRating === rating ? 'bg-orange-50 text-orange-700' : 'hover:bg-gray-50 text-gray-600'}`}
                                        >
                                            <div className="flex items-center gap-1.5">
                                                <div className="flex text-orange-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <svg 
                                                            key={i} 
                                                            className={`w-4 h-4 ${i < rating ? 'fill-current' : 'fill-gray-200'}`} 
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ))}
                                                </div>
                                                <span className="text-xs font-bold">& Up</span>
                                            </div>
                                            {minRating === rating && <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center p-20 min-h-[400px]">
                                <Loading />
                                <p className="text-gray-400 mt-4 font-medium animate-pulse">Refining your selections...</p>
                            </div>
                        ) : data.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {data.map((product) => (
                                        <CardProduct key={product._id} data={product} />
                                    ))}
                                </div>

                                {/* Pagination Buttons */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center space-x-4 mt-16 pb-12">
                                        <button
                                            onClick={handlePrevPage}
                                            disabled={page === 1}
                                            className={`flex items-center space-x-2 px-8 py-3 rounded-2xl font-bold transition-all shadow-lg ${
                                                page === 1 
                                                ? 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none' 
                                                : 'bg-white text-gray-700 hover:bg-[#98c17b] hover:text-white border border-gray-100'
                                            }`}
                                        >
                                            <LuChevronLeft size={22} />
                                            <span>Prev</span>
                                        </button>
                                        
                                        <div className="flex items-center bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100">
                                            <span className="text-xs font-bold text-gray-400 mr-3 uppercase tracking-widest">Page</span>
                                            <span className="font-extrabold text-[#98c17b] bg-white w-8 h-8 flex items-center justify-center rounded-lg shadow-sm border border-gray-100 mr-2">{page}</span>
                                            <span className="text-xs font-bold text-gray-300 mx-2">OF</span>
                                            <span className="font-extrabold text-gray-800">{totalPages}</span>
                                        </div>

                                        <button
                                            onClick={handleNextPage}
                                            disabled={page === totalPages}
                                            className={`flex items-center space-x-2 px-8 py-3 rounded-2xl font-bold transition-all shadow-lg ${
                                                page === totalPages 
                                                ? 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none' 
                                                : 'bg-[#70a139] text-white hover:bg-[#5e8730] shadow-green-100'
                                            }`}
                                        >
                                            <span>Next</span>
                                            <LuChevronRight size={22} />
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-50 px-10 text-center">
                                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8">
                                    <FiFilter className="text-gray-200" size={40} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-3">No products matched</h3>
                                <p className="text-gray-400 max-w-sm mb-8 leading-relaxed">We couldn't find any products matching your current filters. Try adjusting your price range or rating selection.</p>
                               
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllProducts;
