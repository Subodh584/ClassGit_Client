
import GitHubRepoForm from './GitHubRepoForm';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
const GForm = () => {
    useEffect(()=>{
    },[])
    useEffect(() => {
      document.body.style.margin = "0";
      document.body.style.padding = "0";
      document.body.style.overflow = "hidden";
    
      return () => {
        document.body.style.overflow = "auto"; // cleanup when you leave this page
      };
    },[]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      
      <GitHubRepoForm />
    </div>
  );
};

export default GForm;
