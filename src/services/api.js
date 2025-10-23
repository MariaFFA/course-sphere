const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

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

// Função para atualizar um curso
export const apiUpdateCourse = async (id, courseData) => {
  const response = await fetch(`${BASE_URL}/courses/${id}`, {
    method: 'PUT', 
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

// Função para obter aulas por ID do curso
export const apiGetLessonsByCourseId = async (courseId) => {
  const response = await fetch(`${BASE_URL}/lessons?course_id=${courseId}`);
  
  if (!response.ok) {
    throw new Error('Não foi possível carregar as aulas.');
  }
  
  return await response.json(); 
};

// Função para criar uma nova aula
export const apiCreateLesson = async (lessonData) => {
  const response = await fetch(`${BASE_URL}/lessons`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lessonData),
  });
  if (!response.ok) {
    throw new Error('Não foi possível criar a aula.');
  }
  return await response.json();
};

// Função para atualizar uma aula
export const apiUpdateLesson = async (lessonId, lessonData) => {
  const response = await fetch(`${BASE_URL}/lessons/${lessonId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lessonData),
  });
  if (!response.ok) {
    throw new Error('Não foi possível atualizar a aula.');
  }
  return await response.json();
};

// Função para deletar uma aula
export const apiDeleteLesson = async (lessonId) => {
  const response = await fetch(`${BASE_URL}/lessons/${lessonId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Não foi possível deletar a aula.');
  }
  return await response.json();
};


// Função para obter usuários por um array de IDs
export const apiGetUsersByIds = async (idArray) => {
  const query = idArray.map(id => `id=${id}`).join('&');
  
  const response = await fetch(`${BASE_URL}/users?${query}`);
  if (!response.ok) {
    throw new Error('Não foi possível carregar os instrutores.');
  }
  return await response.json();
};

// Função para sugerir um instrutor aleatório
export const apiSuggestInstructor = async () => {
  const response = await fetch('https://randomuser.me/api/?nat=br');
  if (!response.ok) {
    throw new Error('Não foi possível buscar sugestão.');
  }
  const data = await response.json();
  const user = data.results[0];
  
  return {
    name: `${user.name.first} ${user.name.last}`,
    email: user.email,
    picture: user.picture.thumbnail,
  };
};

// Função para criar um novo usuário
export const apiCreateUser = async (userData) => {
  const userWithPassword = {
    ...userData,
    password: '123456' 
  };

  const response = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userWithPassword),
  });
  
  if (!response.ok) {
    throw new Error('Não foi possível criar o novo usuário em nosso banco.');
  }
  return await response.json();
};