import React, { useState, useEffect } from 'react';
import {
    Mail,
    FileText,
    ExternalLink,
    Lock,
    Unlock,
    Send,
    Star,
    CheckCircle,
    Moon,
    Sun,
    Menu,
    X,
    Award,
    Briefcase,
    GraduationCap,
    Code,
    Terminal,
    Brain,
    Layout,
    MessageSquare,
    Search,
    Filter,
    LogOut,
    Flame,
    Database,
    Sparkles,
    Eye,
    BarChart2
} from 'lucide-react';
import './App.css';

const DEVICON_MAP = {
    "React.js": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
    "JavaScript (ES6+)": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
    "HTML5": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
    "CSS3": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg",
    "Tailwind CSS": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
    "Bootstrap5": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bootstrap/bootstrap-original.svg",
    "Node.js": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
    "Express.js": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg",
    "MongoDB Atlas": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg",
    "Mongoose": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg",
    "MySQL": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg",
    "Java (Servlets, JSP, JDBC)": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg",
    "PyTorch": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pytorch/pytorch-original.svg",
    "OpenCV": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/opencv/opencv-original.svg",
    "AWS": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original.svg",
    "Docker": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg",
    "Kubernetes": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kubernetes/kubernetes-original.svg",
    "GCP": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg",
    "Figma": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg",
    "Terraform": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/terraform/terraform-original.svg",
    "Vite": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg",
    "Redux Toolkit": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redux/redux-original.svg",
    "HTML / CSS": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
    "Html, bootstrap5, css": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bootstrap/bootstrap-original.svg"
};

const API_BASE = 'http://localhost:8000/api';

