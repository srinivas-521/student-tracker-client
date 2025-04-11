import React from 'react';
import { Button } from './ui/button';
import { Card, CardHeader, CardContent, CardFooter } from './ui/card';
import { format } from 'date-fns';

const statusColors = {
  Applied: 'bg-blue-100 text-blue-800 border-blue-200',
  Interview: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Offer: 'bg-green-100 text-green-800 border-green-200',
  Rejected: 'bg-red-100 text-red-800 border-red-200',
};

const JobCard = ({ job, onEdit, onDelete }) => {
  const handleEdit = () => {
    try {
      onEdit(job);
    } catch (error) {
      console.error('Error editing job:', error);
      alert('Failed to edit job. Please try again.');
    }
  };

  const handleDelete = () => {
    try {
      if (window.confirm(`Are you sure you want to delete the job application for ${job.position} at ${job.company}?`)) {
        onDelete(job._id);
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job. Please try again.');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{job.company}</h3>
            <p className="text-muted-foreground">{job.position}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[job.status]}`}>
            {job.status}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground">
          Applied on: {format(new Date(job.applicationDate), 'MMM d, yyyy')}
        </p>
        {job.notes && (
          <p className="mt-2 text-sm text-muted-foreground">
            {job.notes}
          </p>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-end space-x-2 pt-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleEdit}
        >
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JobCard; 