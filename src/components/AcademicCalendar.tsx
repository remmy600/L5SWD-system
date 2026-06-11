import React, { useState, useEffect } from "react";
import { 
  getCalendarEvents, 
  saveCalendarEvent, 
  deleteCalendarEvent, 
  getMergedModules 
} from "../lib/dynamicData";
import { CalendarEvent, StudyModule } from "../types";
import { 
  Calendar as CalendarIcon, Clock, Plus, Trash2, Tag, 
  AlertCircle, BookOpen, GraduationCap, MapPin, Sparkles, Trophy
} from "lucide-react";

export default function AcademicCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [modules, setModules] = useState<StudyModule[]>([]);
  const [syncTrigger, setSyncTrigger] = useState(0);

  // Form States
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("2026-06-15"); // default around context
  const [time, setTime] = useState("10:00");
  const [type, setType] = useState<"exam" | "deadline" | "lecture" | "lab">("exam");
  const [description, setDescription] = useState("");
  const [moduleId, setModuleId] = useState("");

  useEffect(() => {
    setEvents(getCalendarEvents());
    setModules(getMergedModules());
  }, [syncTrigger]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    const newEvent: CalendarEvent = {
      id: `ev_${Date.now()}`,
      title: title.trim(),
      date,
      time: time || undefined,
      type,
      description: description.trim(),
      moduleId: moduleId || undefined
    };

    saveCalendarEvent(newEvent);
    
    // Reset Form
    setTitle("");
    setDate("2026-06-15");
    setTime("10:00");
    setType("exam");
    setDescription("");
    setModuleId("");
    setShowAddForm(false);
    
    // Refresh
    setSyncTrigger(prev => prev + 1);
  };

  const handleDelete = (id: string) => {
    deleteCalendarEvent(id);
    setSyncTrigger(prev => prev + 1);
  };

  // Generate helper states to draw June 2026 (starts on Monday June 1st)
  const june2026Days = Array.from({ length: 30 }, (_, i) => i + 1);
  const currentMonthName = "June 2026";

  const getDayEvents = (dayNum: number) => {
    const formattedDay = `2026-06-${dayNum.toString().padStart(2, "0")}`;
    return events.filter(ev => ev.date === formattedDay);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6" id="academic-calendar-container">
      
      {/* LEFT PORTION: FULL INTERACTIVE GRID SCREEN (8 COLS) */}
      <div className="xl:col-span-8 space-y-6">
        <div className="border border-slate-850 bg-slate-900/45 rounded-2xl p-5 shadow-lg shadow-black/10">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-850 pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-indigo-505/10 bg-indigo-500/10 text-indigo-400 border border-indigo-500/15">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-bold text-white tracking-tight">Level 5 Academic Scheduler Grid</h3>
                <p className="text-[11px] font-mono text-slate-400">June 2026 Exam Cycles • National NESA Deadlines</p>
              </div>
            </div>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="py-2 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-550 cursor-pointer text-white font-semibold text-xs transition flex items-center gap-1.5 outline-none"
              id="btn-toggle-event-form"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Milestone</span>
            </button>
          </div>

          {/* Quick Schedule Builder Form Collapse */}
          {showAddForm && (
            <form onSubmit={handleSubmit} className="border border-slate-800 bg-slate-950/75 p-5 rounded-xl mb-5 space-y-4 animate-fade-in" id="add-schedule-form">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Schedule New Academic Milestone Event
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-mono uppercase text-slate-500 font-bold mb-1">Milestone/Examination Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Object Oriented Programming Written Assessment"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    id="input-event-title"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-500 font-bold mb-1">Target Subject Category</label>
                  <select
                    value={moduleId}
                    onChange={(e) => setModuleId(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-250 focus:outline-none"
                    id="select-event-module"
                  >
                    <option value="">General L5 Assessment</option>
                    {modules.map(mod => (
                      <option key={mod.id} value={mod.id}>{mod.code} - {mod.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-500 font-bold mb-1">Calendar Date (June 2026)</label>
                  <input
                    type="date"
                    required
                    min="2026-06-01"
                    max="2026-06-30"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none font-mono"
                    id="input-event-date"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-500 font-bold mb-1">Execution Time (CAT)</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none font-mono"
                    id="input-event-time"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-500 font-bold mb-1">Event Protocol Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-2.5 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none"
                    id="select-event-type"
                  >
                    <option value="exam">Official Written Exam</option>
                    <option value="deadline">NESA Deadline Limit</option>
                    <option value="lecture">Webinar Coaching Seminar</option>
                    <option value="lab">Peer Group Drills Activity</option>
                  </select>
                </div>

                <div className="flex items-end text-left">
                  <button
                    type="submit"
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-550 text-white rounded-lg text-xs font-semibold transition"
                    id="btn-confirm-event"
                  >
                    Save to Tracker
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-500 font-bold mb-1">Milestone Assessment Description/Directives</label>
                <input
                  type="text"
                  placeholder="e.g. Candidates must submit written booklets. Covers database indexing and secondary key limits."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-650 focus:outline-none focus:border-indigo-500"
                  id="input-event-desc"
                />
              </div>
            </form>
          )}

          {/* Elegant 7-column Calendar Grid */}
          <div className="space-y-2 border-t border-slate-850 pt-4" id="calendar-grid-view">
            <div className="flex items-center justify-between mb-3 text-slate-200">
              <span className="text-sm font-extrabold tracking-tight">{currentMonthName} Month Grid</span>
              <span className="text-[10px] font-mono text-slate-500">CAT Timezone</span>
            </div>

            {/* Days of week */}
            <div className="grid grid-cols-7 gap-1 text-center font-mono text-[9px] font-bold text-slate-500 mb-1">
              <span>MON</span>
              <span>TUE</span>
              <span>WED</span>
              <span>THU</span>
              <span>FRI</span>
              <span>SAT</span>
              <span>SUN</span>
            </div>

            {/* In June 2026, June 1st is a Monday */}
            <div className="grid grid-cols-7 gap-1.5" id="grid-dates">
              {june2026Days.map((day) => {
                const dayEvs = getDayEvents(day);
                const isCurrentDay = day === 11; // We know June 11, 2026 is today context!
                
                return (
                  <div 
                    key={day} 
                    className={`min-h-[72px] p-1.5 rounded-lg border flex flex-col justify-between text-left transition select-none ${
                      isCurrentDay 
                        ? "bg-indigo-600/10 border-indigo-500 shadow-sm shadow-indigo-650/10" 
                        : "bg-slate-950/25 border-slate-900 hover:border-slate-800 hover:bg-slate-900/15"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] font-bold font-mono ${isCurrentDay ? "text-indigo-400 font-extrabold" : "text-slate-500"}`}>
                        {day}
                      </span>
                      {isCurrentDay && (
                        <span className="text-[8px] font-bold tracking-wider font-mono text-indigo-400 italic">TODAY</span>
                      )}
                    </div>

                    <div className="space-y-1 mt-1 flex-1 flex flex-col justify-end">
                      {dayEvs.slice(0, 2).map((ev) => {
                        let dotColor = "bg-indigo-500";
                        if (ev.type === "deadline") dotColor = "bg-rose-500";
                        else if (ev.type === "lecture") dotColor = "bg-amber-500";
                        else if (ev.type === "lab") dotColor = "bg-teal-500";

                        return (
                          <div 
                            key={ev.id} 
                            className="text-[9px] font-semibold text-slate-350 truncate px-1 rounded flex items-center gap-1 bg-slate-900 border border-slate-850"
                            title={ev.title}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${dotColor} shrink-0`} />
                            <span className="truncate">{ev.title}</span>
                          </div>
                        );
                      })}
                      {dayEvs.length > 2 && (
                        <span className="text-[8px] font-mono text-slate-500">+{dayEvs.length - 2} more</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PORTION: MILESTONES FEED & ACTIVE NOTIFICATIONS (4 COLS) */}
      <div className="xl:col-span-4" id="calendar-milestones-feed">
        <div className="border border-slate-850 bg-slate-900/45 rounded-2xl p-5 shadow-lg shadow-black/10 flex flex-col justify-between min-h-full space-y-4">
          
          <div className="border-b border-slate-850 pb-3">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2 text-left">
              <Trophy className="w-4 h-4 text-indigo-400" />
              Syllabus Critical Milestones
            </h3>
            <p className="text-[11px] text-slate-500 text-left">Sorted index of scheduled exams & registrations deadlines.</p>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[380px] pr-1" id="milestones-feed-list">
            {events.length > 0 ? (
              [...events]
                .sort((a,b) => a.date.localeCompare(b.date))
                .map((ev) => {
                  let typeLabel = "WRITTEN EXAM";
                  let colorClass = "bg-indigo-500/10 border-indigo-500/20 text-indigo-400";
                  
                  if (ev.type === "deadline") {
                    typeLabel = "NESA DEADLINE";
                    colorClass = "bg-rose-500/10 border-rose-500/20 text-rose-450";
                  } else if (ev.type === "lecture") {
                    typeLabel = "FACULTY SEMINAR";
                    colorClass = "bg-amber-500/10 border-amber-500/20 text-amber-400";
                  } else if (ev.type === "lab") {
                    typeLabel = "PRACTICAL LABS";
                    colorClass = "bg-teal-500/10 border-teal-500/20 text-teal-400";
                  }

                  const matchedMod = modules.find(m => m.id === ev.moduleId);

                  return (
                    <div 
                      key={ev.id} 
                      className="p-3.5 bg-slate-950/55 border border-slate-850 rounded-xl space-y-2 relative"
                      id={`milestone-card-${ev.id}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold tracking-wider border ${colorClass}`}>
                          {typeLabel}
                        </span>
                        
                        <button
                          onClick={() => handleDelete(ev.id)}
                          className="text-slate-600 hover:text-rose-450 transition p-1"
                          title="Remove event"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-left">
                        <h4 className="text-xs font-bold text-white select-text leading-snug">{ev.title}</h4>
                        <p className="text-[10px] text-slate-400 mt-1 select-text line-clamp-2 leading-relaxed">{ev.description}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 pt-2 border-t border-slate-900 font-mono text-[9px] text-slate-500">
                        <span className="flex items-center gap-1 shrink-0">
                          <Plus className="w-3 h-3 text-slate-500 rotate-45 shrink-0" />
                          {ev.date}
                        </span>
                        {ev.time && (
                          <span className="flex items-center gap-1 shrink-0">
                            <Clock className="w-3 h-3 text-slate-550 shrink-0" />
                            {ev.time}
                          </span>
                        )}
                        {matchedMod && (
                          <span className="bg-slate-900 border border-slate-850 px-1.5 py-0.5 rounded text-[8.5px] font-sans font-semibold text-slate-400 truncate max-w-[120px]">
                            {matchedMod.title}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
            ) : (
              <div className="text-center py-6 text-slate-650 text-xs border border-dashed border-slate-850 rounded-xl">
                All timeline blocks are clean. Schedule a mock drill above!
              </div>
            )}
          </div>

          <div className="bg-slate-950/25 border border-slate-850 p-3 rounded-xl space-y-1.5" id="timeline-calendar-footer">
            <span className="text-[10px] uppercase font-mono text-slate-400 font-bold flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-indigo-400" />
              Syllabus Notice Board
            </span>
            <p className="text-[9.5px] text-slate-500 leading-relaxed text-left">
              Milestone events registered onto the TVET Academic Planner synchronise globally to allow Level 5 Software Development students to correctly manage their written exams preparations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
