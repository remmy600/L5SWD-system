import React, { useState, useEffect } from "react";
import { 
  getStudents, 
  getOnlineStudents, 
  getPortalMessages, 
  savePortalMessage, 
  getMergedModules,
  getAssignedExams 
} from "../lib/dynamicData";
import { Student, PortalMessage, StudyModule, AssignedExam, MockHistoryItem } from "../types";
import { 
  Users, MessageSquare, Award, Send, RefreshCw, UserCheck, CheckCircle2, 
  BookOpen, Sparkles, MapPin, Calendar, Clock, Compass, ShieldCheck, HelpCircle
} from "lucide-react";

export default function CandidatePlaza() {
  const [students, setStudents] = useState<Student[]>([]);
  const [onlineStatus, setOnlineStatus] = useState<Array<{ studentId: string; status: "active" | "away" | "busy"; lastAction: string }>>([]);
  const [messages, setMessages] = useState<PortalMessage[]>([]);
  const [modules, setModules] = useState<StudyModule[]>([]);
  const [assignedExams, setAssignedExams] = useState<AssignedExam[]>([]);
  const [history, setHistory] = useState<MockHistoryItem[]>([]);

  // Profile selection state (Profile Ally)
  const [selectedProfileId, setSelectedProfileId] = useState<string>("");
  
  // Message writing state
  const [newMessageText, setNewMessageText] = useState("");
  const [customSenderName, setCustomSenderName] = useState("");
  const [selectedTagModuleId, setSelectedTagModuleId] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Load and refresh plaza datasets
  const loadPlazaData = () => {
    const stds = getStudents();
    setStudents(stds);
    setOnlineStatus(getOnlineStudents());
    setMessages(getPortalMessages());
    setModules(getMergedModules());
    setAssignedExams(getAssignedExams());

    // Historical records from localStorage
    const savedHistory = JSON.parse(localStorage.getItem("l5swd_history") || "[]");
    setHistory(savedHistory);

    if (stds.length > 0 && !selectedProfileId) {
      setSelectedProfileId(stds[0].id);
    }
  };

  useEffect(() => {
    loadPlazaData();
    // Simulate periodic message checking or polling simulation
    const interval = setInterval(() => {
      setOnlineStatus(getOnlineStudents());
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Filter messages
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    let sender = "Anonymous Candidate";
    let role: "admin" | "student" = "student";

    // If an active Profile Ally is locked in, use their name
    const activeStudent = students.find(s => s.id === selectedProfileId);
    if (activeStudent) {
      sender = activeStudent.name;
    } else if (customSenderName.trim()) {
      sender = customSenderName.trim();
    }

    // Quick admin recognition
    if (sender.toLowerCase().includes("admin") || sender.toLowerCase().includes("teacher")) {
      role = "admin";
    }

    const matchedMod = modules.find(m => m.id === selectedTagModuleId);
    const subjectTitle = matchedMod ? matchedMod.title : undefined;

    const newMsg: PortalMessage = {
      id: `m_${Date.now()}`,
      sender,
      role,
      text: newMessageText.trim(),
      timestamp: new Date().toLocaleString("en-US", { 
        month: "short", 
        day: "numeric", 
        hour: "numeric", 
        minute: "2-digit" 
      }),
      subjectTitle
    };

    savePortalMessage(newMsg);
    setNewMessageText("");
    loadPlazaData(); // Refresh list immediately!
  };

  const getActiveProfileStats = () => {
    const activeStudent = students.find(s => s.id === selectedProfileId);
    if (!activeStudent) return null;

    // Filter relevant evaluations completed
    const studentHistory = history.filter(h => h.wrongQuestions !== undefined); // Simple client logs
    // Check assigned exams completed for this target
    const studentExams = assignedExams.filter(e => e.targetStudentId === selectedProfileId);
    const completedAssigned = studentExams.filter(e => e.status === "completed");

    const averageMockScore = studentHistory.length > 0 
      ? Math.round(studentHistory.reduce((acc, curr) => acc + curr.score, 0) / studentHistory.length)
      : completedAssigned.length > 0 
        ? Math.round(completedAssigned.reduce((acc, curr) => acc + (curr.score || 0), 0) / completedAssigned.length)
        : 0;

    // Badges calculation
    const totalDone = studentHistory.length + completedAssigned.length;
    let rank = "NESA Apprenticed Candidate";
    let badgeColor = "border-slate-800 bg-slate-900/40 text-slate-400";
    let badgeLabel = "Level 5 Recruit";
    
    if (totalDone >= 5 || averageMockScore >= 80) {
      rank = "Level 5 Supreme SWD Master";
      badgeColor = "border-amber-500/30 bg-amber-500/5 text-amber-400";
      badgeLabel = "Expert Class (NESA High Grade)";
    } else if (totalDone >= 2) {
      rank = "Competent L5 Practitioner";
      badgeColor = "border-indigo-500/30 bg-indigo-500/5 text-indigo-400";
      badgeLabel = "Intermediate Tier";
    }

    return {
      student: activeStudent,
      totalCompleted: totalDone,
      averageScore: averageMockScore,
      rank,
      badgeColor,
      badgeLabel,
      assignedCount: studentExams.length,
      pendingCount: studentExams.filter(e => e.status === "assigned").length
    };
  };

  const activeStats = getActiveProfileStats();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="candidate-plaza-wrapper">
      
      {/* LEFT PORTION (8 COLS): MESSAGE CENTER & PROFILE ALLY */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* PROFILE ALLY (Interactive Identity Card) */}
        <div className="border border-slate-850 bg-slate-900/45 rounded-2xl p-5 shadow-lg shadow-black/10" id="profile-ally-view-pane">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/15">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">Interactive Profile Ally & Credentials</h3>
                <p className="text-[11px] text-slate-400 font-mono text-left">Lookup academic identities and digital NESA badges.</p>
              </div>
            </div>

            {/* Select Active Student Profile switcher */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-xs font-semibold text-slate-500">Candidate Profile:</span>
              <select 
                value={selectedProfileId} 
                onChange={(e) => setSelectedProfileId(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                id="profile-picker-dropdown"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.registrationNumber})</option>
                ))}
              </select>
            </div>
          </div>

          {activeStats ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5" id="profile-ally-dashboard">
              {/* Virtual Badge Card preview */}
              <div className="md:col-span-5 p-4 rounded-xl border border-slate-800 bg-slate-950/60 relative overflow-hidden flex flex-col justify-between min-h-[170px]" id="virtual-badge-card">
                <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl" />
                
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold font-mono tracking-widest text-teal-500 uppercase bg-teal-500/15 px-2 py-0.5 rounded border border-teal-500/10">NESA PORTAL PROFILE</span>
                    <h4 className="text-sm font-bold text-white tracking-tight leading-snug mt-2">{activeStats.student.name}</h4>
                    <p className="text-[11px] font-mono text-slate-500">{activeStats.student.registrationNumber}</p>
                  </div>
                  <UserCheck className="w-4 h-4 text-emerald-500" />
                </div>

                <div className="border-t border-slate-900 pt-3 mt-3 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] text-slate-600 font-mono block uppercase">Competency Class</span>
                    <span className="text-xs font-semibold text-slate-350">{activeStats.badgeLabel}</span>
                  </div>
                  <div className={`px-2 py-1 rounded text-[9px] font-mono font-bold uppercase border ${activeStats.badgeColor}`}>
                    {activeStats.totalCompleted >= 2 ? "VERIFIED" : "ROOKIE"}
                  </div>
                </div>
              </div>

              {/* Statistics summaries for selected profile */}
              <div className="md:col-span-7 grid grid-cols-2 gap-3" id="student-live-metrics">
                <div className="p-3 bg-slate-950/20 border border-slate-850 rounded-lg flex flex-col justify-center">
                  <span className="text-[10px] uppercase font-mono text-slate-500 block">Assessment Records</span>
                  <span className="text-xl font-bold text-white mt-1 font-mono">{activeStats.totalCompleted} <span className="text-xs text-slate-500 font-sans">done</span></span>
                  <p className="text-[9px] text-slate-500 leading-tight mt-1">Both sandbox practices and official exams combined.</p>
                </div>

                <div className="p-3 bg-slate-950/20 border border-slate-850 rounded-lg flex flex-col justify-center">
                  <span className="text-[10px] uppercase font-mono text-slate-500 block">Mean Score Rating</span>
                  <span className="text-xl font-bold text-teal-400 mt-1 font-mono">
                    {activeStats.averageScore > 0 ? `${activeStats.averageScore}%` : "No Records"}
                  </span>
                  <p className="text-[9px] text-slate-500 leading-tight mt-1">Minimum target required to clear standard Level 5 is 70%.</p>
                </div>

                <div className="p-3 bg-slate-950/20 border border-slate-850 rounded-lg flex flex-col justify-center">
                  <span className="text-[10px] uppercase font-mono text-slate-500 block">Assigned Exams Sheet</span>
                  <span className="text-xs font-semibold text-slate-350 mt-1 flex items-center gap-1">
                    <strong>{activeStats.assignedCount}</strong> Allocated papers
                  </span>
                  <p className="text-[9px] text-slate-500 leading-tight mt-1">{activeStats.pendingCount} papers currently pending response.</p>
                </div>

                <div className="p-3 bg-slate-950/20 border border-slate-850 rounded-lg flex flex-col justify-center">
                  <span className="text-[10px] uppercase font-mono text-slate-500 block">Academic Milestones</span>
                  <span className="text-[11px] font-semibold text-amber-400 mt-1 flex items-center gap-1.5 font-mono">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    {activeStats.totalCompleted >= 5 ? "L5 Grandmaster" : activeStats.totalCompleted >= 2 ? "Qualified Intern" : "No Milestones Yet"}
                  </span>
                  <p className="text-[9px] text-slate-500 leading-tight mt-1">Milestones unlock as you take mock assessments.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-slate-500 text-xs">
              Add registered profiles from the Admin and Student tab.
            </div>
          )}
        </div>


        {/* MESSAGE & STUDY BROADCAST CENTER */}
        <div className="border border-slate-850 bg-slate-900/45 rounded-2xl p-5 space-y-4 shadow-lg shadow-black/10" id="message-center-pane">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3" id="message-header">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/15">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">NESA Message Center & Announcement Board</h3>
                <p className="text-[11px] text-slate-400 font-mono text-left">Academic bulletin wall for Level 5 teachers, coaches, and peer groups.</p>
              </div>
            </div>

            <button 
              onClick={loadPlazaData} 
              className="p-1.5 text-slate-500 hover:text-slate-350 hover:bg-slate-850/60 rounded-lg transition"
              id="refesh-messages-board"
              title="Refresh messages Board"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Form to post a message */}
          <form onSubmit={handleSendMessage} className="bg-slate-950/60 border border-slate-850 rounded-xl p-3.5 space-y-3" id="broadcast-message-form">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* If no selected profile, let them type. If selected profile, locks it in for security! */}
              <div className="sm:w-1/3">
                <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Acting Identity Role</label>
                <div className="px-3 py-2 bg-slate-950 border border-slate-900 rounded-lg text-xs font-semibold text-slate-300">
                  {students.find(s => s.id === selectedProfileId)?.name || "External Candidate"}
                </div>
              </div>

              {/* Tag subject related query */}
              <div className="sm:w-2/3">
                <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Relate Message to L5 Curriculum</label>
                <select
                  value={selectedTagModuleId}
                  onChange={(e) => setSelectedTagModuleId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none"
                  id="relate-to-tvet-module"
                >
                  <option value="" className="bg-slate-950">None - General Administration Announcement</option>
                  {modules.map(m => (
                    <option key={m.id} value={m.id} className="bg-slate-950">{m.code}: {m.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="relative">
              <input 
                type="text" 
                maxLength={240}
                placeholder="Broadcast a query, learning tip, or note (Max 240 symbols)..."
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 focus:outline-none rounded-lg pl-3 pr-10 py-2.5 text-xs text-slate-200 placeholder-slate-650"
                id="text-body-broadcast"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 p-1.5 bg-indigo-600 hover:bg-indigo-550 hover:scale-105 active:scale-95 text-white rounded-md transition outline-none cursor-pointer"
                id="btn-broadcast-submit"
                title="Post Message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Messages Feed View */}
          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1" id="messages-stream-list">
            {messages.length > 0 ? (
              [...messages].reverse().map((msg) => {
                const isAdmin = msg.role === "admin";
                return (
                  <div 
                    key={msg.id} 
                    className={`p-3.5 rounded-xl border leading-relaxed ${
                      isAdmin 
                        ? "bg-amber-500/5 border-amber-500/20 text-slate-200" 
                        : "bg-slate-950/40 border-slate-850 text-slate-350"
                    }`}
                    id={`portal-msg-${msg.id}`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${isAdmin ? "text-amber-405" : "text-white"}`}>
                          {msg.sender}
                        </span>
                        
                        {isAdmin && (
                          <span className="bg-amber-550/10 text-amber-400 border border-amber-500/20 text-[8px] font-bold font-mono px-1.5 py-0.5 rounded uppercase">
                            FACULTY
                          </span>
                        )}

                        {msg.subjectTitle && (
                          <span className="bg-slate-850 text-slate-400 text-[8px] border border-slate-800 font-mono font-semibold px-2 py-0.5 rounded">
                            {msg.subjectTitle}
                          </span>
                        )}
                      </div>

                      <span className="text-[9px] font-mono text-slate-500">{msg.timestamp}</span>
                    </div>

                    <p className="text-xs text-left leading-relaxed text-slate-300">{msg.text}</p>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6 text-slate-650 text-xs border border-dashed border-slate-850 rounded-xl">
                The message center feed is vacant. Post your first study broadcast note above!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT PORTION (4 COLS): LIVE CANDIDATES FEED */}
      <div className="lg:col-span-4" id="online-monitor-pane">
        <div className="border border-slate-850 bg-slate-900/45 rounded-2xl p-5 space-y-4 shadow-lg shadow-black/10 min-h-full">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-3" id="online-header">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">Online Candidate Monitor</h3>
                <p className="text-[11px] text-slate-400 font-mono text-left">Simulated real-time status tracker.</p>
              </div>
            </div>

            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              {onlineStatus.filter(o => o.status === "active").length} LIVE
            </span>
          </div>

          <div className="space-y-3" id="online-candidates-stream">
            {students.length > 0 ? (
              students.map((student) => {
                const liveItem = onlineStatus.find(o => o.studentId === student.id);
                const statusType = liveItem ? liveItem.status : "away";
                
                let statusColor = "bg-slate-500";
                let statusBorder = "border-slate-800";
                let badgeText = "OFFLINE";

                if (statusType === "active") {
                  statusColor = "bg-emerald-500 animate-pulse";
                  statusBorder = "border-emerald-500/25";
                  badgeText = "ONLINE";
                } else if (statusType === "busy") {
                  statusColor = "bg-rose-500";
                  statusBorder = "border-rose-500/25";
                  badgeText = "BUSY";
                } else if (statusType === "away") {
                  statusColor = "bg-amber-500";
                  statusBorder = "border-amber-500/25";
                  badgeText = "AWAY";
                }

                return (
                  <div 
                    key={student.id} 
                    className="p-3 bg-slate-950/50 border border-slate-850/80 rounded-xl flex items-center justify-between gap-3 transition hover:border-slate-800 hover:bg-slate-950"
                    id={`active-track-candidate-${student.id}`}
                  >
                    <div className="flex items-center gap-2.5">
                      {/* Interactive circular avatar */}
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-slate-850 text-white border border-slate-800 text-[10px] font-bold flex items-center justify-center font-mono">
                          {student.name.split(" ").map(w => w[0]).join("")}
                        </div>
                        {/* Status blinking indicator */}
                        <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-slate-950 ${statusColor}`} />
                      </div>

                      <div className="text-left">
                        <h4 className="text-xs font-bold text-slate-200">{student.name}</h4>
                        <span className="text-[9px] font-mono text-slate-500 block leading-tight">{student.registrationNumber}</span>
                        {liveItem && (
                          <span className="text-[10px] text-slate-400 mt-1 block flex items-center gap-1">
                            <Compass className="w-3 h-3 text-slate-500 shrink-0" />
                            {liveItem.lastAction}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                        statusType === "active" 
                          ? "bg-emerald-505/5 border-emerald-500/25 text-emerald-400"
                          : statusType === "busy"
                            ? "bg-rose-505/5 border-rose-500/25 text-rose-450"
                            : "bg-amber-505/5 border-amber-500/25 text-amber-400"
                      }`}>
                        {badgeText}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6 text-slate-650 text-xs border border-dashed border-slate-850 rounded-xl">
                No students enrolled yet. Set up one in the Admin Center!
              </div>
            )}
          </div>

          <div className="bg-slate-950/20 border border-slate-850 text-slate-450 p-3 rounded-xl text-[10px] leading-relaxed select-none text-left" id="live-plaza-help">
            <span className="font-semibold text-slate-400 flex items-center gap-1 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              National L5 Competency Guidelines
            </span>
            Rwanda SWD students can log in from their TVET campuses to practice and receive alerts directly via the broadcast center. Mock examination logs are saved instantly to build dynamic profile ranks.
          </div>
        </div>
      </div>
    </div>
  );
}
