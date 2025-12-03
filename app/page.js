'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import ProjectForm from '@/components/ProjectForm';
import HoleForm from '@/components/HoleForm';
import HolesList from '@/components/HolesList';
import Calculations from '@/components/Calculations';
import BreakdownTable from '@/components/BreakdownTable';
import HoleSummaryTable from '@/components/HoleSummaryTable';
import Toast from '@/components/Toast';
import ConfirmModal from '@/components/ConfirmModal';
import {
  calculateTotals,
  getBreakdownByThickness,
  getHoleDisplaySize,
  getHoleArea,
  SHEET_SIZE,
} from '@/lib/calculations';

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [project, setProject] = useState({
    customerName: '',
    jobNumber: '',
    jobName: '',
    holes: [],
  });
  const [projectId, setProjectId] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showResetModal, setShowResetModal] = useState(false);

  // Load project on page load
  useEffect(() => {
    const loadProject = async () => {
      try {
        // Check if we're opening a specific project from dashboard
        const projectParam = searchParams?.get('project');
        
        if (projectParam) {
          // Load specific project from URL parameter
          try {
            const response = await fetch(`/api/projects/${projectParam}`);
            if (response.ok) {
              const loadedProject = await response.json();
              setProject({
                customerName: loadedProject.customerName || '',
                jobNumber: loadedProject.jobNumber || '',
                jobName: loadedProject.jobName || '',
                holes: loadedProject.holes || [],
              });
              setProjectId(loadedProject._id);
              localStorage.setItem('currentProjectId', loadedProject._id);
              localStorage.setItem('currentProject', JSON.stringify({
                customerName: loadedProject.customerName || '',
                jobNumber: loadedProject.jobNumber || '',
                jobName: loadedProject.jobName || '',
                holes: loadedProject.holes || [],
              }));
              setIsLoading(false);
              return;
            }
          } catch (error) {
            console.error('Error loading project from URL:', error);
            showToast('Project not found', 'error');
          }
        }
        
        // Try to load from localStorage first (for unsaved changes)
        const savedProjectId = localStorage.getItem('currentProjectId');
        const savedProject = localStorage.getItem('currentProject');
        
        if (savedProjectId && savedProject) {
          try {
            // Try to load from MongoDB
            const response = await fetch(`/api/projects/${savedProjectId}`);
            if (response.ok) {
              const loadedProject = await response.json();
              setProject({
                customerName: loadedProject.customerName || '',
                jobNumber: loadedProject.jobNumber || '',
                jobName: loadedProject.jobName || '',
                holes: loadedProject.holes || [],
              });
              setProjectId(loadedProject._id);
              setIsLoading(false);
              return;
            } else {
              // Project was deleted, clear localStorage
              localStorage.removeItem('currentProjectId');
              localStorage.removeItem('currentProject');
            }
          } catch (error) {
            console.log('Could not load from MongoDB, clearing localStorage');
            localStorage.removeItem('currentProjectId');
            localStorage.removeItem('currentProject');
          }
        }
        
        // Only auto-load most recent project if we don't have a saved projectId
        // This prevents reloading after a reset
        if (!savedProjectId && !projectParam) {
          const response = await fetch('/api/projects');
          if (response.ok) {
            const projects = await response.json();
            if (projects.length > 0) {
              const mostRecent = projects[0]; // Already sorted by updatedAt desc
              setProject({
                customerName: mostRecent.customerName || '',
                jobNumber: mostRecent.jobNumber || '',
                jobName: mostRecent.jobName || '',
                holes: mostRecent.holes || [],
              });
              setProjectId(mostRecent._id);
              localStorage.setItem('currentProjectId', mostRecent._id);
            }
          }
        }
      } catch (error) {
        console.error('Error loading project:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [searchParams]);

  // Save projectId to localStorage whenever it changes
  useEffect(() => {
    if (projectId) {
      localStorage.setItem('currentProjectId', projectId);
    }
  }, [projectId]);

  // Save project to localStorage for persistence (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('currentProject', JSON.stringify(project));
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [project]);

  const showToast = (message, type = 'info', title = '') => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts((prev) => [...prev, { id, message, type, title }]);
  };

  const addHole = async (holeData) => {
    const newHole = {
      id: Date.now(),
      ...holeData,
      quantity: 1,
    };
    const updatedHoles = [...project.holes, newHole];
    await updateProject({ holes: updatedHoles });
    showToast('Hole added successfully', 'success');
  };

  const updateHoleQuantity = async (holeId, change) => {
    const updatedHoles = project.holes.map((hole) =>
      hole.id === holeId
        ? { ...hole, quantity: Math.max(1, hole.quantity + change) }
        : hole
    );
    await updateProject({ holes: updatedHoles });
  };

  const removeHole = async (holeId) => {
    const updatedHoles = project.holes.filter((hole) => hole.id !== holeId);
    await updateProject({ holes: updatedHoles });
  };

  const updateProject = async (updates) => {
    const updated = { ...project, ...updates };
    setProject(updated);

    if (projectId) {
      try {
        await fetch(`/api/projects/${projectId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        });
      } catch (error) {
        showToast('Failed to save project', 'error');
      }
    }
  };

  const saveProject = async () => {
    try {
      if (projectId) {
        const response = await fetch(`/api/projects/${projectId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(project),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update project');
        }
        
        showToast('Project updated successfully!', 'success');
      } else {
        console.log('Saving new project:', project);
        const response = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(project),
        });
        
        const responseData = await response.json();
        console.log('Save response status:', response.status);
        console.log('Save response data:', responseData);
        
        if (!response.ok) {
          throw new Error(responseData.error || 'Failed to save project');
        }
        
        if (responseData._id) {
          setProjectId(responseData._id);
          localStorage.setItem('currentProjectId', responseData._id);
          localStorage.setItem('currentProject', JSON.stringify(project));
          showToast('Project saved successfully!', 'success');
          // Optionally redirect to dashboard after saving
          // router.push('/dashboard');
        } else {
          throw new Error('No project ID returned from server');
        }
      }
    } catch (error) {
      console.error('Save error:', error);
      showToast(error.message || 'Failed to save project. Check MongoDB connection.', 'error');
    }
  };

  const resetAll = () => {
    setShowResetModal(true);
  };

  const handleResetConfirm = () => {
    // Clear local state only - data remains saved in MongoDB
    setProject({
      customerName: '',
      jobNumber: '',
      jobName: '',
      holes: [],
    });
    setProjectId(null);
    
    // Clear localStorage so it doesn't reload on refresh
    localStorage.removeItem('currentProjectId');
    localStorage.removeItem('currentProject');
    
    showToast('Form cleared. Data remains saved in database.', 'info');
  };

  const downloadPDF = () => {
    if (project.holes.length === 0) {
      showToast('Please add holes before generating a PDF', 'warning');
      return;
    }

    showToast('Opening PDF preview...', 'info');
    
    // Create a new window with PDF content
    const printWindow = window.open('', '_blank');
    
    const totals = calculateTotals(project.holes);
    const breakdown = getBreakdownByThickness(project.holes);
    
    const breakdownRows = Object.keys(breakdown)
      .sort((a, b) => a - b)
      .map(
        (thickness) =>
          `<tr><td>${thickness}"</td><td class="text-right">${breakdown[thickness].area.toFixed(2)}</td><td class="text-right">${breakdown[thickness].sheets}</td></tr>`
      )
      .join('');

    const holeRows = project.holes
      .map(
        (hole) =>
          `<tr><td><span class="badge badge-${hole.type}">${hole.type.toUpperCase()}</span></td><td>${getHoleDisplaySize(hole)}</td><td>${hole.thickness}"</td><td class="text-right">${hole.quantity}</td><td class="text-right">${(getHoleArea(hole) / hole.quantity).toFixed(2)} sq in</td><td class="text-right">${getHoleArea(hole).toFixed(2)} sq in</td></tr>`
      )
      .join('');

    const customerInfo =
      project.customerName || project.jobNumber || project.jobName
        ? `<div class="customer-info">${
            project.customerName
              ? `<p><strong>Customer:</strong> ${project.customerName}</p>`
              : ''
          }${
            project.jobNumber
              ? `<p><strong>Job Number:</strong> ${project.jobNumber}</p>`
              : ''
          }${
            project.jobName
              ? `<p><strong>Job Name:</strong> ${project.jobName}</p>`
              : ''
          }</div>`
        : '';

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Foam Sheet Tracker Report</title><style>
body { font-family: Arial, sans-serif; max-width: 800px; margin: 20px auto; padding: 20px; font-size: 12px; }
p { font-size: 12px; margin: 8px 0; }
.pdf-header { display: flex; align-items: center; gap: 15px; margin-bottom: 15px; border-bottom: 3px solid #2563eb; padding-bottom: 10px; }
.pdf-header img { height: 60px; }
.pdf-header-text h1 { color: #1a1a1a; font-size: 20px; margin: 0 0 4px 0; }
.pdf-header-text p { font-size: 11px; margin: 0; color: #666; }
h2 { color: #1a1a1a; margin-top: 20px; margin-bottom: 10px; border-bottom: 2px solid #e0e0e0; padding-bottom: 6px; font-size: 15px; }
h2.breakdown-title { color: #1d4ed8; font-size: 18px; font-weight: 700; margin-top: 25px; margin-bottom: 15px; border-bottom: 3px solid #2563eb; padding-bottom: 8px; }
.customer-info { margin: 15px 0; padding: 12px; background: #f9f9f9; border-radius: 6px; font-size: 12px; }
.customer-info p { margin: 4px 0; }
.summary-box { background: #f0f7ff; border: 2px solid #2563eb; border-radius: 8px; padding: 12px; margin: 12px 0; font-size: 11px; }
.summary-row { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #d0d0d0; font-size: 11px; }
.summary-row:last-child { border-bottom: none; }
.summary-row.highlight { background: #fef3c7; padding: 8px; margin-top: 6px; font-weight: bold; font-size: 14px; }
.breakdown-box { background: #fef3c7; border: 3px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.breakdown-box table { margin: 0; }
table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 11px; }
th { background-color: #f9f9f9; padding: 6px 8px; text-align: left; border-bottom: 2px solid #2563eb; font-weight: 600; font-size: 11px; }
.breakdown-box th { background-color: #fef3c7; border-bottom: 3px solid #f59e0b; font-weight: 700; font-size: 12px; padding: 10px 8px; }
td { padding: 5px 8px; border-bottom: 1px solid #e0e0e0; font-size: 11px; }
.breakdown-box td { padding: 10px 8px; font-size: 12px; font-weight: 500; border-bottom: 1px solid #fbbf24; }
.breakdown-box tr:last-child td { border-bottom: none; }
.text-right { text-align: right; }
.badge { display: inline-block; padding: 2px 5px; border-radius: 3px; font-size: 9px; font-weight: 500; }
.badge-round { background-color: #dbeafe; color: #1e40af; }
.badge-skewed { background-color: #fed7aa; color: #9a3412; }
.footer { margin-top: 25px; padding-top: 12px; border-top: 1px solid #d0d0d0; text-align: center; color: #666; font-size: 10px; }
.footer p { font-size: 10px; }
@media print { body { margin: 0; padding: 12px; font-size: 11px; } .no-print { display: none; } }
</style></head><body>
<div class="pdf-header">
<div class="pdf-header-text">
<h1>Foam Sheet Tracker Report</h1>
<p>Generated: ${new Date().toLocaleString()}</p>
</div>
</div>
${customerInfo}
<h2>Summary</h2><div class="summary-box">
<div class="summary-row"><span>Sheet Size:</span><span><strong>${SHEET_SIZE.width}' × ${SHEET_SIZE.height}' (${totals.sheetAreaSqFt} sq ft)</strong></span></div>
<div class="summary-row"><span>Total Hole Area:</span><span><strong>${totals.totalHoleArea.toFixed(2)} sq ft</strong></span></div>
<div class="summary-row"><span>Waste Factor (10%):</span><span><strong>${totals.wasteArea.toFixed(2)} sq ft</strong></span></div>
<div class="summary-row"><span>Total Area Needed:</span><span><strong>${totals.totalAreaNeeded.toFixed(2)} sq ft</strong></span></div>
<div class="summary-row highlight"><span>SHEETS REQUIRED:</span><span>${totals.sheetsRequired}</span></div>
</div>
<h2 class="breakdown-title">📊 Breakdown by Thickness</h2>
<div class="breakdown-box">
<table><thead><tr><th>Thickness</th><th class="text-right">Area (sq ft)</th><th class="text-right">Sheets</th></tr></thead><tbody>${breakdownRows}</tbody></table>
</div>
<h2>Hole Details</h2><table><thead><tr><th>Type</th><th>Diameter</th><th>Thickness</th><th class="text-right">Quantity</th><th class="text-right">Area per Hole</th><th class="text-right">Total Area</th></tr></thead><tbody>${holeRows}</tbody></table>
<div class="footer"><p>Foam Sheet Tracker - Lindsay Precast</p></div>
<div class="no-print" style="margin-top: 30px; text-align: center;">
<button onclick="window.print()" style="padding: 12px 24px; background: #2563eb; color: white; border: none; border-radius: 6px; font-size: 14px; cursor: pointer; margin-right: 10px;">Print / Save as PDF</button>
<button onclick="window.close()" style="padding: 12px 24px; background: #6b7280; color: white; border: none; border-radius: 6px; font-size: 14px; cursor: pointer;">Close</button>
</div></body></html>`;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  if (isLoading) {
    return (
      <div className="container">
        <Toast toasts={toasts} setToasts={setToasts} />
        <Header />
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Toast toasts={toasts} setToasts={setToasts} />
      <ConfirmModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleResetConfirm}
        title="Clear Form?"
        message="This will clear all fields in the form. Your saved data will remain in the database and can be reloaded later."
        confirmText="Yes, Clear Form"
        cancelText="Cancel"
        type="warning"
      />
      <Header />
      <div className="main-grid">
        <div className="card">
          <ProjectForm project={project} onUpdate={updateProject} />
          <div className="divider"></div>
          <HoleForm onAdd={addHole} />
          <div className="divider"></div>
          <HolesList
            holes={project.holes}
            onUpdateQuantity={updateHoleQuantity}
            onRemove={removeHole}
          />
        </div>
        <div>
          <Calculations holes={project.holes} />
          <BreakdownTable holes={project.holes} />
          <HoleSummaryTable holes={project.holes} />
        </div>
      </div>
      <div className="card">
        <h2>Export & Actions</h2>
        <div className="footer-actions">
          <button
            type="button"
            className="btn-primary btn-large"
            onClick={downloadPDF}
          >
            📥 Download PDF
          </button>
          <button
            type="button"
            className="btn-secondary btn-large"
            onClick={resetAll}
          >
            🔄 Clear Form
          </button>
          <button
            type="button"
            className="btn-secondary btn-large"
            onClick={saveProject}
          >
            💾 Save Project
          </button>
          <Link
            href="/dashboard"
            className="btn-secondary btn-large"
            style={{ textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            📊 View Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="container">
        <Header />
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading...</p>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}

