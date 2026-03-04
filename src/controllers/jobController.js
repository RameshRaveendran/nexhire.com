const { fetchJobs } = require("../services/jobService");
const SearchHistory = require("../models/searchHistoryModel");

const getJobs = async (req, res) => {
    try {

        /* =========================================
           READ QUERY PARAMETERS
        ========================================= */
        const filters = {
            keyword: req.query.keyword,
            location: req.query.location,
            company: req.query.company,
            minScore: req.query.minScore,
            sort: req.query.sort
        };

        if (!filters.keyword) {
            return res.status(400).json({ message: "Keyword is required" });
        }


        /* =========================================
           SAVE SEARCH HISTORY
        ========================================= */
        await SearchHistory.create({
            user: req.user._id,
            keyword: filters.keyword
        });


        /* =========================================
           CALL JOB AGGREGATION ENGINE
        ========================================= */
        const jobs = await fetchJobs(filters);


        /* =========================================
           RESPONSE
        ========================================= */
        res.json({
            success: true,
            count: jobs.length,
            jobs
        });

    } catch (error) {

        console.error("Job Controller Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch jobs"
        });
    }
};

module.exports = { getJobs };