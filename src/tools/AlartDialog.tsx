import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import TextField from '@mui/material/TextField';
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface AlertDialogSlideProps {
  open: boolean;
  handleClose: () => void;
  handlePasswordDialogOpen: () => void;
}

const AlertDialogSlide: React.FC<AlertDialogSlideProps> = ({ open, handleClose, handlePasswordDialogOpen }) => {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{"Access Restricted"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          This page is accessible only to Super Admin.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handlePasswordDialogOpen}>Yes, I am</Button>
      </DialogActions>
    </Dialog>
  );
};

interface PasswordDialogProps {
  open: boolean;
  handleClose: () => void;
  handlePasswordSubmit: () => void;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
}

const PasswordDialog: React.FC<PasswordDialogProps> = ({ open, handleClose, handlePasswordSubmit, password, setPassword }) => {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{"Enter Super Admin Password"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Please enter the super admin password to proceed.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Password"
          type="password"
          fullWidth
          variant="standard"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handlePasswordSubmit}>OK</Button>
      </DialogActions>
    </Dialog>
  );
};

export { AlertDialogSlide, PasswordDialog };
