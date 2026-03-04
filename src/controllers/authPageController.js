const axios = require("axios");

const loginPage = (req, res) => {

    res.render("login");

};

const registerPage = (req, res) => {

    res.render("register");

};

const loginUser = async (req, res) => {

    const { email, password } = req.body;

    try {

        const response = await axios.post(
            "http://localhost:5000/api/auth/login",
            { email, password }
        );

        const token = response.data.token;

        res.cookie("token", token, { httpOnly: true });

        res.redirect("/");

    } catch (error) {

        res.send("Login failed");

    }

};

const registerUser = async (req, res) => {

    const { name, email, password } = req.body;

    try {

        await axios.post(
            "http://localhost:5000/api/auth/register",
            { name, email, password }
        );

        res.redirect("/login");

    } catch (error) {

        res.send("Registration failed");

    }

};

module.exports = {
    loginPage,
    registerPage,
    loginUser,
    registerUser
};