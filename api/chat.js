import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // --- 1. YOUR FULL DATASET (Updated with Degree Modules) ---
  const portfolioData = {
    "personal": {
      "name": "Ntokozo Ntombela",
      "title": "Data Engineer | ICT Graduate",
      "location": "Durban, South Africa",
      "summary": "A dedicated ICT Graduate from DUT with a strong portfolio in data engineering, automated ETL pipelines, and cloud-native analytics. Transitioning from software engineering to data, I focus on building efficient systems that turn raw data into actionable insights using Python, SQL, Azure, and Databricks."
    },
    "contact": {
      "email": "ntombelan098@gmail.com",
      "github": "https://github.com/ntokozo078",
      "linkedin": "https://www.linkedin.com/in/ntokozo-ntombela-ba662235a/",
      "portfolio": "https://ntokozo078.github.io"
    },
    "specialities": {
      "core": [
        "Data Engineering Pipelines", "ETL/ELT Automation", "Medallion Architecture",
        "Apache Spark (PySpark)", "Databricks Lakehouse", "Azure Data Services",
        "Advanced SQL", "REST API Integration", "Flask (Backend)",
        "Python Automation", "Cybersecurity Fundamentals"
      ],
      "programming": ["Python", "SQL", "C#", "Java", "HTML/CSS", "JavaScript", "Bash/Shell"],
      "cloud_platforms": ["Azure", "Databricks", "Render", "Firebase", "AWS (Foundational)"],
      "tools": ["Git & GitHub", "VS Code", "Linux (CLI)", "Power BI", "Jupyter Notebooks", "Docker"]
    },
    "education": {
      "degree": "Bachelor of Information & Communication Technology (BICT)",
      "institution": "Durban University of Technology",
      "year": "Graduated 2025",
      "coursework": {
        "year_1_foundations": [
          { "code": "DSTR101", "name": "Discrete Structures", "desc": "Mathematical foundations for CS: sets, logic, proofs, relations, combinatorics." },
          { "code": "MCMA101", "name": "Mathematics for Computing IA", "desc": "Calculus, vectors, and introduction to linear algebra (relevant for ML)." },
          { "code": "MCMB101", "name": "Mathematics for Computing IB", "desc": "Probability, distributions, sampling, estimators, and regression statistics." },
          { "code": "SWDF101", "name": "Software Development Fundamentals", "desc": "Core programming basics: algorithms, problem solving, coding, and debugging." },
          { "code": "SYSF101", "name": "Systems Fundamentals", "desc": "Hardware, OS fundamentals, system components, and architecture." }
        ],
        "year_2_technical": [
          { "code": "ALDS201", "name": "Algorithms and Data Structures II", "desc": "Advanced trees, graphs, algorithmic analysis, and complexity (Big O)." },
          { "code": "INFM201", "name": "Information Management II", "desc": "Databases, SQL, data modeling, and DB environments." },
          { "code": "NOPS201", "name": "Networks and Operating Systems II", "desc": "Scheduling, concurrency, memory management, routing, and reliable data transfer." },
          { "code": "PRLN201", "name": "Programming Languages II", "desc": "Language theory, compilers, runtime systems, and code generation." },
          { "code": "INAS201", "name": "Information Assurance & Security II", "desc": "Security fundamentals, defensive programming, crypto, and forensics." },
          { "code": "COAR201", "name": "Computer Organisation & Architecture II", "desc": "CPU architecture, memory hierarchies, I/O, and performance optimization." }
        ],
        "year_3_specialization": [
          { "code": "BSIT301", "name": "Business Intelligence III", "desc": "Descriptive, predictive, and prescriptive analytics + big data technologies." },
          { "code": "MCHI301", "name": "Machine Intelligence III", "desc": "AI fundamentals: search, reasoning, ML, NLP, agents, and computer vision." },
          { "code": "SFEN301", "name": "Software Engineering III", "desc": "High-level software architecture, quality assurance, testing, and maintenance." },
          { "code": "IPRT301", "name": "Integrative Programming & Technology III", "desc": "System integration: APIs, interoperability, scripts, and secure coding." },
          { "code": "PRJT302", "name": "Project III", "desc": "Capstone full-stack software project demonstrating specialization from requirements to deployment." }
        ]
      }
    },
    "certifications": {
      "completed": [
        { "name": "IBM Spark Fundamentals I", "issuer": "IBM SkillsBuild", "date": "Nov 2025" },
        { "name": "Microsoft Azure Data Fundamentals (DP-900)", "issuer": "Microsoft", "date": "2025" },
        { "name": "Databricks for Data Engineering", "issuer": "Databricks", "date": "Nov 2025" },
        { "name": "FNB App Academy 2025", "issuer": "FNB", "date": "2025", "focus": "Full Stack Engineering" },
        { "name": "Introduction to Cybersecurity", "issuer": "Cisco", "date": "May 2025" },
        { "name": "Linux Unhatched", "issuer": "Cisco", "date": "Oct 2024" },
        { "name": "Google Cloud Skills Boost – Data, ML & Analytics Path", "status": "completed" },
        { "name": "AWS Certified Cloud Practitioner", "status": "completed" }
      ],
      "in_progress": [
        { "name": "Azure Data Engineer Associate (DP-203)", "status": "in_progress" }
      ],
      "planned": [
        { "name": "Databricks Data Engineer Associate", "status": "planned" }
      ]
    },
    "projects": [
      {
        "name": "DevPulse: Real-Time Job Tracker",
        "tech_stack": ["Flask", "SQLAlchemy", "Pandas", "Regex NLP", "BeautifulSoup", "Render"],
        "summary": "A comprehensive data application. Built an automated ETL pipeline that scrapes job data via API, extracts 20+ technical skills using NLP/Regex, creates a relational database, and visualizes live market trends on an interactive dashboard.",
        "outcome": "Deployed a self-healing pipeline that tracks demand for skills like Python and AWS in real-time.",
        "live_url": "https://devpulse-job-tracker.onrender.com"
      },
      {
        "name": "Automated Data Extraction Engine",
        "tech_stack": ["Python", "Requests", "BeautifulSoup", "JSON", "Pandas"],
        "summary": "A robust scraping engine designed to ingest raw market data from the Adzuna API. It handles pagination, cleans messy HTML content, normalizes currency formats, and structures data for downstream database loading.",
        "outcome": "Automated the data collection process, reducing manual research time to zero."
      },
      {
        "name": "Databricks Medallion Sales Pipeline",
        "tech_stack": ["Databricks", "PySpark", "Delta Lake", "Medallion Architecture"],
        "summary": "An end-to-end cloud pipeline processing sales data. Implemented a Bronze (Raw) → Silver (Cleaned) → Gold (Aggregated) workflow using PySpark and Delta Tables to ensure data quality for business reporting.",
        "outcome": "Demonstrated mastery of modern Lakehouse architecture principles."
      },
      {
        "name": "Intelligent File System Automator",
        "tech_stack": ["Python", "OS Module", "Shutil", "Automation"],
        "summary": "A utility script that solves data disorganization. It scans directories, identifies file signatures (extensions), and automatically sorts thousands of files into logical folders (Images, Docs, Code) instantly."
      },
      {
        "name": "Peer Tutoring Platform",
        "tech_stack": ["Java", "Firebase Auth", "Firestore NoSQL"],
        "summary": "Developed the backend logic for a tutoring match system. Implemented real-time data syncing using Firestore listeners and secure user authentication."
      },
      {
        "name": "Digital Voting System",
        "tech_stack": ["Flask", "PostgreSQL", "BCrypt", "SQLAlchemy"],
        "summary": "Backend voting system with strict integrity constraints. Designed normalized relational models for candidates and votes, ensuring secure and auditable election results."
      }
    ],
    "goals": {
      "short_term": ["Secure a graduate role in 2025", "Pass Azure Data Engineer Associate (DP-203)", "Build a streaming pipeline with Kafka"],
      "long_term": ["Become a Senior Cloud Data Architect", "Specialize in Real-Time Big Data Processing"]
    },
    "strengths": [
      "Bridging Software Engineering & Data Engineering",
      "Building real, deployed applications",
      "Strong Cybersecurity & Network fundamentals",
      "Fast learner with a research-driven mindset"
    ]
  };

  // --- 2. SERVER LOGIC ---
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(200).json({ reply: "⚠️ System Error: API Key is missing in Vercel." });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Using Gemini 2.0 Flash
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // --- 3. THE BRAIN INSTRUCTIONS ---
    const systemPrompt = `
      You are the AI portfolio assistant for Ntokozo Ntombela.
      
      Here is your KNOWLEDGE BASE:
      ${JSON.stringify(portfolioData)}

      INSTRUCTIONS:
      1. **Coursework:** If asked about his university modules, degree, or theoretical knowledge, check the 'education.coursework' section. Mention specific modules like "Algorithms (ALDS201)" or "Machine Intelligence (MCHI301)" to prove his technical depth.
      2. **Projects:** Use the 'summary' and 'outcome' to explain the technical depth of his projects.
      3. **Tone:** Professional, enthusiastic, and knowledgeable.
      
      User Question: "${message}"
    `;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ reply: text });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(200).json({ 
      reply: `❌ AI Error: ${error.message}.` 
    });
  }
}