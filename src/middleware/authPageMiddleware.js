const jwt = require("jsonwebtoken");

const protectPage = (req, res, next) => {

    const token = req.cookies.token;

    if (!token) {

        return res.redirect("/login");

    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        // Set cache-prevention headers to prevent back-button access after logout
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');

        next();

    } catch {

        res.redirect("/login");

    }

};

module.exports = protectPage;