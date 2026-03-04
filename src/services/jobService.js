const axios = require("axios");

/* =========================================================
   REMOTIVE API
========================================================= */
const fetchRemotiveJobs = async (keyword) => {
  let response = await axios.get(
    `https://remotive.com/api/remote-jobs?search=${keyword}`,
  );

  if (!response.data.jobs.length) {
    response = await axios.get(`https://remotive.com/api/remote-jobs`);
  }

  return (response.data.jobs || []).map((job) => ({
    title: job.title || "",
    company: job.company_name || "",
    location: job.candidate_required_location || "",
    url: job.url || "",
    source: "Remotive",
  }));
};

/* =========================================================
   ARBEITNOW API
========================================================= */
const fetchArbeitnowJobs = async (keyword) => {
  const response = await axios.get(`https://arbeitnow.com/api/job-board-api`);

  return (response.data.data || []).slice(0, 20).map((job) => ({
    title: job.title || "",
    company: job.company_name || "",
    location: job.location || "",
    url: job.url || "",
    source: "Arbeitnow",
  }));
};

/* =========================================================
   THE MUSE API
========================================================= */
const fetchMuseJobs = async (keyword) => {
  const response = await axios.get(
    `https://www.themuse.com/api/public/jobs?page=1`,
  );

  return (response.data.results || []).slice(0, 20).map((job) => ({
    title: job.name || "",
    company: job.company?.name || "",
    location: job.locations?.[0]?.name || "",
    url: job.refs?.landing_page || "",
    source: "TheMuse",
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
========================================================= */
const deduplicateJobs = (jobs) => {
  const seen = new Set();
  const cleanJobs = [];

  for (let job of jobs) {
    const key =
      (job.title || "").trim().toLowerCase() +
      (job.company || "").trim().toLowerCase() +
      (job.location || "").trim().toLowerCase();

    if (!seen.has(key)) {
      seen.add(key);
      cleanJobs.push(job);
    }
  }


  return cleanJobs;
  
};


/* =========================================================
   FILTERING ENGINE
========================================================= */
const filterJobs = (jobs, filters) => {
  const { location, company, minScore } = filters;

  let filtered = jobs;

  if (location) {
    filtered = filtered.filter((job) =>
      job.location.toLowerCase().includes(location.toLowerCase()),
    );
  }

  if (company) {
    filtered = filtered.filter((job) =>
      job.company.toLowerCase().includes(company.toLowerCase()),
    );
  }

  if (minScore) {
    filtered = filtered.filter((job) => job.score >= Number(minScore));
  }

  return filtered;
};


/* =========================================================
   SORTING ENGINE
========================================================= */
const sortJobs = (jobs, sort) => {
  if (sort === "recent") {
    return jobs.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  }

  // default sorting
  return jobs.sort((a, b) => b.score - a.score);
};

/* =========================================================
   MAIN AGGREGATION ENGINE
========================================================= */
const fetchJobs = async (filters) => {
  const keyword = filters.keyword || "";

  try {
    const [remotiveJobs, arbeitnowJobs, museJobs] = await Promise.all([
      fetchRemotiveJobs(keyword),
      fetchArbeitnowJobs(keyword),
      fetchMuseJobs(keyword),
    ]);

    const allJobs = [...remotiveJobs, ...arbeitnowJobs, ...museJobs];
    // console.log("Remotive jobs:", remotiveJobs.length);
    // console.log("Arbeitnow jobs:", arbeitnowJobs.length);
    // console.log("Muse jobs:", museJobs.length);
    // console.log("Total aggregated jobs:", allJobs.length);

    /* Ranking */
    const rankedJobs = allJobs
      .map((job) => ({
        ...job,
        score: calculateScore(job, keyword),
      }))
      .sort((a, b) => b.score - a.score);

    /* Deduplication */
    const cleanJobs = deduplicateJobs(rankedJobs);

    /* Filtering */
    const filteredJobs = filterJobs(cleanJobs, filters);

    /* Sorting */
    const finalJobs = sortJobs(filteredJobs, filters.sort);

    return finalJobs;
  } catch (error) {
    console.error("Aggregation Engine Error:", error.message);
    throw new Error("Failed to fetch jobs");
  }
};

module.exports = { fetchJobs };
