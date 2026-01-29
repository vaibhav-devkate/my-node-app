import express from "express";
import type { Router } from "express";
import healthRoute from "./health.route";
// import authRoute from "./auth.route";
// import docsRoute from "./swagger.route";
// import userRoute from "./user.route";
// import config from "../../config/config";

const router = express.Router();

interface IRoute {
  path: string;
  route: Router;
}



  

const defaultIRoute: IRoute[] = [
  {
    path: "/health",
    route: healthRoute,
  }
  //   {
  //     path: "/auth",
  //     route: authRoute,
  //   },
  //   {
  //     path: "/users",
  //     route: userRoute,
  //   },
];

const devIRoute: IRoute[] = [
  // IRoute available only in development mode
//   {
//     path: "/docs",
//     route: docsRoute,
//   },
];

defaultIRoute.forEach((route) => {
  router.use(route.path, route.route);
});




/* istanbul ignore next */
// if (config.env === "development") {
//   devIRoute.forEach((route) => {
//     router.use(route.path, route.route);
//   });
// }

router.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default router;


// import { Router } from 'express';
// import v1Routes from './v1';

// const router = Router();

// router.use('/v1', v1Routes);

// export default router;
