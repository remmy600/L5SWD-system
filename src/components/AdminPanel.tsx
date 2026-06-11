import React, { useState, useEffect } from "react";
import { 
  Users, BookOpen, Clock, Plus, Upload, Trash2, FileText, CheckCircle, 
  AlertCircle, Shield, Award, HelpCircle, FilePlus, Play, CheckCircle2, ListFilter
} from "lucide-react";
import { Student, StudyModule, Question, AssignedExam, PortalMessage } from "../types";
import { 
  getStudents, saveStudent, getMergedModules, saveCustomModule, 
  getMergedQuestions, saveCustomQuestions, getAssignedExams, saveAssignedExam,
  getPortalMessages, savePortalMessage
} from "../lib/dynamicData";

interface AdminPanelProps {
  onDataChanged: () => void;
}

export default function AdminPanel({ onDataChanged }: AdminPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<"students" | "subjects" | "assigned" | "announcements" | "resources">("students");
  
  // Data lists
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<StudyModule[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [assignedExams, setAssignedExams] = useState<AssignedExam[]>([]);

  // Resource Uploader form states
  const [customResources, setCustomResources] = useState<any[]>([]);
  const [resTitle, setResTitle] = useState("");
  const [resSubject, setResSubject] = useState("");
  const [resDifficulty, setResDifficulty] = useState<"beginner" | "intermediate" | "expert">("intermediate");
  const [resFileType, setResFileType] = useState<"pdf" | "docx" | "pptx">("pdf");
  const [resDescription, setResDescription] = useState("");
  const [resTopic, setResTopic] = useState("General Notes");
  const [resAuthor, setResAuthor] = useState("Teacher (Safari)");
  const [resSuccessMsg, setResSuccessMsg] = useState("");
  const [resUploadedFile, setResUploadedFile] = useState<{ name: string; size: string; type: string } | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // New Student Form state
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentReg, setNewStudentReg] = useState("");
  const [studentSuccessMsg, setStudentSuccessMsg] = useState("");

  // New Subject Form state
  const [newSubTitle, setNewSubTitle] = useState("");
  const [newSubCode, setNewSubCode] = useState("");
  const [newSubDesc, setNewSubDesc] = useState("");
  const [newSubTopicTitle, setNewSubTopicTitle] = useState("");
  const [newSubTopicDetails, setNewSubTopicDetails] = useState("");
  const [subjectSuccessMsg, setSubjectSuccessMsg] = useState("");

  // New Question Form state
  const [qSubjectId, setQSubjectId] = useState("");
  const [qType, setQType] = useState<"multiple_choice" | "short_answer">("multiple_choice");
  const [qText, setQText] = useState("");
  const [qOp1, setQOp1] = useState("");
  const [qOp2, setQOp2] = useState("");
  const [qOp3, setQOp3] = useState("");
  const [qOp4, setQOp4] = useState("");
  const [qCorrect, setQCorrect] = useState("");
  const [qExplain, setQExplain] = useState("");
  const [questionSuccessMsg, setQuestionSuccessMsg] = useState("");

  // Give/Assign Exam Form state
  const [assignStudentId, setAssignStudentId] = useState("");
  const [assignSubjectId, setAssignSubjectId] = useState("");
  const [assignTitle, setAssignTitle] = useState("");
  const [assignDuration, setAssignDuration] = useState(15);
  const [assignSuccessMsg, setAssignSuccessMsg] = useState("");

  // File upload state for custom JSON questions
  const [uploadJsonString, setUploadJsonString] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  // Faculty announcements & auto grading states
  const [announcementText, setAnnouncementText] = useState("");
  const [announceModuleId, setAnnounceModuleId] = useState("");
  const [announcementSuccess, setAnnouncementSuccess] = useState("");
  const [portalMessages, setPortalMessages] = useState<PortalMessage[]>([]);
  const [markingStrictness, setMarkingStrictness] = useState<"lenient" | "strict">("lenient");

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = () => {
    const stds = getStudents();
    const subs = getMergedModules();
    const qsts = getMergedQuestions();
    const exms = getAssignedExams();
    const msgs = getPortalMessages();
    const strictVal = localStorage.getItem("l5swd_marking_strictness") || "lenient";

    setStudents(stds);
    setSubjects(subs);
    setQuestions(qsts);
    setAssignedExams(exms);
    setPortalMessages(msgs);
    setMarkingStrictness(strictVal as "lenient" | "strict");

    // Load custom resources
    const savedCustomRes = JSON.parse(localStorage.getItem("l5_custom_uploaded_resources") || "[]");
    setCustomResources(savedCustomRes);

    // Default select
    if (subs.length > 0 && !qSubjectId) setQSubjectId(subs[0].id);
    if (stds.length > 0 && !assignStudentId) setAssignStudentId(stds[0].id);
    if (subs.length > 0 && !assignSubjectId) setAssignSubjectId(subs[0].id);
    if (subs.length > 0 && !resSubject) setResSubject(subs[0].id);
  };

  // 1. Add Student
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentReg.trim()) return;

    // Check existing Reg
    if (students.some(s => s.registrationNumber.toUpperCase() === newStudentReg.trim().toUpperCase())) {
      alert("A candidate with this Registration Index already exists.");
      return;
    }

    const newStd: Student = {
      id: `std_${Date.now()}`,
      name: newStudentName.trim(),
      registrationNumber: newStudentReg.trim().toUpperCase(),
      addedAt: new Date().toLocaleDateString()
    };

    saveStudent(newStd);
    setNewStudentName("");
    setNewStudentReg("");
    setStudentSuccessMsg(`Candidate '${newStd.name}' registered successfully!`);
    loadAllData();
    onDataChanged();
    setTimeout(() => setStudentSuccessMsg(""), 4000);
  };

  const handleDeleteStudent = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete student candidate: "${name}"?`)) {
      const filtered = students.filter(s => s.id !== id);
      localStorage.setItem("l5swd_students", JSON.stringify(filtered));
      loadAllData();
      onDataChanged();
    }
  };

  // 2. Add Subject
  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubTitle.trim() || !newSubCode.trim() || !newSubDesc.trim()) return;

    const refinedId = newSubTitle.toLowerCase().replace(/[^a-z0-9]/g, "_");
    
    // Check duplication
    if (subjects.some(s => s.id === refinedId || s.code.toUpperCase() === newSubCode.trim().toUpperCase())) {
      alert("A subject with this title/code already exists.");
      return;
    }

    const newModule: StudyModule = {
      id: refinedId,
      title: newSubTitle.trim(),
      code: newSubCode.trim().toUpperCase(),
      description: newSubDesc.trim(),
      topics: [
        {
          title: newSubTopicTitle.trim() || "Prereq Concept Outline",
          details: newSubTopicDetails.trim() || "Essential foundation requirements of this active technical topic outline."
        }
      ],
      cheatSheet: [
        {
          commandOrConcept: "Subject Overview",
          definition: `Core framework syllabus guidelines mapped for ${newSubTitle}.`
        }
      ],
      flashcards: [
        {
          question: `What represents the main study focus of ${newSubTitle}?`,
          answer: newSubDesc.trim()
        }
      ]
    };

    saveCustomModule(newModule);
    setNewSubTitle("");
    setNewSubCode("");
    setNewSubDesc("");
    setNewSubTopicTitle("");
    setNewSubTopicDetails("");
    setSubjectSuccessMsg(`Subject '${newModule.title}' successfully injected!`);
    loadAllData();
    onDataChanged();
    setTimeout(() => setSubjectSuccessMsg(""), 4000);
  };

  // 3. Add Custom Single Question
  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qText.trim() || !qCorrect.trim()) {
      alert("Configure question prompt text and valid correct answer.");
      return;
    }

    const isMC = qType === "multiple_choice";
    const optionsArray = isMC ? [qOp1.trim(), qOp2.trim(), qOp3.trim(), qOp4.trim()].filter(Boolean) : undefined;

    if (isMC && (!optionsArray || optionsArray.length < 2)) {
      alert("Multiple choice questions require at least 2 non-empty options.");
      return;
    }

    const finalCorrectAnswer = isMC ? qCorrect.trim() : qCorrect.trim();

    const newQ: Question = {
      id: `custom_q_${Date.now()}`,
      moduleId: qSubjectId,
      type: qType,
      questionText: qText.trim(),
      options: optionsArray,
      correctAnswer: finalCorrectAnswer,
      explanation: qExplain.trim() || "Expert NESA curriculum breakdown."
    };

    saveCustomQuestions([newQ]);
    
    // reset form fields
    setQText("");
    setQOp1("");
    setQOp2("");
    setQOp3("");
    setQOp4("");
    setQCorrect("");
    setQExplain("");
    setQuestionSuccessMsg("Custom questions successfully injected into syllabus pool!");
    loadAllData();
    onDataChanged();
    setTimeout(() => setQuestionSuccessMsg(""), 4000);
  };

  // 4. Give / Assign Exam to Student
  const handleAssignExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignStudentId || !assignSubjectId || !assignTitle.trim()) {
      alert("Provide test title and select candidate and subject targets.");
      return;
    }

    // Pull questions related to the selected subject
    const relatedQuestions = questions.filter(q => q.moduleId === assignSubjectId);
    if (relatedQuestions.length === 0) {
      alert("The selected subject does not have any questions. Please add questions to the subject first!");
      return;
    }

    // Target a set of balanced questions (up to 6)
    const randomized = [...relatedQuestions].sort(() => 0.5 - Math.random()).slice(0, 6);

    const assigned: AssignedExam = {
      id: `assign_${Date.now()}`,
      examTitle: assignTitle.trim(),
      moduleId: assignSubjectId,
      targetStudentId: assignStudentId,
      assignedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      durationMinutes: Number(assignDuration) || 15,
      questions: randomized,
      status: "assigned"
    };

    saveAssignedExam(assigned);
    setAssignTitle("");
    setAssignSuccessMsg(`Exam given/assigned successfully to the student candidate.`);
    loadAllData();
    onDataChanged();
    setTimeout(() => setAssignSuccessMsg(""), 4000);
  };

  const handleDeleteAssignedExam = (id: string) => {
    if (confirm("Delete this assigned examination allocation?")) {
      const filtered = assignedExams.filter(e => e.id !== id);
      localStorage.setItem("l5swd_assigned_exams", JSON.stringify(filtered));
      loadAllData();
      onDataChanged();
    }
  };

  // 5. Uploading custom syllabus JSON file
  const handleUploadJson = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError("");
    setUploadSuccess("");

    if (!uploadJsonString.trim()) {
      setUploadError("Standard text value empty. Paste valid assessment JSON formatting first.");
      return;
    }

    try {
      const data = JSON.parse(uploadJsonString.trim());
      
      // Validation schema check
      let records: Question[] = [];
      if (Array.isArray(data)) {
        records = data;
      } else if (data.questions && Array.isArray(data.questions)) {
        records = data.questions;
      } else {
        throw new Error("JSON structure must be an array of questions or contain a 'questions' key array.");
      }

      // Check structure of each question
      records.forEach((q, idx) => {
        if (!q.questionText || !q.correctAnswer) {
          throw new Error(`Item at registration index ${idx} lacks 'questionText' or 'correctAnswer' parameters.`);
        }
      });

      // Hydrate with proper IDs and module targets
      const mapped: Question[] = records.map((q, idx) => ({
        id: q.id || `up_q_${Date.now()}_${idx}`,
        moduleId: q.moduleId || qSubjectId,
        type: q.type || "multiple_choice",
        questionText: q.questionText,
        options: q.options || (q.type === "multiple_choice" ? ["Option A", "Option B", "Option C", "Option D"] : undefined),
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || `Manual import alignment for subject: ${qSubjectId}`
      }));

      saveCustomQuestions(mapped);
      setUploadSuccess(`Successfully parsed and uploaded ${mapped.length} exam questions into your database!`);
      setUploadJsonString("");
      loadAllData();
      onDataChanged();
    } catch (err: any) {
      console.error(err);
      setUploadError(`Formatting validation failure: ${err.message}`);
    }
  };

  const getStudentName = (id: string) => {
    return students.find(s => s.id === id)?.name || "Unknown Candidate";
  };

  const getSubjectTitle = (id: string) => {
    return subjects.find(s => s.id === id)?.title || "General Curriculum";
  };

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;

    const matchedMod = subjects.find(s => s.id === announceModuleId);
    const subjectTitle = matchedMod ? matchedMod.title : undefined;

    const newAnnouncement: PortalMessage = {
      id: `announ_${Date.now()}`,
      sender: "Faculty Head (Admin Broadcast)",
      role: "admin",
      isAnnouncement: true,
      text: announcementText.trim(),
      timestamp: new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
      }),
      subjectTitle
    };

    savePortalMessage(newAnnouncement);
    setAnnouncementText("");
    setAnnouncementSuccess("Official announcement dispatched safely to all student dashboards!");
    loadAllData();
    onDataChanged();
    setTimeout(() => setAnnouncementSuccess(""), 4000);
  };

  const handleDeleteMessage = (id: string) => {
    if (confirm("Are you sure you want to delete this message/announcement?")) {
      const messages = getPortalMessages();
      const filtered = messages.filter(m => m.id !== id);
      localStorage.setItem("l5swd_portal_messages", JSON.stringify(filtered));
      loadAllData();
      onDataChanged();
    }
  };

  const handleUpdateMarkingStrictness = (val: "lenient" | "strict") => {
    setMarkingStrictness(val);
    localStorage.setItem("l5swd_marking_strictness", val);
    onDataChanged();
  };

  // 6. Resource Uploader Handlers
  const handleUploadResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTitle.trim() || !resSubject) {
      alert("Please provide at least a Title and Subject Category.");
      return;
    }

    // Determine file extension based on file type
    const ext = `.${resFileType}`;
    const cleanTitle = resTitle.trim();
    const finalTitle = cleanTitle.toLowerCase().endsWith(ext) ? cleanTitle : cleanTitle + ext;

    const fakeFileSize = resUploadedFile 
      ? resUploadedFile.size 
      : `${(Math.random() * 3 + 1).toFixed(1)} MB`;

    const newRes = {
      id: `custom_res_${Date.now()}`,
      title: finalTitle,
      description: resDescription.trim() || `Level 5 dynamic reference paper on ${getSubjectTitle(resSubject)}.`,
      subjectId: resSubject,
      topic: resTopic.trim() || "General Note Resource",
      fileType: resFileType,
      difficulty: resDifficulty,
      author: resAuthor.trim() || "Teacher (Safari)",
      uploadDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      downloads: 0,
      rating: 5.0,
      fileSize: fakeFileSize,
      isPinned: false
    };

    const nextCustom = [newRes, ...customResources];
    setCustomResources(nextCustom);
    localStorage.setItem("l5_custom_uploaded_resources", JSON.stringify(nextCustom));

    setResTitle("");
    setResDescription("");
    setResTopic("General Notes");
    setResUploadedFile(null);
    setResSuccessMsg(`Resource "${finalTitle}" successfully uploaded to candidate folders!`);
    
    // Refresh parent state
    onDataChanged();

    setTimeout(() => {
      setResSuccessMsg("");
    }, 4000);
  };

  const handleDeleteCustomResource = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete the study resource: "${title}"?`)) {
      const nextCustom = customResources.filter(res => res.id !== id);
      setCustomResources(nextCustom);
      localStorage.setItem("l5_custom_uploaded_resources", JSON.stringify(nextCustom));
      onDataChanged();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processSelectedFile(file);
    }
  };

  const processSelectedFile = (file: File) => {
    const name = file.name;
    const lowerName = name.toLowerCase();
    let detectedType: "pdf" | "docx" | "pptx" | null = null;

    if (lowerName.endsWith(".pdf")) {
      detectedType = "pdf";
    } else if (lowerName.endsWith(".docx")) {
      detectedType = "docx";
    } else if (lowerName.endsWith(".pptx")) {
      detectedType = "pptx";
    }

    if (!detectedType) {
      alert("Invalid format! Please upload only standard PDF, DOCX, or PPTX file formats.");
      return;
    }

    const sizeInMB = file.size / (1024 * 1024);
    const sizeStr = `${sizeInMB.toFixed(1)} MB`;

    const dottedIndex = name.lastIndexOf(".");
    const suggestedTitle = dottedIndex !== -1 ? name.substring(0, dottedIndex) : name;

    setResTitle(suggestedTitle);
    setResFileType(detectedType);
    setResUploadedFile({
      name: file.name,
      size: sizeStr,
      type: detectedType
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processSelectedFile(file);
    }
  };

  return (
    <div className="border border-slate-800/80 bg-slate-900/10 backdrop-blur-md rounded-2xl p-5 sm:p-6" id="admin-main-interface-card">
      
      {/* Dynamic Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6" id="admin-panel-head">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/15">
            <Shield className="w-5.5 h-5.5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Admin Control Panel</h2>
            <p className="text-xs text-slate-400">Manage curriculum modules, assign exam papers, and register candidates.</p>
          </div>
        </div>

        {/* Counters */}
        <div className="hidden sm:flex items-center gap-4 text-xs font-mono text-slate-400">
          <span className="px-2 py-1 bg-slate-950/40 rounded border border-slate-850">
            Students: <strong className="text-indigo-400">{students.length}</strong>
          </span>
          <span className="px-2 py-1 bg-slate-950/40 rounded border border-slate-850">
            Subjects: <strong className="text-teal-400">{subjects.length}</strong>
          </span>
        </div>
      </div>

      {/* Admin Panel Nav Subtabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-800/60 pb-1 overflow-x-auto scrollbar-none" id="admin-subtabs-row">
        <button
          onClick={() => setActiveSubTab("students")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition cursor-pointer outline-none ${
            activeSubTab === "students" 
              ? "bg-purple-600 text-white" 
              : "text-slate-400 hover:text-slate-200"
          }`}
          id="subtab-btn-students"
        >
          <Users className="w-4 h-4" />
          Manage Students ({students.length})
        </button>

        <button
          onClick={() => setActiveSubTab("subjects")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition cursor-pointer outline-none ${
            activeSubTab === "subjects" 
              ? "bg-purple-600 text-white" 
              : "text-slate-400 hover:text-slate-200"
          }`}
          id="subtab-btn-subjects"
        >
          <BookOpen className="w-4 h-4" />
          Subjects & Upload Questions
        </button>

        <button
          onClick={() => setActiveSubTab("assigned")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition cursor-pointer outline-none ${
            activeSubTab === "assigned" 
              ? "bg-purple-600 text-white" 
              : "text-slate-400 hover:text-slate-200"
          }`}
          id="subtab-btn-assigned"
        >
          <Clock className="w-4 h-4" />
          Give Exams Monitor ({assignedExams.length})
        </button>

        <button
          onClick={() => setActiveSubTab("announcements")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition cursor-pointer outline-none ${
            activeSubTab === "announcements" 
              ? "bg-purple-600 text-white" 
              : "text-slate-400 hover:text-slate-200"
          }`}
          id="subtab-btn-announcements"
        >
          <AlertCircle className="w-4 h-4" />
          Announcements & Auto-Marking
        </button>

        <button
          onClick={() => setActiveSubTab("resources")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition cursor-pointer outline-none ${
            activeSubTab === "resources" 
              ? "bg-purple-600 text-white" 
              : "text-slate-400 hover:text-slate-200"
          }`}
          id="subtab-btn-resources"
        >
          <Upload className="w-4 h-4" />
          Resource Uploader
        </button>
      </div>

      {/* Pane Content */}
      <div className="min-h-[450px]" id="admin-subpane-view">
        
        {/* SUBTAB 1: MANAGE STUDENTS & GIVE EXAMS FORM */}
        {activeSubTab === "students" && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6" id="students-subtab-container">
            {/* Left Col: Register Student Form */}
            <div className="lg:col-span-2 space-y-5" id="register-student-left-form">
              <div className="bg-slate-950/30 p-5 border border-slate-850 rounded-2xl" id="register-student-panel">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-purple-400" />
                  Add New Candidate
                </h3>

                <form onSubmit={handleAddStudent} className="space-y-3.5" id="form-add-student">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">Candidate Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Jean de Dieu Habimana"
                      value={newStudentName}
                      onChange={(e) => setNewStudentName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                      required
                      id="input-std-fullname"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">Registration Index Code</label>
                    <input
                      type="text"
                      placeholder="e.g., NESA/SWD/2026/04"
                      value={newStudentReg}
                      onChange={(e) => setNewStudentReg(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                      required
                      id="input-std-reg"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 px-4 rounded-xl bg-purple-600 hover:bg-purple-550 cursor-pointer text-white font-semibold text-xs transition"
                    id="btn-add-student-submit"
                  >
                    Register Student Profile
                  </button>
                </form>

                {studentSuccessMsg && (
                  <div className="mt-3 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/15 text-emerald-400 text-xs flex items-center gap-1.5" id="std-success-toast">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{studentSuccessMsg}</span>
                  </div>
                )}
              </div>

              {/* Assign/Give Exam to Student form */}
              <div className="bg-slate-950/30 p-5 border border-slate-850 rounded-2xl" id="assign-exam-panel">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <FilePlus className="w-4.5 h-4.5 text-indigo-400" />
                  Give/Assign Exam paper
                </h3>

                <form onSubmit={handleAssignExam} className="space-y-3.5" id="form-assign-exam">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">Target Candidate</label>
                    <select
                      value={assignStudentId}
                      onChange={(e) => setAssignStudentId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-sm text-slate-400 focus:outline-none"
                      id="select-assign-student"
                    >
                      {students.map(s => (
                        <option key={s.id} value={s.id} className="bg-slate-950">{s.name} ({s.registrationNumber})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">Subject Curriculum Target</label>
                    <select
                      value={assignSubjectId}
                      onChange={(e) => setAssignSubjectId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-sm text-slate-400 focus:outline-none"
                      id="select-assign-subject"
                    >
                      {subjects.map(sub => (
                        <option key={sub.id} value={sub.id} className="bg-slate-950">{sub.title} ({sub.code})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">Exam Title / Paper Code</label>
                    <input
                      type="text"
                      placeholder="e.g., L5SWD Database Practice Quiz"
                      value={assignTitle}
                      onChange={(e) => setAssignTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                      required
                      id="input-assign-title"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">Time Duration (Minutes)</label>
                    <input
                      type="number"
                      min={5}
                      max={90}
                      value={assignDuration}
                      onChange={(e) => setAssignDuration(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                      required
                      id="input-assign-duration"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-550 cursor-pointer text-white font-semibold text-xs transition block text-center"
                    id="btn-assign-exam-submit"
                  >
                    Give Assigned Exam
                  </button>
                </form>

                {assignSuccessMsg && (
                  <div className="mt-3 p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/15 text-indigo-400 text-xs flex items-center gap-1.5" id="assign-success-toast">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{assignSuccessMsg}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Col: Registered Students list table */}
            <div className="lg:col-span-3 space-y-4" id="registered-students-right-table">
              <div className="bg-slate-950/30 p-5 border border-slate-850 rounded-2xl" id="students-list-panel">
                <div className="flex items-center justify-between border-b border-slate-850 pb-2 mb-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Registered Student Portals</h4>
                  <span className="text-[10px] font-mono text-slate-500">{students.length} Candidates</span>
                </div>

                <div className="overflow-x-auto" id="admin-stds-table-scroller">
                  <table className="w-full text-left text-xs text-slate-300 divide-y divide-slate-850/60" id="admin-stds-table">
                    <thead>
                      <tr className="text-slate-500 font-semibold select-none">
                        <th className="pb-2">CANDIDATE NAME</th>
                        <th className="pb-2">REGISTRATION INDEX</th>
                        <th className="pb-2">REGISTERED ON</th>
                        <th className="pb-2 text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850/50">
                      {students.map(s => (
                        <tr key={s.id} className="hover:text-white" id={`std-management-tr-${s.id}`}>
                          <td className="py-3 font-semibold">{s.name}</td>
                          <td className="py-3 font-mono text-indigo-400 text-[11px]">{s.registrationNumber}</td>
                          <td className="py-3 text-slate-500">{s.addedAt}</td>
                          <td className="py-3 text-right">
                            {/* Prevent deleting default diagnostic students unless user wants */}
                            <button
                              onClick={() => handleDeleteStudent(s.id, s.name)}
                              className="text-slate-500 hover:text-rose-400 transition"
                              id={`btn-del-std-${s.id}`}
                              title="Delete Student"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {students.length === 0 && (
                    <div className="text-center py-6 text-slate-600">No active students. Register one using the form on the left.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 2: SUBJECTS, QUESTIONS & DISK UPLOADS */}
        {activeSubTab === "subjects" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="subjects-subtab-container">
            {/* Left Col: Add Subject Module */}
            <div className="space-y-5" id="subjects-left-col">
              <div className="bg-slate-950/30 p-5 border border-slate-850 rounded-2xl" id="subject-manager-panel">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-teal-400" />
                  Add New Subject (Module)
                </h3>

                <form onSubmit={handleAddSubject} className="space-y-4" id="form-add-subject">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">Module Nomenclature Title</label>
                      <input
                        type="text"
                        placeholder="e.g., Embedded Systems"
                        value={newSubTitle}
                        onChange={(e) => setNewSubTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                        required
                        id="input-sub-title"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">Module Code Nomenclature</label>
                      <input
                        type="text"
                        placeholder="e.g., L5_SWD_M07"
                        value={newSubCode}
                        onChange={(e) => setNewSubCode(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                        required
                        id="input-sub-code"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">Comprehensive Description</label>
                    <textarea
                      placeholder="Detail curriculum aspects, standards and goals..."
                      value={newSubDesc}
                      onChange={(e) => setNewSubDesc(e.target.value)}
                      className="w-full h-16 px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                      required
                      id="input-sub-desc"
                    />
                  </div>

                  <div className="border-t border-slate-850 pt-3 space-y-3">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block">Insert Initial Concept Topic (Required)</span>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-mono uppercase text-slate-500 mb-0.5">Topic Title</label>
                        <input
                          type="text"
                          placeholder="e.g., Bootstrapping"
                          value={newSubTopicTitle}
                          onChange={(e) => setNewSubTopicTitle(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-205 focus:outline-none"
                          required
                          id="input-sub-topic-title"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono uppercase text-slate-500 mb-0.5">Topic Details Summary</label>
                        <input
                          type="text"
                          placeholder="e.g., Power cycle testing"
                          value={newSubTopicDetails}
                          onChange={(e) => setNewSubTopicDetails(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-205 focus:outline-none"
                          required
                          id="input-sub-topic-details"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 px-4 rounded-xl bg-teal-600 hover:bg-teal-550 cursor-pointer text-white font-semibold text-xs transition"
                    id="btn-add-subject-submit"
                  >
                    Insert Dynamic Subject
                  </button>
                </form>

                {subjectSuccessMsg && (
                  <div className="mt-3 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/15 text-emerald-400 text-xs flex items-center gap-1.5" id="subject-success-toast">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{subjectSuccessMsg}</span>
                  </div>
                )}
              </div>

              {/* Upload dynamic JSON files mock panel */}
              <div className="bg-slate-950/30 p-5 border border-slate-850 rounded-2xl" id="subject-upload-json-panel">
                <div className="flex items-center gap-2 mb-3">
                  <Upload className="w-5 h-5 text-indigo-400" />
                  <div>
                    <h3 className="text-sm font-bold text-white">Upload Assessment Files (JSON)</h3>
                    <p className="text-[10px] text-slate-550">Directly load complete sets of curriculum mock questions.</p>
                  </div>
                </div>

                <form onSubmit={handleUploadJson} className="space-y-4" id="form-upload-json">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1.5 font-bold">Select Intake Target Subject</label>
                    <select
                      value={qSubjectId}
                      onChange={(e) => setQSubjectId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs text-slate-400 focus:outline-none"
                      id="select-upload-subject"
                    >
                      {subjects.map(sh => (
                        <option key={sh.id} value={sh.id} className="bg-slate-950">{sh.title} ({sh.code})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1.5 font-bold">Paste Raw JSON questions document</label>
                    <textarea
                      placeholder={`[\n  {\n    "type": "multiple_choice",\n    "questionText": "Dynamic question payload...?",\n    "options": ["A", "B", "C", "D"],\n    "correctAnswer": "A",\n    "explanation": "Detailed explanation."\n  }\n]`}
                      value={uploadJsonString}
                      onChange={(e) => setUploadJsonString(e.target.value)}
                      className="w-full h-36 p-3 bg-slate-950 font-mono text-[10px] text-emerald-400 border border-slate-850 rounded-xl focus:outline-none focus:border-indigo-500 leading-relaxed"
                      id="textarea-json-payload"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-550 cursor-pointer text-white font-semibold text-xs transition"
                    id="btn-upload-json-submit"
                  >
                    Upload and Validate Questions
                  </button>
                </form>

                {uploadError && (
                  <div className="mt-3 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/15 text-rose-400 text-xs flex items-center gap-1.5" id="upload-error-toast">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {uploadSuccess && (
                  <div className="mt-3 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/15 text-emerald-400 text-xs flex items-center gap-1.5" id="upload-success-toast">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{uploadSuccess}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Col: Add single question manually form */}
            <div className="space-y-5" id="subjects-right-col">
              <div className="bg-slate-950/30 p-5 border border-slate-850 rounded-2xl" id="add-question-manually-panel">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <FilePlus className="w-4.5 h-4.5 text-indigo-400" />
                  Add Custom Question manually
                </h3>

                <form onSubmit={handleAddQuestion} className="space-y-3.5" id="form-add-question-manual">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1">Target Subject Pool</label>
                      <select
                        value={qSubjectId}
                        onChange={(e) => setQSubjectId(e.target.value)}
                        className="w-full px-2 py-1.5 bg-slate-950 border border-slate-850 rounded-xl text-xs text-slate-455 focus:outline-none"
                        id="select-single-q-subject"
                      >
                        {subjects.map(s => (
                          <option key={s.id} value={s.id} className="bg-slate-950">{s.title}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1">Question Type</label>
                      <select
                        value={qType}
                        onChange={(e) => setQType(e.target.value as any)}
                        className="w-full px-2 py-1.5 bg-slate-950 border border-slate-850 rounded-xl text-xs text-slate-455 focus:outline-none"
                        id="select-single-q-type"
                      >
                        <option value="multiple_choice" className="bg-slate-950">Multiple Choice</option>
                        <option value="short_answer" className="bg-slate-950">Short Text Answer</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1">Question Statement Prompt</label>
                    <textarea
                      placeholder="Enter the NESA technical question query..."
                      value={qText}
                      onChange={(e) => setQText(e.target.value)}
                      className="w-full h-16 px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs text-slate-200 focus:outline-none"
                      required
                      id="input-single-q-text"
                    />
                  </div>

                  {qType === "multiple_choice" && (
                    <div className="space-y-2 p-3 bg-slate-950/50 border border-slate-850 rounded-xl" id="mc-options-row">
                      <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block mb-1">Answer Options (4 Options)</span>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Option A"
                          value={qOp1}
                          onChange={(e) => setQOp1(e.target.value)}
                          className="px-2 py-1 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-300"
                          required={qType === "multiple_choice"}
                          id="input-mc-opt-1"
                        />
                        <input
                          type="text"
                          placeholder="Option B"
                          value={qOp2}
                          onChange={(e) => setQOp2(e.target.value)}
                          className="px-2 py-1 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-300"
                          required={qType === "multiple_choice"}
                          id="input-mc-opt-2"
                        />
                        <input
                          type="text"
                          placeholder="Option C"
                          value={qOp3}
                          onChange={(e) => setQOp3(e.target.value)}
                          className="px-2 py-1 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-300"
                          required={qType === "multiple_choice"}
                          id="input-mc-opt-3"
                        />
                        <input
                          type="text"
                          placeholder="Option D"
                          value={qOp4}
                          onChange={(e) => setQOp4(e.target.value)}
                          className="px-2 py-1 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-300"
                          required={qType === "multiple_choice"}
                          id="input-mc-opt-4"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1">
                      {qType === "multiple_choice" ? "Exact Correct Option Sentence String" : "Approved Answer Keywords"}
                    </label>
                    <input
                      type="text"
                      placeholder={qType === "multiple_choice" ? "Type the exact matching text matching one of options" : "e.g., extends"}
                      value={qCorrect}
                      onChange={(e) => setQCorrect(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs text-slate-200 focus:outline-none"
                      required
                      id="input-single-q-correct"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1">Syllabus Explanation & Reference</label>
                    <textarea
                      placeholder="Why is this answer correct? Provide textbook explanation references."
                      value={qExplain}
                      onChange={(e) => setQExplain(e.target.value)}
                      className="w-full h-16 px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs text-slate-200 focus:outline-none"
                      id="input-single-q-explain"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 px-4 rounded-xl bg-teal-600 hover:bg-teal-550 cursor-pointer text-white font-semibold text-xs transition"
                    id="btn-single-q-submit"
                  >
                    Inject Direct Question
                  </button>
                </form>

                {questionSuccessMsg && (
                  <div className="mt-3 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/15 text-emerald-400 text-xs flex items-center gap-1.5" id="q-success-toast">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{questionSuccessMsg}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 3: ASSIGNED EXAMS MONITOR */}
        {activeSubTab === "assigned" && (
          <div className="bg-slate-950/30 p-5 border border-slate-850 rounded-2xl" id="assigned-monitoring-table">
            <div className="flex items-center justify-between border-b border-slate-850 pb-2 mb-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Assigned Exam Papers Track List</h4>
              <span className="text-[10px] font-mono text-slate-500">{assignedExams.length} Active Allocations</span>
            </div>

            <div className="overflow-x-auto" id="admin-exams-table-scroller">
              <table className="w-full text-left text-xs text-slate-300 divide-y divide-slate-850/60" id="admin-exams-table">
                <thead>
                  <tr className="text-slate-500 font-semibold select-none">
                    <th className="pb-2">EXAM TITLE</th>
                    <th className="pb-2">CANDIDATE STUDENT</th>
                    <th className="pb-2">SUBJECT CLASS</th>
                    <th className="pb-2">ASSIGNED DATE</th>
                    <th className="pb-2 text-center">DURATION</th>
                    <th className="pb-2 text-center">QUESTIONS</th>
                    <th className="pb-2 text-center">STATUS</th>
                    <th className="pb-2 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850/50">
                  {assignedExams.map(ex => (
                    <tr key={ex.id} className="hover:text-white" id={`exam-allocation-tr-${ex.id}`}>
                      <td className="py-3 font-semibold">{ex.examTitle}</td>
                      <td className="py-3 text-indigo-400">{getStudentName(ex.targetStudentId)}</td>
                      <td className="py-3 text-slate-400 font-medium">{getSubjectTitle(ex.moduleId)}</td>
                      <td className="py-3 text-slate-500">{ex.assignedDate}</td>
                      <td className="py-3 text-center">{ex.durationMinutes} min</td>
                      <td className="py-3 text-center font-mono text-xs">{ex.questions.length} Qs</td>
                      <td className="py-3 text-center">
                        {ex.status === "completed" ? (
                          <span className="px-2 py-0.5 rounded text-[9px] uppercase font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Completed ({ex.score}%)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[9px] uppercase font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            Assigned / Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleDeleteAssignedExam(ex.id)}
                          className="text-slate-500 hover:text-rose-400 transition"
                          id={`btn-del-allocated-${ex.id}`}
                          title="Remove Assignment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {assignedExams.length === 0 && (
                <div className="text-center py-8 text-slate-600 space-y-2">
                  <AlertCircle className="w-8 h-8 text-slate-650 mx-auto" />
                  <p className="text-xs">No active assessments given. Use the target student allocation system under 'Manage Students' tab to deploy test sheets!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SUBTAB 4: ANNOUNCEMENTS & AUTO-MARKING CONFIG */}
        {activeSubTab === "announcements" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="announcements-subtab-container">
            {/* Left portion: Post announcement & Grading config */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Grading algorithm strictness configurator */}
              <div className="bg-slate-950/30 p-5 border border-slate-850 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4.5 h-4.5 text-purple-450 text-purple-400" />
                  Auto-Marking Precision Engine
                </h3>
                <p className="text-xs text-slate-400">
                  Configure accuracy rules for short text question answers. Under lenient mode, any related keyword matches clear; strict mode verifies precise matches.
                </p>

                <div className="grid grid-cols-2 gap-3" id="strictness-presets">
                  <button
                    type="button"
                    onClick={() => handleUpdateMarkingStrictness("lenient")}
                    className={`py-3 px-4 rounded-xl text-xs font-semibold border transition text-center select-none cursor-pointer outline-none ${
                      markingStrictness === "lenient"
                        ? "border-teal-500 bg-teal-500/10 text-teal-400 font-bold"
                        : "border-slate-850 bg-slate-950/20 text-slate-450 hover:text-slate-300"
                    }`}
                  >
                    Lenient Match
                    <span className="block text-[8.5px] font-normal font-mono text-slate-500 mt-0.5">Keyword Substring</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateMarkingStrictness("strict")}
                    className={`py-3 px-4 rounded-xl text-xs font-semibold border transition text-center select-none cursor-pointer outline-none ${
                      markingStrictness === "strict"
                        ? "border-purple-500 bg-purple-500/10 text-purple-450 font-bold text-purple-400"
                        : "border-slate-850 bg-slate-950/20 text-slate-450 hover:text-slate-300"
                    }`}
                  >
                    Strict Match
                    <span className="block text-[8.5px] font-normal font-mono text-slate-500 mt-0.5">Exact Literal String</span>
                  </button>
                </div>

                <div className="p-3 bg-slate-950/45 border border-slate-900 rounded-lg text-[10px] text-slate-500 leading-relaxed text-left">
                  <span className="font-semibold text-slate-400 block mb-1">State Evaluation Mechanics</span>
                  Current status: Candidates taking practice sessions or officially designated examinations will be marked with <strong className="text-purple-450 text-purple-400 font-mono uppercase">{markingStrictness}</strong> accuracy rules.
                </div>
              </div>

              {/* Broadcast Form */}
              <div className="bg-slate-950/30 p-5 border border-slate-850 rounded-2xl" id="admin-broadcast-panel">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-purple-400" />
                  Broadcast Announcement
                </h3>

                <form onSubmit={handlePostAnnouncement} className="space-y-4" id="form-admin-broadcast">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">Relate Announcement to Class Module</label>
                    <select
                      value={announceModuleId}
                      onChange={(e) => setAnnounceModuleId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none"
                      id="select-broadcast-module"
                    >
                      <option value="">General (No specific Module tag)</option>
                      {subjects.map(s => (
                        <option key={s.id} value={s.id}>{s.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">Announcement warning message description</label>
                    <textarea
                      maxLength={240}
                      rows={3}
                      placeholder="e.g. Candidates registered for NESA Level 5 SWD must bring standard technical laptop assets for the next laboratory session."
                      value={announcementText}
                      onChange={(e) => setAnnouncementText(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs text-slate-100 placeholder-slate-650 focus:outline-none focus:border-purple-500 leading-relaxed"
                      required
                      id="input-broadcast-desc"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 px-4 rounded-xl bg-purple-600 hover:bg-purple-555 hover:bg-purple-550 cursor-pointer text-white font-semibold text-xs transition animate-none"
                    id="btn-broadcast-announcement-submit"
                  >
                    Post Bulletin Warning
                  </button>
                </form>

                {announcementSuccess && (
                  <div className="mt-3 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/15 text-emerald-400 text-xs flex items-center gap-1.5" id="broadcast-success-toast">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{announcementSuccess}</span>
                  </div>
                )}
              </div>

            </div>

            {/* Right portion: Student Portal query moderations */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-slate-950/30 p-5 border border-slate-850 rounded-2xl min-h-full" id="academic-announcements-list-pane">
                <div className="flex items-center justify-between border-b border-slate-850 pb-3 mb-4">
                  <div className="text-left w-2/3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Moderation Feed Control</h4>
                    <p className="text-[10px] text-slate-500">Delete student complaints, query answers or broadcast announcements.</p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800 shrink-0">
                    {portalMessages.length} Messages total
                  </span>
                </div>

                <div className="space-y-3.5 max-h-[480px] overflow-y-auto pr-1" id="message-moderation-scroller">
                  {portalMessages.length > 0 ? (
                    [...portalMessages].reverse().map(msg => {
                      const isAnn = !!msg.isAnnouncement;
                      return (
                        <div 
                          key={msg.id} 
                          className={`p-3 rounded-xl border flex items-start justify-between gap-4 transition ${
                            isAnn 
                              ? "bg-purple-950/15 border-purple-500/20" 
                              : "bg-slate-900/30 border-slate-850 hover:border-slate-800"
                          }`}
                          id={`mod-msg-${msg.id}`}
                        >
                          <div className="text-left space-y-1 select-text flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-bold text-slate-200">{msg.sender}</span>
                              {isAnn && (
                                <span className="text-[8px] font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 px-1.5 py-0.5 rounded">
                                  OFFICIAL NOTICE
                                </span>
                              )}
                              {msg.subjectTitle && (
                                <span className="text-[8px] font-mono bg-slate-850 text-slate-400 border border-slate-800 px-1.5 py-0.5 rounded">
                                  {msg.subjectTitle}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed font-sans">{msg.text}</p>
                            <span className="text-[9px] font-mono text-slate-500 block">{msg.timestamp}</span>
                          </div>

                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="text-slate-600 hover:text-rose-400 transition p-1 shrink-0"
                            title="Moderate / Delete message"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-12 text-slate-650 space-y-2">
                      <AlertCircle className="w-8 h-8 text-slate-650 mx-auto" />
                      <p className="text-xs">No study messages or faculty bulletins found on the database.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* SUBTAB 5: RESOURCE UPLOADER FOR TEACHERS */}
        {activeSubTab === "resources" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in" id="resources-uploader-container">
            {/* Left side: Upload Form */}
            <div className="lg:col-span-5 space-y-5" id="uploader-form-pane font-sans">
              <div className="bg-slate-950/30 p-5 border border-slate-850 rounded-2xl" id="uploader-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/15">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white leading-none">Resource Metadata Portal</h3>
                    <p className="text-[10px] text-slate-400 mt-1">Upload and publish study booklets (PDF, DOCX, PPTX) to dynamic candidate folders.</p>
                  </div>
                </div>

                <form onSubmit={handleUploadResource} className="space-y-4" id="form-upload-resource">
                  
                  {/* Drag and Drop Zone */}
                  <div>
                    <span className="block text-[10px] font-mono uppercase text-slate-500 mb-1.5 font-bold">Select or Drop Document File</span>
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById("hidden-file-input")?.click()}
                      className={`relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition select-none flex flex-col items-center justify-center min-h-[140px] ${
                        isDragOver 
                          ? "border-purple-500 bg-purple-500/5 text-purple-300" 
                          : resUploadedFile 
                            ? "border-emerald-500/50 bg-emerald-500/5 text-slate-300" 
                            : "border-slate-800 hover:border-slate-700 bg-slate-950/40 text-slate-400 hover:text-slate-300"
                      }`}
                      id="drag-drop-zone"
                    >
                      <input 
                        type="file" 
                        id="hidden-file-input" 
                        className="hidden" 
                        accept=".pdf,.docx,.pptx"
                        onChange={handleFileChange}
                      />
                      
                      {resUploadedFile ? (
                        <div className="space-y-2 flex flex-col items-center">
                          <div className={`p-2.5 rounded-xl border flex items-center justify-center ${
                            resFileType === "pdf" ? "bg-red-500/10 border-red-500/20 text-red-400" :
                            resFileType === "docx" ? "bg-blue-500/10 border-blue-500/20 text-blue-400" :
                            "bg-amber-500/10 border-amber-500/20 text-amber-400"
                          }`}>
                            <FileText className="w-7 h-7" />
                          </div>
                          <div className="text-center">
                            <p className="text-xs font-bold text-white max-w-[220px] truncate" title={resUploadedFile.name}>
                              {resUploadedFile.name}
                            </p>
                            <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
                              Format: <strong className="uppercase text-slate-400">{resUploadedFile.type}</strong> • Size: <strong className="text-slate-400">{resUploadedFile.size}</strong>
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setResUploadedFile(null);
                              setResTitle("");
                            }}
                            className="px-2 py-1 bg-slate-900 border border-slate-800 hover:border-rose-500/20 text-[9px] font-bold uppercase tracking-wider text-rose-455 hover:bg-rose-950/15 rounded-lg transition cursor-pointer"
                          >
                            Change File
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-1.5 flex flex-col items-center">
                          <Upload className="w-8 h-8 opacity-60 mb-1" />
                          <p className="text-xs font-bold">Drag & Drop files here, or <span className="text-purple-400">browse</span></p>
                          <p className="text-[9px] text-slate-500">Supports standard TVET files: PDF, DOCX, or PPTX up to 10MB</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">Document Title</label>
                    <input
                      type="text"
                      placeholder="e.g., Guide to Database Indexes"
                      value={resTitle}
                      onChange={(e) => setResTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-medium"
                      required
                      id="input-res-title"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">Subject Category</label>
                      <select
                        value={resSubject}
                        onChange={(e) => setResSubject(e.target.value)}
                        className="w-full px-2.5 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-purple-500 font-bold"
                        id="select-res-subject"
                        required
                      >
                        {subjects.map(s => (
                          <option key={s.id} value={s.id} className="bg-[#090d16]">{s.title}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">Difficulty Level</label>
                      <select
                        value={resDifficulty}
                        onChange={(e) => setResDifficulty(e.target.value as any)}
                        className="w-full px-2.5 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-purple-500 font-bold"
                        id="select-res-difficulty"
                      >
                        <option value="beginner" className="bg-[#090d16] text-emerald-400 font-bold">Beginner</option>
                        <option value="intermediate" className="bg-[#090d16] text-indigo-400 font-bold">Intermediate</option>
                        <option value="expert" className="bg-[#090d16] text-amber-500 font-bold">Expert</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">File Format Type</label>
                      <select
                        value={resFileType}
                        onChange={(e) => setResFileType(e.target.value as any)}
                        className="w-full px-2.5 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-purple-500 font-bold"
                        id="select-res-filetype"
                      >
                        <option value="pdf" className="bg-[#090d16]">PDF (.pdf)</option>
                        <option value="docx" className="bg-[#090d16]">DOCX (.docx)</option>
                        <option value="pptx" className="bg-[#090d16]">PPTX (.pptx)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">Syllabus Topic Unit</label>
                      <input
                        type="text"
                        placeholder="e.g., Unit 3 Queries"
                        value={resTopic}
                        onChange={(e) => setResTopic(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                        id="input-res-topic"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1 font-bold">Resource Description Overview</label>
                    <textarea
                      placeholder="Provide a student-facing summary explanation detailing the scope of this file..."
                      value={resDescription}
                      onChange={(e) => setResDescription(e.target.value)}
                      className="w-full h-16 px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-purple-500 leading-relaxed"
                      id="input-res-description"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-550 border border-purple-505/10 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                    id="btn-upload-resource-submit"
                  >
                    <Upload className="w-4 h-4" />
                    Publish Resource Booklet
                  </button>
                </form>

                {resSuccessMsg && (
                  <div className="mt-3.5 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/15 text-emerald-400 text-xs flex items-center gap-1.5 animate-pulse" id="uploader-success-banner">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{resSuccessMsg}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right portion: List of active resources */}
            <div className="lg:col-span-7 space-y-4" id="published-resources-terminal">
              <div className="bg-slate-950/30 p-5 border border-slate-850 rounded-2xl" id="resources-explorer-panel">
                <div className="flex items-center justify-between border-b border-slate-850 pb-2.5 mb-4">
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Teacher Resource Database Logs</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Retrieved study metadata stored on mock database</p>
                  </div>
                  <span className="text-[11px] font-mono bg-purple-500/10 border border-purple-500/20 text-purple-400 px-2 py-0.5 rounded-lg font-bold">
                    {customResources.length} Custom Items
                  </span>
                </div>

                <div className="space-y-2.5 overflow-y-auto max-h-[580px] scrollbar-thin pr-1" id="custom-resources-track-list">
                  {customResources.length > 0 ? (
                    customResources.map((res: any) => {
                      const subjName = getSubjectTitle(res.subjectId);
                      return (
                        <div 
                          key={res.id} 
                          className="bg-slate-950/40 hover:bg-slate-950/60 transition duration-150 border border-slate-850 rounded-xl p-3 flex items-start gap-3.5"
                          id={`teacher-res-cell-${res.id}`}
                        >
                          {/* File Indicator icon and color based on type */}
                          <div className={`p-2 rounded-xl border shrink-0 mt-0.5 ${
                            res.fileType === "pdf" ? "bg-red-500/10 border-red-500/20 text-red-400" :
                            res.fileType === "docx" ? "bg-blue-500/10 border-blue-500/20 text-blue-400" :
                            "bg-amber-500/10 border-amber-500/20 text-amber-450"
                          }`}>
                            <FileText className="w-5 h-5" />
                          </div>

                          <div className="text-left flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h5 className="text-xs font-bold text-white truncate max-w-[280px]" title={res.title}>
                                {res.title}
                              </h5>
                              
                              {/* Difficulty Tag */}
                              <span className={`text-[8px] font-mono px-1.5 py-0.2 rounded border font-bold capitalize ${
                                res.difficulty === "expert" ? "text-red-400 bg-red-500/10 border-red-500/20" :
                                res.difficulty === "intermediate" ? "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" :
                                "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                              }`}>
                                {res.difficulty}
                              </span>

                              {/* File Type Tag */}
                              <span className={`text-[8.5px] font-mono px-1 rounded uppercase font-bold shrink-0 ${
                                res.fileType === "pdf" ? "text-red-450" :
                                res.fileType === "docx" ? "text-blue-450" :
                                "text-amber-450"
                              }`}>
                                {res.fileType}
                              </span>
                            </div>

                            <p className="text-[10.5px] text-slate-300 mt-1 line-clamp-2 leading-relaxed font-sans">
                              {res.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] font-mono text-slate-500 mt-2 hover:text-slate-400 transition">
                              <span>📁 Area: <strong className="text-purple-400">{subjName}</strong></span>
                              <span>📌 Topic: <strong>{res.topic}</strong></span>
                              <span>📅 Date: <strong>{res.uploadDate}</strong></span>
                              <span>⚖️ Size: <strong>{res.fileSize}</strong></span>
                            </div>
                          </div>

                          {/* Delete Action button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteCustomResource(res.id, res.title)}
                            className="p-1 px-1.5 bg-slate-900 border border-slate-850 hover:border-rose-500/20 hover:bg-rose-950/10 text-slate-500 hover:text-rose-455 rounded-lg transition shrink-0 cursor-pointer"
                            title="Remove / Delete book document"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-16 border border-dashed border-slate-850 rounded-xl bg-slate-950/10 text-slate-600 space-y-2">
                      <FileText className="w-10 h-10 text-slate-700 mx-auto opacity-50" />
                      <div>
                        <p className="text-xs font-bold text-slate-500">No Custom Study Leaflets Published</p>
                        <p className="text-[9.5px] text-slate-600 mt-0.5">Use the Metadata panel on the left to upload your first TVET guide card.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
