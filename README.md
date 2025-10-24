# CourseSphere - Desafio Técnico V-Lab UFPE

## 🚀 Deploy

A aplicação está disponível para visualização e teste no seguinte link:

**[https://course-sphere-eight.vercel.app/](https://course-sphere-eight.vercel.app/)**

**Nota:** A API de produção (via `my-json-server`) é *somente-leitura*. Funcionalidades de Criar, Atualizar e Deletar (Cursos, Aulas, Instrutores) são desabilitadas no deploy, mas estão 100% funcionais no ambiente de desenvolvimento local.

---

**CourseSphere** é uma plataforma de gestão de cursos online colaborativa, desenvolvida como parte do desafio técnico para a vaga de Desenvolvedor(a) Front-End no V-Lab UFPE.

A aplicação foi construída em **React (com Hooks)** e **Material UI (MUI)**, consumindo uma API local simulada com `json-server`.

## Funcionalidades Implementadas

* **Autenticação:** Sistema completo de Login e Logout com persistência de sessão (localStorage) e rotas protegidas.
* **CRUD de Cursos:** Usuários podem criar, listar, atualizar e deletar cursos.
    * **Permissões:** Apenas o criador do curso pode editá-lo ou deletá-lo.
* **CRUD de Aulas:** Dentro de um curso, instrutores podem criar, editar e deletar aulas.
    * **Permissões Avançadas:** Qualquer instrutor do curso pode criar uma aula, mas apenas o criador da *aula* ou o criador do *curso* pode editar/deletar a aula.
* **Gerenciamento de Instrutores (API Externa):**
    * O criador do curso pode remover instrutores.
    * O criador do curso pode adicionar novos instrutores, com sugestões buscadas da API pública `https://randomuser.me`.
* **Busca e Filtros:** A lista de aulas possui busca dinâmica por título (case-insensitive) e filtro por status (draft, published, archived)[cite: 49, 50], com toda a lógica de filtro e paginação implementada no front-end.
* **Feedbacks Visuais (UX):** A aplicação utiliza Snackbars do MUI para dar feedback instantâneo de sucesso, aviso ou erro em todas as ações do usuário (criar, editar, deletar)

## Stack Utilizada

* **Front-End:** React (com Hooks), Vite, React Router, Material UI (MUI) [image_7f81ba.jpg]
* **Back-End (Simulado):** `json-server`
* **API Externa:** `https://randomuser.me`

---

## 🚀 Como Executar o Projeto

Siga os passos abaixo para rodar o projeto em seu ambiente local.

### Pré-requisitos

* [Node.js](https://nodejs.org/) (v18 ou superior)
* [Git](https://git-scm.com/)

### 1. Clone o Repositório

```bash
git clone [https://github.com/MariaFFA/course-sphere.git](https://github.com/MariaFFA/course-sphere.git)
cd course-sphere
```


### 2. Instale as Dependências

```bash
npm install
```

### 3. Execute a Aplicação

Este projeto foi configurado para iniciar o servidor do React (Vite) e o servidor da API (`json-server`) ao mesmo tempo com um único comando.

```bash
npm run dev
```

  * O Front-End estará disponível em: `http://localhost:5173`
  * A API (json-server) estará disponível em: `http://localhost:3001`

### Usuários de Teste

Você pode usar os seguintes usuários (definidos em `db.json`) para testar as permissões:

  * **Usuário 1 (Criadora / Admin):**

      * **Email:** `ana@test.com`
      * **Senha:** `123456`
      * (Pode editar o Curso de React e todas as suas aulas)

  * **Usuário 2 (Instrutor):**

      * **Email:** `beto@test.com`
      * **Senha:** `123456`
      * (Pode editar *apenas* as aulas que ele mesmo criou no Curso de React)
