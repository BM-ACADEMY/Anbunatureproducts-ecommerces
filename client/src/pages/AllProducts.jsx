import React, { useEffect, useState } from 'react';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import Loading from '../components/Loading';
import NoData from '../components/NoData';
import CardLoading from '../components/CardLoading';
import { useSelector } from 'react-redux';
import { LuChevronRight } from 'react-icons/lu';
import { FiFilter } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { Slider, Box, Typography } from '@mui/material';
import CardProduct from '../components/CardProduct';

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
        
        setData([]); // Clear data on URL change
        if (query) {
            setSearchQuery(query);
            setSelectedCategory(""); 
            setPage(1);
        } else if (categoryId) {
            setSelectedCategory(categoryId);
            setSearchQuery(""); 
            setPage(1);
        } else {
            setSearchQuery("");
            setSelectedCategory("");
            setPage(1);
        }
    }, [location.search]);
    
    // Filter states
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [maxPriceLimit, setMaxPriceLimit] = useState(5000);
    const [inStockOnly, setInStockOnly] = useState(false);
    const [sortBy, setSortBy] = useState("newest");
    
    const allCategory = useSelector((state) => state.product.allCategory || []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const filterData = { 
                page, 
                limit,
                minPrice: minPrice ? Number(minPrice) : undefined,
                maxPrice: maxPrice ? Number(maxPrice) : undefined,
                inStock: inStockOnly ? true : undefined,
                sort: sortBy
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
                if (page === 1) {
                    setData(responseData.data);
                } else {
                    setData(prev => [...prev, ...responseData.data]);
                }
                
                setTotalPages(responseData.totalPages || 1);
                setTotalCount(responseData.totalCount || 0);
                if (responseData.maxPriceLimit !== undefined) {
                    setMaxPriceLimit(responseData.maxPriceLimit);
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
    }, [page, selectedCategory, searchQuery, minPrice, maxPrice, inStockOnly, sortBy]);

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        setData([]); // Clear data for fresh start
        setPage(1); 
    };

    const handleLoadMore = () => {
        if (page < totalPages && !loading) {
            setPage(prev => prev + 1);
        }
    };

    const clearFilters = () => {
        setMinPrice("");
        setMaxPrice("");
        setInStockOnly(false);
        setSortBy("newest");
        setSelectedCategory("");
        setSearchQuery("");
        setData([]); // Clear data before resetting page
        setPage(1);
    };

    return (
        <div className="min-h-screen bg-[#fcf8ed]">
            <div className="container mx-auto px-4 md:px-10 py-8">
                <Breadcrumbs />

                <div className="flex flex-col md:flex-row md:items-center justify-between mt-6 mb-10 gap-6">
                    <div className="max-w-2xl">
                        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight flex flex-wrap items-center gap-3">
                            {searchQuery 
                                ? `Results for "${searchQuery}"`
                                : selectedCategory 
                                ? allCategory.find(c => c._id === selectedCategory)?.name 
                                : "All Products"
                            }
                            <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full whitespace-nowrap">
                                {totalCount} items
                            </span>
                        </h1>
                        <p className="text-gray-500 mt-2 text-sm md:text-base">Discover our authentic and natural product range.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex-1 min-w-[140px] flex items-center space-x-2 bg-white px-3 md:px-4 py-2.5 rounded-xl border border-gray-100 shadow-sm transition-all focus-within:ring-2 focus-within:ring-green-500/20">
                            <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-tight whitespace-nowrap">Sort By:</span>
                            <select 
                                value={sortBy} 
                                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                                className="bg-transparent border-none outline-none text-xs md:text-sm text-gray-700 font-bold cursor-pointer w-full pr-1"
                            >
                                <option value="newest">Newest First</option>
                                <option value="priceLowToHigh">Price: Low to High</option>
                                <option value="priceHighToLow">Price: High to Low</option>
                                <option value="rating">Top Rated</option>
                            </select>
                        </div>

                        {/* Mobile category select - visible only when sidebar is hidden (below lg) */}
                        <div className="flex-1 min-w-[140px] flex lg:hidden items-center space-x-2 bg-white px-3 md:px-4 py-2.5 rounded-xl border border-gray-100 shadow-sm transition-all focus-within:ring-2 focus-within:ring-green-500/20">
                            <FiFilter className="text-gray-400 flex-shrink-0" size={16} />
                            <select 
                                value={selectedCategory} 
                                onChange={handleCategoryChange}
                                className="bg-transparent border-none outline-none text-xs md:text-sm text-gray-700 font-bold cursor-pointer w-full pr-1"
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
                        <div className="sticky top-24 space-y-6">
                            <div className="bg-white rounded-3xl p-7 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
                                    <div className="flex items-center gap-2">
                                        <FiFilter className="text-[#70a139]" size={20} />
                                        <h3 className="text-lg font-bold text-gray-800">Filters</h3>
                                    </div>
                                    <button 
                                        onClick={clearFilters}
                                        className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors bg-red-50 px-2 py-1 rounded-lg"
                                    >
                                        Clear All
                                    </button>
                                </div>

                                {/* Availability Filter */}
                                <div className="mb-10">
                                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Availability</h4>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative">
                                            <input 
                                                type="checkbox" 
                                                className="sr-only"
                                                checked={inStockOnly}
                                                onChange={(e) => { setInStockOnly(e.target.checked); setPage(1); }}
                                            />
                                            <div className={`w-11 h-6 rounded-full transition-colors ${inStockOnly ? 'bg-[#98c17b]' : 'bg-gray-200'}`} />
                                            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${inStockOnly ? 'translate-x-5' : ''}`} />
                                        </div>
                                        <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">In Stock Only</span>
                                    </label>
                                </div>

                                {/* Category Filter */}
                                <div className="mb-10">
                                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Category</h4>
                                    <div className="flex flex-col gap-1.5">
                                        <button 
                                            onClick={() => { setSelectedCategory(""); setPage(1); }}
                                            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between group ${selectedCategory === "" ? 'bg-[#98c17b] text-white shadow-lg shadow-green-100' : 'text-gray-600 hover:bg-gray-50'}`}
                                        >
                                            <span>All Products</span>
                                            <LuChevronRight size={16} className={`transition-transform ${selectedCategory === "" ? 'translate-x-0.5' : 'opacity-0 group-hover:opacity-100'}`} />
                                        </button>
                                        {allCategory.map(category => (
                                            <button
                                                key={category._id}
                                                onClick={() => { setSelectedCategory(category._id); setPage(1); }}
                                                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between group ${selectedCategory === category._id ? 'bg-[#98c17b] text-white shadow-lg shadow-green-100' : 'text-gray-600 hover:bg-gray-50'}`}
                                            >
                                                <span className="truncate">{category.name}</span>
                                                <LuChevronRight size={16} className={`transition-transform ${selectedCategory === category._id ? 'translate-x-0.5' : 'opacity-0 group-hover:opacity-100'}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div className="mb-10">
                                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Price Range</h4>
                                    <div className="px-2 mb-6">
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
                                                height: 6,
                                                '& .MuiSlider-thumb': {
                                                    width: 20,
                                                    height: 20,
                                                    backgroundColor: '#fff',
                                                    border: '3px solid #98c17b',
                                                    '&:hover, &.Mui-focusVisible': {
                                                        boxShadow: '0 0 0 8px rgba(152, 193, 123, 0.16)',
                                                    },
                                                },
                                                '& .MuiSlider-track': {
                                                    border: 'none',
                                                },
                                                '& .MuiSlider-rail': {
                                                    opacity: 0.3,
                                                    backgroundColor: '#bfbfbf',
                                                },
                                            }}
                                        />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Min</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">₹</span>
                                                <input 
                                                    type="number"
                                                    value={minPrice}
                                                    onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                                                    className="w-full pl-6 pr-2 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all"
                                                    placeholder="0"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Max</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">₹</span>
                                                <input 
                                                    type="number"
                                                    value={maxPrice}
                                                    onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                                                    className="w-full pl-6 pr-2 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all"
                                                    placeholder={maxPriceLimit}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <div className="flex-1">
                        {loading && data.length === 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                                {[...Array(6)].map((_, i) => (
                                    <CardLoading key={`skeleton-${i}`} />
                                ))}
                            </div>
                        ) : data.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {data.map((product) => (
                                        <CardProduct key={product._id} data={product} />
                                    ))}
                                </div>

                                { /* Load More Button */ }
                                {totalPages > page && (
                                    <div className="flex items-center justify-center mt-16 pb-12">
                                        <button
                                            onClick={handleLoadMore}
                                            disabled={loading}
                                            className={`flex items-center space-x-3 px-12 py-4 rounded-2xl font-bold transition-all shadow-xl group ${
                                                loading 
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                : 'bg-[#70a139] text-white hover:bg-[#5e8730] hover:scale-105 active:scale-95 shadow-green-100'
                                            }`}
                                        >
                                            {loading ? (
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <LuChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
                                            )}
                                            <span>{loading ? 'Loading...' : 'Load More Products'}</span>
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <NoData 
                                message="No Products Matched"
                                description="We couldn't find any products matching your current filters. Try adjusting your price range or category."
                            >
                                <button 
                                    onClick={clearFilters}
                                    className="px-8 py-3.5 bg-[#70a139] text-white rounded-2xl font-bold text-sm shadow-xl shadow-green-100 hover:bg-[#5e8730] transition-all active:scale-95"
                                >
                                    Clear All Filters
                                </button>
                            </NoData>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllProducts;
