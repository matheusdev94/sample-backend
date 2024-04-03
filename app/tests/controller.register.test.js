const bcrypt = require("bcrypt");
const User = require("../model/User");
const register = require("../controller/registerController");
const { default: mongoose } = require("mongoose");

// Mockando a função bcrypt.hash
jest.mock("bcrypt", () => ({
  hash: jest.fn(),
}));

// Mockando a função User.findOne
jest.mock("../model/User", () => ({
  constructor(username, password) {
    this.username = username;
    this.password = password;
  },
  findOne: jest.fn(),
  save: jest.fn().mockResolvedValue(true),
}));
jest.mock("../utils/response", () => jest.fn());

describe("handleUserRegistration", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        username: "test",
        password: "Test1234!",
      },
    };
    res = {
      status: jest.fn(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  // 🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧
  // test("should return 201 if registration is successful", async () => {
  //   User.findOne.mockResolvedValue(null);
  //   const hashedPassword = "validHash";
  //   bcrypt.hash.mockResolvedValue(hashedPassword);

  //   await register.handleUserRegistration(req, res);

  //   expect(res.status).toHaveBeenCalledWith(201);
  //   expect(res.json).toHaveBeenCalledWith({ message: "ok" });
  // });
  // 🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧

  test("should return 401 if username or password is invalid", async () => {
    req.body.username = ""; // Username inválido
    await register.handleUserRegistration(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid Credentials" });
  });

  test("should return 401 if username already exists", async () => {
    User.findOne.mockResolvedValueOnce({}); // Simula que o usuário já existe

    await register.handleUserRegistration(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid Credentials" });
  });

  test("should return 500 if an unexpected error occurs", async () => {
    User.findOne.mockRejectedValueOnce(new Error("Unexpected error")); // Simula que ocorreu um erro inesperado

    await register.handleUserRegistration(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Unexpected error occur." });
  });
});
