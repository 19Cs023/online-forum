import React, { useState } from 'react';
import { Box, Container, Grid, Button, Modal, Fade, Backdrop } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Suggestions from '../layout/suggestions';
import AllQuestionsCard from '../components/AllQuestionsCard';
import AddQuestion from '../components/AddQuestions';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: 600,
  maxHeight: '90vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2
};

const DashBoard = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      
      {/* Main Content Area */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, display: 'flex', justifyContent: 'center' }}>
        <Container maxWidth="xl" sx={{ display: 'flex', gap: 3, flexDirection: 'column' }}>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpen}>
              Ask Question
            </Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 3, width: '100%' }}>
            {/* Main Questions Column */}
            <Box sx={{ flexGrow: 1, maxWidth: '800px' }}>
              <AllQuestionsCard />
            </Box>

            {/* Right Sidebar / Suggestions Column */}
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Suggestions />
            </Box>
          </Box>

        </Container>
      </Box>

      {/* Ask Question Modal */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={open}>
          <Box sx={style}>
             <AddQuestion />
          </Box>
        </Fade>
      </Modal>

    </Box>
  );
};

export default DashBoard;
