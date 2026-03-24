import React from 'react';
import { Skeleton, Box } from '@mui/material';

const CardLoading = () => {
  return (
    <Box
      className="flex flex-col bg-white shadow-md w-full max-w-[360px] h-[500px] mx-auto rounded-xl overflow-hidden border border-gray-100 p-4 my-4"
    >
      <Skeleton variant="rectangular" height={288} sx={{ borderRadius: 1 }} />
      <Box sx={{ mt: 2 }}>
        <Skeleton variant="text" width="60%" height={30} />
        <Skeleton variant="text" width="100%" height={24} />
        <Skeleton variant="text" width="40%" height={24} sx={{ mt: 1 }} />
        <Skeleton variant="rectangular" height={40} sx={{ mt: "auto", borderRadius: 1 }} />
      </Box>
    </Box>
  );
};

export default CardLoading;
