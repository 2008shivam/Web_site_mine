import { useState, useEffect, useRef } from "react";
import "@/App.css";
import { HashRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { 
  Globe, 
  Smartphone, 
  Server, 
  Monitor, 
  Code2, 
  ShieldCheck, 
  Lock, 
  Zap, 
  CheckCircle2, 
  ChevronRight,
  Menu,
  X,
  Send,
  ArrowRight,
  Target,
  Eye,
  FileCode,
  Activity,
  ClipboardCheck,
  Mail,
  AlertTriangle,
  Home,
  RefreshCw,
  ServerCrash,
  ShieldAlert,
  WifiOff
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";

// Cloudflare Worker URL for Resend email proxy
// Deploy cloudflare-worker.js to Cloudflare Workers and update this URL
const EMAIL_API_URL = process.env.REACT_APP_EMAIL_API_URL || "https://your-worker.your-subdomain.workers.dev";

// Custom Logo Component - Cyber Cube Design
const CyberentLogo = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Outer cube frame */}
    <path 
      d="M20 2L36 11V29L20 38L4 29V11L20 2Z" 
      stroke="#00FF94" 
      strokeWidth="2" 
      fill="none"
    />
    {/* Inner shield */}
    <path 
      d="M20 8L30 14V26L20 32L10 26V14L20 8Z" 
      fill="#00FF94" 
      fillOpacity="0.2"
    />
    {/* Center lock/shield icon */}
    <path 
      d="M20 12L26 16V24L20 28L14 24V16L20 12Z" 
      fill="#00FF94"
    />
    {/* Keyhole */}
    <circle cx="20" cy="18" r="2" fill="#050505"/>
    <rect x="19" y="19" width="2" height="4" fill="#050505"/>
    {/* Corner accents */}
    <circle cx="20" cy="2" r="2" fill="#00FF94"/>
    <circle cx="36" cy="11" r="1.5" fill="#00FF94" fillOpacity="0.5"/>
    <circle cx="36" cy="29" r="1.5" fill="#00FF94" fillOpacity="0.5"/>
    <circle cx="20" cy="38" r="1.5" fill="#00FF94" fillOpacity="0.5"/>
    <circle cx="4" cy="29" r="1.5" fill="#00FF94" fillOpacity="0.5"/>
    <circle cx="4" cy="11" r="1.5" fill="#00FF94" fillOpacity="0.5"/>
  </svg>
);

// Navigation Component
const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      data-testid="main-navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("hero");
            }}
            className="flex items-center gap-3"
            data-testid="logo-link"
          >
            <CyberentLogo size={40} />
            <span className="text-xl font-bold tracking-tight">
              Cyberent<sup className="text-[#00FF94] text-xs">3</sup>
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("services")}
              className="nav-link"
              data-testid="nav-services"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="nav-link"
              data-testid="nav-about"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="btn-cyber text-sm"
              data-testid="nav-contact-cta"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="mobile-menu-toggle"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-white/10" data-testid="mobile-menu">
            <div className="flex flex-col gap-4">
              <button
                onClick={() => scrollToSection("services")}
                className="text-left text-slate-400 hover:text-white py-2"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="text-left text-slate-400 hover:text-white py-2"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="btn-cyber text-sm w-full mt-2"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Hero Section
