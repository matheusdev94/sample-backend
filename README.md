# Sample of a login page - FullStack project

Aplicação Node.JS para demonstração de um login simples.
Roda em mongoose para acesso ao MongoDb

## Instalando e rodando

Clone o repo:

```bash
  git clone https://github.com/matheusdev94/sample-backend.git
```

Instale projeto com npm:

```bash
  cd app
  npm install
```

Para rodar os testes:

```bash
  npm run tests
```

Para rodar em modo desenvolvedor:

```bash
  npm run dev
```

rode localmente com:

```bash
  npm start
```

ou rode com docker:

```bash
  docker-compose build
  docker-compose up
```

## Variáveis de ambiente

Variável para geração de JWT de acesso:

```bash
ACCESS_TOKEN_SECRET=token
```

Variável para geração de JWT de login:

```bash
REFRESH_TOKEN_SECRET=token
```

URI do cluster Mongo:

```bash
DATABASE_URI=mongodb_endereco_do_cluster
```

Para criação de Admin e Editor:

```bash
API_KEY=chave_da_api
```

## Autor

- [@matheusdev94](https://github.com/matheusdev94)
