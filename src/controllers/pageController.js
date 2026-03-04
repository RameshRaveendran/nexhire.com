const { fetchJobs } = require("../services/jobService");

const homePage = (req, res) => {

    res.render("index");

};

const searchJobs = async (req, res) => {

    const filters = {
        keyword: req.query.keyword,
        location: req.query.location
    };

    const jobs = await fetchJobs(filters);

    res.render("results", { jobs });

};

const dashboardPage = (req, res) => {

    res.render("dashboard");

};

module.exports = {
    homePage,
    searchJobs,
    dashboardPage
};