import { useEffect, useMemo, useState, useCallback, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════
   MERCHANT POOL — 25 realistic merchants across 7 categories
   ═══════════════════════════════════════════════════════════════ */

const MERCHANT_POOL = [
  { name: "Blue Bottle Coffee", emoji: "☕", category: "Food & Drink", min: 4.50, max: 18.00 },
  { name: "Whole Foods Market", emoji: "🥬", category: "Groceries", min: 25.00, max: 120.00 },
  { name: "Uber Ride", emoji: "🚗", category: "Transport", min: 8.00, max: 45.00 },
  { name: "Spotify Premium", emoji: "🎵", category: "Entertainment", min: 10.99, max: 10.99 },
  { name: "Amazon.com", emoji: "📦", category: "Shopping", min: 15.00, max: 89.00 },
  { name: "Netflix", emoji: "🎬", category: "Entertainment", min: 15.49, max: 15.49 },
  { name: "Starbucks", emoji: "☕", category: "Food & Drink", min: 5.00, max: 12.00 },
  { name: "Shell Gas Station", emoji: "⛽", category: "Transport", min: 35.00, max: 75.00 },
  { name: "Target", emoji: "🎯", category: "Shopping", min: 20.00, max: 95.00 },
  { name: "Chipotle", emoji: "🌯", category: "Food & Drink", min: 12.00, max: 22.00 },
  { name: "Apple Store", emoji: "🍎", category: "Shopping", min: 29.00, max: 199.00 },
  { name: "CVS Pharmacy", emoji: "💊", category: "Health", min: 8.00, max: 35.00 },
  { name: "Subway", emoji: "🥪", category: "Food & Drink", min: 7.00, max: 15.00 },
  { name: "Steam", emoji: "🎮", category: "Entertainment", min: 19.99, max: 59.99 },
  { name: "Nike Store", emoji: "👟", category: "Shopping", min: 45.00, max: 180.00 },
  { name: "DoorDash", emoji: "🍔", category: "Food & Drink", min: 18.00, max: 55.00 },
  { name: "Lyft", emoji: "🚙", category: "Transport", min: 9.00, max: 42.00 },
  { name: "Best Buy", emoji: "📺", category: "Shopping", min: 25.00, max: 299.00 },
  { name: "Trader Joe's", emoji: "🛒", category: "Groceries", min: 18.00, max: 85.00 },
  { name: "Planet Fitness", emoji: "💪", category: "Health", min: 29.00, max: 79.00 },
  { name: "Dunkin' Donuts", emoji: "🍩", category: "Food & Drink", min: 4.00, max: 11.00 },
  { name: "Costco", emoji: "🏪", category: "Groceries", min: 45.00, max: 250.00 },
  { name: " AMC Theatres", emoji: "🍿", category: "Entertainment", min: 14.00, max: 32.00 },
  { name: "Uber Eats", emoji: "🥡", category: "Food & Drink", min: 16.00, max: 48.00 },
  { name: "Sephora", emoji: "💄", category: "Shopping", min: 22.00, max: 95.00 },
  { name: "PetSmart", emoji: "🐾", category: "Shopping", min: 15.00, max: 65.00 },
];

const CATEGORY_META = {
  "Food & Drink": { color: "#f59e0b", accent: "amber" },
  "Groceries": { color: "#10b981", accent: "emerald" },
  "Transport": { color: "#3b82f6", accent: "blue" },
  "Entertainment": { color: "#8b5cf6", accent: "violet" },
  "Shopping": { color: "#ec4899", accent: "pink" },
  "Health": { color: "#14b8a6", accent: "teal" },
};

/* ═══════════════════════════════════════════════════════════════
   ACHIEVEMENTS SYSTEM
   ═══════════════════════════════════════════════════════════════ */

const ACHIEVEMENTS = [
  {
    id: "first_save",
    title: "First Save",
    description: "Save money for the first time",
    icon: "🌱",
    condition: (s) => s.totalSaved > 0,
  },
  {
    id: "streak_3",
    title: "On Fire",
    description: "Admit 3 wants in a row",
    icon: "🔥",
    condition: (s) => s.bestStreak >= 3,
  },
  {
    id: "streak_5",
    title: "Unstoppable",
    description: "Admit 5 wants in a row",
    icon: "⚡",
    condition: (s) => s.bestStreak >= 5,
  },
  {
    id: "big_saver",
    title: "Big Saver",
    description: "Save over $50 total",
    icon: "💰",
    condition: (s) => s.totalSaved >= 50,
  },
  {
    id: "heavy_hitter",
    title: "Heavy Hitter",
    description: "Save over $150 total",
    icon: "🏆",
    condition: (s) => s.totalSaved >= 150,
  },
  {
    id: "explorer",
    title: "Explorer",
    description: "Use 5 different categories",
    icon: "🧭",
    condition: (s) => Object.keys(s.categories).length >= 5,
  },
  {
    id: "high_roller",
    title: "High Roller",
    description: "Make a transaction over $100",
    icon: "💎",
    condition: (s) => s.transactions.some((t) => t.amount > 100),
  },
  {
    id: "centurion",
    title: "Centurion",
    description: "Complete 20 transactions",
    icon: "👑",
    condition: (s) => s.sessionCount >= 20,
  },
];

/* ═══════════════════════════════════════════════════════════════
   UTILITIES
   ═══════════════════════════════════════════════════════════════ */

function generateTransaction() {
  const merchant = MERCHANT_POOL[Math.floor(Math.random() * MERCHANT_POOL.length)];
  const amount = merchant.min + Math.random() * (merchant.max - merchant.min);
  return { merchant, amount: Math.round(amount * 100) / 100 };
}

function createFreshStats() {
  return {
    totalSaved: 0,
    totalSpent: 0,
    transactions: [],
    wants: 0,
    needs: 0,
    streak: 0,
    bestStreak: 0,
    categories: {},
    sessionCount: 0,
    withoutPauseSpent: 0,
    achievementsUnlocked: [],
  };
}

function loadStats() {
  try {
    const raw = localStorage.getItem("pause_max_demo_v1");
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...createFreshStats(), ...parsed };
    }
  } catch { /* ignore */ }
  return createFreshStats();
}

