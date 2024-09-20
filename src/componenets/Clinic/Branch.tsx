import React, { useEffect } from 'react';
import { Button, TextField, Stack, Grid, IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import branchImage from '../../assets/branch.png'; // Adjust based on your folder structure
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface BranchProps {
  onNext: () => void;
  onBack: () => void;
  addBranches: (branches: { name: string; address: string }[]) => void;
  initialBranches: { name: string; address: string }[];
}

const Branch: React.FC<BranchProps> = ({ onNext, onBack, addBranches, initialBranches }) => {
  const [branches, setBranches] = React.useState<{ name: string; address: string }[]>(initialBranches || [{ name: '', address: '' }]);
  const [errors, setErrors] = React.useState<{ name: boolean; address: boolean }[]>([{ name: false, address: false }]);
  const [showErrors, setShowErrors] = React.useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Disable browser back and forward buttons
    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault();
      navigate(0); // Reload the page to prevent navigation
    };

    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);



  const handleBranchChange = (index: number, field: 'name' | 'address', value: string) => {
    const updatedBranches = [...branches];
    updatedBranches[index][field] = value;
    setBranches(updatedBranches);
  };

  const handleAddBranch = () => {
    setBranches([...branches, { name: '', address: '' }]);
    setErrors([...errors, { name: false, address: false }]);
  };

  const handleRemoveBranch = (index: number) => {
    const updatedBranches = branches.filter((_, i) => i !== index);
    const updatedErrors = errors.filter((_, i) => i !== index);
    setBranches(updatedBranches);
    setErrors(updatedErrors);
  };

  const handleNext = () => {
    const newErrors = branches.map(branch => ({
      name: branch.name.trim() === '',
      address: branch.address.trim() === ''
    }));
    setErrors(newErrors);
    setShowErrors(true);

    const hasError = newErrors.some(error => error.name || error.address);
    if (!hasError) {
      addBranches(branches);
      onNext();
    }
  };

  return (
    <Grid container spacing={2}>
      {/* Left Side: Image Holder */}
      <Grid item xs={6}>
        <motion.div
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            height: '400px',
            backgroundImage: `url(${branchImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            textAlign: 'center',
            padding: '20px',
            margin: '20px',
            opacity: 0.8,
          }}
        />
      </Grid>
      
      {/* Right Side: Branch Form */}
      <Grid item xs={6}>
        <Stack spacing={2}>
          <h1 style={{ textAlign: 'center' }}>Create Branches</h1>
          {branches.map((branch, index) => (
            <Stack key={index} spacing={2} sx={{ marginBottom: 2, padding: 3 }}>
              <TextField
                id={`branch-name-${index}`}
                label="Branch Name"
                variant="outlined"
                value={branch.name}
                onChange={(e) => handleBranchChange(index, 'name', e.target.value)}
                error={showErrors && errors[index]?.name}
                helperText={showErrors && errors[index]?.name ? "Branch name is required" : ""}
                required
              />
              <TextField
                id={`branch-address-${index}`}
                label="Branch Address"
                variant="outlined"
                value={branch.address}
                onChange={(e) => handleBranchChange(index, 'address', e.target.value)}
                error={showErrors && errors[index]?.address}
                helperText={showErrors && errors[index]?.address ? "Branch address is required" : ""}
                required
              />
              <IconButton color="secondary" onClick={() => handleRemoveBranch(index)}>
                <RemoveCircleOutlineIcon />
              </IconButton>
            </Stack>
          ))}
          <IconButton color="primary" onClick={handleAddBranch}>
            <AddCircleOutlineIcon />
          </IconButton>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Button variant="outlined" onClick={onBack} style={{ marginRight: '10px' }}>
              Back
            </Button>
            <Button variant="contained" onClick={handleNext}>
              Next
            </Button>
          </div>
        </Stack>
      </Grid>
    </Grid>
  );
};
export default Branch;