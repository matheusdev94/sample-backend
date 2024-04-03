const { usersRequest } = require("../controller/usersController");
const User = require("../model/User");

// Mockando o modelo User
jest.mock("../model/User", () => ({
  find: jest.fn(),
}));

describe("usersRequest", () => {
  let req, res;

  beforeEach(() => {
    req = {
      roles: [5150], // Simulando que o usuário tem permissões de admin
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      sendStatus: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return status 200 with users data if user has admin role", async () => {
    // Simulando que User.find retorna usuários
    const mockUsers = [{ username: "user1" }, { username: "user2" }];
    User.find.mockResolvedValue(mockUsers);

    await usersRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUsers);
    expect(res.sendStatus).not.toHaveBeenCalled();
  });

  test("should return status 500 if an error occurs while fetching users", async () => {
    // Simulando que User.find lança um erro
    User.find.mockRejectedValue(new Error("Database error"));

    await usersRequest(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(500);
    expect(res.json).not.toHaveBeenCalledWith();
  });

  test("should return status 403 if user does not have admin role", async () => {
    // Simulando que o usuário não tem permissões de admin
    req.roles = [1234];

    await usersRequest(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(403);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
