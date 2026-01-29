import request from "supertest";
import httpStatus from "http-status";
import app from "../../src/app";
import setupTestDB from "../utils/setupTestDB";
import { User } from "../../src/modules/user";
import { tokenService } from "../../src/modules/token";
import { tokenTypes } from "../../src/config/tokens";
import moment from "moment";
import config from "../../src/config/config";

setupTestDB();

const userOne = {
  name: "User One",
  email: "userone@example.com",
  password: "password1",
  role: "user",
  isEmailVerified: false,
};

const admin = {
  name: "Admin",
  email: "admin@example.com",
  password: "password1",
  role: "admin",
  isEmailVerified: false,
};

const insertUsers = async (users: any[]) => {
  await User.insertMany(users.map((user) => ({ ...user, password: "hashedPassword" })));
};

describe("User Routes", () => {
  describe("POST /v1/users", () => {
    test("should return 201 and successfully create new user if data is valid and logged in as admin", async () => {
      await insertUsers([admin]);
      const adminUser = await User.findOne({ email: admin.email });
      const accessToken = tokenService.generateToken(
        (adminUser as any).id,
        moment().add(config.jwt.accessExpirationMinutes, "minutes"),
        tokenTypes.ACCESS
      );

      const res = await request(app)
        .post("/v1/users")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          name: userOne.name,
          email: userOne.email,
          password: userOne.password,
          role: userOne.role,
        })
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual({
        id: expect.anything(),
        name: userOne.name,
        email: userOne.email,
        role: userOne.role,
        isEmailVerified: userOne.isEmailVerified,
      });

      const dbUser = await User.findById(res.body.id);
      expect(dbUser).toBeDefined();
    });

    test("should return 403 if logged in as user", async () => {
      await insertUsers([userOne]);
      const user = await User.findOne({ email: userOne.email });
      const accessToken = tokenService.generateToken(
        (user as any).id,
        moment().add(config.jwt.accessExpirationMinutes, "minutes"),
        tokenTypes.ACCESS
      );

      await request(app)
        .post("/v1/users")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(admin)
        .expect(httpStatus.FORBIDDEN);
    });

    test("should return 401 if not logged in", async () => {
      await request(app).post("/v1/users").send(userOne).expect(httpStatus.UNAUTHORIZED);
    });
  });
});
