import React, { useState, useEffect } from "react";
import StudyMaterials from "./components/StudyMaterials";
import MockExamSimulator from "./components/MockExamSimulator";
import PerformanceDashboard from "./components/PerformanceDashboard";
import AdminPanel from "./components/AdminPanel";
import CandidatePlaza from "./components/CandidatePlaza";
import AcademicCalendar from "./components/AcademicCalendar";
import { getPortalMessages } from "./lib/dynamicData";
import { PortalMessage } from "./types";
import { 
  GraduationCap, Flame, Award, BookOpen, Brain, 
  TrendingUp, Calendar, Info, Clock, CheckCircle2, Sliders, Users, Megaphone, X 
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"materials" | "exam" | "calendar" | "plaza" | "dashboard" | "admin">("materials");
  const [streakCount, setStreakCount] = useState(3); // default motivator count
  const [totalPracticeCount, setTotalPracticeCount] = useState(0);
  const [syncTrigger, setSyncTrigger] = useState(0);
  const [announcements, setAnnouncements] = useState<PortalMessage[]>([]);
  const [dismissedAnnouncements, setDismissedAnnouncements] = useState<string[]>([]);
  const [activeRole, setActiveRole] = useState("student");

  // Synchronize dynamic badges and streak stats from LocalStorage log records
  useEffect(() => {
    const savedRole = localStorage.getItem("l5swd_active_role") || "student";
    setActiveRole(savedRole);

    const saved = JSON.parse(localStorage.getItem("l5swd_history") || "[]");
    setTotalPracticeCount(saved.length);
    
    // Sync announcements
    const rawMessages = getPortalMessages();
    const activeAnn = rawMessages.filter(m => m.isAnnouncement);
    setAnnouncements(activeAnn);
  }, [syncTrigger, activeTab]);

  const handleRoleChange = (role: string) => {
    setActiveRole(role);
    localStorage.setItem("l5swd_active_role", role);
    // Flush updates to cause downstream components to re-run calculations immediately
    setSyncTrigger(prev => prev + 1);
  };

  const handleExamSaved = () => {
    // Increment completion callback tracker to flush Performance logs immediately
    setSyncTrigger(prev => prev + 1);
  };

  const getCandidateBadge = () => {
    if (totalPracticeCount >= 6) {
      return { title: "L5 Expert Developer", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
    }
    if (totalPracticeCount >= 2) {
      return { title: "L5 Intermediate Prep", color: "text-teal-400 bg-teal-500/10 border-teal-500/20" };
    }
    return { title: "L5 SWD Apprentice", color: "text-slate-400 bg-slate-800 border-slate-700/60" };
  };

  const badge = getCandidateBadge();

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans flex flex-col" id="applet-viewport-wrapper">
      
      {/* Persistant Utility Header for NESA Candidates */}
      <header className="border-b border-slate-800/80 bg-slate-900/15 backdrop-blur-md sticky top-0 z-50 py-3.5 px-4 sm:px-6" id="app-global-header">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4" id="header-inner-row">
          
          {/* Logo & National Curriculum details */}
          <div className="flex items-center gap-3" id="header-brand-info">
            <div className="p-2.5 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 shrink-0">
              <GraduationCap className="w-5.5 h-5.5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5 leading-none">
                L5SWD Study Hub
              </h1>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1 block">NESA Rwanda TVET Preparatory Portal</span>
            </div>
          </div>

          {/* User Streak, dynamic Badge tracker, and Role Switcher */}
          <div className="flex flex-wrap items-center gap-3 shrink-0" id="header-badges-panel">
            
            {/* Active View Selector (Moodle, Teacher, Parent) */}
            <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-xl px-2.5 py-1.5" id="user-role-selector">
              <span className="text-[9px] font-mono text-slate-500 uppercase font-black tracking-wider mr-1.5">View As:</span>
              <select
                value={activeRole}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="bg-transparent border-none text-xs text-indigo-400 font-bold outline-none cursor-pointer focus:ring-0"
              >
                <option value="student" className="bg-[#090d16]">Candidate (Remmy)</option>
                <option value="teacher" className="bg-[#090d16]">Teacher (Safari)</option>
                <option value="parent" className="bg-[#090d16]">Parent (Reginald)</option>
                <option value="admin" className="bg-[#090d16]">Super Admin</option>
              </select>
            </div>

            {/* Dynamic Competency Badge */}
            <div className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${badge.color} flex items-center gap-1.5`} id="user-badge-level">
              <Award className="w-4 h-4 shrink-0" />
              <span>{badge.title}</span>
            </div>

            {/* Streak Counter */}
            <div className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/10 border border-rose-500/20 text-rose-450 flex items-center gap-1.5" id="user-streak-counter">
              <Flame className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{streakCount} Day Streak</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col" id="app-main-content">
        
        {/* Dynamic Teacher Warning Bulletins / Announcements */}
        {announcements.length > 0 && (
          <div className="space-y-2 mb-5" id="bulletin-announcements-stage">
            {announcements
              .filter(ann => !dismissedAnnouncements.includes(ann.id))
              .map(ann => (
                <div 
                  key={ann.id} 
                  className="bg-indigo-950/25 border-l-4 border-indigo-500 text-slate-200 p-4 rounded-r-xl rounded-l-md flex items-start justify-between gap-4 shadow-md border border-slate-900 border-l-indigo-500"
                  id={`announcement-alert-${ann.id}`}
                >
                  <div className="flex gap-3">
                    <div className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg shrink-0 mt-0.5">
                      <Megaphone className="w-4 h-4" />
                    </div>
                    <div className="text-left select-text">
                      <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-indigo-400 block mb-0.5">
                        Official NESA Bulletin Alert • {ann.timestamp}
                      </span>
                      <p className="text-xs font-medium leading-relaxed text-slate-200">
                        {ann.text} {ann.subjectTitle && <span className="text-[10px] px-1.5 py-0.5 ml-1 bg-slate-900 border border-indigo-500/15 rounded text-indigo-300 font-mono inline-block">{ann.subjectTitle}</span>}
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setDismissedAnnouncements(prev => [...prev, ann.id])}
                    className="text-slate-500 hover:text-slate-200 p-1 shrink-0 transition cursor-pointer"
                    title="Dismiss alert"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
          </div>
        )}
        
        {/* Navigation Control tabs */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-1.5 p-1.5 bg-slate-950/45 border border-slate-850 rounded-2xl max-w-4xl mb-6 outline-none" id="main-tabs-selector">
          <button
            onClick={() => setActiveTab("materials")}
            className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition select-none outline-none ${
              activeTab === "materials"
                ? "bg-slate-850 text-white shadow"
                : "text-slate-500 hover:text-slate-300"
            }`}
            id="btn-nav-materials"
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>Study Guides</span>
          </button>

          <button
            onClick={() => setActiveTab("exam")}
            className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition select-none outline-none ${
              activeTab === "exam"
                ? "bg-slate-850 text-white shadow"
                : "text-slate-500 hover:text-slate-300"
            }`}
            id="btn-nav-exam"
          >
            <Brain className="w-4 h-4 shrink-0" />
            <span>Mock Exams</span>
          </button>

          <button
            onClick={() => setActiveTab("calendar")}
            className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition select-none outline-none ${
              activeTab === "calendar"
                ? "bg-slate-850 text-white shadow"
                : "text-slate-500 hover:text-slate-300"
            }`}
            id="btn-nav-calendar"
          >
            <Calendar className="w-4 h-4 shrink-0 text-indigo-400" />
            <span>Syllabus Calendar</span>
          </button>

          <button
            onClick={() => setActiveTab("plaza")}
            className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition select-none outline-none ${
              activeTab === "plaza"
                ? "bg-slate-850 text-white shadow"
                : "text-slate-500 hover:text-slate-300"
            }`}
            id="btn-nav-plaza"
          >
            <Users className="w-4 h-4 shrink-0" />
            <span>Candidate Hub</span>
          </button>

          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition select-none outline-none ${
              activeTab === "dashboard"
                ? "bg-slate-850 text-white shadow"
                : "text-slate-500 hover:text-slate-300"
            }`}
            id="btn-nav-dashboard"
          >
            <TrendingUp className="w-4 h-4 shrink-0" />
            <span>Stats & Logs</span>
          </button>

          <button
            onClick={() => setActiveTab("admin")}
            className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition select-none outline-none ${
              activeTab === "admin"
                ? "bg-slate-850 text-white shadow"
                : "text-slate-500 hover:text-slate-300"
            }`}
            id="btn-nav-admin"
          >
            <Sliders className="w-4 h-4 shrink-0" />
            <span>Admin Center</span>
          </button>
        </div>

        {/* Dynamic Display Panel */}
        <div className="flex-1" id="subcontent-pane">
          {activeTab === "materials" && <StudyMaterials />}
          
          {activeTab === "exam" && <MockExamSimulator onExamSaved={handleExamSaved} />}

          {activeTab === "calendar" && <AcademicCalendar />}

          {activeTab === "plaza" && <CandidatePlaza />}
          
          {activeTab === "dashboard" && (
            <PerformanceDashboard 
              onNavigateTab={(targetTab) => setActiveTab(targetTab)} 
              syncTrigger={syncTrigger}
            />
          )}

          {activeTab === "admin" && (
            <AdminPanel onDataChanged={handleExamSaved} />
          )}
        </div>
      </main>

      {/* Elegant minimalist NESA footer */}
      <footer className="border-t border-slate-850 py-4 px-6 text-center text-[10px] font-mono text-slate-600 mt-8" id="platform-footer-clause">
        © 2026 Level 5 Software Development Competency Companion. Formulated in accordance with Rwanda TVET National Written Assessment Frameworks.
      </footer>
    </div>
  );
}
