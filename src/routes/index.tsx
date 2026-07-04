import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  GraduationCap,
  Users,
  BookOpen,
  Sparkles,
  Clock,
  Timer,
  ListChecks,
  FileText,
  Mic,
  ChevronRight,
  ChevronDown,
  Award,
  Brain,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Printer,
  Plus,
  Activity,
  TrendingUp,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import {
  initialSessions,
  dashboardStats,
  sampleAnswers,
  type Session,
  type VivaReport,
  type Level,
} from "@/lib/viva-mock";

export const Route = createFileRoute("/")({
  component: VivaApp,
});

type View = "teacher" | "student-setup" | "student-exam" | "report";

function VivaApp() {
  const [view, setView] = useState<View>("teacher");
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [activeReport, setActiveReport] = useState<VivaReport | null>(null);
  const [examSession, setExamSession] = useState<Session | null>(null);
  const [examStudent, setExamStudent] = useState<{ name: string; roll: string } | null>(null);

  return (
    <div className="min-h-screen gradient-subtle">
      <TopBar view={view} onSwitch={setView} />
      <main key={view} className="animate-slide-up mx-auto max-w-7xl px-6 py-10">
        {view === "teacher" && (
          <TeacherDashboard
            sessions={sessions}
            setSessions={setSessions}
            onViewReports={(s) => {
              setActiveReport(s.reports[0] ?? null);
              if (s.reports[0]) setView("report");
            }}
          />
        )}
        {view === "student-setup" && (
          <StudentSetup
            sessions={sessions}
            onStart={(s, student) => {
              setExamSession(s);
              setExamStudent(student);
              setView("student-exam");
            }}
          />
        )}
        {view === "student-exam" && examSession && examStudent && (
          <StudentExam
            session={examSession}
            student={examStudent}
            onFinish={(report) => {
              setActiveReport(report);
              setView("report");
            }}
          />
        )}
        {view === "report" && activeReport && (
          <ReportView
            report={activeReport}
            onBack={() => setView("teacher")}
          />
        )}
      </main>
    </div>
  );
}

function TopBar({ view, onSwitch }: { view: View; onSwitch: (v: View) => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl gradient-primary shadow-elegant">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <div className="text-lg font-semibold tracking-tight">AI VivaEdge</div>
            <div className="text-xs text-muted-foreground">Adaptive oral examinations · Powered by AI</div>
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1 shadow-card">
          <PersonaButton
            active={view === "teacher"}
            onClick={() => onSwitch("teacher")}
            icon={<GraduationCap className="h-4 w-4" />}
            label="Teacher"
          />
          <PersonaButton
            active={view === "student-setup" || view === "student-exam"}
            onClick={() => onSwitch("student-setup")}
            icon={<Users className="h-4 w-4" />}
            label="Student"
          />
        </div>
      </div>
    </header>
  );
}

function PersonaButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all",
        active
          ? "gradient-primary text-primary-foreground shadow-elegant"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

/* ---------------- Teacher Dashboard ---------------- */

