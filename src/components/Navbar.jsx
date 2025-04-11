import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { User } from 'lucide-react';
import Profile from './Profile';

const Navbar = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // This would come from your auth context/state
  const user = {
    name: "John Doe",
    applications: {
      applied: 12,
      interview: 5
    }
  };

  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            JobTrackr
          </Link>
          
          <div className="flex items-center space-x-4">
            {!isLandingPage && (
              <Profile
                trigger={
                  <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-accent">
                    <User className="h-6 w-6" />
                  </button>
                }
                open={isProfileOpen}
                onOpenChange={setIsProfileOpen}
              />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 