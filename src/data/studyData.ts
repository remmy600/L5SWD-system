import { StudyModule, ModuleId } from "../types";

export const studyModules: StudyModule[] = [
  {
    id: ModuleId.WEB_DEV,
    title: "Web Application Development",
    code: "L5_SWD_M01",
    description: "Covers front-end web design, client/server scripting, dynamic database-driven applications, security guidelines, and Model-View-Controller (MVC) structures.",
    topics: [
      {
        title: "Model-View-Controller (MVC) Architecture",
        details: "MVC is a software architectural pattern that separates an application into three main components: Model (handles dynamic records, data schemas, rules, and database CRUD transactions), View (handles user interface, displays data to the end-user, visual form styling), and Controller (interprets user inputs/requests, manipulates models, directs Views, acts as the coordinator).",
        codeSnippet: `// Example controller routing in Node/Express:
app.get('/users', async (req, res) => {
  const users = await UserModel.getAll(); // Model layer
  res.render('userList', { users });       // View layer
});`
      },
      {
        title: "Client-Side vs Server-Side Scripting",
        details: "Client-side scripting (HTML5, JavaScript, framework scripts) runs inside the user's local web browser, dealing immediately with UI state, styles, responsiveness, and interactive animations. Server-side scripting (Node.js, PHP, Python) executed on the host server handles session registers, API services, files access, database queries, and server-side templates before returning response documents to clients.",
        codeSnippet: `<!-- Client-side script -->
<button onclick="alert('Hello local client!')">Click Client</button>

<!-- Server-side script (PHP examples) -->
<?php
  session_start();
  if (!isset($_SESSION['user'])) {
    header("Location: login.php");
  }
?>`
      },
      {
        title: "Preventing SQL Injections & SQL Sanitization",
        details: "An input injection exploit happens when user data parameters are parsed into direct SQL strings without sanitization or parametrized wrappers, allowing attackers to execute commands against databases. Secure developers must ALWAYS use Prepared Statements, binding parameters dynamically, or implement ORM frameworks that normalize inputs naturally.",
        codeSnippet: `// Safe Prepared Statement in PHP/PDO:
$stmt = $pdo->prepare('SELECT * FROM users WHERE email = :email');
$stmt->execute(['email' => $userEmail]);
$user = $stmt->fetch();`
      }
    ],
    cheatSheet: [
      {
        commandOrConcept: "HTTP Status: 200 OK",
        definition: "The client request succeeded and server returned the desired payload."
      },
      {
        commandOrConcept: "HTTP Status: 401 Unauthorized",
        definition: "The request has not been applied because it lacks valid authentication credentials."
      },
      {
        commandOrConcept: "HTTP Status: 404 Not Found",
        definition: "The server cannot locate the requested resource route or endpoint."
      },
      {
        commandOrConcept: "HTTP Status: 500 Server Error",
        definition: "The server encountered an unexpected condition which prevented it from fulfilling the request."
      },
      {
        commandOrConcept: "Prepared Statements",
        definition: "Pre-compiles SQL sequences and maps parameters dynamically to prevent malicious command text execution.",
        syntax: "db.prepare('SELECT * FROM tbl WHERE id = ?').bind(userId)"
      }
    ],
    flashcards: [
      {
        question: "What does the Controller do in an MVC framework?",
        answer: "The Controller accepts user inputs, processes logic, updates the Model when data changes, and selects/updates the appropriate View to render."
      },
      {
        question: "Explain the main difference between LocalStorage and SessionStorage.",
        answer: "LocalStorage persists indefinitely across browser restarts and sessions, whereas SessionStorage clears automatically as soon as the browser tab is closed."
      },
      {
        question: "Why should we avoid inline JavaScript event handlers?",
        answer: "Inline event handlers (like onclick='...') breach separation of concerns, make debugging/testing harder, and can open security risks like Cross-Site Scripting (XSS)."
      }
    ]
  },
  {
    id: ModuleId.DATABASE,
    title: "Database Design and Development",
    code: "L5_SWD_M02",
    description: "Focuses on relational schemas, Entity-Relationship Diagrams (ERDs), normalizations (1NF, 2NF, 3NF), and technical querying using SQL DDL/DML.",
    topics: [
      {
        title: "Database Normalization Levels (1NF, 2NF, 3NF)",
        details: "Normalization minimizes redundancy and secures integrity: 1) First Normal Form (1NF) mandates atomic fields (no repeating group arrays for single attributes). 2) Second Normal Form (2NF) requires being in 1NF and ensuring all non-key parameters are fully dependent on the primary key, avoiding partial key dependencies in composite key schemas. 3) Third Normal Form (3NF) requires being in 2NF and eliminating transitive dependencies (non-key columns must not depend on other non-key columns).",
        codeSnippet: `/* Table violations to 3NF fix: */
-- Non-Normalized: UserTable (ID, Name, DepartmentID, DepartmentName)
-- Normalized (3NF): 
CreateTable Departments (ID PRIMARY KEY, Name VARCHAR(50));
CreateTable Users (ID PRIMARY KEY, Name VARCHAR(50), DeptID INT, FOREIGN KEY (DeptID) REFERENCES Departments(ID));`
      },
      {
        title: "DDL vs DML (Data Definition vs Manipulation)",
        details: "DDL (Data Definition Language) command queries change the structural schemas of databases (CRUD on tables indices, views: CREATE, ALTER, DROP, TRUNCATE). DML (Data Manipulation Language) queries handle the interactive rows insertion and retrievals (INSERT, UPDATE, DELETE, SELECT).",
        codeSnippet: `-- DDL (Structural Schema)
ALTER TABLE employees ADD COLUMN start_date DATE;

-- DML (Row management)
UPDATE employees SET start_date = '2026-06-11' WHERE id = 104;`
      },
      {
        title: "Inner Joins vs Left Outer Joins",
        details: "INNER JOIN returns matching rows present in BOTH referenced tables based on specified equality keys. LEFT OUTER JOIN returns ALL registered records from the left table alongside any matching parameters from the right table, populating NULL indicators for columns where corresponding right records are missing.",
        codeSnippet: `-- Returns only students with a registered cohort record
SELECT s.name, c.cohort_name 
FROM Students s 
INNER JOIN Cohorts c ON s.cohort_id = c.id;

-- Returns all students, even if cohort_id is null
SELECT s.name, c.cohort_name 
FROM Students s 
LEFT JOIN Cohorts c ON s.cohort_id = c.id;`
      }
    ],
    cheatSheet: [
      {
        commandOrConcept: "Primary Key",
        definition: "A designated unique field enforcing entity integrity by preventing duplicate index insertion.",
        syntax: "id INT PRIMARY KEY AUTOINCREMENT"
      },
      {
        commandOrConcept: "Foreign Key",
        definition: "Enforces referential integrity by linking a child column to a parent key constraint.",
        syntax: "FOREIGN KEY(id) REFERENCES parent(id)"
      },
      {
        commandOrConcept: "GROUP BY and HAVING",
        definition: "Enables summarizing records, where HAVING filters aggregate groupings (cannot filter aggregate results using standard WHERE).",
        syntax: "SELECT dept, COUNT(*) FROM emp GROUP BY dept HAVING COUNT(*) > 5"
      },
      {
        commandOrConcept: "Index creation",
        definition: "Speeds up row queries on selected columns, with write latency costs.",
        syntax: "CREATE INDEX idx_user_email ON users(email);"
      }
    ],
    flashcards: [
      {
        question: "What is referential integrity?",
        answer: "A database rule securing consistency where foreign keys must always point to a valid, existing primary key in the parent table. It prevents dangling or corrupt data links."
      },
      {
        question: "What is a transitive dependency in database normalization?",
        answer: "When a non-key column is functionally dependent on another non-key column instead of depending directly on the primary key, violating 3NF."
      },
      {
        question: "Why delete locks are sometimes used during active updates?",
        answer: "To secure ACID transactions and ensure concurrency safety, preventing dirty reads or concurrent access anomalies on identical rows."
      }
    ]
  },
  {
    id: ModuleId.OOP_JAVA,
    title: "Object-Oriented Programming with Java",
    code: "L5_SWD_M03",
    description: "Deep dive into OOP pillars (Inheritance, Polymorphism, Encapsulation, Abstraction), robust compile handling, interfaces, and collection arrays in Java.",
    topics: [
      {
        title: "The Four Pillars of OOP",
        details: "1) Encapsulation: Keeping values and methods private (using private fields with getters/setters) to prevent direct unauthorized access. 2) Inheritance: Allowing child classes to inherit properties and methods from parent classes (using the extends keyword). 3) Polymorphism: The ability of an object to take many forms, utilizing method overriding (runtime) or overloading (compile-time). 4) Abstraction: Hiding implementation details and detailing modular signatures using Abstract classes and Interfaces.",
        codeSnippet: `// Polymorphism in Java:
abstract class Animal {
    abstract void makeSound();
}
class Dog extends Animal {
    @Override
    void makeSound() { System.out.println("Woof"); }
}`
      },
      {
        title: "Exception Handling Framework (Try-Catch-Finally)",
        details: "Java handles error faults by throwing and checking Exception objects. Checked Exceptions must be handled inside code methods (using try-catch blocks or specifying throws declarations), while Unchecked Exceptions (inheriting RuntimeException) represent logical developer errors (like NullPointerExceptions) and do not force signature declarations. The finally block executes regardless of whether an exception occurred.",
        codeSnippet: `try {
    int data = 50 / 0;
} catch (ArithmeticException e) {
    System.out.println("Cannot divide by zero error: " + e.getMessage());
} finally {
    System.out.println("Always completes, e.g., closing open file streams.");
}`
      }
    ],
    cheatSheet: [
      {
        commandOrConcept: "Encapsulatory Fields",
        definition: "Restricts attribute access variables to public setters/getters.",
        syntax: "private String studentName; public String getName() { return studentName; }"
      },
      {
        commandOrConcept: "Overloading vs Overriding",
        definition: "Overloading defines duplicate method signatures with variable inputs on a single class. Overriding modifies inherited parent method logic inside children.",
      },
      {
        commandOrConcept: "ArrayList vs HashMap",
        definition: "ArrayList manages linear ordered lists. HashMap implements fast key-value lookups.",
        syntax: "HashMap<Integer, String> map = new HashMap<>(); map.put(1, \"Kivu\");"
      }
    ],
    flashcards: [
      {
        question: "What is the primary difference between abstract classes and interfaces in Java?",
        answer: "A class can implement multiple interfaces, but can extend only one abstract parent class. Also, abstract classes can hold state variables and constructors, while interfaces predominantly hold behavioral declarations."
      },
      {
        question: "What is a NullPointerException (NPE) and how is it resolved?",
        answer: "It is an unchecked runtime exception thrown when code attempts to execute operations on an uninstantiated object pointer (which holds value 'null'). Solution: Add validation guards, null checks, or utilize the Java Optional class."
      },
      {
        question: "What does code compilation produce in Java?",
        answer: "The javac tool compiles Java files (.java) into machine-independent intermediate Bytecode files (.class) which run anywhere using the Java Virtual Machine (JVM)."
      }
    ]
  },
  {
    id: ModuleId.DEVOPS,
    title: "Software Testing and Deployment (DevOps)",
    code: "L5_SWD_M04",
    description: "Concepts of contemporary continuous integration (CI/CD), verification testing levels (Unit, Integration, UAT), test cases, and container assemblies (Docker).",
    topics: [
      {
        title: "Testing Levels hierarchy",
        details: "1) Unit Testing verifies isolated logic blocks or individual methods without external network/database calls (mocking is used). 2) Integration Testing assesses communications between integrated components, ensuring databases and APIs synchronize. 3) System Testing validates full compiled assemblies. 4) User Acceptance Testing (UAT) checks operational compatibility against live business requirements.",
        codeSnippet: `// Simple JUnit Test:
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

class CalculatorTest {
    @Test
    void testAdd() {
        Calculator calc = new Calculator();
        assertEquals(5, calc.add(2, 3), "2+3 should yield 5");
    }
}`
      },
      {
        title: "CI/CD Pipeline Architecture",
        details: "Continuous Integration (CI) is the practice of automating the building and testing of code repositories whenever changes are pushed. Continuous Deployment (CD) automatically releases approved code changes directly to virtual environments/containers, maintaining zero-downtime environments.",
        codeSnippet: `# Expressive pipeline snippet:
stages:
  - test
  - build
  - deploy`
      }
    ],
    cheatSheet: [
      {
        commandOrConcept: "Test Assertion API",
        definition: "Validates code execution outcomes against expected variables.",
        syntax: "assertEquals(expected, actual);"
      },
      {
        commandOrConcept: "Docker build commands",
        definition: "Compiles single application containers.",
        syntax: "docker build -t l5swd-app ."
      },
      {
        commandOrConcept: "Docker run command",
        definition: "Launches the container mapping standard ports.",
        syntax: "docker run -d -p 3000:3000 l5swd-app"
      }
    ],
    flashcards: [
      {
        question: "What is Test-Driven Development (TDD)?",
        answer: "A design loop specifying test criteria first BEFORE implementing logic. Loop details: Write breaking Test (Red), make test pass (Green), modify structure and optimize code (Refactor)."
      },
      {
        question: "What is regression testing?",
        answer: "Running existing test suites on modified programs to guarantee that updates or edits did not break established features."
      },
      {
        question: "Why use Docker in deployment?",
        answer: "It packages application source materials and environment dependencies altogether inside isolated lightweight containers, removing the 'it works on my machine' issue."
      }
    ]
  },
  {
    id: ModuleId.CLOUD_SYS,
    title: "Cloud Infrastructure and Server Administration",
    code: "L5_SWD_M05",
    description: "Linux administration, shell script automation, web server routing (Apache/Nginx), virtualization, resource groups, and security controls.",
    topics: [
      {
        title: "Terminal Commands & Privileged Controls",
        details: "Linux controls servers via shell utilities. Users employ specific command protocols (like chmod, chown) to configure permission matrices and secure system configurations. Root access represents privileged admin controls and is managed using the 'sudo' wrapper.",
        codeSnippet: `# Linux controls:
chmod 755 run_script.sh  # Sets execute, read, and write permissions safely
sudo systemctl restart nginx # Restarts Nginx with administrative permissions`
      },
      {
        title: "Virtualization vs Containerization",
        details: "Virtualization mimics physical computers, booting guest operating systems dynamically on hypervisors. Containerization (like Docker) shares host computing kernels immediately, running lightweight, isolated application modules with significantly faster boot times and lowered CPU budgets.",
        codeSnippet: `# Core concept differences:
-- VM: Thick footprint, hypervisor-managed, includes full Guest OS.
-- Container: Thin footprint, shared Host Kernel, managed by container engines.`
      }
    ],
    cheatSheet: [
      {
        commandOrConcept: "systemctl status SERVICE",
        definition: "Queries running statuses of system services.",
        syntax: "sudo systemctl status apache2"
      },
      {
        commandOrConcept: "cat /var/log/nginx/error.log",
        definition: "Inspects failed server runtime logs."
      },
      {
        commandOrConcept: "scp -r path user@host:/destination",
        definition: "Transfers files over SSH protocols securely."
      },
      {
        commandOrConcept: "df -h",
        definition: "Lists storage volumes and available capacities safely."
      }
    ],
    flashcards: [
      {
        question: "What is the function of a Reverse Proxy (like Nginx)?",
        answer: "An intermediate server acting as a gateway, accepting client traffic on external ports (like 80 or 443), distributing requests, handling SSL termination, and routing calls cleanly to backend processes."
      },
      {
        question: "What does the command 'chown root:www-data index.html' do?",
        answer: "It transfers ownership of index.html immediately, defining root as the owning user and www-data as the owning system security group."
      },
      {
        question: "Explain Cloud IAM.",
        answer: "IAM (Identity and Access Management) specifies access policies, determining the exact permission levels (Who can do What to which cloud Resources)."
      }
    ]
  },
  {
    id: ModuleId.MAINTENANCE,
    title: "Computer Security, Deployment & Maintenance",
    code: "L5_SWD_M06",
    description: "Essential physical electronics troubleshooting, Electrostatic Discharge (ESD) safety protocols, operating systems partitioning, and troubleshooting procedures.",
    topics: [
      {
        title: "Electrostatic Discharge (ESD) Safety Controls",
        details: "Static charges represent invisible high-voltage discharges destructive to motherboard chips and memory blocks. Engineers should use grounding straps, ground workspaces, use anti-static storage bags, and avoid touching copper terminal leads.",
        codeSnippet: `// Electrostatic Safety Steps:
1. Always disconnect power grids before taking apart metal cases.
2. Strap on grounding cables before holding bare chip registers.`
      },
      {
        title: "Operating System Deployment & Partition Models",
        details: "System deployment configures hardware to register OS boot volumes. Storage disks must be partitioned (using GPT or MBR tables) and formatted (using target file system protocols, e.g., NTFS for Windows, Ext4 for Linux, FAT32 for portable media).",
        codeSnippet: `# Linux disk management commands:
sudo fdisk -l          # Lists available physical disk tables
sudo mkfs.ext4 /dev/sdb1 # Formats target volume cleanly to Ext4`
      }
    ],
    cheatSheet: [
      {
        commandOrConcept: "Ping IP_ADDRESS",
        definition: "Tests low-level ICMP network connectivity routes.",
        syntax: "ping -c 4 8.8.8.8"
      },
      {
        commandOrConcept: "ESD Wrist Strap",
        definition: "Funnels static loads harmlessly to a neutral chassis grounding point."
      },
      {
        commandOrConcept: "Disk Management Tool",
        definition: "Configures file systems on system storages."
      }
    ],
    flashcards: [
      {
        question: "What causes a Blue Screen of Death (BSOD) on Windows?",
        answer: "Severe level hardware failures, physical memory disruptions (RAM defects), or corrupted system kernel drivers."
      },
      {
        question: "Why should we avoid formatting SSDs too frequently?",
        answer: "Excessive formatting triggers excessive read-write life cycles, wearing down the underlying flash cell gates and shortening physical lifespan."
      },
      {
        question: "What is MBR vs GPT?",
        answer: "GPT is the modern standard partition structure supporting unlimited columns and massive sizes, whereas legacy MBR limited disks to 4 primary partitions and 2TB drives."
      }
    ]
  }
];
