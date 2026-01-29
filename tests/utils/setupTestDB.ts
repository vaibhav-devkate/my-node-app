import mongoose from "mongoose";
import { User } from "../../src/modules/user";

const setupTestDB = () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });
};

export default setupTestDB;
