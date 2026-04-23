import { useEffect, useMemo, useState } from "react";
import DemoModal from "./DemoModal";

const navItems = [
  { label: "Problem", href: "#problem" },
  { label: "Solution", href: "#solution" },
  { label: "Science", href: "#science" },
  { label: "Waitlist", href: "#waitlist" },
];

const flowSteps = ["Tap", "Pause", "Question", "Choice", "Outcome"];

const howItWorks = [
  {
    step: "Step 1",
    title: "Tap to pay",
    description:
      "Start any contactless payment exactly like you already do today.",
  },
  {
    step: "Step 2",
    title: "3-second pause appears",
    description:
      "A brief, intentional screen appears before the payment completes.",
  },
  {
    step: "Step 3",
    title: "Choose Need or Want",
    description:
      "You answer honestly in the moment with one quick tap.",
  },
  {
    step: "Step 4",
    title: "If Want -> 10% auto-saved",
    description:
      "The purchase still goes through, while a small amount is routed into savings.",
  },
  {
    step: "Step 5",
    title: "Watch savings grow",
    description:
      "Over time, awareness compounds into visible, automatic progress.",
  },
];

const valueProps = [
  "No restriction",
  "No guilt",
  "No budgeting complexity",
  "Just awareness + automatic saving",
];

const heroBenefits = [
  {
    label: "Awareness layer",
    number: "01",
    text: "A behavioral checkpoint before every tap.",
  },
  {
    label: "No spending lock",
    number: "02",
    text: "Users still buy what they want without friction-heavy blocks.",
  },
  {
    label: "Automatic action",
    number: "03",
    text: "Impulse becomes a savings trigger instead of a guilt spiral.",
  },
];

const heroSignals = [
  {
    label: "Behavioral trigger",
    text: "3 seconds of intentional awareness before checkout completes.",
  },
  {
    label: "Impulse redirect",
    text: "Want-based taps turn into automatic savings without blocking payment.",
  },
  {
    label: "Habit formation",
    text: "Repeated honesty creates a calmer financial reflex over time.",
  },
];

const exactConcept =
  "Every time you tap Google Pay, Apple Pay, or any contactless payment - your phone intercepts that moment for exactly 3 seconds before the payment goes through.\n\nIn those 3 seconds, one question appears on screen:\n'Do you need this or do you want this?'\n\nTwo buttons. Need. Want.\n\nIf you tap Need - payment goes through instantly, nothing saved.\nIf you tap Want - payment still goes through, but 10% of that transaction is automatically moved to your savings pot the moment you spend it.\n\nYou're not blocked from spending. You're not lectured. You just have to be honest with yourself for 3 seconds, and if you admit it's a want, the system automatically taxes your own impulse.";

function GlowWord({ children }) {
  return <span className="glow-word">{children}</span>;
}

function SectionHeader({ label, title, description, align = "left" }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}>
      <p className={`section-label ${align === "center" ? "mx-auto" : ""}`}>{label}</p>
      <h2 className="mt-5 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl lg:text-[2.8rem]">
        {title}
      </h2>
      {description ? (
        <p className="mt-5 text-lg leading-8 text-slate-300">{description}</p>
      ) : null}
    </div>
  );
}

