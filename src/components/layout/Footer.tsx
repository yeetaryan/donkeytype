import React from 'react';
import { motion } from 'framer-motion';
import { Github, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="fixed bottom-0 left-0 right-0 py-4 bg-background/50 backdrop-blur-sm"
    >
      <div className="container mx-auto px-4 flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">
            Keyboard shortcuts: 
            <kbd className="ml-2 px-1.5 py-0.5 bg-secondary rounded text-xs">Tab</kbd> restart
          </span>
        </div>
        

        <div className="flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.footer>
  );
};
