const jwt = require("jsonwebtoken");
const { handleRefreshToken } = require("../controller/refreshTokenController");
const Users = require("../model/User");

// Mockando o modelo Users
jest.mock("../model/User", () => ({
  findOne: jest.fn(),
}));

// Mockando a função jwt.verify
jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
  sign: jest.fn(),
}));

describe("handleRefreshToken", () => {
  let req, res;

  beforeEach(() => {
    req = {
      cookies: {
        jwt: "mockedRefreshToken",
      },
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

  test("should return 401 if refreshToken verification fails", async () => {
    // Simulando que Users.findOne não encontra nenhum usuário
    Users.findOne.mockResolvedValue(null);

    await handleRefreshToken(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalled();
    expect(res.sendStatus).not.toHaveBeenCalled();
  });

  test("should return 401 if refreshToken is invalid", async () => {
    Users.findOne.mockResolvedValue({ refreshToken: "invalidToken" });

    jwt.verify.mockImplementation((token, secret, callback) => {
      callback((err = true));
    });
    await handleRefreshToken(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalled();
  });

  test("should return new accessToken if refreshToken is valid", async () => {
    // Simulando que Users.findOne encontra um usuário e refreshToken é válido
    const decodedToken = { username: "testUser", roles: [2001] };
    const mockUser = {
      refreshToken: "validToken",
      username: "testUser",
      roles: [2001],
    };
    Users.findOne.mockResolvedValue(mockUser);

    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, decodedToken);
    });

    jwt.sign.mockReturnValue("newAccessToken");

    await handleRefreshToken(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      roles: [2001],
      accessToken: "newAccessToken",
      username: "testUser",
    });
    expect(res.sendStatus).not.toHaveBeenCalled();
  });
});
