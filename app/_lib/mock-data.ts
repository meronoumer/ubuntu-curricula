// ─── Session ──────────────────────────────────────────────────────────────────

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

// ─── Steps ────────────────────────────────────────────────────────────────────

export type StepType = "instruction" | "activity" | "reflection" | "discussion";

export type Step = {
  title: string;
  type: StepType;
  durationMinutes: number;
  content: string;
  facilitatorNote?: string;
};

export const MOCK_STEPS: Record<string, Step[]> = {
  "session-001": [
    {
      title: "Welcome & Space Setting",
      type: "instruction",
      durationMinutes: 10,
      content:
        "Welcome participants and invite everyone to sit in a circle. Explain that this is a space of mutual respect where every voice matters. Ask each person to share their name and one word that describes how they are feeling right now.",
      facilitatorNote:
        "Gauge the energy in the room. If tension is high, do an extra grounding breath before moving on.",
    },
    {
      title: "What is Ubuntu?",
      type: "instruction",
      durationMinutes: 15,
      content:
        '"Umuntu ngumuntu ngabantu" — a person is a person through other persons. Introduce the Ubuntu philosophy as a way of being rooted in interconnectedness, not just a slogan. Show examples of Ubuntu in everyday community decisions: sharing resources, collective grieving, celebrating together.',
      facilitatorNote:
        "Avoid making this feel like a lecture. Ask probing questions: 'When did you last feel truly held by your community?'",
    },
    {
      title: "Personal Reflection",
      type: "reflection",
      durationMinutes: 10,
      content:
        "Ask participants to take 5 minutes of quiet reflection on the following: Think of a moment in your life when you needed your community and they showed up for you. What did that feel like? What made it possible?",
      facilitatorNote:
        "Keep the room quiet and calm during writing time. Gentle background music is appropriate.",
    },
    {
      title: "Small Group Sharing",
      type: "discussion",
      durationMinutes: 20,
      content:
        "Divide into groups of 3–4. Each person shares their reflection for 2 minutes without interruption. After everyone has shared, the group identifies one common thread across all stories and names it.",
      facilitatorNote:
        "Walk between groups. Listen for powerful moments — you may want to invite a group to share with the full room later.",
    },
    {
      title: "Ubuntu in Action",
      type: "activity",
      durationMinutes: 15,
      content:
        "Whole group activity: pose a simple challenge (e.g., 'One person needs to cross the room with their eyes closed'). Let the group solve it without instructions. Debrief afterward — what Ubuntu principles emerged naturally?",
      facilitatorNote:
        "This activity usually generates laughter and energy. Use it to lift the room before the final reflection.",
    },
    {
      title: "Closing Circle",
      type: "reflection",
      durationMinutes: 10,
      content:
        "Return to the full circle. Go around and invite each participant to complete this sentence: 'Because of Ubuntu, I will…'. Close with a group affirmation chosen by the participants.",
      facilitatorNote:
        "Do not rush the closing. Allow silence after each person speaks. Thank everyone genuinely before dismissing.",
    },
  ],

  "session-002": [
    {
      title: "Check-In: Temperature Reading",
      type: "instruction",
      durationMinutes: 10,
      content:
        "Open the session by asking each participant to rate their current emotional temperature from 1 (cold/distant) to 10 (warm/connected). Note the range publicly. Acknowledge that conflict often lives in the gap between people's temperatures.",
      facilitatorNote:
        "If most readings are low, slow down. Do not rush into conflict content when trust is fragile.",
    },
    {
      title: "The Anatomy of Conflict",
      type: "instruction",
      durationMinutes: 20,
      content:
        "Walk through the three layers of most conflicts: (1) Positions — what people say they want, (2) Interests — why they want it, (3) Needs — the deeper human need underneath. Use a simple example: two siblings arguing over the last orange (one wants the peel, the other wants the juice).",
      facilitatorNote:
        "The orange example is well known. Ask if anyone has a real community example they are willing to share instead — lived stories land harder.",
    },
    {
      title: "Active Listening Practice",
      type: "activity",
      durationMinutes: 20,
      content:
        "Pair participants. Person A speaks for 90 seconds about a minor frustration (not with anyone in the room). Person B listens without interrupting, then reflects back what they heard using: 'What I heard you say is… Is that right?' Swap roles. Debrief: what was hard about listening fully?",
      facilitatorNote:
        "90 seconds feels long. Encourage Person B to resist the urge to fix or advise. Pure listening is the skill.",
    },
    {
      title: "Mapping a Real Conflict",
      type: "reflection",
      durationMinutes: 15,
      content:
        "Individually, participants choose a conflict they are currently navigating (personal or professional). Using the Positions / Interests / Needs framework, they map out both their own and the other party's layers on paper.",
      facilitatorNote:
        "Remind them this stays private unless they choose to share. Some participants may get emotional — have water and tissues available.",
    },
    {
      title: "Commitment & Closing",
      type: "reflection",
      durationMinutes: 10,
      content:
        "Each participant writes one specific action they will take in the next 7 days to move toward resolution in the conflict they mapped. Volunteers share with the group. Close by reading the Ubuntu principle together: 'I am because we are.'",
      facilitatorNote:
        "Collect the action commitments (with permission) so you can follow up at the next session.",
    },
  ],

  "session-003": [
    {
      title: "Opening: Why Stories Matter",
      type: "instruction",
      durationMinutes: 10,
      content:
        "Begin with a short story of your own — a moment from your life that shaped how you see community. Keep it under 3 minutes. Explain that today the group will build a shared story map of their collective experience.",
      facilitatorNote:
        "Your vulnerability sets the tone. Choose a story that is real and has texture — not a polished anecdote.",
    },
    {
      title: "Story Harvest",
      type: "activity",
      durationMinutes: 30,
      content:
        "Each participant takes 10 minutes to write the outline of a personal story on the theme: 'A moment that changed how I see community.' Story cards are pinned to a wall or laid on the floor. Participants silently browse each other's stories and place a dot sticker on any story that resonates with them.",
      facilitatorNote:
        "Play soft instrumental music during the silent reading. The dot-voting creates natural conversation openers afterward.",
    },
    {
      title: "Deep Listening Circle",
      type: "discussion",
      durationMinutes: 25,
      content:
        "The 2–3 stories with the most dots are shared aloud by their authors. After each story, the group holds 30 seconds of silence before responding. Responses must begin with: 'What your story made me feel was…' or 'Your story reminded me of…'",
      facilitatorNote:
        "Protect the silence after each story. Do not let participants rush to fill it — the silence is part of the ritual.",
    },
    {
      title: "Closing: The Thread We Share",
      type: "reflection",
      durationMinutes: 10,
      content:
        "Ask the group: 'What single thread runs through all the stories we heard today?' Record responses on a flip chart. The group agrees on one sentence that names the shared thread. This becomes the cohort's story seed — a touchstone for future sessions.",
      facilitatorNote:
        "Photograph the flip chart. This sentence will be referenced in later sessions.",
    },
  ],

  "session-004": [
    {
      title: "The Leadership Landscape",
      type: "instruction",
      durationMinutes: 15,
      content:
        "Open with a question: 'Who counts as a leader in your community?' Capture answers without judgment. Then introduce two models side by side: hierarchical leadership (authority flows from the top) vs. Ubuntu-rooted leadership (authority flows from relationships and trust).",
      facilitatorNote:
        "Avoid framing hierarchy as purely bad — many communities rely on it. The goal is to examine which model serves the current need.",
    },
    {
      title: "Leadership Spectrum Activity",
      type: "activity",
      durationMinutes: 20,
      content:
        "Read out a series of real decision scenarios (resource allocation, conflict mediation, urgent crisis, long-term planning). For each one, participants physically move to one side of the room to indicate whether they believe hierarchical or collective leadership is more appropriate. Discuss the disagreements.",
      facilitatorNote:
        "The movement gets energy into the room. Disagreements are the most valuable moments — do not resolve them too quickly.",
    },
    {
      title: "Consensus Practice",
      type: "activity",
      durationMinutes: 25,
      content:
        "Give the group a real-ish decision to make together: 'You have 3 hours and a small budget to strengthen your cohort's sense of community before the program ends. Decide how to use it.' They must reach consensus — unanimous consent, not majority vote. Observe the process.",
      facilitatorNote:
        "Do not intervene unless the group gets stuck for more than 5 minutes. Let them feel the friction of consensus. Debrief the process, not just the outcome.",
    },
    {
      title: "My Leadership Edge",
      type: "reflection",
      durationMinutes: 10,
      content:
        "Individuals reflect in writing: 'Where in my leadership do I default to control rather than trust? What would it look like to lead with Ubuntu in that situation?'",
      facilitatorNote:
        "This is the deepest reflection of the session. Give the full 10 minutes without interruption.",
    },
    {
      title: "Accountability Partners",
      type: "activity",
      durationMinutes: 10,
      content:
        "Participants pair up as accountability partners for the next 30 days. Each person shares one leadership intention with their partner. Partners exchange contact details and agree on a check-in method.",
      facilitatorNote:
        "Encourage pairs to be from different organizations or backgrounds for maximum learning.",
    },
    {
      title: "Harvesting Wisdom",
      type: "discussion",
      durationMinutes: 10,
      content:
        "Full group: each person contributes one insight from today to a shared 'wisdom harvest' — written on a card and read aloud. Compile the harvest into a one-page handout to be distributed at the next session.",
      facilitatorNote:
        "Photograph all cards. Someone on your team should type these up before the next session.",
    },
    {
      title: "Closing Ritual",
      type: "reflection",
      durationMinutes: 5,
      content:
        "Stand in a circle. Each person places one hand on the shoulder of the person to their left. In silence, the group breathes together three times. The facilitator closes: 'We lead together or not at all.'",
      facilitatorNote:
        "This physical ritual is intentional — it embodies the Ubuntu leadership model. Do not skip it.",
    },
  ],
};
