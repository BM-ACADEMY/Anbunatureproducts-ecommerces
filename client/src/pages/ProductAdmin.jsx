import React, { useEffect, useState } from 'react';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';
import Loading from '../components/Loading';
import ProductCardAdmin from '../components/ProductCardAdmin';

import {
  Box,
  Typography,
  Grid,
  Paper,
  Pagination,
  Stack,
  InputBase,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const ProductAdmin = () => {
  const [productData, setProductData] = useState([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [totalPageCount, setTotalPageCount] = useState(0);
  const itemsPerPage = 10;

  // Fetch products from backend
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

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  const handleSearch = () => {
    setPage(1); // reset to first page for new search
    fetchProductData();
  };

  return (
    <Box>
      {/* Top bar */}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          mb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Product Management
        </Typography>

        {/* Search bar */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#f1f3f9',
            borderRadius: 1,
            px: 1,
          }}
        >
          <InputBase
            placeholder="Search product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ ml: 1, flex: 1 }}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <IconButton onClick={handleSearch}>
            <SearchIcon />
          </IconButton>
        </Box>
      </Paper>

      {/* Loader */}
      {loading && <Loading />}

      {/* Product Grid */}
      <Box sx={{ px: 2, py: 3, backgroundColor: '#f0f4ff', borderRadius: 2 }}>
        <Box sx={{ minHeight: '55vh' }}>
          {productData.length === 0 && !loading ? (
            <Typography variant="h6" align="center" color="text.secondary" sx={{ mt: 5 }}>
              No products found.
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {productData.map((product, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product._id || index}>
                  <ProductCardAdmin data={product} fetchProductData={fetchProductData} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* Pagination */}
        {totalPageCount > 1 && (
          <Stack direction="row" justifyContent="center" mt={4}>
            <Pagination
              count={totalPageCount}
              page={page}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
              size="medium"
            />
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default ProductAdmin;
