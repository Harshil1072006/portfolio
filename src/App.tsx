import { useEffect, useRef, useState, useCallback } from "react";

/* ─────────────────────────── helpers ─────────────────────────── */

function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal,.reveal-left,.reveal-right").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function useCounter(target: number) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      let v = 0;
      const step = Math.max(1, Math.ceil(target / 55));
      const t = setInterval(() => {
        v = Math.min(v + step, target);
        setVal(v);
        if (v >= target) clearInterval(t);
      }, 22);
    }, { threshold: 0.5 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [target]);
  return { val, ref };
}

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const { val, ref } = useCounter(target);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ─────────────────────────── icons (inline svg) ─────────────────────────── */

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
    <path d="M12 2L4 6v5c0 5.25 3.4 10.15 8 11.35C16.6 21.15 20 16.25 20 11V6l-8-4z"
      stroke="currentColor" strokeWidth="1.4" fill="rgba(255,255,255,0.07)" strokeLinejoin="round" />
    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ArrowRight = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);
const DotIcon = ({ color = "currentColor" }: { color?: string }) => (
  <svg className="w-2 h-2" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill={color} /></svg>
);

/* ─────────────────────────── data ─────────────────────────── */

const SKILLS = [
  { label: "Penetration Testing", pct: 75 },
  { label: "Web App Security (OWASP)", pct: 80 },
  { label: "Network Security", pct: 78 },
  { label: "Malware Analysis", pct: 60 },
  { label: "OSINT & Reconnaissance", pct: 72 },
  { label: "Incident Response", pct: 65 },
  { label: "Cloud Security", pct: 55 },
  { label: "Reverse Engineering", pct: 50 },
];

const COMPETENCIES = ["TryHackMe", "OWASP", "PortSwigger", "Burp Suite", "Nmap", "Wireshark", "Metasploit", "Linux", "Python"];

const TOOLS = ["Metasploit", "Burp Suite", "Nmap", "Wireshark", "Kali Linux", "BloodHound", "Impacket", "Nuclei", "OWASP ZAP", "Shodan", "Splunk", "Docker", "AWS", "Python", "Go", "Bash"];

const CRITICAL_INC = [
  { time: "10:21", type: "Brute Force Detected", src: "Metasploitable Lab", status: "Mitigated", badge: "badge-green" },
  { time: "07:55", type: "Privilege Escalation", src: "TryHackMe: Blue", status: "Contained", badge: "badge-orange" },
];
const MEDIUM_INC = [
  { time: "18:12", type: "Malware Upload", src: "FlareVM Lab", status: "Resolved", badge: "badge-green" },
  { time: "06:38", type: "Suspicious Login", src: "TryHackMe: Advent", status: "Contained", badge: "badge-green" },
];
const LOW_INC = [
  { time: "05:45", type: "Phishing Simulation", src: "DVWA Lab", status: "New", badge: "badge-gray" },
  { time: "03:30", type: "Port Scan Completed", src: "Home Lab Network", status: "Completed", badge: "badge-green" },
];

const PROJECTS = [
  { id: "01", cat: "Web Security", title: "OWASP Top 10 Web App Pentest Lab", desc: "Comprehensive vulnerability audit of simulated web targets uncovering SQLi, IDOR, SSRF, and Stored XSS with full remediation playbooks.", tags: ["OWASP Top 10", "Burp Suite", "WebSec"], badge: "Critical", badgeCls: "badge-red", methodology: ["Set up DVWA and Juice Shop in isolated Docker environment", "Manually tested all OWASP Top 10 vulnerabilities", "Documented each finding with PoC payload and impact rating", "Wrote remediation recommendations for each vulnerability class"], tools: ["Burp Suite", "OWASP ZAP", "Docker", "Python"] },
  { id: "02", cat: "Network & AD", title: "Active Directory Attack Path & Privilege Escalation", desc: "Lab simulation analyzing Kerberoasting, AS-REP roasting, BloodHound attack path mapping, and Group Policy hardening.", tags: ["Active Directory", "BloodHound", "Impacket"], badge: "High", badgeCls: "badge-orange", methodology: ["Deployed Windows Server 2019 AD environment in VirtualBox", "Performed Kerberoasting and AS-REP roasting attacks with Impacket", "Used BloodHound to visualize attack paths to Domain Admin", "Applied Group Policy and ACL hardening to remediate findings"], tools: ["BloodHound", "Impacket", "Nmap", "CrackMapExec"] },
  { id: "03", cat: "SOC & Threat Intel", title: "SOC Threat Detection & SIEM Engineering", desc: "Configured real-time Sysmon event ingestion, brute-force alert rules, and automated incident triage workflows.", tags: ["SIEM", "Sysmon", "Threat Hunting"], badge: "Medium", badgeCls: "badge-orange", methodology: ["Deployed Wazuh SIEM and configured Sysmon event logging", "Created custom alert rules for brute-force and lateral movement", "Built automated triage runbooks for common incident types", "Mapped detected events to MITRE ATT&CK framework"], tools: ["Wazuh", "Splunk", "Sysmon", "Elastic Stack", "Python"] },
  { id: "04", cat: "Security Tools", title: "Automated Vulnerability Scanner (Python)", desc: "Multi-threaded reconnaissance tool performing automated port scanning, banner grabbing, and known CVE version checks with HTML reporting.", tags: ["Python", "Nmap", "Automation"], badge: "Tool", badgeCls: "badge-gray", methodology: ["Designed modular scanner architecture with plugin support", "Implemented multi-threaded port scanning and service detection", "Integrated version fingerprinting against CVE database", "Auto-generated HTML reports with severity-color-coded findings"], tools: ["Python", "Nmap", "Requests", "BeautifulSoup", "Jinja2"] },
  { id: "05", cat: "TryHackMe Labs", title: "TryHackMe Offensive & Defensive Lab Series", desc: "Completed 70+ rooms spanning Linux privilege escalation, network packet analysis, and web exploitation with comprehensive writeups.", tags: ["TryHackMe", "PrivEsc", "Forensics"], badge: "Practical", badgeCls: "badge-green", methodology: ["Completed OWASP Top 10, Jr Penetration Tester, and SOC Level 1 paths", "Documented step-by-step writeups for each room and challenge", "Performed Linux and Windows privilege escalation in multiple scenarios", "Practiced network forensics and packet analysis with Wireshark"], tools: ["TryHackMe", "Wireshark", "Nmap", "Metasploit", "Gobuster"] },
  { id: "06", cat: "Open Source Tool", title: "Subdomain Enumeration & Cloud Asset Discovery", desc: "Automated reconnaissance framework querying Certificate Transparency logs, DNS permutations, and detecting exposed cloud storage buckets.", tags: ["OSINT", "Bash", "Cloud Recon"], badge: "OSS", badgeCls: "badge-gray", methodology: ["Built Bash + Python hybrid pipeline for subdomain discovery", "Integrated Certificate Transparency log querying (crt.sh API)", "Added DNS permutation and brute-force capabilities", "Implemented S3 bucket and exposed endpoint detection module"], tools: ["Python", "Bash", "crt.sh API", "Subfinder", "Nuclei"] },
];

