export type Difficulty = "Easy" | "Medium" | "Hard";

export type Exercise = {
  num: string;
  title: string;
  slug: string;
  category: string;
  difficulty: Difficulty;
  time: string;
  built: boolean;
  route: string | null;
  benefit: string;
  completionRate: number;
  about: string[];
  howItWorks: string[];
  tips: string[];
  similar: string[];
};

export const exercises: Exercise[] = [
  {
    num: "001",
    title: "The Vault",
    slug: "the-vault",
    category: "Memory",
    difficulty: "Easy",
    time: "2 min",
    built: true,
    route: "/exercises/the-vault",
    benefit: "Improves working memory and recall speed",
    completionRate: 72,
    about: [
      "Working memory is the cognitive system that temporarily holds and manipulates information. This exercise targets your phonological loop — the mechanism responsible for holding sequences in short-term storage.",
      "Training this system strengthens neural pathways in the prefrontal cortex, reducing cognitive load in everyday tasks like following directions, remembering codes, and performing mental arithmetic.",
    ],
    howItWorks: [
      "A 5-digit combination is displayed on screen.",
      "You have 3 seconds to memorize the sequence.",
      "The numbers disappear.",
      "Enter the digits in exact order from memory.",
      "See your score and which positions you got right.",
    ],
    tips: [
      "Group numbers into pairs (chunking) rather than memorizing individually.",
      "Repeat the sequence silently as you read — verbal rehearsal strengthens encoding.",
      "Focus on rhythm and position, not just the numbers themselves.",
    ],
    similar: ["polaroid", "deja-vu"],
  },
  {
    num: "002",
    title: "Déjà Vu",
    slug: "deja-vu",
    category: "Memory",
    difficulty: "Medium",
    time: "3 min",
    built: true,
    route: "/exercises/deja-vu",
    benefit: "Builds associative memory for studying",
    completionRate: 48,
    about: [
      "Associative memory is the ability to link unrelated pieces of information. This exercise trains the hippocampus to create and retrieve associations — a skill directly linked to learning new concepts and retaining names.",
      "Strong associative memory is the foundation of effective note-taking and language acquisition. The method mirrors paired associate learning tasks used in cognitive psychology research.",
    ],
    howItWorks: [
      "Six word pairs are shown simultaneously.",
      "You have 8 seconds to study and connect each pair.",
      "The right-side words are hidden.",
      "Each left word is shown — select the matching right word from 4 options.",
      "See your accuracy and which associations you retained.",
    ],
    tips: [
      "Create a vivid mental image connecting the two words.",
      "Say each pair aloud as you read it to activate verbal memory.",
      "Emotional or funny associations stick far better than logical ones.",
    ],
    similar: ["the-vault", "whos-who", "the-dossier"],
  },
  {
    num: "003",
    title: "Hot Potato",
    slug: "hot-potato",
    category: "Quick Thinking",
    difficulty: "Easy",
    time: "2 min",
    built: true,
    route: "/exercises/hot-potato",
    benefit: "Sharpens decision speed under pressure",
    completionRate: 68,
    about: [
      "Decision speed under time constraint is a critical executive function. When forced to evaluate and respond rapidly, you engage the prefrontal cortex's ability to verify and commit — essential in high-pressure environments.",
      "This exercise improves your brain's ability to process arithmetic quickly. Accuracy is rewarded over speed — impulsive wrong answers cost more than a half-second pause.",
    ],
    howItWorks: [
      "A math equation appears on screen (e.g. 6 × 7 = 42).",
      "Decide if it is True or False before the timer runs out.",
      "Each question gives you 3 seconds to answer.",
      "Unanswered questions count as wrong.",
      "Score out of 10 at the end.",
    ],
    tips: [
      "Don't second-guess — your first instinct is usually right on simple arithmetic.",
      "Watch the result on the right side of the equals sign.",
      "Speed without accuracy earns nothing — pace yourself.",
    ],
    similar: ["shape-shifter", "color-blind"],
  },
  {
    num: "004",
    title: "Color Blind",
    slug: "color-blind",
    category: "Attention Training",
    difficulty: "Medium",
    time: "3 min",
    built: true,
    route: "/exercises/color-blind",
    benefit: "Trains selective attention and impulse control",
    completionRate: 44,
    about: [
      "The Stroop effect is one of psychology's most replicated findings. When a word's meaning conflicts with its visual color, the brain creates interference because reading is automatic while color-naming requires deliberate attention.",
      "Training with Stroop tasks strengthens the anterior cingulate cortex, measurably improving impulse control and selective attention.",
    ],
    howItWorks: [
      "A color word appears in a conflicting ink color (e.g. 'RED' in blue ink).",
      "Tap the button matching the INK COLOR — not what the word says.",
      "Each prompt gives you 3 seconds to respond.",
      "20 prompts total.",
      "Speed and accuracy are both factored into your score.",
    ],
    tips: [
      "Defocus your reading — look at the word as a colored shape, not text.",
      "Keep your breathing steady; tension increases false responses.",
      "The faster you try to go, the more your brain defaults to reading.",
    ],
    similar: ["spotlight", "the-gauntlet", "air-traffic"],
  },
  {
    num: "005",
    title: "Mastermind",
    slug: "mastermind",
    category: "Critical Thinking",
    difficulty: "Medium",
    time: "4 min",
    built: true,
    route: "/exercises/mastermind",
    benefit: "Develops analytical pattern recognition",
    completionRate: 41,
    about: [
      "Code-breaking under constraint requires systematic hypothesis testing — the same analytical skill used in debugging, scientific experimentation, and competitive intelligence. Each guess yields information that must be interpreted and acted upon.",
      "This exercise trains the prefrontal-parietal network responsible for logical deduction and rule-governed reasoning.",
    ],
    howItWorks: [
      "A secret 4-color code is generated at random.",
      "Build your guess by selecting 4 colors.",
      "Submit to receive feedback: filled circles = right color + right position, outlined = right color + wrong position.",
      "Use the feedback to narrow down the code.",
      "Crack it in 8 guesses or fewer to win.",
    ],
    tips: [
      "Start with a guess that uses 4 different colors to maximize information.",
      "Track which colors have been completely ruled out.",
      "Exact-position feedback is more valuable than color-only feedback.",
    ],
    similar: ["labyrinth", "the-dossier"],
  },
  {
    num: "006",
    title: "Labyrinth",
    slug: "labyrinth",
    category: "Critical Thinking",
    difficulty: "Hard",
    time: "5 min",
    built: true,
    route: "/exercises/labyrinth",
    benefit: "Builds structured logical reasoning",
    completionRate: 29,
    about: [
      "Constraint-based deductive reasoning is the foundation of formal logic and systematic problem-solving. By working through relational constraints, you build the ability to hold multiple interdependent facts and derive new information from them.",
      "This is the same skill used in programming, chess, and scientific hypothesis testing. Regular practice measurably improves working memory capacity and fluid intelligence.",
    ],
    howItWorks: [
      "A logic puzzle presents 3 people with 3 possible attributes.",
      "Read each clue carefully and identify what it rules out.",
      "Use elimination to determine the unique correct arrangement.",
      "Assign each person their correct attribute.",
      "3 puzzles per session, each independently scored.",
    ],
    tips: [
      "Start with absolute constraints before relative ones.",
      "Work by elimination — rule out what cannot be true.",
      "When stuck, pick the most constrained variable.",
    ],
    similar: ["mastermind", "shape-shifter"],
  },
  {
    num: "007",
    title: "Spotlight",
    slug: "spotlight",
    category: "Attention Training",
    difficulty: "Medium",
    time: "3 min",
    built: true,
    route: "/exercises/spotlight",
    benefit: "Trains focus and spatial working memory",
    completionRate: 46,
    about: [
      "Spatial working memory — remembering where something appeared in a field — is a core component of attention. It is heavily recruited during navigation, visual search, and multi-step tasks that require tracking locations across time.",
      "Spotlight directly trains the dorsal attention network and spatial memory systems simultaneously.",
    ],
    howItWorks: [
      "A 4×4 grid appears on screen.",
      "One cell briefly lights up for 1.5 seconds.",
      "The grid goes dark.",
      "Click the cell you think was highlighted.",
      "5 rounds per session.",
    ],
    tips: [
      "Note the cell's row and column separately.",
      "Use grid anchors: corners and center are easier reference points.",
      "Commit quickly — hesitation on the blank grid makes it harder.",
    ],
    similar: ["polaroid", "color-blind", "the-gauntlet"],
  },
  {
    num: "008",
    title: "The Gauntlet",
    slug: "the-gauntlet",
    category: "Attention Training",
    difficulty: "Hard",
    time: "5 min",
    built: true,
    route: "/exercises/the-gauntlet",
    benefit: "Develops sustained concentration",
    completionRate: 23,
    about: [
      "Sustained attention — maintaining focus while tracking specific events over time — is among the rarest cognitive skills in the modern world. The Gauntlet rewards patience and precise observation over speed.",
      "It is modeled on the SART (Sustained Attention to Response Task), a clinical tool used to measure attentional capacity. Regular practice extends focused attention duration and reduces mind-wandering.",
    ],
    howItWorks: [
      "A target number is shown — remember it.",
      "20 numbers flash rapidly on screen one at a time.",
      "Count how many times your target number appears.",
      "Submit your count at the end of the round.",
      "5 rounds, each with a new target and new sequence.",
    ],
    tips: [
      "Fix your gaze on the center and let numbers come to you.",
      "Tap a finger silently each time the target appears.",
      "Don't track non-target numbers; they are irrelevant.",
    ],
    similar: ["color-blind", "spotlight", "air-traffic"],
  },
  {
    num: "009",
    title: "Shape Shifter",
    slug: "shape-shifter",
    category: "Cognitive Flexibility",
    difficulty: "Hard",
    time: "4 min",
    built: true,
    route: "/exercises/shape-shifter",
    benefit: "Improves mental flexibility and rule switching",
    completionRate: 31,
    about: [
      "Cognitive flexibility — switching between mental rules without confusion — is a key executive function. Every task switch in daily life carries a 'switch cost'. Shape Shifter training directly reduces this cost.",
      "Research links strong cognitive flexibility to better performance under interruption and more efficient learning across domains.",
    ],
    howItWorks: [
      "The active rule is shown at the top of the screen.",
      "A colored shape appears — decide if it matches the current rule.",
      "Tap ✓ (matches) or ✗ (does not match).",
      "The rule changes every 5 items without warning.",
      "15 items total per session.",
    ],
    tips: [
      "Read the rule at the top before each item — don't assume it hasn't changed.",
      "After a rule switch, take one deliberate moment before responding.",
      "Accuracy is penalized more than hesitation — get it right first.",
    ],
    similar: ["labyrinth", "hot-potato"],
  },
  {
    num: "010",
    title: "Switchback",
    slug: "switchback",
    category: "Cognitive Flexibility",
    difficulty: "Easy",
    time: "2 min",
    built: true,
    route: "/exercises/switchback",
    benefit: "Strengthens cognitive processing and agility",
    completionRate: 74,
    about: [
      "Mental reversal tasks engage the visuospatial sketchpad and working memory simultaneously. Reversing a word requires holding the original in memory while constructing a transformed version — a dual-task that directly taxes cognitive processing.",
      "Deceptively simple, with measurable impact on processing speed and cognitive agility. An excellent warm-up before more demanding training.",
    ],
    howItWorks: [
      "A word appears on screen.",
      "Type it backwards, letter by letter.",
      "Submit to see if you got it right.",
      "Immediate feedback after each word.",
      "10 words per session.",
    ],
    tips: [
      "Visualize the word as a physical object and scan it right-to-left.",
      "For longer words, reverse in chunks rather than all at once.",
      "Accuracy before speed — a correct slow answer beats a wrong fast one.",
    ],
    similar: ["hot-potato", "shape-shifter"],
  },
  {
    num: "011",
    title: "Polaroid",
    slug: "polaroid",
    category: "Memory",
    difficulty: "Medium",
    time: "3 min",
    built: true,
    route: "/exercises/polaroid",
    benefit: "Trains spatial memory and pattern retention",
    completionRate: 43,
    about: [
      "Spatial memory — remembering the location of items in a grid — is linked to hippocampal navigation systems. The brain uses grid cells and place cells to encode spatial information.",
      "Polaroid combines spatial and visual memory simultaneously, a dual-encoding challenge that strengthens both systems more effectively than training either in isolation.",
    ],
    howItWorks: [
      "A 4×4 grid appears with 5 cells highlighted.",
      "You have 3 seconds to memorize the pattern.",
      "The grid goes blank.",
      "Reconstruct the pattern by clicking the correct cells.",
      "5 rounds per session — accuracy averaged across rounds.",
    ],
    tips: [
      "Focus on anchor cells first — corners and edges — then fill inward.",
      "Mentally divide the grid into quadrants and memorize by region.",
      "Think of the pattern as a shape, not individual positions.",
    ],
    similar: ["the-vault", "spotlight"],
  },
  {
    num: "012",
    title: "The Dossier",
    slug: "the-dossier",
    category: "Memory",
    difficulty: "Hard",
    time: "5 min",
    built: true,
    route: "/exercises/the-dossier",
    benefit: "Improves reading comprehension and detail retention",
    completionRate: 27,
    about: [
      "Narrative memory is our most natural and powerful memory system. The Dossier trains you to extract and retain key details from a briefing under time pressure — the same skill used in intelligence work, meeting debriefs, and professional communication.",
      "Strong narrative recall is a core competency for anyone who processes verbal information as part of their work.",
    ],
    howItWorks: [
      "A short briefing (4–6 sentences) is displayed for 30 seconds.",
      "Read carefully — you cannot re-read it.",
      "The text disappears and 5 specific questions appear.",
      "Select the correct answer from 4 options each time.",
      "3 briefings per session.",
    ],
    tips: [
      "Read for structure: who, what, when, where, why — in that order.",
      "After reading, take 3 seconds to mentally replay the key facts.",
      "Numbers, names, and locations are the most commonly tested details.",
    ],
    similar: ["deja-vu", "mastermind"],
  },
  {
    num: "013",
    title: "Who's Who",
    slug: "whos-who",
    category: "Memory",
    difficulty: "Medium",
    time: "4 min",
    built: true,
    route: "/exercises/whos-who",
    benefit: "Strengthens social memory and name recall",
    completionRate: 45,
    about: [
      "Name-face association is one of the most common everyday memory failures. Faces are processed in one brain region while names are stored as verbal labels — they don't naturally encode together without deliberate effort.",
      "This exercise trains the hippocampus to link visual and verbal memory systems, mirroring techniques taught in memory championships and professional training programs.",
    ],
    howItWorks: [
      "8 characters are shown with their names for 8 seconds.",
      "The names disappear — characters appear one at a time.",
      "Select the correct name from 4 options.",
      "8 questions per session.",
      "Score based on accuracy.",
    ],
    tips: [
      "Find a distinctive feature of each character and link it visually to their name.",
      "Make associations exaggerated or funny — unusual images stick better.",
      "Say each name to yourself as you study — verbal reinforcement helps.",
    ],
    similar: ["deja-vu", "the-dossier"],
  },
  {
    num: "014",
    title: "Air Traffic",
    slug: "air-traffic",
    category: "Attention Training",
    difficulty: "Hard",
    time: "5 min",
    built: true,
    route: "/exercises/air-traffic",
    benefit: "Builds deep focus in high-distraction environments",
    completionRate: 19,
    about: [
      "Air Traffic exercises the executive attention network — specifically the ability to track a single target in a dynamic, chaotic environment. This is the same skill trained in professional air traffic controllers and used in ADHD research.",
      "The ability to maintain object permanence under visual noise is a competitive differentiator. This is the hardest attention exercise on the platform by design.",
    ],
    howItWorks: [
      "8 dots appear on screen — one is highlighted in red.",
      "Memorize which dot is your target.",
      "All dots turn the same color and start moving.",
      "After movement stops, click the dot you were tracking.",
      "5 rounds per session.",
    ],
    tips: [
      "Fix your soft gaze on the target dot — don't follow it aggressively.",
      "Note the target's starting quadrant as a backup reference.",
      "Accept that other dots will distract you — maintain focus without fighting.",
    ],
    similar: ["color-blind", "the-gauntlet", "spotlight"],
  },
];

