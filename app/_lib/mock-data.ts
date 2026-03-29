export type SessionStatus = "upcoming" | "in-progress" | "completed";

export type Session = {
  id: string;
  title: string;
  description: string;
  date: string;       // ISO date string
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
