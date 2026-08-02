const axios = require('axios');

function extractJobs(html) {
  const marker = '&quot;jobPostings&quot;:[';
  const start = html.indexOf(marker);
  if (start === -1) return [];

  const decoded = html
    .slice(start)
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');

  const jobs = [];
  const pattern = /\{"id":(\d+),"title":"([^"]+)","url":"([^"]+)","applyUrl":"([^"]+)","location":"([^"]*)"/g;
  let match;

  while ((match = pattern.exec(decoded)) !== null) {
    jobs.push({
      companyName: 'Y Combinator',
      jobTitle: match[2],
      location: match[5] || 'Unknown',
      applyUrl: match[4],
      sourceWebsite: 'https://www.ycombinator.com/jobs',
      datePosted: new Date().toISOString()
    });
  }

  return jobs;
}

async function scrapeYcJobs(source) {
  const response = await axios.get(source.url, {
    timeout: 30000,
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });

  return extractJobs(response.data);
}

module.exports = { scrapeYcJobs };
