import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { IoClose } from "react-icons/io5";
import { useGlobalContext } from '../provider/GlobalProvider'
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'; // Import MUI components

const AddAddress = ({ close }) => {
    const { register, handleSubmit, reset, setError } = useForm()
    const { fetchAddress } = useGlobalContext()
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const onSubmit = async (data) => {
        try {
            const response = await Axios({
                ...SummaryApi.createAddress,
                data: {
                    address_line: data.addressline,
                    city: data.city,
                    state: data.state,
                    country: data.country,
                    pincode: data.pincode,
                    mobile: data.mobile
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                close()
                reset()
                fetchAddress()
            } else {
                setErrorDialogOpen(true)
                setErrorMessage(responseData.message || "Something went wrong. Please try again.")
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <section onClick={close} className='bg-black bg-opacity-70 fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center overflow-auto'>
            <div onClick={(e) => e.stopPropagation()} className='bg-white p-4 w-full max-w-lg mx-auto rounded'>
                <div className='flex justify-between items-center gap-4'>
                    <h2 className='font-semibold text-lg'>Add Address</h2>
                    <button onClick={close} className='hover:text-red-500'>
                        <IoClose size={25} />
                    </button>
                </div>
                <form className='mt-4 grid gap-4' onSubmit={handleSubmit(onSubmit)}>
                    {[ 
                        { id: 'addressline', label: 'Address Line' },
                        { id: 'city', label: 'City' },
                        { id: 'state', label: 'State' },
                        { id: 'pincode', label: 'Pincode' },
                        { id: 'country', label: 'Country' },
                        { id: 'mobile', label: 'Mobile No.' }
                    ].map(({ id, label }) => (
                        <div key={id}>
                            <TextField
                                label={label}
                                variant="outlined"
                                fullWidth
                                {...register(id, { required: true })}
                                className="mb-4"
                                error={false} // Can be customized to show error state
                                helperText={false ? 'This field is required' : ''} // Display helper text for validation error
                            />
                        </div>
                    ))}

                    <div className="flex justify-between gap-4">
                        <Button
                            onClick={close}
                            color="error"
                            fullWidth
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            color="success"
                            fullWidth
                        >
                            Submit
                        </Button>
                    </div>
                </form>
            </div>

            {/* Error Dialog */}
            <Dialog open={errorDialogOpen} onClose={() => setErrorDialogOpen(false)}>
                <DialogTitle>Error</DialogTitle>
                <DialogContent>
                    <p>{errorMessage}</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setErrorDialogOpen(false)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </section>
    )
}

export default AddAddress
