import React from 'react';

const JobCard = ({ job, onAssign }) => (
  <div>
    <h3>{job.title}</h3>
    <p>{job.description}</p>
    <p>Budget: ${job.budget}</p>
    <button onClick={() => onAssign(job.id)}>Assign to Me</button>
  </div>
);

export default JobCard;