#!/usr/bin/env node
const path = require('path');

const { loadJobs, saveJobs } = require('./utils/fileManager');
const { scrapeStripe } = require('./scrapers/stripe');
const { scrapeYcJobs } = require('./scrapers/yc-jobs');

const dataFile = path.join(__dirname, 'data', 'jobs.json');

function mergeJobs(existingJobs, incomingJobs) {
  const merged = [...existingJobs];
  const seen = new Set(merged.map((job) => (job.applyUrl || '').toLowerCase()));

  incomingJobs.forEach((job) => {
    const key = (job.applyUrl || '').toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    merged.push(job);
  });

  return merged;
}

async function executeFetch() {
  const existingJobs = loadJobs(dataFile);
  const stripeJobs = await scrapeStripe({ name: 'stripe', url: 'https://boards.greenhouse.io/stripe' });
  const ycJobs = await scrapeYcJobs({ name: 'ycJobs', url: 'https://www.ycombinator.com/jobs' });
  const allIncomingJobs = stripeJobs.concat(ycJobs);

  const jobs = mergeJobs(existingJobs, allIncomingJobs);
  saveJobs(dataFile, jobs);

  console.log(`Fetched ${stripeJobs.length} Stripe jobs and ${ycJobs.length} YC jobs.`);
  console.log(`Saved ${jobs.length} jobs to ${dataFile}.`);
}

function executeList() {
  const jobs = loadJobs(dataFile);
  console.log(`Found ${jobs.length} job(s).`);
  jobs.forEach((job, index) => {
    console.log(`${index + 1}. ${job.jobTitle} @ ${job.companyName}`);
    console.log(`   Location: ${job.location || 'N/A'} | URL: ${job.applyUrl || 'N/A'}`);
  });
}

async function main() {
  const command = process.argv[2] || 'list';
  if (command === 'fetch') {
    await executeFetch();
    return;
  }
  if (command === 'list') {
    executeList();
    return;
  }
  console.log('Usage: node index.js [fetch|list]');
}

main().catch((error) => {
  console.error(error.message);
});
