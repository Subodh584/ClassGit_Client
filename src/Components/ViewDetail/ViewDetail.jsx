import React, { useState, useEffect } from "react";
import axios from "axios";
import AssignmentDetails from "./AssignmentDetails"; // Adjust path as needed
import { useLocation } from "react-router-dom";

const ViewDetail = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [subject, setSubject] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [minTeamMembers, setMinTeamMembers] = useState(0);
  const [maxTeamMembers, setMaxTeamMembers] = useState(0);
  const [teamStatus, setTeamStatus] = useState("");
  const [repositoryName, setRepositoryName] = useState(null);
  const [repositoryStatus, setRepositoryStatus] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  const fetchTeamDetails = async (assignmentId, studentEmail) => {
    try {
      const response = await axios.post("http://localhost:3000/student-dashboard-data-view-team-detail", {
        assignmentId: assignmentId,
        studentEmail: studentEmail
      });

      if (response.data.success) {
        const teamData = response.data.teamData;

        setTitle(teamData.assignment.title);
        setDescription(teamData.assignment.description);
        setDueDate(teamData.assignment.dueDate);
        setSubject(teamData.subject.subjectName);
        setTeacherName(teamData.teacher.name);
        setMinTeamMembers(teamData.assignment.minTeamMembers);
        setMaxTeamMembers(teamData.assignment.maxTeamMembers);
        setTeamStatus(teamData.teamStatus);
        setRepositoryName(teamData.repository?.repoName || null);
        setRepositoryStatus(teamData.repository?.status || null);
        setTeamMembers(teamData.teamMembers);
        setReviews(teamData.reviews);
        setCompletionPercentage(teamData.completionPercentage);
      } else {
        console.error("Failed to fetch team details:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching team details:", error);
    }
  };

  const location = useLocation();
  const {assId} = location.state;
  const assignmentId = assId;

  useEffect(() => {
    const studentEmail = localStorage.getItem("Email");
    if (assignmentId && studentEmail) {
      fetchTeamDetails(assignmentId, studentEmail);
    }
  }, []);

  const sampleAssignment = {
    title,
    description,
    dueDate,
    subject,
    teacherName,
    minTeamMembers,
    maxTeamMembers,
    teamStatus,
    repositoryName,
    repositoryStatus,
    teamMembers,
    reviews,
    completionPercentage
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Student Assignment Dashboard</h1>
      <AssignmentDetails {...sampleAssignment} />
    </div>
  );
};

export default ViewDetail;
