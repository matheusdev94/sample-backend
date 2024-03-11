const { handleLogout } = require("../controller/logoutController");
const User = require("../model/User");

// Mockando o modelo User
jest.mock("../model/User", () => ({
  findOne: jest.fn(),
}));

describe("handleLogout", () => {
  let req, res;

  beforeEach(() => {
    req = {
      cookies: {
        jwt: "fakeRefreshToken",
      },
    };
    res = {
      sendStatus: jest.fn(),
      clearCookie: jest.fn(),
      cookie: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should send status 204 if no refreshToken found in cookies", async () => {
    req.cookies.jwt = undefined;

    await handleLogout(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(204);
    expect(res.clearCookie).not.toHaveBeenCalled();
    expect(User.findOne).not.toHaveBeenCalled();
  });

  test("should clear refreshToken from user and cookies and send status 204", async () => {
    // Simulando que User.findOne retorna um usuário
    const mockUser = {
      refreshToken: "fakeRefreshToken",
      save: jest.fn(),
    };
    User.findOne.mockResolvedValue(mockUser);

    await handleLogout(req, res);

    expect(User.findOne).toHaveBeenCalledWith({
      refreshToken: "fakeRefreshToken",
    });
    expect(mockUser.refreshToken).toBe("");
    expect(mockUser.save).toHaveBeenCalled();
    expect(res.cookie).toHaveBeenCalledWith("jwt", "", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 0,
    });
    expect(res.sendStatus).toHaveBeenCalledWith(204);
  });

  test("should send status 500 if an error occurs: THIS CASE => findOne error", async () => {
    // Simulando que User.findOne lança um erro
    User.findOne.mockRejectedValue(new Error("Database error"));

    await handleLogout(req, res);

    expect(User.findOne).toHaveBeenCalledWith({
      refreshToken: "fakeRefreshToken",
    });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    expect(res.clearCookie).not.toHaveBeenCalled();
    expect(res.sendStatus).not.toHaveBeenCalled();
  });

  test("should send status 204 if user not found by refreshToken", async () => {
    // Simulando que User.findOne retorna null
    User.findOne.mockResolvedValue(null);

    await handleLogout(req, res);

    expect(User.findOne).toHaveBeenCalledWith({
      refreshToken: "fakeRefreshToken",
    });
    expect(res.clearCookie).toHaveBeenCalledWith("jwt", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    expect(res.sendStatus).toHaveBeenCalledWith(204);
  });
});
