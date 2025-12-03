'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Toast from '@/components/Toast';
import ConfirmModal from '@/components/ConfirmModal';

export default function Dashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, project: null });

  const showToast = (message, type = 'info', title = '') => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts((prev) => [...prev, { id, message, type, title }]);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else {
        showToast('Failed to load projects', 'error');
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      showToast('Error loading projects', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenProject = (projectId) => {
    router.push(`/project?project=${projectId}`);
  };

  const handleDeleteProject = async () => {
    if (!deleteModal.project) return;

    try {
      const response = await fetch(`/api/projects/${deleteModal.project._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showToast('Project deleted successfully', 'success');
        setDeleteModal({ isOpen: false, project: null });
        loadProjects(); // Reload the list
      } else {
        showToast('Failed to delete project', 'error');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      showToast('Error deleting project', 'error');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container">
      <Toast toasts={toasts} setToasts={setToasts} />
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, project: null })}
        onConfirm={handleDeleteProject}
        title="Delete Project?"
        message={`Are you sure you want to delete "${deleteModal.project?.jobName || deleteModal.project?.jobNumber || 'this project'}"? This action cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        type="danger"
      />
      <Header />
      
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ margin: 0 }}>Projects Dashboard</h1>
          <Link href="/project?new=true" className="btn-small btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
            ✏️ New Project
          </Link>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <p>No projects saved yet.</p>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => (
              <div key={project._id} className="project-card">
                <div className="project-card-header">
                  <h3 className="project-card-title">
                    {project.jobName || 'Untitled Project'}
                  </h3>
                  <div className="project-card-actions">
                    <button
                      className="btn-small btn-primary"
                      onClick={() => handleOpenProject(project._id)}
                      style={{ marginRight: '8px' }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn-small btn-danger"
                      onClick={() => setDeleteModal({ isOpen: true, project })}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
                <div className="project-card-body">
                  {project.customerName && (
                    <div className="project-card-info">
                      <strong>Customer:</strong> {project.customerName}
                    </div>
                  )}
                  {project.jobNumber && (
                    <div className="project-card-info">
                      <strong>Job #:</strong> {project.jobNumber}
                    </div>
                  )}
                  <div className="project-card-info">
                    <strong>Holes:</strong> {project.holes?.length || 0}
                  </div>
                  <div className="project-card-info">
                    <strong>Last Updated:</strong> {formatDate(project.updatedAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

