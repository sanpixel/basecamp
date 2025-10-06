const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
const CONFIG_PATH = path.join(__dirname, 'public', 'config.json');
const REPO_CONFIG_PATH = path.join(__dirname, 'public', 'config.repo.json');

app.use(cors());
app.use(express.json());

// Update branch override endpoint
app.put('/api/branch-override/:projectName', (req, res) => {
  try {
    let repoConfig = { projects: [] };
    
    // Read existing repo config if it exists
    if (fs.existsSync(REPO_CONFIG_PATH)) {
      const repoConfigData = fs.readFileSync(REPO_CONFIG_PATH, 'utf8');
      repoConfig = JSON.parse(repoConfigData);
    }
    
    // Find existing override or create new one
    const existingIndex = repoConfig.projects.findIndex(p => p.name === req.params.projectName);
    const override = {
      name: req.body.name,
      branch: req.body.branch
    };
    
    if (existingIndex >= 0) {
      repoConfig.projects[existingIndex] = override;
    } else {
      repoConfig.projects.push(override);
    }
    
    // Write updated repo config
    fs.writeFileSync(REPO_CONFIG_PATH, JSON.stringify(repoConfig, null, 2));
    
    res.json({ success: true, override: override });
  } catch (error) {
    console.error('Error updating branch override:', error);
    res.status(500).json({ error: 'Failed to update branch override' });
  }
});

app.listen(PORT, () => {
  console.log(`Config server running on port ${PORT}`);
});