const axios = require("axios");

// remotive api integration
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

// arbeitnow api integration
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

const calculateScore = (job, keyword) => {
    let score = 0;

    const lowerKeyword = keyword.toLowerCase();
    const title = job.title.toLowerCase();
    const company = job.company.toLowerCase();
    const location = job.location.toLowerCase();

    if (title.includes(lowerKeyword)) score += 5;
    if (company.includes(lowerKeyword)) score += 2;
    if (location.includes(lowerKeyword)) score += 1;

    return score;
};

const fetchJobs = async (keyword) => {
    try {
        const [remotiveJobs, arbeitnowJobs] = await Promise.all([
            fetchRemotiveJobs(keyword),
            fetchArbeitnowJobs(keyword)
        ]);

        const allJobs = [...remotiveJobs, ...arbeitnowJobs];

        const rankedJobs = allJobs
            .map(job => ({
                ...job,
                score: calculateScore(job, keyword)
            }))
            .sort((a, b) => b.score - a.score);

        return rankedJobs;

    } catch (error) {
        console.error("Ranking Engine Error:", error.message);
        throw new Error("Failed to fetch ranked jobs");
    }
};

module.exports = { fetchJobs };