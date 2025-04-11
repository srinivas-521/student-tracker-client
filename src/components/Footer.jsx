import React from 'react';
import { Linkedin, Instagram, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-blue-50 to-white border-t border-border py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-4">
          {/* Social Links */}
          <div className="flex items-center space-x-6">
            <a
              href="https://www.linkedin.com/in/srinivas-v-723094244/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            
            <a
              href="https://www.instagram.com/srinivas__521?igsh=NWE5eWZ1NnNwajQz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Instagram Profile"
            >
              <Instagram className="h-5 w-5" />
            </a>
            
            <a
              href="mailto:srinivassenu3843@gmail.com"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} JobTrackr. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 