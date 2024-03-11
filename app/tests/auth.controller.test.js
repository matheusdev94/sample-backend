require("dotenv").config({ path: ".env.test" });
const auth = require("../controller/authController");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Users = require("../model/User");

jest.mock("../model/User");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

const mockUser = {
  _id: {
    $oid: "someID",
  },
  username: "registerForTest",
  roles: {
    User: 2001,
  },
  password: "hashedPWD",
  __v: 0,
  refreshToken: "fakeToken",
};

describe("Authentication Controller", () => {
  let req, res;
  beforeEach(() => {
    req = {
      body: {
        username: "registerForTest",
        password: "registerForTest@2",
      },
    };
    res = {
      status: jest.fn(),
      cookie: jest.fn(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return 401 if USERNAME is invalid", async () => {
    const request = { body: { username: "", password: "registerForTest@2" } };
    const expectedResponse = { error: "Unauthorized" };
    res.json.mockReturnValue(res);
    const response = await auth.handleAuthentication(request, res);
    expect(response.response).toStrictEqual(expectedResponse);
    expect(res.cookie).not.toHaveBeenCalled();
  });

  test("should return 401 if PASSWORD is invalid", async () => {
    const request = { body: { username: "registerForTest", password: "" } };
    const expectedResponse = { error: "Unauthorized" };
    res.json.mockReturnValue(res);
    const response = await auth.handleAuthentication(request, res);
    expect(response.response).toStrictEqual(expectedResponse);
    expect(res.cookie).not.toHaveBeenCalled();
  });

  test("should return 200 for valid user", async () => {
    Users.findOne.mockResolvedValue(mockUser); //mock para resultado igual ao mockUser
    bcrypt.compare.mockResolvedValue(true); //mock para password = ✅
    Users.updateOne.mockResolvedValue({ acknowledged: true }); //mock para update ✅
    const signMock = jest.spyOn(jwt, "sign");
    signMock.mockReturnValue("fakeToken");

    await auth.handleAuthentication(req, res);

    expect(res.cookie).toHaveBeenCalledWith(
      "jwt",
      expect.any(String), // Certifique-se de que um token válido seja enviado para o cookie
      expect.objectContaining({
        httpOnly: true,
        secure: true,
        sameSite: "Lax",
        maxAge: 24 * 60 * 60 * 1000, // 1 dia
      })
    );
  });
  test("should return 401 if user not found", async () => {
    bcrypt.compare.mockResolvedValue(true); // Mock bcrypt to return true for comparison
    const User = require("../model/User");
    User.findOne.mockResolvedValue(null);

    await auth.handleAuthentication(req, res);

    expect(await res.json).toHaveBeenCalledWith({ error: "Unauthorized" });
    expect(res.cookie).not.toHaveBeenCalled();
  });

  test("should return roles and access token if authentication successful", async () => {
    bcrypt.compare.mockResolvedValue(true); // Mock bcrypt to return true for comparison

    Users.findOne.mockResolvedValue(mockUser);
    Users.updateOne.mockResolvedValue({ acknowledged: true });
    const signMock = jest.spyOn(jwt, "sign");
    signMock.mockReturnValue("fakeToken"); // Mock jwt sign to return a token

    await auth.handleAuthentication(req, res);

    expect(res.cookie).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      roles: [2001],
      accessToken: "fakeToken",
    });
  });

  // Add more test cases as needed
});
