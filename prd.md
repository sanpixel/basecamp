# Product Requirements Document (PRD)

## Product Overview
**Product Name:** Developer Home Dashboard  
**Version:** 1.0  
**Date:** August 26, 2025  
**Author(s):** Simon  
**Stakeholders:** Development Team  

## Executive Summary
A centralized basecamp-style home page that serves as a command center for all development projects, providing quick access to applications, their PRDs, TODO lists, and project status at a glance.

## Problem Statement
### Current State
- Multiple projects (ratio.ai, ldr.ai, others)
- Need central location to view project status, TODOs, and documentation
- Context switching between projects
- track overall progress across all initiatives
- centerlize and east to update PRDs and project documentation from anywhere so WARP.dev can continue swiftly when ready

### Desired State
- Single dashboard providing overview of all projects
- Quick access to each project's key resources (app, PRD, TODOs)
- editable access to docs (how does this work with github?)
- Real-time status indicators for each project
- Streamlined workflow for project management and navigation

## Goals and Objectives
### Primary Goals
1. Create a centralized hub for all development projects
2. Reduce time spent navigating between project resources
3. Improve project visibility and status tracking
4. Streamline access to PRDs and TODO management

### Success Metrics
- **Navigation Time:** Reduce time to access project resources by 70%
- **Project Visibility:** 100% of active projects visible on dashboard
- **Usage:** Dashboard becomes primary starting point for development work
- **TODO Management:** All project TODOs accessible within 2 clicks

## Target Users
### Primary Users
- **Developer/Project Owner:** Needs quick access to all projects, their status, and action items
- **Team Members:** Need visibility into project priorities and current focus areas

## Use Cases
### Core Use Cases
1. **Project Status Overview**
   - **Actor:** Developer
   - **Scenario:** Starting work day, need to see what needs attention
   - **Steps:** 
     1. Open home dashboard
     2. Review project status indicators
     3. Identify priorities for the day
   - **Success Criteria:** Can assess all project status within 30 seconds

2. **Quick Project Access**
   - **Actor:** Developer
   - **Scenario:** Need to work on specific project
   - **Steps:**
     1. Click project tile on dashboard
     2. Access app, PRD, or TODOs directly
   - **Success Criteria:** Can launch any project resource in 2 clicks or less

3. **TODO Management**
   - **Actor:** Developer
   - **Scenario:** Need to review and update task lists
   - **Steps:**
     1. View aggregated TODOs on dashboard
     2. Click to view project-specific TODOs
     3. Add/update/complete tasks
   - **Success Criteria:** Can manage TODOs without leaving dashboard

## Functional Requirements
### Core Features
1. **Project Grid/Cards**
   - **Priority:** High
   - **User Story:** As a developer, I want to see all my projects as visual cards so that I can quickly identify and access any project
   - **Acceptance Criteria:**
     - [ ] Display each project as a card with name, description, and status
     - [ ] Show last modified date for each project
     - [ ] Include quick action buttons (Open App, View PRD, View TODOs)
     - [ ] Visual status indicators (active, maintenance, completed)

2. **Aggregated TODO Dashboard**
   - **Priority:** High
   - **User Story:** As a developer, I want to see all outstanding TODOs across projects so that I can prioritize my work
   - **Acceptance Criteria:**
     - [ ] Display TODO count for each project
     - [ ] Show high-priority items prominently
     - [ ] Allow quick TODO completion from dashboard
     - [ ] Filter TODOs by project, priority, or due date

3. **Quick Launch Links**
   - **Priority:** High
   - **User Story:** As a developer, I want one-click access to frequently used project resources
   - **Acceptance Criteria:**
     - [ ] Direct links to live applications
     - [ ] Quick access to PRD documents
     - [ ] Links to project repositories
     - [ ] Access to project documentation

4. **Project Status Tracking**
   - **Priority:** Medium
   - **User Story:** As a developer, I want to see the current status of each project so that I know what needs attention
   - **Acceptance Criteria:**
     - [ ] Status indicators (Development, Testing, Production, Maintenance)
     - [ ] Last deployment date/status
     - [ ] Health indicators (if applicable)
     - [ ] Recent activity summary

### Nice-to-Have Features
- Search functionality across all projects
- Recent activity feed
- Project analytics/metrics
- Time tracking integration
- Calendar integration for project deadlines

## Non-Functional Requirements
### Performance
- Page load time: < 2 seconds
- Navigation response: < 500ms
- Real-time TODO updates

### Usability
- Mobile responsive design
- Keyboard navigation support
- Intuitive visual hierarchy
- Consistent with existing project styling

