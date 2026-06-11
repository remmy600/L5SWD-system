import React, { useState, useEffect } from "react";
import { getMergedQuestions, getMergedModules, getStudents, getAssignedExams, updateAssignedExamStatus } from "../lib/dynamicData";
import { Question, ExamSession, MockHistoryItem, Student, AssignedExam } from "../types";
import { 
  Timer, Brain, CheckCircle, AlertTriangle, Play, HelpCircle, 
  ArrowRight, Award, RefreshCw, ChevronRight, FileText, ChevronDown, BookOpen, AlertCircle, Users, CheckCircle2
} from "lucide-react";

interface MockExamSimulatorProps {
  onExamSaved: () => void;
}

export default function MockExamSimulator({ onExamSaved }: MockExamSimulatorProps) {
  // Dynamic datasets synced state
  const [modules, setModules] = useState(() => getMergedModules());
  const [questions, setQuestions] = useState(() => getMergedQuestions());
  const [students, setStudents] = useState(() => getStudents());
  const [assignedExams, setAssignedExams] = useState(() => getAssignedExams());

  const [setupMode, setSetupMode] = useState<"practice" | "assigned">("practice");
  const [selectedStudentId, setSelectedStudentId] = useState("");

  // Exam states
  const [step, setStep] = useState<"setup" | "active" | "result">("setup");
  const [examType, setExamType] = useState<"full" | "module" | "ai">("full");
  const [selectedModuleId, setSelectedModuleId] = useState<string>(() => {
    const list = getMergedModules();
    return list[0]?.id || "web_dev";
  });
  const [studentName, setStudentName] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Active exam session states
  const [currentSession, setCurrentSession] = useState<ExamSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // Maps question.id to selected answer
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [timerActive, setTimerActive] = useState(false);
  const [durationTakenSeconds, setDurationTakenSeconds] = useState(0);

  // Sync / refresh datasets on setup load
  useEffect(() => {
    if (step === "setup") {
      const stdList = getStudents();
      const mods = getMergedModules();
      setStudents(stdList);
      setAssignedExams(getAssignedExams());
      setModules(mods);
      setQuestions(getMergedQuestions());

      if (stdList.length > 0 && !selectedStudentId) {
        setSelectedStudentId(stdList[0].id);
      }
      if (mods.length > 0 && !selectedModuleId) {
        setSelectedModuleId(mods[0].id);
      }
    }
  }, [step]);


  // Result state
  const [completedSession, setCompletedSession] = useState<{
    historyItem: MockHistoryItem;
    allQuestions: Question[];
  } | null>(null);
  const [expandedSolutions, setExpandedSolutions] = useState<Record<string, boolean>>({});

  // Countdown clock effect
  useEffect(() => {
    let interval: any = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        setDurationTakenSeconds(prev => prev + 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      handleFinishExam(); // Auto submit on timer runout
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  // Start exam builder
  const handleStartExam = async () => {
    setLoading(true);
    let sessionQuestions: Question[] = [];
    let title = "";
    let durationMinutes = 15; // default 15 mins for practice

    try {
      if (examType === "full") {
        // Collect a fair batch from all categories
        sessionQuestions = [...questions].sort(() => 0.5 - Math.random()).slice(0, 12);
        title = "National L5SWD Written Exam Simulation";
        durationMinutes = 20;
      } else if (examType === "module") {
        // Filter by selected module
        sessionQuestions = questions.filter(q => q.moduleId === selectedModuleId);
        const moduleName = modules.find(m => m.id === selectedModuleId)?.title || "Subject";
        title = `Subject Quiz: ${moduleName}`;
        durationMinutes = 10;
      } else if (examType === "ai") {
        // Request dynamic quiz from Gemini API
        const moduleName = modules.find(m => m.id === selectedModuleId)?.title || "Subject";
        const response = await fetch("/api/gemini/quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            moduleId: selectedModuleId,
            moduleName,
            quantity: 5
          })
        });

        const data = await response.json();
        if (response.ok && data.questions && data.questions.length > 0) {
          sessionQuestions = data.questions.map((q: any, index: number) => ({
            id: q.id || `ai_q_${index}`,
            moduleId: selectedModuleId,
            type: q.type || "multiple_choice",
            questionText: q.questionText,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation || `Expert syllabus coverage for ${moduleName}`
          }));
          title = `AI-Generated Module Prep (${moduleName})`;
          durationMinutes = 12;
        } else {
          throw new Error(data.error || "No questions came back from AI engine.");
        }
      }

      if (sessionQuestions.length === 0) {
        throw new Error("No questions available for this selection.");
      }

      setCurrentSession({
        id: `session_${Date.now()}`,
        title,
        durationMinutes,
        questions: sessionQuestions,
        isAiGenerated: examType === "ai"
      });

      setAnswers({});
      setCurrentQuestionIndex(0);
      setTimeLeft(durationMinutes * 60);
      setDurationTakenSeconds(0);
      setStep("active");
      setTimerActive(true);
    } catch (err: any) {
      console.error("Exam start error:", err);
      // Fallback if AI fails: notify user and load local module question subset
      alert(`AI Custom generator is offline. Loading the standard offline L5 curriculum module questions for you instead!`);
      const fallbackQuestions = questions.filter(q => q.moduleId === selectedModuleId);
      const moduleName = modules.find(m => m.id === selectedModuleId)?.title || "Subject";
      setCurrentSession({
        id: `session_${Date.now()}`,
        title: `Offline Practice Mode (${moduleName})`,
        durationMinutes: 10,
        questions: fallbackQuestions,
        isAiGenerated: false
      });
      setAnswers({});
      setCurrentQuestionIndex(0);
      setTimeLeft(10 * 60);
      setDurationTakenSeconds(0);
      setStep("active");
      setTimerActive(true);
    } finally {
      setLoading(false);
    }
  };

  const handleStartAssignedExam = (assigned: AssignedExam) => {
    setCurrentSession({
      id: `session_${Date.now()}`,
      title: assigned.examTitle,
      durationMinutes: assigned.durationMinutes,
      questions: assigned.questions,
      isAiGenerated: false,
      assignedExamId: assigned.id // tracks allocation to write back on submit!
    });
    setAnswers({});
    setCurrentQuestionIndex(0);
    setTimeLeft(assigned.durationMinutes * 60);
    setDurationTakenSeconds(0);
    setStep("active");
    setTimerActive(true);
  };

  const handleSelectOption = (questionId: string, option: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const handleTextAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleFinishExam = () => {
    setTimerActive(false);
    if (!currentSession) return;

    let correctCount = 0;
    const itemsToLog: any[] = [];
    const strictness = localStorage.getItem("l5swd_marking_strictness") || "lenient";

    currentSession.questions.forEach(q => {
      const studentAns = (answers[q.id] || "").trim().toLowerCase();
      const correctAns = q.correctAnswer.trim().toLowerCase();
      
      let isCorrect = false;

      if (q.type === "multiple_choice") {
        isCorrect = studentAns === correctAns;
      } else {
        if (strictness === "strict") {
          isCorrect = studentAns === correctAns;
        } else {
          // Lenient substring check
          isCorrect = studentAns.includes(correctAns) || (correctAns.includes(studentAns) && studentAns.length > 1);
        }
      }

      if (isCorrect) {
        correctCount++;
      } else {
        itemsToLog.push({
          questionId: q.id,
          questionText: q.questionText,
          selectedAnswer: answers[q.id] || "No Answer Submitted",
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          moduleId: q.moduleId
        });
      }
    });

    const finalScore = Math.round((correctCount / currentSession.questions.length) * 100);
    const hasPassed = finalScore >= 50; // NESA passing threshold

    const historyItem: MockHistoryItem = {
      id: `record_${Date.now()}`,
      title: currentSession.title,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      score: finalScore,
      totalQuestions: currentSession.questions.length,
      durationTakenSeconds,
      passed: hasPassed,
      moduleId: currentSession.assignedExamId ? "assigned" : (examType === "full" ? "full" : selectedModuleId),
      wrongQuestions: itemsToLog
    };

    // Save to LocalStorage history
    const savedRecords = JSON.parse(localStorage.getItem("l5swd_history") || "[]");
    localStorage.setItem("l5swd_history", JSON.stringify([historyItem, ...savedRecords]));

    // If this represents an assigned exam given by admin, write back status!
    if (currentSession.assignedExamId) {
      updateAssignedExamStatus(currentSession.assignedExamId, "completed", finalScore);
    }

    setCompletedSession({
      historyItem,
      allQuestions: currentSession.questions
    });

    // Reset solution accordion states
    setExpandedSolutions({});
    setStep("result");
    
    // Call dashboard sync callback
    onExamSaved();
  };

  const toggleSolution = (qId: string) => {
    setExpandedSolutions(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remains = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remains.toString().padStart(2, "0")}`;
  };

  return (
    <div className="max-w-3xl mx-auto" id="exam-simulator-box">
      {/* STEP 1: SETUP SCREEN */}
      {step === "setup" && (
        <div className="space-y-6" id="exam-dashboard-selection-layout">
          
          {/* Practice Mode VS Assigned Official Mode Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950/45 border border-slate-850 rounded-xl max-w-md mx-auto" id="setup-mode-tabs">
            <button
              onClick={() => setSetupMode("practice")}
              className={`py-2 px-3 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center justify-center gap-1.5 outline-none ${
                setupMode === "practice" ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-300"
              }`}
              id="btn-mode-practice"
            >
              <Brain className="w-3.5 h-3.5" />
              Practice Simulator
            </button>
            <button
              onClick={() => setSetupMode("assigned")}
              className={`py-2 px-3 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center justify-center gap-1.5 outline-none ${
                setupMode === "assigned" ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-300"
              }`}
              id="btn-mode-assigned"
            >
              <Users className="w-3.5 h-3.5" />
              Assigned Exam Papers
            </button>
          </div>

          {setupMode === "practice" ? (
            <div className="border border-slate-800/80 bg-slate-900/35 rounded-2xl p-6" id="exam-setup-panel">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/15">
                  <Brain className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">NESA Exam Simulator</h2>
                  <p className="text-xs text-slate-400">Validate your Level 5 competency with timed test scenarios.</p>
                </div>
              </div>

              <div className="space-y-4 my-6" id="exam-inputs-rows">
                {/* Student metadata */}
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5 font-semibold">Candidate Reference (Name / Code)</label>
                  <input 
                    type="text" 
                    placeholder="Enter your name or registration code, e.g. REMMY" 
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/80 border border-slate-850 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-sans text-sm"
                    id="exam-candidate-name-input"
                  />
                </div>

                {/* Selection modes */}
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5 font-semibold">Assessment Model</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3" id="exam-modes">
                    <button
                      type="button"
                      onClick={() => setExamType("full")}
                      className={`p-4 rounded-xl border text-left outline-none cursor-pointer transition flex flex-col justify-between ${
                        examType === "full" 
                          ? "border-indigo-500 bg-indigo-500/5 text-white" 
                          : "border-slate-850 text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                      }`}
                      id="btn-exam-full"
                    >
                      <FileText className="w-5 h-5 mb-2 text-indigo-400" />
                      <div>
                        <h4 className="text-sm font-semibold mb-0.5">National Mock</h4>
                        <p className="text-[11px] text-slate-400 leading-snug">Balanced 12-question general curriculum review.</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setExamType("module")}
                      className={`p-4 rounded-xl border text-left outline-none cursor-pointer transition flex flex-col justify-between ${
                        examType === "module" 
                          ? "border-indigo-500 bg-indigo-500/5 text-white" 
                          : "border-slate-850 text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                      }`}
                      id="btn-exam-module"
                    >
                      <BookOpen className="w-5 h-5 mb-2 text-teal-400" />
                      <div>
                        <h4 className="text-sm font-semibold mb-0.5">Subject Quiz</h4>
                        <p className="text-[11px] text-slate-400 leading-snug">Targeted focus on standard local study module.</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setExamType("ai")}
                      className={`p-4 rounded-xl border text-left outline-none cursor-pointer transition flex flex-col justify-between ${
                        examType === "ai" 
                          ? "border-indigo-500 bg-indigo-500/5 text-white" 
                          : "border-slate-850 text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                      }`}
                      id="btn-exam-ai"
                    >
                      <RefreshCw className="w-5 h-5 mb-2 text-amber-400" />
                      <div>
                        <h4 className="text-sm font-semibold mb-0.5">Dynamic AI Exam</h4>
                        <p className="text-[11px] text-slate-400 leading-snug">Generates brand-new test papers using Gemini.</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Subject selector logic for Module & AI exam modes */}
                {(examType === "module" || examType === "ai") && (
                  <div className="bg-slate-950/40 p-4 border border-slate-850 rounded-xl" id="exam-module-dropdown">
                    <label className="block text-xs font-mono uppercase text-slate-500 mb-1.5 font-semibold">Select L5SWD Subject</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" id="modules-grid-picker">
                      {modules.map(mod => (
                        <button
                          key={mod.id}
                          type="button"
                          onClick={() => setSelectedModuleId(mod.id)}
                          className={`px-3 py-2.5 rounded-lg border text-left text-xs font-semibold cursor-pointer outline-none transition ${
                            selectedModuleId === mod.id 
                              ? "border-indigo-500 bg-indigo-500/5 text-slate-200" 
                              : "border-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-850/20"
                          }`}
                          id={`btn-select-exam-mod-${mod.id}`}
                        >
                          <span className="text-[10px] font-mono block text-slate-600 mb-0.5">{mod.code}</span>
                          {mod.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={handleStartExam}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-550 cursor-pointer text-white font-semibold text-sm transition shadow-lg shadow-indigo-650/15 flex items-center justify-center gap-2 outline-none"
                id="btn-exam-start-submit"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Assembling Question Paper...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Begin Examination Session</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* ASSIGNED / GIVEN EXAMS */
            <div className="border border-slate-800/80 bg-slate-900/35 rounded-2xl p-6 space-y-5" id="assigned-setup-panel">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/15">
                  <Users className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Official Given Exams</h2>
                  <p className="text-xs text-slate-400">Sign in to take exams given/assigned to your portal login by your teacher.</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-500 mb-1.5 font-bold">Select Candidate Identity Code</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-sm text-slate-250 focus:outline-none"
                  id="select-identity-student"
                >
                  <option value="" className="bg-slate-950">-- Select Your Registered Portal Profile --</option>
                  {students.map(std => (
                    <option key={std.id} value={std.id} className="bg-slate-950">{std.name} ({std.registrationNumber})</option>
                  ))}
                </select>
              </div>

              {selectedStudentId ? (
                <div className="space-y-3" id="assigned-list">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-4">Your Assigned Examination Sheets</h3>
                  
                  {assignedExams.filter(e => e.targetStudentId === selectedStudentId).length > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                      {assignedExams
                        .filter(e => e.targetStudentId === selectedStudentId)
                        .map(assigned => {
                          const isAssigned = assigned.status === "assigned";
                          return (
                            <div 
                              key={assigned.id} 
                              className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                                isAssigned 
                                  ? "border-purple-500/35 bg-purple-500/5 text-white" 
                                  : "border-slate-850 bg-slate-950/20 text-slate-400"
                              }`}
                              id={`allocated-card-${assigned.id}`}
                            >
                              <div>
                                <h4 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
                                  {assigned.examTitle}
                                  {!isAssigned && (
                                    <span className="px-1.5 py-0.5 rounded text-[8px] bg-slate-850 text-indigo-400 border border-slate-800 font-mono">
                                      PASSED ({assigned.score}%)
                                    </span>
                                  )}
                                </h4>
                                <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1">
                                  <span>Subject: <strong>{modules.find(m => m.id === assigned.moduleId)?.title || assigned.moduleId}</strong></span>
                                  <span>Duration: <strong>{assigned.durationMinutes} minutes</strong></span>
                                  <span>Questions: <strong>{assigned.questions.length}</strong></span>
                                  <span>Given Code: <strong>{assigned.assignedDate}</strong></span>
                                </div>
                              </div>

                              <div>
                                {isAssigned ? (
                                  <button
                                    onClick={() => handleStartAssignedExam(assigned)}
                                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-550 border border-purple-500 cursor-pointer text-white font-semibold text-xs transition flex items-center gap-1.5 whitespace-nowrap"
                                    id={`btn-start-allocated-${assigned.id}`}
                                  >
                                    <Play className="w-3.5 h-3.5" />
                                    <span>Start Exam Sheet</span>
                                  </button>
                                ) : (
                                  <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/5 px-2.5 py-1 rounded border border-emerald-500/10">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Completed
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })
                      }
                    </div>
                  ) : (
                    <div className="text-center py-6 text-slate-600 text-xs border border-dashed border-slate-850 rounded-xl">
                      No active assessments are currently assigned to your registration profile code.
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 border border-dashed border-slate-850 rounded-xl">
                  Select your portal candidate profile from the dropdown selector list to retrieve your issued examination booklets.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* STEP 2: ACTIVE ASSESSMENT EXAM SCREEN */}
      {step === "active" && currentSession && (
        <div className="border border-slate-800/80 bg-slate-900/35 rounded-2xl" id="active-exam-frame">
          {/* Header context info */}
          <div className="p-4 border-b border-slate-800/60 bg-slate-950/20 flex items-center justify-between" id="active-exam-header">
            <div className="truncate pr-4">
              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 font-mono tracking-wider">
                {currentSession.isAiGenerated ? "AI-GENERATED" : "OFFLINE TEST"}
              </span>
              <h3 className="text-sm font-bold text-white leading-tight truncate mt-1">{currentSession.title}</h3>
            </div>
            {/* Clock */}
            <div className="flex items-center gap-2 shrink-0 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-850 font-mono" id="exam-timer-span">
              <Timer className="w-4 h-4 text-rose-400" />
              <span className="text-sm font-bold text-white">{formatTimer(timeLeft)}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="bg-slate-850 h-1.5 w-full relative" id="exam-progress-bar-container">
            <div 
              className="bg-indigo-500 h-full transition-all duration-300" 
              style={{ width: `${((currentQuestionIndex + 1) / currentSession.questions.length) * 100}%` }}
              id="exam-progress-bar-fill"
            />
          </div>

          {/* Core active question area */}
          <div className="p-6" id="active-question-card">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono font-semibold text-indigo-400">Question {currentQuestionIndex + 1} of {currentSession.questions.length}</span>
              <span className="text-slate-600">•</span>
              <span className="text-[10px] font-mono text-slate-500 uppercase">{currentSession.questions[currentQuestionIndex].type.replace("_", " ")}</span>
            </div>

            <h1 className="text-base font-medium text-slate-200 mb-6 leading-relaxed font-sans select-text">
              {currentSession.questions[currentQuestionIndex].questionText}
            </h1>

            {/* If MULTIPLE CHOICE option rendering */}
            {currentSession.questions[currentQuestionIndex].type === "multiple_choice" && currentSession.questions[currentQuestionIndex].options && (
              <div className="space-y-3" id="options-stack">
                {currentSession.questions[currentQuestionIndex].options.map((opt, oIdx) => {
                  const qId = currentSession.questions[currentQuestionIndex].id;
                  const isSelected = answers[qId] === opt;
                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => handleSelectOption(qId, opt)}
                      className={`w-full p-4 rounded-xl text-left border text-sm transition outline-none cursor-pointer flex items-center justify-between ${
                        isSelected 
                          ? "border-indigo-500 bg-indigo-500/5 text-slate-200 font-medium" 
                          : "border-slate-850/80 text-slate-400 hover:text-slate-200 hover:bg-slate-850/10"
                      }`}
                      id={`btn-opt-${oIdx}`}
                    >
                      <span>{opt}</span>
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 border-2 border-slate-900 shrink-0 ml-3"></div>}
                    </button>
                  );
                })}
              </div>
            )}

            {/* If SHORT ANSWER user typing rendering */}
            {currentSession.questions[currentQuestionIndex].type === "short_answer" && (
              <div className="space-y-2" id="input-textarea-shortanswer">
                <label className="block text-xs font-mono text-slate-500">TYPE YOUR DIRECT VERBATIM ANSWER BELOW:</label>
                <textarea
                  placeholder="Provide your technical answer or direct code snippet..."
                  value={answers[currentSession.questions[currentQuestionIndex].id] || ""}
                  onChange={(e) => handleTextAnswerChange(currentSession.questions[currentQuestionIndex].id, e.target.value)}
                  className="w-full h-28 p-3 bg-slate-950/80 border border-slate-850 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-sans leading-relaxed"
                  id="textarea-short-answer-input"
                />
              </div>
            )}
          </div>

          {/* Nav actions footer */}
          <div className="p-4 border-t border-slate-800/60 bg-slate-950/15 flex items-center justify-between rounded-b-2xl" id="exam-navigation-actions">
            <button
              type="button"
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
              className="px-4 py-2 text-xs font-medium cursor-pointer text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
              id="active-exam-prev-btn"
            >
              Back
            </button>

            {currentQuestionIndex < currentSession.questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 border border-slate-700/80 text-white font-medium text-xs transition hover:bg-slate-705/90 cursor-pointer"
                id="active-exam-next-btn"
              >
                Next Section
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinishExam}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-550 cursor-pointer text-white font-semibold text-xs transition outline-none"
                id="active-exam-submit-btn"
              >
                Submit Exam Paper
              </button>
            )}
          </div>
        </div>
      )}

      {/* STEP 3: LOGGED RESULTS VIEW */}
      {step === "result" && completedSession && (
        <div className="space-y-6 animate-fade-in" id="exam-results-panel">
          {/* Summary card header */}
          <div className="border border-slate-800/80 bg-slate-900/35 rounded-2xl p-6 text-center" id="exam-badge-header">
            {completedSession.historyItem.passed ? (
              <div className="flex flex-col items-center">
                <div className="bg-emerald-500/10 text-emerald-400 p-4 rounded-full border border-emerald-500/20 mb-3 animate-pulse">
                  <Award className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Competence Achieved!</h2>
                <p className="text-xs text-slate-400 mt-1">Excellent job. You have passed the NESA simulated benchmark assessment.</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="bg-amber-500/10 text-amber-400 p-4 rounded-full border border-amber-500/20 mb-3">
                  <AlertCircle className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Further Study Necessary</h2>
                <p className="text-xs text-slate-400 mt-1">Passing threshold is 50%. Keep training and utilize booklet resources.</p>
              </div>
            )}

            {/* Scoring visual grid */}
            <div className="grid grid-cols-3 gap-2.5 max-w-sm mx-auto my-6 border border-slate-850 p-4 bg-slate-950/20 rounded-xl text-center" id="score-block-grid">
              <div>
                <p className="text-[10px] font-mono text-slate-500 uppercase leading-none mb-1">Score</p>
                <p className={`text-xl font-bold ${completedSession.historyItem.passed ? "text-emerald-400" : "text-amber-400"}`}>
                  {completedSession.historyItem.score}%
                </p>
              </div>
              <div className="border-x border-slate-850">
                <p className="text-[10px] font-mono text-slate-500 uppercase leading-none mb-1">Time Used</p>
                <p className="text-base font-bold text-slate-300 mt-0.5">
                  {Math.floor(completedSession.historyItem.durationTakenSeconds / 60)}m {completedSession.historyItem.durationTakenSeconds % 60}s
                </p>
              </div>
              <div>
                <p className="text-[10px] font-mono text-slate-500 uppercase leading-none mb-1">Passed</p>
                <p className={`text-base font-bold ${completedSession.historyItem.passed ? "text-emerald-400" : "text-rose-400"}`}>
                  {completedSession.historyItem.passed ? "YES" : "NO"}
                </p>
              </div>
            </div>

            <button
              onClick={() => setStep("setup")}
              className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-550 border border-indigo-500 text-white font-medium text-xs transition cursor-pointer"
              id="btn-return-setup"
            >
              Prepare Another Session
            </button>
          </div>

          {/* Solutions Accordion Section */}
          <div className="border border-slate-800/80 bg-slate-900/15 rounded-2xl p-6" id="exam-solutions-accordion">
            <h3 className="text-sm font-bold text-white border-b border-slate-800/80 pb-3 mb-4">Exam Paper Review & Feedback</h3>
            
            <div className="space-y-4" id="solutions-stack">
              {completedSession.allQuestions.map((q, index) => {
                const studentAns = answers[q.id] || "No Answer Submitted";
                const correctAns = q.correctAnswer;
                const isExpanded = !!expandedSolutions[q.id];
                const strictness = localStorage.getItem("l5swd_marking_strictness") || "lenient";
                
                let isCorrect = false;
                if (q.type === "multiple_choice") {
                  isCorrect = studentAns.trim().toLowerCase() === correctAns.trim().toLowerCase();
                } else {
                  if (strictness === "strict") {
                    isCorrect = studentAns.trim().toLowerCase() === correctAns.trim().toLowerCase();
                  } else {
                    isCorrect = studentAns.trim().toLowerCase().includes(correctAns.trim().toLowerCase()) || 
                                (correctAns.trim().toLowerCase().includes(studentAns.trim().toLowerCase()) && studentAns.trim().length > 1);
                  }
                }

                return (
                  <div key={q.id} className="border border-slate-850 rounded-xl overflow-hidden bg-slate-900/40" id={`review-card-${q.id}`}>
                    <button
                      type="button"
                      onClick={() => toggleSolution(q.id)}
                      className="w-full p-4 text-left outline-none cursor-pointer flex justify-between items-center bg-slate-950/10 hover:bg-slate-905/30 transition"
                      id={`btn-solution-toggle-${q.id}`}
                    >
                      <div className="flex items-start gap-3 truncate pr-4">
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                        )}
                        <p className="text-sm font-medium text-slate-300 truncate select-text">
                          <span className="font-mono text-xs text-slate-500 mr-1.5">Q{index+1}</span>
                          {q.questionText}
                        </p>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </button>

                    {isExpanded && (
                      <div className="p-4 border-t border-slate-850/60 bg-slate-950/40 space-y-3" id={`solution-content-${q.id}`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3" id="student-compare-row">
                          <div className="bg-slate-900 p-3 rounded-lg border border-slate-850 select-text">
                            <span className="text-[10px] uppercase font-mono text-slate-500 font-bold block mb-1">Your response:</span>
                            <span className={`text-xs font-semibold ${isCorrect ? "text-emerald-400" : "text-amber-400"}`}>{studentAns}</span>
                          </div>
                          <div className="bg-slate-900 p-3 rounded-lg border border-slate-850 select-text">
                            <span className="text-[10px] uppercase font-mono text-slate-500 font-bold block mb-1">Approved solution:</span>
                            <span className="text-xs font-semibold text-indigo-400">{correctAns}</span>
                          </div>
                        </div>
                        <div className="pt-2" id="explanation-detail-block">
                          <span className="text-[10px] uppercase font-mono text-slate-500 font-bold block mb-1">Syllabus Breakdown:</span>
                          <p className="text-xs text-slate-400 leading-relaxed font-sans select-text">{q.explanation}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
