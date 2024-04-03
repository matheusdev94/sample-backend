const jwt = require("jsonwebtoken");
const verifyJWT = require("../middleware/verifyToken");

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

describe("Verify JWT Middleware", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = { sendStatus: jest.fn() };
    next = jest.fn();
  });

  it("should return 401 if no authorization header is provided", () => {
    verifyJWT(req, res, next);

    expect(res.sendStatus).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if authorization header does not start with 'Bearer '", () => {
    req.headers.authorization = "InvalidToken";

    verifyJWT(req, res, next);

    expect(res.sendStatus).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("should call jwt.verify with the provided token and process.env.ACCESS_TOKEN_SECRET", () => {
    req.headers.authorization = "Bearer ValidToken";

    verifyJWT(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(
      "ValidToken",
      process.env.ACCESS_TOKEN_SECRET,
      expect.any(Function)
    );
  });

  it("should set req.user and req.roles with decoded UserInfo and call next", () => {
    req.headers.authorization = "Bearer ValidToken";
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, {
        UserInfo: { username: "user", roles: ["role1", "role2"] },
      });
    });

    verifyJWT(req, res, next);

    expect(req.user).toEqual("user");
    expect(req.roles).toEqual(["role1", "role2"]);
    expect(next).toHaveBeenCalled();
  });

  it("should return 401 if jwt.verify throws an error", () => {
    req.headers.authorization = "Bearer ValidToken";
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error("Invalid token"));
    });

    verifyJWT(req, res, next);

    expect(res.sendStatus).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});