function saveStats(stats) {
  try {
    localStorage.setItem("pause_max_demo_v1", JSON.stringify(stats));
  } catch { /* ignore */ }
}

/* ═══════════════════════════════════════════════════════════════
   CONFETTI ENGINE (Canvas)
   ═══════════════════════════════════════════════════════════════ */

function fireConfetti(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width = canvas.offsetWidth;
  const h = canvas.height = canvas.offsetHeight;

  const particles = [];
  const colors = ["#34d399", "#38bdf8", "#f472b6", "#fbbf24", "#a78bfa", "#fb7185", "#2dd4bf"];

  for (let i = 0; i < 80; i++) {
    particles.push({
      x: w / 2,
      y: h / 2,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 1.2) * 14,
      size: Math.random() * 5 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10,
      life: 1,
      decay: 0.008 + Math.random() * 0.012,
    });
  }

  let raf;
  function draw() {
    ctx.clearRect(0, 0, w, h);
    let alive = false;

    for (const p of particles) {
      if (p.life <= 0) continue;
      alive = true;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35;
      p.vx *= 0.98;
      p.rotation += p.rotSpeed;
      p.life -= p.decay;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    }

    if (alive) {
      raf = requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, w, h);
    }
  }

  draw();
  return () => cancelAnimationFrame(raf);
}

/* ═══════════════════════════════════════════════════════════════
   MINI COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

function MiniStat({ label, value, accent }) {
  const colorMap = {
    emerald: "text-emerald-300",
    sky: "text-sky-300",
    slate: "text-slate-300",
    amber: "text-amber-300",
    rose: "text-rose-300",
  };
  return (
    <div className="rounded-xl border border-white/[0.05] bg-white/[0.03] px-3 py-2.5 text-center transition hover:border-white/[0.1]">
      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className={`mt-0.5 text-sm font-bold ${colorMap[accent] || "text-white"}`}>{value}</p>
    </div>
  );
}

function AchievementBadge({ achievement, isNew }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border p-3 transition-all duration-500 ${
        isNew
          ? "border-amber-400/30 bg-amber-400/[0.08] scale-105"
          : "border-white/[0.05] bg-white/[0.02] opacity-60"
      }`}
    >
      <span className="text-xl">{achievement.icon}</span>
      <div>
        <p className={`text-xs font-semibold ${isNew ? "text-amber-200" : "text-slate-400"}`}>{achievement.title}</p>
        <p className="text-[10px] text-slate-500">{achievement.description}</p>
      </div>
    </div>
  );
}

function ProgressBar({ value, max, color = "from-emerald-400 to-sky-400" }) {
  const pct = Math.min((value / (max || 1)) * 100, 100);
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
      <div
        className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function ComparisonBar({ label, spent, saved, accent }) {
  const total = spent + saved;
  const savedPct = total > 0 ? (saved / total) * 100 : 0;
  return (
    <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400">{label}</span>
        <span className={`text-sm font-bold ${accent === "emerald" ? "text-emerald-300" : "text-slate-300"}`}>
          ${saved.toFixed(2)}
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.05]">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            accent === "emerald"
              ? "bg-gradient-to-r from-emerald-400 to-sky-400"
              : "bg-gradient-to-r from-slate-600 to-slate-500"
          }`}
          style={{ width: `${Math.min(savedPct, 100)}%` }}
        />
      </div>
      <p className="mt-1.5 text-[10px] text-slate-600">${spent.toFixed(2)} spent total</p>
    </div>
  );
}

function InsightCard({ icon, title, message, type = "info" }) {
  const borders = {
    info: "border-sky-400/15 bg-sky-400/[0.05]",
    success: "border-emerald-400/15 bg-emerald-400/[0.05]",
    warning: "border-amber-400/15 bg-amber-400/[0.05]",
  };
  return (
    <div className={`flex items-start gap-3 rounded-xl border p-3 ${borders[type]}`}>
      <span className="text-base">{icon}</span>
      <div>
        <p className="text-[11px] font-semibold text-slate-300">{title}</p>
        <p className="text-[10px] leading-4 text-slate-500">{message}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DEMO SESSION — Single transaction flow (remounts per tx)
   ═══════════════════════════════════════════════════════════════ */

