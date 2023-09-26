import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];
  const userid = req.params.userid;

  // Check if there is a token
  if (!token) {
    return res.status(200).json({invalidToken: true, msg: 'A token is needed'});
  }
  
  // If a user specific resource is accessed, check if the userid is the same as in the token
  if (userid && userid !== jwt.decode(token)?.user_id) {
    return res.status(200).json({invalidToken: true, msg: 'Not authorized to access this resource'});
  }

  // Check if the token is valid and not expired
  try {
    jwt.verify(token, process.env.TOKEN_KEY);
  } catch (err) {
    return res.status(200).json({invalidToken: true, msg: 'Token not valid or expired'});
  }
  return next();
};

export default verifyToken;