import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiGetCourses } from '../services/api';
import CourseCard from '../components/CourseCard';
import { 
  Button, 
  Typography, 
  Container, 
  Box, 
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const allCourses = await apiGetCourses();


        const myCourses = allCourses.filter(course => 
        course.creator_id === user.id || 
        course.instructors.includes(user.id)
        );
        
        setCourses(myCourses);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user.id]); 

  const handleCreateCourse = () => {
    navigate('/course/new');
  };
  

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">
          <strong>Erro ao carregar cursos:</strong> {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" component="h1">
              Olá, {user?.name}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Estes são os seus cursos.
            </Typography>
          </Box>
          <Box>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleCreateCourse}
              sx={{ mr: 2 }}
            >
              Criar Novo Curso
            </Button>
            <Button 
              variant="outlined" 
              color="secondary" 
              onClick={logout} 
            >
              Sair
            </Button>
          </Box>
        </Box>

        <Grid container spacing={4}>
          {courses.length > 0 ? (
            courses.map(course => (
              <Grid item key={course.id} xs={12} sm={6} md={4}>
                <CourseCard course={course} />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" align="center">
                Você ainda não está em nenhum curso. Que tal criar um?
              </Typography>
            </Grid>
          )}
        </Grid>

      </Box>
    </Container>
  );
};

export default DashboardPage;