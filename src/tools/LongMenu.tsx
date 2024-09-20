import React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import ListItemText from '@mui/material/ListItemText';
import AlertDialog from './DeleteAlertDialog';

interface LongMenuProps {
  handleViewDetails: () => void;
  handleEdit: () => void;
  handleDelete: () => void;
}

const LongMenu: React.FC<LongMenuProps> = ({
  // handleViewDetails,
  handleEdit,
  handleDelete,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false); // State for delete confirmation dialog
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirmed = () => {
    setDeleteDialogOpen(false);
    handleDelete();
  };

  const handleDeleteCancelled = () => {
    setDeleteDialogOpen(false);
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {/* <MenuItem onClick={() => { handleClose(); handleViewDetails(); }}>
          <VisibilityIcon />
          <ListItemText primary="View" />
        </MenuItem> */}
        <MenuItem onClick={() => { handleClose(); handleEdit(); }}>
          <EditIcon />
          <ListItemText primary="Edit" />
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <DeleteIcon />
          <ListItemText primary="Delete" />
        </MenuItem>
      </Menu>

      {/* Confirmation Dialog */}
      <AlertDialog
        open={deleteDialogOpen}
        title="Confirm Delete"
        message="Are you sure you want to delete this patient?"
        onConfirm={handleDeleteConfirmed}
        onCancel={handleDeleteCancelled}
      />
    </div>
  );
};

export default LongMenu;
