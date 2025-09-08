const fs = require('fs');
const path = require('path');
const https = require('https');

const CONFIG_PATH = path.join(__dirname, '..', 'public', 'config.json');

// Check if GitHub URL exists
async function checkGitHubUrl(url) {
  return new Promise((resolve) => {
    const req = https.request(url, { method: 'HEAD' }, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(5000, () => {
      req.destroy();
      resolve(false);
    });
    req.end();
  });
}

// Find correct branch for file
async function findCorrectUrl(projectName, fileName) {
  const branches = ['main', 'master', 'dev'];
  
  for (const branch of branches) {
    const url = `https://github.com/sanpixel/${projectName}/blob/${branch}/${fileName}`;
    if (await checkGitHubUrl(url)) {
      return url;
    }
  }
  
  // Return main as fallback
  return `https://github.com/sanpixel/${projectName}/blob/main/${fileName}`;
}

// Update project URLs
async function updateProjectUrls() {
  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  let updated = false;

  console.log('Validating project URLs...');

  for (const project of config.projects) {
    console.log(`\nChecking ${project.name}...`);
    
    const correctPrdUrl = await findCorrectUrl(project.name, 'PRD.md');
    const correctTodoUrl = await findCorrectUrl(project.name, 'TODO.md');

    if (project.urls.prd !== correctPrdUrl) {
      console.log(`  PRD: ${project.urls.prd} → ${correctPrdUrl}`);
      project.urls.prd = correctPrdUrl;
      updated = true;
    }

    if (project.urls.todos !== correctTodoUrl) {
      console.log(`  TODO: ${project.urls.todos} → ${correctTodoUrl}`);
      project.urls.todos = correctTodoUrl;
      updated = true;
    }
  }

  if (updated) {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
    console.log('\nConfig updated successfully!');
  } else {
    console.log('\nAll URLs are already correct.');
  }
}

updateProjectUrls().catch(console.error);
