const credentials = require("../middleware/credentials");

describe("Credentials Middleware", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      headers: {
        origin: "http://localhost:3000",
      },
    };
    res = { setHeader: jest.fn(), sendStatus: jest.fn() };
    next = jest.fn();
  });

  it("should set headers if origin is allowed", () => {
    credentials(req, res, next);

    expect(res.setHeader).toHaveBeenCalledWith(
      "Access-Control-Allow-Origin",
      "http://localhost:3000"
    );
    expect(res.setHeader).toHaveBeenCalledWith(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    expect(res.setHeader).toHaveBeenCalledWith(
      "Access-Control-Allow-Headers",
      "Content-Type,Authorization"
    );
    expect(res.setHeader).toHaveBeenCalledWith(
      "Access-Control-Allow-Credentials",
      "true"
    );
    expect(next).toHaveBeenCalled();
  });

  it("should return 403 if origin is not allowed", () => {
    req.headers.origin = "http://unallowed-origin.com";
    jest.mock("../config/allowedList", () => ({
      includes: jest.fn().mockReturnValue(false),
    }));

    credentials(req, res, next);

    expect(res.sendStatus).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});
