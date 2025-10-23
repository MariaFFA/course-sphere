import { useAuth } from '../context/AuthContext';
import { Button, Typography, Container, Box } from '@mui/material';

const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Bem-vindo ao Dashboard, {user?.name}!
        </Typography>
        <Typography variant="body1">
          Aqui você verá a lista de cursos[cite: 63]... (em breve)
        </Typography>
        
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={logout} 
          sx={{ mt: 2 }}
        >
          Sair (Logout)
        </Button>
      </Box>
    </Container>
  );
};

export default DashboardPage;