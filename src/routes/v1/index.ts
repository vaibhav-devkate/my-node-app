import express from "express";
import config from "../../config/config";

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: require("./auth.route").default || require("./auth.route"),
  },
  {
    path: "/users",
    route: require("./user.route").default || require("./user.route"),
  },
];

const devRoutes: { path: string; route: any }[] = [
  {
    path: '/docs',
    route: require('./docs.route').default || require('./docs.route'),
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

if (config.env === "development") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

export default router;
