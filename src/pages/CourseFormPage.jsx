import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { apiGetCourseById, apiCreateCourse, apiUpdateCourse } from '../services/api';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';

const CourseFormPage = () => {
  // Hooks de navegação e autenticação
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Estado do formulário
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
  });
  
  // Estados de controle
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);

  const isEditMode = Boolean(id);

  // Efeito para buscar os dados do curso se estivermos em "modo de edição"
  useEffect(() => {
    if (isEditMode) {
      const fetchCourse = async () => {
        setLoading(true);
        try {
          const course = await apiGetCourseById(id);
          
          // Regra de permissão
          if (course.creator_id !== user.id) {
            setError('Acesso negado: Você não é o criador deste curso.');
            return;
          }
          
          setFormData({
            name: course.name,
            description: course.description || '',
            start_date: course.start_date,
            end_date: course.end_date,
          });
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchCourse();
    }
  }, [id, isEditMode, user.id]);

  // Função para lidar com mudanças nos campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Função de validação [fonte: 38, 78]
  const validateForm = () => {
    const { name, start_date, end_date } = formData;
    
    // Regra: Nome Obrigatório; mínimo 3 caracteres [fonte: 38]
    if (name.length < 3) {
      return 'O nome do curso deve ter pelo menos 3 caracteres.';
    }
    
    // Regra: Datas obrigatórias
    if (!start_date || !end_date) {
      return 'As datas de início e término são obrigatórias.';
    }
    
    // Regra: end_date > start_date [fonte: 38, 78]
    const startDateObj = new Date(start_date);
    const endDateObj = new Date(end_date);
    if (endDateObj <= startDateObj) {
      return 'A data de término deve ser posterior à data de início.';
    }

    return null; 
  };

  // Função para enviar o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setLoading(true);

    try {
      if (isEditMode) {
        const courseData = await apiGetCourseById(id);
        const updatedData = { ...courseData, ...formData };
        await apiUpdateCourse(id, updatedData);
      } else {
        const newCourseData = {
        ...formData,
        creator_id: user.id,
        instructors: [user.id],
        };

        await apiCreateCourse(newCourseData);
}
      
      navigate('/dashboard');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Renderização Condicional ---

  if (loading && isEditMode) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={() => navigate('/dashboard')} sx={{ mt: 2 }}>
          Voltar ao Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} sx={{ my: 4, p: 4 }}>
        <Typography component="h1" variant="h4" gutterBottom>
          {isEditMode ? 'Editar Curso' : 'Criar Novo Curso'}
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Nome do Curso"
            name="name"
            value={formData.name}
            onChange={handleChange}
            helperText="Mínimo de 3 caracteres"
          />
          <TextField
            margin="normal"
            fullWidth
            id="description"
            label="Descrição"
            name="description"
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
            helperText="Opcional. Máximo de 500 caracteres (validação não implementada)"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="start_date"
            label="Data de Início"
            name="start_date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.start_date}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="end_date"
            label="Data de Término"
            name="end_date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.end_date}
            onChange={handleChange}
          />
          
          {formError && (
            <Alert severity="warning" sx={{ mt: 2 }}>{formError}</Alert>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button onClick={() => navigate('/dashboard')} sx={{ mr: 2 }}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : (isEditMode ? 'Salvar Alterações' : 'Criar Curso')}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CourseFormPage;