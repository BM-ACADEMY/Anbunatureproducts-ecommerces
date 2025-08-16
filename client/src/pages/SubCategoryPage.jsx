import React, { useEffect, useState } from "react";
import UploadSubCategoryModel from "../components/UploadSubCategoryModel";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import ViewImage from "../components/ViewImage";
import EditSubCategory from "../components/EditSubCategory";
import CofirmBox from "../components/CofirmBox";
import toast from "react-hot-toast";
import AddIcon from "@mui/icons-material/Add";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
  Chip,
  Stack,
  Pagination,
} from "@mui/material";

const SubCategoryPage = () => {
  const [openAddSubCategory, setOpenAddSubCategory] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({ _id: "" });
  const [deleteSubCategory, setDeleteSubCategory] = useState({ _id: "" });
  const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const fetchSubCategory = async () => {
    try {
      setLoading(true);
      const response = await Axios({ ...SummaryApi.getSubCategory });
      const { data: responseData } = response;
      if (responseData.success) {
        setData(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteSubCategory,
        data: deleteSubCategory,
      });
      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        fetchSubCategory();
        setOpenDeleteConfirmBox(false);
        setDeleteSubCategory({ _id: "" });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  useEffect(() => {
    fetchSubCategory();
  }, []);

  return (
    <Box sx={{ p: 0 }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          mb: 3,
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
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
          SubCategory
        </Typography>

        <Box sx={{ ml: "auto" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenAddSubCategory(true)}
            sx={{ fontSize: { xs: "12px", sm: "14px" } }}
          >
            <AddIcon sx={{ mr: 0.5 }} /> Add
          </Button>
        </Box>
      </Box>

      {/* Grid */}
      <Grid container spacing={2}>
        {currentItems.map((item) => (
          <Grid item key={item._id} xs={12} sm={6} md={4} lg={3} xl={2}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                width: "100%",
                boxShadow: 3,
                "&:hover": {
                  boxShadow: 6,
                },
              }}
            >
              <CardMedia
                component="img"
                image={item.image}
                alt={item.name}
                sx={{
                  height: 140,
                  objectFit: "contain",
                  p: 1,
                  cursor: "pointer",
                }}
                onClick={() => setImageURL(item.image)}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  variant="subtitle1"
                  align="center"
                  sx={{ fontSize: { xs: "14px", sm: "16px", md: "18px" } }}
                >
                  {item.name}
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    mt: 1,
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {item.category.map((cat) => (
                    <Chip
                      key={cat._id}
                      label={cat.name}
                      size="small"
                      sx={{
                        fontSize: { xs: "10px", sm: "12px", md: "13px" },
                      }}
                    />
                  ))}
                </Stack>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  color="success"
                  sx={{ fontSize: { xs: "12px", sm: "14px" } }}
                  onClick={() => {
                    setOpenEdit(true);
                    setEditData(item);
                  }}
                >
                  Edit
                </Button>
                <Button
                  fullWidth
                  color="error"
                  sx={{ fontSize: { xs: "12px", sm: "14px" } }}
                  onClick={() => {
                    setOpenDeleteConfirmBox(true);
                    setDeleteSubCategory(item);
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
      {data.length > itemsPerPage && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={Math.ceil(data.length / itemsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="medium"
          />
        </Box>
      )}

      {/* Modals */}
      {openAddSubCategory && (
        <UploadSubCategoryModel
          fetchData={fetchSubCategory}
          close={() => setOpenAddSubCategory(false)}
        />
      )}

      {openEdit && (
        <EditSubCategory
          data={editData}
          fetchData={fetchSubCategory}
          close={() => setOpenEdit(false)}
        />
      )}

      {openDeleteConfirmBox && (
        <CofirmBox
          confirm={handleDeleteSubCategory}
          cancel={() => setOpenDeleteConfirmBox(false)}
          close={() => setOpenDeleteConfirmBox(false)}
        />
      )}

      {imageURL && <ViewImage url={imageURL} close={() => setImageURL("")} />}
    </Box>
  );
};

export default SubCategoryPage;
