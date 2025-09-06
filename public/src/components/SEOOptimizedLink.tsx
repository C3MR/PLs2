import React from 'react';
import { Link } from 'react-router-dom';

interface SEOOptimizedLinkProps {
  to: string;
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  external?: boolean;
  nofollow?: boolean;
  prefetch?: boolean;
  priority?: 'high' | 'medium' | 'low';
}

const SEOOptimizedLink: React.FC<SEOOptimizedLinkProps> = ({
  to,
  children,
  title,
  description,
  className = '',
  external = false,
  nofollow = false,
  prefetch = false,
  priority = 'medium'
}) => {
  const linkProps: any = {
    className,
    title: title || undefined,
    'aria-label': description || title || undefined
  };

  // Add SEO attributes for external links
  if (external) {
    linkProps.target = '_blank';
    linkProps.rel = `noopener${nofollow ? ' nofollow' : ''}`;
  }

  // Add prefetch hint for high priority internal links
  if (!external && priority === 'high' && prefetch) {
    linkProps.rel = 'prefetch';
  }

  // Use appropriate link component
  if (external) {
    return (
      <a href={to} {...linkProps}>
        {children}
      </a>
    );
  }

  return (
    <Link to={to} {...linkProps}>
      {children}
    </Link>
  );
};

export default SEOOptimizedLink;