import React, { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Bell,
  XCircle,
  Settings,
  Calendar,
  Users,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Clock,
  Home,
  Book,
  MessageSquare,
  ChevronDown,
  User,
  Moon,
  LogOut,
  Search,
  Menu,
  X,
  PlusCircle,
  CheckCircle,
  FileText,
  UserPlus,
  Download,
  Check,
  Edit,
  Filter,
  Plus,
  ArrowRight,
  AlertCircle,
  UserCheck,
} from "lucide-react";
import {
  AllCaughtUpAnimation,
  NoInvitationsAnimation,
  NoTeamsAnimation,
} from "./Animations";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

// Component for sidebar navigation with enhanced hover effects and animations
const SidebarNavItem = ({ icon, text, active, badge, onClick }) => {
  return (
    <motion.a
      href="#"
      className={`flex items-center space-x-3 px-6 py-3.5 rounded-md mx-2 ${
        active
          ? "bg-blue-50 text-blue-700 border-r-4 border-blue-600"
          : "text-gray-700 hover:bg-gray-50"
      }`}
      title={text}
      onClick={onClick}
      whileHover={!active ? { x: 4, backgroundColor: "#f9fafb" } : {}}
      transition={{ duration: 0.2 }}
    >
      <span className={active ? "text-blue-600" : "text-gray-500"}>{icon}</span>
      <span className="font-medium">{text}</span>
      {badge && (
        <motion.span
          className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-2"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 1,
          }}
        >
          {badge}
        </motion.span>
      )}
    </motion.a>
  );
};

// Enhanced tab button with animations
const TabButton = ({ active, onClick, icon, text, badge }) => {
  return (
    <motion.button
      onClick={onClick}
      className={`flex items-center space-x-2 py-2 px-3 relative whitespace-nowrap ${
        active
          ? "text-blue-600 font-medium"
          : "text-gray-600 hover:text-gray-800"
      }`}
      whileHover={!active ? { scale: 1.03 } : {}}
      whileTap={{ scale: 0.97 }}
    >
      <span>{icon}</span>
      <span>{text}</span>
      {badge && (
        <motion.span
          className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 1,
          }}
        >
          {badge}
        </motion.span>
      )}
      {active && (
        <motion.span
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
          layoutId="activeTab"
          transition={{ type: "spring", damping: 20 }}
        ></motion.span>
      )}
    </motion.button>
  );
};

