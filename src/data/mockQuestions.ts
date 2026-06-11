import { Question, ModuleId } from "../types";

export const localQuestions: Question[] = [
  // WEB DEV L5SWD
  {
    id: "wd_q1",
    moduleId: ModuleId.WEB_DEV,
    type: "multiple_choice",
    questionText: "Which of the following describes the 'View' component within an MVC (Model-View-Controller) architecture?",
    options: [
      "Handles business routing logic and links DB systems.",
      "Acts as the interface presenting output records visually to the end-user.",
      "Initiates schema design changes and indexing.",
      "Handles state variables globally inside local cache directories."
    ],
    correctAnswer: "Acts as the interface presenting output records visually to the end-user.",
    explanation: "Under the MVC pattern, the View is strictly responsible for rendering user interfaces (HTML, layout visuals, presentation), keeping layout rendering segregated from controller routing and db operations."
  },
  {
    id: "wd_q2",
    moduleId: ModuleId.WEB_DEV,
    type: "multiple_choice",
    questionText: "What security strategy is most effective for stopping SQL Injections on user form validations?",
    options: [
      "Applying CSS animations on submit frames.",
      "Wrapping variables inside local variables.",
      "Leveraging Prepared Statements with parameter binding.",
      "Utilizing deep nested try-catch routing."
    ],
    correctAnswer: "Leveraging Prepared Statements with parameter binding.",
    explanation: "Prepared Statements (parameterized queries) pre-compile SQL commands, isolating parameters from command clauses. This prevents malicious string literals from being executed as queries."
  },
  {
    id: "wd_q3",
    moduleId: ModuleId.WEB_DEV,
    type: "short_answer",
    questionText: "Which HTTP request method is standard for submitting form content that modifies database records?",
    correctAnswer: "POST",
    explanation: "POST is standard for modifying states or submitting datasets to servers. GET is idempotent and should be used strictly for read-only actions."
  },

  // DATABASE L5SWD
  {
    id: "db_q1",
    moduleId: ModuleId.DATABASE,
    type: "multiple_choice",
    questionText: "A database schema is in Second Normal Form (2NF) if it sits in 1NF and lacks which of the following?",
    options: [
      "Any transitively dependent relationships.",
      "Repeating groups and multiple data arrays inside columns.",
      "Any non-key columns partially dependent on a composite primary key.",
      "More than two distinct primary index definitions."
    ],
    correctAnswer: "Any non-key columns partially dependent on a composite primary key.",
    explanation: "Second Normal Form (2NF) requires being in 1NF and ensuring that every non-prime attribute is fully functionally dependent on the entire primary key, thereby removing partial key dependencies."
  },
  {
    id: "db_q2",
    moduleId: ModuleId.DATABASE,
    type: "multiple_choice",
    questionText: "Which database constraints enforce Referential Integrity between child and parent datasets?",
    options: [
      "Primary Key restrictions.",
      "Foreign Key validations.",
      "Checking inputs against Null indexes.",
      "Applying transaction locks."
    ],
    correctAnswer: "Foreign Key validations.",
    explanation: "Foreign Keys synchronize schemas by forcing child tables' indices to match a valid primary record in the parent table, securing referential integrity."
  },
  {
    id: "db_q3",
    moduleId: ModuleId.DATABASE,
    type: "short_answer",
    questionText: "Write the SQL command clause used to filter aggregate results grouped using aggregate actions (like COUNT or SUM).",
    correctAnswer: "HAVING",
    explanation: "Use HAVING instead of WHERE because WHERE cannot process aggregated metrics at group evaluations."
  },

  // OOP JAVA L5SWD
  {
    id: "java_q1",
    moduleId: ModuleId.OOP_JAVA,
    type: "multiple_choice",
    questionText: "Which OOP concept is represented by having private instance fields while offering public getters and setters?",
    options: [
      "Encapsulation",
      "Polymorphism",
      "Dynamic Routing",
      "Multiple Inheritance"
    ],
    correctAnswer: "Encapsulation",
    explanation: "Encapsulation hides data structures within private boundaries, allowing interaction only via approved public getters and setters."
  },
  {
    id: "java_q2",
    moduleId: ModuleId.OOP_JAVA,
    type: "multiple_choice",
    questionText: "What type of exception is a NullPointerException in Java?",
    options: [
      "Checked exception",
      "Unchecked Runtime exception",
      "Compile-time warning",
      "Hardware crash event"
    ],
    correctAnswer: "Unchecked Runtime exception",
    explanation: "NullPointerException extends RuntimeException. Compiler checks do not mandate explicit code handling or try-catch declarations for unchecked exceptions."
  },
  {
    id: "java_q3",
    moduleId: ModuleId.OOP_JAVA,
    type: "short_answer",
    questionText: "In Java, which keyword is used specifically for inheritance, linking a subclass to its superclass?",
    correctAnswer: "extends",
    explanation: "The 'extends' keyword establishes inheritance for parent classes, while classes adopt Interfaces using the 'implements' keyword."
  },

  // DEVOPS L5SWD
  {
    id: "ops_q1",
    moduleId: ModuleId.DEVOPS,
    type: "multiple_choice",
    questionText: "Which testing phase isolates small logical blocks or single class methods, bypassing database connections?",
    options: [
      "Integration testing",
      "Unit testing",
      "User Acceptance testing (UAT)",
      "Vulnerability assessment"
    ],
    correctAnswer: "Unit testing",
    explanation: "Unit tests assess independent software logic blocks, simulating database interactions using mock objects to ensure isolated testing."
  },
  {
    id: "ops_q2",
    moduleId: ModuleId.DEVOPS,
    type: "multiple_choice",
    questionText: "What is the primary objective of Continuous Integration (CI) in software development?",
    options: [
      "Encrypting database backups dynamically.",
      "Automating code builds and running tests every time changes are pushed.",
      "Manually reviewing each line of documentation.",
      "Reducing physical developer team size requirements."
    ],
    correctAnswer: "Automating code builds and running tests every time changes are pushed.",
    explanation: "CI automatically compiles code and executes validation test cases on every push to detect code integration issues early."
  },
  {
    id: "ops_q3",
    moduleId: ModuleId.DEVOPS,
    type: "short_answer",
    questionText: "What tool packages applications and environment dependencies altogether into lightweight virtual environments?",
    correctAnswer: "Docker",
    explanation: "Docker containerizes application requirements and source materials into standardized packages, resolving runtime dependency issues."
  },

  // CLOUD & SYSTEM ADMINISTRATION L5SWD
  {
    id: "cloud_q1",
    moduleId: ModuleId.CLOUD_SYS,
    type: "multiple_choice",
    questionText: "In a Linux server console, what terminal command gives read, write, and execute permissions to all users for a file?",
    options: [
      "chmod 444",
      "chmod 600",
      "chmod 777",
      "chown root"
    ],
    correctAnswer: "chmod 777",
    explanation: "chmod 777 sets read (4), write (2), and execute (1) permissions (4+2+1=7) for the Owner, Group, and Others."
  },
  {
    id: "cloud_q2",
    moduleId: ModuleId.CLOUD_SYS,
    type: "multiple_choice",
    questionText: "Which protocol is standard for hosting secure, encrypted web traffic over port 443?",
    options: [
      "HTTP",
      "HTTPS",
      "FTP",
      "Telnet"
    ],
    correctAnswer: "HTTPS",
    explanation: "HTTPS encrypts communications over Port 443 using TLS/SSL to protect sensitive data transfers."
  },
  {
    id: "cloud_q3",
    moduleId: ModuleId.CLOUD_SYS,
    type: "short_answer",
    questionText: "What is the name of the Nginx/Apache configuration acting as a gateway and routing traffic to backend ports?",
    correctAnswer: "Reverse Proxy",
    explanation: "Reverse proxies accept client traffic on standard ports (80/443) and route requests to background application services."
  },

  // HARDWARE MAINTENANCE L5SWD
  {
    id: "maint_q1",
    moduleId: ModuleId.MAINTENANCE,
    type: "multiple_choice",
    questionText: "Which safety tool is primary for avoiding static electricity damage when holding motherboard chips?",
    options: [
      "Insulating plastic screwdriver handlers.",
      "An Electrostatic Discharge (ESD) wrist strap.",
      "Wearing standard rubber boots.",
      "Unplugging cooling fans."
    ],
    correctAnswer: "An Electrostatic Discharge (ESD) wrist strap.",
    explanation: "An ESD wrist strap grounds static electrical charges from your skin to safe chassis locations, protecting microchips."
  },
  {
    id: "maint_q2",
    moduleId: ModuleId.MAINTENANCE,
    type: "multiple_choice",
    questionText: "Which partition table standard is modern, supporting disks larger than 2TB and unlimited partitions?",
    options: [
      "Master Boot Record (MBR)",
      "GUID Partition Table (GPT)",
      "FAT32 File Table",
      "Swap Storage Table"
    ],
    correctAnswer: "GUID Partition Table (GPT)",
    explanation: "GPT is the modern standard for disk layouts. It supports sizes exceeding 2 Terabytes and unlimited partitions, replacing legacy MBR."
  },
  {
    id: "maint_q3",
    moduleId: ModuleId.MAINTENANCE,
    type: "short_answer",
    questionText: "What low-level ICMP tool is run inside terminals to verify if a remote IP address is reachable?",
    correctAnswer: "ping",
    explanation: "The ping utility sends ICMP Echo Requests to verify host reachability and measure round-trip times."
  }
];
