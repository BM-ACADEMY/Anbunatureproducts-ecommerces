import React from 'react'
import { IoClose } from 'react-icons/io5'

const ViewImage = ({url,close}) => {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-[9999] p-4' onClick={close}>
        <div className='relative w-full h-full flex justify-center items-center' onClick={(e) => e.stopPropagation()}>
            <button onClick={close} className='absolute top-4 right-4 text-white hover:text-gray-300 z-10'>
                <IoClose size={35}/>
            </button>
            <img 
                src={url}
                alt='full screen'
                className='max-w-full max-h-full object-contain select-none pointer-events-none'
            />
        </div>
    </div>
  )
}

export default ViewImage
