import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';

const LandingPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Show popup after 10 seconds
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex-1">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Track Your Job Search Journey
            <span className="text-blue-600"> Like a Pro</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Never miss an opportunity again. Organize, track, and manage your job applications all in one place.
            Your dream job is waiting - let's help you land it.
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              size="lg"
              onClick={() => navigate('/signup')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Start Your Journey - It's Free
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/login')}
            >
              Already Tracking? Sign In
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-blue-600 text-4xl mb-4">📅</div>
              <h3 className="text-xl font-semibold mb-2">Smart Calendar View</h3>
              <p className="text-gray-600">Visualize your job applications and never miss an important date.</p>
            </div>
            <div className="text-center p-6">
              <div className="text-blue-600 text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Track Your Progress</h3>
              <p className="text-gray-600">Monitor your application status and improve your success rate.</p>
            </div>
            <div className="text-center p-6">
              <div className="text-blue-600 text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-gray-600">Your job search data is safe with us. Always.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Take Control of Your Job Search?</h2>
          <p className="text-xl mb-8">Join thousands of successful job seekers who found their dream jobs with our help.</p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate('/signup')}
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            Get Started Now - It's Free
          </Button>
        </div>
      </div>

      {/* Popup Dialog */}
      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Ready to Supercharge Your Job Search?
            </DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Join our community of successful job seekers and take control of your career journey.
            </p>
            <div className="flex flex-col space-y-2">
              <Button
                onClick={() => navigate('/signup')}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Create Your Free Account
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/login')}
                className="w-full"
              >
                Already Have an Account? Sign In
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LandingPage; 