const express = require("express");
const { body, validationResult } = require("express-validator");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000

app.use(bodyParser.json())

// Single validation
app.post("/register/v1/user", [
  body("username").isEmail(),
  body("password").isLength({min: 5})
], (request, response) => {
  const errors = validationResult(request)

  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() });
  }

  response.status(200).json({ message: "Request success" });
});

// Validation with custom message (use .withMessage)
app.post("/register/v2/user", [
  body("username").isEmail().withMessage("O e-mail não é válido."),
  body("password").isLength({min: 5}).withMessage("A senha deve conter ao menos 5 caracteres.")
], (request, response) => {
  const errors = validationResult(request)

  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() });
  }

  response.status(200).json({ message: "Request success" });
});

// Custom and personalized validation
app.post("/register/v3/user", [
  body("username").custom(usernameValue => {
    // Aui deve ser realizada a requisição para o Banco de Dados para verificação de existencia ou não do e-mail.
    // Supondo que o e-mail já exista, segue um exemplo de comparação
    const returnOfDatabaseRequest = "teste@teste.com" 
    if (usernameValue === returnOfDatabaseRequest) {
      return Promise.reject("E-mail já cadastrado.");
    }

    return true;
  })
], (request, response) => {
  const errors = validationResult(request)

  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() });
  }

  response.status(200).json({ message: "Request success" });
});

//Register User API validation example
app.post("/register/v3/user", [
  body("email").isEmail().withMessage("O e-mail não é válido."),
  body("username").custom(usernameValue => {
    // Aui deve ser realizada a requisição para o Banco de Dados para verificação de existencia ou não do e-mail.
    // Supondo que o e-mail já exista, segue um exemplo de comparação
    const returnOfDatabaseRequest = "teste@teste.com" 
    if (usernameValue === returnOfDatabaseRequest) {
      return Promise.reject("E-mail já cadastrado.");
    }

    return true;
  }),
  body("password").isLength({min: 5}).withMessage("A senha deve conter ao menos 5 caracteres."),
  body("name").isLength({min: 2}).withMessage("O nome deve conter ao menos 2 caracteres."),
  body("surname").isLength({min: 2}).withMessage("O sobrenome deve conter ao menos 2 caracteres."),
  body("age").isNumeric().withMessage("A idade deve ser um número."),
], (request, response) => {
  const errors = validationResult(request)

  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() });
  }

  response.status(200).json({ message: "Request success" });
});


app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});
