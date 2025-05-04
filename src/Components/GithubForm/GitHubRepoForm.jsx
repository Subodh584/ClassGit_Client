import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { EnhancedAnimation } from "../Animations";
import { Toaster, toast } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Github, Key, Loader2, ArrowLeft, User, FolderGit2 } from "lucide-react";
import { motion } from "framer-motion";

const GitHubRepoForm = () => {
  const location = useLocation();
  const {assId} = location.state;
  const [username, setUsername] = useState("");
  const [repository, setRepository] = useState("");
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const hasShownToast = useRef(false);
  
  useEffect(() => {
    if (!hasShownToast.current) {
      toast("Repository is not linked from GitHub!", {
        icon: '⚠️',
        duration: 4000,
      });
      hasShownToast.current = true;
    }
  }, []);



  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise(resolve=>setTimeout(resolve,1500));
    const response = await axios.post("http://localhost:3000/checkUserAndRepo",{
      "username":username,
      "repository":repository,
      "token":token,
      "assId":assId,
      "userEmail":localStorage.getItem("Email")
    });
    console.log(response.data);

    if(response.data === "Repository linked successfully!"){
      toast.success("Repository linked successfully!");
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate("/student-dashboard");
    }else{
      toast.error(response.data);
    }
    setIsLoading(false);
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-b from-[#0a0a23] to-[#1a1a3a] overflow-hidden flex items-center justify-center">
      <Toaster 
        position="top-center" 
        reverseOrder={false}
        toastOptions={{
          className: 'backdrop-blur-sm bg-opacity-90',
          style: {
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '16px',
            color: '#fff',
            background: 'rgba(0,0,0,0.75)',
          },
        }}
      />
      
      {/* Fullscreen background animation */}
      <div className="absolute inset-0 z-0">
        <EnhancedAnimation />
      </div>

      {/* Foreground content */}
      <motion.div 
        className="relative w-full max-w-md mx-auto space-y-8 z-10 px-6 py-8 bg-opacity-10 bg-black backdrop-blur-lg rounded-2xl border border-white/10 shadow-xl"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Back Button */}
        <motion.button
          onClick={() => navigate("/student-dashboard")}
          className="flex items-center text-white hover:text-blue-300 transition-all duration-300 mb-2 group"
          variants={itemVariants}
          whilehover={{ x: -5 }}
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:animate-pulse" />
          <span>Back to Dashboard</span>
        </motion.button>

        <motion.div className="text-center space-y-4" variants={itemVariants}>
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              duration: 0.7 
            }}
          >
            <Github className="w-16 h-16 mx-auto text-white opacity-90" />
          </motion.div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Link GitHub Repository</h2>
          <p className="text-gray-300 max-w-sm mx-auto">
            Connect your GitHub repository to download and analyze your codebase for this assignment
          </p>
        </motion.div>

        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-5 mt-8"
          variants={containerVariants}
        >
          <motion.div className="space-y-2" variants={itemVariants}>
            <label htmlFor="username" className="text-sm font-medium text-white flex items-center">
              <User className="h-4 w-4 mr-2 text-blue-400" />
              GitHub Username
            </label>
            <Input
              id="username"
              placeholder="e.g., octocat"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="bg-white/5 border-white/20 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
          </motion.div>

          <motion.div className="space-y-2" variants={itemVariants}>
            <label htmlFor="repository" className="text-sm font-medium text-white flex items-center">
              <FolderGit2 className="h-4 w-4 mr-2 text-blue-400" />
              Repository Name
            </label>
            <Input
              id="repository"
              placeholder="e.g., hello-world"
              value={repository}
              onChange={(e) => setRepository(e.target.value)}
              required
              className="bg-white/5 border-white/20 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
          </motion.div>

          <motion.div className="space-y-2" variants={itemVariants}>
            <div className="flex items-center justify-between">
              <label htmlFor="token" className="text-sm font-medium text-white flex items-center">
                <Key className="h-4 w-4 mr-2 text-blue-400" />
                Personal Access Token
              </label>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white hover:bg-white/10 hover:text-blue-300 transition-colors">
                    <Key className="h-4 w-4" />
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 text-sm bg-gray-900 border border-gray-700 text-white shadow-xl" align="end">
                  <div className="space-y-2">
                    <h4 className="font-medium text-blue-400">How to get a Personal Access Token:</h4>
                    <ol className="list-decimal pl-4 space-y-1 text-gray-300">
                      <li>Go to GitHub.com → Settings → Developer settings</li>
                      <li>Click on "Personal access tokens" → "Tokens (classic)"</li>
                      <li>Generate new token (classic)</li>
                      <li>Select the "repo" scope</li>
                      <li>Generate and copy your token</li>
                    </ol>
                    <p className="text-xs text-gray-400 mt-2">
                      Only needed for private repositories or large codebases
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
            <Input
              id="token"
              type="password"
              placeholder="ghp_xxxxxxxxxxxx"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="bg-white/5 border-white/20 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
            <p className="text-xs text-gray-400">Optional for public repositories</p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-lg transition-all duration-300"
              disabled={isLoading}
              whilehover={{ scale: 1.02 }}
              whiletap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Linking Repository...
                </>
              ) : (
                <>
                  <Github className="mr-2 h-5 w-5" />
                  Link Repository
                </>
              )}
            </Button>
          </motion.div>
        </motion.form>
        
        <motion.div 
          className="text-xs text-center text-gray-400 mt-6"
          variants={itemVariants}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Secure connection • Your credentials are never stored
        </motion.div>
      </motion.div>
    </div>
  );
};

export default GitHubRepoForm;