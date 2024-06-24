module.exports = (req, res, next) => {
    const password = req.body.password;

    if (!password) {
        return res.status(400).send({ message: "Password is required." });
    }

    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
        return res.status(400).send({ message: `Password must be at least ${minLength} characters long.` });
    }
    if (!hasUpperCase) {
        return res.status(400).send({ message: 'Password must contain at least one uppercase letter.' });
    }
    if (!hasLowerCase) {
        return res.status(400).send({ message: 'Password must contain at least one lowercase letter.' });
    }
    if (!hasNumbers) {
        return res.status(400).send({ message: 'Password must contain at least one number.' });
    }
    if (!hasSpecialChar) {
        return res.status(400).send({ message: 'Password must contain at least one special character.' });
    }

    next();
};
