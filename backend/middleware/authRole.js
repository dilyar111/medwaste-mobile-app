const { authenticate } = require('./auth');

/**
 * @param {string[]} allowedRoles - roles permitted for the route
 * @returns {import('express').RequestHandler}
 */
function authRole(allowedRoles) {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req, res, next) => {
    authenticate(req, res, () => {
      const userRole = req.user?.role;
      if (!userRole || !roles.includes(userRole)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      next();
    });
  };
}

module.exports = { authRole };
