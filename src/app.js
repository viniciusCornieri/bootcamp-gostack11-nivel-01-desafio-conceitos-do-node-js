const express = require("express");
const cors = require("cors");
const repositoryInputValidate = require("./app/middlewares/repositoryInputValidate");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", repositoryInputValidate, (request, response) => {
  const { title, url, techs } = request.body;

  const newRepository = {
    id: uuid(),
    likes: 0,
    title,
    url,
    techs,
  };

  repositories.push(newRepository);
  return response.json(newRepository);
});

app.put("/repositories/:id", repositoryInputValidate, (request, response) => {
  const { id } = request.params;
  const repository = repositories.find(repo => repo.id === id);

  if (!repository) {
    return response
      .status(400)
      .json({ error: `Could not found repository ${id}` });
  }

  const { title, url, techs } = request.body;

  repository.title = title || repository.title;
  repository.url = url || repository.url;
  repository.techs = techs || repository.techs;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if (repositoryIndex < 0) {
    return response
      .status(400)
      .json({ error: `Could not found repository ${id}` });
  }

  repositories.splice(repositoryIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repository = repositories.find(repo => repo.id === id);

  if (!repository) {
    return response
      .status(400)
      .json({ error: `Could not found repository ${id}` });
  }

  repository.likes += 1;
  response.json(repository);
});

module.exports = app;
