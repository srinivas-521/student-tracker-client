import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import JobCard from '../components/JobCard';
import Calendar from '../components/Calendar';
import { format, isSameDay } from 'date-fns';
import { Plus, Calendar as CalendarIcon, Briefcase, PlayCircle, X } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import TutorialDialog from '../components/TutorialDialog';

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    status: 'Applied',
    notes: '',
    applicationDate: new Date().toISOString().split('T')[0],
  });
  const [formError, setFormError] = useState('');
  const [selectedJobId, setSelectedJobId] = useState(null);
  const jobRefs = useRef({});
  const navigate = useNavigate();
  const [selectedJobDetails, setSelectedJobDetails] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  // Configure axios with token
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  useEffect(() => {
    fetchUserData();
    fetchJobs();

    // Check if user has seen the tutorial before
    const seenTutorial = localStorage.getItem('hasSeenTutorial');
    const isFirstTimeUser = localStorage.getItem('isFirstTimeUser');

    if (!seenTutorial && isFirstTimeUser === 'true') {
      // Show tutorial after 5 seconds for first-time users
      const timer = setTimeout(() => {
        console.log('Showing tutorial for first-time user');
        setIsTutorialOpen(true);
        localStorage.setItem('hasSeenTutorial', 'true');
        localStorage.removeItem('isFirstTimeUser'); // Clear the first-time flag
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchJobs = async () => {
    try {
      console.log('Fetching jobs...');
      const response = await api.get('/jobs');
      console.log('Jobs fetched:', response.data);
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(''); // Clear any previous errors
    
    try {
      // Validate required fields
      if (!formData.company || !formData.position) {
        setFormError('Company and position are required');
        return;
      }

      // Format the date properly
      const jobData = {
        ...formData,
        company: formData.company.trim(),
        position: formData.position.trim(),
        notes: formData.notes.trim(),
        applicationDate: new Date(formData.applicationDate).toISOString(),
        status: formData.status || 'Applied'
      };

      console.log('Sending job data:', jobData); // Debug log

      if (currentJob) {
        const response = await api.put(`/jobs/${currentJob._id}`, jobData);
        console.log('Update response:', response.data); // Debug log
      } else {
        const response = await api.post('/jobs', jobData);
        console.log('Create response:', response.data); // Debug log
      }
      
      setIsDialogOpen(false);
      setCurrentJob(null);
      setFormData({
        company: '',
        position: '',
        status: 'Applied',
        notes: '',
        applicationDate: new Date().toISOString().split('T')[0],
      });
      fetchJobs();
    } catch (error) {
      console.error('Error saving job:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save job. Please try again.';
      const errorDetails = error.response?.data?.errors;
      
      if (errorDetails && Array.isArray(errorDetails)) {
        setFormError(`${errorMessage}: ${errorDetails.join(', ')}`);
      } else {
        setFormError(errorMessage);
      }
    }
  };

  const handleEdit = async (job) => {
    try {
      console.log('Editing job:', job);
      setCurrentJob(job);
      setFormData({
        company: job.company,
        position: job.position,
        status: job.status,
        notes: job.notes || '',
        applicationDate: new Date(job.applicationDate).toISOString().split('T')[0],
      });
      setIsDialogOpen(true);
    } catch (error) {
      console.error('Error preparing job edit:', error);
      alert('Failed to prepare job edit. Please try again.');
    }
  };

  const handleDelete = async (jobId) => {
    try {
      console.log('Attempting to delete job:', jobId);
      
      if (!jobId) {
        console.error('No job ID provided for deletion');
        alert('Cannot delete job: Invalid job ID');
        return;
      }

      const response = await api.delete(`/jobs/${jobId}`);
      console.log('Delete response:', response.data);
      
      // Update the jobs list after successful deletion
      setJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
      
      // If we're in calendar view and this was the last job for the selected date, clear the date
      if (selectedDate) {
        const remainingJobsForDate = jobs
          .filter(job => job._id !== jobId)
          .some(job => isSameDay(new Date(job.applicationDate), selectedDate));
        
        if (!remainingJobsForDate) {
          setSelectedDate(null);
        }
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete job. Please try again.';
      alert(errorMessage);
    }
  };

  const handleDateSelect = (date, jobId) => {
    setSelectedDate(date);
    setSelectedJobId(jobId);
    setShowCalendar(false);
    
    // Scroll to the selected job card with smooth animation
    if (jobId && jobRefs.current[jobId]) {
      jobRefs.current[jobId].scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });

      // Add highlight effect
      jobRefs.current[jobId].classList.add('ring-2', 'ring-primary', 'ring-offset-2');
      
      // Remove highlight after 2 seconds
      setTimeout(() => {
        if (jobRefs.current[jobId]) {
          jobRefs.current[jobId].classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
        }
      }, 2000);
    }
  };

  const clearDateFilter = () => {
    setSelectedDate(null);
    setSelectedJobId(null);
  };

  const handleCalendarClick = () => {
    setShowCalendar(!showCalendar);
    setSelectedDate(null); // Reset selected date when toggling views
  };

  const handleJobApplicationsClick = () => {
    setShowCalendar(false);
    clearDateFilter(); // Clear any date filters when switching to job applications view
  };

  const handleJobClick = (job) => {
    setSelectedJobDetails(job);
    setIsDetailsOpen(true);
  };

  // Filter jobs based on status and selected date
  const filteredJobs = jobs.filter(job => {
    const matchesStatus = filter === 'all' || job.status.toLowerCase() === filter.toLowerCase();
    const matchesDate = !selectedDate || isSameDay(new Date(job.applicationDate), selectedDate);
    return matchesStatus && matchesDate;
  });

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar Navigation */}
      <div className="w-64 border-r border-border bg-card p-4">
        <nav className="space-y-2">
          <button
            onClick={handleJobApplicationsClick}
            className={`flex items-center space-x-2 px-3 py-2 w-full text-left rounded-lg ${
              !showCalendar ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <Briefcase className="h-5 w-5" />
            <span>Job Applications</span>
          </button>
          <button
            onClick={handleCalendarClick}
            className={`flex items-center space-x-2 px-3 py-2 w-full text-left rounded-lg ${
              showCalendar ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <CalendarIcon className="h-5 w-5" />
            <span>Calendar</span>
          </button>
          
          {/* Guide Button */}
          <button
            onClick={() => setIsTutorialOpen(true)}
            className="flex items-center space-x-2 px-3 py-2 w-full text-left rounded-lg hover:bg-accent hover:text-accent-foreground mt-4"
          >
            <PlayCircle className="h-5 w-5 text-primary" />
            <span>Your Guide</span>
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-auto pb-24">
        <div className="min-h-[calc(100vh-8rem)] rounded-xl border border-border bg-card flex flex-col">
          {/* Header Section */}
          <div className="flex items-center justify-between border-b border-border p-4">
            <div className="flex items-center space-x-4">
              {!showCalendar && (
                <>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <button className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-background hover:bg-accent hover:text-accent-foreground">
                        {filter === 'all' ? 'All Status' : filter}
                        <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                      <DropdownMenu.Content className="min-w-[8rem] rounded-md border bg-popover p-1 shadow-md">
                        <DropdownMenu.Item 
                          className="px-2 py-1.5 text-sm outline-none cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-sm"
                          onClick={() => setFilter('all')}
                        >
                          All Status
                        </DropdownMenu.Item>
                        <DropdownMenu.Item 
                          className="px-2 py-1.5 text-sm outline-none cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-sm"
                          onClick={() => setFilter('Applied')}
                        >
                          Applied
                        </DropdownMenu.Item>
                        <DropdownMenu.Item 
                          className="px-2 py-1.5 text-sm outline-none cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-sm"
                          onClick={() => setFilter('Interview')}
                        >
                          Interview
                        </DropdownMenu.Item>
                        <DropdownMenu.Item 
                          className="px-2 py-1.5 text-sm outline-none cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-sm"
                          onClick={() => setFilter('Rejected')}
                        >
                          Rejected
                        </DropdownMenu.Item>
                        <DropdownMenu.Item 
                          className="px-2 py-1.5 text-sm outline-none cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-sm"
                          onClick={() => setFilter('Offer')}
                        >
                          Offer
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                  
                  {selectedDate && (
                    <button
                      onClick={clearDateFilter}
                      className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-background hover:bg-accent hover:text-accent-foreground"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear Date Filter
                    </button>
                  )}
                </>
              )}
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="inline-flex items-center">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Job
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{currentJob ? 'Edit Job' : 'Add New Job'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {formError && (
                    <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                      {formError}
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Company</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Position</label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="Applied">Applied</option>
                      <option value="Interview">Interview</option>
                      <option value="Offer">Offer</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Application Date</label>
                    <input
                      type="date"
                      value={formData.applicationDate}
                      onChange={(e) => setFormData({ ...formData, applicationDate: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Notes</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px]"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {currentJob ? 'Update' : 'Add'} Job
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 overflow-auto">
            {!showCalendar ? (
              <>
                {jobs.length === 0 ? (
                  <div className="col-span-full flex flex-col items-center justify-center h-[400px] text-center max-w-lg mx-auto">
                    <h2 className="text-3xl font-bold mb-4">
                      Welcome{userData ? `, ${userData.name.split(' ')[0]}` : ''}! 🚀
                    </h2>
                    <p className="text-xl text-muted-foreground mb-6">
                      Ready to take control of your job search journey?
                    </p>
                    <div className="space-y-4 text-center">
                      <p className="text-muted-foreground">
                        Track your applications, manage interviews, and land your dream job - all in one place.
                      </p>
                      <Button onClick={() => setIsDialogOpen(true)} className="inline-flex items-center">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Your First Application
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {jobs
                      .filter(job => filter === 'all' || job.status === filter)
                      .map(job => (
                        <div
                          key={job._id}
                          id={`job-${job._id}`}
                          ref={el => jobRefs.current[job._id] = el}
                          className="bg-card text-card-foreground rounded-lg shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] transition-all duration-300 h-[300px] w-full overflow-hidden cursor-pointer hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] hover:-translate-y-1"
                          onClick={() => handleJobClick(job)}
                        >
                          <div className="p-6 h-full flex flex-col">
                            {/* Company and Status Header */}
                            <div className="flex justify-between items-start mb-4">
                              <h3 className="text-xl font-semibold text-foreground truncate max-w-[70%]">{job.company}</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
                                job.status === 'Applied' ? 'bg-blue-100 text-blue-800' :
                                job.status === 'Interview' ? 'bg-yellow-100 text-yellow-800' :
                                job.status === 'Offer' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {job.status}
                              </span>
                            </div>

                            {/* Position */}
                            <p className="text-lg text-muted-foreground mb-2">{job.position}</p>

                            {/* Application Date */}
                            <div className="flex items-center text-sm text-muted-foreground mb-6">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>Applied on: {new Date(job.applicationDate).toLocaleDateString()}</span>
                            </div>

                            {/* Notes Section */}
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-muted-foreground mb-2">Notes:</h4>
                              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                                {job.notes || 'No notes added'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </>
            ) : (
              <Calendar
                jobs={jobs}
                onDateSelect={handleDateSelect}
                selectedDate={selectedDate}
                onJobClick={handleJobClick}
              />
            )}
          </div>
        </div>

        {/* Job Details Dialog */}
        {isDetailsOpen && selectedJobDetails && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-card rounded-lg shadow-lg w-full max-w-2xl mx-4">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedJobDetails.company}</h2>
                    <p className="text-lg text-muted-foreground">{selectedJobDetails.position}</p>
                  </div>
                  <button
                    onClick={() => setIsDetailsOpen(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      selectedJobDetails.status === 'Applied' ? 'bg-blue-100 text-blue-800' :
                      selectedJobDetails.status === 'Interview' ? 'bg-yellow-100 text-yellow-800' :
                      selectedJobDetails.status === 'Offer' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedJobDetails.status}
                    </span>
                  </div>
                  
                  <div>
                    <span className="font-medium">Application Date:</span>
                    <p className="text-muted-foreground">
                      {new Date(selectedJobDetails.applicationDate).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div>
                    <span className="font-medium">Notes:</span>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {selectedJobDetails.notes}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-2">
                  <button
                    onClick={() => handleEdit(selectedJobDetails)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(selectedJobDetails._id)}
                    className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Tutorial Dialog */}
      <TutorialDialog open={isTutorialOpen} onOpenChange={setIsTutorialOpen} />
    </div>
  );
};

export default Home; 