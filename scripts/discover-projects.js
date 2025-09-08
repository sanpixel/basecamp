const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DEV_DIR = 'C:\\dev';
const CONFIG_PATH = path.join(__dirname, '..', 'public', 'config.json');

// Get all Cloud Run services and their URLs
function getCloudRunServices() {
  try {
    const output = execSync('gcloud run services list --format="csv(metadata.name,status.url)"', { encoding: 'utf8' });
    const lines = output.trim().split('\n').slice(1); // Skip header
    const services = {};
    
    for (const line of lines) {
      const [name, url] = line.split(',');
      if (name && url) {
        services[name] = url;
      }
    }
    
    return services;
  } catch (error) {
    console.error('Error getting Cloud Run services:', error.message);
    return {};
  }
}

// Read existing config
function readExistingConfig() {
  try {
    const configData = fs.readFileSync(CONFIG_PATH, 'utf8');
    return JSON.parse(configData);
  } catch (error) {
    console.log('No existing config found, creating new one');
    return { projects: [] };
  }
}

// Check if directory is a valid project
function isProject(dirPath) {
  const packageJson = path.join(dirPath, 'package.json');
  const requirementsTxt = path.join(dirPath, 'requirements.txt');
  const dockerfile = path.join(dirPath, 'Dockerfile');
  const readme = path.join(dirPath, 'README.md');
  
  return fs.existsSync(packageJson) || 
         fs.existsSync(requirementsTxt) || 
         fs.existsSync(dockerfile) ||
         fs.existsSync(readme);
}

// Function to check if GitHub URL exists
async function checkGitHubUrl(url) {
  try {
    const https = require('https');
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
  } catch (error) {
    return false;
  }
}

// Function to find correct GitHub branch for file
async function findGitHubFile(dirName, fileName) {
  const branches = ['master', 'dev', 'main'];
  
  for (const branch of branches) {
    const url = `https://github.com/sanpixel/${dirName}/blob/${branch}/${fileName}`;
    if (await checkGitHubUrl(url)) {
      return url;
    }
  }
  
  // Fallback to master if none found
  return `https://github.com/sanpixel/${dirName}/blob/master/${fileName}`;
}

// Extract project info with Cloud Run URL detection
async function getProjectInfo(dirPath, dirName, cloudRunServices) {
  const packageJsonPath = path.join(dirPath, 'package.json');
  const readmePath = path.join(dirPath, 'README.md');
  const todoPath = path.join(dirPath, 'TODO.md');
  
  let description = `Project in ${dirName}`;
  let todoCount = 0;
  
  // Try to get description from package.json
  if (fs.existsSync(packageJsonPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      if (pkg.description) {
        description = pkg.description;
      }
    } catch (e) {
      console.log(`Error reading package.json for ${dirName}`);
    }
  }
  
  // Count TODOs if file exists locally
  if (fs.existsSync(todoPath)) {
    try {
      const todoContent = fs.readFileSync(todoPath, 'utf8');
      const todoMatches = todoContent.match(/- \[ \]/g);
      todoCount = todoMatches ? todoMatches.length : 0;
    } catch (e) {
      console.log(`Error reading TODO.md for ${dirName}`);
    }
  }
  
  // Get last modified date
  const stats = fs.statSync(dirPath);
  const lastModified = stats.mtime.toISOString().split('T')[0];
  
  // Find real Cloud Run URL
  const possibleServiceNames = [
    dirName.replace('.', '-'),  // ratio.ai -> ratio-ai
    dirName,                    // exact match
    `${dirName}-ai`,           // if it doesn't have -ai already
    `${dirName.replace('.ai', '')}-ai`, // normalize -ai ending
  ];
  
  let appUrl = `https://${dirName.replace('.', '-')}-kbrobedkgq-uc.a.run.app`; // Default
  let streamlitUrl = null;
  
  // Try to find real Cloud Run service
  for (const serviceName of possibleServiceNames) {
    if (cloudRunServices[serviceName]) {
      appUrl = cloudRunServices[serviceName];
      console.log(`  Found Cloud Run service: ${serviceName} → ${appUrl}`);
      break;
    }
  }
  
  // Check for Streamlit service
  const streamlitFiles = ['app.py', 'main.py', 'streamlit_app.py'];
  for (const file of streamlitFiles) {
    if (fs.existsSync(path.join(dirPath, file))) {
      const streamlitServiceName = `${dirName.replace('.', '-')}-streamlit`;
      if (cloudRunServices[streamlitServiceName]) {
        streamlitUrl = cloudRunServices[streamlitServiceName];
        console.log(`  Found Streamlit service: ${streamlitServiceName} → ${streamlitUrl}`);
      } else {
        streamlitUrl = 'https://ldr-streamlit-kbrobedkgq-uc.a.run.app'; // Default
      }
      break;
    }
  }
  
  // Find correct GitHub URLs for PRD and TODO files
  const prdUrl = await findGitHubFile(dirName, 'PRD.md');
  const todoUrl = await findGitHubFile(dirName, 'TODO.md');
  
  const urls = {
    app: appUrl,
    repo: `https://github.com/sanpixel/${dirName}`,
    prd: prdUrl,
    todos: todoUrl
  };
  
  if (streamlitUrl) {
    urls.streamlit = streamlitUrl;
  }
  
  return {
    id: Math.floor(Math.random() * 9000) + 1000, // Random 4-digit ID
    name: dirName,
    path: dirPath,
    description: description,
    status: 'development',
    priority: 'medium',
    lastModified: lastModified,
    todoCount: todoCount,
    urls: urls
  };
}

// Discover new projects
async function discoverProjects() {
  const config = readExistingConfig();
  const existingNames = config.projects.map(p => p.name);
  
  console.log('Getting Cloud Run services...');
  const cloudRunServices = getCloudRunServices();
  console.log(`Found ${Object.keys(cloudRunServices).length} Cloud Run services`);
  
  console.log('Scanning C:\\dev for projects...');
  
  try {
    const entries = fs.readdirSync(DEV_DIR);
    
    for (const entry of entries) {
      const fullPath = path.join(DEV_DIR, entry);
      const stat = fs.statSync(fullPath);
      
      // Skip if not a directory or already exists in config
      if (!stat.isDirectory() || existingNames.includes(entry)) {
        continue;
      }
      
      // Skip certain directories
      if (['backup', 'node_modules', '.git', 'substack'].includes(entry)) {
        continue;
      }
      
      // Check if it looks like a project
      if (isProject(fullPath)) {
        const projectInfo = await getProjectInfo(fullPath, entry, cloudRunServices);
        config.projects.push(projectInfo);
        console.log(`Added new project: ${entry}`);
      }
    }
    
    // Sort projects by name
    config.projects.sort((a, b) => a.name.localeCompare(b.name));
    
    // Write updated config
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
    console.log(`Config updated with ${config.projects.length} projects`);
    
  } catch (error) {
    console.error('Error scanning directory:', error);
  }
}

// Run the discovery
(async () => {
  await discoverProjects();
})();
