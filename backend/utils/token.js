import jwt from "jsonwebtoken";
export const signToken = (user) => jwt.sign(
  { id: user._id, username: user.username },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);
