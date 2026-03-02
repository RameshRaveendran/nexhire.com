const axios = require("axios");

const fetchJobs = async (keyword) => {
    try {
        const response = await axios.get(
            `https://remotive.com/api/remote-jobs?search=${keyword}`
        );

        return response.data.jobs;

    } catch (error) {
        console.error("External API Error", error.message);
        throw new error("Failed to fetch jobs");
    }
};

module.exports = {fetchJobs};