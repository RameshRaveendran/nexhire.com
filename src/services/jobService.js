const axios = require("axios");

/* =========================================================
   REMOTIVE API INTEGRATION
========================================================= */
const fetchRemotiveJobs = async (keyword) => {
    const response = await axios.get(
        `https://remotive.com/api/remote-jobs?search=${keyword}`
    );

    return (response.data.jobs || []).map(job => ({
        title: job.title || "",
        company: job.company_name || "",
        location: job.candidate_required_location || "",
        url: job.url || "",
        source: "Remotive"
    }));
};


/* =========================================================
   ARBEITNOW API INTEGRATION
========================================================= */
const fetchArbeitnowJobs = async (keyword) => {
    const response = await axios.get(
        `https://arbeitnow.com/api/job-board-api`
    );

    return (response.data.data || [])
        .slice(0, 20) // limit to avoid massive payload
        .map(job => ({
            title: job.title || "",
            company: job.company_name || "",
            location: job.location || "",
            url: job.url || "",
            source: "Arbeitnow"
        }));
};


/* =========================================================
   RANKING ENGINE
========================================================= */
const calculateScore = (job, keyword) => {
    let score = 0;

    const lowerKeyword = (keyword || "").toLowerCase();
    const title = (job.title || "").toLowerCase();
    const company = (job.company || "").toLowerCase();
    const location = (job.location || "").toLowerCase();

    if (title.includes(lowerKeyword)) score += 5;
    if (company.includes(lowerKeyword)) score += 2;
    if (location.includes(lowerKeyword)) score += 1;

    return score;
};


/* =========================================================
   DEDUPLICATION ENGINE
   Removes cross-source duplicates after ranking
========================================================= */
const deduplicateJobs = (jobs) => {
    const seen = new Set();
    const cleanJobs = [];

    for (let job of jobs) {
        const key = (
            (job.title || "").trim().toLowerCase() +
            (job.company || "").trim().toLowerCase() +
            (job.location || "").trim().toLowerCase()
        );

        if (!seen.has(key)) {
            seen.add(key);
            cleanJobs.push(job);
        }
    }

    return cleanJobs;
};


/* =========================================================
   MAIN AGGREGATION FUNCTION
   Aggregate → Rank → Deduplicate → Return
========================================================= */
const fetchJobs = async (keyword) => {
    try {
        const [remotiveJobs, arbeitnowJobs] = await Promise.all([
            fetchRemotiveJobs(keyword),
            fetchArbeitnowJobs(keyword)
        ]);

        const allJobs = [...remotiveJobs, ...arbeitnowJobs];

        // Rank jobs
        const rankedJobs = allJobs
            .map(job => ({
                ...job,
                score: calculateScore(job, keyword)
            }))
            .sort((a, b) => b.score - a.score);

        // Deduplicate after ranking
        const finalJobs = deduplicateJobs(rankedJobs);

        return finalJobs;

    } catch (error) {
        console.error("Aggregation Engine Error:", error.message);
        throw new Error("Failed to fetch jobs");
    }
};

module.exports = { fetchJobs };