import { Route, Routes } from "react-router-dom";
import SignupPage from "./pages/auth/SignupPage";
import LoginPage from "./pages/auth/LoginPage";
import HomePage from "./pages/home/HomePage";
import NotificationPage from "./pages/notification/notificationPage";
import ProfilePage from "./pages/profile/ProfilePage";

import Sidebar from "./components/Sidebar";
import RightPanel from "./components/RightPanel";

function App() {
  return (
    <>
      <div className="flex max-w-6xl mx-auto">
      <Sidebar/>  
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/signup" element={<SignupPage/>}/>
        <Route path="/notifications" element={<NotificationPage/>}/>
        <Route path="/profile/:username" element={<ProfilePage/>}/>
      </Routes>
      <RightPanel/>
      </div>
    </>
  );
}

export default App;
