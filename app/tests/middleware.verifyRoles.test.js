const verifyRoles = require("../middleware/verifyRoles");

describe("Verify Roles Middleware", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      roles: [],
    };
    res = { sendStatus: jest.fn() };
    next = jest.fn();
  });

  it("should call next if ADMIN  (5051) role", () => {
    req.roles = [5150];
    verifyRoles(req, res, next);

    expect(res.sendStatus).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
  it("should call next if USER  (2001) role", () => {
    req.roles = [2001];
    verifyRoles(req, res, next);
    expect(res.sendStatus).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
  it("should call next if EDITOR  (1984) role", () => {
    req.roles = [1984];
    verifyRoles(req, res, next);
    expect(res.sendStatus).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it("should return 401 if user has no verified roles", () => {
    req.roles = ["role3", "role4"];
    verifyRoles(req, res, next);
    expect(res.sendStatus).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});
