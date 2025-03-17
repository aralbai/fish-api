import mongosee from "mongoose";

const userSchema = new mongosee.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "superadmin", "user"],
    },
  },
  { timestamps: true }
);

const User = new mongosee.model("User", userSchema);

export default User;
