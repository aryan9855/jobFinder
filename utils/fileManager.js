const fs = require('fs');
const path = require('path');

function ensureFile(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]');
  }
}

function loadJobs(filePath) {
  ensureFile(filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  try {
    return JSON.parse(content);
  } catch (error) {
    return [];
  }
}

function saveJobs(filePath, jobs) {
  ensureFile(filePath);
  const tempFile = `${filePath}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(jobs, null, 2));
  fs.renameSync(tempFile, filePath);
}

module.exports = { loadJobs, saveJobs };
