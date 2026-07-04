export type Level = "Primary (Class 3-5)" | "Secondary" | "Higher Secondary" | "University Undergraduate";

export interface TranscriptEntry {
  question: string;
  studentResponse: string;
  aiProbe: string;
  strengths: string[];
  weaknesses: string[];
  score: number;
}

export interface VivaReport {
  studentName: string;
  rollNumber: string;
  sessionTitle: string;
  overallScore: number;
  clarity: number;
  timeElapsed: string;
  transcript: TranscriptEntry[];
}

export interface Session {
  id: string;
  title: string;
  level: Level;
  questionCount: number;
  timerMinutes: number;
  syllabusContext: string;
  completed: number;
  total: number;
  status: "active" | "draft";
  questions: string[];
  reports: VivaReport[];
}

export const initialSessions: Session[] = [
  {
    id: "ses-os-01",
    title: "Operating Systems — Memory Management",
    level: "University Undergraduate",
    questionCount: 5,
    timerMinutes: 15,
    syllabusContext:
      "Virtual memory, paging, segmentation, TLB, page replacement algorithms (LRU, FIFO, Optimal), thrashing, working set model.",
    completed: 18,
    total: 24,
    status: "active",
    questions: [
      "Explain the concept of virtual memory and why modern operating systems rely on it.",
      "What is the difference between paging and segmentation? When is each preferred?",
      "Describe how the Translation Lookaside Buffer (TLB) improves address translation.",
      "Compare LRU and FIFO page replacement. Which minimizes thrashing and why?",
      "What is the working set model and how does it help prevent thrashing?",
    ],
    reports: [
      {
        studentName: "Ananya Iyer",
        rollNumber: "CS21B045",
        sessionTitle: "Operating Systems — Memory Management",
        overallScore: 82,
        clarity: 88,
        timeElapsed: "12:47",
        transcript: [
          {
            question: "Explain the concept of virtual memory and why modern operating systems rely on it.",
            studentResponse:
              "Virtual memory allows processes to use more memory than physically available by mapping virtual addresses to physical frames on demand, backed by disk when needed.",
            aiProbe: "You mentioned mapping — what hardware structure performs that translation each cycle?",
            strengths: ["Correct use of demand paging concept", "Identified disk backing store"],
            weaknesses: ["Did not mention MMU or page tables explicitly"],
            score: 85,
          },
          {
            question: "What is the difference between paging and segmentation?",
            studentResponse:
              "Paging divides memory into fixed-size pages; segmentation divides it into variable-size logical units like code and data segments.",
            aiProbe: "Which one suffers from external fragmentation, and why?",
            strengths: ["Sharp fixed vs variable distinction"],
            weaknesses: ["Missed external fragmentation nuance in segmentation"],
            score: 78,
          },
          {
            question: "Describe how the TLB improves address translation.",
            studentResponse:
              "The TLB caches recent virtual-to-physical translations so the CPU skips walking the full page table on a hit.",
            aiProbe: "What happens on a TLB miss in a multi-level page table?",
            strengths: ["Clear cache-hit reasoning", "Correct terminology"],
            weaknesses: ["Did not describe page walk cost"],
            score: 84,
          },
          {
            question: "Compare LRU and FIFO page replacement.",
            studentResponse:
              "LRU evicts the least recently used page and generally performs better; FIFO can suffer Belady's anomaly.",
            aiProbe: "Can you give an example reference string where FIFO exhibits Belady's anomaly?",
            strengths: ["Correctly named Belady's anomaly"],
            weaknesses: ["No example reference string provided"],
            score: 80,
          },
          {
            question: "What is the working set model?",
            studentResponse:
              "It is the set of pages a process has referenced in the last delta time units; the OS keeps that resident to avoid thrashing.",
            aiProbe: "How would you tune the delta parameter in practice?",
            strengths: ["Accurate definition", "Linked to thrashing prevention"],
            weaknesses: ["Did not discuss tuning trade-offs"],
            score: 83,
          },
        ],
      },
      {
        studentName: "Rahul Mehta",
        rollNumber: "CS21B071",
        sessionTitle: "Operating Systems — Memory Management",
        overallScore: 68,
        clarity: 72,
        timeElapsed: "14:02",
        transcript: [
          {
            question: "Explain the concept of virtual memory.",
            studentResponse: "It gives each process its own address space larger than RAM using disk swap.",
            aiProbe: "Who performs the virtual-to-physical translation?",
            strengths: ["Correct intuition on isolation"],
            weaknesses: ["Missed page table and MMU"],
            score: 65,
          },
        ],
      },
    ],
  },
  {
    id: "ses-eco-01",
    title: "Primary Science — Ecosystems",
    level: "Primary (Class 3-5)",
    questionCount: 4,
    timerMinutes: 8,
    syllabusContext:
      "Producers, consumers, decomposers, food chains, habitats, examples of forest and pond ecosystems.",
    completed: 32,
    total: 40,
    status: "active",
    questions: [
      "What is a food chain? Can you give an example from a pond?",
      "Why are plants called producers?",
      "What do decomposers do in a forest?",
      "Name two animals that live in a grassland habitat.",
    ],
    reports: [
      {
        studentName: "Meera Kapoor",
        rollNumber: "5B-14",
        sessionTitle: "Primary Science — Ecosystems",
        overallScore: 91,
        clarity: 94,
        timeElapsed: "06:12",
        transcript: [
          {
            question: "What is a food chain? Give a pond example.",
            studentResponse: "Algae is eaten by small fish, small fish are eaten by big fish, and big fish are eaten by herons.",
            aiProbe: "What would happen to the herons if all the algae disappeared?",
            strengths: ["Complete 4-step chain", "Correct pond example"],
            weaknesses: ["Did not link to energy flow"],
            score: 92,
          },
          {
            question: "Why are plants called producers?",
            studentResponse: "Because they make their own food using sunlight, water, and air.",
            aiProbe: "What is the special word for this process?",
            strengths: ["Correct explanation in own words"],
            weaknesses: ["Missed the term photosynthesis"],
            score: 88,
          },
          {
            question: "What do decomposers do in a forest?",
            studentResponse: "They break down dead plants and animals so the soil gets nutrients back.",
            aiProbe: "Can you name one decomposer?",
            strengths: ["Accurate role", "Linked to soil nutrients"],
            weaknesses: ["Did not name a specific decomposer"],
            score: 93,
          },
          {
            question: "Name two grassland animals.",
            studentResponse: "Zebra and lion.",
            aiProbe: "Which one is the predator?",
            strengths: ["Correct examples"],
            weaknesses: [],
            score: 95,
          },
        ],
      },
    ],
  },
  {
    id: "ses-hist-01",
    title: "Secondary — Industrial Revolution",
    level: "Secondary",
    questionCount: 6,
    timerMinutes: 20,
    syllabusContext: "Causes of the Industrial Revolution, key inventions, social impact, urbanization.",
    completed: 11,
    total: 30,
    status: "active",
    questions: [],
    reports: [],
  },
];

export const dashboardStats = {
  activeExams: 3,
  completedTests: 61,
  averageScore: 79,
};

export const sampleAnswers: Record<string, string[]> = {
  default: [
    "The concept centers on efficiently managing shared resources so each process gets fair, isolated access without interfering with others.",
    "It uses a layered approach: an abstraction at the top hides the complexity of the hardware beneath, letting programs stay portable.",
    "In practice this improves throughput, but comes with overhead from context switches and cache pressure.",
  ],
};