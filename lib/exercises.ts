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
    title: "Sequence Recall",
    slug: "sequence-recall",
    category: "Memory",
    difficulty: "Easy",
    time: "2 min",
    built: true,
    route: "/exercises/memory-sequence",
    benefit: "Improves working memory and recall speed",
    completionRate: 72,
    about: [
      "Working memory is the cognitive system that temporarily holds and manipulates information for use in complex tasks. This exercise directly targets your phonological loop — the mechanism responsible for holding sequences of sounds and numbers in short-term storage.",
      "Research shows that working memory training strengthens the neural pathways in the prefrontal cortex responsible for short-term retention, reducing cognitive load in everyday tasks like following multi-step directions, remembering phone numbers, and performing mental arithmetic.",
    ],
    howItWorks: [
      "A sequence of 5 random digits is shown on screen.",
      "You have 3 seconds to memorize the order.",
      "The numbers disappear from view.",
      "Enter the digits in the exact order from memory.",
      "See your score and which positions were correct.",
    ],
    tips: [
      "Group numbers into pairs (chunking) rather than memorizing them individually.",
      "Repeat the sequence silently as you read — verbal rehearsal strengthens encoding.",
      "Focus on rhythm and position, not just the numbers themselves.",
    ],
    similar: ["word-pairs", "number-grid"],
  },
  {
    num: "002",
    title: "Word Pairs",
    slug: "word-pairs",
    category: "Memory",
    difficulty: "Medium",
    time: "3 min",
    built: false,
    route: null,
    benefit: "Builds associative memory for studying",
    completionRate: 48,
    about: [
      "Associative memory is the ability to link unrelated pieces of information together. This exercise trains the hippocampus to create and retrieve associations — a skill directly linked to learning new concepts, studying vocabulary, and retaining names and facts.",
      "Strong associative memory is the foundation of effective note-taking, language acquisition, and professional communication. The method used here mirrors the 'paired associate learning' tasks used in memory research and clinical neuropsychology.",
    ],
    howItWorks: [
      "Six word pairs are shown on screen simultaneously.",
      "You have 10 seconds to study and connect each pair.",
      "The right-side words are hidden.",
      "The left-side words are shown one at a time — type the matching word.",
      "See your accuracy and which associations you retained.",
    ],
    tips: [
      "Create a vivid mental image connecting the two words — the stranger the better.",
      "Say each pair out loud as you read it to activate verbal memory.",
      "Emotional or funny associations stick far better than logical ones.",
    ],
    similar: ["sequence-recall", "face-name", "story-recall"],
  },
  {
    num: "003",
    title: "Rapid Sort",
    slug: "rapid-sort",
    category: "Quick Thinking",
    difficulty: "Easy",
    time: "2 min",
    built: false,
    route: null,
    benefit: "Sharpens decision speed under pressure",
    completionRate: 68,
    about: [
      "Decision speed under constraint is a critical executive function. When forced to categorize and rank information rapidly, you engage the prefrontal cortex's ability to prioritize and sequence — a process essential in high-stakes environments.",
      "This exercise improves the brain's ability to process multiple options simultaneously and commit to a decision quickly. Accuracy is rewarded above speed — fast-but-wrong answers are penalized, training deliberate rapid thinking rather than impulsive responses.",
    ],
    howItWorks: [
      "Five items appear on screen — numbers, dates, or words.",
      "Arrange them in the specified order (ascending, alphabetical, chronological).",
      "Accuracy is scored first, speed second.",
      "Correct answers earn speed bonuses; errors subtract from your score.",
      "Rounds increase in complexity and item count.",
    ],
    tips: [
      "Scan all items before touching anything — identify the anchors (smallest, largest) first.",
      "Build from the extremes inward rather than trying to sort linearly.",
      "Speed without accuracy earns nothing here — slow is smooth, smooth is fast.",
    ],
    similar: ["task-switch", "pattern-breaker"],
  },
  {
    num: "004",
    title: "Stroop Challenge",
    slug: "stroop-challenge",
    category: "Attention Training",
    difficulty: "Medium",
    time: "3 min",
    built: false,
    route: null,
    benefit: "Trains selective attention and impulse control",
    completionRate: 44,
    about: [
      "The Stroop effect is one of psychology's most replicated findings. When the meaning of a word conflicts with a visual property (color), the brain creates cognitive interference because reading is automatic while color-naming requires deliberate attention.",
      "Training with Stroop tasks strengthens the anterior cingulate cortex, which manages conflict resolution. This measurably improves impulse control, selective attention, and the ability to filter irrelevant information — the exact cognitive mechanism exploited by social media recommendation algorithms.",
    ],
    howItWorks: [
      "A color word appears written in a conflicting ink color (e.g., 'RED' in blue ink).",
      "Tap the button matching the ink color — not the word.",
      "Work through as many prompts as possible in 60 seconds.",
      "Errors and hesitations are tracked separately.",
      "Speed and accuracy are both factored into your score.",
    ],
    tips: [
      "Defocus your reading — look at the word as a colored shape, not text.",
      "Keep your breathing steady; tension increases false responses.",
      "The faster you try to go, the more your brain defaults to reading — pace yourself.",
    ],
    similar: ["focus-filter", "distraction-wall"],
  },
  {
    num: "005",
    title: "Pattern Breaker",
    slug: "pattern-breaker",
    category: "Critical Thinking",
    difficulty: "Medium",
    time: "4 min",
    built: false,
    route: null,
    benefit: "Develops analytical pattern recognition",
    completionRate: 41,
    about: [
      "Pattern recognition is a core component of analytical intelligence — the ability to identify rules within data and detect when those rules break down. This skill is fundamental to scientific thinking, software debugging, financial analysis, and strategic planning.",
      "This exercise trains your brain to hold a rule in working memory while scanning for violations, directly strengthening the prefrontal-parietal network responsible for logical analysis and rule-governed reasoning.",
    ],
    howItWorks: [
      "A sequence of numbers or symbols is shown with an underlying rule.",
      "Study the sequence and identify the governing pattern.",
      "One element violates the rule — find and select it.",
      "The rule changes each round, increasing in complexity.",
      "Multi-step rules are introduced at harder difficulty levels.",
    ],
    tips: [
      "State the rule explicitly to yourself before scanning for violations.",
      "Work linearly through the sequence — don't jump to what 'looks different'.",
      "A violation breaks the rule, not just looks unusual — these are different things.",
    ],
    similar: ["mini-logic-grid", "rapid-sort"],
  },
  {
    num: "006",
    title: "Mini Logic Grid",
    slug: "mini-logic-grid",
    category: "Critical Thinking",
    difficulty: "Hard",
    time: "5 min",
    built: false,
    route: null,
    benefit: "Builds structured logical reasoning",
    completionRate: 29,
    about: [
      "Constraint-based deductive reasoning is the foundation of formal logic, legal analysis, and systematic problem-solving. By working through spatial and relational constraints, you activate the lateral prefrontal cortex and build 'cognitive scaffolding' — the ability to hold multiple interdependent facts and derive new information from them.",
      "This is the same skill used in programming, contract law, chess, and scientific hypothesis testing. Research shows that regular practice on constraint satisfaction problems measurably improves working memory capacity and fluid intelligence.",
    ],
    howItWorks: [
      "A short logic puzzle presents 3 people or items with positional clues.",
      "Read each clue carefully and identify what it rules out.",
      "Use elimination to determine the unique correct arrangement.",
      "Submit your answer when certain.",
      "A step-by-step reasoning explanation is shown after each puzzle.",
    ],
    tips: [
      "Start with absolute constraints ('X is NOT in position 2') before relative ones.",
      "Write down or mentally tag each constraint as a rule you can return to.",
      "When stuck, pick the most constrained variable — the one with fewest valid positions.",
    ],
    similar: ["pattern-breaker", "task-switch"],
  },
  {
    num: "007",
    title: "Focus Filter",
    slug: "focus-filter",
    category: "Attention Training",
    difficulty: "Medium",
    time: "3 min",
    built: false,
    route: null,
    benefit: "Trains focus against digital distractions",
    completionRate: 46,
    about: [
      "Selective attention is the ability to focus on a specific stimulus while ignoring distracting ones. In an era of infinite scrolling and notification culture, this is one of the most eroded cognitive skills in the adult population.",
      "Focus Filter is modeled after continuous performance tasks used in ADHD research and neuropsychological assessment. Regular training strengthens the dorsal attention network and measurably reduces impulsive responses to irrelevant stimuli — the exact mechanism exploited by social media feed algorithms.",
    ],
    howItWorks: [
      "A target symbol is displayed at the start of the round.",
      "A grid of symbols flashes rapidly in sequence.",
      "Tap only when the target symbol appears.",
      "Tapping non-targets reduces your score.",
      "Missed targets also reduce your score — both errors and omissions count.",
    ],
    tips: [
      "Keep your eyes soft and relaxed on the center of the grid — don't scan aggressively.",
      "Let the target come to you rather than searching for it.",
      "Breathe steadily — physical tension directly increases false positive responses.",
    ],
    similar: ["stroop-challenge", "sustained-watch", "distraction-wall"],
  },
  {
    num: "008",
    title: "Sustained Watch",
    slug: "sustained-watch",
    category: "Attention Training",
    difficulty: "Hard",
    time: "5 min",
    built: false,
    route: null,
    benefit: "Develops patience and sustained concentration",
    completionRate: 23,
    about: [
      "Sustained attention — maintaining focus over time without a reward signal — is among the rarest and most valuable cognitive skills in the modern world. Unlike most brain training apps that reward speed, Sustained Watch rewards patience and observation.",
      "It is directly modeled on the SART (Sustained Attention to Response Task), a clinical tool used to measure attentional capacity. Regular practice measurably extends the duration of focused attention and reduces mind-wandering frequency — a key predictor of cognitive performance and wellbeing.",
    ],
    howItWorks: [
      "A pattern is displayed that changes subtly at some point over 60 seconds.",
      "Watch carefully and do not interact with the screen.",
      "When you detect the change, tap the screen immediately.",
      "Tapping before the change occurs is penalized.",
      "The timing and location of the change varies each round.",
    ],
    tips: [
      "Resist the urge to tap early — patience is the entire exercise.",
      "Observe the whole pattern with soft focus, not one specific area.",
      "This exercise rewards slow, deliberate attention over reactive clicking.",
    ],
    similar: ["focus-filter", "distraction-wall"],
  },
  {
    num: "009",
    title: "Task Switch",
    slug: "task-switch",
    category: "Cognitive Flexibility",
    difficulty: "Hard",
    time: "4 min",
    built: false,
    route: null,
    benefit: "Improves mental flexibility and multitasking",
    completionRate: 31,
    about: [
      "Cognitive flexibility — the ability to switch between mental rules without confusion — is a key executive function. Every time we switch tasks in daily life there is a measurable 'switch cost' in reaction time and accuracy. Task Switch training directly reduces this cost.",
      "Research links strong cognitive flexibility to better multitasking performance, reduced stress when interrupted at work, and more efficient learning across domains. This exercise targets the same neural circuits trained in professional air traffic controllers and emergency dispatchers.",
    ],
    howItWorks: [
      "Two alternating rules are shown at the top of the screen.",
      "The active rule switches at regular intervals.",
      "Apply the current rule to the items that appear.",
      "Errors and hesitation time are both tracked.",
      "Switch intervals shorten as your accuracy improves.",
    ],
    tips: [
      "Don't anticipate the next rule — stay fully committed to the current one.",
      "After a switch, take one deliberate breath before responding.",
      "The penalty for errors is higher than for a brief hesitation — accuracy first.",
    ],
    similar: ["rapid-sort", "reverse-it"],
  },
  {
    num: "010",
    title: "Reverse It",
    slug: "reverse-it",
    category: "Cognitive Flexibility",
    difficulty: "Easy",
    time: "2 min",
    built: false,
    route: null,
    benefit: "Strengthens cognitive processing and agility",
    completionRate: 74,
    about: [
      "Mental reversal tasks engage the visuospatial sketchpad and working memory simultaneously. Reversing words or sequences requires holding the original in memory while constructing a transformed version — a dual-task that directly taxes cognitive processing capacity.",
      "Athletes use similar techniques for spatial training, and linguists use reversal tasks to study phonological processing. It is a deceptively simple exercise with measurable impact on processing speed and cognitive agility — and an excellent warm-up before more demanding training.",
    ],
    howItWorks: [
      "A word or short sequence appears on screen.",
      "Type it backwards — letter by letter, in reverse order.",
      "For sentence variants, identify and type the last word first.",
      "Speed and accuracy are both scored.",
      "Word length and complexity increase with difficulty.",
    ],
    tips: [
      "Visualize the word as a physical object and scan it right-to-left.",
      "For longer words, break into chunks and reverse each chunk separately.",
      "Accuracy before speed — a wrong fast answer scores lower than a correct slow one.",
    ],
    similar: ["task-switch", "rapid-sort"],
  },
  {
    num: "011",
    title: "Number Grid",
    slug: "number-grid",
    category: "Memory",
    difficulty: "Medium",
    time: "3 min",
    built: false,
    route: null,
    benefit: "Trains spatial memory and number retention",
    completionRate: 43,
    about: [
      "Spatial memory — the ability to remember the location of items in a two-dimensional grid — is one of the oldest forms of human memory, deeply linked to our hippocampal navigation systems. The brain uses grid cells and place cells to encode spatial information, and training this system improves broader recall and mental organization.",
      "This exercise combines numerical and spatial memory simultaneously, a dual-encoding challenge that engages multiple memory systems at once. The resulting interference and resolution strengthens both systems more effectively than training either in isolation.",
    ],
    howItWorks: [
      "A grid of numbers appears on screen for a fixed memorization period.",
      "The grid disappears — you see an identical but empty grid.",
      "For each number you're asked about, tap its correct cell.",
      "Score is based on accuracy of both position and value.",
      "Grid size increases as you improve.",
    ],
    tips: [
      "Focus on anchor numbers first — corners and center — then fill inward.",
      "Mentally divide the grid into quadrants and memorize by region.",
      "Say the number and its rough position aloud as you study it.",
    ],
    similar: ["sequence-recall", "face-name"],
  },
  {
    num: "012",
    title: "Story Recall",
    slug: "story-recall",
    category: "Memory",
    difficulty: "Hard",
    time: "5 min",
    built: false,
    route: null,
    benefit: "Improves reading comprehension and retention",
    completionRate: 27,
    about: [
      "Narrative memory is our most natural and powerful memory system. The brain encodes stories — with characters, sequences, and cause-and-effect relationships — far more efficiently than abstract lists. Story Recall trains you to extract and retain key information from a short passage, then reproduce it accurately under time pressure.",
      "This is the same skill used in reading comprehension, meeting debriefs, courtroom testimony, and professional communication. Strong narrative recall is a core competency for managers, students, lawyers, and anyone who processes verbal information as a core part of their work.",
    ],
    howItWorks: [
      "A short story (5–7 sentences) is displayed for 30 seconds.",
      "Read it carefully — you will not be able to re-read it.",
      "The story disappears and 5 specific questions appear.",
      "Answer from memory — detail accuracy is scored.",
      "Later rounds include more specific and peripheral details.",
    ],
    tips: [
      "Read for structure: who, what, when, where, why — in that order.",
      "After reading, take 5 seconds to mentally replay the story before it disappears.",
      "Don't re-read sentences — move forward and trust your first-pass encoding.",
    ],
    similar: ["word-pairs", "face-name"],
  },
  {
    num: "013",
    title: "Face & Name",
    slug: "face-name",
    category: "Memory",
    difficulty: "Medium",
    time: "4 min",
    built: false,
    route: null,
    benefit: "Strengthens social memory and name recall",
    completionRate: 45,
    about: [
      "Name-face association is widely cited as one of the most common everyday memory failures. The reason is neurological: faces are processed in the fusiform face area while names are stored as verbal labels — they don't naturally encode together without deliberate effort.",
      "This exercise trains the hippocampus to create links between visual and verbal memory systems. The techniques used here mirror those taught in memory championships and corporate sales training, and they translate directly to real-world social and professional situations.",
    ],
    howItWorks: [
      "A set of illustrated faces with names is shown for a memorization period.",
      "The faces reappear without names attached.",
      "Type the correct name for each face.",
      "Score is based on accuracy and recall time.",
      "Sets grow larger and name complexity increases with difficulty.",
    ],
    tips: [
      "Find a single distinctive facial feature and visually link it to the name.",
      "Make the association exaggerated or funny — unusual images stick better.",
      "Say 'Hi [Name]' in your head as you meet each face, as if in a real introduction.",
    ],
    similar: ["word-pairs", "story-recall"],
  },
  {
    num: "014",
    title: "Distraction Wall",
    slug: "distraction-wall",
    category: "Attention Training",
    difficulty: "Hard",
    time: "5 min",
    built: false,
    route: null,
    benefit: "Builds deep focus in high distraction environments",
    completionRate: 19,
    about: [
      "The Distraction Wall exercises the executive attention network — specifically the ability to sustain goal-directed behavior when the environment is intentionally designed to pull attention away. In clinical psychology, this maps to tasks used in ADHD treatment and anxiety management.",
      "As screens multiply and notification frequency increases, the ability to maintain focus in chaotic visual environments becomes a competitive differentiator. The distractors in this exercise are specifically designed to mimic social media mechanics — bright, varied, and optimized to attract the eye. This is the hardest attention exercise on the platform by design.",
    ],
    howItWorks: [
      "A central task is displayed — track, count, or identify a specific target.",
      "The screen fills with moving, flashing distractors designed to compete for your attention.",
      "Maintain focus on the central task only.",
      "Distractors are randomized and escalate in density each round.",
      "Your score reflects central task accuracy — distractors do not reward engagement.",
    ],
    tips: [
      "Fix your gaze on a single central point and don't let it wander.",
      "Accept that distractors exist — don't fight them, simply don't engage.",
      "Use peripheral vision for the task; reserve direct gaze for verification only.",
    ],
    similar: ["focus-filter", "stroop-challenge", "sustained-watch"],
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
