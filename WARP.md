# Basecamp Dashboard - Developer Project Hub

## Overview
Basecamp is a React-based centralized dashboard for managing all development projects in C:\dev. It serves as a command center for the ClockNumbers project ecosystem, providing quick access to applications, repositories, PRDs, and TODO lists.

## Architecture

### Tech Stack
- **Frontend**: React 19.1.1 with Create React App
- **Styling**: Custom CSS with responsive design
- **Configuration**: JSON-based project metadata
- **Deployment**: Docker + Google Cloud Run
- **Domain**: basecamp-dashboard-kbrobedkgq-uc.a.run.app

### Project Structure
```
basecamp/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx      # Main dashboard component
│   │   ├── ProjectCard.jsx    # Individual project cards
│   │   ├── SearchFilter.jsx   # Search and filter UI
│   │   └── Dashboard.css      # Styling
│   └── App.js                 # Root component with Cloud Run warmup
├── public/
│   └── config.json           # Project metadata and URLs
├── Dockerfile
├── nginx.conf
└── todo.md                   # Development roadmap
```

## Current Features

### Project Management
- **Project Cards**: Visual cards for each project (ratio.ai, ldr.ai, fantasy.ai, basecamp)
- **Status Tracking**: Active, Development, Maintenance, Completed with color coding
- **Priority Levels**: High/Medium/Low priority indicators
- **Metadata Display**: Last modified dates, TODO counts, project IDs
- **Project Deletion**: Password-protected hide functionality to remove projects from dashboard

### Navigation & Actions
- **Quick Launch**: Direct buttons to open applications
- **Repository Access**: One-click GitHub repository links
- **Documentation**: Direct access to PRDs and TODO files
- **Streamlit Apps**: Dedicated buttons for Streamlit applications
- **TODO Navigation**: Click Active/Development stats to view aggregated TODOs

### Smart Features
- **Cloud Run Warmup**: Automatically pings services on load to prevent cold starts
- **Search & Filter**: Filter projects by name, description, and status
- **Statistics Dashboard**: Project counts and status overview with clickable navigation
- **Responsive Design**: Works on desktop and mobile
- **Real URL Detection**: Uses gcloud to detect actual Cloud Run service URLs

### TODO Collaboration
- **GitHub TODO Scraping**: Automatically fetches TODO.md files from project repositories
- **Status-based Aggregation**: Separate pages for Active and Development project TODOs
- **Smart Parsing**: Extracts incomplete TODOs with section grouping and line numbers
- **Cross-project Overview**: Centralized view of all outstanding tasks by project status

## Project Configuration (config.json)
Each project includes:
- **id**: Unique project identifier (#2501, #2502, etc.)
- **name**: Project name (ratio.ai, ldr.ai, etc.)
- **path**: Local development path
- **description**: Project purpose
- **status**: Current development status
- **priority**: Development priority level
- **urls**: Links to app, repo, PRD, todos, streamlit
- **lastModified**: Last update date
- **todoCount**: Outstanding TODO items

## Development Roadmap

### Phase 1: Core Dashboard ✅ COMPLETE
- Responsive dashboard with project grid/card layout
- JSON configuration system for project metadata
- One-click navigation to apps, PRDs, and repositories
- Project search and filtering functionality
- Dark mode theme
- Project ID badges

### Phase 2: TODO Integration (Planned)
- Cross-project TODO aggregation and display
- Interactive TODO management (add, complete, prioritize)
- TODO filtering by project, status, and priority
- Real-time TODO count indicators on project cards

### Phase 3: Enhancement & Polish (Planned)
- Project status indicators with health monitoring
- Advanced project analytics and metrics
- Keyboard shortcuts and accessibility features
- Integration with version control for activity tracking

### Future Feature Ideas
- **In-browser PRD/TODO editing**: GitHub API + Monaco Editor integration
- **Health Monitoring**: Service uptime and build status indicators
- **Activity Tracking**: Recent commits and deployment status
- **Custom Domain**: basecamp.clocknumbers.com

## Deployment
- **Container**: Docker with nginx for static file serving
- **Platform**: Google Cloud Run
- **CI/CD**: GitHub Actions workflow configured
- **Scaling**: Serverless with automatic scaling

## Benefits
This dashboard eliminates context switching between projects by providing:
- Single source of truth for all project information
- Quick access to live applications and development resources
- Visual project status overview
- Centralized TODO and documentation management
- Automated service warmup for better user experience

## Usage Pattern
1. Load basecamp dashboard
2. Services automatically warm up in background
3. View project overview and status
4. Click direct links to access applications, repos, or documentation
5. Use search/filter to focus on specific projects or statuses

This dashboard saves significant time when managing multiple AI projects and provides a professional interface for project portfolio management.
