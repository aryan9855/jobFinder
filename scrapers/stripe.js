const axios = require('axios');

function normalizeJob(item, source) {
  return {
    companyName: item.company_name || 'Stripe',
    jobTitle: item.title || 'Open Role',
    location: item.location?.name || 'Unknown',
    applyUrl: item.absolute_url || '',
    sourceWebsite: source.url,
    datePosted: item.first_published || new Date().toISOString()
  };
}

async function scrapeStripe(source) {
  const apiUrl = source.url
    .replace('https://boards.greenhouse.io/', 'https://boards-api.greenhouse.io/v1/boards/')
    .replace(/\/$/, '') + '/jobs';

  const response = await axios.get(apiUrl, {
    timeout: 30000,
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });

  return (response.data.jobs || []).map((item) => normalizeJob(item, source));
}

module.exports = { scrapeStripe };