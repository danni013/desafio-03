const express = require("express");

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body;

  const repository = {
    id: uuid(),
    url,
    title,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const updatedRepository = request.body;

  const repository = repositories.find(
    (repo) => repo.id === id);

  if (!repository) {
    return response.status(404).json({ error: "Repository not found" });
  }

  if (updatedRepository.likes != repository.likes) {
     updatedRepository.likes = repository.likes;
  }

  const repo = { ...repositories[repositories.indexOf(repository)], ...updatedRepository };

  return response.json(repo);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find(repo => repo.id === id);

  if (repository) {
    repositories.splice(repositories.indexOf(repository), 1);
    return response.status(204).send();
  }

  return response.status(404).json({ error: "Repository not found" });
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find(repo => repo.id === id);

  if (repository) {
    const likes = ++repository.likes;
    return response.json({likes: likes});
  }

  return response.status(404).json({ error: "Repository not found" });
});

module.exports = app;
