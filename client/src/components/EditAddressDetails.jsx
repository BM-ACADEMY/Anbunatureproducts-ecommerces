import React from 'react';
import { useForm } from "react-hook-form";
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import { useGlobalContext } from '../provider/GlobalProvider';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Stack,
  Typography
} from '@mui/material';

import { IoClose, IoSaveSharp } from "react-icons/io5";
import { MdCancel } from "react-icons/md";

const EditAddressDetails = ({ close, data }) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      _id: data._id,
      userId: data.userId,
      address_line: data.address_line,
      city: data.city,
      state: data.state,
      country: data.country,
      pincode: data.pincode,
      mobile: data.mobile
    }
  });

  const { fetchAddress } = useGlobalContext();

  const onSubmit = async (formData) => {
    try {
      const response = await Axios({
        ...SummaryApi.updateAddress,
        data: formData
      });

      if (response.data.success) {
        toast.success(response.data.message);
        close();
        reset();
        fetchAddress();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <Dialog open onClose={close} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography fontWeight={600}>Edit Address</Typography>
        <IconButton onClick={close}>
          <IoClose size={22} />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Stack spacing={2}>
            {[ 
              { id: 'address_line', label: 'Address Line' },
              { id: 'city', label: 'City' },
              { id: 'state', label: 'State' },
              { id: 'pincode', label: 'Pincode' },
              { id: 'country', label: 'Country' },
              { id: 'mobile', label: 'Mobile No.' }
            ].map(({ id, label }) => (
              <TextField
                key={id}
                label={label}
                fullWidth
                variant="outlined"
                size="small"
                {...register(id, { required: true })}
              />
            ))}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={close}
            color="error"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            color='success'
          >
            Save Changes
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditAddressDetails;
