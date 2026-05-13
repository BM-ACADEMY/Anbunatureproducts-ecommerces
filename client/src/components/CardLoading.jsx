import React from 'react';
import { Skeleton, Box } from '@mui/material';

const CardLoading = () => {
  return (
    <Box
      className="flex flex-col bg-white shadow-md w-full max-w-[450px] h-full min-h-[460px] md:min-h-[520px] mx-auto rounded-xl overflow-hidden border border-gray-100 mb-6 md:mb-8"
    >
      <Skeleton variant="rectangular" height={288} width="100%" />
      <Box className="p-5 flex flex-col flex-grow">
        <Skeleton variant="text" width="40%" height={24} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="90%" height={32} />
        <Skeleton variant="text" width="70%" height={32} sx={{ mb: 2 }} />
        
        <Box sx={{ mt: "auto" }}>
          <Skeleton variant="rectangular" width="30%" height={24} sx={{ borderRadius: 1, mb: 2 }} />
          <Skeleton variant="text" width="50%" height={40} />
        </Box>
      </Box>
      <Box className="px-4 pb-4 pt-1">
        <Skeleton variant="rectangular" height={40} sx={{ borderRadius: '8px' }} />
      </Box>
    </Box>
  );
};

export default CardLoading;
