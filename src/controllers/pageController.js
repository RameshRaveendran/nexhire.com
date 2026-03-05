const { fetchJobs } = require("../services/jobService");
const User = require("../models/User");
const SearchHistory = require("../models/searchHistoryModel");

const landingPage = (req, res) => {
    res.render("landing");
};

const homePage = (req, res) => {
    res.render("index");
};

const searchJobs = async (req, res) => {
    try {
        const filters = {
            keyword: req.query.keyword,
            location: req.query.location
        };

        // Save search history if user is logged in
        if (req.user) {
            await SearchHistory.create({
                user: req.user.id,
                keyword: filters.keyword
            });
        }

        const jobs = await fetchJobs(filters);
        
        // Fetch user data if logged in
        let user = null;
        if (req.user) {
            user = await User.findById(req.user.id);
        }
        
        res.render("results", { jobs, user, filters });
    } catch (error) {
        console.error(error);
        res.render("results", { jobs: [], user: null, filters: {} });
    }
};

const dashboardPage = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.redirect("/login");
        }

        // Fetch search history - get last 10 searches
        const searchHistory = await SearchHistory.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .limit(10);

        res.render("dashboard", { user, searchHistory });
    } catch (error) {
        console.error(error);
        res.redirect("/login");
    }
};

module.exports = {
    landingPage,
    homePage,
    searchJobs,
    dashboardPage
};