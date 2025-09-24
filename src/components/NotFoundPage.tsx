import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-4">
      <h1 className="text-6xl font-extrabold text-primary">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mt-4">Profile Not Found</h2>
      <p className="text-gray-600 mt-2">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <Link
        to="/"
        className="mt-6 px-6 py-2 text-sm font-semibold text-white bg-primary rounded-md hover:bg-primary-hover transition-colors"
      >
        Go back home
      </Link>
    </div>
  );
};