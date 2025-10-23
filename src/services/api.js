const BASE_URL = 'http://localhost:3001';


export const apiLogin = async (email, password) => {
  const response = await fetch(`${BASE_URL}/users?email=${email}`);
  
  if (!response.ok) {
    throw new Error('Não foi possível conectar ao servidor.');
  }

  const users = await response.json();

  if (users.length === 0) {
    throw new Error('Usuário não encontrado.');
  }

  const user = users[0];

  if (user.password !== password) {
    throw new Error('Email ou senha incorretos.');
  }

  const { password: _, ...userWithoutPassword } = user;
  
  return userWithoutPassword;
}; 