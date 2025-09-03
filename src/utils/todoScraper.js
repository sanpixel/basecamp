// Utility functions for scraping TODOs from GitHub repos

export const fetchTodoFromGitHub = async (projectName) => {
  try {
    const response = await fetch(`https://raw.githubusercontent.com/sanpixel/${projectName}/main/TODO.md`, {
      headers: {
        'Accept': 'text/plain',
      }
    });
    
    if (!response.ok) {
      // Try 'master' branch if 'main' fails
      const masterResponse = await fetch(`https://raw.githubusercontent.com/sanpixel/${projectName}/master/TODO.md`);
      if (!masterResponse.ok) {
        return null;
      }
      return await masterResponse.text();
    }
    
    return await response.text();
  } catch (error) {
    console.warn(`Failed to fetch TODO for ${projectName}:`, error);
    return null;
  }
};

export const parseTodos = (todoContent, projectName) => {
  if (!todoContent) return [];
  
  const lines = todoContent.split('\n');
  const todos = [];
  let currentSection = 'General';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check for section headers (## or #)
    if (line.startsWith('#')) {
      currentSection = line.replace(/^#+\s*/, '').trim();
      continue;
    }
    
    // Check for TODO items (- [ ] or - [x])
    const todoMatch = line.match(/^-\s*\[\s*([x\s])\s*\]\s*(.+)$/);
    if (todoMatch) {
      const [, status, text] = todoMatch;
      const isCompleted = status.toLowerCase() === 'x';
      
      if (!isCompleted) { // Only include incomplete TODOs
        todos.push({
          id: `${projectName}-${i}`,
          project: projectName,
          section: currentSection,
          text: text.trim(),
          completed: false,
          lineNumber: i + 1
        });
      }
    }
  }
  
  return todos;
};

export const fetchProjectTodos = async (projects) => {
  const todoPromises = projects.map(async (project) => {
    const todoContent = await fetchTodoFromGitHub(project.name);
    const todos = parseTodos(todoContent, project.name);
    return {
      project: project.name,
      status: project.status,
      todos: todos,
      hasFile: todoContent !== null
    };
  });
  
  const results = await Promise.all(todoPromises);
  return results;
};

export const groupTodosByStatus = (projectTodos) => {
  const grouped = {
    active: [],
    development: [],
    maintenance: [],
    completed: []
  };
  
  projectTodos.forEach(({ project, status, todos, hasFile }) => {
    if (grouped[status]) {
      grouped[status].push({
        project,
        todos,
        hasFile,
        todoCount: todos.length
      });
    }
  });
  
  return grouped;
};