function CountdownDemo() {
  const [count, setCount] = useState(3);
  const [selection, setSelection] = useState("want");

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCount((current) => (current === 1 ? 3 : current - 1));
    }, 1200);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div
      className="card-glow relative overflow-hidden rounded-[2.15rem] border border-white/10 bg-white/[0.045] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl lg:p-6"
      aria-label="Interactive payment awareness demo"
    >
      <div
        className="absolute inset-x-8 top-4 h-28 rounded-full bg-sky-300/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-[340px] rounded-[2rem] border border-white/10 bg-slate-950/90 p-4 text-white lg:max-w-[360px]">
        <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
          <span>PAUSE</span>
          <span>Contactless check</span>
        </div>
        <div className="rounded-[1.6rem] bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/40 p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Payment in
              </p>
              <p className="text-5xl font-semibold tracking-tight">{count}</p>
            </div>
            <div
              className="neon-chip flex h-16 w-16 items-center justify-center rounded-full border border-sky-300/30 bg-sky-300/10 text-sky-100"
              aria-hidden="true"
            >
              {count}s
            </div>
          </div>
          <p className="mb-4 text-lg font-semibold leading-tight">
            Do you need this or do you want this?
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelection("need")}
              className={`rounded-2xl px-4 py-3 text-sm font-semibold transition duration-300 ${
                selection === "need"
                  ? "bg-white text-slate-950 shadow-lg shadow-white/15"
                  : "bg-white/8 text-white hover:bg-white/14"
              }`}
              aria-pressed={selection === "need"}
            >
              Need
            </button>
            <button
              type="button"
              onClick={() => setSelection("want")}
              className={`rounded-2xl px-4 py-3 text-sm font-semibold transition duration-300 ${
                selection === "want"
                  ? "neon-button text-slate-950"
                  : "bg-sky-300/12 text-sky-100 hover:bg-sky-300/20"
              }`}
              aria-pressed={selection === "want"}
            >
              Want
            </button>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            {selection === "want"
              ? "Payment proceeds and 10% is routed to savings."
              : "Payment proceeds instantly and nothing is saved."}
          </p>
        </div>
      </div>
    </div>
  );
}

function SavingsCounter() {
  const [amount, setAmount] = useState(184);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setAmount((current) => (current >= 412 ? 184 : current + 2));
    }, 90);

    return () => window.clearInterval(timer);
  }, []);

  const formattedAmount = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(amount),
    [amount],
  );

  return (
    <div className="panel rounded-[1.8rem] p-6">
      <p className="text-sm uppercase tracking-[0.24em] text-emerald-200/70">
        Auto-saved this month
      </p>
      <p className="mt-3 text-4xl font-semibold tracking-tight text-white">
        {formattedAmount}
      </p>
      <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
        Small friction, repeated over time, becomes visible momentum.
      </p>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-sky-300 transition-[width] duration-300"
          style={{ width: `${((amount - 184) / (412 - 184)) * 100}%` }}
        />
      </div>
    </div>
  );
}

function WaitlistForm({ compact = false }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      className={`grid gap-3 ${compact ? "sm:grid-cols-[1fr_auto]" : "lg:grid-cols-[1fr_auto]"}`}
      onSubmit={(event) => {
        event.preventDefault();
        if (!email.trim()) {
          return;
        }
        setSubmitted(true);
      }}
    >
      <label
        className="sr-only"
        htmlFor={compact ? "email-compact" : "email-main"}
      >
        Email address
      </label>
      <input
        id={compact ? "email-compact" : "email-main"}
        type="email"
        name="email"
        autoComplete="email"
        required
        value={email}
        placeholder="Enter your email"
        aria-label="Email address"
        onChange={(event) => {
          setEmail(event.target.value);
          if (submitted) {
            setSubmitted(false);
          }
        }}
        className="min-h-14 rounded-2xl border border-white/12 bg-white/8 px-4 text-base text-white placeholder:text-slate-400 outline-none transition focus:border-sky-300/50 focus:bg-white/10"
      />
      <button
        type="submit"
        className="neon-button min-h-14 rounded-2xl px-6 text-base font-semibold text-slate-950"
      >
        Join Waitlist
      </button>
      <p
        className={`text-sm leading-6 text-sky-100/90 ${compact ? "sm:col-span-2" : "lg:col-span-2"}`}
        aria-live="polite"
      >
        {submitted
          ? "You're on the list. We'll keep you posted."
          : "Early access updates only. No spam."}
      </p>
    </form>
  );
}

