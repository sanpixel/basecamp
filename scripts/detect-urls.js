const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const https = require('https');

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

// Get custom domain mappings
function getCustomDomains() {
  try {
    const output = execSync('gcloud beta run domain-mappings list --project=warp-ratio', { encoding: 'utf8' });
    const lines = output.trim().split('\n');
    const domains = {};
    
    for (const line of lines) {
      // Parse format: "+  clocknumbers.com            basecamp-dashboard  us-central1"
      if (line.startsWith('+  ')) {
        const parts = line.substring(3).trim().split(/\s+/);
        if (parts.length >= 2) {
          const domain = parts[0];
          const service = parts[1];
          domains[service] = `https://${domain}`;
        }
      }
    }
    
    return domains;
  } catch (error) {
    console.error('Error getting custom domains:', error.message);
    return {};
  }
}

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
async function findCorrectBranch(projectName, fileName) {
  const branches = ['main', 'master', 'dev'];
  
  for (const branch of branches) {
    const url = `https://github.com/sanpixel/${projectName}/blob/${branch}/${fileName}`;
    if (await checkGitHubUrl(url)) {
      return branch;
    }
  }
  
  return 'main'; // fallback
}

// Detect URLs using Cloud Run services list and project analysis
async function detectProjectUrls(projectPath, projectName, cloudRunServices, customDomains) {
  const prdBranch = await findCorrectBranch(projectName, 'PRD.md');
  const todoBranch = await findCorrectBranch(projectName, 'TODO.md');
  
  const urls = {
    app: null,
    streamlit: null,
    repo: `https://github.com/sanpixel/${projectName}`,
    prd: `https://github.com/sanpixel/${projectName}/blob/${prdBranch}/PRD.md`,
    todos: `https://github.com/sanpixel/${projectName}/blob/${todoBranch}/TODO.md`
  };

  console.log(`\n=== Analyzing ${projectName} ===`);
  
  // Try to match project name with Cloud Run services
  const possibleServiceNames = [
    projectName.replace('.', '-'),  // ratio.ai -> ratio-ai
    projectName,                    // exact match
    `${projectName}-ai`,           // if it doesn't have -ai already
    `${projectName.replace('.ai', '')}-ai`, // normalize -ai ending
    'basecamp-dashboard',          // special case for basecamp
    'fantasy-tier-game',           // special case for fantasy.ai
  ];
  
  let foundService = false;
  for (const serviceName of possibleServiceNames) {
    // Check for custom domain first
    if (customDomains[serviceName]) {
      urls.app = customDomains[serviceName];
      console.log(`🌐 Found custom domain: ${serviceName} → ${urls.app}`);
      foundService = true;
      break;
    }
    // Fallback to Cloud Run URL
    else if (cloudRunServices[serviceName]) {
      urls.app = cloudRunServices[serviceName];
      console.log(`🚀 Found Cloud Run service: ${serviceName} → ${urls.app}`);
      foundService = true;
      break;
    }
  }
  
  if (!foundService) {
    console.log(`⚠️ No Cloud Run service found for ${projectName}`);
    console.log(`   Tried: ${possibleServiceNames.join(', ')}`);
  }
  
  // Check for Streamlit apps
  const streamlitFiles = ['app.py', 'main.py', 'streamlit_app.py'];
  for (const file of streamlitFiles) {
    if (fs.existsSync(path.join(projectPath, file))) {
      console.log(`🎯 Found Streamlit app: ${file}`);
      // Check for dedicated streamlit service
      const streamlitServiceName = `${projectName.replace('.', '-')}-streamlit`;
      if (customDomains[streamlitServiceName]) {
        urls.streamlit = customDomains[streamlitServiceName];
        console.log(`🌐 Found Streamlit custom domain: ${streamlitServiceName} → ${urls.streamlit}`);
      } else if (cloudRunServices[streamlitServiceName]) {
        urls.streamlit = cloudRunServices[streamlitServiceName];
        console.log(`🚀 Found Streamlit service: ${streamlitServiceName} → ${urls.streamlit}`);
      } else {
        // Check for generic ldr-streamlit service
        if (customDomains['ldr-streamlit']) {
          urls.streamlit = customDomains['ldr-streamlit'];
        } else {
          urls.streamlit = 'https://ldr-streamlit-kbrobedkgq-uc.a.run.app'; // Default fallback
        }
      }
      break;
    }
  }

  // If no Cloud Run service found, use default pattern
  if (!urls.app) {
    urls.app = `https://${projectName.replace('.', '-')}-kbrobedkgq-uc.a.run.app`;
    console.log(`🔮 Default Cloud Run pattern: ${urls.app}`);
  }

  console.log(`📆 Final URLs for ${projectName}:`);
  console.log(`   App: ${urls.app}`);
  if (urls.streamlit) console.log(`   Streamlit: ${urls.streamlit}`);
  console.log(`   Repo: ${urls.repo}`);

  return urls;
}