const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = new Date().toLocaleString("default", { month: "long" });

/* ─────────────────────────── navbar ─────────────────────────── */

function Navbar({ active }: { active: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Skills", href: "#weaknesses" },
    { label: "Surface", href: "#surface" },
    { label: "Tracker", href: "#tracker" },
    { label: "Projects", href: "#risk", dot: true },
  ];

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(24,24,24,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        padding: scrolled ? "0.75rem 0" : "1.25rem 0",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#home" onClick={(e) => { e.preventDefault(); scrollTo("#home"); }} className="flex items-center gap-2">
          <div className="w-5 h-5 text-white"><ShieldIcon /></div>
          <span className="font-display font-bold text-base tracking-wide text-white">Arfreck</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 bg-white/[0.04] border border-white/[0.08] rounded-full px-6 py-2">
          {links.map((l) => (
            <a key={l.label} href={l.href}
              onClick={(e) => { e.preventDefault(); scrollTo(l.href); }}
              className={`nav-link flex items-center gap-1.5 ${active === l.label.toLowerCase() ? "active" : ""}`}>
              {l.label === "Home" && (
                <svg className="w-3 h-3 opacity-60" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              )}
              {l.dot && <DotIcon color="rgba(255,255,255,0.4)" />}
              {l.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo("#contact"); }} className="btn-dark text-sm py-2 px-5">
            <ArrowRight className="w-3.5 h-3.5" /> Get Started
          </a>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-white p-1" onClick={() => setOpen(!open)}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden px-6 py-4 space-y-3 border-t border-white/[0.06]"
          style={{ background: "rgba(24,24,24,0.97)" }}>
          {links.map((l) => (
            <a key={l.label} href={l.href} className="block nav-link py-1.5" onClick={(e) => { e.preventDefault(); scrollTo(l.href); }}>
              {l.label}
            </a>
          ))}
          <a href="#contact" className="btn-dark inline-flex mt-2" onClick={(e) => { e.preventDefault(); scrollTo("#contact"); }}>Get Started</a>
        </div>
      )}
    </nav>
  );
}

/* ─────────────────────────── modal backdrop ─────────────────────────── */

function ModalBackdrop({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", fn); document.body.style.overflow = ""; };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      {children}
    </div>
  );
}

/* ─────────────────────────── scan modal ─────────────────────────── */

