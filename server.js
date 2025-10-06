const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
const CONFIG_PATH = path.join(__dirname, 'public', 'config.json');

app.use(cors());
app.use(express.json());

// Update project endpoint
app.put('/api/projects/:projectName', (req, res) => {
  try {
    // Read current config
    const configData = fs.readFileSync(CONFIG_PATH, 'utf8');
    const config = JSON.parse(configData);
    
    // Find and update project
    const projectIndex = config.projects.findIndex(p => p.name === req.params.projectName);
    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    config.projects[projectIndex] = req.body;
    
    // Write updated config
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
    
    res.json({ success: true, project: req.body });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

app.listen(PORT, () => {
  console.log(`Config server running on port ${PORT}`);
});