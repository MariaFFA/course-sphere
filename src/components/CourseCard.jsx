import { Card, CardContent, Typography, CardActions, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Formata a data
const formatDate = (dateString) => {
  if (!dateString) return 'Data não definida';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

const CourseCard = ({ course }) => {
  const { name, description, start_date, end_date } = course;

  const { user } = useAuth();
  const navigate = useNavigate();

  const isCreator = course.creator_id === user.id;

  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'space-between' 
    }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description || "Este curso não possui descrição."}
        </Typography>
        
        <Box>
          <Typography variant="caption" display="block" color="text.secondary">
            Início: {formatDate(start_date)}
          </Typography>
          <Typography variant="caption" display="block" color="text.secondary">
            Término: {formatDate(end_date)}
          </Typography>
        </Box>
      </CardContent>
      
      <CardActions>
        <Button 
          size="small" 
          variant="contained"
          onClick={() => navigate(`/course/${course.id}`)}
        >
          Ver Detalhes
        </Button>
        
        {isCreator && (
          <Button 
            size="small" 
            variant="outlined"
            onClick={() => navigate(`/course/edit/${course.id}`)}
          >
            Editar
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default CourseCard;