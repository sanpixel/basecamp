import React from 'react';

const ProjectCard = ({ project, onOpenUrl }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#10b981'; // green
      case 'development':
        return '#f59e0b'; // amber
      case 'maintenance':
        return '#6b7280'; // gray
      case 'completed':
        return '#3b82f6'; // blue
      default:
        return '#6b7280';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#ef4444'; // red
      case 'medium':
        return '#f59e0b'; // amber
      case 'low':
        return '#10b981'; // green
      default:
        return '#6b7280';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="project-card">
      <div className="project-card-header">
        <div className="project-info">
          <div className="project-title">
            <h3 className="project-name">{project.name}</h3>
            {project.id && <span className="project-id">#{project.id}</span>}
          </div>
          <div className="project-badges">
            <span
              className="status-badge"
              style={{ backgroundColor: getStatusColor(project.status) }}
            >
              {project.status}
            </span>
            <span
              className="priority-badge"
              style={{ backgroundColor: getPriorityColor(project.priority) }}
            >
              {project.priority}
            </span>
          </div>
        </div>
      </div>

      <p className="project-description">{project.description}</p>

      <div className="project-meta">
        <div className="project-stat">
          <span className="stat-label">Last Modified:</span>
          <span className="stat-value">{formatDate(project.lastModified)}</span>
        </div>
        {project.todoCount !== undefined && (
          <div className="project-stat">
            <span className="stat-label">TODOs:</span>
            <span className="stat-value">{project.todoCount}</span>
          </div>
        )}
      </div>

      <div className="project-actions">
        <button
          className="action-button primary"
          onClick={() => onOpenUrl(project.urls.app)}
          title="Open Application"
        >
          <span className="action-icon">🚀</span>
          Open App
        </button>
        
        {project.urls.streamlit && (
          <button
            className="action-button primary"
            onClick={() => onOpenUrl(project.urls.streamlit)}
            title="Open Streamlit App"
          >
            <span className="action-icon">⚡</span>
            Streamlit
          </button>
        )}
        
        <button
          className="action-button secondary"
          onClick={() => onOpenUrl(project.urls.repo)}
          title="Open Repository"
        >
          <span className="action-icon">📂</span>
          Repository
        </button>
        
        <button
          className="action-button secondary"
          onClick={() => onOpenUrl(project.urls.prd)}
          title="View PRD"
        >
          <span className="action-icon">📋</span>
          PRD
        </button>
        
        <button
          className="action-button secondary"
          onClick={() => onOpenUrl(project.urls.todos)}
          title="View TODOs"
        >
          <span className="action-icon">✅</span>
          TODOs
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
