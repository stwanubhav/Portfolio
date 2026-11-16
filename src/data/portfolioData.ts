export interface Project {
  id: string;
  title: string;
  category: 'ai' | 'backend' | 'media' | 'client' | 'tools';
  description: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  highlight?: boolean;
  statusBadge?: string;
  primaryLanguage: string;
  languageColor: string;
  dateOrStatus: string;
  stars?: number;
  forks?: number;
}

export interface SkillItem {
  name: string;
  cert?: string;
}

export interface SkillGroup {
  category: string;
  items: SkillItem[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  period: string;
  status: 'Pursuing' | 'Passed 2025' | 'Passed 2023';
  description: string;
}

export interface CertificationItem {
  title: string;
  issuer: string;
  dateBadge?: string;
  verified: boolean;
  notes?: string;
}

export const PORTFOLIO_DATA = {
  person: {
    name: "Anubhav Patel",
    title: "Computer Science Student (BCA) | Aspiring AI Engineer",
    summary: "Pursuing BCA at United Institute of Management with strong foundations in programming and web technologies. Oracle-certified OCI AI Foundations Associate aspiring to become a professional AI engineer.",
    location: "Naini, Prayagraj, Uttar Pradesh, India",
    email: "stwanubhavbusiness@gmail.com",
    github: "https://github.com/stwanubhav",
    websites: [
      { name: "FreeLearnX", url: "https://www.freelearnx.ct.ws" },
      { name: "Lotus Study", url: "https://lotusstudy.ct.ws" }
    ],
    spokenLanguages: ["English", "Hindi"],
    softSkills: ["Teamwork", "Time Management", "Critical Thinking"],
    stats: [
      { label: "Public Repositories", value: "13+" },
      { label: "Active Products", value: "2 Ongoing" },
      { label: "Degree Path", value: "BCA 2026+" }
    ]
  },

  skills: {
    ai: {
      category: "Artificial Intelligence & Prompting",
      items: [
        { name: "OCI AI Foundations", cert: "Oracle Certified" },
        { name: "Prompt Engineering", cert: "Skillup Certified" },
        { name: "Multi-Model AI Integration" },
        { name: "Hugging Face Inference API" },
        { name: "LLM Orchestration & Prompts" }
      ]
    },
    languages: {
      category: "Programming Languages",
      items: [
        { name: "Python" },
        { name: "JavaScript (ES6+)" },
        { name: "TypeScript" },
        { name: "C / C++" },
        { name: "Java" },
        { name: "SQL" },
        { name: "PHP" },
        { name: "Shell / Bash" }
      ]
    },
    web: {
      category: "Web & Full-Stack Frameworks",
      items: [
        { name: "React JS", cert: "Newton School" },
        { name: "HTML5 / CSS3", cert: "Newton School & W3Schools" },
        { name: "Node.js" },
        { name: "Express.js" },
        { name: "Next.js" },
        { name: "FastAPI" },
        { name: "Flask" },
        { name: "Tailwind CSS" }
      ]
    },
    backend: {
      category: "APIs, Storage & Architecture",
      items: [
        { name: "RESTful API Design" },
        { name: "Server-Sent Events (SSE)" },
        { name: "Redis Caching & Queues" },
        { name: "SQLite & SQLAlchemy" },
        { name: "Nodemailer Worker Queues" },
        { name: "Rate Limiting & Token Auth" },
        { name: "Telegram Bot API" },
        { name: "Octokit (GitHub API)" }
      ]
    },
    tools: {
      category: "Tools & Development Workflow",
      items: [
        { name: "Docker" },
        { name: "Git & GitHub Actions" },
        { name: "Puppeteer PDF Engine" },
        { name: "yt-dlp & FFmpeg" },
        { name: "Google IDX & Nix" },
        { name: "Linux Environment" },
        { name: "Canva" },
        { name: "MS Office Suite" }
      ]
    }
  } as Record<string, SkillGroup>,

  education: [
    {
      institution: "United Institute of Management, Prayagraj",
      degree: "Bachelor of Computer Applications (BCA)",
      period: "Pursuing",
      status: "Pursuing",
      description: "Undergraduate coursework in computer science fundamentals, data structures, algorithms, database management, and modern software engineering."
    },
    {
      institution: "RRB Public School, Balapur, Uttar Pradesh",
      degree: "Intermediate — CBSE",
      period: "Passed 2025",
      status: "Passed 2025",
      description: "Senior secondary education focusing on mathematics, science, and foundational computer applications."
    },
    {
      institution: "St John's Co-Ed School, R.K. Puram, Naini, Prayagraj",
      degree: "High School — ICSE",
      period: "Passed 2023",
      status: "Passed 2023",
      description: "Secondary education curriculum with strong fundamentals in sciences, language, and logic."
    }
  ] as EducationItem[],

  certifications: [
    {
      title: "OCI AI Foundations Associate",
      issuer: "Oracle",
      dateBadge: "Passed 2025",
      verified: true,
      notes: "Official Oracle cloud certification covering machine learning paradigms, deep learning, NLP, computer vision, and generative AI fundamentals."
    },
    {
      title: "Prompt Engineering",
      issuer: "Skillup",
      verified: true,
      notes: "Practical training in structured prompt templates, few-shot prompting, and generative model guidance."
    },
    {
      title: "React JS",
      issuer: "Newton School",
      verified: true,
      notes: "Front-end engineering course covering component lifecycle, hooks, state management, and modern UI architectures."
    },
    {
      title: "HTML / CSS",
      issuer: "Newton School & W3Schools",
      verified: true,
      notes: "Comprehensive certification covering modern semantic markup, responsive layout techniques, and CSS standards."
    }
  ] as CertificationItem[],

  projects: [
    {
      id: "unite-cbt",
      title: "UNITE CBT — Examination Software",
      category: "client",
      description: "Computer-based testing software designed to help universities conduct online certification examinations with lower server resource requirements and operating costs.",
      tags: ["Exam Delivery", "Web Platform", "Optimized Infrastructure", "In Development"],
      statusBadge: "In Development",
      highlight: true,
      primaryLanguage: "TypeScript",
      languageColor: "#3178C6",
      dateOrStatus: "In Development (2025)",
      stars: 0,
      forks: 0
    },
    {
      id: "lotus-study",
      title: "Lotus Study — Coaching Website",
      category: "client",
      description: "Official web platform for Lotus Study coaching institute. Features responsive layouts, intuitive navigation, fast loading performance, and clean academic presentation.",
      tags: ["HTML5", "CSS3", "Node.js", "APIs"],
      liveUrl: "https://lotusstudy.ct.ws",
      statusBadge: "Ongoing (Feb 2025 – Present)",
      highlight: true,
      primaryLanguage: "HTML/CSS",
      languageColor: "#E34F26",
      dateOrStatus: "Feb 2025 – Present",
      stars: 0,
      forks: 0
    },
    {
      id: "stwai",
      title: "STWAI — Multi-Model AI Chat System",
      category: "ai",
      description: "Unified AI chat interface for comparing responses across multiple AI models side by side, featuring syntax highlighting, code formatting, and model-management controls.",
      tags: ["PHP", "Python", "FastAPI", "AI APIs", "Multi-Model"],
      githubUrl: "https://github.com/stwanubhav/stwai",
      highlight: true,
      primaryLanguage: "PHP",
      languageColor: "#777BB4",
      dateOrStatus: "Recent (2025)",
      stars: 0,
      forks: 0
    },
    {
      id: "stw-verify",
      title: "STW-Verify — Email OTP Verification API",
      category: "backend",
      description: "Token-scoped email OTP verification API featuring Redis-backed token storage, queued email delivery via Nodemailer, and built-in rate limiting.",
      tags: ["Node.js", "Express", "Redis", "Nodemailer", "REST API"],
      githubUrl: "https://github.com/stwanubhav/STW-Verify",
      highlight: true,
      primaryLanguage: "JavaScript",
      languageColor: "#F7DF1E",
      dateOrStatus: "Recent (2025)",
      stars: 0,
      forks: 0
    },
    {
      id: "md-to-pdf",
      title: "MD_TO_PDF — Live Markdown to PDF",
      category: "tools",
      description: "Markdown editing application with instant live preview and server-side PDF generation powered by Puppeteer and Monaco Editor.",
      tags: ["TypeScript", "Next.js", "React", "Monaco Editor", "Puppeteer"],
      githubUrl: "https://github.com/stwanubhav/MD_TO_PDF",
      highlight: true,
      primaryLanguage: "TypeScript",
      languageColor: "#3178C6",
      dateOrStatus: "Recent (2025)",
      stars: 0,
      forks: 0
    },
    {
      id: "commit-stw",
      title: "COMMIT-STW — AI Git Commit Assistant",
      category: "ai",
      description: "Local web utility that analyzes changed project files and automatically generates contextual commit messages using AI before pushing to GitHub.",
      tags: ["JavaScript", "Node.js", "Express", "Octokit", "Hugging Face", "SSE"],
      githubUrl: "https://github.com/stwanubhav/COMMIT-STW",
      highlight: true,
      primaryLanguage: "JavaScript",
      languageColor: "#F7DF1E",
      dateOrStatus: "Recent (2025)",
      stars: 0,
      forks: 0
    },
    {
      id: "lan-share",
      title: "LAN-Share — Real-Time Local File Sharing",
      category: "backend",
      description: "Local-network file sharing platform with an upload admin dashboard and instant file-list synchronization across connected browsers via Server-Sent Events.",
      tags: ["Python", "Flask", "JavaScript", "Server-Sent Events", "Wi-Fi Hub"],
      githubUrl: "https://github.com/stwanubhav/LAN-Share",
      primaryLanguage: "Python",
      languageColor: "#3572A5",
      dateOrStatus: "2024–2025",
      stars: 0,
      forks: 0
    },
    {
      id: "velocedl",
      title: "VeloceDL — High-Speed Media Downloader",
      category: "media",
      description: "Browser-based video and audio processing utility leveraging yt-dlp and FFmpeg, with quality format selection, live task updates, and automated file cleanup.",
      tags: ["JavaScript", "Node.js", "Express", "yt-dlp", "FFmpeg", "Docker"],
      githubUrl: "https://github.com/stwanubhav/VeloceDL",
      primaryLanguage: "JavaScript",
      languageColor: "#F7DF1E",
      dateOrStatus: "2024–2025",
      stars: 0,
      forks: 0
    },
    {
      id: "dropbox-transfer-bot",
      title: "Dropbox Transfer Bot",
      category: "backend",
      description: "Telegram bot that transfers files from direct downloading URLs and Google Drive links to Dropbox cloud storage using queued chunked uploads.",
      tags: ["Python", "Telegram Bot API", "Dropbox API", "Google Drive API"],
      githubUrl: "https://github.com/stwanubhav/Dropbox-Transfer-Bot",
      primaryLanguage: "Python",
      languageColor: "#3572A5",
      dateOrStatus: "Oct 2024 – Present",
      stars: 0,
      forks: 0
    },
    {
      id: "youtube-downloader-bot",
      title: "YouTube Downloader Telegram Bot",
      category: "media",
      description: "Asynchronous Telegram bot for downloading YouTube video or audio with quality format selection, live progress feedback, and temporary file management.",
      tags: ["Python", "python-telegram-bot", "yt-dlp", "FFmpeg", "asyncio"],
      githubUrl: "https://github.com/stwanubhav/YouTube-Downloader-Bot",
      primaryLanguage: "Python",
      languageColor: "#3572A5",
      dateOrStatus: "Oct 2024 – Present",
      stars: 0,
      forks: 0
    },
    {
      id: "kex-player",
      title: "KEX Player — Modern Web Video Player",
      category: "media",
      description: "Custom HTML5 video player featuring playback controls, timeline seeking, volume adjustment, custom keyboard shortcuts, and responsive fullscreen mode.",
      tags: ["HTML5", "CSS3", "JavaScript", "HTML Video API"],
      githubUrl: "https://github.com/stwanubhav/kex_player",
      liveUrl: "https://stwanubhav.github.io/kex_player/",
      primaryLanguage: "HTML/CSS",
      languageColor: "#E34F26",
      dateOrStatus: "2024–2025",
      stars: 0,
      forks: 0
    },
    {
      id: "gofile-client",
      title: "Ultra Transfer — GoFile Client",
      category: "tools",
      description: "Flask web application that orchestrates file transfers from MediaFire and direct links to GoFile with queued tasks and user authentication dashboards.",
      tags: ["Python", "Flask", "SQLAlchemy", "SQLite", "GoFile API"],
      githubUrl: "https://github.com/stwanubhav/Gofile_FileTransfer_Client",
      primaryLanguage: "Python",
      languageColor: "#3572A5",
      dateOrStatus: "2024–2025",
      stars: 0,
      forks: 0
    },
    {
      id: "dropbox-html-generator",
      title: "Dropbox HTML Video Generator Bot",
      category: "media",
      description: "Telegram bot that converts raw Dropbox video links into self-contained HTML files containing a custom embedded video player interface.",
      tags: ["Python", "Telegram Bot API", "HTML5", "CSS3", "JavaScript"],
      githubUrl: "https://github.com/stwanubhav/Dropbox-HTML-Video-Generator",
      primaryLanguage: "Python",
      languageColor: "#3572A5",
      dateOrStatus: "2024–2025",
      stars: 0,
      forks: 0
    },
    {
      id: "idx-git-vps",
      title: "Google IDX Cloud Workspace Config",
      category: "tools",
      description: "Automation shell scripts and Nix configuration for setting up optimized cloud development workspaces in Google IDX and Firebase Studio.",
      tags: ["Shell", "Nix", "Linux", "Google IDX", "DevOps"],
      githubUrl: "https://github.com/stwanubhav/idx-git-vps",
      primaryLanguage: "Shell",
      languageColor: "#89E051",
      dateOrStatus: "2024–2025",
      stars: 0,
      forks: 0
    }
  ] as Project[]
};
