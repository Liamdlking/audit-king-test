import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient, type Session, type User as SbUser } from "@supabase/supabase-js";
import {
  Crown,
  LogIn,
  LogOut,
  FileText,
  ClipboardList,
  AlertTriangle,
  Building2,
  Users,
  CheckCircle2,
  Plus,
  Upload,
  Save,
  Search
} from "lucide-react";

/**
 * AUDIT KING — APP SHELL (Block 3)
 * - Blue+Gold branded landing/login
 * - Email+Password login only (no sign-up UI)
 * - Dashboard and top nav tabs
 * - Placeholder pages (Templates / Inspections / Actions / Sites / Users)
 * - Ready for wiring to Supabase tables & API routes in Block 4+
 *
 * Env required:
 *  - VITE_SUPABASE_URL
 *  - VITE_SUPABASE_ANON_KEY
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

type Role = "admin" | "manager" | "inspector";
type NavTab = "dashboard" | "templates" | "inspections" | "actions" | "sites" | "users";

interface Profile {
  user_id: string;
  email?: string;
  name?: string;
  role: Role;
  is_admin: boolean;
  is_banned: boolean;
  site_access: string[] | null;
}

function AuditKingLogo({ size = 28 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <img src="/logo-crown.png" width={size} height={size} alt="Audit King" />
      <span className="font-extrabold text-xl tracking-tight text-white drop-shadow-sm">
        Audit <span className="text-yellow-300">King</span>
      </span>
    </div>
  );
}

function Topbar({
  onNav,
  current,
  userEmail,
  onLogout,
  isAdmin
}: {
  onNav: (t: NavTab) => void;
  current: NavTab;
  userEmail?: string | null;
  onLogout: () => void;
  isAdmin: boolean;
}) {
  const TabBtn = ({
    id,
    label
  }: {
    id: NavTab;
    label: string;
  }) => (
    <button
      onClick={() => onNav(id)}
      className={`px-3 py-2 rounded-xl text-sm font-medium transition ${
        current === id
          ? "bg-white/90 text-royal-600 shadow"
          : "text-white/90 hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );

  return (
    <header className="sticky top-0 z-30">
      <div className="bg-[linear-gradient(135deg,#1e3a8a_0%,#fbbf24_100%)]">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <AuditKingLogo />
          <nav className="ml-4 hidden md:flex items-center gap-1">
            <TabBtn id="dashboard" label="Dashboard" />
            <TabBtn id="templates" label="Templates" />
            <TabBtn id="inspections" label="Inspections" />
            <TabBtn id="actions" label="Actions" />
            <TabBtn id="sites" label="Sites" />
            {isAdmin && <TabBtn id="users" label="Users" />}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            {userEmail ? (
              <>
                <span className="hidden sm:block text-white/90 text-sm">{userEmail}</span>
                <button
                  onClick={onLogout}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition text-sm"
                  title="Logout"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>
      <div className="bg-white/70 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-2 md:hidden">
          <div className="flex flex-wrap gap-2">
            <button onClick={() => onNav("dashboard")} className={`px-3 py-1.5 rounded-lg text-sm ${current === "dashboard" ? "bg-royal-600 text-white" : "bg-white border"}`}>Dashboard</button>
            <button onClick={() => onNav("templates")} className={`px-3 py-1.5 rounded-lg text-sm ${current === "templates" ? "bg-royal-600 text-white" : "bg-white border"}`}>Templates</button>
            <button onClick={() => onNav("inspections")} className={`px-3 py-1.5 rounded-lg text-sm ${current === "inspections" ? "bg-royal-600 text-white" : "bg-white border"}`}>Inspections</button>
            <button onClick={() => onNav("actions")} className={`px-3 py-1.5 rounded-lg text-sm ${current === "actions" ? "bg-royal-600 text-white" : "bg-white border"}`}>Actions</button>
            <button onClick={() => onNav("sites")} className={`px-3 py-1.5 rounded-lg text-sm ${current === "sites" ? "bg-royal-600 text-white" : "bg-white border"}`}>Sites</button>
            {isAdmin && <button onClick={() => onNav("users")} className={`px-3 py-1.5 rounded-lg text-sm ${current === "users" ? "bg-royal-600 text-white" : "bg-white border"}`}>Users</button>}
          </div>
        </div>
      </div>
    </header>
  );
}

function Landing({
  onLogin
}: {
  onLogin: (email: string, password: string) => Promise<void>;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setBusy(true);
    try {
      await onLogin(email, password);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#1e3a8a_0%,#fbbf24_100%)] text-white">
      <div className="max-w-6xl mx-auto px-4 py-14">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo-crown.png" alt="Audit King" className="h-10 w-10" />
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Audit <span className="text-yellow-300">King</span>
              </h1>
            </div>
            <p className="text-white/90 text-lg md:text-xl max-w-xl">
              Smarter, safer audits — powered by <span className="font-semibold">Audit King</span>.
              Create templates, run inspections, manage actions, and stay on top across multiple sites.
            </p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FeatureCard icon={<FileText />} title="Create Templates" text="Build checklists with Yes/No, Good/Fair/Poor, multiple-choice, photos and signatures." />
              <FeatureCard icon={<ClipboardList />} title="Run Inspections" text="Save in-progress, add notes & images, export to PDF, collaborate safely." />
              <FeatureCard icon={<AlertTriangle />} title="Manage Actions" text="Track issues with priority, status & ownership to closure." />
              <FeatureCard icon={<Building2 />} title="Multi-site" text="Assign users & templates per site and filter results instantly." />
            </div>
          </div>
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 180, damping: 20 }}
            className="w-full max-w-sm"
          >
            <form onSubmit={submit} className="bg-white/95 rounded-2xl shadow-xl p-5 text-gray-800">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <LogIn className="text-royal-600" /> Sign in
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Email & password only. New accounts are created by admins.
              </p>
              <label className="text-xs text-gray-600">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border px-3 py-2 mb-3"
                placeholder="you@company.com"
                required
              />
              <label className="text-xs text-gray-600">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border px-3 py-2 mb-4"
                placeholder="••••••••"
                required
              />
              <button
                type="submit"
                disabled={busy}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-royal-600 text-white px-3 py-2 hover:bg-royal-500 transition disabled:opacity-60"
              >
                <LogIn size={16} />
                {busy ? "Signing in…" : "Sign in"}
              </button>
              <div className="text-xs text-gray-500 mt-3">
                Trouble signing in? Ask an admin to reset your password.
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  text
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="bg-white/10 rounded-2xl p-4 backdrop-blur border border-white/20">
      <div className="text-yellow-200">{icon}</div>
      <div className="mt-2 font-semibold">{title}</div>
      <div className="text-sm text-white/90">{text}</div>
    </div>
  );
}

function Dashboard({ go }: { go: (t: NavTab) => void }) {
  const Card = ({
    icon,
    title,
    text,
    tab
  }: {
    icon: React.ReactNode;
    title: string;
    text: string;
    tab: NavTab;
  }) => (
    <button
      onClick={() => go(tab)}
      className="text-left rounded-2xl border bg-white hover:bg-gray-50 transition shadow-sm p-5"
    >
      <div className="text-royal-600">{icon}</div>
      <div className="mt-2 font-semibold">{title}</div>
      <div className="text-sm text-gray-600">{text}</div>
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-3">Welcome to Audit King</h2>
      <p className="text-gray-600 mb-6">
        Choose a section to get started. Data wiring to Supabase is added in the next step.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card icon={<FileText />} title="Templates" text="Create and publish templates." tab="templates" />
        <Card icon={<ClipboardList />} title="Inspections" text="Run and review inspections." tab="inspections" />
        <Card icon={<AlertTriangle />} title="Actions" text="Track corrective actions." tab="actions" />
        <Card icon={<Building2 />} title="Sites" text="Manage locations and access." tab="sites" />
        <Card icon={<Users />} title="Users" text="Invite, assign roles & sites (admin)." tab="users" />
      </div>
    </div>
  );
}

/** Placeholder pages — these will be replaced with full CRUD + storage in Block 4+ */
function TemplatesPage() {
  const [q, setQ] = useState("");
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Templates</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search templates…"
              className="rounded-xl border pl-9 pr-3 py-2 text-sm"
            />
          </div>
          <button className="inline-flex items-center gap-2 rounded-xl bg-royal-600 text-white px-3 py-2 text-sm">
            <Plus size={16} /> New Template
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm">
            <Upload size={16} /> Import PDF
          </button>
        </div>
      </div>
      <div className="text-gray-500">Templates list will appear here once wired to Supabase.</div>
    </div>
  );
}

function InspectionsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-3">Inspections</h2>
      <div className="text-gray-500">Submitted and in-progress inspections will show here.</div>
    </div>
  );
}
function ActionsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-3">Actions</h2>
      <div className="text-gray-500">Track and manage corrective actions here.</div>
    </div>
  );
}
function SitesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-3">Sites</h2>
      <div className="text-gray-500">Create sites and assign templates/users per site.</div>
    </div>
  );
}
function UsersPage({ isAdmin }: { isAdmin: boolean }) {
  if (!isAdmin) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-semibold mb-2">Users</h2>
        <div className="text-rose-600">Not authorised. Admins only.</div>
      </div>
    );
  }
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-3">Users (Admin)</h2>
      <div className="text-gray-500">Invite, ban/unban, delete, assign roles & sites (wired next block).</div>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tab, setTab] = useState<NavTab>("dashboard");
  const [bootError, setBootError] = useState<string | null>(null);

  const isAdmin = !!profile?.is_admin;

  // Boot: fetch session and profile (if Supabase configured)
  useEffect(() => {
    const boot = async () => {
      if (!supabase) {
        setBootError("Supabase keys not set. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
        return;
      }
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      // Profile fetch (if already logged in)
      if (data.session?.user) {
        await loadProfile(data.session.user);
      }
      supabase.auth.onAuthStateChange((_event, s) => {
        setSession(s ?? null);
        if (s?.user) loadProfile(s.user);
        else setProfile(null);
      });
    };
    boot();
  }, []);

  async function loadProfile(user: SbUser) {
    try {
      // Profiles table will be created in supabase.sql (Block 6). For now, default to non-admin if not present.
      const { data, error } = await supabase!
        .from("profiles")
        .select("user_id, email, name, role, is_admin, is_banned, site_access")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        // If table not ready yet, avoid blocking the app — assume inspector.
        setProfile({
          user_id: user.id,
          email: user.email ?? "",
          name: (user.user_metadata as any)?.name ?? "",
          role: "inspector",
          is_admin: false,
          is_banned: false,
          site_access: []
        });
        return;
      }

      if (!data) {
        // No row yet — default non-admin until admin promotes via SQL/API
        setProfile({
          user_id: user.id,
          email: user.email ?? "",
          name: (user.user_metadata as any)?.name ?? "",
          role: "inspector",
          is_admin: false,
          is_banned: false,
          site_access: []
        });
      } else {
        setProfile(data as Profile);
      }
    } catch {
      setProfile({
        user_id: user.id,
        email: user.email ?? "",
        name: (user.user_metadata as any)?.name ?? "",
        role: "inspector",
        is_admin: false,
        is_banned: false,
        site_access: []
      });
    }
  }

  async function login(email: string, password: string) {
    if (!supabase) {
      alert("Supabase not configured. Add env keys and redeploy.");
      return;
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
      return;
    }
    setSession(data.session);
    if (data.session?.user) await loadProfile(data.session.user);
    // go straight to dashboard
    setTab("dashboard");
  }

  async function logout() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
    setTab("dashboard");
  }

  // Landing if no session
  if (!session) {
    return <Landing onLogin={login} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar
        onNav={setTab}
        current={tab}
        userEmail={profile?.email ?? session.user?.email ?? ""}
        onLogout={logout}
        isAdmin={isAdmin}
      />

      <main>
        {bootError ? (
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="rounded-xl border border-amber-300 bg-amber-50 text-amber-800 p-3 text-sm">
              {bootError}
            </div>
          </div>
        ) : null}

        <AnimatePresence mode="wait">
          {tab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <Dashboard go={setTab} />
            </motion.div>
          )}
          {tab === "templates" && (
            <motion.div key="templates" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <TemplatesPage />
            </motion.div>
          )}
          {tab === "inspections" && (
            <motion.div key="inspections" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <InspectionsPage />
            </motion.div>
          )}
          {tab === "actions" && (
            <motion.div key="actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ActionsPage />
            </motion.div>
          )}
          {tab === "sites" && (
            <motion.div key="sites" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SitesPage />
            </motion.div>
          )}
          {tab === "users" && (
            <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <UsersPage isAdmin={isAdmin} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t mt-8 bg-white/70">
        <div className="max-w-6xl mx-auto px-4 py-3 text-xs text-gray-500 flex items-center gap-2">
          <Crown size={14} className="text-royal-600" />
          Audit King — © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
