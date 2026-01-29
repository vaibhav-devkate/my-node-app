import request from "supertest";
import httpStatus from "http-status";
import app from "../../src/app";
import setupTestDB from "../utils/setupTestDB";
import { User } from "../../src/modules/user";

setupTestDB();

describe("Auth Routes", () => {
  describe("POST /v1/auth/register", () => {
    test("should return 201 and successfully register user if request data is valid", async () => {
      const res = await request(app)
        .post("/v1/auth/register")
        .send({
          name: "Test User",
          email: "test@example.com",
          password: "password1",
        })
        .expect(httpStatus.CREATED);

      expect(res.body.user).toEqual({
        id: expect.anything(),
        name: "Test User",
        email: "test@example.com",
        role: "user",
        isEmailVerified: false,
      });
      expect(res.body.tokens).toEqual({
        access: {
          token: expect.anything(),
          expires: expect.anything(),
        },
        refresh: {
          token: expect.anything(),
          expires: expect.anything(),
        },
      });
      const dbUser = await User.findById(res.body.user.id);
      expect(dbUser).toBeDefined();
      expect(dbUser?.password).not.toBe("password1");
      expect(await dbUser?.isPasswordMatch("password1")).toBe(true);
    });
  });

  describe("POST /v1/auth/login", () => {
    test("should return 200 and login user if email and password match", async () => {
      await request(app).post("/v1/auth/register").send({
        name: "Test User",
        email: "test@example.com",
        password: "password1",
      });

      const res = await request(app)
        .post("/v1/auth/login")
        .send({
          email: "test@example.com",
          password: "password1",
        })
        .expect(httpStatus.OK);

      expect(res.body.user).toEqual({
        id: expect.anything(),
        name: "Test User",
        email: "test@example.com",
        role: "user",
        isEmailVerified: false,
      });
      expect(res.body.tokens).toBeDefined();
    });
  });
});
