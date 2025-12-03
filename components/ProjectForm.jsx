'use client';

export default function ProjectForm({ project, onUpdate }) {
  const handleChange = (field, value) => {
    onUpdate({ [field]: value });
  };

  return (
    <>
      <h2>Project Information</h2>
      <div className="form-row">
        <div className="form-group">
          <label>Customer Name</label>
          <input
            type="text"
            value={project.customerName || ''}
            onChange={(e) => handleChange('customerName', e.target.value)}
            placeholder="Enter customer name"
          />
        </div>
        <div className="form-group">
          <label>Job Number</label>
          <input
            type="text"
            value={project.jobNumber || ''}
            onChange={(e) => handleChange('jobNumber', e.target.value)}
            placeholder="Enter job number"
          />
        </div>
      </div>
      <div className="form-group">
        <label>Job Name</label>
        <input
          type="text"
          value={project.jobName || ''}
          onChange={(e) => handleChange('jobName', e.target.value)}
          placeholder="Enter job name"
        />
      </div>
    </>
  );
}

