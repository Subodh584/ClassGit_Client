import StudentDashboard from "./components/StudentDashboard";
import SignUpForStudents from "./Components/SignUpForStudents";
import LogIn from "./Components/LogIn";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateComponent from "./Components/PrivateComponent";
import styles from "./Components/Styles.module.css";
import SignUpForFaculty from "./Components/SignUpForFaculty";
import TeacherDashboard from "./Components/TeacherDashboard";
import TestDashboard from "./Components/Test";
import SRMProjectExpo from "./Components/expo";
import ViewDetail from "./Components/ViewDetail/ViewDetail";
import GForm from "./Components/GithubForm/GForm";
import { Toaster } from 'sonner';
import Explorer from "./Components/ClassGitExplorer/Explorer";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        <Route element={<PrivateComponent />}>
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/admin-dashboard" element={<TeacherDashboard />} />
          <Route path="/" element={<div>Welcome to home page</div>} />
          <Route path="/team-detail" element={<ViewDetail />} />
          <Route path="/repo-form" element={<GForm />} />
          <Route path="/classgit-explorer" element={<Explorer/>}/>
        </Route>
        <Route path="/login" element={<LogIn />} />
        
        <Route path="/signup" element={<SignUpForStudents />} />
        <Route path="/signupforfaculty" element={<SignUpForFaculty />} />
        <Route path="/test" element={<TestDashboard />} />
        <Route path="/expo" element={<SRMProjectExpo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;