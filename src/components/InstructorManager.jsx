import { useState } from 'react';
import { useFeedback } from '../hooks/useFeedback';
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  Button,
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import { Delete, PersonAdd } from '@mui/icons-material';
import { apiSuggestInstructor, apiCreateUser, apiUpdateCourse } from '../services/api';

const InstructorManager = ({ course, instructors, onInstructorsUpdate }) => {
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const { showFeedback } = useFeedback();
  
  // Função para buscar uma sugestão de instrutor
  const handleSuggest = async () => {
    setLoading(true);
    setSuggestion(null);
    try {
      const suggestedUser = await apiSuggestInstructor();
      setSuggestion(suggestedUser);
    } catch (err) {
      showFeedback(err.message, 'error')
    } finally {
      setLoading(false);
    }
  };

  // Função para adicionar o instrutor sugerido ao curso
  const handleAddInstructor = async () => {
    if (!suggestion) return;
    
    setLoading(true);
    try {
        const newUserData = await apiCreateUser(suggestion);

        const updatedInstructorsIDs = [...course.instructors, newUserData.id];

        const updatedCourseData = { ...course, instructors: updatedInstructorsIDs };

        const updatedInstructorObjects = [...instructors, newUserData];

        await apiUpdateCourse(course.id, updatedCourseData);

        setSuggestion(null);

        onInstructorsUpdate(updatedCourseData, updatedInstructorObjects);

        showFeedback('Instrutor adicionado com sucesso!', 'success'); 

    } catch (err) {
        showFeedback(err.message, 'error');
    } finally {
        setLoading(false);
    }
  };
  
  const handleRemoveInstructor = async (instructorId) => {
    if (String(instructorId) === String(course.creator_id)) {
      showFeedback("Você não pode remover a si mesmo (o criador) do curso.", 'warning');
      return;
    }
    
    setLoading(true);
    try {
        const updatedInstructorIDs = course.instructors.filter(id => String(id) !== String(instructorId));

        const updatedCourseData = { ...course, instructors: updatedInstructorIDs };

        const updatedInstructorObjects = instructors.filter(inst => String(inst.id) !== String(instructorId));

        await apiUpdateCourse(course.id, updatedCourseData);

        onInstructorsUpdate(updatedCourseData, updatedInstructorObjects);

        showFeedback('Instrutor removido com sucesso!', 'success');

    } catch (err) {
        showFeedback(err.message, 'error');
    } finally {
        setLoading(false);
    }
  };

  return (
    <Box>      
      <List>
        {instructors.map(inst => (
            <ListItem
            key={inst.id}
            secondaryAction={
                <IconButton 
                edge="end" 
                aria-label="delete"
                onClick={() => handleRemoveInstructor(inst.id)}
                disabled={loading || String(inst.id) === String(course.creator_id)}
                >
                <Delete />
                </IconButton>
            }
            >
            <ListItemAvatar>
                <Avatar>{inst.name[0]}</Avatar>
            </ListItemAvatar>
            <ListItemText 
                primary={inst.name} 
                secondary={String(inst.id) === String(course.creator_id) ? 'Criador' : inst.email}
            />
            </ListItem>
        ))}
      </List>
      
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" component="h3" sx={{ mb: 1 }}>Adicionar Instrutor</Typography>
        
        {suggestion && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <Avatar src={suggestion.picture} sx={{ mr: 2 }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body1">{suggestion.name}</Typography>
              <Typography variant="body2" color="text.secondary">{suggestion.email}</Typography>
            </Box>
            <Button 
              variant="contained" 
              size="small" 
              onClick={handleAddInstructor}
              disabled={loading}
            >
              Adicionar
            </Button>
          </Box>
        )}
        
        <Button 
          variant="outlined" 
          startIcon={<PersonAdd />}
          onClick={handleSuggest}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Buscar Sugestão'}
        </Button>

      </Box>
    </Box>
  );
};

export default InstructorManager;