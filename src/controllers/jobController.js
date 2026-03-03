const fetchJobs = require("../services/jobService").fetchJobs;
const SearchHistory = require("../models/searchHistoryModel");

const getJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword;

        if (!keyword) {
            return res.status(400).json({ message: "Keyword is required" });
        }

        // Save search history
        await SearchHistory.create({
            user: req.user._id,
            keyword
        });

        const jobs = await fetchJobs(keyword);

        res.json({
            count: jobs.length,
            jobs
        });

    } catch (error) {
        res.status(500).json({ message: "Failed to fetch jobs" });
    }
};

module.exports = { getJobs };