import React, { useEffect, useState } from 'react';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { Link, useParams } from 'react-router-dom';
import AxiosToastError from '../utils/AxiosToastError';
import Loading from '../components/Loading';
import CardProduct from '../components/CardProduct';
import { useSelector } from 'react-redux';
import { valideURLConvert } from '../utils/valideURLConvert';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ProductListPage = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const params = useParams();
  const AllSubCategory = useSelector((state) => state.product.allSubCategory);
  const [DisplaySubCatory, setDisplaySubCategory] = useState([]);

  const subCategory = params?.subCategory?.split('-');
  const subCategoryName = subCategory?.slice(0, subCategory?.length - 1)?.join(' ') || 'Products';
  const categoryId = params.category?.split('-').slice(-1)[0] || '';
  const subCategoryId = params.subCategory?.split('-').slice(-1)[0] || '';

  const fetchProductdata = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductByCategoryAndSubCategory,
        data: {
          categoryId: categoryId,
          subCategoryId: subCategoryId,
          page: page,
          limit: 8,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        if (responseData.page === 1) {
          setData(responseData.data);
        } else {
          setData([...data, ...responseData.data]);
        }
        setTotalPage(responseData.totalCount);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductdata();
  }, [params]);

  useEffect(() => {
    const sub = AllSubCategory.filter((s) => {
      const filterData = s.category?.some((el) => el._id === categoryId);
      return filterData || null;
    });
    setDisplaySubCategory(sub);
  }, [params, AllSubCategory]);

  // Unique class names for navigation buttons
  const prevButtonClass = `swiper-button-prev-${subCategoryId}`;
  const nextButtonClass = `swiper-button-next-${subCategoryId}`;

  return (
    <section className="container mx-auto py-4">
      {/* Subcategory Circles */}
      <div className="top-20 z-10 bg-white p-4">
        <h3 className="font-semibold text-lg mb-4">{subCategoryName}</h3>
        <div className="flex overflow-x-auto space-x-4 pb-4 scrollbarCustom">
          {DisplaySubCatory.map((s, index) => {
            const link = `/${valideURLConvert(s?.category[0]?.name || 'category')}-${s?.category[0]?._id || ''}/${valideURLConvert(s.name || 'subcategory')}-${s._id || ''}`;
            return (
              <Link
                key={index}
                to={link}
                className="flex flex-col items-center min-w-[140px] p-2 rounded-lg transition-colors"
              >
                <div className="w-28 h-28 rounded-full overflow-hidden bg-white">
                  <img
                    src={s.image || '/placeholder.png'}
                    alt={s.name || 'Subcategory'}
                    className="w-full h-full object-scale-down p-1"
                  />
                </div>
                <p className="mt-2 text-sm text-center">{s.name || 'Subcategory'}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Product Slider */}
      <div className="mt-6">
        <div className="relative min-h-[60vh]">
          {data.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={16}
              slidesPerView={1}
              navigation={{
                nextEl: `.${nextButtonClass}`,
                prevEl: `.${prevButtonClass}`,
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              style={{
                '--swiper-pagination-color': '#16a34a',
                '--swiper-pagination-bullet-inactive-color': '#d1d5db',
                '--swiper-pagination-bullet-inactive-opacity': '0.5',
                '--swiper-pagination-bullet-size': '8px',
                '--swiper-pagination-bullet-horizontal-gap': '4px',
              }}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
              className="mySwiper"
            >
              {data.map((p, index) => (
                <SwiperSlide key={p._id + 'productSubCategory' + index}>
                  <div className="h-[400px]">
                    <CardProduct data={p} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="flex justify-center items-center h-[60vh]">
              <p className="text-gray-500">No products available</p>
            </div>
          )}
          {data.length > 1 && (
            <>
              <button
                className={`${prevButtonClass} absolute top-1/2 left-0 z-10 bg-white hover:bg-gray-100 shadow-lg p-3 rounded-full transform -translate-y-1/2`}
                aria-label={`Previous ${subCategoryName} products`}
              >
                <FaAngleLeft className="text-xl text-gray-700" />
              </button>
              <button
                className={`${nextButtonClass} absolute top-1/2 right-0 z-10 bg-white hover:bg-gray-100 shadow-lg p-3 rounded-full transform -translate-y-1/2`}
                aria-label={`Next ${subCategoryName} products`}
              >
                <FaAngleRight className="text-xl text-gray-700" />
              </button>
            </>
          )}
          {loading && <Loading />}
        </div>
      </div>

      {/* Inline CSS to enforce consistent card height */}
      <style jsx>{`
        .mySwiper .swiper-slide .h-[400px] > div {
          height: 100%;
          display: flex;
          flex-direction: column;
          border-radius: 0.75rem;
          overflow: hidden;
        }
        .mySwiper .swiper-slide .h-[400px] > div > a {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }
        .mySwiper .swiper-slide .h-[400px] > div > a > div:last-child {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .mySwiper .swiper-slide .h-[400px] > div > div:last-child {
          padding: 1rem;
        }
      `}</style>
    </section>
  );
};

export default ProductListPage;