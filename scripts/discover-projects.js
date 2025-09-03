const fs = require('fs');
const path = require('path');

const DEV_DIR = 'C:\\dev';
const CONFIG_PATH = path.join(__dirname, '..', 'public', 'config.json');

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

// Extract project info
function getProjectInfo(dirPath, dirName) {
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
  
  // Count TODOs if file exists
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
  
  return {
    id: Math.floor(Math.random() * 9000) + 1000, // Random 4-digit ID
    name: dirName,
    path: dirPath,
    description: description,
    status: 'development',
    priority: 'medium',
    lastModified: lastModified,
    todoCount: todoCount,
    urls: {
      app: `https://${dirName.replace('.', '-')}.clocknumbers.com`,
      repo: `https://github.com/sanpixel/${dirName}`,
      prd: `https://github.com/sanpixel/${dirName}/blob/main/PRD.md`,
      todos: `https://github.com/sanpixel/${dirName}/blob/main/TODO.md`
    }
  };
}

// Discover new projects
function discoverProjects() {
  const config = readExistingConfig();
  const existingNames = config.projects.map(p => p.name);
  
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
        const projectInfo = getProjectInfo(fullPath, entry);
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
discoverProjects();