function ScanModal({ onClose, domain }: { onClose: () => void; domain: string }) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const steps = [
    { label: "DNS & WHOIS Resolution", detail: "Resolving nameservers and WHOIS ownership..." },
    { label: "SSL/TLS Certificate Check", detail: "Verifying certificate validity, expiry, and chain..." },
    { label: "Security Headers Analysis", detail: "Checking HSTS, CSP, X-Frame-Options..." },
    { label: "Open Ports Reconnaissance", detail: "Probing common ports 80, 443, 22, 8080..." },
  ];
  useEffect(() => {
    if (step < steps.length) {
      const t = setTimeout(() => setStep((s) => s + 1), 1100);
      return () => clearTimeout(t);
    } else { const t = setTimeout(() => setDone(true), 400); return () => clearTimeout(t); }
  }, [step]);
  return (
    <ModalBackdrop onClose={onClose}>
      <div className="glass rounded-2xl w-full max-w-lg p-6" style={{ border: "1px solid rgba(255,255,255,0.12)" }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="font-mono text-xs text-white/40 mb-1">// SECURITY SCAN</div>
            <div className="font-display font-bold text-white">{domain || "demo-target.example.com"}</div>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white/70 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="space-y-3 mb-5">
          {steps.map((s, i) => (
            <div key={s.label} className="glass rounded-xl p-3">
              <div className="flex items-center gap-3">
                {i < step ? (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.4)" }}>
                    <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                ) : i === step ? (
                  <div className="w-5 h-5 rounded-full border border-white/20 shrink-0 animate-pulse" />
                ) : (
                  <div className="w-5 h-5 rounded-full shrink-0" style={{ border: "1px solid rgba(255,255,255,0.08)" }} />
                )}
                <div>
                  <div className={`font-mono text-xs font-semibold ${i < step ? "text-green-400" : i === step ? "text-white" : "text-white/30"}`}>{s.label}</div>
                  {i === step && <div className="font-mono text-[0.6rem] text-white/40 mt-0.5">{s.detail}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
        {done && (
          <div className="glass rounded-xl p-4" style={{ border: "1px solid rgba(74,222,128,0.2)" }}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-mono text-xs text-white/40">DEMO SECURITY SCORE</div>
                <div className="font-display font-bold text-3xl text-white">82/100 <span className="text-green-400 text-xl">B+</span></div>
              </div>
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "conic-gradient(#4ade80 0% 82%, rgba(255,255,255,0.06) 82%)" }}>
                <div className="w-10 h-10 rounded-full bg-[#1e1e1e] flex items-center justify-center font-mono text-xs text-white font-bold">82%</div>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2"><DotIcon color="#4ade80" /><span className="font-mono text-[0.65rem] text-white/60">SSL certificate valid (expires in 247 days)</span></div>
              <div className="flex items-center gap-2"><DotIcon color="#fb923c" /><span className="font-mono text-[0.65rem] text-white/60">Missing Content-Security-Policy header</span></div>
              <div className="flex items-center gap-2"><DotIcon color="#fb923c" /><span className="font-mono text-[0.65rem] text-white/60">Port 8080 open — verify if intentional</span></div>
              <div className="flex items-center gap-2"><DotIcon color="#4ade80" /><span className="font-mono text-[0.65rem] text-white/60">HSTS enabled with max-age: 31536000</span></div>
            </div>
          </div>
        )}
        {!done && <div className="text-center py-2"><div className="font-mono text-xs text-white/30 animate-pulse">Scanning in progress...</div></div>}
      </div>
    </ModalBackdrop>
  );
}

/* ─────────────────────────── hero ─────────────────────────── */

function Hero() {
  const [typed, setTyped] = useState("");
  const [showScan, setShowScan] = useState(false);
  const [scanDomain, setScanDomain] = useState("");
  const words = ["Penetration Tester", "Security Researcher", "CTF Enthusiast", "Ethical Hacker"];
  const wIdx = useRef(0);
  const cIdx = useRef(0);
  const del = useRef(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const w = words[wIdx.current];
      if (!del.current) {
        cIdx.current++;
        setTyped(w.slice(0, cIdx.current));
        if (cIdx.current === w.length) { del.current = true; timer = setTimeout(tick, 1800); return; }
      } else {
        cIdx.current--;
        setTyped(w.slice(0, cIdx.current));
        if (cIdx.current === 0) { del.current = false; wIdx.current = (wIdx.current + 1) % words.length; }
      }
      timer = setTimeout(tick, del.current ? 55 : 80);
    };
    timer = setTimeout(tick, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleDownload = useCallback(() => {
    const text = `ARFRECK SECURITY — SAMPLE ASSESSMENT REPORT\nGenerated: ${new Date().toLocaleString()}\n\n[CRITICAL] SQL Injection — DVWA Lab | CVSS: 9.8\n[HIGH] Stored XSS — Juice Shop | CVSS: 7.4\n[MEDIUM] Weak Password Policy — Metasploitable | CVSS: 6.5\n\nContact: hello@arfreck.com | TryHackMe: tryhackme.com/p/arfreck`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "Arfreck-Security-Assessment-Sample.txt"; a.click();
    URL.revokeObjectURL(url);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-center pt-20 overflow-hidden grid-bg">
      {showScan && <ScanModal onClose={() => setShowScan(false)} domain={scanDomain} />}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-0 top-0 w-[55%] h-full"
          style={{ background: "radial-gradient(ellipse at 70% 40%, rgba(255,255,255,0.03) 0%, transparent 60%)" }} />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 w-full py-16">
        <div className="grid grid-cols-[auto_1fr_auto] lg:grid-cols-[80px_1fr_420px] gap-6 items-start">
          {/* Left — vertical stats */}
          <div className="flex flex-col gap-8 pt-8 border-r border-white/[0.08] pr-6">
            <div>
              <div className="font-display font-800 text-2xl lg:text-3xl font-bold text-white leading-none">100%</div>
              <div className="font-mono text-[0.6rem] text-white/40 mt-1 leading-snug whitespace-nowrap">Ethical &<br />Hands-On</div>
            </div>
            <div>
              <div className="font-display font-bold text-2xl lg:text-3xl text-white leading-none">50+</div>
              <div className="font-mono text-[0.6rem] text-white/40 mt-1 leading-snug whitespace-nowrap">Security<br />Labs Done</div>
            </div>
          </div>

          {/* Center — main copy */}
          <div className="pl-4 lg:pl-8">
            <div className="font-mono text-xs text-white/40 mb-5 flex items-center gap-2">
              <DotIcon color="rgba(255,255,255,0.4)" />
              <span>{typed}<span className="cursor" /></span>
            </div>
            <h1 className="font-display leading-[1.05] mb-5" style={{ fontSize: "clamp(2.6rem, 5.5vw, 4.2rem)" }}>
              <span className="font-bold text-white">Cyber Security</span><br />
              <span className="font-light text-white/80">Learning Through</span><br />
              <span className="font-bold text-white">Hands-On Practice</span>
            </h1>
            <p className="text-white/50 text-sm leading-relaxed max-w-md mb-10">
              Passionate cybersecurity learner focused on ethical hacking, penetration testing, and building real-world security skills through CTFs and lab environments.
            </p>
            <div className="mb-4">
              <div className="font-mono text-xs text-white/30 mb-2">Run a simulated security scan demo.</div>
              <div className="scan-input max-w-sm">
                <svg className="w-3.5 h-3.5 text-white/30 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input type="text" placeholder="Enter domain or IP address" value={scanDomain}
                  onChange={(e) => setScanDomain(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && setShowScan(true)} />
                <button className="scan-btn" onClick={() => setShowScan(true)}>Run Free Scan</button>
              </div>
            </div>
            <div className="flex items-center gap-6 mt-6">
              <button className="flex items-center gap-1.5 font-mono text-xs text-white/40 hover:text-white/70 transition-colors" onClick={handleDownload}>
                Download Sample Report <ArrowRight className="w-3 h-3" />
              </button>
              <div className="h-4 w-px bg-white/10" />
              <div>
                <div className="font-mono text-[0.6rem] text-white/30">Updated {CURRENT_MONTH} {CURRENT_YEAR}</div>
                <div className="font-mono text-[0.6rem] text-white/20">Active Learner</div>
              </div>
              <button className="flex items-center gap-1 font-mono text-xs text-white/40 hover:text-white/70 transition-colors ml-auto"
                onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}>
                Learn more <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Right — robot visual */}
          <div className="hidden lg:flex flex-col items-end relative">
            <div className="pill-tag mb-4 self-center">OWASP & Network Defense Focus</div>
            <div className="relative w-full" style={{ height: 420 }}>
              <div className="absolute inset-0 animate-float">
                <img src="https://images.unsplash.com/photo-1643345397840-651fc8efd91e?w=420&h=520&fit=crop&crop=top&auto=format"
                  alt="Cybersecurity practitioner" className="w-full h-full object-cover object-top"
                  style={{ borderRadius: "1rem", filter: "grayscale(0.3) brightness(0.85) contrast(1.1)" }} />
                <div className="absolute inset-0 rounded-2xl" style={{ background: "linear-gradient(to bottom, transparent 40%, #181818 100%)" }} />
              </div>
              <div className="absolute bottom-16 left-2 glass rounded-xl px-3 py-2 z-10">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 text-white/70"><ShieldIcon /></div>
                  <div>
                    <div className="font-mono text-[0.6rem] text-white/80 font-semibold">TryHackMe</div>
                    <div className="font-mono text-[0.55rem] text-white/40">Active Practitioner</div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-4 right-2 glass rounded-xl px-3 py-2 z-10">
                <div className="font-mono text-[0.6rem] text-white/60">Hands-On Lab Hardened</div>
                <div className="font-mono text-[0.55rem] text-white/30">Continuous Learning Mode</div>
              </div>
              <div className="absolute top-24 left-6 flex items-center gap-2 z-10">
                <svg className="w-16 h-1.5" viewBox="0 0 64 6"><circle cx="4" cy="3" r="3" fill="rgba(255,255,255,0.4)" /><line x1="7" y1="3" x2="64" y2="3" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4 3" /></svg>
                <svg className="w-3.5 h-3.5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <div className="absolute top-36 right-6 flex items-center gap-2 z-10">
                <svg className="w-3.5 h-3.5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                <svg className="w-16 h-1.5" viewBox="0 0 64 6"><line x1="0" y1="3" x2="57" y2="3" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4 3" /><circle cx="60" cy="3" r="3" fill="rgba(255,255,255,0.4)" /></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Competencies strip */}
        <div className="mt-12 pt-8 border-t border-white/[0.06]">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2 text-white/25 text-xs font-mono whitespace-nowrap">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" /></svg>
              Core Competencies<br />& Security Tooling
            </div>
            {COMPETENCIES.map((p) => (
              <span key={p} className="font-display font-semibold text-sm text-white/25 tracking-wide">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── about ─────────────────────────── */

function About() {
  const [tab, setTab] = useState(0);
  const tabs = [
    { label: "Lab Mastery", n: "01", content: "Extensive hands-on experience in simulated environments like TryHackMe and HackTheBox, tackling real-world scenarios from basic web exploitation to advanced network pivoting." },
    { label: "OWASP Top 10", n: "02", content: "Deep practical knowledge of web vulnerabilities including SQLi, XSS, and CSRF. Proficient with Burp Suite for intercepting traffic, fuzzing, and automating exploit delivery." },
    { label: "Homelab Admin", n: "03", content: "Built and maintain a local virtualization homelab with Active Directory domains, vulnerable web apps, and defensive SIEM/IDS monitoring using Splunk and Wazuh." },
    { label: "CTF Competitions", n: "04", content: "Active participant in capture-the-flag competitions, honing analytical skills in cryptography, reverse engineering, and forensic analysis under time pressure." },
  ];

  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-14 items-start">

          {/* Left — robot + gauge */}
          <div className="reveal-left relative">
            <div className="glass rounded-2xl overflow-hidden p-6 relative" style={{ minHeight: 480 }}>
              {/* Robot image */}
              <div className="relative mb-6 rounded-xl overflow-hidden" style={{ height: 260 }}>
                <img
                  src="https://images.unsplash.com/photo-1698647861553-54943df8212b?w=600&h=340&fit=crop&crop=center&auto=format"
                  alt="Cyber security figure"
                  className="w-full h-full object-cover"
                  style={{ filter: "grayscale(0.4) brightness(0.7)", borderRadius: "0.75rem" }}
                />
                <div className="absolute inset-0 rounded-xl"
                  style={{ background: "linear-gradient(to bottom, transparent 30%, #1e1e1e 100%)" }} />

                {/* Risk index floating card */}
                <div className="absolute top-3 right-3 glass rounded-lg px-3 py-1.5">
                  <div className="font-mono text-[0.6rem] text-white/50">Risk Index</div>
                </div>

                {/* Status badge */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <div className="glass rounded-full px-3 py-1 flex items-center gap-1.5">
                    <DotIcon color="#4ade80" />
                    <span className="font-mono text-[0.6rem] text-white/70">Active</span>
                  </div>
                </div>

                {/* People icon */}
                <div className="absolute bottom-4 left-24 text-white/20">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
              </div>

              {/* Gauge + labels */}
              <div className="flex items-center gap-5">
                {/* Circular gauge */}
                <div className="relative w-24 h-24 shrink-0">
                  <svg viewBox="0 0 96 96" className="w-full h-full -rotate-90">
                    <circle cx="48" cy="48" r="38" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                    <circle cx="48" cy="48" r="38" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="6"
                      strokeDasharray={`${0.8 * 239} 239`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="font-display font-bold text-xl text-white">80%</div>
                    <div className="font-mono text-[0.55rem] text-white/40 mt-0.5">Moderate<br />Risk</div>
                  </div>
                </div>

                {/* Tab nav */}
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2">
                    {tabs.map((t, i) => (
                      <button key={t.n} onClick={() => setTab(i)}
                        className="font-mono text-xs px-3 py-1 rounded-full transition-all duration-200"
                        style={{
                          background: tab === i ? "rgba(255,255,255,0.1)" : "transparent",
                          color: tab === i ? "#ffffff" : "rgba(255,255,255,0.35)",
                          border: `1px solid ${tab === i ? "rgba(255,255,255,0.2)" : "transparent"}`,
                        }}>
                        {t.label} <span className="opacity-40">/{t.n}</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-white/40 text-xs leading-relaxed mt-3">{tabs[tab].content}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — text */}
          <div className="reveal-right">
            <div className="flex items-center justify-between mb-5">
              <span className="section-tag">//My Journey</span>
            </div>

            <h2 className="font-display leading-[1.1] mb-5"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)" }}>
              <span className="font-light text-white/80">Continuous </span>
              <span className="font-bold text-white">Learning &</span>
              <br />
              <span className="font-bold text-white">Skill Building</span>
            </h2>

            <p className="text-white/45 text-sm leading-relaxed mb-6">
              I am dedicated to expanding my cybersecurity knowledge through practical application, constant curiosity, and a commitment to understanding how complex systems break and how to secure them.
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { v: "2+", l: "Years Experience" },
                { v: "30+", l: "Vulnerability Reports & Labs" },
                { v: "350+", l: "CTF & Lab Flags Captured" },
                { v: "20+", l: "Security Tools Mastered" },
              ].map((s) => (
                <div key={s.l} className="glass rounded-xl p-4">
                  <div className="font-display font-bold text-2xl text-white">{s.v}</div>
                  <div className="font-mono text-xs text-white/35 mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>

            <a href="#risk"
              onClick={(e) => { e.preventDefault(); document.getElementById("risk")?.scrollIntoView({ behavior: "smooth" }); }}
              className="btn-dark">
              View Projects <ArrowRight />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── weaknesses / skills ─────────────────────────── */

function SkillBar({ label, pct, delay = 0 }: { label: string; pct: number; delay?: number }) {
  const [filled, setFilled] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setFilled(true); io.disconnect(); } }, { threshold: 0.5 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="mb-5">
      <div className="flex justify-between mb-2">
        <span className="font-display font-medium text-sm text-white">{label}</span>
        <span className="font-mono text-xs text-white/40">{pct}%</span>
      </div>
      <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
        <div className="h-full rounded-full bg-white/70 transition-all duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ width: filled ? `${pct}%` : "0%", transitionDelay: `${delay}ms` }} />
      </div>
    </div>
  );
}

function Weaknesses() {
  return (
    <section id="weaknesses" className="py-24 relative" style={{ background: "rgba(0,0,0,0.25)" }}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-14 reveal">
          <div className="section-tag mb-4 inline-block">// TECHNICAL EXPERTISE</div>
          <h2 className="font-display font-bold mb-3" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)" }}>
            <span className="font-light text-white/70">Skills &amp; </span>Capabilities
          </h2>
          <p className="text-white/40 text-sm max-w-md mx-auto">
            Mastery across the full offensive and defensive security spectrum.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 mb-12">
          <div className="reveal-left">
            {SKILLS.slice(0, 4).map((s, i) => <SkillBar key={s.label} label={s.label} pct={s.pct} delay={i * 80} />)}
          </div>
          <div className="reveal-right">
            {SKILLS.slice(4).map((s, i) => <SkillBar key={s.label} label={s.label} pct={s.pct} delay={i * 80} />)}
          </div>
        </div>

        {/* Tools */}
        <div className="reveal">
          <div className="font-mono text-xs text-white/25 mb-4">// TOOLS & TECHNOLOGIES</div>
          <div className="flex flex-wrap gap-2">
            {TOOLS.map((t) => (
              <span key={t} className="font-mono text-xs px-3 py-1 rounded-full transition-colors duration-200 cursor-default"
                style={{ border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.45)", background: "rgba(255,255,255,0.02)" }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)"; (e.target as HTMLElement).style.color = "rgba(255,255,255,0.8)"; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.target as HTMLElement).style.color = "rgba(255,255,255,0.45)"; }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── surface ─────────────────────────── */

function Surface() {
  return (
    <section id="surface" className="py-24 relative">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-10 reveal flex-wrap gap-4">
          <h2 className="font-display leading-[1.1]" style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)", maxWidth: "480px" }}>
            <span className="font-light text-white/70">Understanding and Mapping<br /></span>
            <span className="font-bold text-white">the Attack Surface</span>
          </h2>
          <div className="flex flex-col items-end gap-2">
            <span className="section-tag">//Attack Surface Map</span>
            <p className="text-white/35 text-xs max-w-[240px] text-right leading-relaxed">
              Learning to map network topologies, identify exposed services, and enumerate vulnerabilities across target systems.
            </p>
          </div>
        </div>

        {/* Main panel */}
        <div className="glass rounded-2xl overflow-hidden reveal">
          <div className="grid lg:grid-cols-[1fr_auto_1fr] min-h-[380px]">

            {/* Left panels */}
            <div className="flex flex-col border-r border-white/[0.06]">
              {[
                { label: "Reconnaissance", desc: "Practicing OSINT, subdomain enumeration, and active scanning to map external perimeters." },
                { label: "Vulnerability Scanning", desc: "Using tools like Nmap and Nessus to detect open ports, outdated software, and misconfigurations." },
              ].map((item, i) => (
                <div key={item.label} className={`flex-1 p-6 flex flex-col justify-center ${i === 0 ? "border-b border-white/[0.06]" : ""}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    <span className="font-display font-semibold text-sm text-white">{item.label}</span>
                  </div>
                  <p className="text-white/35 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Center robot */}
            <div className="relative w-full lg:w-64 xl:w-80 flex items-center justify-center overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1643345397840-651fc8efd91e?w=400&h=420&fit=crop&crop=top&auto=format"
                alt="Security robot"
                className="w-full h-full object-cover"
                style={{ filter: "grayscale(0.2) brightness(0.75)", minHeight: 300 }}
              />
              <div className="absolute inset-0"
                style={{ background: "linear-gradient(to right, #1e1e1e 0%, transparent 15%, transparent 85%, #1e1e1e 100%)" }} />
            </div>

            {/* Right panels */}
            <div className="flex flex-col border-l border-white/[0.06]">
              <div className="flex-1 p-6 flex flex-col justify-center border-b border-white/[0.06]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  <span className="font-display font-semibold text-sm text-white">Exploitation</span>
                </div>
                <p className="text-white/35 text-xs leading-relaxed">
                  Testing identified vulnerabilities in safe lab environments to understand real-world impact.
                </p>
              </div>
              <div className="flex-1 p-6 flex flex-col justify-center">
                <div className="font-display font-bold text-4xl text-white mb-1">500+</div>
                <div className="text-white/35 text-xs leading-relaxed">
                  Lab machines compromised, flags captured, and vulnerabilities patched.
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/[0.06] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 font-mono text-xs text-white/35">
                <DotIcon color="#4ade80" /> Active Learning
              </div>
              <div className="flex items-center gap-2 font-mono text-xs text-white/35">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                CTF Writeups
              </div>
            </div>
            <button className="btn-dark text-xs py-2 px-4" onClick={() => document.getElementById("risk")?.scrollIntoView({ behavior: "smooth" })}>
              View Methodology <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── tracker ─────────────────────────── */

function IncidentModal({ onClose, incident }: { onClose: () => void; incident: { type: string; src: string; time: string; status: string; badge: string; desc?: string } | null }) {
  if (!incident) return null;
  return (
    <ModalBackdrop onClose={onClose}>
      <div className="glass rounded-2xl w-full max-w-md p-6 relative" style={{ border: "1px solid rgba(255,255,255,0.12)" }}>
        <button onClick={onClose} className="absolute top-4 right-4 text-white/30 hover:text-white/70 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <div className="flex items-center gap-2 mb-3">
          <span className={`font-mono text-[0.6rem] px-2 py-0.5 rounded-full ${incident.badge}`}>{incident.status}</span>
          <span className="font-mono text-[0.6rem] text-white/40">{incident.time}</span>
        </div>
        <h3 className="font-display font-bold text-lg text-white mb-1">{incident.type}</h3>
        <p className="font-mono text-xs text-white/40 mb-4">{incident.src}</p>
        <div className="p-3 rounded bg-white/[0.03] border border-white/[0.05] text-white/60 text-xs leading-relaxed">
          {incident.desc || "Investigated logs indicate unauthorized access attempts from this source. Automated SIEM response triggered and connection dropped. No successful exploitation detected."}
        </div>
        <button onClick={onClose} className="w-full btn-white mt-5 justify-center py-2 text-xs">Close Investigation</button>
      </div>
    </ModalBackdrop>
  );
}

function Tracker() {
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportReady, setReportReady] = useState(false);
  const [genInput, setGenInput] = useState("");

  const handleGenerate = () => {
    if (!genInput) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setReportReady(true);
    }, 1500);
  };

  const handleDownloadTemplate = () => {
    const content = "MOCK VULNERABILITY REPORT TEMPLATE\n\nTitle: \nDate: \nSeverity: \nCVSS Score: \n\nDescription:\n\nProof of Concept:\n\nRemediation:\n";
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Arfreck_Vuln_Template.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  const vulns = [
    { id: "HTB-01", type: "SQL Injection", sev: "High", status: "Exploited", date: "Local Lab" },
    { id: "THM-12", type: "IDOR", sev: "Medium", status: "Reported", date: "TryHackMe" },
    { id: "DVWA", type: "Weak Passwords", sev: "Low", status: "Mitigated", date: "DVWA Setup" },
    { id: "HTB-04", type: "XSS Stored", sev: "High", status: "Exploited", date: "HackTheBox" },
  ];
  const sevCls = (s: string) => s === "High" ? "badge-high" : s === "Medium" ? "badge-medium" : "badge-low";

  return (
    <section id="tracker" className="py-24 relative" style={{ background: "rgba(0,0,0,0.2)" }}>
      <IncidentModal incident={selectedIncident} onClose={() => setSelectedIncident(null)} />
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Left — vulnerability report */}
          <div className="reveal-left">
            <span className="section-tag mb-4 inline-block">//Vulnerability Report</span>
            <h2 className="font-display leading-[1.1] mb-3" style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}>
              <span className="font-light text-white/70">Documenting Findings &<br />Vulnerability </span>
              <span className="font-bold text-white">Reports</span>
            </h2>
            <p className="text-white/35 text-sm leading-relaxed mb-6">
              Practicing structured vulnerability documentation, CVSS scoring, and writing clear remediation steps for findings in lab environments.
            </p>

            {/* Score card + table */}
            <div className="glass rounded-2xl overflow-hidden mb-4">
              {/* Score row */}
              <div className="flex items-start gap-4 p-5 border-b border-white/[0.06]">
                <div>
                  <div className="font-display font-bold text-4xl text-white leading-none">
                    <Counter target={100} suffix="%" />
                  </div>
                  <div className="font-mono text-xs text-white/35 mt-1">Reporting Accuracy</div>
                  <div className="font-mono text-[0.6rem] text-white/25 mt-1 max-w-[160px] leading-relaxed">
                    Focusing on clear, actionable, and comprehensive vulnerability reports.
                  </div>
                </div>
                <div className="ml-auto">
                  <button onClick={handleDownloadTemplate} className="flex items-center gap-1.5 font-mono text-xs text-white/40 hover:text-white/70 transition-colors">
                    View Template <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Vuln table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      {["Type", "Severity", "Status", "Platform"].map((h) => (
                        <th key={h} className="text-left px-4 py-2.5 font-mono text-[0.65rem] text-white/25">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {vulns.map((v) => (
                      <tr key={v.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-3 font-display text-xs text-white/80">{v.type}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <ArrowRight className="w-3 h-3" />
                            <span className={`font-mono text-xs font-semibold ${sevCls(v.sev)}`}>{v.sev}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`font-mono text-xs px-2 py-0.5 rounded-full ${v.status === "Exploited" ? "badge-red" : "badge-green"}`}>
                            {v.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-[0.65rem] text-white/30">{v.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="scan-input max-w-xs">
              <svg className="w-3.5 h-3.5 text-white/30 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" placeholder={reportReady ? "Report generated! Download below." : "Generate mock report..."} 
                     value={genInput} onChange={(e) => setGenInput(e.target.value)} disabled={isGenerating || reportReady} />
              {reportReady ? (
                 <button className="scan-btn bg-green-500/20 text-green-400" onClick={() => {setReportReady(false); setGenInput("");}}>Done ✓</button>
              ) : (
                 <button className="scan-btn" onClick={handleGenerate} disabled={isGenerating || !genInput}>
                   {isGenerating ? "Generating..." : "Generate"}
                 </button>
              )}
            </div>
          </div>

          {/* Right — incident monitoring */}
          <div className="reveal-right">
            <span className="section-tag mb-4 inline-block">//Incident Timeline</span>
            <h2 className="font-display leading-[1.1] mb-3" style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}>
              <span className="font-light text-white/70">Simulated SOC Incident </span>
              <span className="font-bold text-white">Monitoring</span>
            </h2>
            <p className="text-white/35 text-sm leading-relaxed mb-6">
              Analyzing log data, motion analysis, and SIEM alerts in controlled lab environments to understand adversary tactics.
            </p>

            <div className="grid grid-cols-3 gap-3">
              {[
                { title: "Critical Incidents", items: CRITICAL_INC, action: "View Details →", isBtn: false },
                { title: "Medium Incidents", items: MEDIUM_INC, action: "Investigate Now", isBtn: true },
                { title: "Low Incidents", items: LOW_INC, action: "View Details →", isBtn: false },
              ].map((col) => (
                <div key={col.title} className="glass rounded-xl overflow-hidden flex flex-col">
                  <div className="px-3 py-2.5 border-b border-white/[0.06]">
                    <span className="font-display font-semibold text-xs text-white">{col.title}</span>
                  </div>
                  <div className="flex-1">
                    {col.items.map((inc, i) => (
                      <div key={i} className={`px-3 py-2.5 ${i < col.items.length - 1 ? "border-b border-white/[0.04]" : ""}`}>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-mono text-[0.6rem] text-white/30">{inc.time}</span>
                          <span className={`font-mono text-[0.55rem] px-1.5 py-0.5 rounded-full ${inc.badge}`}>{inc.status}</span>
                        </div>
                        <div className="font-display text-[0.7rem] font-medium text-white/80 leading-tight">{inc.type}</div>
                        <div className="font-mono text-[0.55rem] text-white/25 mt-0.5">{inc.src}</div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-white/[0.04]">
                    {col.isBtn
                      ? <button onClick={() => setSelectedIncident(col.items[0])} className="w-full btn-dark text-[0.65rem] py-1.5 px-3 justify-center">{col.action}</button>
                      : <button onClick={() => setSelectedIncident(col.items[0])} className="font-mono text-[0.65rem] text-white/30 hover:text-white/60 transition-colors flex items-center gap-1">{col.action}</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── risk / projects ─────────────────────────── */

function ProjectModal({ onClose, project }: { onClose: () => void; project: typeof PROJECTS[0] | null }) {
  if (!project) return null;
  return (
    <ModalBackdrop onClose={onClose}>
      <div className="glass rounded-2xl w-full max-w-2xl p-8 relative overflow-y-auto max-h-[90vh]" style={{ border: "1px solid rgba(255,255,255,0.12)" }}>
        <button onClick={onClose} className="absolute top-6 right-6 text-white/30 hover:text-white/70 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-[0.65rem] text-white/40">/{project.id}</span>
            <span className={`font-mono text-[0.65rem] px-2.5 py-1 rounded-full ${project.badgeCls}`}>{project.badge}</span>
            <span className="font-mono text-[0.65rem] text-white/40">{project.cat}</span>
          </div>
          <h2 className="font-display font-bold text-3xl text-white mb-4">{project.title}</h2>
          <p className="text-white/60 text-sm leading-relaxed">{project.desc}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="font-mono text-xs text-white/30 mb-4">// METHODOLOGY</div>
            <ul className="space-y-3">
              {project.methodology?.map((m, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-white/20 shrink-0" />
                  <span className="text-white/70 text-xs leading-relaxed">{m}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-mono text-xs text-white/30 mb-4">// TOOLS USED</div>
            <div className="flex flex-wrap gap-2">
              {project.tools?.map((t) => (
                <span key={t} className="font-mono text-xs px-2.5 py-1.5 rounded"
                  style={{ border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.02)" }}>
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-8">
              <div className="font-mono text-xs text-white/30 mb-4">// TAGS</div>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((t) => (
                  <span key={t} className="font-mono text-[0.6rem] px-2 py-0.5 rounded"
                    style={{ border: "1px solid rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.3)" }}>
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalBackdrop>
  );
}

function RiskProjects() {
  const [filter, setFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState<typeof PROJECTS[0] | null>(null);
  const cats = ["All", "Web Security", "Network & AD", "SOC & Threat Intel", "Security Tools", "TryHackMe Labs"];
  const shown = filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.cat === filter);

  return (
    <section id="risk" className="py-24 relative">
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div className="reveal">
            <span className="section-tag mb-3 inline-block">//Risk Analysis</span>
            <h2 className="font-display leading-tight" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)" }}>
              <span className="font-light text-white/70">Security </span>
              <span className="font-bold text-white">Case Studies</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-2 reveal">
            {cats.map((c) => (
              <button key={c} onClick={() => setFilter(c)}
                className="font-mono text-[0.65rem] px-3 py-1.5 rounded-full transition-all duration-200"
                style={{
                  background: filter === c ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${filter === c ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.07)"}`,
                  color: filter === c ? "#ffffff" : "rgba(255,255,255,0.35)",
                }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shown.map((p, i) => (
            <div key={p.id} onClick={() => setSelectedProject(p)} className="reveal glass rounded-2xl p-5 flex flex-col group cursor-pointer transition-all duration-300 hover:-translate-y-1"
              style={{ transitionDelay: `${i * 60}ms` }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[0.6rem] text-white/25">/{p.id}</span>
                <span className={`font-mono text-[0.6rem] px-2 py-0.5 rounded-full ${p.badgeCls}`}>{p.badge}</span>
              </div>
              <div className="font-mono text-[0.65rem] text-white/35 mb-1.5">{p.cat}</div>
              <h3 className="font-display font-bold text-base text-white mb-2.5">{p.title}</h3>
              <p className="text-white/35 text-xs leading-relaxed flex-1 mb-4">{p.desc}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {p.tags.map((t) => (
                  <span key={t} className="font-mono text-[0.6rem] px-2 py-0.5 rounded"
                    style={{ border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)" }}>
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-end pt-3 border-t border-white/[0.06]">
                <span className="font-mono text-[0.65rem] text-white/25 group-hover:text-white/50 transition-colors flex items-center gap-1">
                  View Details <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── footer CTA + footer ─────────────────────────── */

function FooterCTA() {
  return (
    <section className="py-20 relative" style={{ background: "rgba(0,0,0,0.3)" }}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="glass rounded-2xl overflow-hidden reveal">
          <div className="relative" style={{ minHeight: 280 }}>
            <img
              src="https://images.unsplash.com/photo-1590859808308-3d2d9c515b1a?w=1200&h=280&fit=crop&auto=format"
              alt="Security background"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: "brightness(0.2) grayscale(0.4)" }}
            />
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between p-10 gap-6">
              <div>
                <h2 className="font-display font-bold text-3xl text-white mb-3">
                  Stronger Protection<br />for a <span className="font-light text-white/70">Safer Future</span>
                </h2>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <DotIcon color="rgba(255,255,255,0.4)" />
                    <span className="font-mono text-xs text-white/40">Data Protection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DotIcon color="rgba(255,255,255,0.4)" />
                    <span className="font-mono text-xs text-white/40">Threat Detection</span>
                  </div>
                </div>
              </div>
              <a href="#contact" className="btn-white shrink-0">
                Get Started <ArrowRight />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", msg: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [cryptoStep, setCryptoStep] = useState(0);
  const cryptoSteps = ["Generating SHA-256 hash...", "Encrypting payload...", "Establishing secure tunnel...", "Message dispatched securely ✓"];

  const sub = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setCryptoStep(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setCryptoStep(step);
      if (step >= cryptoSteps.length - 1) {
        clearInterval(interval);
        setTimeout(() => { setSending(false); setSent(true); setTimeout(() => setSent(false), 3500); setForm({ name: "", email: "", msg: "" }); }, 700);
      }
    }, 600);
  };
  const input = "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/20 transition-colors font-display";

  return (
    <section id="contact" className="py-24 relative">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="reveal-left">
            <span className="section-tag mb-4 inline-block">//Get In Touch</span>
            <h2 className="font-display font-bold mb-5" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)" }}>
              <span className="font-light text-white/70">Let's Connect &<br /></span>
              <span className="font-bold text-white">Collaborate</span>
            </h2>
            <p className="text-white/40 text-sm leading-relaxed mb-8">
              Interested in collaborating on security projects, CTFs, or discussing cybersecurity? Feel free to reach out!
            </p>
            <div className="space-y-4">
              {[
                { icon: "📧", l: "Email", v: "hello@arfreck.com", href: "mailto:hello@arfreck.com" },
                { icon: "💼", l: "LinkedIn", v: "linkedin.com/in/arfreck", href: "https://linkedin.com/in/arfreck" },
                { icon: "🐙", l: "GitHub", v: "github.com/arfreck", href: "https://github.com/arfreck" },
                { icon: "🎯", l: "TryHackMe", v: "tryhackme.com/p/arfreck", href: "https://tryhackme.com/p/arfreck" },
              ].map((c) => (
                <div key={c.l}
                  className="glass rounded-xl p-4 flex items-center gap-4 hover:bg-white/[0.04] transition-colors cursor-pointer"
                  onClick={() => window.open(c.href, c.href.startsWith("mailto") ? "_self" : "_blank")}>
                  <span>{c.icon}</span>
                  <div>
                    <div className="font-mono text-[0.65rem] text-white/30">{c.l}</div>
                    <div className="font-display font-medium text-sm text-white/80">{c.v}</div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-white/20 ml-auto" />
                </div>
              ))}
            </div>
          </div>

          <div className="reveal-right">
            <div className="glass rounded-2xl p-7">
              <div className="font-mono text-xs text-white/25 mb-5">//Send a Message</div>
              {sent ? (
                <div className="text-center py-10">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                    style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)" }}>
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="font-display font-bold text-lg text-white mb-1">Message Sent!</div>
                  <div className="font-mono text-xs text-white/35">Thanks — I'll get back to you soon.</div>
                </div>
              ) : sending ? (
                <div className="text-center py-10">
                  <div className="font-mono text-xs space-y-2">
                    {cryptoSteps.slice(0, cryptoStep + 1).map((s, i) => (
                      <div key={i} className="text-green-400">{s}</div>
                    ))}
                  </div>
                </div>
              ) : (
                <form onSubmit={sub} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-mono text-[0.65rem] text-white/25 mb-1.5 block">NAME</label>
                      <input type="text" placeholder="John Doe" value={form.name} required
                        onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} />
                    </div>
                    <div>
                      <label className="font-mono text-[0.65rem] text-white/25 mb-1.5 block">EMAIL</label>
                      <input type="email" placeholder="you@domain.com" value={form.email} required
                        onChange={(e) => setForm({ ...form, email: e.target.value })} className={input} />
                    </div>
                  </div>
                  <div>
                    <label className="font-mono text-[0.65rem] text-white/25 mb-1.5 block">MESSAGE</label>
                    <textarea rows={5} placeholder="What would you like to discuss?" value={form.msg} required
                      onChange={(e) => setForm({ ...form, msg: e.target.value })} className={input + " resize-none"} />
                  </div>
                  <button type="submit" className="btn-white w-full justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return visible ? (
    <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
      style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}>
      <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  ) : null;
}

function Footer() {
  return (
    <footer className="pt-12 pb-8 border-t border-white/[0.06]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-4 text-white"><ShieldIcon /></div>
              <span className="font-display font-bold text-sm text-white tracking-wide">Arfreck</span>
            </div>
            <p className="text-white/30 text-xs leading-relaxed max-w-[200px]">
              Aspiring cybersecurity professional building skills through ethical hacking, CTFs, and hands-on lab environments.
            </p>
          </div>
          {[
            { title: "Skills", links: ["Penetration Testing", "Web App Security", "Network Security", "OSINT & Recon"] },
            { title: "Resources", links: ["TryHackMe Profile", "Case Studies", "GitHub", "CTF Writeups"] },
            { title: "Connect", links: ["About", "GitHub", "LinkedIn", "Contact"] },
            { title: "Legal", links: ["Privacy Policy", "Cookie Policy", "Terms of Service"] },
          ].map((col) => (
            <div key={col.title}>
              <div className="font-display font-semibold text-sm text-white mb-3">{col.title}</div>
              <ul className="space-y-2">
                {col.links.map((l) => {
                  const href =
                    l === "TryHackMe Profile" ? "https://tryhackme.com/p/arfreck" :
                    l === "GitHub" ? "https://github.com/arfreck" :
                    l === "LinkedIn" ? "https://linkedin.com/in/arfreck" :
                    l === "Contact" ? "#contact" :
                    l === "About" ? "#about" : "#";
                  return (
                    <li key={l}><a href={href}
                      onClick={(e) => { if (href.startsWith("http")) { e.preventDefault(); window.open(href, "_blank"); } else if (href.startsWith("#")) { e.preventDefault(); document.querySelector(href)?.scrollIntoView({ behavior: "smooth" }); } }}
                      className="font-mono text-xs text-white/30 hover:text-white/60 transition-colors">{l}</a></li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="h-px bg-white/[0.06] mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-mono text-xs text-white/20">© {CURRENT_YEAR} Arfreck. All rights reserved.</span>
          <div className="flex gap-5">
            {[
              { label: "GitHub", href: "https://github.com/arfreck" },
              { label: "LinkedIn", href: "https://linkedin.com/in/arfreck" },
              { label: "Twitter", href: "https://twitter.com/arfreck" },
              { label: "TryHackMe", href: "https://tryhackme.com/p/arfreck" },
            ].map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                className="font-mono text-xs text-white/25 hover:text-white/50 transition-colors">{s.label}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────── app root ─────────────────────────── */

export default function App() {
  const [active, setActive] = useState("home");
  useReveal();

  useEffect(() => {
    const ids = ["home", "about", "weaknesses", "surface", "tracker", "risk", "contact"];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { threshold: 0.25 }
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#181818", minHeight: "100%" }}>
      <Navbar active={active} />
      <Hero />
      <About />
      <Weaknesses />
      <Surface />
      <Tracker />
      <RiskProjects />
      <FooterCTA />
      <Contact />
      <Footer />
      <BackToTop />
    </div>
  );
}
