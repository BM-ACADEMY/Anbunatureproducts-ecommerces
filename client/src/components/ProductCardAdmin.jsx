import React, { useState } from 'react'
import EditProductAdmin from './EditProductAdmin'
import CofirmBox from './CofirmBox'
import { IoClose } from 'react-icons/io5'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import { toast } from 'sonner'

const ProductCardAdmin = ({ data, fetchProductData }) => {
  const [editOpen,setEditOpen]= useState(false)
  const [openDelete,setOpenDelete] = useState(false)

  const handleDeleteCancel  = ()=>{
      setOpenDelete(false)
  }

  const handleDelete = async()=>{
    try {
      const response = await Axios({
        ...SummaryApi.deleteProduct,
        data : {
          _id : data._id
        }
      })

      const { data : responseData } = response

      if(responseData.success){
          toast.success(responseData.message)
          if(fetchProductData){
            fetchProductData()
          }
          setOpenDelete(false)
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }
  return (
    <div className='bg-white group border border-gray-200 rounded shadow hover:shadow-md transition-all flex flex-col h-full'>
        <div className='aspect-square w-full p-4 flex items-center justify-center overflow-hidden relative'>
            <img
               src={data?.image[0]}  
               alt={data?.altText || data?.name}
               className='h-full w-full object-scale-down transition-transform'
            />
            
            {/* Tags/Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {data?.megaCombo && (
                <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                  Mega Combo
                </span>
              )}
              {data?.trending && (
                <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                  Trending
                </span>
              )}
              {data?.comboOffer && (
                <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                  Combo
                </span>
              )}
            </div>
        </div>
        <div className='px-4 py-2 border-t flex-grow flex flex-col'>
            <p className='text-center font-medium line-clamp-2 min-h-[3rem]' title={data?.name}>{data?.name}</p>
            <p className='text-center text-slate-400 text-sm mt-1'>{data?.unit}</p>
        </div>
        <div className='p-2 grid grid-cols-2 gap-2 mt-auto'>
          <button 
            onClick={()=>setEditOpen(true)} 
            className='text-sm bg-green-100 text-green-700 py-1 px-2 rounded hover:bg-green-200 transition-colors'
          >
            Edit
          </button>
          <button 
            onClick={()=>setOpenDelete(true)} 
            className='text-sm bg-red-100 text-red-700 py-1 px-2 rounded hover:bg-red-200 transition-colors'
          >
            Delete
          </button>
        </div>

        {
          editOpen && (
            <EditProductAdmin fetchProductData={fetchProductData} data={data} close={()=>setEditOpen(false)}/>
          )
        }

        {
          openDelete && (
            <CofirmBox 
              confirm={handleDelete}
              cancel={handleDeleteCancel}
              close={()=>setOpenDelete(false)}
            />
          )
        }
    </div>
  )
}

export default ProductCardAdmin