// Scan all projects and detect URLs
async function detectAllUrls() {
  console.log('🔍 Scanning C:\\dev for project URLs...\n');
  
  // Load existing config
  let config = { projects: [] };
  if (fs.existsSync(CONFIG_PATH)) {
    config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  }
  
  // Get all Cloud Run services first
  console.log('☁️ Getting Cloud Run services...');
  const cloudRunServices = getCloudRunServices();
  console.log(`📊 Found ${Object.keys(cloudRunServices).length} Cloud Run services:`);
  for (const [name, url] of Object.entries(cloudRunServices)) {
    console.log(`   ${name} → ${url}`);
  }
  
  // Get custom domains
  console.log('\n🌐 Getting custom domains...');
  const customDomains = getCustomDomains();
  console.log(`📊 Found ${Object.keys(customDomains).length} custom domains:`);
  for (const [service, domain] of Object.entries(customDomains)) {
    console.log(`   ${service} → ${domain}`);
  }
  
  try {
    const entries = fs.readdirSync(DEV_DIR);
    
    for (const entry of entries) {
      const fullPath = path.join(DEV_DIR, entry);
      const stat = fs.statSync(fullPath);
      
      // Skip if not a directory
      if (!stat.isDirectory()) {
        continue;
      }
      
      // Skip certain directories
      if (['backup', 'node_modules', '.git', 'substack'].includes(entry)) {
        continue;
      }
      
      // Check if it looks like a project
      const packageJson = path.join(fullPath, 'package.json');
      const requirementsTxt = path.join(fullPath, 'requirements.txt');
      const dockerfile = path.join(fullPath, 'Dockerfile');
      const readme = path.join(fullPath, 'README.md');
      
      if (fs.existsSync(packageJson) || 
          fs.existsSync(requirementsTxt) || 
          fs.existsSync(dockerfile) ||
          fs.existsSync(readme)) {
        
        const urls = await detectProjectUrls(fullPath, entry, cloudRunServices, customDomains);
        
        // Update or add project in config
        let project = config.projects.find(p => p.name === entry);
        if (project) {
          project.urls = urls;
          console.log(`✅ Updated URLs for ${entry}`);
        } else {
          project = {
            id: Math.floor(Math.random() * 10000),
            name: entry,
            path: fullPath,
            description: `Project in ${entry}`,
            status: 'development',
            priority: 'medium',
            lastModified: new Date().toISOString().split('T')[0],
            todoCount: 0,
            urls: urls
          };
          config.projects.push(project);
          console.log(`➕ Added new project: ${entry}`);
        }
      }
    }
    
    // Save updated config
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
    console.log(`\n💾 Updated config.json with ${config.projects.length} projects`);
    
  } catch (error) {
    console.error('Error scanning directory:', error);
  }
}

// Run the detection
detectAllUrls().catch(console.error);
