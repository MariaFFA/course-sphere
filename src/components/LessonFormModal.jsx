import { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert
} from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const STATUS_OPTIONS = ['draft', 'published', 'archived'];

const LessonFormModal = ({ open, onClose, lessonToEdit, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    status: 'draft',
    publish_date: '',
    video_url: '',
  });
  const [error, setError] = useState(null);

  const isEditMode = Boolean(lessonToEdit);

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        title: lessonToEdit.title,
        status: lessonToEdit.status,
        publish_date: lessonToEdit.publish_date,
        video_url: lessonToEdit.video_url,
      });
    } else {
      setFormData({
        title: '',
        status: 'draft',
        publish_date: '',
        video_url: '',
      });
    }
  }, [lessonToEdit, open]); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { title, status, publish_date, video_url } = formData;
    
    // Título: Mínimo 3 caracteres
    if (title.length < 3) {
      return 'O título deve ter pelo menos 3 caracteres.';
    }
    // Status: Obrigatório (já tem 'draft' como padrão)
    if (!status) {
      return 'O status é obrigatório.';
    }
    // Data de Publicação: Obrigatória
    if (!publish_date) {
      return 'A data de publicação é obrigatória.';
    }
    // URL do Vídeo: Obrigatória
    if (!video_url) { 
      return 'A URL do vídeo é obrigatória.';
    }

    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    onSave(formData, lessonToEdit?.id);
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style} component="form" onSubmit={handleSubmit}>
        <Typography variant="h6" component="h2" gutterBottom>
          {isEditMode ? 'Editar Aula' : 'Adicionar Nova Aula'}
        </Typography>

        <TextField
          margin="normal"
          required
          fullWidth
          label="Título da Aula"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            {STATUS_OPTIONS.map(opt => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          margin="normal"
          required
          fullWidth
          label="Data de Publicação"
          name="publish_date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formData.publish_date}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="URL do Vídeo (ex: YouTube)"
          name="video_url"
          value={formData.video_url}
          onChange={handleChange}
        />

        {error && (
          <Alert severity="warning" sx={{ mt: 2 }}>{error}</Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button onClick={handleClose} sx={{ mr: 2 }}>Cancelar</Button>
          <Button type="submit" variant="contained">
            {isEditMode ? 'Salvar' : 'Criar'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default LessonFormModal;