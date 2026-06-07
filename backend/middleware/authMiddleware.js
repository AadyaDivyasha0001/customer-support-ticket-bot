const jwt =
  require("jsonwebtoken");

const authMiddleware =
  (req, res, next) => {
    try {
      console.log(
        "AUTH HEADER:",
        req.headers.authorization
      );

      const authHeader =
        req.headers.authorization;

      if (!authHeader) {
        return res
          .status(401)
          .json({
            message:
              "Access denied",
          });
      }

      const token =
        authHeader.split(
          " "
        )[1];

      console.log(
        "TOKEN:",
        token
      );

      console.log(
        "JWT_SECRET:",
        process.env.JWT_SECRET
      );

      const verified =
        jwt.verify(
          token,
          process.env.JWT_SECRET
        );

      console.log(
        "VERIFIED:",
        verified
      );

      req.user =
        verified;

      next();
    } catch (error) {
      console.log(
        "JWT ERROR:",
        error.message
      );

      res.status(401).json({
        message:
          "Invalid token",
      });
    }
  };

module.exports =
  authMiddleware;