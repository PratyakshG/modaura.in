import bcrypt from "bcryptjs";
import { model, models, Schema } from "mongoose";
import { UserTypes } from "../types/index";

// export const runtime = "nodejs";

const userSchema = new Schema<UserTypes>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    cartItems: {
      type: [Object],
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

//pre() is a hook to process the password just before saving the user in the database.
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

//models contains all the models that are available
//model creates the a new model
const User = models?.User || model<UserTypes>("User", userSchema);

export default User;
