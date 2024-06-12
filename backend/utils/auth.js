const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
    const token = req.cookies.auth_token;
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }
        req.user = decoded;
        next();
    });
};

module.exports = isAuthenticated;
