import React from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material'

const CofirmBox = ({ cancel, confirm, close }) => {
  return (
    <Dialog
      open={true}
      onClose={close}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
      maxWidth="xs"
      fullWidth
    >
      <div className="">
        <DialogTitle id="confirmation-dialog-title" className="flex justify-between items-center">
          <span className="font-semibold">Permanent Delete</span>
        </DialogTitle>
        <DialogContent>
          <p style={{ color: 'grey' }}>Are you sure you want to permanently delete this?</p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={cancel}
            
            color="error"
          >
            Cancel
          </Button>
          <Button
            onClick={confirm}
            
            color="success"
          >
            Confirm
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  )
}

export default CofirmBox
