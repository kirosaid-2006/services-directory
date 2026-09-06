import React from 'react';
import * as Icons from 'lucide-react';

const DynamicIcon = ({ name, className = 'w-6 h-6', ...props }) => {
  // Normalize name if needed or fallback to Wrench
  const IconComponent = Icons[name] || Icons.Wrench;
  return <IconComponent className={className} {...props} />;
};

export default DynamicIcon;
