import React, { useState, useEffect, useRef } from "react";
import { getMergedModules } from "../lib/dynamicData";
import { ModuleId, ChatMessage, StudyModule } from "../types";
import { 
  BookOpen, Code, Terminal, Send, Sparkles, HelpCircle, ChevronRight, 
  Check, BookMarked, Layers, Database, Cpu, Globe, Server, UserCheck, User, 
  Play, ArrowRight, MessageSquare, Download, PlaySquare, Eye, FileText, 
  ListTodo, Search, Filter, Star, Heart, Bookmark, AlertTriangle, Plus, Trash2, Edit2, RotateCcw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Pre-defined static smart resources
interface RecommendedResource {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  topic: string;
  fileType: "pdf" | "pptx" | "docx" | "zip" | "video" | "image" | "package";
  difficulty: "beginner" | "intermediate" | "expert";
  author: string;
  uploadDate: string;
  downloads: number;
  rating: number;
  fileSize: string;
  isPinned?: boolean;
  nesaCategory?: "past_paper" | "marking_guide" | "sample_exam" | "assessment_resource";
  brokenCount?: number;
  reportedBroken?: boolean;
}

const INITIAL_RESOURCES: RecommendedResource[] = [
  {
    id: "nesa_1",
    title: "NESA_L5SWD_National_Project_Exam_2025.pdf",
    description: "Official 2025 National Practical Examination containing complete project specifications, grading matrix, and database diagram constraints.",
    subjectId: ModuleId.DATABASE,
    topic: "Level 5 National Exam",
    fileType: "pdf",
    difficulty: "expert",
    author: "Rwanda TVET Board (RTB)",
    uploadDate: "Nov 15, 2025",
    downloads: 912,
    rating: 4.9,
    fileSize: "4.8 MB",
    isPinned: true,
    nesaCategory: "past_paper"
  },
  {
    id: "nesa_2",
    title: "NESA_L5SWD_Marking_Guide_2025.pdf",
    description: "Official Marking Guide for the 2025 Software Development national exam. Includes model Java algorithms and DDL normalization queries.",
    subjectId: ModuleId.DATABASE,
    topic: "Level 5 National Exam",
    fileType: "pdf",
    difficulty: "expert",
    author: "NESA National Evaluators Panel",
    uploadDate: "Dec 01, 2025",
    downloads: 745,
    rating: 5.0,
    fileSize: "3.2 MB",
    isPinned: true,
    nesaCategory: "marking_guide"
  },
  {
    id: "res_1",
    title: "Database_Normalization_Guide.pdf",
    description: "In-depth guide on primary keys, transitive dependencies, and normal forms (1NF, 2NF, 3NF) with TVET schema solutions.",
    subjectId: ModuleId.DATABASE,
    topic: "Database Normalization Levels",
    fileType: "pdf",
    difficulty: "intermediate",
    author: "Rwanda TVET Board (RTB)",
    uploadDate: "June 25, 2025",
    downloads: 342,
    rating: 4.8,
    fileSize: "2.4 MB"
  },
  {
    id: "res_2",
    title: "SQL_Queries_Practice_Workbook.docx",
    description: "DML and DDL syntax workbook, including composite JOINs, GROUP BY aggregate rules, and structural index benchmarks.",
    subjectId: ModuleId.DATABASE,
    topic: "DDL vs DML",
    fileType: "docx",
    difficulty: "beginner",
    author: "NESA National Evaluators",
    uploadDate: "August 12, 2025",
    downloads: 520,
    rating: 4.9,
    fileSize: "1.8 MB"
  },
  {
    id: "res_3",
    title: "ERD_Design_Masterclass.pptx",
    description: "Visual slides translating complex business constraints into clean Entity-Relationship Diagrams (ERDs) with primary-foreign reference lines.",
    subjectId: ModuleId.DATABASE,
    topic: "Entity Relationship Modeling",
    fileType: "pptx",
    difficulty: "intermediate",
    author: "Remmy Nsanzimana (TOXIC CODERKILLER)",
    uploadDate: "Feb 10, 2026",
    downloads: 298,
    rating: 5.0,
    fileSize: "4.5 MB"
  },
  {
    id: "res_4",
    title: "Web_Application_Security_SQLi_Prevention.pdf",
    description: "Detailed protocols on preventing SQL injection flaws, implementing PDO parametrized wrappers, and MVC security layers.",
    subjectId: ModuleId.WEB_DEV,
    topic: "Preventing SQL Injections",
    fileType: "pdf",
    difficulty: "expert",
    author: "OWASP Kigali Student Chapter",
    uploadDate: "Nov 02, 2025",
    downloads: 185,
    rating: 4.7,
    fileSize: "1.1 MB"
  },
  {
    id: "res_5",
    title: "Advanced_React_API_Routing_Patterns.zip",
    description: "Complete template source files representing modern state hook pipelines, routing animations, and HTTP request headers.",
    subjectId: ModuleId.WEB_DEV,
    topic: "Client-Side vs Server-Side Scripting",
    fileType: "zip",
    difficulty: "expert",
    author: "Faculty SWD Developers",
    uploadDate: "Jan 18, 2026",
    downloads: 142,
    rating: 4.6,
    fileSize: "9.2 MB"
  },
  {
    id: "res_6",
    title: "Java_OOP_Advanced_Inheritance_Guide.pdf",
    description: "Comprehensive lessons on Abstraction, Polymorphism methods overriding, interfaces, abstract classes, and Throwable Exception frameworks in Java.",
    subjectId: ModuleId.OOP_JAVA,
    topic: "The Four Pillars of OOP",
    fileType: "pdf",
    difficulty: "intermediate",
    author: "Oracle Academy East Africa",
    uploadDate: "July 09, 2025",
    downloads: 412,
    rating: 4.9,
    fileSize: "3.2 MB"
  },
  {
    id: "res_7",
    title: "Software_Testing_And_CI_CD_Manual.pdf",
    description: "Unit testing, integration pipelines, DevOps test suites creation, automated Docker builds, and deployment instructions.",
    subjectId: ModuleId.DEVOPS,
    topic: "CI/CD Pipeline Architecture",
    fileType: "pdf",
    difficulty: "expert",
    author: "DevOps Kigali Institute",
    uploadDate: "March 03, 2026",
    downloads: 255,
    rating: 4.8,
    fileSize: "2.8 MB"
  },
  {
    id: "res_8",
    title: "Linux_Administration_Terminal_Bible.docx",
    description: "All critical Linux commands, permissions chmod/chown scripts, web routing, server configurations, and system logging checks.",
    subjectId: ModuleId.CLOUD_SYS,
    topic: "Terminal Commands & Privileged Controls",
    fileType: "docx",
    difficulty: "intermediate",
    author: "RedHat Academic Hub Rwanda",
    uploadDate: "Jan 05, 2026",
    downloads: 380,
    rating: 4.8,
    fileSize: "1.5 MB"
  },
  {
    id: "res_9",
    title: "Electrostatic_Discharge_And_Hardware_Maintenance.pdf",
    description: "Aesthetic past paper detailing physical motherboard diagnostics, ESD safety standards, disk partitioning GPT/MBR, and NTFS formatting.",
    subjectId: ModuleId.MAINTENANCE,
    topic: "Electrostatic Discharge (ESD) Safety Controls",
    fileType: "pdf",
    difficulty: "beginner",
    author: "Intel Tech TVET Rwanda",
    uploadDate: "Dec 15, 2025",
    downloads: 410,
    rating: 4.7,
    fileSize: "3.9 MB"
  },
  {
    id: "nesa_3",
    title: "RTB_Sample_Web_App_Exam_2026.zip",
    description: "Full sample code structure illustrating MVC architecture, prepared statements, and Express.js routing patterns approved for L5 exam preparation.",
    subjectId: ModuleId.WEB_DEV,
    topic: "Mock Practical Exam",
    fileType: "zip",
    difficulty: "intermediate",
    author: "Rwanda TVET Board (RTB)",
    uploadDate: "Jan 10, 2026",
    downloads: 512,
    rating: 4.8,
    fileSize: "12.4 MB",
    nesaCategory: "sample_exam"
  },
  {
    id: "nesa_4",
    title: "NESA_L5_Competency_Evaluation_Standards.pdf",
    description: "Curriculum assessment standards and criteria matrix mapping core and elective modules for Software Development Level 5 candidates.",
    subjectId: ModuleId.DEVOPS,
    topic: "Evaluation Standards",
    fileType: "pdf",
    difficulty: "beginner",
    author: "NESA Quality Assurance Dept",
    uploadDate: "Oct 20, 2025",
    downloads: 310,
    rating: 4.7,
    fileSize: "1.2 MB",
    nesaCategory: "assessment_resource"
  },
  {
    id: "res_video_1",
    title: "MVC_Architecture_Walkthrough_Lecture.mp4",
    description: "Highly rated video tutorial demonstrating Model-View-Controller class routing and modular Express backend middleware setup.",
    subjectId: ModuleId.WEB_DEV,
    topic: "Client-Side vs Server-Side Scripting",
    fileType: "video",
    difficulty: "beginner",
    author: "Faculty SWD Developers",
    uploadDate: "Feb 15, 2026",
    downloads: 345,
    rating: 4.9,
    fileSize: "45 MB"
  },
  {
    id: "res_image_1",
    title: "RTB_eLearning_Network_Topology_Map.png",
    description: "Visual layout showing star/mesh configurations, standard IPv4 CIDR blocks, gateway routers, and reverse proxy placements.",
    subjectId: ModuleId.CLOUD_SYS,
    topic: "Network Topologies",
    fileType: "image",
    difficulty: "intermediate",
    author: "Rwanda TVET Board (RTB)",
    uploadDate: "Jan 22, 2026",
    downloads: 215,
    rating: 4.6,
    fileSize: "1.4 MB"
  }
];

export default function StudyMaterials() {
  const [modules, setModules] = useState<StudyModule[]>([]);
  const [selectedModule, setSelectedModule] = useState<StudyModule | null>(null);
  
  // Navigation tabs
  // "lessons" -> Topic lesions with PDF book simulated preview & quick activities (End-of-lesson Quiz, Interactive Code, video play)
  // "resources" -> PDF & Slide recommendations library based on weak scoring
  // "tools" -> Notes, Flashcards & Study Goal tracker
  // "ai_tutor" -> Study AI session
  const [activeTab, setActiveTab] = useState<"lessons" | "resources" | "tools" | "ai_tutor">("lessons");

  // User Role
  const [userRole, setUserRole] = useState<string>("student");

  // Lessons - Moodle-like collapsible structures and interactive previewers
  const [expandedTopicIdx, setExpandedTopicIdx] = useState<number | null>(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  
  // PDF Preview Simulator Modals
  const [pdfPreviewFile, setPdfPreviewFile] = useState<RecommendedResource | null>(null);
  const [pdfPage, setPdfPage] = useState(1);
  const [simulatedDownloadSuccess, setSimulatedDownloadSuccess] = useState<string | null>(null);

  // Additional Preview Modals for Full Compliance & Interactive Coverage
  const [docxPreviewFile, setDocxPreviewFile] = useState<RecommendedResource | null>(null);
  const [imagePreviewFile, setImagePreviewFile] = useState<RecommendedResource | null>(null);
  const [pptxPreviewFile, setPptxPreviewFile] = useState<RecommendedResource | null>(null);
  const [pptxSlideIdx, setPptxSlideIdx] = useState(1);
  const [zipPreviewFile, setZipPreviewFile] = useState<RecommendedResource | null>(null);

  // Resource Interactions & Rating feedback
  const [pinnedResources, setPinnedResources] = useState<string[]>([]);
  const [reportedBroken, setReportedBroken] = useState<Record<string, boolean>>({});
  const [feedbackReviews, setFeedbackReviews] = useState<Record<string, { student: string; rating: number; text: string; date: string }[]>>({});
  const [editingResource, setEditingResource] = useState<RecommendedResource | null>(null);

  // Toggle sub tabs within Resources
  const [activeResourceSubTab, setActiveResourceSubTab] = useState<"library" | "nesa">("library");
  const [nesaTab, setNesaTab] = useState<"all" | "past_papers" | "marking_guides" | "sample_exams" | "assessment_resources">("all");

  // AI Smart Suggestions sandbox state 
  const [aiSelectionWeakness, setAiSelectionWeakness] = useState("Database Normalization");
  const [aiSuggestedPlan, setAiSuggestedPlan] = useState<{ rationale: string; resources: string[] } | null>(null);
  const [isAiPlanLoading, setIsAiPlanLoading] = useState(false);

  // Video Preview Simulator
  const [videoPreviewFile, setVideoPreviewFile] = useState<RecommendedResource | null>(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  // Lesson Interactive Code Execution Frame
  const [playgroundCode, setPlaygroundCode] = useState("");
  const [playgroundOutput, setPlaygroundOutput] = useState("");
  const [isPlayingCode, setIsPlayingCode] = useState(false);

  // End of lesson interactive mini-quizzes
  const [activeLessonQuiz, setActiveLessonQuiz] = useState<{ topicIdx: number; qstIndex: number; selected: string; solved: boolean } | null>(null);

  // Resource Library Search and Recommendation Engines
  const [customResources, setCustomResources] = useState<RecommendedResource[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTopic, setSearchTopic] = useState(""); // Support searching by topic explicitly!
  const [filterSubject, setFilterSubject] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [filterFileType, setFilterFileType] = useState("");
  const [downloadTracker, setDownloadTracker] = useState<Record<string, number>>({});
  const [resourceRatings, setResourceRatings] = useState<Record<string, number>>({});
  const [resourceFavorites, setResourceFavorites] = useState<string[]>([]);

  // Smart Engine trigger (weak performance topic mapping!)
  const [weakTopicsDetected, setWeakTopicsDetected] = useState<string[]>([]);
  
  // Teacher Upload States
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDesc, setUploadDesc] = useState("");
  const [uploadTopic, setUploadTopic] = useState(""); // Topic is stored
  const [uploadAuthor, setUploadAuthor] = useState(""); // Author is stored
  const [isNesaOnly, setIsNesaOnly] = useState(false); // Flag if NESA National material
  const [uploadNesaCategory, setUploadNesaCategory] = useState<"past_paper" | "marking_guide" | "sample_exam" | "assessment_resource">("past_paper");
  const [uploadSubj, setUploadSubj] = useState("");
  const [uploadType, setUploadType] = useState<"pdf" | "pptx" | "docx" | "zip" | "video" | "image" | "package">("pdf");
  const [uploadDifficulty, setUploadDifficulty] = useState<"beginner" | "intermediate" | "expert">("beginner");
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState("");

  // Personal Student Note storage hooks
  const [personalNotes, setPersonalNotes] = useState<{ id: string; title: string; body: string; date: string; subjectId: string }[]>([]);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteSubject, setNoteSubject] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  // Flashcard states
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [isFlashcardFlipped, setIsFlashcardFlipped] = useState(false);

  // Study hours timer
  const [studyMinutes, setStudyMinutes] = useState(18); // default starting time
  const [studyTimerActive, setStudyTimerActive] = useState(true);

  // AI Chat Bot
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initial loads
  useEffect(() => {
    const list = getMergedModules();
    setModules(list);
    if (list.length > 0) {
      setSelectedModule(list[0]);
    }

    // Role, Completed lessons, Bookmarks sync
    const savedRole = localStorage.getItem("l5swd_active_role") || "student";
    setUserRole(savedRole);

    const savedCompleted = JSON.parse(localStorage.getItem("l5swd_completed_lessons") || "[]");
    setCompletedLessons(savedCompleted);

    const savedBookmarks = JSON.parse(localStorage.getItem("l5swd_bookmarks") || "[]");
    setBookmarks(savedBookmarks);

    const savedFavs = JSON.parse(localStorage.getItem("l5swd_resource_favorites") || "[]");
    setResourceFavorites(savedFavs);

    const savedNotes = JSON.parse(localStorage.getItem("l5swd_personal_notes") || "[]");
    setPersonalNotes(savedNotes);

    const savedCustomRes = JSON.parse(localStorage.getItem("l5_custom_uploaded_resources") || "[]");
    setCustomResources(savedCustomRes);

    const savedPinned = JSON.parse(localStorage.getItem("l5_res_pinned") || "[]");
    setPinnedResources(savedPinned);

    const savedBroken = JSON.parse(localStorage.getItem("l5_res_broken") || "{}");
    setReportedBroken(savedBroken);

    const savedReviews = JSON.parse(localStorage.getItem("l5_res_feedback") || "{}");
    setFeedbackReviews(savedReviews);

    // Track downloads
    const savedDownloads = JSON.parse(localStorage.getItem("l5_res_downloads") || "{}");
    setDownloadTracker(savedDownloads);

    // Track study minutes increment
    const interval = setInterval(() => {
      setStudyMinutes(prev => {
        const next = prev + 1;
        localStorage.setItem("l5_study_minutes_count", next.toString());
        return next;
      });
    }, 60000);

    // Evaluate student history to find weak topics (< 50% score performance)
    const history = JSON.parse(localStorage.getItem("l5swd_history") || "[]");
    const weakList: string[] = [];
    history.forEach((h: any) => {
      const percentage = h.totalQuestions > 0 ? (h.score / h.totalQuestions) * 100 : 0;
      if (percentage < 50 && h.moduleId) {
        if (!weakList.includes(h.moduleId)) {
          weakList.push(h.moduleId);
        }
      }
    });
    setWeakTopicsDetected(weakList);

    return () => clearInterval(interval);
  }, []);

  // Monitor Role Swap trigger without page refresh
  useEffect(() => {
    const checkRole = () => {
      const r = localStorage.getItem("l5swd_active_role") || "student";
      setUserRole(r);
    };
    window.addEventListener("storage", checkRole);
    const interval = setInterval(checkRole, 1000);
    return () => {
      window.removeEventListener("storage", checkRole);
      clearInterval(interval);
    };
  }, []);

  // Initialize Chat Greetings
  useEffect(() => {
    if (!selectedModule) return;
    setChatMessages([
      {
        id: "msg_welcome",
        sender: "ai",
        text: `Hi Remmy! I am **Kivu**, your dedicated L5SWD academic companion. 🇷🇼\n\nI can help you review complex notes for **${selectedModule.title}**, explain code lines, break down database logic, or customize study plans.\n\nAsk me anything, or try questions like:\n- *"Explain 1NF vs 3NF rules with examples"* \n- *"Show me secure prepared statements for PHP database operations"*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [selectedModule]);

  // Handle send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: "user",
      text: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.text,
          history: chatMessages.slice(-5),
          moduleContext: selectedModule ? `${selectedModule.code}: ${selectedModule.title}` : ""
        })
      });

      const data = await response.json();
      if (response.ok) {
        setChatMessages(prev => [...prev, {
          id: `ai_${Date.now()}`,
          sender: "ai",
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        throw new Error();
      }
    } catch {
      // Elegant detailed local fallback text based on topic query
      let responseText = `I'm currently responding dynamically with pre-cached curriculum lessons (to connect with live cloud servers, configure your **GEMINI_API_KEY** secret in Settings!).\n\n**Topic Explainer:** For *${selectedModule?.title}*, ensure you study the syllabus guidelines, download simulated past papers, and practice the interactive quizzes to guarantee exam success!`;
      
      const textLower = userMsg.text.toLowerCase();
      if (textLower.includes("normal") || textLower.includes("nf")) {
        responseText = `### Database Normalization Explained (1NF, 2NF, 3NF)\n\nNormalization is a systematic engineering process used to structure SQL tables to prevent insertion/modification/deletion anomalies.\n\n- **1NF (First Normal Form):** Every cell value must be **atomic** (no repeating fields or grouped values as arrays). Every row must possess a unique identifier.\n- **2NF (Second Normal Form):** Must be in 1NF and any non-key attributes must exhibit **full functional dependency** on the primary key (eliminates partial dependencies when composite keys are active).\n- **3NF (Third Normal Form):** Must be in 2NF and eliminate **transitive dependencies** (attributes shouldn't depend on other non-key columns). *Rule: 'The value must depend on the key, the whole key, and nothing but the key, so help me Codd!'*`;
      } else if (textLower.includes("secure") || textLower.includes("prep") || textLower.includes("sql") || textLower.includes("inject")) {
        responseText = `### Preventing SQL Injection Attacks\n\nAn **SQL Injection (SQLi)** occurs when malicious SQL statements are inputted into forms and interpreted directly as instructions by the database engine.\n\n#### Secure Remediation Pattern: Prepared Statements\n- Safe parameter binding separates the SQL instruction template from actual user data inputs.\n- Compile-time checking blocks the engine from interpreting user scripts as commands.\n\n\`\`\`php\n// SECURE Prepared Statement in SQL/PDO:\n$stmt = $dbConnection->prepare("SELECT * FROM students WHERE reg_no = :reg");\n$stmt->execute(['reg' => $studentInput]);\n$result = $stmt->fetchAll();\n\`\`\``;
      } else if (textLower.includes("pillar") || textLower.includes("oop") || textLower.includes("java")) {
        responseText = `### The 4 Pillars of Object-Oriented Programming (OOP) in Java\n\n1. **Encapsulation:** Protect status schemas by making parameters \`private\`, restricting external updates to public getters/setters wrappers.\n2. **Inheritance:** Enables child subclasses to reuse parent attributes and methods seamlessly (*e.g., \`class WebDeveloper extends Student\`*).\n3. **Polymorphism:** Adapts physical execution signatures. Includes **Method Overloading** (static compile-time) and **Method Overriding** (dynamic runtime overrides).\n4. **Abstraction:** Declares behavioral footprints without stating raw inner definitions. Managed using interfaces and abstract model grids.`;
      }

      setChatMessages(prev => [...prev, {
        id: `ai_${Date.now()}`,
        sender: "ai",
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper AI auto trigger from lesson plan
  const triggerAiHelpOnTopic = (topicTitle: string, details: string) => {
    setActiveTab("ai_tutor");
    setIsLoading(true);
    setChatMessages(prev => [...prev, {
      id: `user_${Date.now()}`,
      sender: "user",
      text: `Explain this L5SWD curriculum topic in detail: "${topicTitle}". Here are the core details: ${details}. Provide code examples or best technical execution practices.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);

    setTimeout(() => {
      setIsLoading(false);
      const outputExplain = `### Master Class Breakdown: "${topicTitle}"\n\nBased on Rwanda NESA Software Development syllabus parameters, study this comprehensive breakdown:\n\n**Theoretical Summary:**\n${details}\n\n**Best Security & Compilation Guidelines:**\n- Modularize operations based on clean architecture frameworks.\n- Encapsulate volatile code lines using robust Exception handling logic.\n- In web applications, always filter user parameter structures prior to passing them onto SQL queries.\n\nIs there a specific portion of this TVET curriculum you need mock exercises or practice questions on?`;
      setChatMessages(prev => [...prev, {
        id: `ai_${Date.now()}`,
        sender: "ai",
        text: outputExplain,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1200);
  };

  // Save Bookmarks
  const toggleBookmarkLesson = (topicTitle: string) => {
    let next: string[];
    if (bookmarks.includes(topicTitle)) {
      next = bookmarks.filter(b => b !== topicTitle);
    } else {
      next = [...bookmarks, topicTitle];
    }
    setBookmarks(next);
    localStorage.setItem("l5swd_bookmarks", JSON.stringify(next));
  };

  // Toggle Lesson Complete Status
  const toggleCompletedLesson = (topicTitle: string) => {
    let next: string[];
    if (completedLessons.includes(topicTitle)) {
      next = completedLessons.filter(c => c !== topicTitle);
    } else {
      next = [...completedLessons, topicTitle];
    }
    setCompletedLessons(next);
    localStorage.setItem("l5swd_completed_lessons", JSON.stringify(next));
  };

  // Run mock code sandbox
  const handleRunPlayground = (topicTitle: string, defaultCode?: string) => {
    setIsPlayingCode(true);
    setPlaygroundCode(defaultCode || playgroundCode || `// Write your test codes here...`);
    setPlaygroundOutput("Analyzing syntaxes...\nCompiling dependencies...\nLoading standard TVET compiler variables...\n\n");
    
    setTimeout(() => {
      let runResult = "Execution Success:\n";
      if (topicTitle.includes("MVC") || defaultCode?.includes("Node/Express")) {
        runResult += "➜ Starting local Express Server on port 3000...\n➜ Registering schema endpoint: GET /users\n➜ DB response loaded: 3 entries\n➜ Render status: 200 OK (Loaded userList.html)";
      } else if (topicTitle.includes("Injections") || defaultCode?.includes("pdo")) {
        runResult += "➜ SQL Query Prepared: SELECT * FROM users WHERE email = ?\n➜ Bound Parameter: 'user@example.com'\n➜ Verification check: NO nested characters found.\n➜ Result: Fetch success. User record securely retrieved.";
      } else if (topicTitle.includes("Pillars") || defaultCode?.includes("Polymorphism")) {
        runResult += "➜ Compiling JVM Bytecodes...\n➜ Instantiating dog schema Class Dog\n➜ Dog.makeSound() called.\n➜ Output out stream: 'Woof'\n➜ JVM process finished with exit code 0";
      } else {
        runResult += "➜ Script compilation terminated successfully.\n➜ Logs: Executed cleanly on virtual TVET environment frame.";
      }
      setPlaygroundOutput(prev => prev + runResult);
    }, 1500);
  };

  // Start mini quiz
  const handleStartLessonQuiz = (topicIdx: number) => {
    setActiveLessonQuiz({
      topicIdx,
      qstIndex: 0,
      selected: "",
      solved: false
    });
  };

  // Complete mini quiz submit
  const submitLessonQuiz = () => {
    if (!activeLessonQuiz) return;
    setActiveLessonQuiz(prev => {
      if (!prev) return null;
      return { ...prev, solved: true };
    });
    // Add to completed lessons
    const item = selectedModule?.topics[activeLessonQuiz.topicIdx];
    if (item) {
      toggleCompletedLesson(item.title);
    }
  };

  // All resources compiled (Static + Custom)
  const getAllResources = () => {
    return [...INITIAL_RESOURCES, ...customResources];
  };

  // Get active recommended resources (Smart logic based on weak topics)
  const getSmartRecommendations = () => {
    const list = getAllResources();
    if (weakTopicsDetected.length > 0) {
      // Prioritize resources matching the weak subjects
      return list.filter(res => weakTopicsDetected.includes(res.subjectId));
    }
    // Default recommendations based on popular rating
    return list.slice(0, 3);
  };

  // Handle resource download simulation
  const handleDownloadResource = (res: RecommendedResource) => {
    // Increment download count
    const updatedDownloads = { ...downloadTracker, [res.id]: (downloadTracker[res.id] || 0) + 1 };
    setDownloadTracker(updatedDownloads);
    localStorage.setItem("l5_res_downloads", JSON.stringify(updatedDownloads));

    setSimulatedDownloadSuccess(`Initializing file server for: ${res.title}...`);
    setTimeout(() => {
      setSimulatedDownloadSuccess(`Successfully downloaded: ${res.title} (${res.fileSize}) to local assets!`);
    }, 1200);

    setTimeout(() => {
      setSimulatedDownloadSuccess(null);
    }, 4000);
  };

  // Handle Resource Favorite Toggle
  const toggleFavoriteResource = (id: string) => {
    let next: string[];
    if (resourceFavorites.includes(id)) {
      next = resourceFavorites.filter(f => f !== id);
    } else {
      next = [...resourceFavorites, id];
    }
    setResourceFavorites(next);
    localStorage.setItem("l5swd_resource_favorites", JSON.stringify(next));
  };

  // Handle Resource Rating Select & Persistent Reviews
  const handleRateResource = (id: string, stars: number) => {
    setResourceRatings(prev => ({ ...prev, [id]: stars }));
  };

  // Handle Resource Pinning
  const togglePinResource = (id: string) => {
    let next: string[];
    if (pinnedResources.includes(id)) {
      next = pinnedResources.filter(p => p !== id);
    } else {
      next = [...pinnedResources, id];
    }
    setPinnedResources(next);
    localStorage.setItem("l5_res_pinned", JSON.stringify(next));
  };

  // Handle Resource Broken Reports
  const reportBrokenResource = (id: string) => {
    const next = { ...reportedBroken, [id]: true };
    setReportedBroken(next);
    localStorage.setItem("l5_res_broken", JSON.stringify(next));
  };

  // Handle Reset Broken Status
  const handleResetBrokenStatus = (brokenId: string) => {
    const next = { ...reportedBroken };
    delete next[brokenId];
    setReportedBroken(next);
    localStorage.setItem("l5_res_broken", JSON.stringify(next));
  };

  // Submit Rating & Feedback review
  const submitResourceFeedback = (id: string, text: string, rating: number) => {
    if (!text.trim()) return;
    const item = {
      student: "Candidate Remmy (L4 SWD Student)",
      rating,
      text: text.trim(),
      date: new Date().toLocaleDateString()
    };
    const reviews = feedbackReviews[id] || [];
    const next = { ...feedbackReviews, [id]: [item, ...reviews] };
    setFeedbackReviews(next);
    localStorage.setItem("l5_res_feedback", JSON.stringify(next));
  };

  // Handle AI Diagnose Weakness Planning Tool
  const generateAiSuggestions = (topic: string) => {
    setIsAiPlanLoading(true);
    setAiSelectionWeakness(topic);
    setTimeout(() => {
      let files: string[] = [];
      let rationale = "";
      if (topic.includes("Normalization") || topic.includes("database")) {
        files = ["Database_Normalization_Guide.pdf", "SQL_Queries_Practice_Workbook.docx", "ERD_Design_Tutorial.pptx", "NESA_L5SWD_National_Project_Exam_2025.pdf"];
        rationale = "Your weak performance logs highlight difficulty with Boyce-Codd normal forms and entities linking. Review the normalization checklist and ERD masterclass presentation slide sheets, and practice standard SQL past exam queries.";
      } else if (topic.includes("Scripting") || topic.includes("web_dev")) {
        files = ["Advanced_React_API_Routing_Patterns.zip", "MVC_Architecture_Walkthrough_Lecture.mp4", "RTB_Sample_Web_App_Exam_2026.zip"];
        rationale = "You fell below assessment targets on client vs server scripting structures. Read the MVC express router logic slides, review mock web project structures, and run visual sandboxes.";
      } else if (topic.includes("Pillars") || topic.includes("oop_java")) {
        files = ["Java_OOP_Advanced_Inheritance_Guide.pdf", "NESA_L5SWD_Marking_Guide_2025.pdf"];
        rationale = "Static evaluation indicators suggest gaps in implementing OOP polymorphism overriders. Re-study the Advanced Inheritance PDF guide and review Java practical question answer keys.";
      } else {
        files = ["Linux_Administration_Terminal_Bible.docx", "NESA_L5_Competency_Evaluation_Standards.pdf"];
        rationale = "You have demonstrated gaps in standard Linux user grouping layouts. Read RedHat system administrative drills, practice sudo permissions commands, and map evaluation controls.";
      }
      setAiSuggestedPlan({ rationale, resources: files });
      setIsAiPlanLoading(false);
    }, 1000);
  };

  // Handle Edit Resource Select
  const handleEditResourceSelect = (res: RecommendedResource) => {
    setEditingResource(res);
    // strip standard extension for title form input
    const cleanT = res.title.includes(".") ? res.title.substring(0, res.title.lastIndexOf('.')) : res.title;
    setUploadTitle(cleanT);
    setUploadDesc(res.description);
    setUploadSubj(res.subjectId);
    setUploadTopic(res.topic);
    setUploadAuthor(res.author);
    setUploadType(res.fileType);
    setUploadDifficulty(res.difficulty);
    setIsNesaOnly(!!res.nesaCategory);
    if (res.nesaCategory) {
      setUploadNesaCategory(res.nesaCategory);
    }
  };

  // Handle Teacher Resource Upload & Update CRUD
  const handleTeacherUploadResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim() || !uploadSubj) return;

    const ext = uploadType === "pdf" ? ".pdf" : uploadType === "pptx" ? ".pptx" : uploadType === "docx" ? ".docx" : uploadType === "zip" ? ".zip" : uploadType === "video" ? ".mp4" : uploadType === "image" ? ".png" : ".pkg";
    const cleanTitle = uploadTitle.trim().replace(/\s+/g, "_");
    const finalTitle = cleanTitle.endsWith(ext) ? cleanTitle : cleanTitle + ext;

    if (editingResource) {
      // Edit mode
      const updated: RecommendedResource = {
        ...editingResource,
        title: finalTitle,
        description: uploadDesc.trim() || "National L5SWD study resource note.",
        subjectId: uploadSubj,
        topic: uploadTopic.trim() || "General Class Notes",
        fileType: uploadType,
        difficulty: uploadDifficulty,
        author: uploadAuthor.trim() || "Teacher / School Admin",
      };
      if (isNesaOnly) {
        updated.nesaCategory = uploadNesaCategory;
      } else {
        delete updated.nesaCategory;
      }

      let nextCustom;
      if (editingResource.id.startsWith("custom_res_")) {
        nextCustom = customResources.map(r => r.id === editingResource.id ? updated : r);
      } else {
        nextCustom = [...customResources.filter(r => r.id !== editingResource.id), updated];
      }
      setCustomResources(nextCustom);
      localStorage.setItem("l5_custom_uploaded_resources", JSON.stringify(nextCustom));

      setEditingResource(null);
      setUploadTitle("");
      setUploadDesc("");
      setUploadTopic("");
      setUploadAuthor("");
      setIsNesaOnly(false);
      setUploadSuccessMsg("Academic resources update applied to candidate portals!");
    } else {
      // Create mode
      const newRes: RecommendedResource = {
        id: `custom_res_${Date.now()}`,
        title: finalTitle,
        description: uploadDesc.trim() || "National L5SWD study resource note.",
        subjectId: uploadSubj,
        topic: uploadTopic.trim() || "General Class Notes",
        fileType: uploadType,
        difficulty: uploadDifficulty,
        author: uploadAuthor.trim() || "Instructor",
        uploadDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        downloads: 0,
        rating: 4.5,
        fileSize: "2.1 MB",
        isPinned: false
      };
      if (isNesaOnly) {
        newRes.nesaCategory = uploadNesaCategory;
      }

      const nextCustom = [...customResources, newRes];
      setCustomResources(nextCustom);
      localStorage.setItem("l5_custom_uploaded_resources", JSON.stringify(nextCustom));

      setUploadTitle("");
      setUploadDesc("");
      setUploadTopic("");
      setUploadAuthor("");
      setIsNesaOnly(false);
      setUploadSuccessMsg("Academic booklet uploaded and map-indexed to student portals!");
    }
    setTimeout(() => setUploadSuccessMsg(""), 4000);
  };

  // Delete Resource helper
  const handleDeleteResource = (id: string) => {
    const nextCustom = customResources.filter(res => res.id !== id);
    setCustomResources(nextCustom);
    localStorage.setItem("l5_custom_uploaded_resources", JSON.stringify(nextCustom));
    if (editingResource?.id === id) {
      setEditingResource(null);
      setUploadTitle("");
      setUploadDesc("");
      setUploadTopic("");
      setUploadAuthor("");
    }
  };

  // Notes CRUD Handlers
  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteBody.trim() || !noteSubject) return;

    let nextNotes;
    if (editingNoteId) {
      nextNotes = personalNotes.map(n => n.id === editingNoteId ? {
        ...n,
        title: noteTitle.trim(),
        subjectId: noteSubject,
        body: noteBody.trim(),
        date: "Edited Today"
      } : n);
      setEditingNoteId(null);
    } else {
      nextNotes = [...personalNotes, {
        id: `note_${Date.now()}`,
        title: noteTitle.trim(),
        subjectId: noteSubject,
        body: noteBody.trim(),
        date: new Date().toLocaleDateString(),
      }];
    }

    setPersonalNotes(nextNotes);
    localStorage.setItem("l5swd_personal_notes", JSON.stringify(nextNotes));

    setNoteTitle("");
    setNoteSubject("");
    setNoteBody("");
  };

  const handleEditNote = (note: any) => {
    setNoteTitle(note.title);
    setNoteSubject(note.subjectId);
    setNoteBody(note.body);
    setEditingNoteId(note.id);
  };

  const handleDeleteNote = (id: string) => {
    const next = personalNotes.filter(n => n.id !== id);
    setPersonalNotes(next);
    localStorage.setItem("l5swd_personal_notes", JSON.stringify(next));
  };

  // Helper subjects mapping
  const getSubjectTitle = (id: string) => {
    return modules.find(m => m.id === id)?.title || "General Curriculum";
  };

  // Filtered resources
  const getFilteredResources = () => {
    return getAllResources().filter(res => {
      const matchQuery = res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          res.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSubject = filterSubject === "" || res.subjectId === filterSubject;
      const matchDifficulty = filterDifficulty === "" || res.difficulty === filterDifficulty;
      const matchFileType = filterFileType === "" || res.fileType === filterFileType;
      return matchQuery && matchSubject && matchDifficulty && matchFileType;
    });
  };

  // Mini quiz details for collapsed questions
  const getMiniQuizQuestion = (topicIdx: number) => {
    const questionsList = [
      { q: "What is the primary role of the Model element in MVC design patterns?", options: ["User Interface Rendering", "interpreting click triggers", "Managing schemas and database tables CRUD", "Listening to network port 3000"], correct: "Managing schemas and database tables CRUD" },
      { q: "Which statement best defines 1NF requirements in databases?", options: ["Eliminating composite tables", "Ensuring atomic cell values with zero array columns", "Defining three unique foreign index tags", "Creating automatic backup logs"], correct: "Ensuring atomic cell values with zero array columns" },
      { q: "Which of the following describes Encapsulation in OOP Java syntax?", options: ["Extends subclasses dynamically", "Using private parameters accessed only by public accessors", "Using abstract interface behaviors", "Compiling class files directly to binaries"], correct: "Using private parameters accessed only by public accessors" },
      { q: "Where does Unit testing occur in standard L5SWD workflows?", options: ["In live container servers", "On isolated modules without secondary network/external structures", "Directly in database indexes", "In production environments with clients present"], correct: "On isolated modules without secondary network/external structures" },
      { q: "What does Nginx reverse proxy predominantly handle?", options: ["Database tables partition models", "Hardware electrostatic grounding loops", "SSL termination and gateway route distributions", "Compiling JUnit source frameworks"], correct: "SSL termination and gateway route distributions" },
      { q: "Which device safety protocol represents ESD prevention?", options: ["Partitioning server drives to Ext4 formats", "Placing memory cards on anti-static mats and wearing grounding wrist bands", "Deleting temporary browser cookie folders", "Adjusting bios passwords"], correct: "Placing memory cards on anti-static mats and wearing grounding wrist bands" }
    ];
    return questionsList[topicIdx % questionsList.length];
  };

  return (
    <div className="space-y-6" id="study-materials-moodle-stage">
      
      {/* Upper Information Banner: RTB Header Aesthetic */}
      <div className="bg-slate-950/45 border border-slate-850 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4" id="moodle-welcome-banner">
        <div className="text-left">
          <span className="text-[9px] font-mono tracking-wider font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded leading-none inline-block mb-1">
            Moodle Core Framework Active 🇷🇼
          </span>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">Theory Moodle Learning Center</h2>
          <p className="text-xs text-slate-400">Interact with topic lessons, download booklets, query the AI study companion, and review recommendations.</p>
        </div>

        {/* Dynamic Study Goals tracker */}
        <div className="flex gap-3 text-xs text-left" id="moodle-header-stats">
          <div className="bg-slate-900 border border-slate-800 p-2 rounded-xl text-center shrink-0 min-w-[100px]">
            <span className="text-[10px] font-mono text-slate-500 uppercase block">Study Hours</span>
            <strong className="text-sm font-bold text-white">{Math.floor(studyMinutes / 60)}h {studyMinutes % 60}m</strong>
          </div>
          <div className="bg-slate-900 border border-slate-850 p-2 rounded-xl text-center shrink-0 min-w-[100px]">
            <span className="text-[10px] font-mono text-slate-500 uppercase block">Topics Learnt</span>
            <strong className="text-sm font-bold text-indigo-400">{completedLessons.length} Completed</strong>
          </div>
        </div>
      </div>

      {/* Core Tabs Navigator */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-slate-950/20 p-1 border border-slate-850/60 rounded-xl" id="materials-tabs">
        <button
          onClick={() => setActiveTab("lessons")}
          className={`py-3 rounded-lg text-xs font-semibold cursor-pointer outline-none transition flex items-center justify-center gap-2 ${
            activeTab === "lessons" 
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/10" 
              : "text-slate-400 hover:text-slate-200"
          }`}
          id="tab-btn-moodle-lessons"
        >
          <BookOpen className="w-4 h-4" />
          <span>Theory Moodle Lessons</span>
        </button>

        <button
          onClick={() => setActiveTab("resources")}
          className={`py-3 rounded-lg text-xs font-semibold cursor-pointer outline-none transition flex items-center justify-center gap-2 relative ${
            activeTab === "resources" 
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/10" 
              : "text-slate-400 hover:text-slate-200"
          }`}
          id="tab-btn-moodle-resources"
        >
          <Download className="w-4 h-4" />
          <span>Resource Center</span>
          {weakTopicsDetected.length > 0 && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("tools")}
          className={`py-3 rounded-lg text-xs font-semibold cursor-pointer outline-none transition flex items-center justify-center gap-2 ${
            activeTab === "tools" 
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/10" 
              : "text-slate-400 hover:text-slate-200"
          }`}
          id="tab-btn-moodle-tools"
        >
          <ListTodo className="w-4 h-4" />
          <span>Personal Study Tools</span>
        </button>

        <button
          onClick={() => setActiveTab("ai_tutor")}
          className={`py-3 rounded-lg text-xs font-semibold cursor-pointer outline-none transition flex items-center justify-center gap-2 ${
            activeTab === "ai_tutor" 
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/10" 
              : "text-slate-400 hover:text-slate-200"
          }`}
          id="tab-btn-moodle-aitutor"
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Study Buddy Kivu AI</span>
        </button>
      </div>

      {/* Main Container Stage splits */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6" id="moodle-workspace">
        
        {/* LEFT COLUMN: 8 Cols containing the Active Content Tab */}
        <div className="xl:col-span-8">
          
          {/* TAB 1: THEORY LESSONS MOODLE GRID */}
          {activeTab === "lessons" && (
            <div className="space-y-5" id="tabview-moodle-lessons">
              
              {/* Subject details card */}
              <div className="border border-slate-850 bg-slate-900/40 rounded-2xl p-5" id="lesson-curriculum-header">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4 mb-4">
                  <div className="text-left">
                    <span className="text-[10px] font-mono text-indigo-400 block font-bold mb-0.5">CURRENT CLASS UNIT</span>
                    <h3 className="text-base font-extrabold text-white leading-tight">
                      {selectedModule?.code} - {selectedModule?.title}
                    </h3>
                  </div>

                  {/* Syllabus subject switcher dropdown inside lessons */}
                  <div className="text-left shrink-0">
                    <label className="block text-[8px] font-mono text-slate-500 uppercase font-bold mb-1">Select Module course</label>
                    <select
                      value={selectedModule?.id || ""}
                      onChange={(e) => {
                        const found = modules.find(m => m.id === e.target.value);
                        if (found) setSelectedModule(found);
                      }}
                      className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-250 font-semibold focus:outline-none"
                    >
                      {modules.map(m => (
                        <option key={m.id} value={m.id}>{m.code} - {m.title.slice(0, 32)}...</option>
                      ))}
                    </select>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-400 text-left leading-relaxed font-sans">{selectedModule?.description}</p>
              </div>

              {/* Moodle topic list structured 1-to-1 matching screenshot layout */}
              <div className="space-y-4" id="moodle-collapsible-list">
                {selectedModule?.topics.map((topic, index) => {
                  const isExpanded = expandedTopicIdx === index;
                  const isDone = completedLessons.includes(topic.title);
                  const isBookmarked = bookmarks.includes(topic.title);
                  const topicQuiz = getMiniQuizQuestion(index);

                  return (
                    <div 
                      key={index}
                      className={`border rounded-2xl transition-all duration-300 ${
                        isExpanded 
                          ? "bg-slate-950/45 border-indigo-500/50 shadow-lg shadow-indigo-950/10" 
                          : "bg-slate-900/35 border-slate-850 hover:border-slate-800"
                      }`}
                      id={`moodle-item-${index}`}
                    >
                      {/* Collapsed triggers row */}
                      <div 
                        onClick={() => setExpandedTopicIdx(isExpanded ? null : index)}
                        className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-3 text-left">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCompletedLesson(topic.title);
                            }}
                            className={`p-1.5 rounded-lg border transition ${
                              isDone 
                                ? "bg-emerald-500/15 border-emerald-500 text-emerald-400" 
                                : "bg-slate-950/50 border-slate-800 text-slate-600 hover:text-slate-400"
                            }`}
                            title={isDone ? "Lesson completed" : "Mark as completed"}
                          >
                            <Check className="w-3.5 h-3.5 shrink-0" />
                          </button>

                          <div>
                            <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold">
                              Section IC1.{index + 1} • {selectedModule.code}
                            </span>
                            <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight leading-snug hover:text-indigo-400 transition">
                              {topic.title}
                            </h4>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          {/* Bookmarking toggle */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleBookmarkLesson(topic.title);
                            }}
                            className={`p-1.5 rounded-lg border transition ${
                              isBookmarked 
                                ? "bg-indigo-550/10 border-indigo-500 text-indigo-400" 
                                : "bg-slate-950/20 border-slate-850 text-slate-600 hover:text-slate-400"
                            }`}
                            title="Add to study revisions"
                          >
                            <Bookmark className="w-3.5 h-3.5 shrink-0" />
                          </button>

                          <div className="text-xs text-slate-500">
                            {isExpanded ? "Collapse" : "Expand"}
                          </div>
                        </div>
                      </div>

                      {/* Expanded study material tools grid */}
                      {isExpanded && (
                        <div className="px-4 pb-5 sm:px-5 sm:pb-6 border-t border-slate-900 pt-4 space-y-4 animate-fade-in text-left">
                          
                          {/* Rich Lesson theory Notes summary details */}
                          <div className="space-y-3">
                            <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                              Theoretical Objectives Summary:
                            </h5>
                            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/30 p-4 border border-slate-900 rounded-xl whitespace-pre-line font-sans select-text">
                              {topic.details}
                            </p>
                          </div>

                          {/* Moodle Assets Shelf: Looks exactly like RTB Moodle links screenshot! */}
                          <div className="space-y-2 pt-1">
                            <h6 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">Syllabus Learning Material Items:</h6>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" id="assets-list-moodle">
                              
                              {/* 📄 PDF Booklet simulator */}
                              <div 
                                onClick={() => setPdfPreviewFile({
                                  id: `pdf_temp_${index}`,
                                  title: `pdf_notes_about_${topic.title.toLowerCase().replace(/\s+/g, "_")}.pdf`,
                                  description: topic.details,
                                  subjectId: selectedModule.id,
                                  topic: topic.title,
                                  fileType: "pdf",
                                  difficulty: "intermediate",
                                  author: "Rwanda TVET Board (RTB)",
                                  uploadDate: "June 2025",
                                  downloads: 120,
                                  rating: 4.8,
                                  fileSize: "1.4 MB"
                                })}
                                className="flex items-center gap-3 p-3 bg-indigo-950/10 border border-indigo-505/10 border-indigo-500/10 hover:border-indigo-500/30 hover:bg-indigo-950/20 rounded-xl cursor-pointer transition"
                              >
                                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg shrink-0">
                                  <FileText className="w-4 h-4 shrink-0" />
                                </div>
                                <div className="truncate text-left flex-1">
                                  <span className="text-xs font-bold text-slate-200 block truncate leading-tight">pdf notes about {topic.title.toLowerCase()}</span>
                                  <span className="text-[9px] font-mono text-slate-500">1.4 MB • Read in-viewer or download</span>
                                </div>
                                <Eye className="w-3.5 h-3.5 text-indigo-450 shrink-0 opacity-60 hover:opacity-100" />
                              </div>

                              {/* 💻 Code sandbox snippet helper */}
                              {topic.codeSnippet && (
                                <div 
                                  onClick={() => handleRunPlayground(topic.title, topic.codeSnippet)}
                                  className="flex items-center gap-3 p-3 bg-emerald-950/15 border border-emerald-500/10 hover:border-emerald-500/20 hover:bg-emerald-950/20 rounded-xl cursor-pointer transition"
                                >
                                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg shrink-0">
                                    <Code className="w-4 h-4 shrink-0" />
                                  </div>
                                  <div className="truncate text-left flex-1">
                                    <span className="text-xs font-bold text-slate-200 block truncate leading-tight">Interactive Code Example Playground</span>
                                    <span className="text-[9px] font-mono text-slate-500">Click to execute inside terminal sandbox</span>
                                  </div>
                                  <Terminal className="w-3.5 h-3.5 text-emerald-450 shrink-0 opacity-60" />
                                </div>
                              )}

                              {/* 📝 End of Lesson Mini-QUIZ */}
                              <div 
                                onClick={() => handleStartLessonQuiz(index)}
                                className="flex items-center gap-3 p-3 bg-amber-950/15 border border-amber-500/10 hover:border-amber-500/20 hover:bg-amber-950/20 rounded-xl cursor-pointer transition"
                              >
                                <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg shrink-0">
                                  <HelpCircle className="w-4 h-4 shrink-0" />
                                </div>
                                <div className="truncate text-left flex-1">
                                  <span className="text-xs font-bold text-slate-200 block truncate leading-tight">End of IC1.{index + 1} Quiz Check</span>
                                  <span className="text-[9px] font-mono text-slate-500">Check syllabus understanding instantly</span>
                                </div>
                                <Play className="w-3.5 h-3.5 text-amber-550 shrink-0 opacity-60" />
                              </div>

                              {/* 🎥 Video Coaching Seminar */}
                              <div 
                                onClick={() => setVideoPreviewFile({
                                  id: `video_temp_${index}`,
                                  title: `Session_Seminar_Guide_To_${topic.title.replace(/\s+/g, "_")}.mp4`,
                                  description: `Interactive lectures summary explaining ${topic.title} in accordance with Rwanda TVET assessment requirements.`,
                                  subjectId: selectedModule.id,
                                  topic: topic.title,
                                  fileType: "video",
                                  difficulty: "beginner",
                                  author: "Academic Lecturer Video",
                                  uploadDate: "June 2025",
                                  downloads: 85,
                                  rating: 4.8,
                                  fileSize: "45 MB"
                                })}
                                className="flex items-center gap-3 p-3 bg-purple-950/15 border border-purple-500/10 hover:border-purple-500/20 hover:bg-purple-950/20 rounded-xl cursor-pointer transition"
                              >
                                <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg shrink-0">
                                  <PlaySquare className="w-4 h-4 shrink-0" />
                                </div>
                                <div className="truncate text-left flex-1">
                                  <span className="text-xs font-bold text-slate-200 block truncate leading-tight">Webinar Coaching Seminar Video</span>
                                  <span className="text-[9px] font-mono text-slate-500">Watch classroom discussion stream</span>
                                </div>
                                <Eye className="w-3.5 h-3.5 text-purple-400 shrink-0 opacity-60" />
                              </div>
                            </div>
                          </div>

                          {/* Quick AI Explainer integration */}
                          <div className="flex items-center justify-between border-t border-slate-900 pt-3 text-xs">
                            <span className="text-[11px] text-slate-400">Need immediate guidance on this topic?</span>
                            <button
                              onClick={() => triggerAiHelpOnTopic(topic.title, topic.details)}
                              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px] transition flex items-center gap-1.5 cursor-pointer outline-none"
                            >
                              <Sparkles className="w-3 h-3 text-amber-300 animate-spin" />
                              <span>AI Study Explanation</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: SMART RECOMMENDATIONS RESOURCE CENTER */}
          {activeTab === "resources" && (
            <div className="space-y-6" id="tabview-moodle-resources">
              
              {/* 1. SMART RECOMMENDATIONS & DIAGNOSTICS DECK */}
              <div className="bg-slate-905 bg-slate-950/40 border border-slate-850 p-5 rounded-2xl text-left space-y-4" id="ai-smart-recommendation-deck">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/15 shrink-0">
                    <Sparkles className="w-5 h-5 text-indigo-400 animate-spin" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-tight">Candidacy Performance & AI Study Diagnostics Board</h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      Our automated marking loops track your mock responses. Recommended materials dynamically adjust to prioritize topics scoring under 50% to align with TVET examination rubrics.
                    </p>
                  </div>
                </div>

                {/* Main conditional recommendations alert */}
                {weakTopicsDetected.length > 0 ? (
                  <div className="bg-rose-950/15 border border-rose-500/25 p-4 rounded-xl flex items-start gap-3.5" id="ai-weakness-alert">
                    <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 shrink-0">
                      <AlertTriangle className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <h4 className="text-xs font-bold text-rose-400 uppercase tracking-widest">Syllabus Weaknesses Mapped! ({weakTopicsDetected.length})</h4>
                      <p className="text-[11px] text-slate-350 leading-relaxed font-sans">
                        Your previous assessment sessions returned scores below 65% in database schema designs or OOP inheritance units. The Resource Recommendation Engine has prioritised core books and mock files to strengthen these knowledge domains:
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1 font-mono text-[9px]">
                        {weakTopicsDetected.map(tid => (
                          <span key={tid} className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 text-rose-410 text-rose-300 rounded font-bold uppercase">
                            {getSubjectTitle(tid).slice(0, 24)}...
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-emerald-950/10 border border-emerald-500/15 p-4 rounded-xl flex items-start gap-3.5" id="ai-high-alert">
                    <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 shrink-0">
                      <Check className="w-4.5 h-4.5 text-emerald-400 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Syllabus Coverage Pristine</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans mt-0.5">
                        Your previous test results are in good standing! No critical knowledge deficits reported in your candidate history profile. Showing universal core booklets and sample exams.
                      </p>
                    </div>
                  </div>
                )}

                {/* Dynamic Simulator Tool & AI Explainer */}
                <div className="border-t border-slate-900 pt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Diagnosis Sandbox Simulator triggers */}
                  <div className="space-y-2">
                    <h5 className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-500">Diagnostic Sandbox Simulators</h5>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                      Want to verify how recommendations behave? Trigger simulated low scores in specific software categories to re-rank the materials repository:
                    </p>
                    <div className="flex flex-wrap gap-2 text-[9px] font-mono">
                      <button
                        onClick={() => {
                          const records = [{ score: 45, date: "2025-06-11", subjectId: "l5swd_db" }];
                          localStorage.setItem("l5swd_history", JSON.stringify(records));
                          window.location.reload();
                        }}
                        className="px-2.5 py-1.5 bg-indigo-950/40 hover:bg-indigo-900/30 border border-indigo-500/20 hover:border-indigo-500/40 text-indigo-300 rounded transition font-semibold"
                      >
                        ⚡ Simulate Database Schema Weakness {"(< 50%)"}
                      </button>
                      <button
                        onClick={() => {
                          const records = [{ score: 38, date: "2025-06-11", subjectId: "l5swd_oop" }];
                          localStorage.setItem("l5swd_history", JSON.stringify(records));
                          window.location.reload();
                        }}
                        className="px-2.5 py-1.5 bg-pink-950/40 hover:bg-pink-900/30 border border-pink-500/20 hover:border-pink-500/40 text-pink-300 rounded transition font-semibold"
                      >
                        ⚡ Simulate OOP Java Polymorphism Weakness {"(< 50%)"}
                      </button>
                      <button
                        onClick={() => {
                          localStorage.removeItem("l5swd_history");
                          window.location.reload();
                        }}
                        className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded transition font-semibold"
                      >
                        🔄 Reset Diagnostic History Logs
                      </button>
                    </div>
                  </div>

                  {/* Submit self weakness for immediate diagnosis */}
                  <div className="space-y-2 border-t lg:border-t-0 lg:border-l border-slate-900 lg:pl-4 pt-4 lg:pt-0">
                    <h5 className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-500">AI Study Suggestions Generator</h5>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                      Self-diagnose your weakness. Submit a specific topic domain to acquire formatted academic advice, checklists, and matching files:
                    </p>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Normalization 3NF, Exception casting"
                        value={aiSelectionWeakness}
                        onChange={(e) => setAiSelectionWeakness(e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        onClick={() => generateAiSuggestions(aiSelectionWeakness)}
                        disabled={isAiPlanLoading || !aiSelectionWeakness.trim()}
                        className="px-3 py-1.5 bg-indigo-650 hover:bg-indigo-600 disabled:opacity-40 text-white rounded-lg text-xs font-semibold shrink-0 transition"
                      >
                        {isAiPlanLoading ? "Diagnosing..." : "Run AI Analysis"}
                      </button>
                    </div>

                    {/* suggestion feedback block */}
                    {aiSuggestedPlan && (
                      <div className="p-3 bg-indigo-950/10 border border-indigo-500/20 rounded-lg space-y-2 text-xs font-sans text-slate-300 animate-fade-in relative">
                        <button
                          onClick={() => setAiSuggestedPlan(null)}
                          className="absolute top-2 right-2 text-slate-500 hover:text-white font-bold"
                        >
                          ✕
                        </button>
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          AI Advisory: {aiSuggestedPlan.weaknessTitle} Study Map
                        </h4>
                        <p className="text-[11px] leading-relaxed text-slate-350">{aiSuggestedPlan.rationale}</p>
                        
                        <div className="space-y-1">
                          <span className="text-[10px] text-[9px] font-mono text-slate-500 uppercase font-black tracking-widest">Recommended Practical Drill Tasks:</span>
                          <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-400">
                            {aiSuggestedPlan.milestones.map((mil, countIdx) => (
                              <li key={countIdx}>{mil}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. MAIN RESOURCE VAULT NAVIGATION (Syllabus vs NESA official Past Exams) */}
              <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-850 pb-3 gap-3">
                <div className="flex flex-wrap gap-1.5 bg-slate-950/60 p-1 rounded-xl border border-slate-850">
                  <button
                    onClick={() => setActiveResourceSubTab("all")}
                    className={`px-4 py-2 rounded-lg text-xs font-bold font-sans transition flex items-center gap-2 ${
                      activeResourceSubTab === "all"
                        ? "bg-indigo-605 bg-indigo-600 text-white shadow"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <BookOpen className="w-4 h-4 shrink-0" />
                    <span>Syllabus Resource Library</span>
                  </button>
                  <button
                    onClick={() => setActiveResourceSubTab("nesa")}
                    className={`px-4 py-2 rounded-lg text-xs font-bold font-sans transition flex items-center gap-2 ${
                      activeResourceSubTab === "nesa"
                        ? "bg-indigo-605 bg-indigo-600 text-white shadow"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <div className="w-2.5 h-2 my-auto flex gap-0.5" title="Rwanda TVET">
                      <span className="w-1 bg-[#185a9d] h-full block"></span>
                      <span className="w-1 bg-[#f9db0f] h-full block"></span>
                      <span className="w-1 bg-[#2e8b57] h-full block"></span>
                    </div>
                    <span>NESA Official Past Papers Vault</span>
                  </button>
                </div>

                {/* Sub titles metadata banner info */}
                <div className="text-right text-[10px] font-mono text-indigo-400">
                  {activeResourceSubTab === "all"
                    ? "Syllabus Guides | DOCX Exercises | Slides"
                    : "National Exams | Official Guides | Sample Mockups"}
                </div>
              </div>

              {/* NESA internal categories sub navigation */}
              {activeResourceSubTab === "nesa" && (
                <div className="flex flex-wrap gap-1 bg-slate-900/40 p-1.5 border border-slate-850 rounded-xl" id="nesa-sub-nav">
                  <button
                    onClick={() => setNesaTab("papers")}
                    className={`px-3 py-1.5 rounded-lg text-[10.5px] font-semibold transition ${
                      nesaTab === "papers"
                        ? "bg-slate-950 text-white border border-slate-800"
                        : "text-slate-400 hover:text-slate-250"
                    }`}
                  >
                    Past Exam Papers
                  </button>
                  <button
                    onClick={() => setNesaTab("guides")}
                    className={`px-3 py-1.5 rounded-lg text-[10.5px] font-semibold transition ${
                      nesaTab === "guides"
                        ? "bg-slate-950 text-white border border-slate-800"
                        : "text-slate-400 hover:text-slate-250"
                    }`}
                  >
                    Official Scoring Guides
                  </button>
                  <button
                    onClick={() => setNesaTab("samples")}
                    className={`px-3 py-1.5 rounded-lg text-[10.5px] font-semibold transition ${
                      nesaTab === "samples"
                        ? "bg-slate-950 text-white border border-slate-800"
                        : "text-slate-400 hover:text-slate-250"
                    }`}
                  >
                    Practical Mock Mockups
                  </button>
                  <button
                    onClick={() => setNesaTab("national_assessments")}
                    className={`px-3 py-1.5 rounded-lg text-[10.5px] font-semibold transition ${
                      nesaTab === "national_assessments"
                        ? "bg-slate-950 text-white border border-slate-800"
                        : "text-slate-400 hover:text-slate-250"
                    }`}
                  >
                    Assessment Guidelines
                  </button>
                </div>
              )}

              {/* 3. INSTRUCTOR ADMIN STATS PANEL & UPLOAD FORMS CONTROLLER */}
              {(userRole === "teacher" || userRole === "admin") && (
                <div className="space-y-4" id="teacher-resource-center-tools">
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div className="bg-slate-950/40 border border-slate-850/70 p-3.5 rounded-xl text-left">
                      <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold leading-none">Material Assets</span>
                      <strong className="text-lg font-bold text-white block mt-1 font-mono">{getAllResources().length}</strong>
                      <span className="text-[8px] text-slate-550 block mt-0.5">Syllabus catalogs</span>
                    </div>

                    <div className="bg-slate-950/40 border border-slate-850/70 p-3.5 rounded-xl text-left">
                      <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold leading-none">Library Downloads</span>
                      <strong className="text-lg font-bold text-indigo-400 block mt-1 font-mono">
                        {getAllResources().reduce((acc, current) => acc + (downloadTracker[current.id] || current.downloads), 0)}
                      </strong>
                      <span className="text-[8px] text-slate-550 block mt-0.5">Verified downloads logs</span>
                    </div>

                    <div className="bg-slate-950/40 border border-slate-850/70 p-3.5 rounded-xl text-left col-span-2 md:col-span-1">
                      <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold leading-none">Most Popular File</span>
                      <span className="text-xs font-bold text-slate-200 block mt-1 truncate max-w-[130px]" title={
                        [...getAllResources()].sort((a,b) => (downloadTracker[b.id] || b.downloads) - (downloadTracker[a.id] || a.downloads))[0]?.title || "None"
                      }>
                        {[...getAllResources()].sort((a,b) => (downloadTracker[b.id] || b.downloads) - (downloadTracker[a.id] || a.downloads))[0]?.title || "None"}
                      </span>
                      <span className="text-[8px] text-slate-550 block mt-0.5">Highest download ranks</span>
                    </div>

                    <div className="bg-slate-950/40 border border-slate-850/70 p-3.5 rounded-xl text-left">
                      <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold leading-none">Flagged Broken</span>
                      <strong className={`text-lg font-bold block mt-1 font-mono ${reportedBroken.length > 0 ? "text-rose-400 animate-pulse" : "text-emerald-450 text-emerald-400"}`}>
                        {reportedBroken.length}
                      </strong>
                      <span className="text-[8px] text-slate-550 block mt-0.5">Reported candidate links</span>
                    </div>

                    <div className="bg-slate-950/40 border border-slate-850/70 p-3.5 rounded-xl text-left">
                      <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold leading-none">Helpful Reviews</span>
                      <strong className="text-lg font-bold text-amber-400 block mt-1 font-mono">
                        {Object.keys(resourceRatings).length} Starred
                      </strong>
                      <span className="text-[8px] text-slate-550 block mt-0.5">Quality assessment metrics</span>
                    </div>
                  </div>

                  {/* Red flags drawer review if any broken files exist */}
                  {Object.keys(reportedBroken).length > 0 && (
                    <div className="bg-rose-950/15 border border-rose-500/20 p-3.5 rounded-xl text-left space-y-2 animate-fade-in" id="flagged-broken-list">
                      <h4 className="text-[10px] font-mono uppercase font-black text-rose-400 flex items-center gap-1.5 leading-none">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-ping" />
                        Instructor Advisory: Candidate Broken File Flags Review Box
                      </h4>
                      <p className="text-[10.5px] text-slate-400 font-sans leading-relaxed">
                        These links have been reported as having missing details or downloading incorrect files. Please analyze and refresh/correct:
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
                        {Object.keys(reportedBroken).map(brokenId => {
                          const item = getAllResources().find(r => r.id === brokenId);
                          if (!item) return null;
                          return (
                            <div key={brokenId} className="p-2.5 bg-slate-955 bg-slate-950/50 border border-slate-850 rounded-lg flex items-center justify-between gap-3 text-left">
                              <div className="truncate flex-1">
                                <span className="text-[11px] font-bold text-slate-200 block truncate leading-tight">{item.title}</span>
                                <span className="text-[8.5px] font-mono text-slate-500 block">ID: {brokenId} • {item.fileType.toUpperCase()} file</span>
                              </div>
                              <div className="flex gap-1.5">
                                <button
                                  onClick={() => handleResetBrokenStatus(brokenId)}
                                  className="px-2 py-1 bg-indigo-950/60 border border-indigo-500/20 text-indigo-300 text-[10px] rounded hover:bg-slate-900"
                                >
                                  Clear broken flag
                                </button>
                                <button
                                  onClick={() => handleDeleteResource(brokenId)}
                                  className="px-2 py-1 bg-rose-955 bg-rose-500/15 border border-rose-500/30 text-rose-400 text-[10px] rounded hover:bg-rose-950/40"
                                >
                                  Delete asset
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Main Edit / Upload Form */}
                  <div className="bg-slate-950/30 p-5 border border-slate-850 rounded-2xl text-left" id="resource-upload-box">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-slate-900 pb-2 mb-3.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Plus className="w-4 h-4 text-indigo-400" />
                        {editingResource ? "Instructor Tool: Edit Study Booklet Metadata" : "Instructor Tool: Register Study Resource Asset"}
                      </span>
                      {editingResource && (
                        <button
                          onClick={() => {
                            setEditingResource(null);
                            setUploadTitle("");
                            setUploadDesc("");
                            setUploadSubj("");
                            setUploadTopic("");
                            setUploadType("pdf");
                            setUploadDifficulty("intermediate");
                            setUploadAuthor("Rwanda TVET Board (RTB)");
                            setIsNesaOnly(false);
                            setUploadNesaCategory("mock_exam");
                          }}
                          className="text-[10px] font-mono border border-slate-800 bg-slate-950 text-slate-400 hover:text-white px-2 py-0.5 rounded"
                        >
                          Cancel Edit Mode
                        </button>
                      )}
                    </h3>

                    <form onSubmit={handleTeacherUploadResource} className="space-y-4 font-sans">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-[9px] font-mono uppercase text-slate-500 font-extrabold mb-1">Booklet Title / File name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Database Normalization Guide"
                            value={uploadTitle}
                            onChange={(e) => setUploadTitle(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none placeholder-slate-600"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-mono uppercase text-slate-500 font-extrabold mb-1">Subject mapping</label>
                          <select
                            required
                            value={uploadSubj}
                            onChange={(e) => setUploadSubj(e.target.value)}
                            className="w-full px-2.5 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-350 focus:outline-none"
                          >
                            <option value="">Choose syllabus subject...</option>
                            {modules.map(m => (
                              <option key={m.id} value={m.id}>{m.title}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                        <div>
                          <label className="block text-[9px] font-mono uppercase text-slate-500 font-extrabold mb-1">Topic Tag Keyword</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Normalization, Polymorphism, DevOps"
                            value={uploadTopic}
                            onChange={(e) => setUploadTopic(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none placeholder-slate-600"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-mono uppercase text-slate-500 font-extrabold mb-1">Author Name / Entity</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Rwanda TVET Board (RTB)"
                            value={uploadAuthor}
                            onChange={(e) => setUploadAuthor(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none placeholder-slate-600"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-mono uppercase text-slate-500 font-extrabold mb-1">File Format Type</label>
                          <select
                            value={uploadType}
                            onChange={(e) => setUploadType(e.target.value as any)}
                            className="w-full px-2.5 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-350 focus:outline-none"
                          >
                            <option value="pdf">Adobe PDF Document (.pdf)</option>
                            <option value="pptx">PowerPoint Presentation Slide Deck (.pptx)</option>
                            <option value="zip">ZIP Developer Template Archive (.zip)</option>
                            <option value="docx">Microsoft Word Exercises worksheet (.docx)</option>
                            <option value="image">JPEG/PNG diagrams illustrations (.png)</option>
                            <option value="video">Classroom Webinar Video Explainer (.mp4)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                        <div>
                          <label className="block text-[9px] font-mono uppercase text-slate-500 font-extrabold mb-1">Difficulty level</label>
                          <select
                            value={uploadDifficulty}
                            onChange={(e) => setUploadDifficulty(e.target.value as any)}
                            className="w-full px-2.5 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-350 focus:outline-none"
                          >
                            <option value="beginner">Beginner Syllabus Basics</option>
                            <option value="intermediate">Intermediate Drill Practice Level</option>
                            <option value="expert">Expert Debugging Complexity</option>
                          </select>
                        </div>

                        {/* Toggle NESA Past paper parameters */}
                        <div className="flex items-center gap-2 pt-4">
                          <input
                            type="checkbox"
                            id="isNesaCandidacyOnly"
                            checked={isNesaOnly}
                            onChange={(e) => {
                              setIsNesaOnly(e.target.checked);
                              if (e.target.checked && !uploadNesaCategory) {
                                setUploadNesaCategory("past_paper");
                              }
                            }}
                            className="w-4 h-4 rounded text-indigo-605 border-slate-800 bg-slate-900"
                          />
                          <label htmlFor="isNesaCandidacyOnly" className="block text-[10.5px] font-mono uppercase text-slate-400 font-extrabold cursor-pointer">
                            Is NESA Past Paper / Mock
                          </label>
                        </div>

                        {isNesaOnly && (
                          <div>
                            <label className="block text-[9px] font-mono uppercase text-[#e1ab00] font-extrabold mb-1">NESA Category Mapping</label>
                            <select
                              value={uploadNesaCategory}
                              onChange={(e) => setUploadNesaCategory(e.target.value as any)}
                              className="w-full px-2.5 py-2 bg-slate-900 border border-[#e1ab00]/30 rounded-lg text-xs text-slate-200 focus:outline-none"
                            >
                              <option value="past_paper">Past National Exam Paper</option>
                              <option value="marking_guide">Official Scoring/Marking Guides</option>
                              <option value="mock_exam">Practical Mock/Sample Exams</option>
                              <option value="assessment_resource">National Curriculum Assessment Resource</option>
                            </select>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-[9px] font-mono uppercase text-slate-500 font-extrabold mb-1">Brief Description of covered concepts</label>
                        <textarea
                          rows={2}
                          placeholder="e.g. Step-by-step workbook discussing Third Normal Form normalization decompositions, query indices, and relational database integrity."
                          value={uploadDesc}
                          onChange={(e) => setUploadDesc(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none placeholder-slate-650"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-550 transition text-white font-bold text-xs rounded-lg cursor-pointer outline-none"
                      >
                        {editingResource ? "Commit metadata upgrades" : "Register and publish booklet to Moodle"}
                      </button>
                    </form>

                    {uploadSuccessMsg && (
                      <div className="mt-3 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                        <Check className="w-4 h-4 shrink-0" />
                        <span>{uploadSuccessMsg}</span>
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* 4. KEY SEARCH BAR & ADVANCED TOPICS FILTERS */}
              <div className="bg-slate-900/35 border border-slate-850 p-4 rounded-2xl text-left space-y-3" id="resource-search-zone font-sans">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search papers title, key, author or specific topics (e.g. Normalization, Polymorphism)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 placeholder-slate-600 font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 shrink-0">
                    <select
                      value={filterSubject}
                      onChange={(e) => setFilterSubject(e.target.value)}
                      className="px-2 py-2 bg-slate-950 border border-slate-850 rounded-xl text-[11px] text-slate-350 focus:outline-none max-w-[130px]"
                    >
                      <option value="">All Subjects</option>
                      {modules.map(m => (
                        <option key={m.id} value={m.id}>{m.title.slice(0, 20)}...</option>
                      ))}
                    </select>

                    <select
                      value={filterDifficulty}
                      onChange={(e) => setFilterDifficulty(e.target.value)}
                      className="px-2 py-2 bg-slate-950 border border-slate-850 rounded-xl text-[11px] text-slate-350 focus:outline-none"
                    >
                      <option value="">All Grades</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="expert">Expert</option>
                    </select>

                    <select
                      value={filterFileType}
                      onChange={(e) => setFilterFileType(e.target.value)}
                      className="px-2 py-2 bg-slate-950 border border-slate-850 rounded-xl text-[11px] text-slate-350 focus:outline-none"
                    >
                      <option value="">All Formats</option>
                      <option value="pdf">PDF Docs</option>
                      <option value="pptx">PowerPoint</option>
                      <option value="zip">ZIP Temp</option>
                      <option value="docx font-sans">Word Docx</option>
                      <option value="image">PNG Diagrams</option>
                      <option value="video font-sans">Webinars</option>
                    </select>
                  </div>
                </div>

                {/* Micro instructions badge summary details */}
                <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-500 pt-1 font-mono">
                  <span>Showing {getFilteredResources().length} results based on catalog queries</span>
                  <span>Favorites pinned remain saved inside local sessions</span>
                </div>
              </div>

              {/* 5. AGILE CARDS GRID SYSTEM */}
              <div className="space-y-4 text-left">
                
                {/* Headers */}
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-900 pb-2 flex items-center justify-between">
                  <span>
                    {activeResourceSubTab === "all" ? "Syllabus Academic Booklets & Handouts Repository" : "NESA Candidate Assessment Papers & Guides"} ({getFilteredResources().length} assets)
                  </span>
                  <span className="text-[10px] text-slate-600 font-mono normal-case">Click on a resource card below to rate, preview or edit details</span>
                </h4>

                {getFilteredResources().length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getFilteredResources().map((res) => {
                      const dlCount = downloadTracker[res.id] || res.downloads;
                      const ratingScore = resourceRatings[res.id] || res.rating;
                      const isFaved = resourceFavorites.includes(res.id);
                      const isPinned = res.isPinned || pinnedResources.includes(res.id);
                      const isBroken = res.reportedBroken || reportedBroken.includes(res.id);
                      const matchedSub = modules.find(m => m.id === res.subjectId);

                      return (
                        <div 
                          key={res.id} 
                          className={`bg-slate-950/45 border hover:border-indigo-500/30 p-4.5 rounded-xl flex flex-col justify-between space-y-3 hover:translate-y-[-2px] transition duration-200 ${
                            isPinned ? "border-amber-500/20 bg-amber-955 bg-amber-500/5 shadow-md shadow-amber-950/5" : "border-slate-850"
                          } ${
                            isBroken ? "border-rose-500/25 bg-rose-500/5" : ""
                          }`}
                          id={`resource-item-${res.id}`}
                        >
                          <div className="space-y-1.5 font-sans relative">
                            {/* Pinned Crown ribbon or Warning tags */}
                            <div className="flex items-start justify-between gap-3 font-sans">
                              <div className="flex gap-1">
                                <span className={`text-[9px] font-mono px-2 py-0.5 rounded border font-extrabold uppercase ${
                                  res.fileType === "pdf" ? "bg-red-500/10 border-red-500/20 text-red-400" :
                                  res.fileType === "pptx" ? "bg-amber-550/10 border-amber-500/20 text-amber-400" :
                                  res.fileType === "zip" ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" :
                                  res.fileType === "docx" ? "bg-blue-500/10 border-blue-500/20 text-blue-400" :
                                  res.fileType === "image" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                                  "bg-purple-500/10 border-purple-500/20 text-purple-405 text-purple-400"
                                }`}>
                                  {res.fileType.toUpperCase()}
                                </span>
                                
                                {isPinned && (
                                  <span className="text-[9px] font-mono px-2 py-0.5 rounded border border-amber-500/20 bg-amber-500/10 text-amber-400 font-extrabold flex items-center gap-0.5">
                                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                                    <span>PINNED BY TEACHER</span>
                                  </span>
                                )}

                                {isBroken && (
                                  <span className="text-[9px] font-mono px-2 py-0.5 rounded border border-rose-500/20 bg-rose-550/15 text-rose-410 text-rose-400 font-extrabold">
                                    ⚠️ LINK UNDER REVIEW
                                  </span>
                                )}
                              </div>

                              {/* Top right drawer controls: Favorite, Pin, Moderate */}
                              <div className="flex gap-1.5">
                                <button
                                  onClick={() => toggleFavoriteResource(res.id)}
                                  className={`p-1.5 rounded-lg border transition ${
                                    isFaved 
                                      ? "bg-rose-500/10 border-rose-500 text-rose-450" 
                                      : "bg-slate-900 border-slate-850 text-slate-500 hover:text-slate-350"
                                  }`}
                                  title="Favorite booklet"
                                >
                                  <Heart className="w-3.5 h-3.5 shrink-0" fill={isFaved ? "currentColor" : "none"} />
                                </button>

                                {/* Teacher Pin toggle control */}
                                {(userRole === "teacher" || userRole === "admin") && (
                                  <button
                                    onClick={() => togglePinResource(res.id)}
                                    className={`p-1.5 rounded-lg border transition ${
                                      isPinned 
                                        ? "bg-amber-500/10 border-amber-500 text-amber-450" 
                                        : "bg-slate-900 border-slate-850 text-slate-500 hover:text-slate-355 text-slate-300"
                                    }`}
                                    title="Pin resource"
                                  >
                                    <Star className="w-3.5 h-3.5 shrink-0" fill={isPinned ? "currentColor" : "none"} />
                                  </button>
                                )}

                                {/* Admin delete custom booklet, or Edit button */}
                                {(userRole === "teacher" || userRole === "admin") && (
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => {
                                        setEditingResource(res);
                                        setUploadTitle(res.title);
                                        setUploadDesc(res.description);
                                        setUploadSubj(res.subjectId);
                                        setUploadTopic(res.topic);
                                        setUploadType(res.fileType);
                                        setUploadDifficulty(res.difficulty);
                                        setUploadAuthor(res.author);
                                        setIsNesaOnly(!!res.isNesaOnly);
                                        setUploadNesaCategory(res.nesaCategory || "past_paper");
                                        const uploadTag = document.getElementById("resource-upload-box");
                                        if (uploadTag) {
                                          uploadTag.scrollIntoView({ behavior: "smooth" });
                                        }
                                      }}
                                      className="p-1.5 rounded-lg bg-slate-905 bg-slate-900 border border-slate-850 text-indigo-400 hover:text-white"
                                      title="Edit file details"
                                    >
                                      <Edit2 className="w-3.5 h-3.5 shrink-0" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteResource(res.id)}
                                      className="p-1.5 rounded-lg bg-slate-905 bg-slate-900 border border-slate-850 text-rose-555 text-rose-400 hover:bg-rose-955 bg-rose-500/10"
                                      title="Remove resource file"
                                    >
                                      <Trash2 className="w-3.5 h-3.5 shrink-0" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Booklet metadata details */}
                            <div className="space-y-1">
                              <h5 className="text-xs sm:text-sm font-bold text-white tracking-tight line-clamp-1 leading-snug">
                                {res.title}
                              </h5>
                              <p className="text-[11px] text-slate-400 leading-relaxed font-sans line-clamp-2 min-h-[32px] select-text">
                                {res.description}
                              </p>
                            </div>

                            {/* Tags row */}
                            <div className="flex flex-wrap gap-1 text-[9px] font-mono text-slate-500 uppercase font-bold pt-1">
                              <span className="px-1.5 py-0.5 bg-slate-900 border border-slate-850 rounded">Topic: {res.topic}</span>
                              <span className="px-1.5 py-0.5 bg-slate-900 border border-slate-850 rounded">BY: {res.author.slice(0, 15)}</span>
                              <span className="px-1.5 py-0.5 bg-slate-900 border border-slate-850 rounded">Grading: {res.difficulty}</span>
                            </div>
                          </div>

                          {/* STARS & FEEDBACK REVIEW COLLAPSIBLE ACCORDION */}
                          <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-3 space-y-2.5 font-sans text-xs">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 leading-none">
                                <span className="text-[10px] text-slate-500">Metric Review:</span>
                                {[1, 2, 3, 4, 5].map((str) => (
                                  <button
                                    key={str}
                                    onClick={() => handleRateResource(res.id, str)}
                                    className="p-0.5 focus:outline-none"
                                  >
                                    <Star className={`w-3.5 h-3.5 ${str <= Math.round(ratingScore) ? "text-amber-400 fill-amber-400 animate-pulse" : "text-slate-650 text-slate-600"}`} />
                                  </button>
                                ))}
                                <span className="text-[10.5px] font-bold text-slate-300 ml-1 font-mono">({ratingScore.toFixed(1)})</span>
                              </div>

                              <span className="text-[9.5px] font-mono text-slate-500">{dlCount} downloaded</span>
                            </div>

                            {/* Nested reviews checklist accordion */}
                            <div className="border-t border-slate-900/80 pt-2 space-y-2">
                              {/* Submit live review comment */}
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  id={`review-msg-${res.id}`}
                                  placeholder="Write a candidate review on this booklet..."
                                  className="flex-1 bg-slate-900 border border-slate-850 text-slate-300 rounded px-2 py-1 text-[10.5px] placeholder-slate-700 focus:outline-none focus:border-indigo-505 focus:border-indigo-500"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      const text = (e.currentTarget as HTMLInputElement).value;
                                      if (text.trim()) {
                                        submitResourceFeedback(res.id, text, 5);
                                        (e.currentTarget as HTMLInputElement).value = "";
                                      }
                                    }
                                  }}
                                />
                                <button
                                  onClick={() => {
                                    const inp = document.getElementById(`review-msg-${res.id}`) as HTMLInputElement;
                                    if (inp && inp.value.trim()) {
                                      submitResourceFeedback(res.id, inp.value, 5);
                                      inp.value = "";
                                    }
                                  }}
                                  className="px-2 py-1 bg-indigo-950/40 text-indigo-400 hover:text-white border border-indigo-550/20 text-[10px] rounded transition"
                                >
                                  Submit Review
                                </button>
                              </div>

                              {/* Comments log scrolling container */}
                              <div className="max-h-[85px] overflow-y-auto pr-1 space-y-1.5" id="nested-reviews-scroll font-sans">
                                {(feedbackReviews[res.id] || []).length > 0 ? (
                                  (feedbackReviews[res.id] || []).map((reviewRecord, recordIdx) => (
                                    <div key={recordIdx} className="bg-slate-950/30 p-2 rounded border border-slate-900/60 text-left space-y-1">
                                      <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 text-slate-400 leading-none">
                                        <span className="font-bold flex items-center gap-1 text-slate-300">
                                          <User className="w-2.5 h-2.5" />
                                          Candidate Anonymous #{recordIdx+105}
                                        </span>
                                        <span>Grade: {reviewRecord.rating}★</span>
                                      </div>
                                      <p className="text-[10px] text-slate-300 leading-relaxed font-sans italic">"{reviewRecord.text}"</p>
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-[9.5px] text-slate-650 text-slate-600 text-center py-1">No candidate review comments submitted yet on this session booklet.</div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Bottom actionable triggers: Preview, broken report, simulated download */}
                          <div className="border-t border-slate-900 pt-3.5 flex items-center justify-between text-xs gap-3">
                            <span className="truncate text-[10px] font-medium text-slate-500 font-mono">
                              {matchedSub ? matchedSub.title : "General Lesson"}
                            </span>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => reportBrokenResource(res.id)}
                                className={`px-2 py-1.5 border hover:text-rose-400 hover:border-rose-400/40 text-[10.5px] font-semibold rounded-lg transition ${
                                  isBroken ? "bg-rose-550/10 border-rose-500 text-rose-400" : "bg-slate-900 border-slate-850 text-slate-600"
                                }`}
                                title="Report broken link / content error"
                              >
                                {isBroken ? "Reported" : "Report Broken"}
                              </button>

                              {/* Modular dynamic viewer mapping */}
                              <button
                                onClick={() => {
                                  if (res.fileType === "pdf") {
                                    setPdfPreviewFile(res);
                                  } else if (res.fileType === "pptx") {
                                    setPptxPreviewFile(res);
                                  } else if (res.fileType === "docx") {
                                    setDocxPreviewFile(res);
                                  } else if (res.fileType === "zip") {
                                    setZipPreviewFile(res);
                                  } else if (res.fileType === "image") {
                                    setImagePreviewFile(res);
                                  } else if (res.fileType === "video") {
                                    setVideoPreviewFile(res);
                                  }
                                }}
                                className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-850 text-[10.5px] font-semibold rounded-lg transition"
                              >
                                Preview Frame
                              </button>

                              <button
                                onClick={() => handleDownloadResource(res)}
                                className="px-3 py-1.5 bg-indigo-650 hover:bg-indigo-600 text-white text-[10.5px] font-semibold rounded-lg transition flex items-center gap-1"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Download</span>
                              </button>
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 border border-dashed border-slate-850 rounded-2xl text-slate-500 text-xs">
                    No study booklets found matching selected filter criteria. Upgrade tags or reset filters to browse universal core catalogs.
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 3: PERSONAL STUDY TOOLS (NOTES, FLASHCARDS & revision CHECKS) */}
          {activeTab === "tools" && (
            <div className="space-y-6" id="tabview-moodle-tools">
              
              {/* Split left: Notes writer, Split right: Personal revision sheets */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-left">
                
                {/* Notes log writer */}
                <div className="md:col-span-6 space-y-4">
                  <div className="bg-slate-950/30 p-5 border border-slate-850 rounded-2xl">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
                      <Edit2 className="w-4 h-4 text-indigo-400 animate-pulse" />
                      Personal Study Scriptpad / Notes
                    </h3>

                    <form onSubmit={handleSaveNote} className="space-y-3">
                      <div>
                        <label className="block text-[9px] font-mono uppercase text-slate-500 font-extrabold mb-1">Note Heading</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 3NF Transitive dependencies cheatsheet"
                          value={noteTitle}
                          onChange={(e) => setNoteTitle(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none placeholder-slate-650"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-1">
                        <label className="block text-[9px] font-mono uppercase text-slate-500 font-extrabold mb-1">Subject Reference</label>
                        <select
                          required
                          value={noteSubject}
                          onChange={(e) => setNoteSubject(e.target.value)}
                          className="w-full px-2.5 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-350 focus:outline-none"
                        >
                          <option value="">Choose Subject reference...</option>
                          {modules.map(mod => (
                            <option key={mod.id} value={mod.id}>{mod.title}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[9px] font-mono uppercase text-slate-500 font-extrabold mb-1">Notes text body details</label>
                        <textarea
                          required
                          rows={4}
                          placeholder="e.g. A transitive dependency is an indirect relationship between values in the same table where A -> B and B -> C..."
                          value={noteBody}
                          onChange={(e) => setNoteBody(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-white placeholder-slate-650 focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-555 hover:bg-indigo-550 transition text-white text-xs font-semibold rounded-lg"
                      >
                        {editingNoteId ? "Update Note Card" : "Save Note Card"}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Personal notes scroll list */}
                <div className="md:col-span-6 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-900 pb-2">
                    My Study Scrapbooks ({personalNotes.length} entries)
                  </h4>

                  <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                    {personalNotes.length > 0 ? (
                      personalNotes.map((note) => (
                        <div key={note.id} className="p-4 bg-slate-950/45 border border-slate-850 rounded-xl space-y-2 text-left">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <span className="text-[8px] font-mono uppercase bg-slate-900 border border-slate-800 text-indigo-400 px-1.5 py-0.5 rounded mr-1.5">
                                {getSubjectTitle(note.subjectId).slice(0, 20)}...
                              </span>
                              <span className="text-[10px] font-mono text-slate-500">{note.date}</span>
                            </div>

                            <div className="flex gap-2">
                              <button onClick={() => handleEditNote(note)} className="text-indigo-450 hover:text-white p-1" title="Edit Note">
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => handleDeleteNote(note.id)} className="text-rose-455 hover:text-rose-400 p-1" title="Delete Note">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <h5 className="text-xs font-bold text-white select-text leading-tight">{note.title}</h5>
                          <p className="text-[11px] text-slate-400 leading-relaxed select-text font-sans whitespace-pre-wrap">{note.body}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 border border-dashed border-slate-850 rounded-xl text-slate-500 text-xs">
                        All study pads are clean. Document code drills above!
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Flashcards Sub-Module built directly */}
              {selectedModule && selectedModule.flashcards.length > 0 && (
                <div className="border border-slate-850 p-6 rounded-2xl max-w-lg mx-auto bg-slate-950/20 text-center space-y-4">
                  <div className="border-b border-slate-900 pb-2 flex justify-between items-center">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Syllabus Interactive Flashcards Quiz</span>
                    <span className="text-[10px] font-mono text-slate-500">Card {currentFlashcardIndex + 1} of {selectedModule.flashcards.length}</span>
                  </div>

                  {/* Tactile Folding Card Container */}
                  <div 
                    onClick={() => setIsFlashcardFlipped(!isFlashcardFlipped)}
                    className="w-full h-48 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer relative select-none"
                  >
                    {!isFlashcardFlipped ? (
                      <div className="space-y-4 animate-fade-in">
                        <HelpCircle className="w-7 h-7 text-indigo-400 mx-auto opacity-80" />
                        <p className="text-xs sm:text-sm font-semibold text-white max-w-xs">{selectedModule.flashcards[currentFlashcardIndex].question}</p>
                        <span className="text-[9px] font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-505/15 px-2 py-0.5 rounded">Reveal answer</span>
                      </div>
                    ) : (
                      <div className="space-y-2 animate-fade-in text-indigo-200">
                        <Check className="w-7 h-7 text-emerald-400 mx-auto" />
                        <h5 className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Correct Curriculum Answer:</h5>
                        <p className="text-xs text-slate-200 max-w-xs leading-relaxed font-sans font-medium">{selectedModule.flashcards[currentFlashcardIndex].answer}</p>
                      </div>
                    )}
                  </div>

                  {/* Navigator panel */}
                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={() => {
                        setIsFlashcardFlipped(false);
                        setCurrentFlashcardIndex(prev => prev > 0 ? prev - 1 : selectedModule.flashcards.length - 1);
                      }}
                      className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-slate-350 rounded border border-slate-800 text-[10px] font-semibold"
                    >
                      Previous
                    </button>
                    
                    <button
                      onClick={() => {
                        setIsFlashcardFlipped(false);
                        setCurrentFlashcardIndex(prev => prev < selectedModule.flashcards.length - 1 ? prev + 1 : 0);
                      }}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] font-semibold"
                    >
                      Next Card
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 4: STUDY BUDDY KIVU AI FORUM CHAT */}
          {activeTab === "ai_tutor" && (
            <div className="border border-slate-850 bg-slate-900/35 rounded-2xl flex flex-col h-[520px]" id="tabview-moodle-chat">
              
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-850 flex items-center justify-between text-left shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/15">
                    <Sparkles className="w-4.5 h-4.5 text-amber-400 animate-spin" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white">Academic Study Assistant Kivu</h3>
                    <p className="text-[9.5px] font-mono text-slate-500">Powered by Gemini 3.5 Framework • RTB Mapping</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping mr-1" />
                  <span className="text-[10px] font-mono text-slate-500">Online</span>
                </div>
              </div>

              {/* Chat Scroller */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin" ref={scrollRef}>
                {chatMessages.map((msg) => {
                  const isAi = msg.sender === "ai";
                  return (
                    <div 
                      key={msg.id} 
                      className={`flex gap-3 text-left max-w-[85%] ${isAi ? "mr-auto" : "ml-auto flex-row-reverse"}`}
                    >
                      <div className={`p-2 rounded-lg shrink-0 h-fit ${isAi ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/15" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15"}`}>
                        <span className="text-[9px] font-mono font-extrabold uppercase">{isAi ? "KIVU" : "REMMY"}</span>
                      </div>

                      <div className={`p-3.5 rounded-2xl select-text text-xs space-y-1.5 leading-relaxed font-sans ${isAi ? "bg-slate-950/50 text-slate-200 border border-slate-850" : "bg-indigo-600 border border-indigo-500 text-white shadow-md shadow-indigo-950/15"}`}>
                        <p className="whitespace-pre-line text-xs">{msg.text}</p>
                        <span className="text-[8.5px] font-mono text-slate-500 block text-right mt-1">{msg.timestamp}</span>
                      </div>
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex items-center gap-2 text-slate-500 text-xs mr-auto pl-2">
                    <strong className="animate-pulse">Kivu AI is formulating academic synthesis...</strong>
                  </div>
                )}
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-slate-850 flex gap-2 shrink-0">
                <input
                  type="text"
                  placeholder="Ask Kivu details on normalizations, reverse proxies, OOP polymorphic inheritance..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none placeholder-slate-600"
                />
                
                <button
                  type="submit"
                  className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition cursor-pointer select-none outline-none shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

            </div>
          )}

        </div>

        {/* RIGHT COLUMN: 4 Cols featuring Bookmarked lists, syllabus matrix, and attendance summaries */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* Bookmark checklist panel */}
          <div className="border border-slate-850 bg-slate-900/40 rounded-2xl p-5 shadow-lg max-h-[340px] overflow-y-auto">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-2 mb-3 flex items-center gap-2">
              <BookMarked className="w-4.5 h-4.5 text-indigo-400 animate-pulse" />
              Syllabus Revision Bookmarks
            </h4>

            {bookmarks.length > 0 ? (
              <div className="space-y-2">
                {bookmarks.map((bmark, bidx) => (
                  <div key={bidx} className="flex gap-2.5 items-center justify-between p-2.5 bg-slate-950/40 border border-slate-850 rounded-lg text-xs hover:border-slate-800 transition">
                    <div className="flex gap-2 items-center truncate text-left">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                      <span className="text-slate-200 block truncate font-medium">{bmark}</span>
                    </div>

                    <button
                      onClick={() => toggleBookmarkLesson(bmark)}
                      className="text-slate-650 hover:text-rose-400 transition"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 border border-dashed border-slate-850 rounded-xl text-xs leading-relaxed">
                No syllabus topics bookmark-tagged yet. Pin lessons to revise later!
              </div>
            )}
          </div>

          {/* National Curriculum Guidelines Map */}
          <div className="border border-slate-850 bg-slate-900/40 rounded-2xl p-5 text-left space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Syllabus Coverage Audit
            </h4>
            <p className="text-[10px] text-slate-500 leading-relaxed mb-3">
              This preparatory module matches 1-to-1 against curriculum checklists approved by the Rwanda TVET Board (RTB) for Level 5 Software Development testing metrics.
            </p>

            <div className="space-y-2 pt-1 border-t border-slate-900">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-350">Web Applic. Dev</span>
                <span className="text-indigo-400 font-bold font-mono">100% Core</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-350">Database Design</span>
                <span className="text-indigo-400 font-bold font-mono">100% Core</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-350">OOP Java</span>
                <span className="text-indigo-400 font-bold font-mono">100% Core</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-350">DevOps & Testing</span>
                <span className="text-slate-500 font-bold font-mono">100% Core</span>
              </div>
            </div>
          </div>

          {/* Rwanda TVET quote notices */}
          <div className="bg-slate-950/20 border border-slate-850 p-4 rounded-xl text-left text-xs leading-relaxed text-slate-500">
            <strong>System Performance Tracker:</strong> Registered course hours are calculated based on active focus periods on this Study materials segment, synchronizing dynamically with the master analytics report card.
          </div>

        </div>

      </div>

      {/* PDF SIMULATION MODAL IN-VIEWER PREVIEW */}
      {pdfPreviewFile && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-4 sm:p-5 text-left space-y-4 shadow-2xl relative animate-scale-up">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight truncate max-w-[320px]">
                  {pdfPreviewFile.title}
                </h4>
              </div>

              <button
                onClick={() => {
                  setPdfPreviewFile(null);
                  setPdfPage(1);
                }}
                className="text-slate-550 hover:text-white transition p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Simulated PDF document content sheet */}
            <div className="bg-slate-950 border border-slate-850 p-5 rounded-xl space-y-3 min-h-[220px] select-text">
              <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 border-b border-slate-900 pb-2">
                <span>RWANDA TVET NATIONAL BOOKLET SERIES</span>
                <span>PAGE {pdfPage} of 2</span>
              </div>

              {pdfPage === 1 ? (
                <div className="space-y-2.5 font-sans leading-relaxed text-xs text-slate-350">
                  <h5 className="font-extrabold text-white text-xs uppercase tracking-wider">{pdfPreviewFile.topic || "STUDY LOG"}</h5>
                  <p><strong>Overview:</strong> Study resources formulated under joint cooperation with national assessors. This PDF review covers the core constraints, key attributes dependencies, and technical coding outlines.</p>
                  <p><strong>Essential TVET Exam Points:</strong></p>
                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-400">
                    <li>Always define strict foreign key linkages.</li>
                    <li>Avoid storing repetitive duplicates in single database columns.</li>
                    <li>Parametrize queries using PDO/prepared statements in web environments to completely immunize against script injections.</li>
                  </ul>
                </div>
              ) : (
                <div className="space-y-2.5 font-sans leading-relaxed text-xs text-slate-350 animate-fade-in">
                  <h5 className="font-extrabold text-white text-xs uppercase tracking-wider">PRACTICAL INTERATIVE CODES</h5>
                  <p>In accordance with the assessment criteria of Module SWD_M03, examinees must know how to trace Java stack exception elements on runtime environments:</p>
                  <pre className="bg-slate-900 px-3 py-1.5 rounded text-[10px] font-mono text-emerald-400 leading-normal">
                    {`try {
  Integer myValue = (Integer) session.getAttribute("grade");
} catch (ClassCastException e) {
  logger.error("TVET Validation failed: " + e.getMessage());
}`}
                  </pre>
                  <p className="text-[10px] text-slate-500 italic">Verify code compilations before pushing to dockerized servers.</p>
                </div>
              )}
            </div>

            {/* Pagination controls & Download simulator footer */}
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={pdfPage === 1}
                  onClick={() => setPdfPage(1)}
                  className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-850 border border-slate-850 text-slate-250 disabled:opacity-40 rounded disabled:cursor-not-allowed font-semibold"
                >
                  Prev Page
                </button>
                <button
                  type="button"
                  disabled={pdfPage === 2}
                  onClick={() => setPdfPage(2)}
                  className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-850 border border-slate-850 text-slate-250 disabled:opacity-40 rounded disabled:cursor-not-allowed font-semibold"
                >
                  Next Page
                </button>
              </div>

              <button
                onClick={() => handleDownloadResource(pdfPreviewFile)}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-505 hover:bg-indigo-500 text-white font-semibold rounded-lg flex items-center gap-1 cursor-pointer transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Simulate Download</span>
              </button>
            </div>

            {simulatedDownloadSuccess && (
              <div className="absolute inset-x-4 bottom-4 p-2 rounded bg-emerald-500/10 border border-emerald-500/15 text-emerald-400 text-xs flex items-center gap-1.5 animate-bounce">
                <Check className="w-3.5 h-3.5" />
                <span>{simulatedDownloadSuccess}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* POWERPOINT PRESENTATION PREVIEW SLIDESHOW MODAL */}
      {pptxPreviewFile && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-4 sm:p-5 text-left space-y-4 shadow-2xl relative animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                <h4 className="text-xs sm:text-sm font-bold text-white truncate max-w-[320px]">
                  {pptxPreviewFile.title} (PowerPoint Slide Preview)
                </h4>
              </div>
              <button onClick={() => { setPptxPreviewFile(null); setPptxSlideIdx(1); }} className="text-slate-550 hover:text-white transition cursor-pointer">✕</button>
            </div>

            {/* Simulated Slide Canvas */}
            <div className="aspect-[16/9] w-full bg-slate-950 border border-slate-850 rounded-xl relative p-6 flex flex-col justify-between overflow-hidden text-slate-100 select-text">
              <div className="flex justify-between items-center text-[8px] font-mono text-indigo-400 font-bold">
                <span>L5SWD NATIONAL LEARNING METHODOLOGY</span>
                <span>SLIDE {pptxSlideIdx} OF 4</span>
              </div>

              {pptxSlideIdx === 1 && (
                <div className="space-y-3 my-auto text-center">
                  <h3 className="text-sm font-black text-white tracking-tight uppercase leading-tight">{pptxPreviewFile.topic}</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">By: {pptxPreviewFile.author}</p>
                  <p className="text-[10px] text-slate-500">Rwanda TVET Board Curriculum Alignment Masterclass Series</p>
                </div>
              )}

              {pptxSlideIdx === 2 && (
                <div className="space-y-2.5 my-auto text-left">
                  <h4 className="text-xs font-bold uppercase tracking-wide text-indigo-300">Section 1: Architectural Objective Foundations</h4>
                  <p className="text-[11px] text-slate-350 leading-relaxed">Understanding core and auxiliary requirements for national examination assessment standard L5_SWD:</p>
                  <ul className="list-disc pl-5 space-y-1.5 text-[10px] text-slate-400 font-sans">
                    <li>Design schemas utilizing Third Normal Form (3NF) structures.</li>
                    <li>Avoid direct execution of arbitrary query variables.</li>
                    <li>Use strict Object-Oriented principles in administrative forms.</li>
                  </ul>
                </div>
              )}

              {pptxSlideIdx === 3 && (
                <div className="space-y-2 my-auto text-left">
                  <h4 className="text-xs font-bold uppercase tracking-wide text-indigo-300">Section 2: Practical Exam Target Maps</h4>
                  <p className="text-[11px] text-slate-350 leading-relaxed font-sans font-sans">Inspectors score candidate codes on four key parameters:</p>
                  <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[9px]">
                    <div className="p-1.5 bg-slate-900 border border-indigo-500/10 rounded text-indigo-400 font-semibold">1. Database Integrity (25%)</div>
                    <div className="p-1.5 bg-slate-900 border border-indigo-500/10 rounded text-indigo-400 font-semibold">2. Form Validation (25%)</div>
                    <div className="p-1.5 bg-slate-900 border border-indigo-500/10 rounded text-indigo-400 font-semibold">3. Exceptions Safety (25%)</div>
                    <div className="p-1.5 bg-slate-900 border border-indigo-500/10 rounded text-indigo-400 font-semibold">4. DevOps Automation (25%)</div>
                  </div>
                </div>
              )}

              {pptxSlideIdx === 4 && (
                <div className="space-y-2 my-auto text-center">
                  <h4 className="text-xs font-bold uppercase tracking-wide text-emerald-400 animate-pulse">Ready to Practice?</h4>
                  <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed font-sans">Review classroom exercises using notes widgets, complete diagnostic checks, and submit answers under simulated timer clocks.</p>
                </div>
              )}

              <div className="text-[8px] font-mono text-slate-600 text-center">Official L5 National Curriculum Material Guide</div>
            </div>

            {/* Navigator bar */}
            <div className="flex justify-between items-center text-xs font-sans">
              <div className="flex items-center gap-1 font-sans">
                <button
                  onClick={() => setPptxSlideIdx(p => Math.max(1, p - 1))}
                  disabled={pptxSlideIdx === 1}
                  className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-850 border border-slate-855 text-slate-200 disabled:opacity-40 rounded disabled:cursor-not-allowed font-semibold"
                >
                  Prev Slide
                </button>
                <button
                  onClick={() => setPptxSlideIdx(p => Math.min(4, p + 1))}
                  disabled={pptxSlideIdx === 4}
                  className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-850 border border-slate-855 text-slate-200 disabled:opacity-40 rounded disabled:cursor-not-allowed font-semibold"
                >
                  Next Slide
                </button>
              </div>

              <button
                onClick={() => handleDownloadResource(pptxPreviewFile)}
                className="px-3 py-1.5 bg-indigo-650 hover:bg-indigo-600 font-semibold text-white rounded-lg flex items-center gap-1 cursor-pointer transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Simulate Download</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DOCX WORKBOOK PREVIEW MODAL */}
      {docxPreviewFile && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-4 sm:p-5 text-left space-y-4 shadow-2xl relative animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <h4 className="text-xs sm:text-sm font-bold text-white truncate max-w-[320px]">
                  {docxPreviewFile.title} (Word Document Sheet View)
                </h4>
              </div>
              <button onClick={() => setDocxPreviewFile(null)} className="text-slate-500 hover:text-white transition cursor-pointer">✕</button>
            </div>

            {/* Letter Sheet simulation viewport */}
            <div className="bg-white text-slate-900 p-8 rounded-xl min-h-[300px] shadow-inner select-text font-serif leading-relaxed text-xs space-y-4 max-h-[420px] overflow-y-auto pr-2">
              <div className="text-center border-b border-slate-200 pb-3 flex flex-col items-center">
                <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase font-black">Republic of Rwanda • TVET Board Academic Material</span>
                <h3 className="text-sm font-extrabold text-slate-900 mt-1">{docxPreviewFile.title.replace(/_/g, " ")}</h3>
                <span className="text-[10px] text-slate-500 italic">Author: {docxPreviewFile.author} • Uploaded {docxPreviewFile.uploadDate}</span>
              </div>

              <div className="space-y-3 font-sans text-slate-800">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase">1. Technical Syllabus Objective Guidelines</h4>
                <p>This document presents the official learning guidelines and curriculum structures compiled under Module ID <strong>{docxPreviewFile.subjectId.toUpperCase()}</strong>. It is designed to prepare software engineering students to master critical concepts related to the topic of <strong>{docxPreviewFile.topic}</strong>.</p>
                <p>Ensure that you have completed the prerequisite units before diving deep into these diagnostic workbooks. For practical coding units, utilize the terminal sandboxes provided on the right columns of the main study panel.</p>

                <h4 className="text-xs font-extrabold text-slate-900 uppercase pt-2">2. Mandatory Core Assessment Competencies</h4>
                <p>As part of the evaluation process, examiners score students on physical execution correctness, syntax purity, clean structure encapsulation rules, and exceptions resilience controls:</p>
                <div className="p-3 bg-slate-50 border-l-4 border-slate-405 rounded text-slate-700 italic font-medium leading-relaxed">
                  "Examinees must construct systems that remain fully operational even under unexpected inputs, keeping database connections isolated and completely preventing arbitrary code injection loops."
                </div>

                <h4 className="text-xs font-extrabold text-slate-900 uppercase pt-2">3. Recommended Exam Practice Exercises</h4>
                <p>Practice writing clean database queries and normalizations algorithms in your notes tool. Discuss solutions on the Candidate Plaza forum panel with other software development aspirants to maximize TVET scoring benchmarks.</p>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-[10px] font-mono text-slate-500">File size: {docxPreviewFile.fileSize} • Microsoft Word Format</span>
              <button
                onClick={() => handleDownloadResource(docxPreviewFile)}
                className="px-3 py-1.5 bg-indigo-650 hover:bg-indigo-600 font-semibold text-white rounded-lg flex items-center gap-1 cursor-pointer transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Simulate Download</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ZIP ARCHIVE INSPECTOR MODAL */}
      {zipPreviewFile && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-4 sm:p-5 text-left space-y-4 shadow-2xl relative animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <h4 className="text-xs sm:text-sm font-bold text-white truncate max-w-[320px]">
                  {zipPreviewFile.title} (ZIP Archive Outline Explorer)
                </h4>
              </div>
              <button onClick={() => setZipPreviewFile(null)} className="text-slate-550 hover:text-white transition cursor-pointer font-bold">✕</button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-405">Listed below is the code structure of this template package. Download the ZIP file completely to acquire the fully editable workspace files.</p>
              
              <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl font-mono text-[11px] text-emerald-400 space-y-2 max-h-[300px] overflow-y-auto">
                <div className="flex items-center gap-1.5 text-indigo-400 font-bold"><span className="text-slate-500">📁</span> /</div>
                <div className="pl-4 flex items-center gap-1.5 text-indigo-400 font-bold"><span className="text-slate-500">📁</span> src/</div>
                <div className="pl-8 flex items-center gap-1.5"><span className="text-slate-600">📄</span> db.config.ts <span className="text-[9px] text-slate-600 font-sans italic ml-auto">(Database normal lines configurations)</span></div>
                <div className="pl-8 flex items-center gap-1.5"><span className="text-slate-600">📄</span> server.ts <span className="text-[9px] text-slate-600 font-sans italic ml-auto">(MVC backend endpoints router files)</span></div>
                <div className="pl-8 flex items-center gap-1.5"><span className="text-slate-600">📄</span> app.component.java <span className="text-[9px] text-slate-600 font-sans italic ml-auto">(Java OOP interfaces overrides objects)</span></div>
                <div className="pl-4 flex items-center gap-1.5 text-indigo-400 font-bold"><span className="text-slate-500">📁</span> public/</div>
                <div className="pl-8 flex items-center gap-1.5"><span className="text-slate-600">📄</span> index.html <span className="text-[9px] text-slate-600 font-sans italic ml-auto">(Candidate landing index HTML)</span></div>
                <div className="pl-4 flex items-center gap-1.5"><span className="text-slate-600">📄</span> package.json <span className="text-[9px] text-slate-600 font-sans italic ml-auto">(NPM modules specifications list)</span></div>
                <div className="pl-4 flex items-center gap-1.5"><span className="text-slate-600">📄</span> README.md <span className="text-[9px] text-slate-600 font-sans italic ml-auto">(Instructional documentation manual)</span></div>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-[10px] font-mono text-slate-500">Total size: {zipPreviewFile.fileSize} • Compressed Archive</span>
              <button
                onClick={() => handleDownloadResource(zipPreviewFile)}
                className="px-3.5 py-1.5 bg-indigo-650 hover:bg-indigo-500 text-white font-semibold rounded-lg flex items-center gap-1 cursor-pointer transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Template Archive</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE PREVIEW LIGHTBOX MODAL */}
      {imagePreviewFile && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-4 text-left space-y-4 shadow-2xl relative animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-black">IMAGE MEDIA LIGHTBOX</span>
              <button onClick={() => setImagePreviewFile(null)} className="text-slate-500 hover:text-white transition cursor-pointer">✕</button>
            </div>

            <div className="w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-850 aspect-[4/3] flex flex-col items-center justify-center p-4 relative group">
              {/* Grid map vector graphics simulation */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-15" />
              
              <div className="w-14 h-14 rounded-full bg-indigo-500/10 border border-indigo-505/20 text-indigo-400 flex items-center justify-center mb-3 animate-pulse">
                <Sparkles className="w-8 h-8 text-indigo-400" />
              </div>

              <div className="text-center space-y-2 z-10 max-w-sm">
                <span className="text-[9px] font-mono px-2 py-0.5 bg-indigo-950/80 border border-indigo-505/30 text-indigo-400 rounded font-bold">{imagePreviewFile.topic}</span>
                <h4 className="text-xs font-extrabold text-white uppercase">{imagePreviewFile.title}</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed font-sans">{imagePreviewFile.description}</p>
              </div>

              <div className="absolute bottom-2 right-2 text-[8px] font-mono text-slate-600">RTB Star Mappings Layout</div>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-[10px] font-mono text-slate-500">Format: PNG Graphics • {imagePreviewFile.fileSize}</span>
              <button
                onClick={() => handleDownloadResource(imagePreviewFile)}
                className="px-3 py-1.5 bg-indigo-650 hover:bg-indigo-600 font-semibold text-white rounded-lg flex items-center gap-1 cursor-pointer transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Media Image</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIDEO PREVIEW SIMULATOR MODAL */}
      {videoPreviewFile && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-4 sm:p-5 text-left space-y-4 relative shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-850 pb-2">
              <span className="text-[10px] font-mono text-purple-400 uppercase font-bold flex items-center gap-1">
                <PlaySquare className="w-3.5 h-3.5 animate-pulse" />
                CLASSROOM VIDEO LECTURE STREAM
              </span>
              <button onClick={() => { setVideoPreviewFile(null); setIsPlayingVideo(false); }} className="text-slate-550 hover:text-white transition cursor-pointer">✕</button>
            </div>

            {/* Simulated Live Video Player screen */}
            <div className="w-full aspect-video bg-black rounded-lg border border-slate-850 flex flex-col items-center justify-center relative overflow-hidden group">
              {isPlayingVideo ? (
                <div className="absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                  {/* Playing anim lines */}
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                    <span className="bg-indigo-600 text-white px-2 py-0.5 rounded animate-pulse">LIVE EXPLAINER</span>
                    <span>12:45 / 34:00</span>
                  </div>

                  {/* Dynamic sound equalizer bars */}
                  <div className="flex gap-1 justify-center items-end h-16 opacity-30">
                    <span className="w-1.5 bg-indigo-500 animate-pulse h-12" />
                    <span className="w-1.5 bg-emerald-500 animate-pulse h-16" />
                    <span className="w-1.5 bg-amber-500 animate-pulse h-8" />
                    <span className="w-1.5 bg-indigo-500 animate-pulse h-14" />
                  </div>

                  {/* Play controls */}
                  <div className="flex justify-between items-center text-xs">
                    <button onClick={() => setIsPlayingVideo(false)} className="text-white hover:text-indigo-400 transition font-bold">❚❚ Pause</button>
                    <span className="text-[10px] font-mono text-slate-500">Speed: 1.0x</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-center cursor-pointer" onClick={() => setIsPlayingVideo(true)}>
                  <div className="w-14 h-14 bg-purple-600 hover:bg-purple-500 hover:scale-105 transition rounded-full flex items-center justify-center text-white mx-auto shadow-lg shadow-purple-950/20">
                    <Play className="w-6 h-6 ml-1 text-white" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white leading-tight">{videoPreviewFile.title}</h5>
                    <p className="text-[10px] text-slate-500 mt-1">Video stream covers exam guidelines and answers sheets.</p>
                  </div>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-450 text-slate-400 leading-relaxed font-sans mt-2 select-text">{videoPreviewFile.description}</p>
          </div>
        </div>
      )}

      {/* CODE SANDBOX TERMINAL ACCORDION POPUP */}
      {isPlayingCode && (
        <div className="fixed inset-x-4 bottom-4 md:right-4 md:left-auto md:w-[380px] z-50 bg-slate-950 border border-emerald-500/30 rounded-2xl shadow-2xl p-4 text-left space-y-3 animate-slide-up">
          <div className="flex justify-between items-center border-b border-slate-900 pb-2">
            <span className="text-[10px] font-mono text-emerald-400 font-extrabold flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5" />
              L5SWD VIRTUAL TERMINAL ENGINE
            </span>
            <button onClick={() => setIsPlayingCode(false)} className="text-slate-550 hover:text-white transition text-xs">✕</button>
          </div>

          <textarea
            value={playgroundCode}
            onChange={(e) => setPlaygroundCode(e.target.value)}
            rows={5}
            className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-emerald-300 font-mono leading-relaxed focus:outline-none"
          />

          <button
            onClick={() => handleRunPlayground("Custom Script Execute", playgroundCode)}
            className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-550 transition text-white font-bold text-xs rounded-lg cursor-pointer"
          >
            Execute Bytecodes
          </button>

          <pre className="bg-black p-3 rounded-lg border border-slate-900 text-[10px] font-mono text-emerald-500 leading-relaxed whitespace-pre-wrap max-h-[140px] overflow-y-auto">
            {playgroundOutput}
          </pre>
        </div>
      )}

      {/* INTERACTIVE MINI QUIZ MODAL */}
      {activeLessonQuiz && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-5 text-left space-y-4 shadow-2xl relative animate-scale-up">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-[10px] font-mono text-amber-500 uppercase font-extrabold">
                Topic Assessment Check • LO Quiz
              </span>
              <button onClick={() => setActiveLessonQuiz(null)} className="text-slate-550 hover:text-white transition">✕</button>
            </div>

            <div className="space-y-4" id="lesson-mini-quiz">
              <p className="text-xs text-slate-400">Answer this quick concept check question to automatically complete the syllabus topic checkmark!</p>
              
              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-850 space-y-3">
                <h4 className="text-xs sm:text-sm font-bold text-white select-text leading-snug">
                  {getMiniQuizQuestion(activeLessonQuiz.topicIdx).q}
                </h4>

                <div className="space-y-2">
                  {getMiniQuizQuestion(activeLessonQuiz.topicIdx).options.map((opt) => {
                    const isSelected = activeLessonQuiz.selected === opt;
                    const isCorrect = opt === getMiniQuizQuestion(activeLessonQuiz.topicIdx).correct;
                    
                    let bgStyle = "bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300";
                    if (isSelected) {
                      bgStyle = activeLessonQuiz.solved 
                        ? (isCorrect ? "bg-emerald-500/10 border-emerald-500 text-emerald-400" : "bg-rose-500/10 border-rose-500 text-rose-450")
                        : "bg-indigo-650 border-indigo-500 text-white";
                    }

                    return (
                      <button
                        key={opt}
                        onClick={() => {
                          if (activeLessonQuiz.solved) return;
                          setActiveLessonQuiz(prev => prev ? { ...prev, selected: opt } : null);
                        }}
                        disabled={activeLessonQuiz.solved}
                        className={`w-full p-3 rounded-lg text-xs font-semibold text-left border transition ${bgStyle} disabled:cursor-not-allowed`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {activeLessonQuiz.solved && (
                <div className="p-3 rounded-xl border flex items-start gap-2 text-xs text-left leading-relaxed bg-slate-950/80">
                  {activeLessonQuiz.selected === getMiniQuizQuestion(activeLessonQuiz.topicIdx).correct ? (
                    <div className="text-emerald-400 font-medium">
                      ✓ Correct Answer! This is in strict accordance with the national TVET assessment guidelines. Lesson study status mapped as successfully completed.
                    </div>
                  ) : (
                    <div className="text-rose-450 text-rose-400 font-medium">
                      ✕ Incorrect Answer. The correct answer is: <strong>{getMiniQuizQuestion(activeLessonQuiz.topicIdx).correct}</strong>. Re-read the booklet slides to improve!
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => setActiveLessonQuiz(null)}
                  className="flex-1 py-1.5 bg-slate-950 hover:bg-slate-900 text-slate-300 border border-slate-850 rounded-lg text-xs font-semibold"
                >
                  Close Quiz
                </button>

                {!activeLessonQuiz.solved ? (
                  <button
                    disabled={!activeLessonQuiz.selected}
                    onClick={submitLessonQuiz}
                    className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-550 text-white rounded-lg text-xs font-semibold disabled:opacity-50"
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveLessonQuiz(null)}
                    className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-550 text-white rounded-lg text-xs font-semibold"
                  >
                    Finish Lesson
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
