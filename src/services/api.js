const BASE_URL = 'http://localhost:3001';

// Função para autenticar o usuário
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
  
  userWithoutPassword.id = Number(userWithoutPassword.id);

  return userWithoutPassword;
}; 

// Função para obter a lista de cursos
export const apiGetCourses = async () => {
  const response = await fetch(`${BASE_URL}/courses`);
  
  if (!response.ok) {
    throw new Error('Não foi possível carregar os cursos.');
  }

  return await response.json();
};

// Função para obter detalhes de um curso por ID
export const apiGetCourseById = async (id) => {
  const response = await fetch(`${BASE_URL}/courses/${id}`);
  if (!response.ok) {
    throw new Error('Não foi possível encontrar o curso.');
  }
  return await response.json();
};

// Função para criar um novo curso
export const apiCreateCourse = async (courseData) => {
  const response = await fetch(`${BASE_URL}/courses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(courseData),
  });
  if (!response.ok) {
    throw new Error('Não foi possível criar o curso.');
  }
  return await response.json();
};

// Função para atualizar um curso existente
export const apiUpdateCourse = async (id, courseData) => {
  const response = await fetch(`${BASE_URL}/courses/${id}`, {
    method: 'PUT', // PUT substitui o objeto inteiro
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(courseData),
  });
  if (!response.ok) {
    throw new Error('Não foi possível atualizar o curso.');
  }
  return await response.json();
};