function TeacherDashboard({
  sessions,
  setSessions,
  onViewReports,
}: {
  sessions: Session[];
  setSessions: React.Dispatch<React.SetStateAction<Session[]>>;
  onViewReports: (s: Session) => void;
}) {
  const [level, setLevel] = useState<Level>("University Undergraduate");
  const [topic, setTopic] = useState("Data Structures — Trees & Graphs");
  const [count, setCount] = useState(5);
  const [timer, setTimer] = useState(15);
  const [context, setContext] = useState(
    "Binary trees, BST properties, AVL rotations, graph traversals (BFS/DFS), shortest paths (Dijkstra), and complexity analysis.",
  );

  const createSession = () => {
    const s: Session = {
      id: `ses-${Date.now()}`,
      title: topic,
      level,
      questionCount: count,
      timerMinutes: timer,
      syllabusContext: context,
      completed: 0,
      total: 25,
      status: "active",
      questions: [],
      reports: [],
    };
    setSessions((prev) => [s, ...prev]);
    setTopic("");
  };

  return (
    <div className="space-y-8">
      {/* Header stats */}
      <div>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs font-medium uppercase tracking-widest text-primary">Educator workspace</div>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">Welcome back, Professor</h1>
            <p className="mt-1 text-sm text-muted-foreground">Design a viva, invite students, and let the AI examiner do the heavy lifting.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <StatCard
            icon={<Activity className="h-4 w-4" />}
            label="Active exams"
            value={dashboardStats.activeExams}
            hint="3 sessions accepting students"
            tone="primary"
          />
          <StatCard
            icon={<CheckCircle2 className="h-4 w-4" />}
            label="Completed tests"
            value={dashboardStats.completedTests}
            hint="Across all cohorts this month"
            tone="success"
          />
          <StatCard
            icon={<TrendingUp className="h-4 w-4" />}
            label="Average score"
            value={`${dashboardStats.averageScore}%`}
            hint="+4.2% vs last month"
            tone="warning"
          />
        </div>
      </div>

      {/* Configuration */}
      <section className="grid gap-8 lg:grid-cols-[1.15fr_1fr]">
        <Card>
          <CardHeader
            title="Configure a new viva session"
            subtitle="The AI examiner adapts its tone, vocabulary, and follow-up probing to the level you set."
            icon={<Sparkles className="h-4 w-4" />}
          />
          <div className="space-y-5 p-6 pt-0">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Academic level">
                <Select value={level} onValueChange={(v) => setLevel(v as Level)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Primary (Class 3-5)">Primary (Class 3-5)</SelectItem>
                    <SelectItem value="Secondary">Secondary</SelectItem>
                    <SelectItem value="Higher Secondary">Higher Secondary</SelectItem>
                    <SelectItem value="University Undergraduate">University Undergraduate</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Subject / topic">
                <Input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Operating Systems — Memory Management"
                />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label={`Total questions — ${count}`}>
                <Stepper value={count} min={3} max={10} onChange={setCount} icon={<ListChecks className="h-3.5 w-3.5" />} />
              </Field>
              <Field label={`Time limit — ${timer} min`}>
                <Stepper value={timer} min={5} max={45} step={5} onChange={setTimer} icon={<Timer className="h-3.5 w-3.5" />} />
              </Field>
            </div>

            <Field label="Syllabus context or reference material">
              <Textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={5}
                placeholder="Paste study notes, key definitions, or the exact scope the AI should test against…"
                className="resize-none"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                The AI uses this as ground truth when grading nuance and identifying gaps.
              </p>
            </Field>

            <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-accent/40 p-4">
              <div className="flex items-start gap-3 text-sm">
                <AlertCircle className="mt-0.5 h-4 w-4 text-primary" />
                <div>
                  <div className="font-medium text-foreground">AI examiner will adapt automatically</div>
                  <div className="text-muted-foreground">Vocabulary, probing depth, and grading rubric scale to the selected level.</div>
                </div>
              </div>
              <Button onClick={createSession} disabled={!topic.trim()} className="shrink-0">
                <Plus className="h-4 w-4" /> Create session
              </Button>
            </div>
          </div>
        </Card>

        {/* Active sessions */}
        <Card>
          <CardHeader
            title="Active sessions"
            subtitle="Live viva links your students can join."
            icon={<BookOpen className="h-4 w-4" />}
          />
          <div className="divide-y divide-border">
            {sessions.map((s) => (
              <div key={s.id} className="group p-5 transition-colors hover:bg-secondary/60">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="rounded-full text-[10px] font-medium uppercase tracking-wider">
                        {s.level.split(" ")[0]}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{s.questionCount} Q · {s.timerMinutes} min</span>
                    </div>
                    <div className="mt-1.5 truncate text-sm font-semibold">{s.title}</div>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="h-1.5 w-36 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full gradient-primary"
                          style={{ width: `${(s.completed / s.total) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {s.completed}/{s.total} completed
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-70 group-hover:opacity-100"
                    disabled={s.reports.length === 0}
                    onClick={() => onViewReports(s)}
                  >
                    Reports <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}

/* ---------------- Student Setup ---------------- */

function StudentSetup({
  sessions,
  onStart,
}: {
  sessions: Session[];
  onStart: (s: Session, student: { name: string; roll: string }) => void;
}) {
  const [name, setName] = useState("Ananya Iyer");
  const [roll, setRoll] = useState("CS21B045");
  const [selected, setSelected] = useState<string>(sessions[0]?.id ?? "");
  const session = sessions.find((s) => s.id === selected);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary shadow-elegant">
          <GraduationCap className="h-6 w-6 text-primary-foreground" />
        </div>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight">Ready for your viva?</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Verify your details and select the session assigned to you.
        </p>
      </div>

      <Card className="mt-8">
        <div className="space-y-5 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Full name">
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <Field label="Roll number / ID">
              <Input value={roll} onChange={(e) => setRoll(e.target.value)} />
            </Field>
          </div>
          <Field label="Assigned viva session">
            <Select value={selected} onValueChange={setSelected}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {sessions.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {session && (
            <div className="grid gap-3 rounded-xl border border-border bg-secondary/50 p-4 text-sm sm:grid-cols-3">
              <Meta icon={<GraduationCap className="h-3.5 w-3.5" />} label="Level" value={session.level} />
              <Meta icon={<ListChecks className="h-3.5 w-3.5" />} label="Questions" value={String(session.questionCount)} />
              <Meta icon={<Clock className="h-3.5 w-3.5" />} label="Time limit" value={`${session.timerMinutes} min`} />
            </div>
          )}

          <div className="rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-4 w-4 text-warning" style={{ color: "var(--warning)" }} />
              <div className="text-foreground/80">
                Once you start, the timer begins. Speak clearly — the AI examiner may ask follow-up probing questions.
              </div>
            </div>
          </div>

          <Button
            className="w-full"
            size="lg"
            disabled={!session || !name.trim() || !roll.trim() || (session?.questions.length ?? 0) === 0}
            onClick={() => session && onStart(session, { name, roll })}
          >
            <Play className="h-4 w-4" /> Start viva session
          </Button>
          {session && session.questions.length === 0 && (
            <p className="text-center text-xs text-muted-foreground">
              This session has no questions authored yet. Try “Operating Systems” or “Primary Science”.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}

/* ---------------- Student Exam ---------------- */

function StudentExam({
  session,
  student,
  onFinish,
}: {
  session: Session;
  student: { name: string; roll: string };
  onFinish: (r: VivaReport) => void;
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [seconds, setSeconds] = useState(session.timerMinutes * 60);

  useEffect(() => {
    const iv = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(iv);
  }, []);

  const total = session.questions.length;
  const isLast = index === total - 1;
  const progress = ((index + 1) / total) * 100;

  const submit = () => {
    const nextAnswers = [...answers, current];
    setAnswers(nextAnswers);
    setCurrent("");
    if (isLast) {
      const report = buildReport(session, student, nextAnswers, session.timerMinutes * 60 - seconds);
      onFinish(report);
      return;
    }
    setIndex((i) => i + 1);
  };

  const simulateMic = () => {
    const pool = sampleAnswers.default;
    setCurrent(pool[Math.floor(Math.random() * pool.length)]);
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Progress header */}
      <Card className="p-5">
        <div className="mb-3 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 font-medium">
            <span className="text-primary">Question {index + 1}</span>
            <span className="text-muted-foreground">of {total}</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1 font-mono text-xs">
            <Clock className="h-3.5 w-3.5 text-primary" /> {mm}:{ss}
          </div>
        </div>
        <Progress value={progress} className="h-1.5" />
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>{student.name} · {student.roll}</span>
          <span>{session.title}</span>
        </div>
      </Card>

      {/* AI Examiner card */}
      <Card key={index} className="animate-slide-up overflow-hidden">
        <div className="gradient-primary p-6">
          <div className="flex items-center gap-3">
            <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-white/15 backdrop-blur">
              <Brain className="h-5 w-5 text-primary-foreground" />
              <span className="absolute inset-0 rounded-xl border-2 border-white/40 animate-pulse-ring" />
            </div>
            <div className="text-primary-foreground">
              <div className="text-xs font-medium uppercase tracking-widest opacity-80">AI Examiner</div>
              <div className="flex items-center gap-2 text-xs opacity-90">
                <span className="flex gap-1">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" style={{ animationDelay: "150ms" }} />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" style={{ animationDelay: "300ms" }} />
                </span>
                Listening & probing
              </div>
            </div>
          </div>
          <p className="mt-5 text-lg font-medium leading-relaxed text-primary-foreground">
            {session.questions[index]}
          </p>
        </div>

        <div className="space-y-4 p-6">
          <Label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Your response
          </Label>
          <Textarea
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            rows={6}
            className="resize-none text-base"
            placeholder="Type your answer, or use the mic button to simulate speech-to-text…"
          />
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="outline" onClick={simulateMic} className="gap-2">
              <Mic className="h-4 w-4 text-primary" />
              Simulate mic (speech-to-text)
            </Button>
            <Button onClick={submit} disabled={!current.trim()} size="lg" className="gap-2">
              {isLast ? "Finalize & submit viva" : "Submit answer & continue"}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function buildReport(
  session: Session,
  student: { name: string; roll: string },
  answers: string[],
  elapsed: number,
): VivaReport {
  // If we have a canned report for this session, personalize it
  const base = session.reports[0];
  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");
  if (base) {
    return {
      ...base,
      studentName: student.name,
      rollNumber: student.roll,
      timeElapsed: `${mm}:${ss}`,
      transcript: session.questions.map((q, i) => {
        const canned = base.transcript[i];
        return canned
          ? { ...canned, question: q, studentResponse: answers[i] || canned.studentResponse }
          : {
              question: q,
              studentResponse: answers[i] || "—",
              aiProbe: "Can you elaborate on that with a specific example?",
              strengths: ["Attempted the concept"],
              weaknesses: ["Response lacked depth"],
              score: 70,
            };
      }),
    };
  }
  return {
    studentName: student.name,
    rollNumber: student.roll,
    sessionTitle: session.title,
    overallScore: 76,
    clarity: 80,
    timeElapsed: `${mm}:${ss}`,
    transcript: session.questions.map((q, i) => ({
      question: q,
      studentResponse: answers[i] || "—",
      aiProbe: "Could you connect this to a real-world example?",
      strengths: ["Correct core concept"],
      weaknesses: ["Missed nuance in edge cases"],
      score: 76,
    })),
  };
}

/* ---------------- Report ---------------- */

function ReportView({ report, onBack }: { report: VivaReport; onBack: () => void }) {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Button>
        <Button variant="outline" onClick={() => window.print()} className="gap-2">
          <Printer className="h-4 w-4" /> Print certificate
        </Button>
      </div>

      {/* Scorecard */}
      <Card className="overflow-hidden">
        <div className="gradient-primary p-8 text-primary-foreground">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs font-medium uppercase tracking-widest opacity-80">Viva performance report</div>
              <h1 className="mt-1 text-2xl font-semibold">{report.studentName}</h1>
              <p className="text-sm opacity-80">{report.rollNumber} · {report.sessionTitle}</p>
            </div>
            <Award className="h-10 w-10 opacity-80" />
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <BigMetric label="Overall score" value={`${report.overallScore}%`} />
            <BigMetric label="Conceptual clarity" value={`${report.clarity}/100`} />
            <BigMetric label="Time elapsed" value={report.timeElapsed} />
          </div>
        </div>
      </Card>

      {/* Transcript */}
      <Card>
        <CardHeader
          title="Interactive transcript"
          subtitle="Expand each question to see the AI's probing, your response, and detailed feedback."
          icon={<FileText className="h-4 w-4" />}
        />
        <div className="p-2 pt-0 sm:p-4 sm:pt-0">
          <Accordion type="single" collapsible defaultValue="q-0" className="w-full">
            {report.transcript.map((t, i) => (
              <AccordionItem key={i} value={`q-${i}`} className="border-b last:border-b-0">
                <AccordionTrigger className="px-3 py-4 hover:no-underline">
                  <div className="flex flex-1 items-center gap-3 pr-4 text-left">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {i + 1}
                    </span>
                    <span className="flex-1 text-sm font-medium">{t.question}</span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "shrink-0 rounded-full font-mono text-xs",
                        t.score >= 85 && "border-success/40 text-[color:var(--success)]",
                        t.score < 70 && "border-destructive/40 text-destructive",
                      )}
                    >
                      {t.score}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-3 pb-5">
                  <div className="space-y-4 pl-10">
                    <TranscriptBlock label="Your response" tone="neutral">
                      {t.studentResponse}
                    </TranscriptBlock>
                    <TranscriptBlock label="AI probing follow-up" tone="primary">
                      {t.aiProbe}
                    </TranscriptBlock>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <FeedbackList
                        title="Strengths"
                        items={t.strengths}
                        tone="success"
                        icon={<CheckCircle2 className="h-3.5 w-3.5" />}
                      />
                      <FeedbackList
                        title="Gaps to address"
                        items={t.weaknesses.length ? t.weaknesses : ["No significant gaps"]}
                        tone="destructive"
                        icon={<AlertCircle className="h-3.5 w-3.5" />}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Card>
    </div>
  );
}

function TranscriptBlock({
  label,
  tone,
  children,
}: {
  label: string;
  tone: "neutral" | "primary";
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4 text-sm",
        tone === "neutral" && "border-border bg-secondary/50",
        tone === "primary" && "border-primary/25 bg-accent/40",
      )}
    >
      <div
        className={cn(
          "mb-1 text-[10px] font-semibold uppercase tracking-widest",
          tone === "primary" ? "text-primary" : "text-muted-foreground",
        )}
      >
        {label}
      </div>
      <div className="leading-relaxed text-foreground/90">{children}</div>
    </div>
  );
}

function FeedbackList({
  title,
  items,
  tone,
  icon,
}: {
  title: string;
  items: string[];
  tone: "success" | "destructive";
  icon: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        tone === "success" && "border-success/30",
        tone === "destructive" && "border-destructive/30",
      )}
      style={{
        backgroundColor:
          tone === "success"
            ? "color-mix(in oklab, var(--success) 8%, transparent)"
            : "color-mix(in oklab, var(--destructive) 6%, transparent)",
      }}
    >
      <div
        className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest"
        style={{ color: tone === "success" ? "var(--success)" : "var(--destructive)" }}
      >
        {icon} {title}
      </div>
      <ul className="space-y-1.5 text-sm text-foreground/85">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-foreground/40" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- Primitives ---------------- */

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card text-card-foreground shadow-card",
        className,
      )}
    >
      {children}
    </div>
  );
}

function CardHeader({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border p-6">
      <div>
        <div className="flex items-center gap-2">
          {icon && (
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary">
              {icon}
            </span>
          )}
          <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        </div>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}

function Stepper({
  value,
  min,
  max,
  step = 1,
  onChange,
  icon,
}: {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  icon?: React.ReactNode;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="rounded-xl border border-input bg-background p-3">
      <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">{icon} min {min}</span>
        <span>max {max}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
        style={{
          background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${pct}%, var(--muted) ${pct}%, var(--muted) 100%)`,
        }}
      />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  hint?: string;
  tone: "primary" | "success" | "warning";
}) {
  const toneColor =
    tone === "primary" ? "var(--primary)" : tone === "success" ? "var(--success)" : "var(--warning)";
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div
          className="grid h-9 w-9 place-items-center rounded-lg"
          style={{
            color: toneColor,
            backgroundColor: `color-mix(in oklab, ${toneColor} 12%, transparent)`,
          }}
        >
          {icon}
        </div>
        <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
          {label}
        </div>
      </div>
      <div className="mt-4 text-3xl font-semibold tracking-tight">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </Card>
  );
}

function BigMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
      <div className="text-[10px] font-medium uppercase tracking-widest opacity-80">{label}</div>
      <div className="mt-1 text-3xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}

function Meta({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 text-muted-foreground">{icon}</span>
      <div>
        <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}
