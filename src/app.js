const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function middlewareCheckRepoExists(request, response, next) {
  const { id } = request.params;

  const repositore = repositories.find(repo => repo.id === id);

  if (!repositore) {
    return response.status(400).json({ error: 'Repositório não encontrado' });
  }

  request.repo = repositore;

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repositore = repositories.find(repo => repo.url === url);

  if (repositore) {
    return response.json(repositore);
  }

  const newRepositore = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  repositories.push(newRepositore);

  return response.json(newRepositore);
});

app.put("/repositories/:id", middlewareCheckRepoExists, (request, response) => {
  const { repositore } = request;
  const { title, url, techs, likes } = request.body;

  repositore.title = title;
  repositore.url = url;
  repositore.techs = techs;
  repositore.likes = likes;

  return response.json(repositore);
});

app.delete("/repositories/:id", middlewareCheckRepoExists, (request, response) => {
  const { id } = request.params;

  const repositoreIndex = repositories.findIndex(repo => repo.id === id);

  repositories.splice(repositoreIndex, 1);

  return response.status(204).json({});
});

app.post("/repositories/:id/like", middlewareCheckRepoExists, (request, response) => {
  const { repositoreIndex } = request;

  repositoreIndex.likes = repositoreIndex.likes + 1;

  return response.json({
    likes: repositoreIndex.likes,
  });
});

module.exports = app;