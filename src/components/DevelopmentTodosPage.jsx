import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProjectTodos, groupTodosByStatus } from '../utils/todoScraper';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './TodosPage.css';

// Sortable Todo Item Component
const SortableTodoItem = ({ todo }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="todo-item sortable"
    >
      <div className="todo-content">
        <div className="todo-text">{todo.text}</div>
        {todo.section !== 'General' && (
          <div className="todo-section">{todo.section}</div>
        )}
      </div>
      <div className="todo-meta">
        <span className="line-number">Line {todo.lineNumber}</span>
        <div className="drag-handle">⋮⋮</div>
      </div>
    </div>
  );
};

const DevelopmentTodosPage = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadDevelopmentTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load saved todo order from localStorage
  const loadSavedOrder = (projectName) => {
    const saved = localStorage.getItem(`todo-order-${projectName}`);
    return saved ? JSON.parse(saved) : null;
  };

  // Save todo order to localStorage
  const saveTodoOrder = (projectName, todoIds) => {
    localStorage.setItem(`todo-order-${projectName}`, JSON.stringify(todoIds));
  };

  // Apply saved order to todos
  const applySavedOrder = (todos, savedOrder) => {
    if (!savedOrder) return todos;
    
    const todoMap = new Map(todos.map(todo => [todo.id, todo]));
    const orderedTodos = [];
    
    // Add todos in saved order
    savedOrder.forEach(id => {
      if (todoMap.has(id)) {
        orderedTodos.push(todoMap.get(id));
        todoMap.delete(id);
      }
    });
    
    // Add any new todos that weren't in the saved order
    todoMap.forEach(todo => orderedTodos.push(todo));
    
    return orderedTodos;
  };

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
      
      // Apply saved order to each project's todos
      const orderedTodos = grouped.development.map(projectData => {
        const savedOrder = loadSavedOrder(projectData.project);
        const orderedProjectTodos = applySavedOrder(projectData.todos, savedOrder);
        
        return {
          ...projectData,
          todos: orderedProjectTodos
        };
      });
      
      setTodos(orderedTodos);
      setLoading(false);
    } catch (err) {
      setError('Failed to load development project TODOs');
      setLoading(false);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      // Find which project this todo belongs to
      const projectIndex = todos.findIndex(project => 
        project.todos.some(todo => todo.id === active.id)
      );
      
      if (projectIndex === -1) return;
      
      const project = todos[projectIndex];
      const oldIndex = project.todos.findIndex(todo => todo.id === active.id);
      const newIndex = project.todos.findIndex(todo => todo.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newTodos = arrayMove(project.todos, oldIndex, newIndex);
        
        // Update state
        const updatedTodos = [...todos];
        updatedTodos[projectIndex] = {
          ...project,
          todos: newTodos
        };
        setTodos(updatedTodos);
        
        // Save new order to localStorage
        const todoIds = newTodos.map(todo => todo.id);
        saveTodoOrder(project.project, todoIds);
      }
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
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="todos-list">
                      <SortableContext
                        items={projectData.todos.map(todo => todo.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {projectData.todos.map((todo) => (
                          <SortableTodoItem key={todo.id} todo={todo} />
                        ))}
                      </SortableContext>
                    </div>
                  </DndContext>
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