### Reliability
- Works offline with cached data
- Graceful handling of unavailable projects
- Auto-refresh project status

## Technical Considerations
### Architecture
- React application with component-based structure
- Local storage for user preferences and caching
- JSON configuration for project metadata
- Modern React hooks for state management
- Responsive CSS-in-JS or CSS modules

### Dependencies
- React 18+
- Node.js and npm/yarn
- Google Cloud Run for deployment
- GitHub Actions for CI/CD
- Docker for containerization
- Access to project directories (C:\dev\ratio.ai, C:\dev\ldr.ai)

### Constraints
- Should integrate with existing project structures
- Minimal maintenance overhead
- Must be accessible from anywhere (web deployment)
- Secure handling of project metadata

## User Experience (UX)
### Design Principles
- Simplicity: Clean, uncluttered interface
- Speed: Everything accessible within 2 clicks
- Visibility: Project status immediately apparent
- Consistency: Familiar patterns from existing tools

### User Flow
```
1. Open Dashboard
   ↓
2. Scan Project Overview
   ↓
3. Choose Action:
   - Click project to open app
   - View PRD
   - Check TODOs
   - Add new task
   ↓
4. Return to dashboard or continue in project
```

## Implementation Plan
### Phase 1: Core Dashboard (MVP)
**Deliverables:**
- [ ] Responsive dashboard with project grid/card layout
- [ ] JSON configuration system for project metadata
- [ ] One-click navigation to apps, PRDs, and repositories
- [ ] Project search and filtering functionality

### Phase 2: TODO Integration
**Deliverables:**
- [ ] Cross-project TODO aggregation and display
- [ ] Interactive TODO management (add, complete, prioritize)
- [ ] TODO filtering by project, status, and priority
- [ ] Real-time TODO count indicators on project cards

### Phase 3: Enhancement & Polish
**Deliverables:**
- [ ] Project status indicators with health monitoring
- [ ] Advanced project analytics and metrics
- [ ] Keyboard shortcuts and accessibility features
- [ ] Integration with version control for activity tracking

## Project Structure
```
C:\dev\home\
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Actions CI/CD
├── public/
│   ├── index.html
│   └── config.json        # Project configuration
├── src/
│   ├── components/
│   │   ├── ProjectCard.jsx
│   │   ├── TodoList.jsx
│   │   ├── Dashboard.jsx
│   │   └── SearchFilter.jsx
│   ├── hooks/
│   │   ├── useProjects.js
│   │   └── useTodos.js
│   ├── utils/
│   │   └── projectUtils.js
│   ├── styles/
│   │   └── Dashboard.css
│   ├── App.jsx
│   └── index.js
├── Dockerfile             # Container configuration
├── .dockerignore
├── package.json
└── README.md
```

## Success Criteria
### Launch Criteria
- [ ] All active projects visible on dashboard
- [ ] Quick access to apps, PRDs, and TODOs working
- [ ] Responsive design tested on multiple screen sizes
- [ ] Load time under 2 seconds

### Post-Launch Success Metrics
- **Daily Usage:** Dashboard accessed at start of each work session
- **Navigation Efficiency:** 70% reduction in time to access project resources
- **TODO Completion:** 25% increase in TODO completion rate due to improved visibility

## Future Considerations
### Roadmap Items
- Integration with version control systems
- Automated project health monitoring
- Team collaboration features
- Project templates and scaffolding
- Integration with time tracking tools

### Potential Expansions
- Web-based version for remote access
- Mobile app companion
- Integration with project management tools
- Automated reporting and analytics

## Project Configuration Schema
```json
{
  "projects": [
    {
      "name": "ratio.ai",
      "path": "C:\\dev\\ratio.ai",
      "description": "AI-powered recipe optimization platform",
      "status": "active",
      "urls": {
        "app": "https://ratio-ai-kbrobedkgq-uc.a.run.app/",
        "prd": "./prd.md",
        "todos": "./todos.md",
        "repo": "https://github.com/user/ratio.ai"
      },
      "lastModified": "2025-08-26",
      "priority": "high"
    },
    {
      "name": "ldr.ai", 
      "path": "C:\\dev\\ldr.ai",
      "description": "Leadership development AI platform",
      "status": "development",
      "urls": {
        "app": "http://localhost:3000",
        "prd": "./prd.md", 
        "todos": "./todos.md",
        "repo": "https://github.com/user/ldr.ai"
      },
      "lastModified": "2025-08-25",
      "priority": "medium"
    }
  ]
}
```

## Change Log
| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2025-08-26 | 1.0 | Initial PRD for Developer Home Dashboard | Simon |
