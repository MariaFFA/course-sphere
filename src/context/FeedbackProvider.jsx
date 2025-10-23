import { useState } from 'react';
import { FeedbackContext } from '../hooks/useFeedback';
import { Snackbar, Alert } from '@mui/material';

export const FeedbackProvider = ({ children }) => {
  const [feedback, setFeedback] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const showFeedback = (message, severity = 'success') => {
    setFeedback({ open: true, message, severity });
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setFeedback((prev) => ({ ...prev, open: false }));
  };

  const value = {
    showFeedback,
  };

  return (
    <FeedbackContext.Provider value={value}>
      {children}
      
      <Snackbar
        open={feedback.open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleClose}
          severity={feedback.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {feedback.message}
        </Alert>
      </Snackbar>
    </FeedbackContext.Provider>
  );
};