export const categoryList = [
  "All",
  "Memory",
  "Quick Thinking",
  "Critical Thinking",
  "Attention Training",
  "Cognitive Flexibility",
] as const;

export const dailyChallenge = exercises[0];

export function getExercise(slug: string): Exercise | undefined {
  return exercises.find((e) => e.slug === slug);
}

export function getSimilar(slugs: string[]): Exercise[] {
  return slugs.map((s) => exercises.find((e) => e.slug === s)).filter(Boolean) as Exercise[];
}

export const categoryColors: Record<string, { bg: string; text: string }> = {
  Memory:                  { bg: "#1E1828", text: "#9B82C4" },
  "Quick Thinking":        { bg: "#221A12", text: "#B87E4A" },
  "Critical Thinking":     { bg: "#121828", text: "#4A82B8" },
  "Attention Training":    { bg: "#121E16", text: "#4A9B6A" },
  "Cognitive Flexibility": { bg: "#22121C", text: "#B84A82" },
};

export const difficultyConfig: Record<string, { text: string; bg: string }> = {
  Easy:   { text: "#2DB55D", bg: "#1A2E22" },
  Medium: { text: "#C96B8A", bg: "#2E1A22" },
  Hard:   { text: "#EF4444", bg: "#2E1A1A" },
};
