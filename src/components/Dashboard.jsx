import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectCard from './ProjectCard';
import SearchFilter from './SearchFilter';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects, searchTerm, statusFilter]);

  const loadProjects = async () => {
    try {
      const response = await fetch('/config.json');
      const data = await response.json();
      setProjects(data.projects);
      setLoading(false);
    } catch (error) {
      console.error('Error loading projects:', error);
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = projects;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    setFilteredProjects(filtered);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  const openUrl = (url) => {
    window.open(url, '_blank');
  };

  const deleteProject = (projectName) => {
    const updatedProjects = projects.filter(p => p.name !== projectName);
    setProjects(updatedProjects);
    console.log(`Removed project: ${projectName}`);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>ClockNumbers Developer Basecamp</h1>
        <p className="dashboard-subtitle">
          Your centralized hub for all development projects
        </p>
      </header>

      <div className="dashboard-stats">
        <div className="stat">
          <span className="stat-number">{projects.length}</span>
          <span className="stat-label">Total Projects</span>
        </div>
        <div 
          className="stat clickable" 
          onClick={() => navigate('/todos/active')}
          title="View active project TODOs"
        >
          <span className="stat-number">
            {projects.filter(p => p.status === 'active').length}
          </span>
          <span className="stat-label">Active</span>
        </div>
        <div 
          className="stat clickable" 
          onClick={() => navigate('/todos/development')}
          title="View development project TODOs"
        >
          <span className="stat-number">
            {projects.filter(p => p.status === 'development').length}
          </span>
          <span className="stat-label">In Development</span>
        </div>
      </div>

      <div className="projects-grid">
        {filteredProjects.length === 0 ? (
          <div className="no-projects">
            <p>No projects found matching your criteria.</p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <ProjectCard
              key={project.name}
              project={project}
              onOpenUrl={openUrl}
              onDeleteProject={deleteProject}
            />
          ))
        )}
      </div>

      <SearchFilter
        searchTerm={searchTerm}
        onSearch={handleSearch}
        statusFilter={statusFilter}
        onStatusFilter={handleStatusFilter}
      />
    </div>
  );
};

export default Dashboard;
