const express = require("express");
const app = express();
const port = 1000;

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/palindrome", (req, res) => {
  res.send("palindrome");
});

app.get("/cep", (req, res) => {
  res.send("cep");
});

app.get("/cadastro", (req, res) => {
  res.send("cadastro!");
});

app.listen(port, () => {
  console.log(`Servidor está rodando em http://localhost:${port}`);
});
