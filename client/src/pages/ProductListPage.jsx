import React, { useEffect, useState } from 'react';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { Link, useParams } from 'react-router-dom';
import AxiosToastError from '../utils/AxiosToastError';
import Loading from '../components/Loading';
import NoData from '../components/NoData';
import CardLoading from '../components/CardLoading';
import CardProduct from '../components/CardProduct';
import { useSelector } from 'react-redux';
import { valideURLConvert } from '../utils/valideURLConvert';
import { Slider, Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { FiShoppingBag } from 'react-icons/fi';

const ProductListPage = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const params = useParams();
  const AllSubCategory = useSelector((state) => state.product.allSubCategory || []);
  const [DisplaySubCategory, setDisplaySubCategory] = useState([]);
  const [subCategoryLoading, setSubCategoryLoading] = useState(false);

  const categoryId = params.category?.split('-').slice(-1)[0] || '';
  const subCategoryId = params.subCategory?.split('-').slice(-1)[0] || '';
  const subCategory = params?.subCategory?.split('-');
  const subCategoryName = subCategoryId ? (subCategory?.slice(0, subCategory?.length - 1)?.join(' ') || 'Products') : (params.category?.split('-').slice(0, -1).join(' ') || 'Category');

  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [debouncedPriceRange, setDebouncedPriceRange] = useState([0, 5000]);
  const [maxPriceLimit, setMaxPriceLimit] = useState(5000);

  const fetchProductdata = async (reset = false) => {
    try {
      setLoading(true);
      const apiUrl = subCategoryId ? SummaryApi.getProductByCategoryAndSubCategory : SummaryApi.getProductByCategory;
      const response = await Axios({
        ...apiUrl,
        data: {
          categoryId,
          subCategoryId: subCategoryId || undefined,
          page,
          limit: 8,
          minPrice: debouncedPriceRange[0],
          maxPrice: debouncedPriceRange[1],
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        if (reset || page === 1) {
          setData(responseData.data);
        } else {
          setData((prev) => [...prev, ...responseData.data]);
        }
        if (responseData.maxPriceLimit !== undefined && responseData.maxPriceLimit !== maxPriceLimit) {
          setMaxPriceLimit(responseData.maxPriceLimit);
        }
        setTotalPages(responseData.totalPages);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubCategories = async () => {
    try {
      setSubCategoryLoading(true);
      const response = await Axios({
        ...SummaryApi.getSubCategory,
      });

      const { data: responseData } = response;

      if (responseData.success) {
        console.log('Fetched SubCategories:', responseData.data.map(s => ({ name: s.name, createdAt: s.createdAt })));
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setSubCategoryLoading(false);
    }
  };

  useEffect(() => {
    setData([]);
    setPage(1);
    fetchProductdata(true);
    fetchSubCategories();
  }, [categoryId, subCategoryId]);

  useEffect(() => {
    setPage(1);
    fetchProductdata(true);
  }, [debouncedPriceRange]);

  useEffect(() => {
    console.log('AllSubCategory:', AllSubCategory.map(s => ({ name: s.name, createdAt: s.createdAt })));

    const sub = AllSubCategory.filter((s) => {
      const filterData = s.category?._id === categoryId || s.category === categoryId;
      return filterData || null;
    }).sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
      return dateB - dateA;
    });

    console.log('DisplaySubCatory:', sub.map(s => ({ name: s.name, createdAt: s.createdAt })));
    setDisplaySubCategory(sub);
  }, [categoryId, AllSubCategory]);

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (page > 1) {
      fetchProductdata();
    }
  }, [page]);

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPriceRange(priceRange);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [priceRange]);

  return (
    <section className="bg-slate-50">
      <div className="container mx-auto py-2">
        {/* Subcategory Circles */}
        <div className="px-2 pb-2 pt-3">
          <h3 className="font-light font-outfit text-lg mb-2">{subCategoryName}</h3>
          {subCategoryLoading ? (
            <div className="flex justify-center">
              <Loading />
            </div>
          ) : (
            <div className="flex overflow-x-auto space-x-4 pb-6 pt-4 scrollbar-hide px-2">
              {DisplaySubCategory.map((s, index) => {
                const link = `/${valideURLConvert(s?.category?.name || 'category')}-${s?.category?._id || ''}/${valideURLConvert(s.name || 'subcategory')}-${s._id || ''}`;
                const isActive = subCategoryId === s._id;
                
                return (
                  <Link
                    key={s._id + index}
                    to={link}
                    className="flex-shrink-0"
                  >
                    <motion.div
                       whileHover={{ y: -8 }}
                       transition={{ type: "spring", stiffness: 300, damping: 20 }}
                       className={`flex flex-col items-center group cursor-pointer min-w-[100px] xs:min-w-[120px]`}
                    >
                        <div className={`w-[85px] xs:w-[100px] h-[85px] xs:h-[100px] rounded-full overflow-hidden relative flex items-center justify-center shadow-md border-2 transition-all duration-500 bg-white ${isActive ? 'border-green-500 shadow-green-100 scale-105' : 'border-transparent group-hover:shadow-lg'}`}>
                            <img
                              src={s.image || '/placeholder.png'}
                              alt={s.altText || s.name || 'Subcategory'}
                              className="w-full h-full object-scale-down p-2 transition-transform duration-700 group-hover:scale-110"
                            />
                            {/* Hover Overlay */}
                            <div className={`absolute inset-0 bg-black/40 flex items-center justify-center p-2 transition-all duration-500 rounded-full ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100'}`}>
                               <span className="text-white font-bold text-[0.65rem] xs:text-[0.75rem] uppercase text-center leading-tight font-outfit tracking-wider">
                                 {s.name}
                               </span>
                            </div>
                        </div>
                        {/* <p className={`mt-3 font-outfit text-sm font-semibold transition-colors duration-300 ${isActive ? 'text-green-600' : 'text-gray-600 group-hover:text-green-500'}`}>
                            {s.name || 'Subcategory'}
                        </p> */}
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Product Grid */}
        <div className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading && data.length === 0 ? (
              <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <CardLoading key={`loading-skeleton-${i}`} />
                ))}
              </div>
            ) : data.length > 0 ? (
              data.map((p, index) => (
                <CardProduct key={p._id + 'product' + index} data={p} />
              ))
            ) : (
              <div className="col-span-full">
                <NoData 
                  message="No Products Found"
                  description={`It seems we don't have any products matching your current selection in ${subCategoryName}.`}
                >
                </NoData>
              </div>
            )}
          </div>
          {page < totalPages && (
            <div className="mt-4 text-center">
              <button
                onClick={handleLoadMore}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductListPage;