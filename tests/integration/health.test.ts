import request from "supertest";
import httpStatus from "http-status";
import app from "../../src/app";

describe("Health Routes", () => {
  describe("GET /health", () => {
    test("should return 200 and health status", async () => {
      const res = await request(app).get("/health").expect(httpStatus.OK);
      expect(res.body).toEqual({ status: "UP" });
    });
  });
});
