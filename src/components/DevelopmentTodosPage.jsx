import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProjectTodos, groupTodosByStatus } from '../utils/todoScraper';
import './TodosPage.css';

const DevelopmentTodosPage = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDevelopmentTodos();
  }, []);

  const loadDevelopmentTodos = async () => {
    try {
      // Load projects from config
      const response = await fetch('/config.json');
      const data = await response.json();
      
      // Filter development projects only
      const developmentProjects = data.projects.filter(p => p.status === 'development');
      
      // Fetch TODOs for development projects
      const projectTodos = await fetchProjectTodos(developmentProjects);
      const grouped = groupTodosByStatus(projectTodos);
      
      setTodos(grouped.development);
      setLoading(false);
    } catch (err) {
      setError('Failed to load development project TODOs');
      setLoading(false);
    }
  };

  const getTotalTodoCount = () => {
    return todos.reduce((total, project) => total + project.todoCount, 0);
  };

  if (loading) {
    return (
      <div className="todos-page">
        <div className="todos-header">
          <Link to="/" className="back-link">← Back to Dashboard</Link>
          <h1>Development Project TODOs</h1>
        </div>
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading development project TODOs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="todos-page">
        <div className="todos-header">
          <Link to="/" className="back-link">← Back to Dashboard</Link>
          <h1>Development Project TODOs</h1>
        </div>
        <div className="error">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="todos-page">
      <div className="todos-header">
        <Link to="/" className="back-link">← Back to Dashboard</Link>
        <h1>Development Project TODOs</h1>
        <div className="todos-stats">
          <span className="stat-badge development">
            {todos.length} Development Projects
          </span>
          <span className="stat-badge development">
            {getTotalTodoCount()} Outstanding TODOs
          </span>
        </div>
      </div>

      <div className="todos-content">
        {todos.length === 0 ? (
          <div className="no-todos">
            <h2>No Development Projects with TODOs</h2>
            <p>Either there are no development projects, or none have TODO.md files available.</p>
          </div>
        ) : (
          <div className="projects-todos">
            {todos.map((projectData) => (
              <div key={projectData.project} className="project-todos development">
                <div className="project-todos-header">
                  <h2 className="project-name">{projectData.project}</h2>
                  <div className="project-meta">
                    <span className="todo-count">{projectData.todoCount} TODOs</span>
                    {!projectData.hasFile && (
                      <span className="no-file-indicator">No TODO.md found</span>
                    )}
                  </div>
                </div>

                {projectData.todos.length > 0 ? (
                  <div className="todos-list">
                    {projectData.todos.map((todo) => (
                      <div key={todo.id} className="todo-item">
                        <div className="todo-content">
                          <div className="todo-text">{todo.text}</div>
                          {todo.section !== 'General' && (
                            <div className="todo-section">{todo.section}</div>
                          )}
                        </div>
                        <div className="todo-meta">
                          <span className="line-number">Line {todo.lineNumber}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-todos-project">
                    <p>✅ All TODOs completed or no incomplete items found</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DevelopmentTodosPage;
