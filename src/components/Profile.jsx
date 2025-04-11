import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Briefcase, LogOut, User as UserIcon, Loader2 } from 'lucide-react';

const Profile = ({ trigger, open, onOpenChange }) => {
  const [userData, setUserData] = useState(null);
  const [jobStats, setJobStats] = useState({
    applied: 0,
    interview: 0,
    rejected: 0,
    offer: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    const token = localStorage.getItem('token');
    console.log('Token:', token ? 'Present' : 'Missing'); // Debug log
    
    if (!token) {
      setError('No authentication token found. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching user data and stats...'); // Debug log
      
      const userResponse = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('User data received:', userResponse.data); // Debug log
      
      const statsResponse = await axios.get('http://localhost:5000/api/jobs/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Stats data received:', statsResponse.data); // Debug log

      setUserData(userResponse.data);
      setJobStats(statsResponse.data);
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setError(error.response?.data?.message || 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  // Debug log for render
  console.log('Render state:', { loading, error, userData, jobStats });

  return (
    <DropdownMenu.Root open={open} onOpenChange={onOpenChange}>
      <DropdownMenu.Trigger asChild>
        {trigger}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="w-64 bg-card border border-border rounded-lg shadow-lg mt-2 p-4 animate-in fade-in-0 zoom-in-95"
          align="end"
          sideOffset={5}
        >
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-sm text-destructive text-center py-4">
              {error}
            </div>
          ) : !userData ? (
            <div className="text-sm text-muted-foreground text-center py-4">
              No user data available
            </div>
          ) : (
            <div className="space-y-4">
              {/* User Info */}
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{userData.name || 'N/A'}</h3>
                  <p className="text-xs text-muted-foreground">{userData.email || 'N/A'}</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-background rounded-md p-2">
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-medium">Applied</span>
                  </div>
                  <p className="text-lg font-semibold mt-0.5">{jobStats.applied}</p>
                </div>

                <div className="bg-background rounded-md p-2">
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-medium">Interviews</span>
                  </div>
                  <p className="text-lg font-semibold mt-0.5">{jobStats.interview}</p>
                </div>

                <div className="bg-background rounded-md p-2">
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-destructive" />
                    <span className="text-xs font-medium">Rejected</span>
                  </div>
                  <p className="text-lg font-semibold mt-0.5">{jobStats.rejected}</p>
                </div>

                <div className="bg-background rounded-md p-2">
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-green-500" />
                    <span className="text-xs font-medium">Offers</span>
                  </div>
                  <p className="text-lg font-semibold mt-0.5">{jobStats.offer}</p>
                </div>
              </div>

              {/* Sign Out Button */}
              <button
                className="w-full flex items-center justify-center gap-2 p-2 text-sm text-destructive rounded-md hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => {
                  localStorage.removeItem('token');
                  window.location.href = '/login';
                }}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default Profile; 