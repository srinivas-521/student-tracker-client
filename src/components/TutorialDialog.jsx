import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { X } from 'lucide-react';

const TutorialDialog = ({ open, onOpenChange }) => {
  const handleClose = () => {
    localStorage.setItem('hasSeenTutorial', 'true');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Welcome to JobTrackr! 🚀
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="aspect-video">
            <iframe
              src="https://www.youtube.com/embed/KMvAlOnyRB4"
              title="JobTrackr Tutorial"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg"
            />
          </div>
          <p className="text-center text-muted-foreground">
            Watch this quick guide to get started with JobTrackr and make the most of your job search journey.
          </p>
          <div className="flex justify-center space-x-2">
            <Button onClick={handleClose} variant="outline">
              <X className="mr-2 h-4 w-4" />
              Close Guide
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TutorialDialog; 