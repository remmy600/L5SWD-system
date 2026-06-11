import { studyModules } from "../data/studyData";
import { localQuestions } from "../data/mockQuestions";
import { StudyModule, Question, Student, AssignedExam, PortalMessage, CalendarEvent } from "../types";

export function getMergedModules(): StudyModule[] {
  const custom = JSON.parse(localStorage.getItem("l5swd_custom_subjects") || "[]");
  return [...studyModules, ...custom];
}

export function saveCustomModule(newMod: StudyModule) {
  const custom = JSON.parse(localStorage.getItem("l5swd_custom_subjects") || "[]");
  localStorage.setItem("l5swd_custom_subjects", JSON.stringify([...custom, newMod]));
}

export function getMergedQuestions(): Question[] {
  const custom = JSON.parse(localStorage.getItem("l5swd_custom_questions") || "[]");
  return [...localQuestions, ...custom];
}

export function saveCustomQuestions(newQuestions: Question[]) {
  const custom = JSON.parse(localStorage.getItem("l5swd_custom_questions") || "[]");
  localStorage.setItem("l5swd_custom_questions", JSON.stringify([...custom, ...newQuestions]));
}

export function getStudents(): Student[] {
  const students = localStorage.getItem("l5swd_students");
  if (!students) {
    // Bootstrap with 3 initial exemplary students to make the app feel alive on first run!
    const defaultStudents: Student[] = [
      { id: "std_01", name: "Remmy Nzanzimana", registrationNumber: "NESA/SWD/2026/01", addedAt: "6/11/2026" },
      { id: "std_02", name: "Chantal Uwera", registrationNumber: "NESA/SWD/2026/02", addedAt: "6/11/2026" },
      { id: "std_03", name: "David Mugisha", registrationNumber: "NESA/SWD/2026/03", addedAt: "6/11/2026" }
    ];
    localStorage.setItem("l5swd_students", JSON.stringify(defaultStudents));
    return defaultStudents;
  }
  return JSON.parse(students);
}

export function saveStudent(newStudent: Student) {
  const students = getStudents();
  localStorage.setItem("l5swd_students", JSON.stringify([...students, newStudent]));
}

export function getAssignedExams(): AssignedExam[] {
  return JSON.parse(localStorage.getItem("l5swd_assigned_exams") || "[]");
}

export function saveAssignedExam(exam: AssignedExam) {
  const exams = getAssignedExams();
  localStorage.setItem("l5swd_assigned_exams", JSON.stringify([...exams, exam]));
}

export function updateAssignedExamStatus(id: string, status: "assigned" | "completed", score?: number) {
  const exams = getAssignedExams();
  const updated = exams.map(ex => {
    if (ex.id === id) {
      return { 
        ...ex, 
        status, 
        score: score !== undefined ? score : ex.score,
        completedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      };
    }
    return ex;
  });
  localStorage.setItem("l5swd_assigned_exams", JSON.stringify(updated));
}

export function getPortalMessages(): PortalMessage[] {
  const messages = localStorage.getItem("l5swd_portal_messages");
  if (!messages) {
    const defaultMessages: PortalMessage[] = [
      {
        id: "msg_01",
        sender: "Teacher Remmy (Admin)",
        role: "admin",
        text: "Welcome NESA Candidates! Please use of the 'Online Message Center' to share queries regarding Rwanda TVET exams.",
        timestamp: "6/11/2026, 10:15 AM",
        subjectTitle: "Database Management"
      },
      {
        id: "msg_02",
        sender: "Chantal Uwera",
        role: "student",
        text: "Found incredible cheat sheets regarding Laravel routing and MVC controller models inside subjects tab!",
        timestamp: "6/11/2026, 11:32 AM",
        subjectTitle: "Web Development"
      },
      {
        id: "msg_03",
        sender: "David Mugisha",
        role: "student",
        text: "Remember to review database normalisation keys. NESA frequently includes at least 3 queries on that sector.",
        timestamp: "6/11/2026, 12:05 PM"
      }
    ];
    localStorage.setItem("l5swd_portal_messages", JSON.stringify(defaultMessages));
    return defaultMessages;
  }
  return JSON.parse(messages);
}

export function savePortalMessage(newMsg: PortalMessage) {
  const msgs = getPortalMessages();
  localStorage.setItem("l5swd_portal_messages", JSON.stringify([...msgs, newMsg]));
}

export function getOnlineStudents(): Array<{ studentId: string; status: "active" | "away" | "busy"; lastAction: string }> {
  // Let's create an elegant pseudo-live feed that links registered students with random active events!
  const students = getStudents();
  
  const actions = [
    "Studying Database cheatsheet", 
    "Practicing Web Exam Simulator", 
    "Writing assigned mock paper", 
    "Reviewing flashcards on OOP",
    "Offline for study break",
    "Reviewing exam results summary", 
    "Active in TVET lab session"
  ];

  return students.map((s, idx) => {
    // Distribute various statuses and actions dynamically but cleanly
    const statuses: Array<"active" | "away" | "busy"> = ["active", "away", "busy"];
    const status = statuses[idx % 3];
    const action = actions[idx % actions.length];
    
    return {
      studentId: s.id,
      status,
      lastAction: action
    };
  });
}

export function getCalendarEvents(): CalendarEvent[] {
  const data = localStorage.getItem("l5swd_calendar_events");
  if (!data) {
    const defaultEvents: CalendarEvent[] = [
      {
        id: "ev_1",
        title: "NESA Written National Exams Registration Close",
        date: "2026-06-12",
        time: "17:00",
        type: "deadline",
        description: "Final deadline for Level 5 SWD candidates to confirm bio-metrics & registration codes with center hosts.",
      },
      {
        id: "ev_2",
        title: "Laravel & React Full-Stack Lab Assessment",
        date: "2026-06-15",
        time: "09:00",
        type: "exam",
        description: "Official hands-on module examination of dynamic routing and secure backend endpoints integrations.",
        moduleId: "web_dev"
      },
      {
        id: "ev_3",
        title: "Database Normalization & Query Optimization Drills",
        date: "2026-06-18",
        time: "14:00",
        type: "lecture",
        description: "Open faculty webinar explaining 1NF, 2NF, 3NF and indexing methodologies inside PostgreSQL.",
        moduleId: "database"
      },
      {
        id: "ev_4",
        title: "Level 5 SWD Technical Group Presentation Day",
        date: "2026-06-22",
        time: "08:30",
        type: "lab",
        description: "Practical portfolio reviews evaluated directly by external TVET board examiners.",
      }
    ];
    localStorage.setItem("l5swd_calendar_events", JSON.stringify(defaultEvents));
    return defaultEvents;
  }
  return JSON.parse(data);
}

export function saveCalendarEvent(event: CalendarEvent) {
  const events = getCalendarEvents();
  localStorage.setItem("l5swd_calendar_events", JSON.stringify([...events, event]));
}

export function deleteCalendarEvent(id: string) {
  const events = getCalendarEvents();
  const updated = events.filter(ev => ev.id !== id);
  localStorage.setItem("l5swd_calendar_events", JSON.stringify(updated));
}