function HeroSignalCard() {
  return (
    <div className="unique-card relative flex h-full min-h-[34rem] overflow-hidden rounded-[2.25rem] border border-white/10 p-6 lg:min-h-[35.5rem] lg:p-10">
      <div
        className="absolute -right-10 top-8 h-44 w-44 rounded-full bg-sky-300/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -left-10 bottom-2 h-32 w-32 rounded-full bg-emerald-300/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative flex w-full flex-col gap-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-[32rem]">
            <p className="text-xs uppercase tracking-[0.34em] text-sky-100/65">
              Awareness Architecture
            </p>
            <h3 className="mt-5 max-w-[26rem] text-[2.45rem] font-semibold tracking-[-0.05em] leading-[1.05] text-white lg:text-[2.9rem]">
              One habit. Three outcomes.
            </h3>
          </div>
          <span className="neon-chip inline-flex w-fit rounded-full px-5 py-3 text-xs uppercase tracking-[0.24em] text-sky-50">
            Live concept
          </span>
        </div>
        <div className="grid flex-1 content-start gap-5">
          {heroSignals.map((signal, index) => (
            <article
              key={signal.label}
              className="group relative grid min-h-[9.75rem] items-start gap-6 overflow-hidden rounded-[1.7rem] border border-white/10 bg-slate-950/45 px-6 py-7 transition duration-300 hover:-translate-y-1 hover:border-sky-300/25 lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-8"
            >
              <div
                className="absolute inset-y-6 left-0 w-1.5 rounded-full bg-gradient-to-b from-sky-300 via-cyan-200 to-emerald-300"
                aria-hidden="true"
              />
              <div className="pl-6">
                <p className="text-xs uppercase tracking-[0.34em] leading-8 text-slate-400">
                  0{index + 1}
                </p>
                <p className="text-xs uppercase tracking-[0.26em] leading-8 text-sky-100/70">
                  {signal.label}
                </p>
              </div>
              <p className="pl-6 text-[1.1rem] leading-8 text-slate-100 lg:pl-0 lg:text-[1.08rem]">
                {signal.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function HeroBenefitsCard() {
  return (
    <div className="benefits-card relative flex h-full min-h-[34rem] overflow-hidden rounded-[2.25rem] border border-white/10 p-6 lg:min-h-[35.5rem] lg:p-10">
      <div
        className="absolute -right-10 top-8 h-44 w-44 rounded-full bg-rose-200/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -left-10 bottom-2 h-32 w-32 rounded-full bg-cyan-300/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative flex w-full flex-col gap-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-lg">
            <p className="text-xs uppercase tracking-[0.28em] text-rose-100/70">
              Core Benefits
            </p>
            <h3 className="mt-3 text-[2rem] font-semibold tracking-[-0.03em] text-white">
              Calm spending support, designed for real life.
            </h3>
          </div>
          <span className="premium-chip inline-flex w-fit rounded-full px-4 py-2 text-xs uppercase tracking-[0.2em] text-rose-50">

          </span>
        </div>
        <div className="grid flex-1 auto-rows-fr content-start gap-4">
          {heroBenefits.map((item) => (
            <article
              key={item.label}
              className="benefit-tile group relative flex min-h-[30%] w-full overflow-hidden rounded-[1.7rem] border border-white/10 px-6 py-6 transition duration-300 hover:-translate-y-1"
            >
              <div
                className="absolute inset-y-5 left-0 w-1.5 rounded-full bg-gradient-to-b from-rose-200 via-cyan-300 to-emerald-300"
                aria-hidden="true"
              />
              <div className="grid w-full gap-4 pl-5 lg:grid-cols-[10.5rem_minmax(0,1fr)] lg:items-start lg:gap-8">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                    {item.number}
                  </p>
                  <p className="mt-3 text-xs uppercase tracking-[0.28em] leading-7 text-slate-400">
                    {item.label}
                  </p>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <p className="max-w-xl text-[1.12rem] leading-8 text-slate-100">
                    {item.text}
                  </p>
                  <span className="hidden text-[0.7rem] uppercase tracking-[0.22em] text-rose-100/40 lg:block">

                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);

  useEffect(() => {
    const closeMenu = () => setMobileOpen(false);
    window.addEventListener("resize", closeMenu);
    return () => window.removeEventListener("resize", closeMenu);
  }, []);

  return (
    <div className="min-h-screen bg-[#06121e] text-slate-100">
      <div
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-0 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-cyan-300/10 blur-[140px]" />
        <div className="absolute right-0 top-1/3 h-[24rem] w-[24rem] rounded-full bg-rose-200/8 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[24rem] w-[24rem] rounded-full bg-emerald-300/10 blur-[120px]" />
      </div>

      <header className="sticky top-0 z-30 px-4 pt-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl rounded-[1.7rem] border border-white/10 bg-slate-950/55 px-4 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:px-5">
          <div className="flex items-center justify-between gap-4">
            <a
              href="#top"
              className="inline-flex items-center gap-3"
              aria-label="PAUSE home"
            >
              <span className="logo-badge flex h-11 w-11 items-center justify-center rounded-2xl text-lg font-semibold text-sky-50">
                P
              </span>
              <span className="text-sm font-semibold tracking-[0.32em] text-slate-100">
                PAUSE
              </span>
            </a>

            <nav
              aria-label="Primary"
              className="hidden items-center gap-2 rounded-full border border-white/8 bg-white/4 px-2 py-2 md:flex"
            >
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="nav-link rounded-full px-4 py-2 text-sm text-slate-300"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDemoOpen(true)}
                className="neon-button hidden rounded-2xl px-5 py-3 text-sm font-semibold text-slate-950 md:inline-flex"
              >
                Try Demo
              </button>
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-slate-100 md:hidden"
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav"
                aria-label="Toggle navigation"
                onClick={() => setMobileOpen((open) => !open)}
              >
                <span className="text-lg">{mobileOpen ? "X" : "="}</span>
              </button>
            </div>
          </div>

          {mobileOpen ? (
            <nav
              id="mobile-nav"
              aria-label="Mobile"
              className="mt-4 grid gap-2 border-t border-white/10 pt-4 md:hidden"
            >
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-slate-200 transition hover:border-sky-300/25 hover:text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          ) : null}
        </div>
      </header>

      <main id="top">
        <section className="mx-auto scroll-mt-32 max-w-[1380px] px-6 pb-24 pt-14 lg:px-10 lg:pb-30 lg:pt-18">
          <div className="grid items-stretch gap-8 xl:grid-cols-2">
            <div className="flex min-w-0 flex-col justify-between">
              <p className="mb-7 inline-flex rounded-full border border-sky-300/20 bg-sky-300/10 px-4 py-2 text-sm text-sky-100">
                Behavioral fintech for contactless spending
              </p>
              <h1 className="max-w-2xl text-5xl font-semibold tracking-[-0.055em] text-white sm:text-6xl lg:text-[5.3rem] lg:leading-[0.96]">
                <GlowWord>Pause</GlowWord> Before You <GlowWord>Spend</GlowWord>.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300 sm:text-xl">
                3 seconds that can change your <GlowWord>financial future</GlowWord>.
              </p>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-[1.05rem]">
                PAUSE gives digital payments one missing layer: <GlowWord>awareness</GlowWord>. Instead of blocking spending, it creates a fast check-in that helps people notice impulse in real time and turn honesty into savings.
              </p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
                <a
                  href="#waitlist"
                  className="neon-button inline-flex min-h-14 items-center justify-center rounded-2xl px-6 text-base font-semibold text-slate-950"
                >
                  Join the Waitlist
                </a>
                <p className="text-sm leading-6 text-slate-400">
                  Built for Apple Pay, Google Pay, and contactless habits.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs uppercase tracking-[0.2em] text-slate-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-300" />
                  No guilt
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs uppercase tracking-[0.2em] text-slate-300">
                  <span className="h-2 w-2 rounded-full bg-sky-300" />
                  Automatic saving
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs uppercase tracking-[0.2em] text-slate-300">
                  <span className="h-2 w-2 rounded-full bg-rose-300" />
                  Behavioral design
                </div>
              </div>
              <div className="mt-10 xl:mt-12">
                <HeroSignalCard />
              </div>
            </div>

            <div className="grid content-start gap-6 xl:grid-rows-[auto_1fr] xl:pt-8">
              <CountdownDemo />
              <HeroBenefitsCard />
            </div>
          </div>
        </section>

        <section
          id="problem"
          className="section-shell mx-auto scroll-mt-32 max-w-[1320px] px-6 lg:px-10"
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12">
            <SectionHeader
              label="Problem"
              title={
                <>
                  Spending is <GlowWord>Instant</GlowWord>. Thinking is Not.
                </>
              }
            />
            <div className="space-y-6 pt-1 text-lg leading-8 text-slate-300">
              <p>
                Contactless payments are beautifully efficient, but that efficiency removes the tiny pause where reflection used to happen. When spending becomes a tap, awareness often arrives too late.
              </p>
              <p>
                Young professionals live inside fast digital systems. The easier it is to buy coffee, convenience, subscriptions, or last-minute treats, the less visible the decision feels in the moment.
              </p>
            </div>
          </div>
        </section>

        <section
          id="solution"
          className="section-shell mx-auto scroll-mt-32 max-w-[1320px] px-6 lg:px-10"
        >
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.84fr)_minmax(0,1.16fr)] lg:gap-12">
            <SectionHeader
              label="Solution"
              title={
                <>
                  Insert <GlowWord>Awareness</GlowWord> Into Every Transaction
                </>
              }
              description="Every time you tap Google Pay, Apple Pay, or any contactless payment - your phone intercepts that moment for exactly 3 seconds before the payment goes through."
            />
            <div className="panel rounded-[2rem] p-6 lg:p-7">
              <div className="grid gap-4 sm:grid-cols-5">
                {flowSteps.map((item, index) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-center transition duration-300 hover:-translate-y-1 hover:border-sky-300/20"
                  >
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                      0{index + 1}
                    </p>
                    <p className="mt-3 text-lg font-semibold text-white">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-[1.75rem] border border-sky-300/15 bg-sky-300/8 p-5 text-slate-100 lg:p-6">
                <p className="whitespace-pre-line text-base leading-8">
                  {exactConcept}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell mx-auto max-w-[1320px] px-6 lg:px-10">
          <div className="max-w-[1120px]">
            <SectionHeader label="How It Works" title="A fast loop that trains awareness over time" />
            <div className="mt-8 grid gap-4">
              <div className="panel flex min-h-[12.8rem] w-full flex-col justify-between rounded-[1.55rem] p-6">
                <p className="section-label">Why 3 Seconds</p>
                <p className="mt-5 max-w-4xl text-2xl font-semibold leading-tight text-white">
                  Long enough to be <GlowWord>conscious</GlowWord>. Short enough that it doesn&apos;t feel like friction.
                </p>
              </div>

              {howItWorks.map((item) => (
                <article
                  key={item.step}
                  className="panel flex min-h-[12.8rem] w-full flex-col justify-between rounded-[1.55rem] px-5 py-5 transition duration-300 hover:-translate-y-1 hover:border-sky-300/20 hover:bg-white/[0.06]"
                >
                  <p className="text-sm uppercase tracking-[0.2em] text-sky-200/80">
                    {item.step}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-4 max-w-4xl leading-7 text-slate-300">
                    {item.description}
                  </p>
                </article>
              ))}

              <div className="w-full">
                <SavingsCounter />
              </div>
            </div>
          </div>
        </section>

        <section
          id="science"
          className="section-shell mx-auto scroll-mt-32 max-w-[1320px] px-6 lg:px-10"
        >
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)] lg:gap-12">
            <SectionHeader
              label="Behavioral Science"
              title={
                <>
                  Built on <GlowWord>Behavioral Psychology</GlowWord>
                </>
              }
            />
            <div className="grid gap-4 sm:grid-cols-3 sm:auto-rows-fr">
              <article className="panel flex h-full rounded-[1.55rem] p-5 transition duration-300 hover:-translate-y-1 hover:border-sky-300/20">
                <div>
                  <h3 className="text-xl font-semibold text-white">Pause = trigger</h3>
                  <p className="mt-3 leading-7 text-slate-300">
                    The interruption creates a conscious cue right before an automatic action.
                  </p>
                </div>
              </article>
              <article className="panel flex h-full rounded-[1.55rem] p-5 transition duration-300 hover:-translate-y-1 hover:border-sky-300/20">
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    Savings = reward/pain feedback loop
                  </h3>
                  <p className="mt-3 leading-7 text-slate-300">
                    Want-based spending carries a visible consequence that nudges future decisions.
                  </p>
                </div>
              </article>
              <article className="panel flex h-full rounded-[1.55rem] p-5 transition duration-300 hover:-translate-y-1 hover:border-sky-300/20">
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    Repetition builds awareness habit
                  </h3>
                  <p className="mt-3 leading-7 text-slate-300">
                    Repeated check-ins turn a one-time prompt into an internalized financial reflex.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="section-shell mx-auto max-w-[1320px] px-6 lg:px-10">
          <div className="rounded-[2.1rem] border border-white/10 bg-gradient-to-br from-white/[0.05] to-sky-300/[0.08] p-6 backdrop-blur lg:p-8">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,0.93fr)_minmax(0,1.07fr)] lg:gap-12">
              <SectionHeader
                label="Value"
                title={
                  <>
                    A calmer way to <GlowWord>spend smarter</GlowWord>
                  </>
                }
              />
              <div className="grid gap-4 sm:grid-cols-2 sm:auto-rows-fr">
                {valueProps.map((item) => (
                  <div
                    key={item}
                    className="flex h-full items-center rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-5 transition duration-300 hover:-translate-y-1 hover:border-sky-300/20"
                  >
                    <p className="text-lg font-medium leading-8 text-white">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="waitlist"
          className="section-shell mx-auto scroll-mt-32 max-w-5xl px-6 lg:px-10"
        >
          <div className="panel rounded-[2.3rem] px-8 py-9 shadow-[0_30px_100px_rgba(0,0,0,0.45)] lg:px-10 lg:py-10">
            <SectionHeader
              label="Waitlist"
              title={
                <>
                  Start Building <GlowWord>Awareness</GlowWord> Today
                </>
              }
              description="Join the early list to hear when PAUSE opens access, launches pilots, and begins onboarding first users."
            />
            <div className="mt-8">
              <WaitlistForm />
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-slate-400">
              <span>Early adopters get first access to pilots and product updates.</span>
              <span className="hidden h-1 w-1 rounded-full bg-slate-600 sm:block" />
              <span>No spam. Just launch news and early access invites.</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto mt-6 flex max-w-7xl flex-col gap-4 border-t border-white/10 px-6 py-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <div className="flex items-center gap-3">
          <span className="logo-badge flex h-9 w-9 items-center justify-center rounded-2xl font-semibold text-sky-50">
            P
          </span>
          <span className="font-medium text-slate-200">PAUSE</span>
        </div>
        <div className="flex flex-wrap gap-5">
          <a href="#top" className="transition hover:text-white">
            Privacy
          </a>
          <a href="mailto:hello@pause.app" className="transition hover:text-white">
            Contact
          </a>
        </div>
      </footer>

      <DemoModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  );
}