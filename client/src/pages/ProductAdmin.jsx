import React, { useEffect, useState } from 'react';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';
import Loading from '../components/Loading';
import ProductCardAdmin from '../components/ProductCardAdmin';
import { IoSearchOutline } from "react-icons/io5";

const ProductAdmin = () => {
  const [productData, setProductData] = useState([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [totalPageCount, setTotalPageCount] = useState(0);
  const itemsPerPage = 12; // Adjusted for 6-column grid

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProduct,
        data: {
          page,
          limit: itemsPerPage,
          search: searchQuery.trim(),
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        setTotalPageCount(responseData.totalNoPage || 1);
        setProductData(responseData.data || []);
      } else {
        AxiosToastError(new Error(responseData.message || 'Failed to fetch products'));
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [page]);

  const handlePageChange = (value) => {
    setPage(value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    setPage(1);
    fetchProductData();
  };

  return (
    <section className=''>
      {/* Header */}
      <div className='p-2 flex items-center justify-between gap-4 bg-white shadow-sm rounded flex-wrap'>
          <h2 className='font-semibold text-lg sm:text-xl'>Product Management</h2>
          <div className='flex items-center bg-blue-50 focus-within:bg-white border focus-within:border-primary-200 px-3 py-1.5 rounded w-full max-w-sm transition-all'>
             <IoSearchOutline size={20} className='text-neutral-500' />
             <input 
                type='text' 
                placeholder='Search product...'
                className='bg-transparent outline-none px-2 w-full text-sm sm:text-base'
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
             />
             <button onClick={handleSearch} className='text-primary-200 hover:text-primary-300 font-medium text-sm'>
               Search
             </button>
          </div>
      </div>

      {loading && <Loading />}

      <div className='min-h-[60vh] py-6'>
          {productData.length === 0 && !loading ? (
            <div className='flex flex-col items-center justify-center py-20 bg-white rounded shadow-sm'>
               <p className='text-neutral-500 text-lg'>No products found.</p>
            </div>
          ) : (
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
               {productData.map((product, index) => (
                  <ProductCardAdmin key={product._id || index} data={product} fetchProductData={fetchProductData} />
               ))}
            </div>
          )}
      </div>

      {/* Pagination */}
      {totalPageCount > 1 && (
        <div className='flex items-center justify-center gap-2 mt-6 pb-10'>
             <button 
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className='px-3 py-1 border rounded hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base'
             >
                Prev
             </button>
             {[...Array(totalPageCount)].map((_, i) => (
                <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-3 py-1 rounded border text-sm sm:text-base ${page === i + 1 ? 'bg-primary-200 text-white border-primary-200' : 'hover:bg-neutral-100'}`}
                >
                    {i + 1}
                </button>
             ))}
             <button 
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPageCount}
                className='px-3 py-1 border rounded hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base'
             >
                Next
             </button>
        </div>
      )}
    </section>
  );
};

export default ProductAdmin;
