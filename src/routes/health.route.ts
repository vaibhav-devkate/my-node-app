import express, { type Router } from "express";

const router: Router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send({ status: "UP" });
});

export default router;
