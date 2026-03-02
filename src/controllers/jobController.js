const { fetchJobs } = require("../services/jobService");

const getJobs = async (req, res) => {
    try {
        const { keyword } = req.query;

        if (!keyword) {
            return res.status(400).json({
                message: "Keyword query parameter is required"
            });
        }

        const jobs = await fetchJobs(keyword);

        res.json({
            count: jobs.length,
            jobs
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = { getJobs };