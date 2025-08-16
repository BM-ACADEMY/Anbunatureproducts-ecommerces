import React from 'react';
import { Skeleton, Box } from '@mui/material';

const CardLoading = () => {
  return (
    <Box
      className="border py-2 lg:p-4 grid gap-1 lg:gap-3 min-w-36 lg:min-w-52 rounded cursor-pointer bg-white"
    >
      <Skeleton variant="rectangular" height={96} sx={{ borderRadius: 1 }} /> {/* min-h-24 */}
      <Skeleton variant="text" width={80} height={30} />
      <Skeleton variant="text" height={30} />
      <Skeleton variant="text" width={56} height={30} />

      <Box className="flex items-center justify-between gap-3">
        <Skeleton variant="text" width={80} height={30} />
        <Skeleton variant="text" width={80} height={30} />
      </Box>
    </Box>
  );
};

export default CardLoading;
