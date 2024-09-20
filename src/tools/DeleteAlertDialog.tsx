import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

interface AlertDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{message}</DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          No
        </Button>
        <Button onClick={onConfirm} color="primary">
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
