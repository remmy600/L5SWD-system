import React from "react";
import { 
  Trophy, User, Award, ShieldAlert, Sparkles, BookOpen, 
  MapPin, CheckCircle2, ShieldCheck, Mail, Globe, Cpu, Github, Linkedin, Briefcase
} from "lucide-react";

export default function ProjectBrief() {
  const objectives = [
    { title: "Improve Student Prep", desc: "Reduce exam day preparation time by 60% through structured simulations.", done: true },
    { title: "Realistic NESA Simulations", desc: "Mock examinations meticulously crafted around national level assessment formats.", done: true },
    { title: "Digital Assessment Suite", desc: "Allow educators to easily upload notes, manage syllabi, and assign practice sheets.", done: true },
    { title: "Automated Academic Tracker", desc: "Track exact learning hours, completed topics, mock stats, and weak spots in real-time.", done: true },
    { title: "Bridging Students & Faculty", desc: "Integrated discussion plaza, chat assistant, and faculty notice bulletins.", done: true }
  ];

  const featuresList = [
    "Theory Learning Moodle Center",
    "Smart Resource Recommendations",
    "Mock Examination Simulator",
    "Auto-Grading and Marking System",
    "PDF Booklets Upload Parser",
    "Authentic NESA Certificate Engine",
    "Weekly Performance Leaderboards",
    "Multi-Role Switcher Sandbox",
    "Academic Notices Bulletin",
    "Interactive Study Flashcards",
    "Anti-Cheating Activity Watchdog",
    "Dual (Light/Dark) Moodle Themes"
  ];

  return (
    <div className="space-y-6 animate-fade-in" id="project-brief-container">
      
      {/* Upper Grid: Hero banner and Student TVET ID card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Project Description (8 cols) */}
        <div className="lg:col-span-8 border border-slate-800 bg-slate-900/40 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xl shadow-black/10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-indigo-505/10 bg-indigo-500/10 text-indigo-400 border border-indigo-500/15 text-[10px] font-mono uppercase tracking-wider font-extrabold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                Featured Project Submission
              </span>
              <span className="text-[10px] font-mono text-slate-500">• TVET National Level 5 SWD</span>
            </div>
            
            <div className="text-left">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                L5SWD Exam Practice Portal
              </h2>
              <p className="text-xs sm:text-sm font-mono text-indigo-400 mt-1">
                Advanced learning management platform designed for Rwanda TVET Software Development students
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans text-left">
              The L5SWD Exam Practice Portal is a sophisticated, web-based examination and learning system designed to prepare Software Development students for their final TVET national examinations. Through realistic NESA-style simulations, dynamic study resources, auto-marking, and real-time performance analytics, the system addresses exam anxiety and raises academic achievement.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-slate-800/80 pt-5 mt-4 text-left">
              <div>
                <span className="text-[10px] font-mono text-slate-500 block uppercase font-bold">Project Architecture</span>
                <span className="text-xs text-slate-300 font-semibold">Full-Stack (Vite + Node)</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-500 block uppercase font-bold">Database Model</span>
                <span className="text-xs text-slate-300 font-semibold">Indexed Local Storage Eng.</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-500 block uppercase font-bold">Active Campus Target</span>
                <span className="text-xs text-slate-300 font-semibold">NESA national cohort</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/45 border border-slate-804/40 border-slate-800 p-4 rounded-xl mt-6">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1 text-left flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              Rwanda's Digital Education Vision
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed text-left">
              By transitioning administrative assessments to intuitive offline-synchronized platforms, we reduce training costs, generate instantaneous feedback reports, and directly drive Rwanda's TVET transformation initiatives.
            </p>
          </div>
        </div>

        {/* Developer ID Card (4 cols) */}
        <div className="lg:col-span-4" id="developer-id-card-wrapper">
          <div className="border border-indigo-500/25 bg-gradient-to-b from-indigo-950/20 to-slate-900/60 rounded-2xl p-5 relative shadow-xl shadow-indigo-950/10 flex flex-col justify-between h-full">
            
            {/* Hologram or badge effect top right */}
            <div className="absolute top-4 right-4 text-emerald-400 opacity-60 flex flex-col items-end">
              <ShieldCheck className="w-8 h-8" />
              <span className="text-[8px] font-mono mt-1 uppercase font-bold text-emerald-300">TVET SECURED</span>
            </div>

            {/* TVET Board Header */}
            <div className="text-left mb-6 border-b border-slate-800/80 pb-3">
              <h3 className="text-xs font-bold text-slate-200">RWANDA TVET BOARD</h3>
              <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">National Student Smart ID</p>
            </div>

            {/* Profile Avatar and core info row */}
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-4">
                {/* Simulated professional avatar */}
                <div className="w-16 h-16 rounded-xl border-2 border-indigo-500 bg-slate-950 flex items-center justify-center text-indigo-400 overflow-hidden shrink-0 relative shadow-inner">
                  <User className="w-8 h-8 mt-2" />
                  <div className="absolute bottom-0 inset-x-0 bg-indigo-600 text-white text-[7px] font-mono uppercase text-center py-0.5">
                    LEVEL 4
                  </div>
                </div>

                <div className="text-left">
                  <span className="text-[9px] uppercase font-mono bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-1.5 py-0.5 rounded leading-none inline-block">
                    TOXIC CODERKILLER
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1 leading-snug">Remmy Nsanzimana</h4>
                  <p className="text-[10px] text-slate-400">Software Development Student</p>
                </div>
              </div>

              {/* ID Metadata checklist */}
              <div className="space-y-2 pt-3 border-t border-slate-800/40 text-left text-xs">
                <div className="flex justify-between font-mono py-0.5">
                  <span className="text-slate-500 text-[10px]">PROGRAM</span>
                  <span className="text-slate-300 font-semibold text-right">Software Dev (SWD)</span>
                </div>
                <div className="flex justify-between font-mono py-0.5">
                  <span className="text-slate-500 text-[10px]">CURRENT LEVEL</span>
                  <span className="text-slate-300 font-semibold text-right">L4 Software Development</span>
                </div>
                <div className="flex justify-between font-mono py-0.5">
                  <span className="text-slate-500 text-[10px]">SPECIALIZATION</span>
                  <span className="text-slate-300 font-semibold text-right text-[11px]">Full-Stack, Databases, EdTech</span>
                </div>
                <div className="flex justify-between font-mono py-0.5">
                  <span className="text-slate-500 text-[10px]">SYSTEM ROLES</span>
                  <span className="text-slate-300 font-semibold text-right text-[10px]">System Designer, Dev, DBA</span>
                </div>
              </div>
            </div>

            {/* Contact indicators footer */}
            <div className="border-t border-slate-800/80 pt-4 mt-6 flex justify-between items-center text-slate-500">
              <span className="text-[9px] font-mono text-left">REG: TVET/L4/SWD/2026/091</span>
              <div className="flex gap-2.5">
                <a href="mailto:remmynsanzimana@gmail.com" className="hover:text-white transition" title="Get in touch via Email">
                  <Mail className="w-3.5 h-3.5" />
                </a>
                <span className="hover:text-white transition cursor-pointer" title="Developer Portfolio">
                  <Briefcase className="w-3.5 h-3.5" />
                </span>
                <span className="hover:text-white transition cursor-pointer" title="Verified Dev Credentials">
                  <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Grid: Objectives and Features Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Objectives Center */}
        <div className="border border-slate-800 bg-slate-900/40 rounded-2xl p-5 text-left space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <BookOpen className="w-4.5 h-4.5 text-indigo-450 text-indigo-400" />
            Key Strategic Objectives
          </h3>

          <div className="space-y-4">
            {objectives.map((obj, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{obj.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{obj.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Matrix Shelf */}
        <div className="border border-slate-800 bg-slate-900/40 rounded-2xl p-5 text-left space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Cpu className="w-4.5 h-4.5 text-indigo-450 text-indigo-400" />
            Implemented Premium LMS Capabilities
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {featuresList.map((feat, i) => (
              <div key={i} className="flex items-center gap-2 text-slate-300 text-xs py-1 px-2.5 bg-slate-950/35 border border-slate-900 rounded-lg">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="truncate font-medium">{feat}</span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-indigo-950/25 border border-indigo-900/35 text-[11px] text-indigo-400 rounded-xl leading-relaxed mt-2">
            <strong>System Performance Guarantee:</strong> Registered practice metrics sync directly with high-contrast performance diagnostics and charts, mirroring a fully featured premium TVET educational framework.
          </div>
        </div>
      </div>

    </div>
  );
}
