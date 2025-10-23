import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LessonFormModal from '../components/LessonFormModal';
import InstructorManager from '../components/InstructorManager';
import { 
  apiGetCourseById, 
  apiGetLessonsByCourseId, 
  apiGetUsersByIds,
  apiCreateLesson,
  apiUpdateLesson,
  apiDeleteLesson
} from '../services/api';
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider,
  Chip,
  Pagination,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { School, Event, Edit, Delete } from '@mui/icons-material'; 

const formatDate = (dateString) => {
  if (!dateString) return 'Data não definida';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

const STATUS_OPTIONS = ['draft', 'published', 'archived'];

const CourseDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [instructors, setInstructors] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [lessonToEdit, setLessonToEdit] = useState(null);

  const [allLessons, setAllLessons] = useState([]);
  const [filters, setFilters] = useState({
    searchTerm: '',
    status: '',
    page: 1,
    limit: 5,
  });

  const fetchLessons = async () => {
    if (!course) return;
    try {
      const lessonData = await apiGetLessonsByCourseId(course.id);
      setAllLessons(lessonData);
    } catch (err) {
      setError(`Erro ao recarregar aulas: ${err.message}`);
    }
  };

  const isCreator = course?.creator_id === user.id;
  const isInstructor = course?.instructors.includes(user.id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const courseData = await apiGetCourseById(id);
        
        if (!courseData.instructors.includes(user.id)) {
           throw new Error('Acesso negado. Você não é instrutor deste curso.');
        }
        setCourse(courseData);

        if (courseData.instructors.length > 0) {
          const instructorData = await apiGetUsersByIds(courseData.instructors);
          setInstructors(instructorData);
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user.id]); 

  // Efeito para buscar aulas quando o curso é carregado
  useEffect(() => {
    if (course) { 
      fetchLessons();
    }
  }, [course]);
  
  const handleAddLesson = () => {
    setLessonToEdit(null); 
    setModalOpen(true);
  };

  const handleEditLesson = (lesson) => {
    setLessonToEdit(lesson);
    setModalOpen(true);
  };

  const handleDeleteLesson = async (lesson) => {
    if (window.confirm(`Tem certeza que deseja deletar a aula: "${lesson.title}"?`)) {
      try {
        await apiDeleteLesson(lesson.id);
        fetchLessons(); 
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleSaveLesson = async (formData, lessonId) => {
    try {
      if (lessonId) {
        const originalLesson = allLessons.find(l => l.id === lessonId);
        const lessonData = { ...originalLesson, ...formData };
        await apiUpdateLesson(lessonId, lessonData);
      } else {
        const newLessonData = {
          ...formData,
          course_id: course.id, 
          creator_id: user.id, 
        };
        await apiCreateLesson(newLessonData);
      }

      setModalOpen(false);
      fetchLessons();

    } catch (err) {
      setError(`Erro ao salvar aula: ${err.message}`);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1, 
    }));
  };

  const handlePageChange = (event, newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage,
    }));
  };

  const refreshInstructorData = async () => {
    try {
      const courseData = await apiGetCourseById(id);
      setCourse(courseData);

      if (courseData.instructors.length > 0) {
        const instructorData = await apiGetUsersByIds(courseData.instructors);
        setInstructors(instructorData);
      } else {
        setInstructors([]);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredLessons = useMemo(() => {
    return allLessons.filter(lesson => {
      const statusMatch = filters.status 
        ? lesson.status === filters.status 
        : true;
      
      const searchMatch = filters.searchTerm 
        ? lesson.title.toLowerCase().includes(filters.searchTerm.toLowerCase())
        : true;
        
      return statusMatch && searchMatch;
    });
  }, [allLessons, filters.status, filters.searchTerm]);

  const paginatedLessons = useMemo(() => {
    const { page, limit } = filters;
    const start = (page - 1) * limit;
    const end = page * limit;
    return filteredLessons.slice(start, end);
  }, [filteredLessons, filters.page, filters.limit]);


  if (loading) {
    return <Container sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Container>;
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
    <>
        <Container maxWidth="lg" sx={{ my: 4 }}>
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="h3" component="h1" gutterBottom>{course.name}</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>{course.description}</Typography>
                    <Chip icon={<Event />} label={`Início: ${formatDate(course.start_date)}`} sx={{ mr: 1 }} />
                    <Chip icon={<Event />} label={`Término: ${formatDate(course.end_date)}`} />
                </Box>
                <Box sx={{ flexShrink: 0 }}>
                    <Button variant="outlined" onClick={() => navigate('/dashboard')} sx={{ mb: 1, display: 'block' }}>
                    Voltar ao Dashboard
                    </Button>
                    {isCreator && (
                    <Button 
                        variant="contained" 
                        startIcon={<Edit />}
                        onClick={() => navigate(`/course/edit/${course.id}`)}
                        sx={{ display: 'block', width: '100%' }}
                    >
                        Editar Curso
                    </Button>
                    )}
                </Box>
                </Box>
            </Paper>

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h5" component="h2">Aulas do Curso</Typography>
                        {isInstructor && (
                            <Button variant="contained" onClick={handleAddLesson}>
                            Adicionar Nova Aula
                            </Button>
                        )}
                    </Box>
                    
                    <Paper elevation={1} sx={{ p: 2, mb: 2, display: 'flex', gap: 2 }}>
                    <TextField
                        label="Buscar por título"
                        name="searchTerm"
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={filters.searchTerm}
                        onChange={handleFilterChange}
                    />
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel id="status-filter-label">Status</InputLabel>
                        <Select
                        labelId="status-filter-label"
                        label="Status"
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        >
                        <MenuItem value=""><em>Todos</em></MenuItem>
                        {STATUS_OPTIONS.map(opt => (
                            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                    </Paper>
                    
                    <Paper elevation={2} sx={{ p: 2 }}>
                        <List>
                        {paginatedLessons.length > 0 ? paginatedLessons.map((lesson, index) => {
                            const canEditLesson = isCreator || lesson.creator_id === user.id;

                            return (
                            <Box key={lesson.id}>
                                <ListItem 
                                secondaryAction={
                                    canEditLesson && (
                                    <Box>
                                        <Button size="small" onClick={() => handleEditLesson(lesson)} sx={{ mr: 1 }}>
                                        <Edit fontSize="small" />
                                        </Button>
                                        <Button size="small" color="error" onClick={() => handleDeleteLesson(lesson)}>
                                        <Delete fontSize="small" />
                                        </Button>
                                    </Box>
                                    )
                                }
                                >
                                <ListItemText 
                                    primary={lesson.title}
                                    secondaryTypographyProps={{ component: 'div' }}
                                    secondary={
                                    <Box component="span" sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                        <Chip label={lesson.status} size="small" color={lesson.status === 'published' ? 'success' : 'warning'} />
                                        <Typography component="span" variant="caption">
                                        Publica em: {formatDate(lesson.publish_date)}
                                        </Typography>
                                    </Box>
                                    }
                                />
                                </ListItem>
                                {index < allLessons.length - 1 && <Divider />}
                            </Box>
                            );
                        }) : (
                            <Typography sx={{ p: 2 }}>Nenhuma aula encontrada com esses filtros.</Typography>
                        )}
                        </List>

                        {filteredLessons.length > filters.limit && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2, mt: 2, borderTop: 1, borderColor: 'divider' }}>
                            <Pagination 
                            count={Math.ceil(filteredLessons.length / filters.limit)} // <-- USA 'filteredLessons.length'
                            page={filters.page}
                            onChange={handlePageChange}
                            color="primary"
                            />
                        </Box>
                        )}
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Typography variant="h5" component="h2" sx={{ mb: 2 }}>Instrutores</Typography>
                    {isCreator ? (
                    <Paper elevation={2} sx={{ p: 2 }}>
                        <InstructorManager 
                        course={course}
                        instructors={instructors}
                        onInstructorsUpdate={refreshInstructorData}
                        />
                    </Paper>
                    ) : (
                    <Box>
                        <Typography variant="h5" component="h2" sx={{ mb: 2 }}>Instrutores</Typography>
                        <Paper elevation={2} sx={{ p: 2 }}>
                        <List>
                            {instructors.map((inst, index) => (
                            <Box key={inst.id}>
                                <ListItem>
                                <ListItemIcon>
                                    <Avatar>{inst.name[0]}</Avatar>
                                </ListItemIcon>
                                <ListItemText primary={inst.name} secondary={inst.email} />
                                </ListItem>
                                {index < instructors.length - 1 && <Divider />}
                            </Box>
                            ))}
                        </List>
                        </Paper>
                    </Box>
                    )}
                </Grid>
            </Grid>
        </Container>
        <LessonFormModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            lessonToEdit={lessonToEdit}
            onSave={handleSaveLesson}
        />
    </>
  );
};

export default CourseDetailPage;