// ─── Session ──────────────────────────────────────────────────────────────────

export type SessionStatus = "upcoming" | "in-progress" | "completed";

export type Session = {
  id: string;
  title: string;
  description: string;
  date: string; // ISO date string
  location: string;
  facilitator: string;
  status: SessionStatus;
  totalSteps: number;
};

export const MOCK_SESSIONS: Session[] = [
  {
    id: "session-001",
    title: "Introduction to Ubuntu Philosophy",
    description:
      "An experiential workshop exploring the core principles of Ubuntu and their application in daily community life.",
    date: "2026-04-02",
    location: "Community Hall, Nairobi",
    facilitator: "Amara Nwosu",
    status: "upcoming",
    totalSteps: 6,
  },
  {
    id: "session-002",
    title: "Conflict Resolution & Dialogue",
    description:
      "Practical tools for facilitating difficult conversations and restoring relationships within the group.",
    date: "2026-03-28",
    location: "Youth Centre, Kampala",
    facilitator: "David Osei",
    status: "in-progress",
    totalSteps: 5,
  },
  {
    id: "session-003",
    title: "Community Storytelling Circle",
    description:
      "Participants share personal stories to build trust and surface shared values across the cohort.",
    date: "2026-03-20",
    location: "Open Grounds, Kigali",
    facilitator: "Amara Nwosu",
    status: "completed",
    totalSteps: 4,
  },
  {
    id: "session-004",
    title: "Leadership & Collective Decision-Making",
    description:
      "Exploring consensus-based leadership models and how they contrast with hierarchical structures.",
    date: "2026-04-10",
    location: "Training Room B, Dar es Salaam",
    facilitator: "Fatima Diallo",
    status: "upcoming",
    totalSteps: 7,
  },
];

// ─── Steps ────────────────────────────────────────────────────────────────────

export type StepType = "instruction" | "activity" | "reflection" | "discussion";

export type Step = {
  id: string;
  title: string;
  type: StepType;
  durationMinutes: number;
  content: string;
  facilitatorNote?: string;
  required?: boolean; // defaults to true; set false for optional steps
};

export const MOCK_STEPS: Record<string, Step[]> = {
  period_foundations: [
    {
      id: "pf-1",
      title: "Opening Circle and Group Agreements",
      type: "discussion",
      durationMinutes: 8,
      content:
        "Welcome participants, introduce the session, and establish group agreements for respect, privacy, and listening. Remind students that questions are welcome and that everyone develops differently.",
      facilitatorNote:
        "Set a calm tone. Emphasize that no one is forced to share personal experiences.",
      required: true,
    },
    {
      id: "pf-2",
      title: "What Is Puberty?",
      type: "instruction",
      durationMinutes: 10,
      content:
        "Explain that puberty is a natural stage of development caused by hormones. Bodies change at different times and in different ways. Reinforce that these differences are normal.",
      facilitatorNote:
        "Keep language simple and non-judgmental. Normalize differences in timing and body changes.",
      required: true,
    },
    {
      id: "pf-3",
      title: "Body Changes During Puberty",
      type: "activity",
      durationMinutes: 12,
      content:
        "Walk through common changes during puberty, including growth, body hair, emotional changes, acne, breast development, menstruation, and voice changes. Invite students to identify which changes are physical, emotional, or social.",
      facilitatorNote:
        "Use inclusive language and avoid framing any change as embarrassing or shameful.",
      required: true,
    },
    {
      id: "pf-4",
      title: "What Is a Period?",
      type: "instruction",
      durationMinutes: 10,
      content:
        "Explain that a period is a normal part of the menstrual cycle for people with a uterus. Describe that the uterine lining builds up and sheds when pregnancy does not occur. Explain that periods often last 3–7 days and may be irregular at first.",
      facilitatorNote:
        "Focus on clarity and reassurance. This is often the section where myths surface.",
      required: true,
    },
    {
      id: "pf-5",
      title: "Symptoms, Pain, and Planning Ahead",
      type: "discussion",
      durationMinutes: 10,
      content:
        "Discuss common period symptoms such as cramps, fatigue, bloating, mood changes, and acne. Introduce practical planning strategies: tracking cycles, carrying supplies, and knowing when to seek medical help for severe pain.",
      facilitatorNote:
        "Invite anonymous questions if students seem hesitant to speak openly.",
      required: true,
    },
    {
      id: "pf-6",
      title: "Period Products and Hygiene Choices",
      type: "activity",
      durationMinutes: 15,
      content:
        "Introduce different menstrual products: disposable pads, reusable pads, tampons, menstrual cups, discs, and period underwear. Compare them by comfort, absorbency, cost, accessibility, and ease of use.",
      facilitatorNote:
        "Keep this practical. If physical examples are available, show them.",
      required: true,
    },
    {
      id: "pf-7",
      title: "Myth-Busting and Closing Reflection",
      type: "reflection",
      durationMinutes: 10,
      content:
        "Address common myths and misconceptions about periods and puberty. End with one key takeaway: periods are normal, bodies change differently, and asking for help is healthy.",
      facilitatorNote:
        "Leave time for final questions and remind students where they can seek support.",
      required: true,
    },
  ],
};