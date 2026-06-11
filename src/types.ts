export enum ModuleId {
  WEB_DEV = "web_dev",
  DATABASE = "database",
  OOP_JAVA = "oop_java",
  DEVOPS = "devops",
  CLOUD_SYS = "cloud_sys",
  MAINTENANCE = "maintenance"
}

export interface StudyModule {
  id: string; // modified to string for custom subjects
  title: string;
  code: string;
  description: string;
  topics: {
    title: string;
    details: string;
    codeSnippet?: string;
  }[];
  cheatSheet: {
    commandOrConcept: string;
    definition: string;
    syntax?: string;
  }[];
  flashcards: {
    question: string;
    answer: string;
  }[];
}

export type QuestionType = "multiple_choice" | "short_answer";

export interface Question {
  id: string;
  moduleId: string; // modified to string for custom subjects
  type: QuestionType;
  questionText: string;
  options?: string[]; // Only for multiple_choice
  correctAnswer: string; // Optional exact text string or keyword string
  explanation: string;
}

export interface ExamSession {
  id: string;
  title: string;
  durationMinutes: number;
  questions: Question[];
  isAiGenerated: boolean;
  assignedExamId?: string; // Links back to assigned exams if any
}

export interface Student {
  id: string;
  name: string;
  registrationNumber: string;
  addedAt: string;
}

export interface AssignedExam {
  id: string;
  examTitle: string;
  moduleId: string;
  targetStudentId: string;
  assignedDate: string;
  durationMinutes: number;
  questions: Question[];
  status: "assigned" | "completed";
  score?: number;
  completedAt?: string;
}

export interface MockHistoryItem {
  id: string;
  title: string;
  date: string;
  score: number;
  totalQuestions: number;
  durationTakenSeconds: number;
  passed: boolean;
  moduleId?: string | "full";
  wrongQuestions: {
    questionId: string;
    questionText: string;
    selectedAnswer: string;
    correctAnswer: string;
    explanation: string;
    moduleId: string;
  }[];
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export interface PortalMessage {
  id: string;
  sender: string;
  role: "admin" | "student";
  text: string;
  timestamp: string;
  subjectTitle?: string;
  isAnnouncement?: boolean; // Highlight official announcements
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string;
  type: "exam" | "deadline" | "lecture" | "lab";
  description: string;
  moduleId?: string;
}


