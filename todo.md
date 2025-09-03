# Basecamp TODO

## Phase 1: Core Dashboard (MVP)
- [x] Responsive dashboard with project grid/card layout
- [x] JSON configuration system for project metadata
- [x] One-click navigation to apps, PRDs, and repositories
- [x] Project search and filtering functionality
- [x] Dark mode theme
- [x] Project ID badges (#2501, #2502, etc.)

## Phase 2: TODO Integration
- [x] Cross-project TODO aggregation and display
- [x] Clickable stats navigation to TODO pages
- [x] TODO scraping from GitHub repos
- [x] Project delete/hide functionality with password protection
- [ ] Interactive TODO management (add, complete, prioritize)
- [ ] TODO filtering by project, status, and priority
- [ ] Real-time TODO count indicators on project cards

## Phase 3: Enhancement & Polish
- [ ] Project status indicators with health monitoring
- [ ] Advanced project analytics and metrics
- [ ] Keyboard shortcuts and accessibility features
- [ ] Integration with version control for activity tracking

## New Feature Ideas
- [ ] **In-browser PRD/TODO editing** - Add editable window functionality
  - Research options: GitHub API + Monaco Editor, React-MD-Editor, CodeMirror
  - Could use GitHub REST API with personal access token
  - Modal editor with live markdown preview
  - Save changes directly back to GitHub repo
  - Add "Edit PRD" and "Edit TODO" buttons to project cards
  
## Bug Fixes
- [ ] Fix any mobile responsiveness issues
- [ ] Optimize loading performance
- [ ] Add error handling for failed API calls

## Deployment
- [x] Docker containerization setup
- [x] GitHub Actions workflow configured
- [ ] Deploy to Google Cloud Run
- [ ] Set up custom domain (basecamp.clocknumbers.com)

## Documentation
- [x] Complete PRD document
- [ ] Add usage instructions to README
- [ ] Document deployment process