// Enhanced stat cards with animations
const StatCard = ({ value, label, color, icon }) => {
  const colorMap = {
    blue: "from-blue-600 to-blue-400",
    green: "from-green-600 to-green-400",
    amber: "from-amber-600 to-amber-400",
    red: "from-red-600 to-red-400",
    purple: "from-purple-600 to-purple-400",
    indigo: "from-indigo-600 to-indigo-400",
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm p-5 border border-gray-100"
      whileHover={{ y: -4, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between">
        <motion.h4
          className="text-2xl md:text-3xl font-bold text-gray-800"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {value}
        </motion.h4>
        <motion.div
          className={`p-3 rounded-lg bg-gradient-to-br ${colorMap[color]}`}
          whileHover={{ scale: 1.1, rotate: 10 }}
          transition={{ duration: 0.2 }}
        >
          {icon}
        </motion.div>
      </div>
      <div className="text-gray-500 text-sm mt-2">{label}</div>
    </motion.div>
  );
};

// Assignment card with animations
const AssignmentCard = ({ assignment, setActiveTab2 }) => {
  const [progRatio,setProgRatio] = useState("0/0");
  const navigate = useNavigate();
  const [submissionPercentage,setSubmissionPercentage] = useState(0);
  // Function to determine team status badge color

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3000/dashboard-data-progress",
          {
            userEmail: localStorage.getItem("Email"),
            assId: assignment.id,
          }
        );
        console.log(response.data);
        setProgRatio(`${response.data[0].reviews_done}/${response.data[0].reviews_total}`);
        setSubmissionPercentage(response.data[0].progress);
        console.log(response.data[0]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProgress();
  }, []);

  const getTeamStatusColor = (status) => {
    switch (status) {
      case "Team Complete":
        return "bg-green-100 text-green-700";
      case "Forming Team":
        return "bg-amber-100 text-amber-700";
      case "Not Joined":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Function to determine submission status badge color
  const getSubmissionStatusColor = (status) => {
    switch (status) {
      case "Submitted":
        return "bg-green-100 text-green-700";
      case "Not Submitted":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  const handleViewDetail = () => {
    navigate("/team-detail", {
      state: {
        assId: assignment.id,
      },
    });
  };

  const handleWorkSpace = () => {
    const checkRepoConnectivity = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3000/checkRepoConnectivity",
          {
            assId: assignment.id,
            userEmail: localStorage.getItem("Email"),
          }
        );

        if (response.data[0].repo_status === "Not Connected") {
          navigate("/repo-form", {
            state: {
              assId: assignment.id,
            },
          });
        } else {
          navigate("/classgit-explorer", {
            state: {
              assId: assignment.id,
            },
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    checkRepoConnectivity();
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
      whileHover={{ y: -4, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-gray-800">{assignment.name}</h4>
          <div className="text-sm text-gray-500 mt-1">
            <span>{assignment.class}</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              new Date(assignment.deadline) < new Date()
                ? "bg-red-100 text-red-700"
                : new Date(assignment.deadline) <
                  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                ? "bg-amber-100 text-amber-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            Due: {assignment.deadline}
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="text-xs font-medium text-gray-500">Team Status</div>
          <div className="flex items-center mt-1">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTeamStatusColor(
                assignment.teamstatus
              )}`}
            >
              {assignment.teamstatus === "Team Complete" && (
                <CheckCircle className="h-3 w-3 mr-1" />
              )}
              {assignment.teamstatus === "Forming Team" && (
                <Users className="h-3 w-3 mr-1" />
              )}
              {assignment.teamstatus === "Not Joined" && (
                <AlertCircle className="h-3 w-3 mr-1" />
              )}
              {assignment.teamstatus}
            </span>
          </div>
          {assignment.teamstatus !== "Not Joined" && (
            <div className="text-xs text-gray-500 mt-1">
              {assignment.teamstatus === "Team Complete"
                ? "Your team is ready"
                : `${assignment.minteammembers}-${assignment.maxteammembers} members required`}
            </div>
          )}
        </div>
        <div>
          <div className="text-xs font-medium text-gray-500">Submission</div>
          <div className="flex items-center mt-1">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSubmissionStatusColor(
                assignment.submissionstatus
                
              )}`}
            >
              {assignment.submissionstatus === "Submitted" && (
                <Check className="h-3 w-3 mr-1" />
              )}
              {assignment.submissionstatus === "Not Submitted" && (
                <Clock className="h-3 w-3 mr-1" />
              )}
              {assignment.submissionstatus}
            </span>
          </div>
          {assignment.submissionstatus === "Not Submitted" && (
            <div className="text-xs text-gray-500 mt-1">
              {new Date(assignment.deadline) < new Date()
                ? "Past due date"
                : `Due in ${Math.ceil(
                    (new Date(assignment.deadline) - new Date()) /
                      (1000 * 60 * 60 * 24)
                  )} days`}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-600">
            Progress - {progRatio} reviews completed.
          </span>
          <span className="text-sm text-gray-600">{parseInt(submissionPercentage)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${submissionPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`h-full rounded-full ${
              submissionPercentage >= 100
                ? "bg-green-500"
                : submissionPercentage > 60
                ? "bg-blue-500"
                : submissionPercentage > 30
                ? "bg-amber-500"
                : "bg-red-500"
            }`}
          ></motion.div>
        </div>
      </div>
      <div className="mt-4 flex flex-col sm:flex-row justify-end items-center gap-2">
        <motion.button
          onClick={handleViewDetail}
          className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm w-full sm:w-auto justify-center sm:justify-start"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FileText className="h-4 w-4" />
          <span>View Details</span>
        </motion.button>
        {assignment.teamstatus === "Not Joined" && (
          <motion.button
            onClick={() => setActiveTab2("teams")}
            className="flex items-center space-x-1 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-md text-sm w-full sm:w-auto justify-center sm:justify-start"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <UserPlus className="h-4 w-4" />
            <span>Join Team</span>
          </motion.button>
        )}
        {assignment.teamstatus === "Forming Team" && (
          <motion.button
            className="flex items-center space-x-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-md text-sm w-full sm:w-auto justify-center sm:justify-start"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab2("teams")}
          >
            <Users className="h-4 w-4" />
            <span>Manage Team</span>
          </motion.button>
        )}
        {assignment.teamstatus === "Team Complete" && (
          <motion.button
            onClick={handleWorkSpace}
            className="flex items-center space-x-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-md text-sm w-full sm:w-auto justify-center sm:justify-start"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Edit className="h-4 w-4" />
            <span>Work-Space</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};
// Team card with animations
const TeamCard = ({ team, setTeamId1, setManageTeam1 }) => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
      whileHover={{ y: -4, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-gray-800">{team.name}</h4>
          <div className="text-sm text-gray-500 mt-1">
            <span>{team.project}</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <span
            className={`bg-${
              team.repostatus === "Connected" ? "green" : "amber"
            }-100 text-${
              team.repostatus === "Connected" ? "green" : "amber"
            }-700 text-xs px-2 py-1 rounded-md`}
          >
            {team.repostatus}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-xs font-medium text-gray-500">Assignment</div>
        <div className="text-sm font-medium text-gray-800">
          {team.assignment}
        </div>
      </div>

      <div className="mt-4">
        <div className="text-xs font-medium text-gray-500">Team Members</div>
        <div className="flex -space-x-2 mt-2">
          {team.members.map((member) => (
            <motion.div
              key={member.id}
              className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center text-white text-xs font-medium shadow-sm border-2 border-white"
              title={member.name}
              whileHover={{ y: -2, zIndex: 10 }}
            >
              {member.avatar}
            </motion.div>
          ))}
          {team.maxmembers != team.members.length && (
            <motion.div
              className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xs font-medium shadow-sm border-2 border-white"
              whileHover={{ y: -2, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              +
            </motion.div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <div className="text-xs font-medium text-gray-500">Repository</div>
        <div className="text-sm font-medium text-gray-800">
          {team.reponame || "Not connected"}
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <motion.button
          className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setManageTeam1(true);
            setTeamId1(team.id);
          }}
        >
          <Users className="h-4 w-4" />
          <span>Manage Team</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

// Invitation card with animations
const InvitationCard = ({ invitation }) => {
  // Define status-specific elements

  const handleAcceptorReject = async (e) => {
    const invitationResponse = e.target.value;
    try {
      const response = await axios.post(
        "http://localhost:3000/respond-invitation",
        {
          invitationResponse: invitationResponse,
          invitationId: invitation.id,
        }
      );
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  const renderStatusActions = () => {
    switch (invitation.status.toLowerCase()) {
      case "pending":
        return (
          <div className="mt-4 flex flex-col sm:flex-row justify-end items-center gap-2">
            <motion.button
              className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm w-full sm:w-auto justify-center sm:justify-start"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              value={"Rejected"}
              onClick={handleAcceptorReject}
            >
              <X className="h-4 w-4" />
              <span>Decline</span>
            </motion.button>
            <motion.button
              className="flex items-center space-x-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-md text-sm w-full sm:w-auto justify-center sm:justify-start"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              value={"Accepted"}
              onClick={handleAcceptorReject}
            >
              <CheckCircle className="h-4 w-4" />
              <span>Accept</span>
            </motion.button>
          </div>
        );

      case "accepted":
        return (
          <div className="mt-4 flex justify-end items-center">
            <motion.div
              className="flex items-center space-x-1 bg-green-100 text-green-700 px-3 py-1 rounded-md text-sm"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
            >
              <UserCheck className="h-4 w-4" />
              <span>Joined team</span>
            </motion.div>
          </div>
        );

      case "rejected":
        return (
          <div className="mt-4 flex justify-end items-center">
            <motion.div
              className="flex items-center space-x-1 bg-red-50 text-red-600 px-3 py-1 rounded-md text-sm"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
            >
              <XCircle className="h-4 w-4" />
              <span>Declined</span>
            </motion.div>
          </div>
        );

      default:
        return null;
    }
  };

  // Define status badge color based on status
  const getStatusBadgeStyles = () => {
    switch (invitation.status.toLowerCase()) {
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "accepted":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
      whileHover={{ y: -4, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-gray-800">
            Invitation to join {invitation.teamname}
          </h4>
          <div className="text-sm text-gray-500 mt-1">
            <span>
              {invitation.assignment} - {invitation.class}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <span
            className={`text-xs px-2 py-1 rounded-md ${getStatusBadgeStyles()}`}
          >
            {invitation.status}
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="text-xs font-medium text-gray-500">From</div>
          <div className="text-sm font-medium text-gray-800">
            {invitation.sender}
          </div>
        </div>
        <div>
          <div className="text-xs font-medium text-gray-500">Sent</div>
          <div className="text-sm font-medium text-gray-800">
            {invitation.sentat}
          </div>
        </div>
      </div>

      {/* Render different actions based on status */}
      {renderStatusActions()}
    </motion.div>
  );
};

//? "bg-red-100 text-red-700"
//: daysLeft <= 7
//? "bg-amber-100 text-amber-700"
//: "bg-green-100 text-green-700"

// Enhanced deadline items with animations
const DeadlineItem = ({ title, date, daysLeft, className }) => {
  return (
    <div className="border-l-4 border-blue-400 pl-3 py-2 mb-4">
      <div className="flex items-center justify-between">
        <span className="font-medium text-gray-800">{title}</span>
        <span
          className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
            daysLeft < 0
              ? "bg-red-100 text-red-700"
              : daysLeft === 0 || daysLeft === 1
              ? "bg-amber-100 text-amber-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {daysLeft < 0
            ? "Overdue"
            : daysLeft === 0
            ? "Due today"
            : daysLeft === 1
            ? "Due tomorrow"
            : daysLeft < 49
            ? `Due in ${Math.ceil(daysLeft / 7)} weeks`
            : `Due in ${Math.ceil(daysLeft / 30)} months`}
        </span>
      </div>
      <div className="text-gray-500 text-sm mt-1">{date}</div>
      <div className="text-gray-600 text-sm mt-1">{className}</div>
    </div>
  );
};

// Enhanced activity item with animations
const ActivityItem = ({ message, time }) => {
  return (
    <motion.div
      className="border-l-4 border-indigo-400 pl-3 py-1"
      initial={{ x: -10, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      whileHover={{ x: 2, backgroundColor: "#f9fafb" }}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium text-gray-800">{message}</span>
        <span className="text-xs text-gray-500">{time}</span>
      </div>
    </motion.div>
  );
};

// Enhanced user profile component with animations
const UserProfile = ({ name, department }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="relative">
      <motion.div
        className="flex items-center space-x-3 cursor-pointer"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        whileHover={{ scale: 1.03 }}
      >
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center text-white font-medium shadow-sm">
          {name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div>
          <div className="font-medium text-sm">{name}</div>
          <div className="text-xs text-gray-500">{department}</div>
        </div>
        <motion.div
          animate={{ rotate: dropdownOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            className="absolute bottom-full left-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 mb-2 z-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 py-2 border-b border-gray-100">
              <div className="text-sm font-medium text-gray-800">{name}</div>
              <div className="text-xs text-gray-500">{department}</div>
            </div>
            <div className="py-1">
              <div className="flex items-center px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer text-gray-700">
                <User className="h-4 w-4 mr-2" />
                <span>Profile Settings</span>
              </div>
              <div className="flex items-center px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer text-gray-700">
                <Settings className="h-4 w-4 mr-2" />
                <span>Account Settings</span>
              </div>
              <div className="flex items-center px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer text-gray-700">
                <Moon className="h-4 w-4 mr-2" />
                <span>Dark Mode</span>
                <div className="ml-auto">
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      name="toggle"
                      id="toggle"
                      className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    />
                    <label
                      htmlFor="toggle"
                      className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                    ></label>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-100 py-1">
              <div
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer text-red-600"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span>Sign Out</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const handleLogout = () => {
  localStorage.clear();
  window.location.href = "/login";
};

// Enhanced calendar widget
const EnhancedCalendarWidget = () => {
  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const [events, setEvents] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3000/dashboard-data-events",
          {
            userEmail: localStorage.getItem("Email"),
          }
        );

        // Add defensive check here
        setEvents(response.data.events || {}); // Use empty object as fallback if null
      } catch (err) {
        console.error(err);
        setEvents({}); // Set to empty object on error
      }
    };
    fetchData();
  }, []);
  // State for current date display
  const [currentDate, setCurrentDate] = useState(new Date());
  const [realToday] = useState(new Date()); // Store actual today

  // Event dates - these would normally come from your data
  // Adding some example events for different months

  // Auto update every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Get first day of month and total days in month
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  // Format for getting events
  const monthKey = `${currentDate.getFullYear()}-${String(
    currentDate.getMonth() + 1
  ).padStart(2, "0")}`;
  const eventDates = (events && events[monthKey]) || [];
  // Navigation functions
  const goToPrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  return (
    <div className="w-full max-w-xs bg-white p-4 rounded-lg shadow">
      {/* Calendar header with navigation */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={goToPrevMonth}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft size={20} />
        </button>

        <h2 className="text-lg font-semibold">
          {currentDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h2>

        <button
          onClick={goToNextMonth}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map((day, index) => (
          <div
            key={index}
            className="text-center text-xs font-medium text-gray-500 py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before the first day of month */}
        {[...Array(firstDayOfMonth)].map((_, index) => (
          <div key={`empty-${index}`} className="h-8"></div>
        ))}

        {/* Days of month */}
        {[...Array(daysInMonth)].map((_, index) => {
          const day = index + 1;
          const isToday =
            day === realToday.getDate() &&
            currentDate.getMonth() === realToday.getMonth() &&
            currentDate.getFullYear() === realToday.getFullYear();
          const hasEvent = eventDates.includes(day);

          return (
            <div key={day} className="h-10 w-full flex flex-col items-center">
              <div
                className={`h-8 w-8 flex items-center justify-center rounded-full text-sm cursor-pointer relative ${
                  isToday
                    ? "bg-purple-600 text-white font-medium"
                    : day < realToday.getDate() &&
                      currentDate.getMonth() === realToday.getMonth() &&
                      currentDate.getFullYear() === realToday.getFullYear()
                    ? "text-gray-400 hover:bg-gray-100"
                    : "text-gray-800 hover:bg-gray-100"
                }`}
              >
                {day}
              </div>

              {/* Event indicators */}
              {hasEvent && (
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1"></span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
// Component for Assignments Tab
const AssignmentsTab = ({ setActiveTab1 }) => {
  const [assignments, setAssignments] = useState([]);
  const [ids, setIds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3000/dashboard-data-assignments",
          {
            userEmail: localStorage.getItem("Email"),
          }
        );
        setIds(response.data.map((item) => item.id));
        setAssignments(response.data);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <motion.div
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {assignments.length > 0 ? (
        assignments.map((assignment) => (
          <motion.div variants={itemVariants} key={assignment.id}>
            <AssignmentCard
              assignment={assignment}
              setActiveTab2={setActiveTab1}
            />
          </motion.div>
        ))
      ) : (
        <AllCaughtUpAnimation />
      )}
    </motion.div>
  );
};

// Component for Teams Tab
const TeamsTab = () => {
  const [loadingRemaing, setLoadingRemaing] = useState(false);
  const [teamId, setTeamId] = useState();
  const [teams, setTeams] = useState([]);
  const [clickedFormTeam, setClickedFormTeam] = useState(false);
  const [availableAssignments, setAvailableAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignmentId, setAssignmentId] = useState();
  const [navigationStage, setNavigationStage] = useState([
    "Available Assignments",
  ]);
  const [manageTeam, setManageTeam] = useState(false);
  const [clickedAddMember, setClickedAddMember] = useState(false);

  useEffect(() => {
    const fetchdata = async () => {
      const response = await axios.post(
        "http://localhost:3000/dashboard-data-teams",
        {
          userEmail: localStorage.getItem("Email"),
        }
      );
      setTeams(response.data);
    };
    fetchdata();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.post(
        "http://localhost:3000/dashboard-data-assignments",
        {
          userEmail: localStorage.getItem("Email"),
        }
      );
      setAvailableAssignments(response.data);
    };
    fetchData();
  }, [clickedFormTeam]);

  function handleClickBack() {
    if (navigationStage.length != 1) {
      setNavigationStage(navigationStage.slice(0, -1));
    } else if (navigationStage.length === 1) {
      setClickedFormTeam(false);
    }
  }

  const TeamFormationCard = ({ assignment, setClickedFormTeam1 }) => {
    return (
      <motion.div
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer"
        whileHover={{ y: -4, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        onClick={() => {
          setClickedFormTeam(true);
        }}
      >
        {/* Header with assignment name and deadline */}
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-semibold text-gray-800">{assignment.name}</h4>
            <div className="text-sm text-gray-500 mt-1 flex items-center">
              <BookOpen className="h-3.5 w-3.5 mr-1" />
              <span>{assignment.class}</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <span
              className={`text-xs px-2 py-1 rounded-full flex items-center ${
                new Date(assignment.deadline) < new Date()
                  ? "bg-red-100 text-red-700"
                  : new Date(assignment.deadline) <
                    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                  ? "bg-amber-100 text-amber-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              <Calendar className="h-3 w-3 mr-1" />
              Due: {assignment.deadline}
            </span>
          </div>
        </div>

        {/* Team information */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-blue-600 mr-2" />
              <span className="font-medium text-blue-800">Team Required</span>
            </div>
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
              {assignment.minteammembers}-{assignment.maxteammembers} Members
            </span>
          </div>

          <div className="mt-3 text-sm text-blue-700">
            You need to form a team for this assignment. Create a team to invite
            classmates.
          </div>
        </div>

        {/* Action button */}
        <div className="mt-4">
          <motion.button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-md transition-all duration-200 flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            <span>Create Team</span>
            <ArrowRight className="h-4 w-4 ml-2" />
          </motion.button>
        </div>

        {/* Helper text */}
        <div className="mt-3 text-xs text-center text-gray-500">
          Click to create and manage your team for this assignment
        </div>
      </motion.div>
    );
  };

  const TeamFormationForm = ({ teamFormedForm, onCancel, onSubmit }) => {
    const [projectName, setProjectName] = useState("");
    const [teamName, setTeamName] = useState("");
    const [maxTeamSize, setMaxTeamSize] = useState(
      availableAssignments.find(
        (item) => item.name === navigationStage[navigationStage.length - 1]
      )?.maxteammembers
    );
    const [availableStudents, setAvailableStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [maxTeamSize1, setMaxTeamSize1] = useState(1);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showConfirmation2, setShowConfirmation2] = useState(false);
    const [confirmingStudent, setConfirmingStudent] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [showStudentList, setShowStudentList] = useState(false);

    // Animation variants
    const containerVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3 },
      },
      exit: {
        opacity: 0,
        y: -20,
        transition: { duration: 0.2 },
      },
    };

    // Fetch available students
    useEffect(() => {
      const fetchStudents = async () => {
        try {
          const response = await axios.post(
            "http://localhost:3000/available-students",
            {
              userEmail: localStorage.getItem("Email"),
              assignmentId: assignmentId,
            }
          );
          setAvailableStudents(response.data);
        } catch (error) {
          console.error("Error fetching students:", error);
        }
      };
      if (!teamFormedForm) {
        fetchStudents();
      }
    }, []);

    const validate = () => {
      const newErrors = {};
      if (!projectName.trim())
        newErrors.projectName = "Project name is required";
      if (!teamName.trim()) newErrors.teamName = "Team name is required";
      // Fixed validation logic - was incorrectly using -1
      if (selectedStudents.length === 0)
        newErrors.students = "Please select at least one team member";

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSendRequest = (student) => {
      setConfirmingStudent(student);
      setShowConfirmation(true);
    };

    const handleConfirmSendRequest = async (flag) => {
      if (!confirmingStudent) return;
      if (flag === 1) {
        try {
          setIsSubmitting(true);
          setSelectedStudents([...selectedStudents, confirmingStudent]);
          setShowConfirmation(false);
          setConfirmingStudent(null);
        } catch (error) {
          console.error("Error sending invitation:", error);
        } finally {
          setIsSubmitting(false);
        }
      } else {
        try {
          setIsSubmitting(true);
          await axios.post("http://localhost:3000/send-team-invitation", {
            senderEmail: localStorage.getItem("Email"),
            recipientEmail: confirmingStudent.email,
            projectName,
            teamName,
            maxSize: maxTeamSize1,
            assignmentId: assignmentId,
            teamId: teamId,
          });
          // Add student to selected list
          setSelectedStudents([...selectedStudents, confirmingStudent]);
          setShowConfirmation(false);
          setConfirmingStudent(null);
        } catch (error) {
          console.error("Error sending invitation:", error);
        } finally {
          setIsSubmitting(false);
        }
      }
    };

    const RenderCardView = ({ teamId }) => {
      const currentUserEmail = localStorage.getItem("Email");

      return (
        <div className="space-y-6 p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Team Members
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {teams
              .filter((team) => team.id === teamId) // Only keep the team with matching ID
              .flatMap((team) =>
                team.members.map((member, index) => {
                  const isCurrentUser = member.id === currentUserEmail;
                  return (
                    <motion.div
                      key={`${team.id}-${index}`}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center"
                      whileHover={{
                        y: -4,
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 24,
                      }}
                    >
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center text-white text-sm font-medium shadow-sm mr-4">
                        {member.avatar || member.name?.[0] || "U"}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">
                          {isCurrentUser
                            ? `${member.name} (You)`
                            : member.name || "Team Member"}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {member.role || "Member"}
                        </p>
                      </div>
                      {isCurrentUser && (
                        <button className="text-gray-400 hover:text-gray-600">
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                    </motion.div>
                  );
                })
              )}

            {teams.find(
              (team) =>
                team.id === teamId && team.members.length < team.maxmembers
            ) && (
              <motion.div
                className="bg-blue-50 rounded-lg shadow-sm border border-blue-200 p-4 flex items-center cursor-pointer"
                whileHover={{
                  y: -4,
                  boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.2)",
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                onClick={() => {
                  setClickedAddMember(true);
                }}
              >
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-lg font-medium shadow-sm mr-4">
                  <PlusCircle className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-blue-700">Add New Member</h4>
                </div>
                <div className="text-blue-500">
                  <ArrowRight className="h-5 w-5" />
                </div>
              </motion.div>
            )}
          </div>

          <div className="flex justify-end mt-6">
            <motion.button
              className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setManageTeam(false)}
            >
              <span>Back to Teams</span>
            </motion.button>
          </div>
        </div>
      );
    };

    const SelectRemainingStudents = () => {
      const [remainingStudents, setRemainingStudents] = useState([]);
      useEffect(() => {
        const fetchdata = async () => {
          try {
            const response = await axios.post(
              "http://localhost:3000/remaining-available-students",
              {
                userEmail: localStorage.getItem("Email"),
                teamId: teamId,
              }
            );
            setRemainingStudents(response.data);
          } catch (err) {
            console.error(err);
          }
        };
        fetchdata();
      }, [teamId]);

      function validateDisabled() {
        const team = teams.find((team) => team.id === teamId);
        return team.maxmembers === team.members.length ? true : false;
      }

      const [noOfRemainingStudents, setNoOfRemainingStudents] = useState();
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available Students
          </label>
          {errors.students && (
            <p className="mb-2 text-sm text-red-600">{errors.students}</p>
          )}

          <div className="border border-gray-300 rounded-md overflow-hidden">
            <div className="max-h-64 overflow-y-auto">
              {remainingStudents.length > 0 ? (
                !showConfirmation ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {remainingStudents
                        .filter(
                          (student) =>
                            !selectedStudents.some(
                              (s) => s.email === student.email
                            )
                        )
                        .map((student) => {
                          const isDisabled = validateDisabled();

                          return (
                            <tr
                              key={student.email}
                              className="hover:bg-gray-50"
                            >
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                {student.name}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {student.email}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                                <button
                                  type="button"
                                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                  onClick={() => handleSendRequest(student)}
                                  disabled={isDisabled}
                                >
                                  Send Request
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                ) : (
                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">
                      Confirm Invitation
                    </h3>
                    <p className="text-blue-700 mb-4">
                      Are you sure you want to send an email invitation to{" "}
                      {confirmingStudent?.name} to join your team "{teamName}"
                      for the project "{projectName}"?
                    </p>
                    <div className="flex space-x-3">
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-200"
                        onClick={() => {
                          handleConfirmSendRequest(-1);
                        }}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Sending..." : "Yes, Send Invitation"}
                      </button>
                      <button
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-all duration-200"
                        onClick={() => {
                          setShowConfirmation(false);
                        }}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No available students found
                </div>
              )}
            </div>
          </div>

          {selectedStudents.length > 0 && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {selectedStudents.map((student) => (
                  <div
                    key={student.email}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {student.name}
                    <button
                      type="button"
                      className="ml-2 text-blue-600 hover:text-blue-800"
                      onClick={() =>
                        setSelectedStudents(
                          selectedStudents.filter(
                            (s) => s.email !== student.email
                          )
                        )
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    };

    const handleSubmit = async (e) => {
      // Prevent default form submission
      if (e) e.preventDefault();

      if (!validate()) return;

      try {
        setIsSubmitting(true);
        const response = await axios.post("http://localhost:3000/create-team", {
          userEmail: localStorage.getItem("Email"),
          projectName,
          teamName,
          members: selectedStudents.map((student) => student.email),
          maxSize: maxTeamSize1,
          assignmentId: assignmentId,
        });

        
        setTimeout(() => {
          window.location.reload();
          toast.success("Team Created Successfully!");
          setIsSubmitting(false);
        }, 1000);

        if (onSubmit) onSubmit();
      } catch (error) {
        toast.error("Failed to create team. Please try again.");
      }
    };

    // Added missing handleClickBack function
    const handleClickBack = () => {
      setShowConfirmation2(false);
      if (onCancel) onCancel();
    };

    return teamFormedForm ? (
      clickedAddMember ? (
        <SelectRemainingStudents />
      ) : (
        <RenderCardView teamId={teamId} />
      )
    ) : (
      <motion.div
        className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Create a New Team
        </h2>

        {showConfirmation ? (
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Confirm Invitation
            </h3>
            <p className="text-blue-700 mb-4">
              Are you sure you want to send an email invitation to{" "}
              {confirmingStudent?.name} to join your team "{teamName}" for the
              project "{projectName}"?
            </p>
            <div className="flex space-x-3">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-200"
                onClick={() => {
                  handleConfirmSendRequest(1);
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Yes, Send Invitation"}
              </button>
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-all duration-200"
                onClick={() => {
                  setShowConfirmation(false);
                }}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : showConfirmation2 ? (
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Confirm Team Creation
            </h3>
            <p className="text-blue-700 mb-4">
              Are you sure you want to create this team{" "}
              {selectedStudents.length >= 1 && (
                <>
                  with{" "}
                  {selectedStudents.map((student, index) => (
                    <span key={index}>
                      {student.name}
                      {index < selectedStudents.length - 1 ? ", " : ""}
                    </span>
                  ))}{" "}
                  to join your team <strong>{teamName}</strong>
                </>
              )}
              for the project "<strong>{projectName}</strong>"?
            </p>
            <div className="flex space-x-3">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-200"
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting ? "Creating..." : "Yes, Create Team"}
              </button>
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-all duration-200"
                onClick={handleClickBack}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setShowConfirmation2(true);
            }}
          >
            <div className="space-y-5">
              {/* Project Name */}
              <div>
                <label
                  htmlFor="projectName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Project Name *
                </label>
                <input
                  type="text"
                  id="projectName"
                  className={`w-full px-4 py-2 border ${
                    errors.projectName ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter project name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
                {errors.projectName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.projectName}
                  </p>
                )}
              </div>

              {/* Team Name */}
              <div>
                <label
                  htmlFor="teamName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Team Name *
                </label>
                <input
                  type="text"
                  id="teamName"
                  className={`w-full px-4 py-2 border ${
                    errors.teamName ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter team name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                />
                {errors.teamName && (
                  <p className="mt-1 text-sm text-red-600">{errors.teamName}</p>
                )}
              </div>

              {/* Max Team Size */}
              <div>
                <label
                  htmlFor="maxTeamSize"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Maximum Team Size for{" "}
                  {navigationStage[navigationStage.length - 1]} is {maxTeamSize}
                </label>
                <select
                  id="maxTeamSize"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={maxTeamSize1}
                  onChange={(e) => setMaxTeamSize1(Number(e.target.value))}
                >
                  {Array.from({ length: maxTeamSize }, (_, i) => i + 1).map(
                    (size) => (
                      <option key={size} value={size}>
                        {size} members
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Available Students */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Students
                </label>
                {errors.students && (
                  <p className="mb-2 text-sm text-red-600">{errors.students}</p>
                )}

                <div className="border border-gray-300 rounded-md overflow-hidden">
                  <div className="max-h-64 overflow-y-auto">
                    {availableStudents.length > 0 ? (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {availableStudents
                            .filter(
                              (student) =>
                                !selectedStudents.some(
                                  (s) => s.email === student.email
                                )
                            )
                            .map((student) => {
                              const isDisabled =
                                selectedStudents.length >= maxTeamSize1 - 1 ||
                                projectName.trim() === "" ||
                                teamName.trim() === "";

                              return (
                                <tr
                                  key={student.email}
                                  className="hover:bg-gray-50"
                                >
                                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {student.name}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                    {student.email}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                                    <button
                                      type="button"
                                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                      onClick={() => handleSendRequest(student)}
                                      disabled={isDisabled}
                                    >
                                      Send Request
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No available students found
                      </div>
                    )}
                  </div>
                </div>

                {selectedStudents.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Selected Team Members ({selectedStudents.length + 1}/
                      {maxTeamSize1}) (Including You)
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedStudents.map((student) => (
                        <div
                          key={student.email}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                        >
                          {student.name}
                          <button
                            type="button"
                            className="ml-2 text-blue-600 hover:text-blue-800"
                            onClick={() =>
                              setSelectedStudents(
                                selectedStudents.filter(
                                  (s) => s.email !== student.email
                                )
                              )
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={onCancel}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-white 
                  ${
                    projectName.trim() === "" || teamName.trim() === ""
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  } 
                  font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed`}
                  disabled={
                    isSubmitting ||
                    projectName.trim() === "" ||
                    teamName.trim() === ""
                  }
                >
                  {isSubmitting ? "Creating..." : "Create Team"}
                </button>
              </div>
            </div>
          </form>
        )}
      </motion.div>
    );
  };

  return clickedFormTeam ? (
    <>
      <motion.button
        onClick={handleClickBack}
        className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm w-full sm:w-auto justify-center sm:justify-start"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span>Back</span>
      </motion.button>
      <br />
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {navigationStage[navigationStage.length - 1]}
      </h2>
      <br />
      {navigationStage.length === 1 ? (
        <div>
          {availableAssignments
            .filter(
              (assignment) =>
                assignment.maxteammembers != 1 &&
                assignment.teamstatus === "Not Joined"
            )
            .map((assignment) => (
              <motion.div
                onClick={() => {
                  setNavigationStage([...navigationStage, assignment.name]);
                  setAssignmentId(assignment.id);
                }}
                key={assignment.id}
              >
                <TeamFormationCard
                  assignment={assignment}
                  setClickedFormTeam1={setClickedFormTeam}
                />
              </motion.div>
            ))}
        </div>
      ) : (
        <TeamFormationForm teamFormedForm={false} onCancel={handleClickBack} />
      )}
    </>
  ) : (
    <>
      {manageTeam ? (
        <>
          <motion.button
            onClick={() => {
              setManageTeam(false);
              setClickedAddMember(false);
            }}
            className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm w-full sm:w-auto justify-center sm:justify-start"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Back</span>
          </motion.button>
          <>
            <TeamFormationForm teamFormedForm={true} />
          </>
        </>
      ) : (
        <motion.div
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {teams.length > 0 ? (
            <>
              {teams.map((team) => (
                <motion.div variants={itemVariants} key={team.id}>
                  <TeamCard
                    team={team}
                    setTeamId1={setTeamId}
                    setManageTeam1={setManageTeam}
                  />
                </motion.div>
              ))}

              {/* Form Team Button */}
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
                onClick={() => setClickedFormTeam(true)}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span>Form Team</span>
              </button>
            </>
          ) : (
            <NoTeamsAnimation
              message1={"No Teams Found"}
              message2={"You don't have any teams yet!"}
              message3={"Form Team"}
              setClickedFormTeam1={setClickedFormTeam}
              clickedFormTeam1={clickedFormTeam}
            />
          )}
        </motion.div>
      )}
    </>
  );
};

// Component for Invitations Tab
const InvitationsTab = () => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3000/dashboard-data-invitations",
          {
            userEmail: localStorage.getItem("Email"),
          }
        );
        setInvitations(response.data);
      } catch (error) {
        console.error("Error fetching invitations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []); // Empty dependency array means this runs once when component mounts

  if (loading) {
    return <div className="text-center py-8">Loading invitations...</div>;
  }

  return (
    <motion.div className="space-y-4" initial="hidden" animate="visible">
      {invitations.length > 0 ? (
        <InvitationsList invitations={invitations} />
      ) : (
        <NoInvitationsAnimation />
      )}
    </motion.div>
  );
};

const InvitationsList = ({ invitations }) => {
  const [visiblePending, setVisiblePending] = useState(3);
  const [visibleProcessed, setVisibleProcessed] = useState(3);

  // Separate invitations into pending and processed (accepted/declined)
  const pendingInvitations = invitations.filter(
    (inv) => inv.status.toLowerCase() === "pending"
  );

  const processedInvitations = invitations.filter((inv) =>
    ["accepted", "rejected"].includes(inv.status.toLowerCase())
  );

  // Load more handlers
  const loadMorePending = () => {
    setVisiblePending((prev) => prev + 3);
  };

  const loadMoreProcessed = () => {
    setVisibleProcessed((prev) => prev + 3);
  };

  return (
    <div className="space-y-8">
      {/* Pending Invitations Section */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Pending Invitations
          {pendingInvitations.length > 0 && (
            <span className="ml-2 bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full">
              {pendingInvitations.length}
            </span>
          )}
        </h3>

        {pendingInvitations.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No pending invitations
          </div>
        ) : (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {pendingInvitations.slice(0, visiblePending).map((invitation) => (
                <motion.div variants={itemVariants} key={invitation.id}>
                  <InvitationCard invitation={invitation} />
                </motion.div>
              ))}
            </motion.div>

            {pendingInvitations.length > visiblePending && (
              <div className="mt-4 text-center">
                <motion.button
                  onClick={loadMorePending}
                  className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Show More</span>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </motion.button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Processed Invitations Section */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Previous Invitations
          {processedInvitations.length > 0 && (
            <span className="ml-2 bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
              {processedInvitations.length}
            </span>
          )}
        </h3>

        {processedInvitations.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No previous invitations
          </div>
        ) : (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {processedInvitations
                .slice(0, visibleProcessed)
                .map((invitation) => (
                  <motion.div variants={itemVariants} key={invitation.id}>
                    <InvitationCard invitation={invitation} />
                  </motion.div>
                ))}
            </motion.div>

            {processedInvitations.length > visibleProcessed && (
              <div className="mt-4 text-center">
                <motion.button
                  onClick={loadMoreProcessed}
                  className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Show More</span>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </motion.button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Main StudentDashboard Component
const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("assignments");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const studentName = localStorage.getItem("UserName") || "User";
  const [stats, setStats] = useState([]);
  const [upcomingDeadline, setUpcomingDeadline] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.post(
        "http://localhost:3000/dashboard-data-stats",
        {
          userEmail: localStorage.getItem("Email"),
        }
      );
      const response2 = await axios.post(
        "http://localhost:3000/dashboard-data-upcomingDeadlines",
        {
          userEmail: localStorage.getItem("Email"),
        }
      );
      setUpcomingDeadline(response2.data);
      setStats(response.data);
    };
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Toaster position="top-center" reverseOrder={false} />
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 bg-gray-800 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileMenuOpen(false)}
          ></motion.div>
        )}
      </AnimatePresence>

      <motion.aside
        className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 shadow-md fixed h-screen z-20"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            ClassGit
          </h1>
        </div>
        <nav className="flex-grow mt-4 overflow-y-auto">
          <SidebarNavItem
            icon={<Home className="h-5 w-5" />}
            text="Dashboard"
            active={activeSection === "dashboard"}
            onClick={() => setActiveSection("dashboard")}
          />
          <SidebarNavItem
            icon={<BookOpen className="h-5 w-5" />}
            text="Assignments"
            active={activeSection === "assignments"}
            onClick={() => setActiveSection("assignments")}
          />
          <SidebarNavItem
            icon={<Users className="h-5 w-5" />}
            text="Teams"
            active={activeSection === "teams"}
            onClick={() => setActiveSection("teams")}
          />
          <SidebarNavItem
            icon={<Book className="h-5 w-5" />}
            text="Classes"
            active={activeSection === "classes"}
            onClick={() => setActiveSection("classes")}
          />
          <SidebarNavItem
            icon={<MessageSquare className="h-5 w-5" />}
            text="Messages"
            active={activeSection === "messages"}
            onClick={() => setActiveSection("messages")}
          />
          <SidebarNavItem
            icon={<Bell className="h-5 w-5" />}
            text="Notifications"
            active={activeSection === "notifications"}
            onClick={() => setActiveSection("notifications")}
            badge={stats.pendinginvitations}
          />
        </nav>
        <div className="p-4 border-t border-gray-200 mt-auto">
          <UserProfile name={studentName} department="Computer Science" />
        </div>
      </motion.aside>

      {/* Mobile Sidebar - Animated */}
      <motion.aside
        className="lg:hidden fixed h-screen w-64 bg-white border-r border-gray-200 shadow-lg z-40"
        initial={{ x: "-100%" }}
        animate={{ x: mobileMenuOpen ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="p-6 flex justify-between items-center border-b border-gray-100">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            ClassGit
          </h1>
          <motion.button
            onClick={() => setMobileMenuOpen(false)}
            className="text-gray-500"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="h-6 w-6" />
          </motion.button>
        </div>
        <nav className="flex-grow py-2 overflow-y-auto">
          <SidebarNavItem
            icon={<Home className="h-5 w-5" />}
            text="Dashboard"
            active={activeSection === "dashboard"}
            onClick={() => {
              setActiveSection("dashboard");
              setMobileMenuOpen(false);
            }}
          />
          <SidebarNavItem
            icon={<BookOpen className="h-5 w-5" />}
            text="Assignments"
            active={activeSection === "assignments"}
            onClick={() => {
              setActiveSection("assignments");
              setMobileMenuOpen(false);
            }}
          />
          <SidebarNavItem
            icon={<Users className="h-5 w-5" />}
            text="Teams"
            active={activeSection === "teams"}
            onClick={() => {
              setActiveSection("teams");
              setMobileMenuOpen(false);
            }}
          />
          <SidebarNavItem
            icon={<Book className="h-5 w-5" />}
            text="Classes"
            active={activeSection === "classes"}
            onClick={() => {
              setActiveSection("classes");
              setMobileMenuOpen(false);
            }}
          />
          <SidebarNavItem
            icon={<MessageSquare className="h-5 w-5" />}
            text="Messages"
            active={activeSection === "messages"}
            onClick={() => {
              setActiveSection("messages");
              setMobileMenuOpen(false);
            }}
          />
          <SidebarNavItem
            icon={<Bell className="h-5 w-5" />}
            text="Notifications"
            active={activeSection === "notifications"}
            onClick={() => {
              setActiveSection("notifications");
              setMobileMenuOpen(false);
            }}
            badge={stats.pendinginvitations}
          />
        </nav>
        <div className="p-4 border-t border-gray-200 mt-auto">
          <UserProfile name={studentName} department="Computer Science" />
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Header */}
        <motion.header
          className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-4 md:px-6 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <motion.button
                onClick={() => setMobileMenuOpen(true)}
                className="mr-4 lg:hidden text-gray-600 hover:text-gray-800 p-1 rounded-md hover:bg-gray-100"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Menu className="h-6 w-6" />
              </motion.button>
              <div className="flex items-center lg:hidden">
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  ClassGit
                </h1>
              </div>
              <div className="hidden lg:block ml-4">
                <span className="text-gray-700 font-medium">
                  Student Dashboard
                </span>
              </div>
            </div>

            {/* Search Bar - Enhanced for medium screens */}
            <div className="hidden md:block mx-4 lg:mx-0 flex-1 max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150 ease-in-out sm:text-sm"
                  placeholder="Search..."
                />
              </div>
            </div>

            <div className="flex items-center space-x-1 md:space-x-4">
              <motion.button
                className="relative hover:bg-gray-100 p-2 rounded-full transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="h-5 w-5 text-gray-600" />
                {stats.pendinginvitations > 0 && (
                  <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
                )}
              </motion.button>
              <motion.button
                className="hover:bg-gray-100 p-2 rounded-full transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Settings className="h-5 w-5 text-gray-600" />
              </motion.button>
              <div className="border-l border-gray-200 h-8 mx-1 hidden sm:block"></div>
              <div className="flex items-center space-x-3">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center text-white font-medium shadow-sm">
                  {studentName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium text-gray-700">
                    {studentName.split(" ")[0]}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Left Column - Main Content */}
              <div className="flex-grow lg:max-w-[65%]">
                {/* Welcome Section */}
                <motion.div
                  className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-6 md:mb-8 border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  whileHover={{
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                    Welcome, {studentName.split(" ")[0]}!
                  </h2>
                  <div className="text-gray-600 mt-2">
                    <DynamicDateHeading flag={1} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mt-6 md:mt-8">
                    <StatCard
                      value={stats.activeassignments || 0}
                      label="Active Assignments"
                      color="blue"
                      icon={<BookOpen className="h-5 w-5 text-white" />}
                    />
                    <StatCard
                      value={stats.upcomingdeadlines || 0}
                      label="Upcoming Deadlines"
                      color="amber"
                      icon={<Clock className="h-5 w-5 text-white" />}
                    />
                    <StatCard
                      value={stats.pendinginvitations || 0}
                      label="Team Invitations"
                      color="indigo"
                      icon={<Users className="h-5 w-5 text-white" />}
                    />
                  </div>
                </motion.div>

                {/* Tabs Navigation */}
                <motion.div
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  whileHover={{
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div className="border-b border-gray-200">
                    <div className="flex overflow-x-auto hide-scrollbar py-2 px-2 md:px-4">
                      <TabButton
                        active={activeTab === "assignments"}
                        onClick={() => setActiveTab("assignments")}
                        icon={<BookOpen className="h-5 w-5" />}
                        text="Assignments"
                      />
                      <TabButton
                        active={activeTab === "teams"}
                        onClick={() => setActiveTab("teams")}
                        icon={<Users className="h-5 w-5" />}
                        text="My Teams"
                      />
                      <TabButton
                        active={activeTab === "invitations"}
                        onClick={() => setActiveTab("invitations")}
                        icon={<Bell className="h-5 w-5" />}
                        text="Invitations"
                        badge={stats.pendinginvitations}
                      />
                    </div>
                  </div>

                  {/* Tab Content with AnimatePresence for smooth transitions */}
                  <div className="p-4 md:p-6">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        {activeTab === "assignments" && (
                          <AssignmentsTab setActiveTab1={setActiveTab} />
                        )}
                        {activeTab === "teams" && <TeamsTab />}
                        {activeTab === "invitations" && <InvitationsTab />}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>

              {/* Right Sidebar */}
              <div className="lg:w-80 xl:w-96 space-y-6 flex-shrink-0">
                {/* Calendar Widget */}
                <motion.div
                  className="bg-white rounded-xl shadow-sm p-5 border border-gray-100"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  whileHover={{
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800 flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                      Calendar
                    </h3>
                    <span className="text-sm font-medium bg-purple-50 text-purple-700 px-2 py-1 rounded-md">
                      <DynamicDateHeading flag={2} />
                    </span>
                  </div>
                  <EnhancedCalendarWidget />
                  <div className="mt-4 flex justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                      <span className="text-gray-600">Due Dates</span>
                    </div>
                  </div>
                </motion.div>

                {/* Upcoming Deadlines */}
                <motion.div
                  className="bg-white rounded-xl shadow-sm p-5 border border-gray-100"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  whileHover={{
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <h3 className="font-semibold text-gray-800 flex items-center mb-4">
                    <Clock className="h-5 w-5 mr-2 text-red-500" />
                    Upcoming Deadlines
                  </h3>
                  <motion.div
                    className="space-y-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div variants={itemVariants}>
                      {upcomingDeadline.length === 0 ? (
                        <p>No Upcoming Deadlines </p>
                      ) : null}
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      {upcomingDeadline[0] && (
                        <DeadlineItem
                          title={upcomingDeadline[0].title}
                          date={upcomingDeadline[0].due_date}
                          daysLeft={upcomingDeadline[0].days_left}
                          className={upcomingDeadline[0].course}
                        />
                      )}
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      {upcomingDeadline[1] && (
                        <DeadlineItem
                          title={upcomingDeadline[1].title}
                          date={upcomingDeadline[1].due_date}
                          daysLeft={upcomingDeadline[1].days_left}
                          className={upcomingDeadline[1].course}
                        />
                      )}
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      {upcomingDeadline[2] && (
                        <DeadlineItem
                          title={upcomingDeadline[2].title}
                          date={upcomingDeadline[2].due_date}
                          daysLeft={upcomingDeadline[2].days_left}
                          className={upcomingDeadline[2].course}
                        />
                      )}
                    </motion.div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>


        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="container mx-auto px-4 md:px-6 py-4 md:py-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <div className="mb-3 md:mb-0"></div>
            <div className="flex flex-wrap justify-center space-x-4 md:space-x-6">
              <a
                href="#"
                className="hover:text-blue-600 transition-colors mb-2 md:mb-0"
              >
                Help
              </a>
              <a
                href="#"
                className="hover:text-blue-600 transition-colors mb-2 md:mb-0"
              >
                Documentation
              </a>
              <a
                href="#"
                className="hover:text-blue-600 transition-colors mb-2 md:mb-0"
              >
                Contact Support
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

const getFormattedDate = () => {
  const today = new Date();
  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  return today.toLocaleDateString("en-US", options);
};

const DynamicDateHeading = ({ flag }) => {
  return flag === 1 ? (
    <h2>
      Today is {getFormattedDate()}. Here's what's happening with your
      assignments and teams.
    </h2>
  ) : (
    <>{getFormattedDate()}</>
  );
};

export default StudentDashboard;