function App() {
    // Theme state
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme');
        if (saved) return saved === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    // Mobile nav toggle
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Navigation and admin states
    const [currentTab, setCurrentTab] = useState('portfolio'); // 'portfolio' or 'admin'
    const [adminToken, setAdminToken] = useState(() => localStorage.getItem('adminToken') || '');
    const [adminUser, setAdminUser] = useState('admin');
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [loginError, setLoginError] = useState('');

    // Admin dashboard data
    const [feedbacks, setFeedbacks] = useState([]);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [sendingReply, setSendingReply] = useState(false);
    const [replyStatus, setReplyStatus] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [filterRating, setFilterRating] = useState('all');

    // Contact Form States
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'student',
        message: '',
        rating: 5,
        contactPermission: true,
        // Role specific
        studentDetails: { school: 'Rajarambapu Institute of Technology', degree: 'B.Tech', specialization: 'Computer Science & Engineering', gradYear: '2027', interestArea: 'MERN Stack' },
        company: { name: '', designation: '', website: '' },
        opportunity: { type: 'internship', position: '', jobType: 'internship', link: '' },
        clientDetails: { organization: '', projectType: '', timeline: '', description: '' },
        developerDetails: { organization: '', expertise: '', reason: '' }
    });
    const [formLoading, setFormLoading] = useState(false);
    const [formStatus, setFormStatus] = useState({ type: '', message: '' });

    // Active pipeline tab in Capstone
    const [capstoneTab, setCapstoneTab] = useState('overview');

    // Apply theme
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    // Fetch feedback if token exists
    useEffect(() => {
        if (adminToken && currentTab === 'admin') {
            fetchFeedbacks();
        }
    }, [adminToken, currentTab]);

    const fetchFeedbacks = async () => {
        try {
            const response = await fetch(`${API_BASE}/admin/feedback`, {
                headers: {
                    'Authorization': `Bearer ${adminToken}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setFeedbacks(data.data);
            } else {
                // Token might be expired
                handleLogout();
            }
        } catch (error) {
            console.error('Error fetching feedback:', error);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        try {
            const response = await fetch(`${API_BASE}/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: usernameInput, password: passwordInput })
            });
            const data = await response.json();
            if (data.success) {
                setAdminToken(data.token);
                localStorage.setItem('adminToken', data.token);
                setUsernameInput('');
                setPasswordInput('');
            } else {
                setLoginError(data.message || 'Invalid credentials');
            }
        } catch (error) {
            setLoginError('Could not connect to the backend server.');
        }
    };

    const handleLogout = () => {
        setAdminToken('');
        localStorage.removeItem('adminToken');
        setSelectedFeedback(null);
    };

    // Form inputs handler
    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleNestedFormChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleRatingSelect = (rate) => {
        setFormData(prev => ({ ...prev, rating: rate }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setFormStatus({ type: '', message: '' });

        try {
            const response = await fetch(`${API_BASE}/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (data.success) {
                setFormStatus({ type: 'success', message: 'Thank you! Your feedback has been submitted successfully.' });
                // Reset form fields but keep user details
                setFormData(prev => ({
                    ...prev,
                    message: '',
                    rating: 5,
                }));
            } else {
                setFormStatus({ type: 'error', message: data.message || 'Failed to submit feedback. Please check inputs.' });
            }
        } catch (error) {
            setFormStatus({ type: 'error', message: 'Could not submit. Make sure the server backend is running.' });
        } finally {
            setFormLoading(false);
        }
    };

    const handleSendReply = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        setSendingReply(true);
        setReplyStatus('');

        try {
            const response = await fetch(`${API_BASE}/admin/feedback/${selectedFeedback._id}/reply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                },
                body: JSON.stringify({ message: replyText })
            });
            const data = await response.json();
            if (data.success) {
                setReplyStatus('Reply recorded and processed successfully!');
                setReplyText('');
                // Update specific feedback item in state
                setFeedbacks(prev => prev.map(item => item._id === selectedFeedback._id ? data.data : item));
                setSelectedFeedback(data.data);
            } else {
                setReplyStatus(`Error: ${data.message}`);
            }
        } catch (error) {
            setReplyStatus('Error connecting to reply service.');
        } finally {
            setSendingReply(false);
        }
    };

    // Filter feedback lists
    const filteredFeedbacks = feedbacks.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              item.message.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || item.role === filterRole;
        const matchesRating = filterRating === 'all' || item.rating === Number(filterRating);
        return matchesSearch && matchesRole && matchesRating;
    });

    // Helper to format date
    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' });
    };

    // Technical skills data
    const skills = [
        { category: "Frontend", items: ["React.js", "JavaScript (ES6+)", "HTML5", "CSS3", "Vite", "Tailwind CSS", "Bootstrap5"] },
        { category: "Backend & Database", items: ["Node.js", "Express.js", "REST APIs", "MongoDB Atlas", "Mongoose", "MySQL", "Java (Servlets, JSP, JDBC)"] },
        { category: "AI / ML & NLP", items: ["PyTorch", "Torchvision", "YOLO Segmentation", "Grad-CAM (Explainable AI)", "Biomedical NER", "DeepSeek API", "OpenCV", "Plotly"] },
        { category: "DevOps & Cloud (Ongoing)", items: ["AWS", "Docker", "Kubernetes", "GCP", "GitHub Actions", "ArgoCD", "GitOps", "Terraform"] }
    ];

    // Certificates data
    const certs = {
        ongoing: [
            {
                title: "Udemy Master DevOps with AWS, Docker, Kubernetes, GCP, GitHub Actions, ArgoCD, GitOps, Terraform, Monitoring & AI",
                instructor: "Imran Teli (Founder HKH Infoteck)",
                duration: "64 hours",
                link: "https://www.udemy.com/share/104Xxm3@xAY2m-2HswKB7TAigi12fTX7Hqx1sPg9-uNfulhuy9H6O-lToVdQDOMaVCXsPz0EEw==/"
            },
            {
                title: "Udemy UX Designer using Figma",
                instructor: "Daniel Walter Scott",
                duration: "9.5 hours",
                link: "https://www.udemy.com/share/105pnK3@hkmHb-sFE8FLyEcAw0_E1TYmbUn-M_pXAaUvm005GyI_0IaN1G1q2sVxNGPLmN1HyQ==/"
            }
        ],
        important: [
            {
                title: "NPTEL Programming In Java",
                institution: "IIT Kharagpur",
                score: "80%",
                date: "Jan-Apr 2025 (12 weeks)",
                link: "https://drive.google.com/file/d/1GYbUzBq01WbhPnrqEF3s6-hWmX-V8GOh/view?usp=sharing"
            },
            {
                title: "Udemy Full Stack Web Development with React js, Angular and Nodejs",
                institution: "Oak Academy",
                score: "53 hours",
                date: "Sep 23, 2025",
                link: "https://drive.google.com/file/d/1bRJPuiRaeTQoLy86UzyRUVji3-qNXcAc/view?usp=sharing"
            },
            {
                title: "National Conference On Multidisciplinary smart innovations NCMSI",
                institution: "Rajarambapu Institute of Technology",
                paper: "A ResNet-Fuzzy Hybrid Model with Cross-Attention for Robust Multi-Domain Image Classification",
                date: "March 14 2026",
                link: "https://drive.google.com/file/d/1oub9PPP4orLRoa9n2HdZiKLNphqrs6OR/view?usp=sharing"
            },
            {
                title: "NPTEL Data Base Management System",
                institution: "IIT Kharagpur",
                score: "64%",
                date: "Jul-Sep 2025 (8 weeks)",
                link: "https://drive.google.com/file/d/1Htc18907BHeae7l4R0kWCS5_kxTFV-hH/view?usp=sharing"
            }
        ],
        other: [
            { title: "NPTEL Machine Learning, ML", org: "IIT Madras (8 weeks)", link: "https://drive.google.com/file/d/1Oe3QJyZCZTaaPD8r8Bg-lCai2TZYkWG3/view?usp=sharing" },
            { title: "Generative AI", org: "OutSkill", link: "https://drive.google.com/file/d/1uesgp3toZ88eypu0x2x3wyuorh4zgYC6/view?usp=sharing" },
            { title: "PW UI/UX Portfolio Bootcamp", org: "PW skills (22nd March 2025)", link: "https://drive.google.com/file/d/1NrsBqCB3DNnnaUszaH7bM6yfIT0e20gd/view?usp=sharing" },
            { title: "Data Science for Beginners", org: "Nasscom IT-ITeS SSC (92%, 3 May 2026)", link: "https://drive.google.com/file/d/1lltvTT3BmQrCBF-fGndy8IxmcBU_LVRD/view?usp=sharing" },
            { title: "Acquiring Data", org: "Accenture / Nasscom (9 Oct 2025)", link: "https://drive.google.com/file/d/1WHr9lMRZ7395EiO8xZEsw0C6sKtQIRzV/view?usp=sharing" },
            { title: "Internet of Things 201", org: "Infosys Springboard (17 Aug 2026)", link: "https://drive.google.com/file/d/1TzQgAtKmNJ7KXF7fX7qJim7xQPw91zZG/view?usp=sharing" },
            { title: "HTML5 and CSS3 Advanced Training", org: "Infosys Springboard (20 Mar 2025)", link: "https://drive.google.com/file/d/1i5HQBGvpCOXVZTFG9cLwH2KrrTBwXUZG/view?usp=sharing" },
            { title: "Finite Automata Theory", org: "Infosys Springboard (17 Mar 2025)", link: "https://drive.google.com/file/d/1uKAiuRaWwTsDpgzQOizusE4jro5TOV_8/view?usp=sharing" },
            { title: "Network Topologies & Technologies", org: "Infosys Springboard (10 Mar 2025)", link: "https://drive.google.com/file/d/1syQ5-yEACblnS0RVBtHDcPGBJeWjEJzj/view?usp=sharing" },
            { title: "Data Science for Beginners", org: "Board Infinity (9 Oct 2025)", link: "https://drive.google.com/file/d/1S4Mmnyu1E3-lk9rnoT-9I-hmTkgVtX3w/view?usp=sharing" }
        ]
    };

    // Projects data
    const projects = [
        {
            title: "TransactionHub – Personal Finance Management System",
            date: "May 2026 – June 2026",
            description: "A secure financial platform supporting multi-bank account management, real-time transaction tracking, and interactive Chart.js spend analysis.",
            tech: ["Java (Servlets, JSP, JDBC)", "MySQL", "HTML5", "CSS3", "JavaScript (ES6+)", "Chart.js"],
            link: null
        },
        {
            title: "HomeFix – Home Services E-Commerce Platform",
            description: "An on-demand home service marketplace featuring robust provider search, customer booking schedules, and JWT-authenticated session controls.",
            tech: ["React.js", "Node.js", "Express.js", "MongoDB Atlas", "Mongoose", "Tailwind CSS"],
            link: null
        },
        {
            title: "NamisCake – Delivery & E-Learning Platform",
            description: "A culinary commerce MERN app facilitating real-time cake customization, cart checkout routing, and Firebase tutorial recipe learning.",
            tech: ["React.js", "Node.js", "Express.js", "MongoDB Atlas", "Mongoose", "Firebase"],
            link: null
        },
        {
            title: "Real-time Currency Converter",
            description: "An interactive rates tracker querying external exchange API channels to calculate currency conversions on the fly.",
            tech: ["React.js", "JavaScript (ES6+)", "Currency API", "CSS3"],
            link: "https://react-js-eight-ruddy.vercel.app/"
        },
        {
            title: "Redux To-Do & Context API Architectures",
            description: "An educational layout demonstrating state architecture paradigms using both lightweight Context APIs and Redux Toolkit.",
            tech: ["React.js", "Redux Toolkit", "Context API", "CSS3"],
            link: null
        },
        {
            title: "Bootstrap Portfolio Showcase",
            description: "A mobile-responsive landing page layout showcasing modular grid designs, responsive menus, and custom CSS built with Bootstrap 5.",
            tech: ["HTML5", "Bootstrap5", "CSS3"],
            link: "https://github.com/AtharvChavan-45/Bootstrap_project"
        }
    ];

    return (
        <div className="portfolio-app">
            {/* Nav Header */}
            <header className="site-header">
                <div className="header-container">
                    <div className="logo-section" onClick={() => setCurrentTab('portfolio')}>
                        <span className="logo-icon">🚀</span>
                        <span className="logo-text">Atharv Chavan</span>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="desktop-nav">
                        {currentTab === 'portfolio' ? (
                            <>
                                <a href="#about">About</a>
                                <a href="#skills">Skills</a>
                                <a href="#projects">Projects</a>
                                <a href="#capstone">Capstone AI</a>
                                <a href="#certificates">Certificates</a>
                                <a href="#contact" className="nav-cta">Connect</a>
                            </>
                        ) : (
                            <button onClick={() => setCurrentTab('portfolio')} className="back-btn">
                                Back to Portfolio
                            </button>
                        )}
                        
                        <button 
                            className="theme-toggle" 
                            onClick={() => setDarkMode(!darkMode)}
                            title="Toggle Theme"
                        >
                            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        <button 
                            className={`admin-toggle-btn ${currentTab === 'admin' ? 'active' : ''}`}
                            onClick={() => setCurrentTab(currentTab === 'admin' ? 'portfolio' : 'admin')}
                            title="Admin Dashboard"
                        >
                            {adminToken ? <Unlock size={18} /> : <Lock size={18} />}
                            <span>Admin</span>
                        </button>
                    </nav>

                    {/* Mobile Menu Icon */}
                    <div className="mobile-header-actions">
                        <button 
                            className="theme-toggle" 
                            onClick={() => setDarkMode(!darkMode)}
                        >
                            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                        <button 
                            className="mobile-menu-toggle"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Drawer */}
                {mobileMenuOpen && (
                    <div className="mobile-nav-drawer">
                        {currentTab === 'portfolio' ? (
                            <>
                                <a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a>
                                <a href="#skills" onClick={() => setMobileMenuOpen(false)}>Skills</a>
                                <a href="#projects" onClick={() => setMobileMenuOpen(false)}>Projects</a>
                                <a href="#capstone" onClick={() => setMobileMenuOpen(false)}>Capstone AI</a>
                                <a href="#certificates" onClick={() => setMobileMenuOpen(false)}>Certificates</a>
                                <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-cta">Connect</a>
                            </>
                        ) : (
                            <button onClick={() => { setCurrentTab('portfolio'); setMobileMenuOpen(false); }} className="back-btn">
                                Back to Portfolio
                            </button>
                        )}
                        <hr className="drawer-separator" />
                        <button 
                            className="mobile-admin-btn"
                            onClick={() => {
                                setCurrentTab(currentTab === 'admin' ? 'portfolio' : 'admin');
                                setMobileMenuOpen(false);
                            }}
                        >
                            {adminToken ? <Unlock size={16} /> : <Lock size={16} />}
                            <span>Admin Dashboard</span>
                        </button>
                    </div>
                )}
            </header>

            {/* MAIN APP CONTAINER */}
            <main className="main-content">
                {currentTab === 'portfolio' ? (
                    // PORTFOLIO VIEW
                    <div className="portfolio-view fade-in">
                        {/* HERO SECTION */}
                        <section id="about" className="hero-section">
                            <div className="hero-grid">
                                <div className="hero-text-block">
                                    <div className="badge-highlight">🧑‍💻 Developer Portfolio</div>
                                    <h1 className="hero-title">
                                        Hi, I am <span className="gradient-text">Atharv Chavan</span>
                                    </h1>
                                    <h2 className="hero-subtitle">Computer Science Engineering Student</h2>
                                    <p className="hero-description">
                                        Studying at <strong>Rajarambapu Institute of Technology</strong>. 
                                        I build responsive full-stack applications with the MERN stack and research medical Computer Vision, Image Segmentation, and Medical NLP pipelines.
                                    </p>

                                    <div className="hero-ctas">
                                        <a href="#contact" className="btn btn-primary">Connect With Me</a>
                                        <a 
                                            href="/Resume_new.pdf" 
                                            download="Atharv_Chavan_Resume.pdf" 
                                            className="btn btn-secondary"
                                        >
                                            <FileText size={18} />
                                            Download Resume
                                        </a>
                                    </div>

                                    {/* Social Links Block */}
                                    <div className="social-links-container">
                                        <a href="https://github.com/AtharvChavan-45" target="_blank" rel="noopener noreferrer" className="social-link-btn" title="GitHub">
                                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                                                <path d="M9 18c-4.51 2-5-2-7-2" />
                                            </svg>
                                        </a>
                                        <a href="https://www.linkedin.com/in/atharvchavan045/" target="_blank" rel="noopener noreferrer" className="social-link-btn" title="LinkedIn">
                                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                                <rect x="2" y="9" width="4" height="12" />
                                                <circle cx="4" cy="4" r="2" />
                                            </svg>
                                        </a>
                                        <a href="https://leetcode.com/u/Atharv_45/" target="_blank" rel="noopener noreferrer" className="social-link-btn" title="Leetcode">
                                            <code className="leetcode-icon">LC</code>
                                        </a>
                                        <a href="mailto:atharvchavan045@gmail.com" className="social-link-btn" title="Email">
                                            <Mail size={20} />
                                        </a>
                                    </div>
                                </div>

                                <div className="hero-image-block">
                                    <div className="image-frame-glow">
                                        <img 
                                            src="/Myimage.png" 
                                            alt="Atharv Chavan" 
                                            className="profile-avatar"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"; // fallback premium illustration
                                            }}
                                        />
                                    </div>
                                    <div className="avatar-decorations">
                                        <span className="decor-tag backend">🛡️ MERN Stack</span>
                                        <span className="decor-tag ai">🧠 Computer Vision</span>
                                        <span className="decor-tag cloud">🐳 DevOps & GCP</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="section-divider"></div>

                        {/* SKILLS SECTION */}
                        <section id="skills" className="skills-section">
                            <div className="section-header">
                                <h2 className="section-title">Technical Skillset</h2>
                                <p className="section-desc">Languages, libraries, frameworks, and deployment utilities I work with</p>
                            </div>
                            <div className="skills-grid">
                                {skills.map((skillGroup, index) => (
                                    <div key={index} className="skill-card">
                                        <h3 className="skill-group-title">{skillGroup.category}</h3>
                                        <div className="skill-items">
                                            {skillGroup.items.map((skill, sIdx) => (
                                                <span key={sIdx} className="skill-badge">
                                                    {DEVICON_MAP[skill] && (
                                                        <img src={DEVICON_MAP[skill]} alt={skill} className="skill-icon-img" />
                                                    )}
                                                    <span>{skill}</span>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="section-divider"></div>

                        {/* PROJECTS SECTION */}
                        <section id="projects" className="projects-section">
                            <div className="section-header">
                                <h2 className="section-title">Featured Projects</h2>
                                <p className="section-desc">Full-Stack systems, tracking tools, and front-end architectures</p>
                            </div>
                            <div className="projects-grid">
                                {projects.map((project, idx) => (
                                    <div key={idx} className="project-card">
                                        <div className="project-card-header">
                                            <div className="project-icon-wrapper">
                                                {project.tech[0] && DEVICON_MAP[project.tech[0]] ? (
                                                    <img src={DEVICON_MAP[project.tech[0]]} alt={project.tech[0]} className="project-tech-logo-top" />
                                                ) : (
                                                    <Briefcase size={20} className="project-icon" />
                                                )}
                                            </div>
                                            <span className="project-date">{project.date || "Academic Showcase"}</span>
                                        </div>
                                        <h3 className="project-title">{project.title}</h3>
                                        <p className="project-description">
                                            {project.description}
                                        </p>
                                        <div className="project-tech-list">
                                            {project.tech.map((t, tIdx) => (
                                                <span key={tIdx} className="project-tech-badge">
                                                    {DEVICON_MAP[t] && (
                                                        <img src={DEVICON_MAP[t]} alt={t} className="badge-tech-icon" />
                                                    )}
                                                    <span>{t}</span>
                                                </span>
                                            ))}
                                        </div>
                                        {project.link && (
                                            <a 
                                                href={project.link} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="project-link"
                                            >
                                                <span>Visit Project</span>
                                                <ExternalLink size={14} />
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="section-divider"></div>

                        {/* CAPSTONE PROJECT SECTION */}
                        <section id="capstone" className="capstone-section">
                            <div className="capstone-container">
                                <div className="badge-highlight capstone-badge">🎓 Capstone Project Highlight</div>
                                <h2 className="capstone-main-title">AI-Based Renal Abnormality Detection, Segmentation & Clinical Support System</h2>
                                <p className="capstone-intro-text">
                                    An academic research prototype integrating Computer Vision, Deep Learning, Explainable AI, and Medical NLP to detect, isolate, and provide context-aware lifestyle recommendations for kidney abnormalities (Cysts, Stones, and Tumors).
                                </p>

                                {/* Interactive Pipeline Tabs */}
                                <div className="capstone-tabs-nav">
                                    <button 
                                        className={`pipeline-tab-btn ${capstoneTab === 'overview' ? 'active' : ''}`}
                                        onClick={() => setCapstoneTab('overview')}
                                    >
                                        <Brain size={16} />
                                        <span>System Overview</span>
                                    </button>
                                    <button 
                                        className={`pipeline-tab-btn ${capstoneTab === 'imaging' ? 'active' : ''}`}
                                        onClick={() => setCapstoneTab('imaging')}
                                    >
                                        <Eye size={16} />
                                        <span>Image Pipeline</span>
                                    </button>
                                    <button 
                                        className={`pipeline-tab-btn ${capstoneTab === 'nlp' ? 'active' : ''}`}
                                        onClick={() => setCapstoneTab('nlp')}
                                    >
                                        <Database size={16} />
                                        <span>Medical NLP</span>
                                    </button>
                                    <button 
                                        className={`pipeline-tab-btn ${capstoneTab === 'results' ? 'active' : ''}`}
                                        onClick={() => setCapstoneTab('results')}
                                    >
                                        <BarChart2 size={16} />
                                        <span>Evaluation Metrics</span>
                                    </button>
                                </div>

                                <div className="capstone-tab-content">
                                    {capstoneTab === 'overview' && (
                                        <div className="tab-pane fade-in">
                                            <div className="two-col-layout">
                                                <div>
                                                    <h3 className="pane-title">Integrative System Architecture</h3>
                                                    <p className="pane-p">
                                                        The pipeline bridges <strong>Computer Vision (PCSA-KidneyNeXt and YOLOv8 Segmentation)</strong> with <strong>Biomedical Entity Extraction (Transformers)</strong> and <strong>LLM-guided Clinical Reasoning (DeepSeek API)</strong>.
                                                    </p>
                                                    <ul className="pane-list">
                                                        <li><strong>Classification</strong>: CT scan gets routed through a lightweight 2.11M parameter PyTorch network focusing on Pyramid Channel Spatial Attention.</li>
                                                        <li><strong>Conditional Routing</strong>: Cysts and Tumors undergo localized boundaries classification.</li>
                                                        <li><strong>Clinical Support</strong>: Unstructured doctor notes are parsed to output clinical support text, diet guidelines, and lifestyle summaries.</li>
                                                    </ul>
                                                </div>
                                                <div className="diagram-container">
                                                    <div className="flowchart-box">
                                                        <div className="flow-step">CT Scan Input</div>
                                                        <div className="flow-arrow">▼</div>
                                                        <div className="flow-step accent-step">PCSA-KidneyNeXt (Classification)</div>
                                                        <div className="flow-arrow">▼</div>
                                                        <div className="flow-split">
                                                            <div className="split-branch">Stone/Normal</div>
                                                            <div className="split-branch accent">Cyst/Tumor YOLO</div>
                                                        </div>
                                                        <div className="flow-arrow">▼</div>
                                                        <div className="flow-step">OpenCV Geometric Ratio Calculation</div>
                                                        <div className="flow-arrow">▼</div>
                                                        <div className="flow-step highlight-step">LLM Lifestyle Suggestions</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {capstoneTab === 'imaging' && (
                                        <div className="tab-pane fade-in">
                                            <h3 className="pane-title">PyTorch & YOLOv8 Segmentation Flow</h3>
                                            <div className="metrics-cards-grid">
                                                <div className="metric-detail-card">
                                                    <h4>1. Preprocessing & Attention Map</h4>
                                                    <p>Inputs are resized to 224x224 and fed into PCSA-KidneyNeXt. Grad-CAM visualizes the feature maps to reveal specific areas that influenced model categorization.</p>
                                                </div>
                                                <div className="metric-detail-card">
                                                    <h4>2. YOLO Segmentation Routing</h4>
                                                    <p>Active cases trigger dedicated segmentation models outputting bounding boxes and polygon boundaries for <strong>Kidney</strong>, <strong>Cyst</strong>, and <strong>Tumor</strong> classes.</p>
                                                </div>
                                                <div className="metric-detail-card">
                                                    <h4>3. Sizing Area Ratio</h4>
                                                    <p>OpenCV extracts coordinates and computes structural areas. Ratio = <code>(Pathology Area / Kidney Area) * 100</code> is logged to help researchers calculate boundary impacts.</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {capstoneTab === 'nlp' && (
                                        <div className="tab-pane fade-in">
                                            <div className="two-col-layout">
                                                <div>
                                                    <h3 className="pane-title">Biomedical Named Entity Recognition (NER)</h3>
                                                    <p className="pane-p">
                                                        Rather than relying solely on images, the system reads unstructured clinical reports and uses <code>d4data/biomedical-ner-all</code> to extract structured medical concepts:
                                                    </p>
                                                    <div className="ner-demo-box">
                                                        <p className="ner-text">
                                                            Patient presented with <span className="ner-tag symptom">Flank pain</span> and <span className="ner-tag symptom">Hematuria</span>. History of <span className="ner-tag disease">Renal Cell Carcinoma</span>, currently taking <span className="ner-tag medication">Metformin</span>.
                                                        </p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="pane-title">LLM Clinical Suggestions</h3>
                                                    <p className="pane-p">
                                                        Extracted details feed into the DeepSeek LLM runtime which writes contextual food guides (e.g. low-oxalate suggestions for stone profiles) and clinical warning notices to support care.
                                                    </p>
                                                    <div className="recommendations-box">
                                                        <h5>📝 Generated Support Suggestions:</h5>
                                                        <ul>
                                                            <li>Increase fluid intake to &gt;2.5L daily to minimize urinary saturation.</li>
                                                            <li>Observe precautions with Metformin therapy under current CT imaging schedules.</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {capstoneTab === 'results' && (
                                        <div className="tab-pane fade-in">
                                            <h3 className="pane-title">Evaluation Metrics & Framework Highlights</h3>
                                            <div className="evaluation-stats-table-wrapper">
                                                <table className="evaluation-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Metric Type</th>
                                                            <th>Implemented Components</th>
                                                            <th>Purpose / Value</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td><strong>Model Parameters</strong></td>
                                                            <td>PCSA-KidneyNeXt Network</td>
                                                            <td>~2.11 Million Parameters (Lightweight & deployable)</td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Segmentation Target</strong></td>
                                                            <td>YOLOv8 Dual Branch</td>
                                                            <td>Classes: 0 (Kidney), 1 (Tumor), 2 (Cyst)</td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Explainability</strong></td>
                                                            <td>Grad-CAM Architecture</td>
                                                            <td>Calculates gradient flows to highlight focal CT regions</td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Clinical NLP</strong></td>
                                                            <td>Biomedical NER (d4data)</td>
                                                            <td>Extracts 100+ diagnostic terms (symptoms, drugs, labs)</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        <div className="section-divider"></div>

                        {/* CERTIFICATIONS SECTION */}
                        <section id="certificates" className="certificates-section">
                            <div className="section-header">
                                <h2 className="section-title">Certifications & Achievements</h2>
                                <p className="section-desc">Completed professional certifications, specialized courses, and conference publications</p>
                            </div>

                            {/* Main Credentials Grid */}
                            <div className="certs-main-grid">
                                {/* Ongoing Specializations */}
                                {certs.ongoing.map((c, i) => (
                                    <div key={`ongoing-${i}`} className="cert-premium-card ongoing-glow">
                                        <div className="cert-badge-type ongoing">
                                            <span className="pulsing-dot"></span>
                                            <span>Ongoing</span>
                                        </div>
                                        <div className="cert-card-content">
                                            <div className="cert-issuer-img-placeholder">⏱️</div>
                                            <div className="cert-info">
                                                <h4 className="cert-title-text">{c.title}</h4>
                                                <p className="cert-issuer-text">Instructor: <strong>{c.instructor}</strong></p>
                                                <div className="cert-footer-meta">
                                                    <span className="meta-tag duration">⏱️ {c.duration}</span>
                                                    <a href={c.link} target="_blank" rel="noopener noreferrer" className="cert-action-btn">
                                                        <span>View Course</span>
                                                        <ExternalLink size={14} />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Key Certifications & Conferences */}
                                {certs.important.map((c, i) => (
                                    <div key={`important-${i}`} className="cert-premium-card completed-glow">
                                        <div className="cert-badge-type completed">
                                            <Award size={12} />
                                            <span>Completed</span>
                                        </div>
                                        <div className="cert-card-content">
                                            <div className="cert-issuer-img-placeholder">🏆</div>
                                            <div className="cert-info">
                                                <h4 className="cert-title-text">{c.title}</h4>
                                                <p className="cert-issuer-text">Institution: <strong>{c.institution}</strong></p>
                                                {c.score && (
                                                    <p className="cert-score-text">
                                                        {c.score.includes('hour') ? 'Duration' : 'Result'}: <strong>{c.score}</strong>
                                                    </p>
                                                )}
                                                {c.paper && (
                                                    <div className="cert-paper-block">
                                                        <span>Conf. Paper:</span>
                                                        <p>"{c.paper}"</p>
                                                    </div>
                                                )}
                                                <div className="cert-footer-meta">
                                                    <span className="meta-tag date">{c.date}</span>
                                                    <a href={c.link} target="_blank" rel="noopener noreferrer" className="cert-action-btn">
                                                        <span>Verify</span>
                                                        <ExternalLink size={14} />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Other Badges / Short Courses */}
                            <div className="certs-other-container">
                                <h3 className="certs-subsection-title">📜 Technical Badges & Core Training</h3>
                                <div className="certs-badges-flex">
                                    {certs.other.map((c, i) => (
                                        <a 
                                            key={`other-${i}`} 
                                            href={c.link} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="cert-pill-badge"
                                        >
                                            <CheckCircle className="badge-check-icon" size={13} />
                                            <div className="badge-label-group">
                                                <span className="badge-name">{c.title}</span>
                                                <span className="badge-org">({c.org})</span>
                                            </div>
                                            <ExternalLink size={10} className="badge-arrow-icon" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <div className="section-divider"></div>

                        {/* CONTACT & FEEDBACK FORM */}
                        <section id="contact" className="contact-section">
                            <div className="contact-form-container">
                                <div className="section-header">
                                    <h2 className="section-title">Connect & Give Feedback</h2>
                                    <p className="section-desc">Select who you are to dynamically customize fields for your query</p>
                                </div>

                                <form onSubmit={handleFormSubmit} className="feedback-form">
                                    <div className="form-row-two">
                                        <div className="form-group">
                                            <label htmlFor="form-name">Your Name</label>
                                            <input 
                                                id="form-name"
                                                type="text" 
                                                name="name" 
                                                value={formData.name} 
                                                onChange={handleFormChange}
                                                placeholder="e.g. Jane Doe"
                                                required 
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="form-email">Email Address</label>
                                            <input 
                                                id="form-email"
                                                type="email" 
                                                name="email" 
                                                value={formData.email} 
                                                onChange={handleFormChange}
                                                placeholder="e.g. jane@example.com"
                                                required 
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="form-role">Who Are You?</label>
                                        <select 
                                            id="form-role"
                                            name="role" 
                                            value={formData.role} 
                                            onChange={handleFormChange}
                                        >
                                            <option value="student">Student</option>
                                            <option value="company_representative">Company Representative</option>
                                            <option value="hiring_manager_recruiter">Hiring Manager / Recruiter</option>
                                            <option value="client">Client / Freelance Opportunity</option>
                                            <option value="developer_professional">Developer / Tech Professional</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    {/* DYNAMIC FIELDSETS BASED ON SELECTED ROLE */}

                                    {/* STUDENT */}
                                    {formData.role === 'student' && (
                                        <div className="dynamic-fieldset fade-in">
                                            <h4>👨‍🎓 Student Details</h4>
                                            <div className="form-row-three">
                                                <div className="form-group">
                                                    <label htmlFor="std-school">College / University</label>
                                                    <input 
                                                        id="std-school"
                                                        type="text" 
                                                        value={formData.studentDetails.school} 
                                                        onChange={(e) => handleNestedFormChange('studentDetails', 'school', e.target.value)}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="std-degree">Degree</label>
                                                    <input 
                                                        id="std-degree"
                                                        type="text" 
                                                        value={formData.studentDetails.degree} 
                                                        onChange={(e) => handleNestedFormChange('studentDetails', 'degree', e.target.value)}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="std-spec">Branch / Specialization</label>
                                                    <input 
                                                        id="std-spec"
                                                        type="text" 
                                                        value={formData.studentDetails.specialization} 
                                                        onChange={(e) => handleNestedFormChange('studentDetails', 'specialization', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-row-two">
                                                <div className="form-group">
                                                    <label htmlFor="std-year">Graduation Year</label>
                                                    <input 
                                                        id="std-year"
                                                        type="text" 
                                                        value={formData.studentDetails.gradYear} 
                                                        onChange={(e) => handleNestedFormChange('studentDetails', 'gradYear', e.target.value)}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="std-interest">Area of Interest</label>
                                                    <input 
                                                        id="std-interest"
                                                        type="text" 
                                                        value={formData.studentDetails.interestArea} 
                                                        onChange={(e) => handleNestedFormChange('studentDetails', 'interestArea', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* COMPANY REPRESENTATIVE */}
                                    {formData.role === 'company_representative' && (
                                        <div className="dynamic-fieldset fade-in">
                                            <h4>🏢 Corporate Profile</h4>
                                            <div className="form-row-three">
                                                <div className="form-group">
                                                    <label htmlFor="corp-company">Company Name</label>
                                                    <input 
                                                        id="corp-company"
                                                        type="text" 
                                                        placeholder="ABC Inc"
                                                        value={formData.company.name} 
                                                        onChange={(e) => handleNestedFormChange('company', 'name', e.target.value)}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="corp-desig">Designation</label>
                                                    <input 
                                                        id="corp-desig"
                                                        type="text" 
                                                        placeholder="HR Manager / Lead Developer"
                                                        value={formData.company.designation} 
                                                        onChange={(e) => handleNestedFormChange('company', 'designation', e.target.value)}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="corp-web">Company Website</label>
                                                    <input 
                                                        id="corp-web"
                                                        type="url" 
                                                        placeholder="https://..."
                                                        value={formData.company.website} 
                                                        onChange={(e) => handleNestedFormChange('company', 'website', e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <h4 className="sub-title">💼 Opportunity Details</h4>
                                            <div className="form-row-three">
                                                <div className="form-group">
                                                    <label htmlFor="corp-opp-type">Opportunity Type</label>
                                                    <select 
                                                        id="corp-opp-type"
                                                        value={formData.opportunity.type} 
                                                        onChange={(e) => handleNestedFormChange('opportunity', 'type', e.target.value)}
                                                    >
                                                        <option value="internship">Internship</option>
                                                        <option value="full-time">Full-Time Job</option>
                                                        <option value="freelance">Freelance Contract</option>
                                                        <option value="collaboration">Collaboration</option>
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="corp-pos">Position</label>
                                                    <input 
                                                        id="corp-pos"
                                                        type="text" 
                                                        placeholder="e.g. MERN Developer"
                                                        value={formData.opportunity.position} 
                                                        onChange={(e) => handleNestedFormChange('opportunity', 'position', e.target.value)}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="corp-link">Job Description Link</label>
                                                    <input 
                                                        id="corp-link"
                                                        type="url" 
                                                        placeholder="https://company.com/careers/..."
                                                        value={formData.opportunity.link} 
                                                        onChange={(e) => handleNestedFormChange('opportunity', 'link', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* HIRING MANAGER & RECRUITER */}
                                    {formData.role === 'hiring_manager_recruiter' && (
                                        <div className="dynamic-fieldset fade-in">
                                            <h4>💼 Recruiting Information</h4>
                                            <div className="form-row-two">
                                                <div className="form-group">
                                                    <label htmlFor="rec-company">Company Name</label>
                                                    <input 
                                                        id="rec-company"
                                                        type="text" 
                                                        placeholder="e.g. Technology Co"
                                                        value={formData.company.name} 
                                                        onChange={(e) => handleNestedFormChange('company', 'name', e.target.value)}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="rec-desig">Designation</label>
                                                    <input 
                                                        id="rec-desig"
                                                        type="text" 
                                                        placeholder="e.g. Talent Acquisition"
                                                        value={formData.company.designation} 
                                                        onChange={(e) => handleNestedFormChange('company', 'designation', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-row-three">
                                                <div className="form-group">
                                                    <label htmlFor="rec-pos">Hiring Position</label>
                                                    <input 
                                                        id="rec-pos"
                                                        type="text" 
                                                        placeholder="e.g. Software Engineer"
                                                        value={formData.opportunity.position} 
                                                        onChange={(e) => handleNestedFormChange('opportunity', 'position', e.target.value)}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="rec-jobtype">Job Type</label>
                                                    <select 
                                                        id="rec-jobtype"
                                                        value={formData.opportunity.jobType} 
                                                        onChange={(e) => handleNestedFormChange('opportunity', 'jobType', e.target.value)}
                                                    >
                                                        <option value="internship">Internship</option>
                                                        <option value="full-time">Full-Time</option>
                                                        <option value="part-time">Part-Time</option>
                                                        <option value="contract">Contract</option>
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="rec-link">Opportunity / Post Link</label>
                                                    <input 
                                                        id="rec-link"
                                                        type="url" 
                                                        placeholder="https://linkedin.com/jobs/..."
                                                        value={formData.opportunity.link} 
                                                        onChange={(e) => handleNestedFormChange('opportunity', 'link', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* CLIENT */}
                                    {formData.role === 'client' && (
                                        <div className="dynamic-fieldset fade-in">
                                            <h4>🤝 Project Profile</h4>
                                            <div className="form-row-three">
                                                <div className="form-group">
                                                    <label htmlFor="cli-org">Organization Name</label>
                                                    <input 
                                                        id="cli-org"
                                                        type="text" 
                                                        placeholder="e.g. Startup Lab"
                                                        value={formData.clientDetails.organization} 
                                                        onChange={(e) => handleNestedFormChange('clientDetails', 'organization', e.target.value)}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="cli-proj-type">Project Type</label>
                                                    <input 
                                                        id="cli-proj-type"
                                                        type="text" 
                                                        placeholder="e.g. E-Commerce, Mobile App"
                                                        value={formData.clientDetails.projectType} 
                                                        onChange={(e) => handleNestedFormChange('clientDetails', 'projectType', e.target.value)}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="cli-timeline">Expected Timeline</label>
                                                    <input 
                                                        id="cli-timeline"
                                                        type="text" 
                                                        placeholder="e.g. 2 months"
                                                        value={formData.clientDetails.timeline} 
                                                        onChange={(e) => handleNestedFormChange('clientDetails', 'timeline', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="cli-desc">Project Description Brief</label>
                                                <textarea 
                                                    id="cli-desc"
                                                    rows="2"
                                                    placeholder="Specify requirements and scope..."
                                                    value={formData.clientDetails.description} 
                                                    onChange={(e) => handleNestedFormChange('clientDetails', 'description', e.target.value)}
                                                ></textarea>
                                            </div>
                                        </div>
                                    )}

                                    {/* DEVELOPER */}
                                    {formData.role === 'developer_professional' && (
                                        <div className="dynamic-fieldset fade-in">
                                            <h4>💻 Technical Connection</h4>
                                            <div className="form-row-three">
                                                <div className="form-group">
                                                    <label htmlFor="dev-org">Organization / Company</label>
                                                    <input 
                                                        id="dev-org"
                                                        type="text" 
                                                        placeholder="Company or school name"
                                                        value={formData.developerDetails.organization} 
                                                        onChange={(e) => handleNestedFormChange('developerDetails', 'organization', e.target.value)}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="dev-exp">Area of Expertise</label>
                                                    <input 
                                                        id="dev-exp"
                                                        type="text" 
                                                        placeholder="e.g. Backend, AI Research"
                                                        value={formData.developerDetails.expertise} 
                                                        onChange={(e) => handleNestedFormChange('developerDetails', 'expertise', e.target.value)}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="dev-reason">Reason for Connecting</label>
                                                    <input 
                                                        id="dev-reason"
                                                        type="text" 
                                                        placeholder="e.g. Mentorship, code review, tech talks"
                                                        value={formData.developerDetails.reason} 
                                                        onChange={(e) => handleNestedFormChange('developerDetails', 'reason', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="form-group">
                                        <label htmlFor="form-message">Message</label>
                                        <textarea 
                                            id="form-message"
                                            rows="4" 
                                            name="message" 
                                            value={formData.message} 
                                            onChange={handleFormChange}
                                            placeholder="Write your message here..."
                                            required 
                                        ></textarea>
                                    </div>

                                    {/* Portfolio Rating System */}
                                    <div className="rating-select-container">
                                        <span className="rating-label">⭐ Rate my Portfolio:</span>
                                        <div className="stars-input-row">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    className={`star-select-btn ${star <= formData.rating ? 'selected' : ''}`}
                                                    onClick={() => handleRatingSelect(star)}
                                                >
                                                    <Star fill={star <= formData.rating ? "var(--accent)" : "transparent"} size={22} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="checkbox-group">
                                        <input 
                                            type="checkbox" 
                                            id="contact-permission" 
                                            name="contactPermission" 
                                            checked={formData.contactPermission}
                                            onChange={handleFormChange}
                                        />
                                        <label htmlFor="contact-permission">
                                            I allow you to contact me back using my submitted email address.
                                        </label>
                                    </div>

                                    <button 
                                        type="submit" 
                                        className="btn btn-primary btn-submit"
                                        disabled={formLoading}
                                    >
                                        {formLoading ? 'Submitting...' : 'Send Message'}
                                        <Send size={16} />
                                    </button>

                                    {formStatus.message && (
                                        <div className={`form-status-alert ${formStatus.type}`}>
                                            {formStatus.type === 'success' ? <CheckCircle size={18} /> : <X size={18} />}
                                            <span>{formStatus.message}</span>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </section>
                    </div>
                ) : (
                    // ADMIN PANEL VIEW
                    <div className="admin-view fade-in">
                        {!adminToken ? (
                            // ADMIN LOGIN VIEW
                            <div className="admin-login-container">
                                <div className="login-card">
                                    <div className="lock-icon-wrapper">
                                        <Lock size={32} />
                                    </div>
                                    <h3>Admin Portal Access</h3>
                                    <p>Enter administrative credentials to review user feedback and send replies</p>
                                    
                                    <form onSubmit={handleLogin} className="login-form">
                                        <div className="form-group">
                                            <label htmlFor="adm-user">Username</label>
                                            <input 
                                                id="adm-user"
                                                type="text" 
                                                value={usernameInput}
                                                onChange={(e) => setUsernameInput(e.target.value)}
                                                placeholder="e.g. admin"
                                                required 
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="adm-pass">Password</label>
                                            <input 
                                                id="adm-pass"
                                                type="password" 
                                                value={passwordInput}
                                                onChange={(e) => setPasswordInput(e.target.value)}
                                                placeholder="••••••••"
                                                required 
                                            />
                                        </div>
                                        {loginError && <div className="login-error-alert">{loginError}</div>}
                                        
                                        <button type="submit" className="btn btn-primary full-width">
                                            Verify Credentials
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            // ADMIN DASHBOARD CONTENT
                            <div className="admin-dashboard-layout">
                                {/* Sidebar of feeds list */}
                                <div className="admin-sidebar">
                                    <div className="sidebar-header">
                                        <div className="sidebar-title">
                                            <h3>Inbox ({filteredFeedbacks.length})</h3>
                                            <button onClick={handleLogout} className="logout-btn" title="Logout">
                                                <LogOut size={16} />
                                            </button>
                                        </div>

                                        {/* Search & Filters */}
                                        <div className="search-bar">
                                            <Search size={14} className="search-icon" />
                                            <input 
                                                type="text" 
                                                placeholder="Search name, email, query..." 
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>

                                        <div className="filter-controls">
                                            <div className="filter-group">
                                                <Filter size={12} />
                                                <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
                                                    <option value="all">All Roles</option>
                                                    <option value="student">Student</option>
                                                    <option value="company_representative">Company Representative</option>
                                                    <option value="hiring_manager_recruiter">Recruiter</option>
                                                    <option value="client">Client</option>
                                                    <option value="developer_professional">Developer</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                            <div className="filter-group">
                                                <Star size={12} />
                                                <select value={filterRating} onChange={(e) => setFilterRating(e.target.value)}>
                                                    <option value="all">All Stars</option>
                                                    <option value="5">5 Stars</option>
                                                    <option value="4">4 Stars</option>
                                                    <option value="3">3 Stars</option>
                                                    <option value="2">2 Stars</option>
                                                    <option value="1">1 Star</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sidebar list items */}
                                    <div className="feedback-items-list scrollable">
                                        {filteredFeedbacks.length === 0 ? (
                                            <div className="empty-state-sidebar">No matching feedback found</div>
                                        ) : (
                                            filteredFeedbacks.map((item) => (
                                                <div 
                                                    key={item._id} 
                                                    className={`feedback-summary-item ${selectedFeedback?._id === item._id ? 'active' : ''} ${item.replies?.length > 0 ? 'replied' : ''}`}
                                                    onClick={() => {
                                                        setSelectedFeedback(item);
                                                        setReplyStatus('');
                                                    }}
                                                >
                                                    <div className="item-meta">
                                                        <span className="role-tag">{item.role.replace('_', ' ')}</span>
                                                        <span className="date-tag">{new Date(item.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <h4 className="item-name">{item.name}</h4>
                                                    <p className="item-excerpt">{item.message}</p>
                                                    <div className="item-foot">
                                                        <div className="stars-row">
                                                            {Array.from({ length: item.rating || 5 }).map((_, i) => (
                                                                <Star key={i} size={12} fill="var(--accent)" stroke="none" />
                                                            ))}
                                                        </div>
                                                        {item.replies?.length > 0 && <span className="reply-count-tag">{item.replies.length} replies</span>}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Active Detail pane */}
                                <div className="admin-detail-pane scrollable">
                                    {selectedFeedback ? (
                                        <div className="detail-pane-content">
                                            <div className="pane-header">
                                                <div>
                                                    <h2>{selectedFeedback.name}</h2>
                                                    <a href={`mailto:${selectedFeedback.email}`} className="email-link">
                                                        <Mail size={14} />
                                                        <span>{selectedFeedback.email}</span>
                                                    </a>
                                                </div>
                                                <div className="header-badges">
                                                    <span className="role-badge-detail">{selectedFeedback.role.replace('_', ' ')}</span>
                                                    <div className="rating-badge-detail">
                                                        <Star size={14} fill="var(--accent)" stroke="none" />
                                                        <span>{selectedFeedback.rating}/5</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="submission-metadata-box">
                                                <h4>Submission Technical Details</h4>
                                                <p>Submitted: <strong>{formatDate(selectedFeedback.createdAt)}</strong></p>
                                                <p>Contact Permission Granted: <strong>{selectedFeedback.contactPermission ? 'Yes ✅' : 'No ❌'}</strong></p>

                                                {/* Role specific logs */}
                                                {selectedFeedback.role === 'student' && selectedFeedback.studentDetails && (
                                                    <div className="meta-sub-box">
                                                        <h5>School: {selectedFeedback.studentDetails.school}</h5>
                                                        <p>Degree: {selectedFeedback.studentDetails.degree} ({selectedFeedback.studentDetails.specialization})</p>
                                                        <p>Graduation: {selectedFeedback.studentDetails.gradYear} | Interest: {selectedFeedback.studentDetails.interestArea}</p>
                                                    </div>
                                                )}

                                                {selectedFeedback.company && (
                                                    <div className="meta-sub-box">
                                                        <h5>Organization: {selectedFeedback.company.name}</h5>
                                                        <p>Designation: {selectedFeedback.company.designation}</p>
                                                        {selectedFeedback.company.website && <p>Website: <a href={selectedFeedback.company.website} target="_blank" rel="noopener noreferrer">{selectedFeedback.company.website}</a></p>}
                                                    </div>
                                                )}

                                                {selectedFeedback.opportunity && (
                                                    <div className="meta-sub-box">
                                                        <h5>Opportunity details:</h5>
                                                        <p>Position: {selectedFeedback.opportunity.position} ({selectedFeedback.opportunity.type || selectedFeedback.opportunity.jobType})</p>
                                                        {selectedFeedback.opportunity.link && <p>Link: <a href={selectedFeedback.opportunity.link} target="_blank" rel="noopener noreferrer">View JD</a></p>}
                                                    </div>
                                                )}

                                                {selectedFeedback.role === 'client' && selectedFeedback.clientDetails && (
                                                    <div className="meta-sub-box">
                                                        <h5>Project details:</h5>
                                                        <p>Organization: {selectedFeedback.clientDetails.organization}</p>
                                                        <p>Timeline: {selectedFeedback.clientDetails.timeline} | Scope: {selectedFeedback.clientDetails.projectType}</p>
                                                        <p>Description: {selectedFeedback.clientDetails.description}</p>
                                                    </div>
                                                )}

                                                {selectedFeedback.role === 'developer_professional' && selectedFeedback.developerDetails && (
                                                    <div className="meta-sub-box">
                                                        <h5>Developer Connection:</h5>
                                                        <p>Organization: {selectedFeedback.developerDetails.organization}</p>
                                                        <p>Expertise: {selectedFeedback.developerDetails.expertise}</p>
                                                        <p>Reason: {selectedFeedback.developerDetails.reason}</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="visitor-message-section">
                                                <h4>Visitor Message</h4>
                                                <blockquote className="visitor-blockquote">
                                                    {selectedFeedback.message}
                                                </blockquote>
                                            </div>

                                            {/* Previous replies */}
                                            {selectedFeedback.replies && selectedFeedback.replies.length > 0 && (
                                                <div className="replies-history-section">
                                                    <h4>Replies History</h4>
                                                    <div className="replies-list">
                                                        {selectedFeedback.replies.map((reply, index) => (
                                                            <div key={index} className="reply-history-card">
                                                                <div className="reply-card-head">
                                                                    <span>Replied on {formatDate(reply.sentAt)}</span>
                                                                </div>
                                                                <p>{reply.message}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Reply Input Form */}
                                            <div className="reply-compose-section">
                                                <h4>Compose Response</h4>
                                                <form onSubmit={handleSendReply} className="reply-form">
                                                    <textarea
                                                        rows="5"
                                                        value={replyText}
                                                        onChange={(e) => setReplyText(e.target.value)}
                                                        placeholder={`Write response to ${selectedFeedback.name}...`}
                                                        required
                                                    ></textarea>
                                                    
                                                    <div className="reply-footer-actions">
                                                        <button 
                                                            type="submit" 
                                                            className="btn btn-primary"
                                                            disabled={sendingReply}
                                                        >
                                                            {sendingReply ? 'Sending Reply...' : 'Send Reply Email'}
                                                            <Send size={16} />
                                                        </button>
                                                    </div>

                                                    {replyStatus && (
                                                        <div className="reply-status-indicator">
                                                            {replyStatus}
                                                        </div>
                                                    )}
                                                </form>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="empty-state-pane">
                                            <MessageSquare size={48} className="empty-icon" />
                                            <h3>No Feedback Selected</h3>
                                            <p>Select a submission from the inbox column to review details and compose replies.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* SITE FOOTER */}
            <footer className="site-footer">
                <div className="footer-container">
                    <p className="copyright">© 2026 Atharv Chavan. Personal Portfolio website.</p>
                    <div className="footer-links">
                        <button 
                            className="footer-admin-link"
                            onClick={() => setCurrentTab(currentTab === 'admin' ? 'portfolio' : 'admin')}
                        >
                            {currentTab === 'admin' ? 'View Portfolio' : 'Admin Login'}
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;