function DemoSession({ onComplete, initialStats }) {
  const [tx] = useState(() => generateTransaction());
  const [step, setStep] = useState("intro");
  const [countdown, setCountdown] = useState(3);
  const [choice, setChoice] = useState(null);
  const [pulse, setPulse] = useState(false);
  const [stats, setStats] = useState(initialStats);
  const confettiRef = useRef(null);

  useEffect(() => {
    if (step !== "question" || countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [step, countdown]);

  useEffect(() => {
    if (step === "question" && countdown === 0 && !choice) {
      handleChoice("need");
    }
  }, [step, countdown, choice]);

  useEffect(() => {
    if (step !== "processing") return;
    const t = setTimeout(() => {
      const finalChoice = choice || "need";
      const saved = finalChoice === "want" ? Math.round(tx.amount * 0.1 * 100) / 100 : 0;

      const newStats = {
        ...stats,
        totalSaved: Math.round((stats.totalSaved + saved) * 100) / 100,
        totalSpent: Math.round((stats.totalSpent + tx.amount) * 100) / 100,
        withoutPauseSpent: Math.round((stats.withoutPauseSpent + tx.amount) * 100) / 100,
        wants: finalChoice === "want" ? stats.wants + 1 : stats.wants,
        needs: finalChoice === "need" ? stats.needs + 1 : stats.needs,
        streak: finalChoice === "want" ? stats.streak + 1 : 0,
        bestStreak: Math.max(stats.bestStreak, finalChoice === "want" ? stats.streak + 1 : stats.streak),
        sessionCount: stats.sessionCount + 1,
        categories: {
          ...stats.categories,
          [tx.merchant.category]: {
            spent: (stats.categories[tx.merchant.category]?.spent || 0) + tx.amount,
            saved: (stats.categories[tx.merchant.category]?.saved || 0) + saved,
          },
        },
        transactions: [
          {
            id: Date.now() + Math.random(),
            merchant: tx.merchant.name,
            emoji: tx.merchant.emoji,
            amount: tx.amount,
            choice: finalChoice,
            saved,
            category: tx.merchant.category,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
          },
          ...stats.transactions,
        ],
      };

      // Check achievements
      const newlyUnlocked = [];
      for (const ach of ACHIEVEMENTS) {
        const alreadyUnlocked = stats.achievementsUnlocked.includes(ach.id);
        if (!alreadyUnlocked && ach.condition(newStats)) {
          newlyUnlocked.push(ach.id);
        }
      }
      newStats.achievementsUnlocked = [...stats.achievementsUnlocked, ...newlyUnlocked];

      setStats(newStats);
      setStep("result");

      if (finalChoice === "want") {
        setPulse(true);
        setTimeout(() => setPulse(false), 900);
        if (confettiRef.current) {
          fireConfetti(confettiRef.current);
        }
      }
    }, 1400);
    return () => clearTimeout(t);
  }, [step, choice, tx, stats]);

  const handleChoice = useCallback((c) => {
    setChoice(c);
    setStep("processing");
  }, []);

  const savedAmt = choice === "want" ? Math.round(tx.amount * 0.1 * 100) / 100 : 0;
  const catMeta = CATEGORY_META[tx.merchant.category] || { color: "#94a3b8", accent: "slate" };

  return (
    <div>
      {/* Confetti Canvas */}
      <canvas
        ref={confettiRef}
        className="pointer-events-none absolute inset-0 z-30"
        style={{ width: "100%", height: "100%" }}
      />

      {/* Phone UI */}
      <div className="relative mx-auto max-w-[320px] overflow-hidden rounded-[1.6rem] border border-white/[0.06] bg-[#0a0f16] shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
        {/* Status Bar */}
        <div className="flex items-center justify-between px-5 pt-3 pb-1">
          <span className="text-[10px] font-semibold text-slate-500">9:41</span>
          <div className="h-1.5 w-16 rounded-full bg-[#1a2535]" />
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* Merchant Header */}
        <div className="px-5 pt-4 pb-2">
          <div className="flex items-center gap-3.5">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl"
              style={{ background: `${catMeta.color}15`, border: `1px solid ${catMeta.color}25` }}
            >
              {tx.merchant.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{tx.merchant.name}</p>
              <p className="text-[11px] text-slate-500">{tx.merchant.category}</p>
            </div>
          </div>
        </div>

        {/* Amount */}
        <div className="px-5 py-4 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-slate-600">Amount</p>
          <p className="mt-1.5 text-4xl font-bold tracking-tight text-white">${tx.amount.toFixed(2)}</p>
        </div>

        {/* Dynamic Content */}
        <div className="px-5 pb-6 pt-1">
          {step === "intro" && (
            <div className="space-y-5 pt-2">
              <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-4 text-center">
                <p className="text-xs leading-5 text-slate-400">
                  Simulate a contactless payment. You&apos;ll have <span className="font-semibold text-sky-300">3 seconds</span> to decide: Need or Want?
                </p>
              </div>
              <button
                onClick={() => { setStep("tapping"); setTimeout(() => setStep("question"), 1000); }}
                className="neon-button w-full rounded-2xl py-4 text-sm font-bold text-slate-950 shadow-lg transition hover:scale-[1.02]"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
                  Tap to Pay
                </span>
              </button>
            </div>
          )}

          {step === "tapping" && (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="relative">
                <div className="h-12 w-12 animate-spin rounded-full border-[3px] border-sky-400/15 border-t-sky-400" />
                <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full border border-sky-400/20 opacity-20" />
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-slate-400">Connecting to terminal...</p>
                <p className="mt-1 text-[10px] text-slate-600">{tx.merchant.name}</p>
              </div>
            </div>
          )}

          {step === "question" && (
            <div className="space-y-4">
              {/* Question Card */}
              <div
                className={`relative overflow-hidden rounded-2xl border border-sky-400/15 bg-gradient-to-b from-slate-800/60 to-slate-900/60 p-5 transition-all duration-300 ${
                  countdown <= 1 ? "border-rose-400/20 shadow-[0_0_30px_rgba(244,114,182,0.08)]" : ""
                }`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">Payment in</p>
                    <p
                      className={`mt-1 text-4xl font-bold transition-all duration-300 ${
                        countdown <= 1 ? "text-rose-400 scale-105" : "text-white"
                      }`}
                    >
                      {countdown}
                    </p>
                  </div>
                  <div className="relative">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-full border-2 text-base font-bold transition-all duration-300 ${
                        countdown <= 1
                          ? "border-rose-400/30 bg-rose-400/10 text-rose-300"
                          : "border-sky-400/25 bg-sky-400/10 text-sky-300"
                      }`}
                    >
                      {countdown}s
                    </div>
                    {countdown <= 1 && (
                      <div className="absolute inset-0 animate-ping rounded-full border-2 border-rose-400/30 opacity-40" />
                    )}
                  </div>
                </div>

                <p className="text-[15px] font-semibold leading-snug text-white">
                  Do you <span className="text-sky-400">need</span> this or <span className="text-rose-400">want</span> this?
                </p>

                {/* Progress dots */}
                <div className="mt-4 flex gap-1.5">
                  {[3, 2, 1].map((n) => (
                    <div
                      key={n}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        countdown < n ? "bg-sky-400/60" : countdown === n ? "bg-sky-400 animate-pulse" : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Choice Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleChoice("need")}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] py-3.5 text-sm font-bold text-white transition-all duration-300 hover:border-sky-400/30 hover:bg-white/[0.1] hover:shadow-[0_0_30px_rgba(56,189,248,0.1)] active:scale-95"
                >
                  Need
                </button>
                <button
                  onClick={() => handleChoice("want")}
                  className="neon-button relative overflow-hidden rounded-2xl py-3.5 text-sm font-bold text-slate-950 transition-all duration-300 hover:scale-[1.02] active:scale-95"
                >
                  Want
                </button>
              </div>

              <p className="text-center text-[10px] text-slate-600">
                Defaults to <span className="text-slate-400">Need</span> if no choice is made
              </p>
            </div>
          )}

          {step === "processing" && (
            <div className="flex flex-col items-center gap-4 py-10">
              <div className="relative">
                <div
                  className={`h-12 w-12 animate-spin rounded-full border-[3px] ${
                    choice === "want"
                      ? "border-emerald-400/15 border-t-emerald-400"
                      : "border-slate-600/30 border-t-slate-400"
                  }`}
                />
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-slate-400">
                  {choice === "want" ? (
                    <span className="flex items-center justify-center gap-1.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M2 12h20"/></svg>
                      Saving 10% and processing...
                    </span>
                  ) : (
                    "Processing payment..."
                  )}
                </p>
              </div>
            </div>
          )}

          {step === "result" && (
            <div className="space-y-4">
              {/* Payment Success */}
              <div
                className={`rounded-2xl border p-5 text-center transition-all duration-500 ${
                  choice === "want"
                    ? "border-emerald-400/15 bg-emerald-400/[0.04]"
                    : "border-white/[0.06] bg-white/[0.02]"
                }`}
              >
                <div
                  className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full text-xl transition-all duration-500 ${
                    choice === "want"
                      ? "bg-emerald-400/15 text-emerald-400"
                      : "bg-sky-400/15 text-sky-400"
                  }`}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <p className="text-sm font-bold text-white">Payment Complete</p>
                <p className="mt-1 text-[11px] text-slate-500">
                  ${tx.amount.toFixed(2)} paid to {tx.merchant.name}
                </p>
              </div>

              {/* Save Result */}
              {choice === "want" && (
                <div
                  className={`relative overflow-hidden rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-5 transition-all duration-500 ${
                    pulse ? "scale-[1.03] border-emerald-400/40 shadow-[0_0_40px_rgba(52,211,153,0.15)]" : "scale-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-300/70">
                        Auto-Saved (10%)
                      </p>
                      <p className="mt-1 text-xl font-bold text-emerald-200">+${savedAmt.toFixed(2)}</p>
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-400/15 text-xl">
                      🏦
                    </div>
                  </div>
                  <div className="mt-3">
                    <ProgressBar value={stats.totalSaved + savedAmt} max={300} />
                  </div>
                  <p className="mt-2 text-[10px] text-emerald-400/50">
                    Total saved: ${(stats.totalSaved + savedAmt).toFixed(2)}
                  </p>
                </div>
              )}

              {choice === "need" && (
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 text-center">
                  <p className="text-xs text-slate-500">Marked as need — no savings triggered</p>
                  <p className="mt-1 text-[10px] text-slate-600">
                    Honesty builds awareness. Next time might be a want.
                  </p>
                </div>
              )}

              {/* Next Button */}
              <button
                onClick={() => onComplete(stats)}
                className="group w-full rounded-2xl border border-white/10 bg-white/[0.05] py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-sky-400/20 hover:bg-white/[0.1] hover:shadow-[0_0_30px_rgba(56,189,248,0.08)] active:scale-[0.98]"
              >
                <span className="flex items-center justify-center gap-2">
                  Next Transaction
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="transition-transform group-hover:translate-x-0.5"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mini Stats Row */}
      {stats.sessionCount > 0 && (
        <div className="mt-4 grid grid-cols-4 gap-2">
          <MiniStat label="Saved" value={`$${(stats.totalSaved + (choice === "want" && step === "result" ? savedAmt : 0)).toFixed(2)}`} accent="emerald" />
          <MiniStat label="Wants" value={stats.wants + (choice === "want" && step === "result" ? 1 : 0)} accent="sky" />
          <MiniStat label="Needs" value={stats.needs + (choice === "need" && step === "result" ? 1 : 0)} accent="slate" />
          <MiniStat label="Streak" value={`${stats.streak + (choice === "want" && step === "result" ? 1 : stats.streak > 0 && choice === "need" && step === "result" ? -stats.streak : 0)}${(stats.streak + (choice === "want" && step === "result" ? 1 : 0)) >= 3 ? "🔥" : ""}`} accent="amber" />
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DEMO MODAL — Orchestrator with full dashboard
   ═══════════════════════════════════════════════════════════════ */

export default function DemoModal({ isOpen, onClose }) {
  const [sessionKey, setSessionKey] = useState(0);
  const [persistentStats, setPersistentStats] = useState(() => loadStats());
  const [activeTab, setActiveTab] = useState("demo"); // demo | stats | history | achievements
  const [newAchievements, setNewAchievements] = useState([]);

  // Save on every change
  useEffect(() => {
    saveStats(persistentStats);
  }, [persistentStats]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Handle Escape
  useEffect(() => {
    function handleKey(e) { if (e.key === "Escape") onClose(); }
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const handleSessionComplete = useCallback((sessionStats) => {
    // Detect new achievements
    const newlyUnlocked = sessionStats.achievementsUnlocked.filter(
      (id) => !persistentStats.achievementsUnlocked.includes(id)
    );
    if (newlyUnlocked.length > 0) {
      setNewAchievements(newlyUnlocked);
      setTimeout(() => setNewAchievements([]), 4000);
    }
    setPersistentStats(sessionStats);
    setSessionKey((k) => k + 1);
  }, [persistentStats.achievementsUnlocked]);

  const clearStats = useCallback(() => {
    if (!window.confirm("Clear all demo data? This cannot be undone.")) return;
    setPersistentStats(createFreshStats());
    localStorage.removeItem("pause_max_demo_v1");
    setSessionKey((k) => k + 1);
  }, []);

  const savingsRate = persistentStats.totalSpent > 0
    ? ((persistentStats.totalSaved / persistentStats.totalSpent) * 100).toFixed(1)
    : "0";

  const monthlyProjection = persistentStats.sessionCount > 0
    ? (persistentStats.totalSaved / persistentStats.sessionCount * 30).toFixed(0)
    : "0";

  const yearlyProjection = (parseFloat(monthlyProjection) * 12).toFixed(0);

  const unlockedAchievements = ACHIEVEMENTS.filter((a) =>
    persistentStats.achievementsUnlocked.includes(a.id)
  );

  const lockedAchievements = ACHIEVEMENTS.filter(
    (a) => !persistentStats.achievementsUnlocked.includes(a.id)
  );

  // Generate insights
  const insights = useMemo(() => {
    const items = [];
    if (persistentStats.wants > 0) {
      items.push({
        icon: "🧠",
        title: "Building awareness",
        message: `You've been honest about ${persistentStats.wants} want${persistentStats.wants > 1 ? "s" : ""}. That's the first step.`,
        type: "success",
      });
    }
    if (persistentStats.bestStreak >= 3) {
      items.push({
        icon: "🔥",
        title: "Streak master",
        message: `Your best streak is ${persistentStats.bestStreak} wants in a row!`,
        type: "success",
      });
    }
    const topCategory = Object.entries(persistentStats.categories)
      .sort((a, b) => b[1].spent - a[1].spent)[0];
    if (topCategory) {
      items.push({
        icon: "📊",
        title: `Top: ${topCategory[0]}`,
        message: `You've spent $${topCategory[1].spent.toFixed(2)} on ${topCategory[0]}.`,
        type: "info",
      });
    }
    if (parseFloat(monthlyProjection) > 50) {
      items.push({
        icon: "🎯",
        title: "On track",
        message: `At this rate, you'd save ~$${yearlyProjection} in a year!`,
        type: "success",
      });
    }
    return items.slice(0, 3);
  }, [persistentStats, monthlyProjection, yearlyProjection]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3" role="dialog" aria-modal="true" aria-label="PAUSE Live Demo">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-lg"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative flex h-[92vh] w-full max-w-[460px] flex-col overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#080d14] shadow-[0_40px_120px_rgba(0,0,0,0.7)]">
        {/* Ambient Glows */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-500/[0.06] blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-emerald-500/[0.05] blur-[100px]" />

        {/* Achievement Toast */}
        {newAchievements.length > 0 && (
          <div className="absolute left-4 right-4 top-4 z-40 space-y-2">
            {newAchievements.map((id) => {
              const ach = ACHIEVEMENTS.find((a) => a.id === id);
              return (
                <div
                  key={id}
                  className="flex items-center gap-3 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 shadow-lg animate-in slide-in-from-top-2 fade-in duration-500"
                >
                  <span className="text-2xl">{ach.icon}</span>
                  <div>
                    <p className="text-xs font-bold text-amber-200">Achievement Unlocked!</p>
                    <p className="text-[11px] text-amber-100/70">{ach.title} — {ach.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Header */}
        <div className="relative flex items-center justify-between border-b border-white/[0.05] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-sky-400/20 bg-sky-400/10 text-sm font-bold text-sky-300">
              P
            </div>
            <div>
              <p className="text-[11px] font-bold tracking-[0.15em] text-slate-400 uppercase">PAUSE</p>
              <p className="text-[9px] text-slate-600">Live Payment Demo</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {persistentStats.sessionCount > 0 && (
              <button
                onClick={clearStats}
                className="rounded-lg px-3 py-1.5 text-[11px] text-slate-600 transition hover:bg-white/5 hover:text-slate-400"
                title="Clear all data"
              >
                Reset
              </button>
            )}
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition hover:border-white/20 hover:text-white"
              aria-label="Close demo"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        {persistentStats.sessionCount > 0 && (
          <div className="relative flex border-b border-white/[0.04] px-5">
            {[
              { id: "demo", label: "Demo", icon: "💳" },
              { id: "stats", label: "Stats", icon: "📊" },
              { id: "history", label: "History", icon: "📝" },
              { id: "achievements", label: "Badges", icon: "🏆" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex flex-1 items-center justify-center gap-1.5 py-3 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                  activeTab === tab.id ? "text-sky-300" : "text-slate-600 hover:text-slate-400"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
                {tab.id === "achievements" && unlockedAchievements.length > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-400/20 text-[9px] font-bold text-amber-300">
                    {unlockedAchievements.length}
                  </span>
                )}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 rounded-full bg-sky-400" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Scrollable Content */}
        <div className="relative flex-1 overflow-y-auto overflow-x-hidden px-5 py-5">
          {/* DEMO TAB */}
          {activeTab === "demo" && (
            <div>
              <DemoSession
                key={sessionKey}
                onComplete={handleSessionComplete}
                initialStats={persistentStats}
              />

              {/* Insights */}
              {insights.length > 0 && (
                <div className="mt-5 space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600">Insights</p>
                  {insights.map((insight, i) => (
                    <InsightCard key={i} {...insight} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STATS TAB */}
          {activeTab === "stats" && (
            <div className="space-y-5">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-emerald-400/10 bg-emerald-400/[0.04] p-4">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-emerald-400/50">Total Saved</p>
                  <p className="mt-1 text-xl font-bold text-emerald-300">${persistentStats.totalSaved.toFixed(2)}</p>
                </div>
                <div className="rounded-xl border border-sky-400/10 bg-sky-400/[0.04] p-4">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-sky-400/50">Savings Rate</p>
                  <p className="mt-1 text-xl font-bold text-sky-300">{savingsRate}%</p>
                </div>
                <div className="rounded-xl border border-amber-400/10 bg-amber-400/[0.04] p-4">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-amber-400/50">Transactions</p>
                  <p className="mt-1 text-xl font-bold text-amber-300">{persistentStats.sessionCount}</p>
                </div>
                <div className="rounded-xl border border-violet-400/10 bg-violet-400/[0.04] p-4">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-violet-400/50">Best Streak</p>
                  <p className="mt-1 text-xl font-bold text-violet-300">{persistentStats.bestStreak}</p>
                </div>
              </div>

              {/* Projections */}
              <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
                <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-slate-500">Projections</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Monthly (est.)</span>
                    <span className="text-sm font-bold text-emerald-300">${monthlyProjection}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Yearly (est.)</span>
                    <span className="text-sm font-bold text-sky-300">${yearlyProjection}</span>
                  </div>
                </div>
              </div>

              {/* With vs Without PAUSE */}
              <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
                <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-slate-500">With vs Without PAUSE</p>
                <div className="space-y-3">
                  <ComparisonBar
                    label="With PAUSE"
                    spent={persistentStats.totalSpent}
                    saved={persistentStats.totalSaved}
                    accent="emerald"
                  />
                  <ComparisonBar
                    label="Without PAUSE"
                    spent={persistentStats.withoutPauseSpent}
                    saved={0}
                    accent="slate"
                  />
                </div>
                <p className="mt-3 text-[10px] leading-4 text-slate-600">
                  At your current rate, PAUSE would have saved you <span className="font-semibold text-emerald-400">${persistentStats.totalSaved.toFixed(2)}</span> in real life.
                </p>
              </div>

              {/* Category Breakdown */}
              {Object.keys(persistentStats.categories).length > 0 && (
                <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
                  <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-slate-500">By Category</p>
                  <div className="space-y-3">
                    {Object.entries(persistentStats.categories)
                      .sort((a, b) => b[1].saved - a[1].saved)
                      .map(([cat, data]) => {
                        const meta = CATEGORY_META[cat] || { color: "#94a3b8" };
                        return (
                          <div key={cat}>
                            <div className="mb-1 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full" style={{ background: meta.color }} />
                                <span className="text-[11px] font-medium text-slate-400">{cat}</span>
                              </div>
                              <div className="flex gap-3 text-[10px]">
                                <span className="text-emerald-400/70">${data.saved.toFixed(2)} saved</span>
                                <span className="text-slate-600">${data.spent.toFixed(2)}</span>
                              </div>
                            </div>
                            <ProgressBar value={data.saved} max={persistentStats.totalSaved || 1} />
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Want vs Need Distribution */}
              <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
                <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-slate-500">Choice Distribution</p>
                <div className="flex h-3 overflow-hidden rounded-full bg-white/[0.05]">
                  {persistentStats.wants + persistentStats.needs > 0 && (
                    <>
                      <div
                        className="h-full bg-gradient-to-r from-sky-400 to-cyan-400 transition-all"
                        style={{
                          width: `${(persistentStats.wants / (persistentStats.wants + persistentStats.needs)) * 100}%`,
                        }}
                      />
                      <div
                        className="h-full bg-white/[0.1] transition-all"
                        style={{
                          width: `${(persistentStats.needs / (persistentStats.wants + persistentStats.needs)) * 100}%`,
                        }}
                      />
                    </>
                  )}
                </div>
                <div className="mt-2 flex justify-between text-[10px]">
                  <span className="text-sky-400">{persistentStats.wants} Wants</span>
                  <span className="text-slate-500">{persistentStats.needs} Needs</span>
                </div>
              </div>
            </div>
          )}

          {/* HISTORY TAB */}
          {activeTab === "history" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Transaction Log</p>
                <span className="text-[10px] text-slate-600">{persistentStats.transactions.length} txns</span>
              </div>

              {persistentStats.transactions.length === 0 ? (
                <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-8 text-center">
                  <p className="text-sm text-slate-500">No transactions yet</p>
                  <p className="mt-1 text-xs text-slate-600">Complete a payment to see your history here</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {persistentStats.transactions.map((t, i) => {
                    const meta = CATEGORY_META[t.category] || { color: "#94a3b8" };
                    return (
                      <div
                        key={t.id}
                        className={`flex items-center justify-between rounded-xl border border-white/[0.03] bg-white/[0.02] px-3 py-3 transition hover:border-white/[0.08] ${
                          i === 0 ? "border-sky-400/10 bg-sky-400/[0.02]" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <span className="text-lg">{t.emoji}</span>
                          <div className="min-w-0">
                            <p className="truncate text-xs font-medium text-slate-300">{t.merchant}</p>
                            <p className="text-[9px] text-slate-600">{t.time} • {t.category}</p>
                          </div>
                        </div>
                        <div className="text-right ml-3 shrink-0">
                          <p className="text-xs font-semibold text-white">${t.amount.toFixed(2)}</p>
                          {t.saved > 0 ? (
                            <p className="text-[10px] font-medium text-emerald-400">+${t.saved.toFixed(2)}</p>
                          ) : (
                            <p className="text-[10px] text-slate-600">{t.choice}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ACHIEVEMENTS TAB */}
          {activeTab === "achievements" && (
            <div className="space-y-5">
              {/* Progress */}
              <div className="rounded-xl border border-amber-400/10 bg-amber-400/[0.04] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-amber-400/60">Progress</span>
                  <span className="text-sm font-bold text-amber-300">
                    {unlockedAchievements.length} / {ACHIEVEMENTS.length}
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.05]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-700"
                    style={{ width: `${(unlockedAchievements.length / ACHIEVEMENTS.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Unlocked */}
              {unlockedAchievements.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-400/50">Unlocked</p>
                  {unlockedAchievements.map((ach) => (
                    <AchievementBadge key={ach.id} achievement={ach} isNew={false} />
                  ))}
                </div>
              )}

              {/* Locked */}
              {lockedAchievements.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600">Locked</p>
                  {lockedAchievements.map((ach) => (
                    <AchievementBadge key={ach.id} achievement={ach} isNew={false} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="relative border-t border-white/[0.04] px-5 py-3 text-center">
          <p className="text-[9px] text-slate-700">Simulated experience. No real payment processed. Data stored locally.</p>
        </div>
      </div>
    </div>
  );
}
