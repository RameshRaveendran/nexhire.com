const axios = require("axios");

const fetchRemotiveJobs = async (keyword) => {
    const response = await axios.get(
        `https://remotive.com/api/remote-jobs?search=${keyword}`
    );

    return response.data.jobs.map(job => ({
        title: job.title,
        company: job.company_name,
        location: job.candidate_required_location,
        url: job.url,
        source: "Remotive"
    }));
};

// const fetchArbeitnowJobs = async (keyword) => {
//     const response = await axios.get(
//         `https://arbeitnow.com/api/job-board-api`
//     );

//     // Manual filtering
//     return response.data.data
//         .filter(job => 
//             job.title.toLowerCase().includes(keyword.toLowerCase())
//         )
//         .map(job => ({
//             title: job.title,
//             company: job.company_name,
//             location: job.location,
//             url: job.url,
//             source: "Arbeitnow"
//         }));
// };

const fetchArbeitnowJobs = async (keyword) => {
    const response = await axios.get(
        `https://arbeitnow.com/api/job-board-api`
    );

    return response.data.data
        .slice(0, 5)
        .map(job => ({
            title: job.title,
            company: job.company_name,
            location: job.location,
            url: job.url,
            source: "Arbeitnow"
        }));
};

const fetchJobs = async (keyword) => {
    try {
        const [remotiveJobs, arbeitnowJobs] = await Promise.all([
            fetchRemotiveJobs(keyword),
            fetchArbeitnowJobs(keyword)
        ]);

        return [...remotiveJobs, ...arbeitnowJobs];

    } catch (error) {
        console.error("Multi API Error:", error.message);
        throw new Error("Failed to fetch aggregated jobs");
    }
};

module.exports = { fetchJobs };