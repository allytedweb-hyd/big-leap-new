"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./Lmslayout.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StudentData {
  _id: string;
  studentName: string;
  email: string;
  mobileNumber: string;
  [key: string]: unknown;
}

// ─── Nav items ────────────────────────────────────────────────────────────────

const mainNav = [
  {
    label: "Dashboard",
    href: "/lms/dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    label: "My Courses",
    href: "/lms/courses",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      </svg>
    ),
  },

  {
    label: "Live Session",
    href: "/lms/live-session-courses",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
  },
];

const academicsNav = [
  {
    label: "Assignments",
    href: "/lms/assignments",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },

  {
    label: "Certificates",
    href: "/lms/certificates",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
      </svg>
    ),
  },
];



const accountNav = [
  {
    label: "My Profile",
    href: "/lms/profile",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

// ─── NavItem ──────────────────────────────────────────────────────────────────

function NavItem({ item, collapsed }: { item: typeof mainNav[0]; collapsed: boolean }) {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  return (
    <Link
      href={item.href}
      className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
      title={collapsed ? item.label : undefined}
    >
      <span className={styles.navIcon}>{item.icon}</span>
      {!collapsed && <span className={styles.navLabel}>{item.label}</span>}
      {isActive && !collapsed && <span className={styles.activeIndicator} />}
    </Link>
  );
}

// ─── LMS Layout ───────────────────────────────────────────────────────────────

export default function LMSLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [student, setStudent] = useState<StudentData | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("student_token");
    const studentData = localStorage.getItem("student");
    if (!token || !studentData) {
      router.push("/login-page");
      return;
    }
    try {
      setStudent(JSON.parse(studentData));
    } catch {
      router.push("/login-page");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("student_token");
    localStorage.removeItem("student");
    router.push("/login-page");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!student) return null;

  return (
    <div className={styles.lmsLayout}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className={styles.mobileOverlay} onClick={() => setMobileOpen(false)} />
      )}

      {/* ══ SIDEBAR ══ */}
      <aside className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ""} ${mobileOpen ? styles.sidebarMobileOpen : ""}`}>
        {/* Logo */}
        <div className={styles.sidebarLogo}>
          {!collapsed && (
            <img src="/assets/images/Big-leap-logo.png" alt="Big Leap Technologies" className={styles.logoImg} />
          )}
          {/* {collapsed && <span className={styles.logoIcon}>BL</span>} */}
          <button className={styles.collapseBtn} onClick={() => setCollapsed((c) => !c)} title={collapsed ? "Expand" : "Collapse"}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {collapsed ? (
                <><polyline points="9 18 15 12 9 6" /></>
              ) : (
                <><polyline points="15 18 9 12 15 6" /></>
              )}
            </svg>
          </button>
        </div>

        {/* Nav sections */}
        <nav className={styles.sidebarNav}>
          {!collapsed && <span className={styles.navSection}>MAIN</span>}
          {mainNav.map((item) => (
            <NavItem key={item.href} item={item} collapsed={collapsed} />
          ))}

          {!collapsed && <span className={styles.navSection}>ACADEMICS</span>}
          {collapsed && <div className={styles.sectionDivider} />}
          {academicsNav.map((item) => (
            <NavItem key={item.href} item={item} collapsed={collapsed} />
          ))}

     
     

          {!collapsed && <span className={styles.navSection}>ACCOUNT</span>}
          {collapsed && <div className={styles.sectionDivider} />}
          {accountNav.map((item) => (
            <NavItem key={item.href} item={item} collapsed={collapsed} />
          ))}

          {/* Logout */}
          <button className={styles.logoutBtn} onClick={handleLogout} title={collapsed ? "Logout" : undefined}>
            <span className={styles.navIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </span>
            {!collapsed && <span className={styles.navLabel}>Logout</span>}
          </button>
        </nav>

        {/* Student profile at bottom */}
        {!collapsed && (
          <div className={styles.sidebarProfile}>
            <div className={styles.profileAvatar}>{getInitials(student.studentName)}</div>
            <div className={styles.profileInfo}>
              <p className={styles.profileName}>{student.studentName}</p>
              <p className={styles.profileEmail}>{student.email}</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className={styles.sidebarProfileCollapsed}>
            <div className={styles.profileAvatar}>{getInitials(student.studentName)}</div>
          </div>
        )}
      </aside>

      {/* ══ MAIN CONTENT ══ */}
      <div className={`${styles.mainContent} ${collapsed ? styles.mainContentExpanded : ""}`}>
        {/* LMS Top bar */}
     <header className={`${styles.lmsHeader} ${collapsed ? styles.lmsHeaderExpanded : ""}`}>
          {/* Mobile menu button */}
          <button className={styles.mobileMenuBtn} onClick={() => setMobileOpen((o) => !o)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <div className={styles.lmsHeaderLeft}>
            <div className={styles.searchBar}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input type="text" placeholder="Search courses, lessons..." className={styles.searchInput} />
            </div>
          </div>

          <div className={styles.lmsHeaderRight}>
            <button className={styles.headerIconBtn} title="Notifications">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              <span className={styles.notifBadge}>3</span>
            </button>

            <div className={styles.headerProfile}>
              <div className={styles.profileAvatarSm}>{getInitials(student.studentName)}</div>
              <span className={styles.headerProfileName}>{student.studentName.split(" ")[0]}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className={styles.pageContent}>{children}</main>
      </div>
    </div>
  );
}