import React, { useEffect, useState } from 'react';
import UploadCategoryModel from '../components/UploadCategoryModel';
import Loading from '../components/Loading';
import NoData from '../components/NoData';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import EditCategory from '../components/EditCategory';
import CofirmBox from '../components/CofirmBox';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import AddIcon from '@mui/icons-material/Add';

import {
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Button,
    Typography,
    Box,
    Pagination
} from '@mui/material';

const CategoryPage = () => {
    const [openUploadCategory, setOpenUploadCategory] = useState(false);
    const [loading, setLoading] = useState(false);
    const [categoryData, setCategoryData] = useState([]);
    const [openEdit, setOpenEdit] = useState(false);
    const [editData, setEditData] = useState({
        name: "",
        image: "",
    });
    const [openConfimBoxDelete, setOpenConfirmBoxDelete] = useState(false);
    const [deleteCategory, setDeleteCategory] = useState({
        _id: ""
    });

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = categoryData.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const fetchCategory = async () => {
        try {
            setLoading(true);
            const response = await Axios({ ...SummaryApi.getCategory });
            const { data: responseData } = response;

            if (responseData.success) {
                setCategoryData(responseData.data);
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCategory = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.deleteCategory,
                data: deleteCategory
            });

            const { data: responseData } = response;

            if (responseData.success) {
                toast.success(responseData.message);
                fetchCategory();
                setOpenConfirmBoxDelete(false);
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    useEffect(() => {
        fetchCategory();
    }, []);

    return (
        <Box sx={{ p: 0 }}>
            {/* Header */}
            <Box
                sx={{
                    p: 2,
                    mb: 3,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderRadius: 2,
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 600,
                        fontSize: { xs: "18px", sm: "20px", md: "22px" },
                    }}
                >
                    Category
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenUploadCategory(true)}
                    sx={{ fontSize: { xs: "12px", sm: "14px" } }}
                >
                    <AddIcon sx={{ mr: 0.5 }} /> Add
                </Button>
            </Box>

            {/* No Data */}
            {!categoryData[0] && !loading && <NoData />}

            {/* Category Grid */}
            <Grid container spacing={2}>
                {currentItems.map((category) => (
                    <Grid item key={category._id} xs={12} sm={12} md={6} lg={3}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                '&:hover': {
                                    boxShadow: 6,
                                },
                            }}
                        >
                            <CardMedia
                                component="img"
                                image={category.image}
                                alt={category.name}
                                sx={{ height: 140, objectFit: 'contain', p: 1 }}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="subtitle1" align="center">{category.name}</Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    fullWidth
                                    color="success"
                                    onClick={() => {
                                        setOpenEdit(true);
                                        setEditData(category);
                                    }}
                                >
                                    Edit
                                </Button>
                                <Button
                                    fullWidth
                                    color="error"
                                    onClick={() => {
                                        setOpenConfirmBoxDelete(true);
                                        setDeleteCategory(category);
                                    }}
                                >
                                    Delete
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Pagination */}
            {categoryData.length > itemsPerPage && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                        count={Math.ceil(categoryData.length / itemsPerPage)}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        size="medium"
                    />
                </Box>
            )}

            {/* Loading */}
            {loading && <Loading />}

            {/* Modals */}
            {openUploadCategory && (
                <UploadCategoryModel
                    fetchData={fetchCategory}
                    close={() => setOpenUploadCategory(false)}
                />
            )}

            {openEdit && (
                <EditCategory
                    data={editData}
                    fetchData={fetchCategory}
                    close={() => setOpenEdit(false)}
                />
            )}

            {openConfimBoxDelete && (
                <CofirmBox
                    confirm={handleDeleteCategory}
                    cancel={() => setOpenConfirmBoxDelete(false)}
                    close={() => setOpenConfirmBoxDelete(false)}
                />
            )}
        </Box>
    );
};

export default CategoryPage;