const HeroSection = () => {
  const [displayText, setDisplayText] = useState("");
  const fullText = "Exponential Security.";
  const typingRef = useRef(null);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 80);
    return () => clearInterval(interval);
  }, []);

  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center grid-bg overflow-hidden"
      data-testid="hero-section"
    >
      {/* Background Orbs */}
      <div className="hero-orb hero-orb-green w-[500px] h-[500px] -top-20 -right-20 absolute" />
      <div className="hero-orb hero-orb-blue w-[400px] h-[400px] bottom-20 -left-20 absolute" />

      {/* Noise overlay */}
      <div className="noise-overlay" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 mb-8">
              <div className="status-dot" />
              <span className="text-sm text-slate-400 font-mono">
                VAPT Services Active
              </span>
            </div>

            <h1 className="hero-title mb-6">
              <span className="text-white">Cyberent</span>
              <sup className="superscript">3</sup>
            </h1>

            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
              {displayText}
              <span className="terminal-cursor" ref={typingRef} />
            </h2>
            <p className="text-xl md:text-2xl text-[#00FF94] font-semibold mb-8">
              Zero Compromise.
            </p>

            <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-xl">
              Elite vulnerability assessment and penetration testing services
              for enterprises that demand excellence. We find the breaches
              before they find you.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={scrollToContact}
                className="btn-cyber flex items-center gap-2"
                data-testid="hero-cta-primary"
              >
                Request Assessment
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("services")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="btn-outline flex items-center gap-2"
                data-testid="hero-cta-secondary"
              >
                View Services
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Right Content - Visual */}
          <div className="hidden lg:block animate-fade-in-up delay-300">
            <div className="relative">
              {/* Terminal Window */}
              <div className="glass p-6 relative overflow-hidden">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-xs text-slate-500 ml-2 font-mono">
                    cyberent_scan.sh
                  </span>
                </div>
                <div className="font-mono text-sm space-y-2">
                  <p className="text-slate-500">$ initiating security scan...</p>
                  <p className="text-[#00FF94]">[✓] Network perimeter analyzed</p>
                  <p className="text-[#00FF94]">[✓] Web application scanned</p>
                  <p className="text-[#00FF94]">[✓] API endpoints tested</p>
                  <p className="text-[#00FF94]">[✓] Mobile app reviewed</p>
                  <p className="text-yellow-500">[!] 23 vulnerabilities found</p>
                  <p className="text-slate-400">
                    $ generating report<span className="animate-pulse">_</span>
                  </p>
                </div>
              </div>

              {/* Floating stats */}
              <div className="absolute -top-4 -right-4 glass p-4 animate-float">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-[#00FF94]" size={24} />
                  <div>
                    <p className="text-2xl font-bold">500+</p>
                    <p className="text-xs text-slate-500">Assessments</p>
                  </div>
                </div>
              </div>

              <div
                className="absolute -bottom-4 -left-4 glass p-4 animate-float"
                style={{ animationDelay: "1s" }}
              >
                <div className="flex items-center gap-3">
                  <Lock className="text-[#3B82F6]" size={24} />
                  <div>
                    <p className="text-2xl font-bold">99.9%</p>
                    <p className="text-xs text-slate-500">Detection Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Services data
const services = [
  {
    id: "web",
    title: "Web Application VAPT",
    description:
      "Comprehensive security assessment of web applications including OWASP Top 10, business logic flaws, and authentication bypass.",
    icon: Globe,
    features: ["OWASP Top 10", "Auth Testing", "Session Management"],
  },
  {
    id: "mobile",
    title: "Mobile Application VAPT",
    description:
      "In-depth security testing for iOS and Android applications, including data storage, network communication, and binary analysis.",
    icon: Smartphone,
    features: ["iOS & Android", "Binary Analysis", "API Security"],
  },
  {
    id: "network",
    title: "Infrastructure/Network VAPT",
    description:
      "Network penetration testing to identify vulnerabilities in servers, firewalls, routers, and cloud infrastructure.",
    icon: Server,
    features: ["Internal/External", "Cloud Security", "Firewall Testing"],
  },
  {
    id: "thick",
    title: "Thick Client VAPT",
    description:
      "Security assessment of desktop applications including memory analysis, DLL injection, and local storage security.",
    icon: Monitor,
    features: ["Memory Analysis", "DLL Security", "Storage Review"],
  },
  {
    id: "api",
    title: "API Security Testing",
    description:
      "Thorough testing of REST, GraphQL, and SOAP APIs for authentication, authorization, and data exposure vulnerabilities.",
    icon: Code2,
    features: ["REST & GraphQL", "OAuth Testing", "Rate Limiting"],
  },
  {
    id: "grc",
    title: "GRC Auditing",
    description:
      "Governance, Risk, and Compliance auditing to ensure your organization meets regulatory requirements and industry standards.",
    icon: ClipboardCheck,
    features: ["ISO 27001", "SOC 2", "GDPR/HIPAA"],
  },
];

// Services Section
const ServicesSection = () => {
  return (
    <section
      id="services"
      className="section-padding bg-[#0A0A0A] relative"
      data-testid="services-section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-[2px] bg-[#00FF94]" />
            <span className="text-sm font-mono text-[#00FF94] uppercase tracking-wider">
              Our Services
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Comprehensive Security
            <br />
            <span className="text-slate-500">Assessment Services</span>
          </h2>
          <p className="text-slate-400 max-w-2xl text-lg">
            We specialize in identifying vulnerabilities across your entire
            digital ecosystem before malicious actors can exploit them.
          </p>
        </div>

        {/* Services Grid - Bento Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`card-cyber p-8 animate-fade-in-up ${
                index === 0 ? "lg:col-span-2" : ""
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
              data-testid={`service-card-${service.id}`}
            >
              <div className="service-icon mb-6 transition-all duration-300">
                <service.icon className="w-6 h-6 text-[#00FF94]" />
              </div>
              <h3 className="text-xl font-bold mb-3">{service.title}</h3>
              <p className="text-slate-400 mb-6 leading-relaxed">
                {service.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {service.features.map((feature) => (
                  <span
                    key={feature}
                    className="text-xs font-mono px-3 py-1 bg-white/5 border border-white/10 text-slate-400"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// About/Features Section
const AboutSection = () => {
  const features = [
    {
      icon: Target,
      title: "Precision Testing",
      description:
        "Methodical approach to uncovering vulnerabilities with zero false positives.",
    },
    {
      icon: Eye,
      title: "Complete Visibility",
      description:
        "Full transparency with detailed reporting and remediation guidance.",
    },
    {
      icon: FileCode,
      title: "Compliance Ready",
      description:
        "Meet SOC2, PCI-DSS, ISO 27001, and HIPAA compliance requirements.",
    },
    {
      icon: Activity,
      title: "Continuous Monitoring",
      description:
        "Ongoing security assessments to maintain your security posture.",
    },
  ];

  return (
    <section
      id="about"
      className="section-padding relative overflow-hidden"
      data-testid="about-section"
    >
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <div className="animate-fade-in-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-[2px] bg-[#00FF94]" />
              <span className="text-sm font-mono text-[#00FF94] uppercase tracking-wider">
                Why Cyberent³
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Exponential Protection
              <br />
              <span className="text-slate-500">for Modern Threats</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              In a world where cyber threats evolve daily, your security needs a
              partner that stays three steps ahead. Our team of certified
              security experts brings decades of combined experience in
              offensive security.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div>
                <p className="text-3xl font-bold text-[#00FF94]">10+</p>
                <p className="text-sm text-slate-500">Years Experience</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#00FF94]">500+</p>
                <p className="text-sm text-slate-500">Assessments Done</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#00FF94]">50+</p>
                <p className="text-sm text-slate-500">Enterprise Clients</p>
              </div>
            </div>

            <button
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="btn-cyber flex items-center gap-2"
              data-testid="about-cta"
            >
              Start Your Assessment
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Right - Features */}
          <div className="space-y-4 animate-fade-in-up delay-200">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="feature-item group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="service-icon flex-shrink-0 group-hover:bg-[#00FF94]/20 transition-colors duration-300">
                  <feature.icon className="w-5 h-5 text-[#00FF94]" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{feature.title}</h4>
                  <p className="text-slate-400 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Contact Section
const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    service_type: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (value) => {
    setFormData((prev) => ({ ...prev, service_type: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(EMAIL_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          service_type: formData.service_type,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Transmission Successful", {
          description: "Your message has been transmitted securely. Our team will respond within 24 hours.",
        });
        
        setFormData({
          name: "",
          company: "",
          email: "",
          service_type: "",
          message: "",
        });
      } else {
        throw new Error(data.error || "Failed to send");
      }
    } catch (error) {
      console.error("Email Error:", error);
      toast.error("Transmission Failed", {
        description: "Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="section-padding bg-[#0A0A0A] relative"
      data-testid="contact-section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left - Info */}
          <div className="animate-fade-in-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-[2px] bg-[#00FF94]" />
              <span className="text-sm font-mono text-[#00FF94] uppercase tracking-wider">
                Contact Us
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Initiate Secure
              <br />
              <span className="text-slate-500">Communication</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Ready to fortify your digital defenses? Our team responds to all
              inquiries within 24 hours. All communications are encrypted and
              handled with the utmost confidentiality.
            </p>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#00FF94]" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Email Us</p>
                  <a href="mailto:hello@cyberentcube.com" className="font-semibold hover:text-[#00FF94] transition-colors">
                    hello@cyberentcube.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-[#00FF94]" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Response Time</p>
                  <p className="font-semibold">Within 24 Hours</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-[#00FF94]" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Communication</p>
                  <p className="font-semibold">End-to-End Encrypted</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Form */}
          <div className="animate-fade-in-up delay-200">
            <div className="terminal-form">
              {/* Terminal Header */}
              <div className="terminal-header">
                <div className="terminal-dot bg-red-500" />
                <div className="terminal-dot bg-yellow-500" />
                <div className="terminal-dot bg-green-500" />
                <span className="text-xs text-slate-500 ml-2 font-mono">
                  secure_transmit.exe
                </span>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5" data-testid="contact-form">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono text-slate-500 mb-2">
                      NAME*
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input-cyber"
                      placeholder="John Doe"
                      data-testid="contact-name-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-500 mb-2">
                      COMPANY
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="input-cyber"
                      placeholder="Acme Corp"
                      data-testid="contact-company-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-500 mb-2">
                    EMAIL*
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input-cyber"
                    placeholder="john@acme.com"
                    data-testid="contact-email-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-500 mb-2">
                    SERVICE TYPE*
                  </label>
                  <Select
                    value={formData.service_type}
                    onValueChange={handleServiceChange}
                    required
                  >
                    <SelectTrigger
                      className="w-full bg-white/[0.03] border-white/10 text-white hover:border-[#00FF94] focus:border-[#00FF94] focus:ring-1 focus:ring-[#00FF94] h-12"
                      data-testid="contact-service-select"
                    >
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0A0A0A] border-white/10">
                      <SelectItem value="web" className="text-white hover:bg-white/10">
                        Web Application VAPT
                      </SelectItem>
                      <SelectItem value="mobile" className="text-white hover:bg-white/10">
                        Mobile Application VAPT
                      </SelectItem>
                      <SelectItem value="network" className="text-white hover:bg-white/10">
                        Infrastructure/Network VAPT
                      </SelectItem>
                      <SelectItem value="thick" className="text-white hover:bg-white/10">
                        Thick Client VAPT
                      </SelectItem>
                      <SelectItem value="api" className="text-white hover:bg-white/10">
                        API Security Testing
                      </SelectItem>
                      <SelectItem value="grc" className="text-white hover:bg-white/10">
                        GRC Auditing
                      </SelectItem>
                      <SelectItem value="multiple" className="text-white hover:bg-white/10">
                        Multiple Services
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-500 mb-2">
                    MESSAGE*
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="input-cyber resize-none"
                    placeholder="Describe your security assessment needs..."
                    data-testid="contact-message-input"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-cyber w-full flex items-center justify-center gap-2 disabled:opacity-50"
                  data-testid="contact-submit-btn"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Transmitting...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Transmit Securely
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#050505] border-t border-white/10 py-12" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <CyberentLogo size={40} />
              <span className="text-xl font-bold tracking-tight">
                Cyberent<sup className="text-[#00FF94] text-xs">3</sup>
              </span>
            </div>
            <p className="text-slate-500 text-sm max-w-sm mb-4">
              Exponential Security. Zero Compromise. Elite VAPT services for
              enterprises that demand excellence.
            </p>
            <p className="text-slate-400 text-sm mb-2">
              <a href="mailto:hello@cyberentcube.com" className="hover:text-[#00FF94] transition-colors">
                hello@cyberentcube.com
              </a>
            </p>
            <div className="flex items-center gap-2">
              <div className="status-dot" />
              <span className="text-xs font-mono text-slate-500">
                All systems operational
              </span>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">
              Services
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#services" className="footer-link">
                  Web Application VAPT
                </a>
              </li>
              <li>
                <a href="#services" className="footer-link">
                  Mobile Application VAPT
                </a>
              </li>
              <li>
                <a href="#services" className="footer-link">
                  Network VAPT
                </a>
              </li>
              <li>
                <a href="#services" className="footer-link">
                  API Security
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="footer-link">
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact" className="footer-link">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-600 text-sm">
            © {currentYear} Cyberent³. All rights reserved.
          </p>
          <p className="text-xs font-mono text-slate-700">
            Securing the digital frontier since 2015
          </p>
        </div>
      </div>
    </footer>
  );
};

// SSL Security Badge Component
const SSLBadge = () => (
  <div className="fixed bottom-24 right-6 z-40" data-testid="ssl-badge">
    <div className="glass px-4 py-2 flex items-center gap-2 animate-fade-in-up">
      <Lock className="w-4 h-4 text-[#00FF94]" />
      <div className="text-xs">
        <p className="text-[#00FF94] font-semibold">SSL Secured</p>
        <p className="text-slate-500">256-bit Encryption</p>
      </div>
    </div>
  </div>
);

// 404 Not Found Page
const NotFoundPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 grid-bg" data-testid="404-page">
      <div className="noise-overlay" />
      <div className="text-center relative z-10 animate-fade-in-up">
        <div className="mb-8">
          <ShieldAlert className="w-24 h-24 text-[#00FF94] mx-auto mb-4 animate-pulse-glow" />
          <h1 className="text-8xl font-bold text-white mb-2">404</h1>
          <div className="w-24 h-1 bg-[#00FF94] mx-auto mb-6" />
        </div>
        
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Access Denied - Page Not Found
        </h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          The requested resource could not be located. This incident has been logged for security analysis.
        </p>
        
        <div className="font-mono text-sm text-slate-600 mb-8 p-4 bg-white/5 border border-white/10 inline-block">
          <p>ERROR_CODE: 404_NOT_FOUND</p>
          <p>TIMESTAMP: {new Date().toISOString()}</p>
          <p>STATUS: RESOURCE_UNAVAILABLE</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="btn-cyber flex items-center gap-2"
            data-testid="404-home-btn"
          >
            <Home size={18} />
            Return to Base
          </button>
          <button
            onClick={() => window.history.back()}
            className="btn-outline flex items-center gap-2"
            data-testid="404-back-btn"
          >
            <ArrowRight size={18} className="rotate-180" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

// 500 Server Error Page
const ServerErrorPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 grid-bg" data-testid="500-page">
      <div className="noise-overlay" />
      <div className="text-center relative z-10 animate-fade-in-up">
        <div className="mb-8">
          <ServerCrash className="w-24 h-24 text-red-500 mx-auto mb-4" />
          <h1 className="text-8xl font-bold text-white mb-2">500</h1>
          <div className="w-24 h-1 bg-red-500 mx-auto mb-6" />
        </div>
        
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Internal Server Error
        </h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          Our systems encountered an unexpected error. Our security team has been notified and is investigating.
        </p>
        
        <div className="font-mono text-sm text-slate-600 mb-8 p-4 bg-white/5 border border-red-500/30 inline-block">
          <p className="text-red-400">ERROR_CODE: 500_INTERNAL_ERROR</p>
          <p>TIMESTAMP: {new Date().toISOString()}</p>
          <p>STATUS: SYSTEM_FAILURE</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => window.location.reload()}
            className="btn-cyber flex items-center gap-2"
            data-testid="500-retry-btn"
          >
            <RefreshCw size={18} />
            Retry Connection
          </button>
          <button
            onClick={() => navigate("/")}
            className="btn-outline flex items-center gap-2"
            data-testid="500-home-btn"
          >
            <Home size={18} />
            Return to Base
          </button>
        </div>
      </div>
    </div>
  );
};

// 403 Forbidden Page
const ForbiddenPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 grid-bg" data-testid="403-page">
      <div className="noise-overlay" />
      <div className="text-center relative z-10 animate-fade-in-up">
        <div className="mb-8">
          <AlertTriangle className="w-24 h-24 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-8xl font-bold text-white mb-2">403</h1>
          <div className="w-24 h-1 bg-yellow-500 mx-auto mb-6" />
        </div>
        
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Access Forbidden
        </h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          You do not have permission to access this resource. This attempt has been logged.
        </p>
        
        <div className="font-mono text-sm text-slate-600 mb-8 p-4 bg-white/5 border border-yellow-500/30 inline-block">
          <p className="text-yellow-400">ERROR_CODE: 403_FORBIDDEN</p>
          <p>TIMESTAMP: {new Date().toISOString()}</p>
          <p>STATUS: ACCESS_DENIED</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="btn-cyber flex items-center gap-2"
            data-testid="403-home-btn"
          >
            <Home size={18} />
            Return to Base
          </button>
        </div>
      </div>
    </div>
  );
};

// Offline/Network Error Page
const OfflinePage = () => {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 grid-bg" data-testid="offline-page">
      <div className="noise-overlay" />
      <div className="text-center relative z-10 animate-fade-in-up">
        <div className="mb-8">
          <WifiOff className="w-24 h-24 text-slate-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-2">Connection Lost</h1>
          <div className="w-24 h-1 bg-slate-500 mx-auto mb-6" />
        </div>
        
        <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
          No Network Connection
        </h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          Please check your internet connection and try again.
        </p>
        
        <div className="font-mono text-sm text-slate-600 mb-8 p-4 bg-white/5 border border-white/10 inline-block">
          <p>STATUS: NETWORK_UNAVAILABLE</p>
          <p>ACTION: CHECK_CONNECTION</p>
        </div>
        
        <button
          onClick={() => window.location.reload()}
          className="btn-cyber flex items-center gap-2 mx-auto"
          data-testid="offline-retry-btn"
        >
          <RefreshCw size={18} />
          Retry Connection
        </button>
      </div>
    </div>
  );
};

// Home Page Component
const HomePage = () => {
  return (
    <>
      <Navigation />
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <ContactSection />
      <Footer />
      <SSLBadge />
    </>
  );
};

// Main App Component
function App() {
  return (
    <div className="App">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#0A0A0A",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            color: "#FFFFFF",
          },
        }}
      />
      <HashRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="/403" element={<ForbiddenPage />} />
          <Route path="/500" element={<ServerErrorPage />} />
          <Route path="/offline" element={<OfflinePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
