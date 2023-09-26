import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(200).json({tokenValid: false});
  }

  try {
    req.user = jwt.verify(token, process.env.TOKEN_KEY);
  } catch (err) {
    return res.status(200).json({tokenValid: false});
  }
  return next();
};

export default verifyToken;