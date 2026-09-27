"use client";

import { FormEvent, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { categories, Question, questions } from "./questions";
import { questionWisdom } from "./wisdom";

const palettes = [
  ["#d8ff4f", "#b9a6ff"], ["#ff765a", "#ffd5cc"], ["#f7a8cf", "#ffdd55"],
  ["#8ce6d1", "#c8f6eb"], ["#6277ff", "#c7ceff"], ["#ffdd55", "#ff9b52"],
  ["#b79aff", "#e0d5ff"], ["#63d6f0", "#bcf2ff"], ["#ff9f68", "#ffe0c9"],
  ["#ef8eb8", "#d8ff4f"],
];

const wisdom = [
  [
    "The truest version of you rarely needs a press release.",
    "You are not a résumé with a pulse. Thank goodness.",
    "Some labels are name tags. Others are tiny cages with good branding.",
    "Self-knowledge begins when the performance gets tired.",
    "Contradictions do not make you fake. They make you three-dimensional.",
    "Being seen starts with turning the lights on for yourself.",
    "Your inner voice lives with you rent-free. At least make it a decent roommate.",
    "The parts you hide are often asking for gentleness, not an audience.",
  ],
  [
    "Healing is wildly non-linear. Terrible graph, excellent journey.",
    "Vulnerability is honesty without the flattering camera angle.",
    "A scar is not proof you were weak. It is a receipt for survival.",
    "Forgiveness can unlock the door without inviting anyone back in.",
    "Failure is sometimes a detour with suspiciously good directions.",
    "You do not have to earn enoughness. The invoice was always fake.",
    "Courage often arrives with shaky hands and does the thing anyway.",
    "Growth is awkward because the old you already knows all the lines.",
  ],
  [
    "Love is attention that remembered to stay.",
    "Good friendship is a soft place with honest mirrors.",
    "Boundaries are not walls. They are doors with working handles.",
    "The right people make honesty feel less like a cliff.",
    "We teach people how to love us by telling the truth kindly.",
    "Being needed is not the same as being known.",
    "A sincere apology does not come with a tiny courtroom defense.",
    "Connection grows in the pause after someone says, ‘Me too.’",
  ],
  [
    "Purpose is usually quieter than a movie soundtrack.",
    "A meaningful life is built in ordinary Tuesdays, inconveniently.",
    "Your calling may be less thunderbolt, more persistent nudge.",
    "Legacy is what your presence taught people to believe was possible.",
    "Hope is not denial. It is imagination wearing work boots.",
    "Sacred can look suspiciously like washing dishes with full attention.",
    "You do not need one grand purpose. A handful of honest ones will do.",
    "Sometimes the next right thing is the whole map you get.",
  ],
  [
    "Mortality is rude, but it does make the calendar more honest.",
    "The future self you keep postponing is already tapping their watch.",
    "Letting go is not dropping the story. It is loosening your grip on the ending.",
    "Time spent becoming kinder is rarely wasted.",
    "A life feels long in minutes and startlingly short in memories.",
    "Say the thing. Flowers are lovely; living ears are better.",
    "Being alive is strange, temporary, and therefore worth noticing.",
    "Forever may simply be what changes us permanently.",
  ],
  [
    "Feelings are weather reports, not government orders.",
    "Name the feeling and it loses at least one fake moustache.",
    "Peace is not always silence; sometimes it is a nervous system finally exhaling.",
    "Anger often guards a softer feeling with an unnecessarily large sword.",
    "Your reaction makes sense somewhere. Curiosity can find the address.",
    "Self-care is less scented candle, more difficult boundary. Candles still welcome.",
    "The heart and head are coworkers. Schedule the meeting.",
    "You can feel something fully without letting it drive the car.",
  ],
  [
    "Certainty is comforting. Curiosity has better stories.",
    "Changing your mind is not betrayal; sometimes it is evidence you kept listening.",
    "A belief worth keeping can survive a good question.",
    "Justice is love with its sleeves rolled up.",
    "People are rarely only one thing, despite the internet’s filing system.",
    "Mystery is not ignorance. Sometimes it is honest scale.",
    "Second chances need new behavior, not merely enthusiastic punctuation.",
    "Your worldview is a window. Clean it, but remember it is still a window.",
  ],
  [
    "An ending is often a beginning wearing dark glasses.",
    "Outgrowing a version of yourself does not make that version a mistake.",
    "Change asks for trust before it provides the evidence. Bit cheeky, really.",
    "Closed doors are sometimes protection with terrible bedside manner.",
    "You are allowed to miss a chapter you would never reread.",
    "Transitions feel like nowhere because the old map has ended.",
    "Grace often arrives disguised as timing you did not choose.",
    "Becoming requires a few goodbyes to people you used to be.",
  ],
  [
    "The life you want is often hiding behind one embarrassingly small first step.",
    "Avoidance is a talented interior decorator. It makes the waiting room cozy.",
    "Fear gets a vote, not a veto.",
    "A dream spoken aloud becomes easier to meet halfway.",
    "Freedom without intention is just a very large menu.",
    "The answer you resist may be the one already packing your suitcase.",
    "Your future does not need a perfect plan. It needs today’s honest move.",
    "Reclaiming yourself can begin with one well-placed no.",
  ],
  [
    "Gratitude gets better when it names names.",
    "A good group lets everyone be interesting, not just impressive.",
    "Friendship is a long conversation with snacks and selective amnesia.",
    "Support gets useful when it stops guessing and starts asking.",
    "Shared laughter is memory glue with terrible volume control.",
    "Celebration is not frivolous. It tells joy where to find you again.",
    "The bravest group question is often: ‘What do you need from us?’",
    "Connection is built one honest, slightly inconvenient sentence at a time.",
  ],
];

const shuffle = (items: number[]) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const STORAGE_KEY = "hmm-custom-questions-v1";
const LANGUAGE_KEY = "hmm-language-v1";
type Language = "en" | "tl";

const categoryLabelsTl = ["Sarili", "Paglago", "Ugnayan", "Layunin", "Pananaw", "Damdamin", "Paniniwala", "Pagbabago", "Hinaharap", "Barkada"];
const categoryNamesTl = ["Pagkilala sa Sarili", "Tapang at Paglago", "Ugnayan at Pagmamahal", "Kahulugan at Layunin", "Oras at Pananaw", "Damdamin at Tugon", "Pananaw sa Buhay", "Pagbabago sa Buhay", "Sarili at Hinaharap", "Barkada at Pasasalamat"];
const cardCopy = {
  en: {
    ask: "ASK THIS", reveal: "Reveal a little wisdom", wisdom: "A LITTLE WISDOM", note: "A thought to help the conversation go one layer deeper.", back: "Back to the question", slow: "NO RUSH.", pass: "PASS IT AROUND", next: "Next card", mix: "mix",
    fullScreen: "Full screen", exitFullScreen: "Exit full screen", settings: "Open card settings", previous: "Previous question", studioHeading: "Make it yours.", mixDeck: "Mix deck", addOne: "Add one", importSet: "Import set", mixIntro: "Choose what kind of conversation you feel like having.", questionUnit: "questions", shuffle: "Shuffle",
    addIntro: "Write the card you wish somebody would pull tonight.", questionLabel: "Question", questionPlaceholder: "What have you been pretending not to know?", wisdomLabel: "Little wisdom", optional: "optional", wisdomPlaceholder: "Clarity has a habit of waiting behind honesty.", category: "Category", addButton: "Add to the shuffle",
    importIntro: "Paste a list or choose a text/JSON file. One line becomes one card.", chooseFile: "Choose a question file", questionSet: "Question set", fieldHelp: "Use Question | Wisdom per line. JSON can use question, wisdom, and category fields.", defaultCategory: "Default category", importButton: "Import this set", clear: "Clear", customCard: "custom card", customCards: "custom cards", privateNote: "Saved privately in this browser. Nothing is uploaded.",
  },
  tl: {
    ask: "PAG-USAPAN NATIN", reveal: "Reveal ang little wisdom", wisdom: "LITTLE WISDOM", note: "Isang thought para mas malinaw at mas deep ang usapan.", back: "Back sa question", slow: "WALANG RUSH.", pass: "IPASA SA NEXT", next: "Next card", mix: "mix",
    fullScreen: "Full screen", exitFullScreen: "Exit full screen", settings: "Open card settings", previous: "Previous question", studioHeading: "Gawin mong sa’yo.", mixDeck: "Mix cards", addOne: "Add question", importSet: "Import set", mixIntro: "Piliin ang vibe ng conversation na gusto n’yo.", questionUnit: "questions", shuffle: "Mix",
    addIntro: "Isulat ang question na gusto mong mapili ng barkada tonight.", questionLabel: "Question", questionPlaceholder: "Ano ang matagal mo nang alam pero ayaw mo pang aminin?", wisdomLabel: "Little wisdom", optional: "optional", wisdomPlaceholder: "Madalas, nasa likod ng honesty ang clarity.", category: "Category", addButton: "Add sa deck",
    importIntro: "Mag-paste ng list or pumili ng text/JSON file. One line, one card.", chooseFile: "Pumili ng question file", questionSet: "Question set", fieldHelp: "Use Question | Wisdom per line. Puwede ring JSON with question, wisdom, and category.", defaultCategory: "Default category", importButton: "Import this set", clear: "Clear", customCard: "custom card", customCards: "custom cards", privateNote: "Private lang sa browser na ito. Walang ina-upload.",
  },
} as const;

const isAvailableInLanguage = (question: Question, language: Language) => language === "en" || Boolean(question.textTl) || Boolean(question.custom);

const categoryIndex = (value: unknown, fallback: number) => {
  if (typeof value === "number" && value >= 0 && value < categories.length) return value;
  if (typeof value === "string") {
    const exact = categories.findIndex((category, index) =>
      [...category, categoryNamesTl[index], categoryLabelsTl[index]].some((name) => name.toLowerCase() === value.toLowerCase()),
    );
    if (exact >= 0) return exact;
  }
  return fallback;
};

const normalizeImportedQuestion = (value: string, fallbackCategory: number) => {
  const text = value.trim().replace(/^\d+[.)]\s*/, "");
  const comma = text.indexOf(",");
  if (comma < 1) return { text, category: fallbackCategory };

  const possibleCategory = text.slice(0, comma).trim().toLowerCase();
  const matchedCategory = categories.findIndex((names, index) =>
    [...names, categoryNamesTl[index], categoryLabelsTl[index]].some((name) => name.toLowerCase() === possibleCategory),
  );
  const question = text.slice(comma + 1).trim();
  return matchedCategory >= 0 && question ? { text: question, category: matchedCategory } : { text, category: fallbackCategory };
};

type WisdomTheme = {
  test: RegExp;
  en: readonly [string, string];
  tl: readonly [string, string];
};

const wisdomThemes: WisdomTheme[] = [
  {
    test: /understand|misunderstood|personality|identity|authentic|sarili|pagkatao|personality|maintindihan|makilala|nami-misread/i,
    en: ["Wanting to be understood is not asking people to read your mind; it is an invitation to know you more accurately.", "Name one part people often misread, then explain what context or care would help them see it clearly."],
    tl: ["Ang gustong maintindihan ka ay hindi paghinging basahin nila ang isip mo; invitation ito para mas makilala ka nang tama.", "Name one part na madalas nilang nami-misread, then sabihin kung anong context o support ang makatutulong."],
  },
  {
    test: /friend|friendship|barkada|kaibigan|tropa/i,
    en: ["Friendship becomes deeper when people can update what they know about one another instead of holding on to an old version.", "Share one specific example and let your friends respond with curiosity before advice."],
    tl: ["Lumalalim ang friendship kapag willing tayong i-update ang pagkakakilala natin sa isa’t isa, hindi kumapit sa lumang version.", "Mag-share ng isang specific example, then hayaan munang makinig at maging curious ang friends bago mag-advice."],
  },
  {
    test: /family|parent|mother|father|sibling|pamilya|magulang|nanay|tatay|kapatid/i,
    en: ["Family can know your history well and still need help understanding who you are now.", "Describe the present need clearly without forcing the whole family story into one conversation."],
    tl: ["Puwedeng kabisado ng family ang history mo pero kailangan pa rin nilang makilala kung sino ka ngayon.", "Sabihin nang malinaw ang need mo today—hindi kailangang ayusin ang buong family story sa isang usapan."],
  },
  {
    test: /boundar|limit|respect|consent|hangganan|respeto/i,
    en: ["A boundary is not a punishment; it is clear information about what allows trust and connection to remain healthy.", "Say what you need, what you will do if the limit is crossed, and leave room for a respectful response."],
    tl: ["Ang boundary ay hindi parusa; clear information ito tungkol sa kailangan para manatiling healthy ang trust at connection.", "Sabihin ang need mo, ano ang gagawin mo kapag nalampasan ang limit, at bigyan ng room ang respectful na response."],
  },
  {
    test: /fear|afraid|anxious|worry|takot|pangamba|alala|kinakabahan/i,
    en: ["Fear often predicts the hardest possible ending and calls it certainty. Treat it as information, not a verdict.", "Name the smallest safe action that would give you real evidence instead of another hour of imagining."],
    tl: ["Mahilig ang fear na hulaan ang worst ending at tawagin itong certainty. Information siya, hindi final verdict.", "Name the smallest safe action na magbibigay ng totoong evidence kaysa isa pang oras ng pag-o-overthink."],
  },
  {
    test: /hurt|pain|heal|trauma|sakit|nasaktan|hilom|healing/i,
    en: ["Healing is not proving the pain no longer matters; it is gaining more choice in how you carry and respond to it.", "Notice what feels safer or freer now, even if the progress looks smaller than the wound."],
    tl: ["Ang healing ay hindi pagpapatunay na wala nang sakit; unti-unti itong pagkakaroon ng choice sa pagdala at pagharap dito.", "Notice kung ano ang mas safe o mas malaya ngayon, kahit mukhang mas maliit ang progress kaysa sa sugat."],
  },
  {
    test: /forgiv|apolog|sorry|repair|patawad|sorry|pagbati|magkaayos/i,
    en: ["Repair needs more than the right words: it needs a clear naming of harm, changed behavior, and patience with the other person’s timeline.", "Ask what accountability would look like now rather than trying to erase what happened."],
    tl: ["Mas higit sa tamang words ang repair: kailangan ang malinaw na pag-amin sa harm, changed behavior, at respeto sa timeline ng kabilang tao.", "Ask kung ano ang accountability ngayon kaysa piliting burahin ang nangyari."],
  },
  {
    test: /love|relationship|partner|romantic|pag-ibig|minamahal|jowa|relasyon/i,
    en: ["Love is easier to recognize as a pattern than as a promise: look at how care behaves during ordinary days, conflict, and inconvenience.", "Name the action that makes affection feel trustworthy to you, not only exciting."],
    tl: ["Mas madaling makilala ang love bilang pattern kaysa promise—tingnan kung paano ito kumikilos sa ordinary days, conflict, at inconvenience.", "Name the action na nagpaparamdam na trustworthy ang affection, hindi lang exciting."],
  },
  {
    test: /future|dream|goal|hope|pangarap|hinaharap|balang araw|gusto mong maging/i,
    en: ["A future becomes less intimidating when it stops being one giant destination and becomes a direction you can practice today.", "Choose one small move that your future self would recognize as genuine preparation."],
    tl: ["Mas hindi nakaka-overwhelm ang future kapag hindi na ito isang giant destination kundi direction na puwedeng simulan today.", "Choose one small move na makikilala ng future self mo bilang totoong preparation."],
  },
  {
    test: /change|growth|improve|better|learn|pagbabago|lumago|matuto|pinagbubuti|i-improve/i,
    en: ["Growth lasts longer when it comes from honest practice instead of dislike for who you are today.", "Turn the quality you named into one repeatable behavior small enough to try this week."],
    tl: ["Mas tumatagal ang growth kapag galing ito sa honest practice, hindi sa pagkamuhi sa kung sino ka today.", "Gawing isang repeatable behavior ang quality na binanggit mo—small enough para masubukan this week."],
  },
  {
    test: /regret|mistake|failure|wrong|pagkakamali|kabiguan|maling desisyon|pagsisisi/i,
    en: ["A mistake becomes wisdom when you keep the lesson without turning the old version of you into a permanent enemy.", "Name what you would choose differently now and the practice that can make that choice more likely."],
    tl: ["Nagiging wisdom ang mistake kapag dala mo ang lesson pero hindi mo ginagawang permanent enemy ang dating ikaw.", "Name kung ano ang pipiliin mo differently ngayon at anong practice ang tutulong para magawa iyon."],
  },
  {
    test: /happy|joy|fun|laugh|smile|saya|tawa|ngiti|masaya/i,
    en: ["Joy is not a distraction from a meaningful life; it is part of the evidence that you are present for it.", "Notice the people, pace, and conditions around that joy so you can make room for it again."],
    tl: ["Hindi distraction ang joy sa meaningful life; evidence din ito na present ka sa buhay mo.", "Notice ang people, pace, at conditions sa paligid ng saya para makagawa ka ulit ng room para rito."],
  },
  {
    test: /grateful|gratitude|thank|appreciat|pasalamat|salamat|pinahahalagahan/i,
    en: ["Gratitude becomes powerful when it is specific enough for another person to understand what their presence changed.", "Name the moment, the effect it had on you, and why you still carry it."],
    tl: ["Mas powerful ang gratitude kapag specific enough para maintindihan ng tao kung ano ang nabago ng presence niya.", "Name the moment, ang effect nito sa’yo, at bakit dala mo pa rin hanggang ngayon."],
  },
  {
    test: /angry|anger|mad|galit|inis|irita/i,
    en: ["Anger often protects a value, a boundary, or a softer hurt. Understanding its job helps you use its energy without passing the harm onward.", "Ask what needs protection or repair before deciding what action matches your values."],
    tl: ["Madalas may pinoprotektahang value, boundary, o mas malambot na sakit ang anger. Kapag alam mo ang trabaho nito, hindi mo kailangang ipasa ang harm.", "Ask kung ano ang kailangang protektahan o ayusin bago pumili ng action na tugma sa values mo."],
  },
  {
    test: /memory|remember|forget|alaala|maalala|malimutan/i,
    en: ["A memory matters not only because of what happened, but because of what it taught you to value afterward.", "Tell one sensory detail, then name the lesson or feeling you hope survives the story."],
    tl: ["Mahalaga ang memory hindi lang dahil sa nangyari kundi dahil sa itinuro nitong pahalagahan mo afterward.", "Magkuwento ng isang sensory detail, then name the lesson o feeling na gusto mong manatili."],
  },
  {
    test: /purpose|meaning|matter|why|layunin|kahulugan|saysay/i,
    en: ["Purpose is often quieter than a grand calling; it can be the repeated way you make life more honest, useful, or kind.", "Look for the value underneath your answer and one ordinary place where you can live it now."],
    tl: ["Madalas mas tahimik ang purpose kaysa grand calling; puwede itong paulit-ulit na paraan ng paggawa ng buhay na mas honest, useful, o kind.", "Hanapin ang value sa ilalim ng sagot at isang ordinary place kung saan maisasabuhay mo ito now."],
  },
  {
    test: /support|help|need|trust|safe|tulong|kailangan|tiwala|ligtas|suporta/i,
    en: ["Support works best when it is described, not guessed. Different moments may need listening, practical help, reassurance, or simply company.", "Say what would help most and what well-meant response tends to make things harder."],
    tl: ["Mas gumagana ang support kapag dini-describe, hindi hinuhulaan. Minsan listening, practical help, reassurance, o simpleng company ang kailangan.", "Sabihin kung ano ang pinaka-helpful at anong well-meant response ang mas nagpapahirap."],
  },
];

const contextualWisdomFor = (question: Question, language: Language) => {
  const source = `${question.text} ${question.textTl ?? ""}`;
  const matches = wisdomThemes.filter((theme) => theme.test.test(source));
  const primary = matches[0];
  const secondary = matches[1];

  if (!primary) {
    return language === "tl"
      ? "Mas nagiging meaningful ang sagot kapag hindi lang label ang ibinibigay. Mag-share ng isang real moment, ano ang itinuro nito sa’yo, at ano ang gusto mong dalhin forward."
      : "An answer becomes more meaningful when it moves beyond a label. Share one real moment, what it taught you, and what you want to carry forward.";
  }

  const primaryCopy = primary[language];
  const practiceCopy = (secondary ?? primary)[language][1];
  return `${primaryCopy[0]} ${practiceCopy}`;
};

const parseQuestionSet = (source: string, fallbackCategory: number): Question[] => {
  const trimmed = source.trim();
  if (!trimmed) return [];

  const makeQuestion = (text: unknown, answer: unknown, category: unknown, index: number): Question | null => {
    if (typeof text !== "string" || !text.trim()) return null;
    const normalized = normalizeImportedQuestion(text, fallbackCategory);
    return {
      id: Date.now() + index,
      text: normalized.text,
      wisdom: typeof answer === "string" && answer.trim() ? answer.trim() : undefined,
      category: categoryIndex(category, normalized.category),
      custom: true,
    };
  };

  if (trimmed.startsWith("[")) {
    const parsed = JSON.parse(trimmed) as unknown[];
    return parsed.map((item, index) => {
      if (typeof item === "string") return makeQuestion(item, "", fallbackCategory, index);
      if (item && typeof item === "object") {
        const row = item as Record<string, unknown>;
        return makeQuestion(row.question ?? row.text, row.wisdom ?? row.answer, row.category, index);
      }
      return null;
    }).filter((item): item is Question => Boolean(item));
  }

  return trimmed.split(/\r?\n/).map((line, index) => {
    const [text, ...answer] = line.split("|");
    return makeQuestion(text, answer.join("|"), fallbackCategory, index);
  }).filter((item): item is Question => Boolean(item));
};

export default function Deck() {
  const [selected, setSelected] = useState<number[]>(categories.map((_, i) => i));
  const [deck, setDeck] = useState<number[]>(questions.map((_, i) => i));
  const [customQuestions, setCustomQuestions] = useState<Question[]>([]);
  const [position, setPosition] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<"mix" | "add" | "import">("mix");
  const [moving, setMoving] = useState<"next" | "prev" | "">("");
  const [newQuestion, setNewQuestion] = useState("");
  const [newWisdom, setNewWisdom] = useState("");
  const [newCategory, setNewCategory] = useState(0);
  const [importText, setImportText] = useState("");
  const [importCategory, setImportCategory] = useState(0);
  const [notice, setNotice] = useState("");
  const [isPresenting, setIsPresenting] = useState(false);
  const [language, setLanguage] = useState<Language>("en");
  const touchStart = useRef(0);
  const cardRef = useRef<HTMLElement>(null);
  const questionTextRef = useRef<HTMLHeadingElement>(null);
  const wisdomTextRef = useRef<HTMLQuoteElement>(null);

  const allQuestions = useMemo(() => [...questions, ...customQuestions], [customQuestions]);

  useEffect(() => {
    let stored: Question[] = [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) {
        stored = parsed.filter((item) => item && typeof item.text === "string").map((item: Question) => {
          const normalized = normalizeImportedQuestion(item.text, categoryIndex(item.category, 0));
          return { ...item, text: normalized.text, category: normalized.category };
        });
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
      }
    } catch { /* An unreadable local deck should never block the built-in cards. */ }
    const storedLanguage = window.localStorage.getItem(LANGUAGE_KEY) === "tl" ? "tl" : "en";
    const key = window.setTimeout(() => {
      setCustomQuestions(stored);
      setLanguage(storedLanguage);
      setDeck(shuffle([...questions, ...stored].map((question, i) => isAvailableInLanguage(question, storedLanguage) ? i : -1).filter((i) => i >= 0)));
    }, 0);
    return () => window.clearTimeout(key);
  }, []);

  const current = allQuestions[deck[position] ?? 0] ?? questions[0];
  const category = categories[current.category];
  const palette = palettes[current.category];
  const currentText = language === "tl" && current.textTl ? current.textTl : current.text;
  const currentWisdom = language === "tl"
    ? current.wisdomTl || current.wisdom || questionWisdom[current.id] || contextualWisdomFor(current, language) || wisdom[current.category][Math.abs(current.id - 1) % wisdom[current.category].length]
    : current.wisdom || questionWisdom[current.id] || contextualWisdomFor(current, language) || wisdom[current.category][Math.abs(current.id - 1) % wisdom[current.category].length];
  const questionSize = currentText.length > 150 ? "question-xlong" : currentText.length > 95 ? "question-long" : currentText.length > 65 ? "question-medium" : "";
  const wisdomSize = currentWisdom.length > 380 ? "wisdom-xlong" : currentWisdom.length > 260 ? "wisdom-long" : currentWisdom.length > 180 ? "wisdom-medium" : "";
  const copy = cardCopy[language];
  const categoryLabel = language === "tl" ? categoryLabelsTl[current.category] : category[1];

  useLayoutEffect(() => {
    const element = revealed ? wisdomTextRef.current : questionTextRef.current;
    const card = cardRef.current;
    if (!element || !card) return;

    let frame = 0;
    const fitText = () => {
      element.style.removeProperty("font-size");
      element.scrollTop = 0;
      const styles = window.getComputedStyle(element);
      let size = Number.parseFloat(styles.fontSize);
      const measuredMaximum = Number.parseFloat(styles.maxHeight);
      const maximumHeight = Number.isFinite(measuredMaximum) ? measuredMaximum : Number.POSITIVE_INFINITY;
      const minimum = revealed ? 14 : 16;

      while (size > minimum && element.scrollHeight > maximumHeight + 1) {
        size = Math.max(minimum, size - 1);
        element.style.fontSize = `${size}px`;
      }
      element.scrollTop = 0;
    };
    const queueFit = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(fitText);
    };

    fitText();
    const observer = new ResizeObserver(queueFit);
    observer.observe(card);
    window.addEventListener("resize", queueFit);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", queueFit);
    };
  }, [currentText, currentWisdom, revealed, language, isPresenting]);

  useEffect(() => {
    const onFullscreenChange = () => setIsPresenting(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const togglePresentMode = async () => {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  };

  const move = (direction: "next" | "prev") => {
    if (moving) return;
    if (direction === "prev" && position === 0) return;
    setMoving(direction);
    window.setTimeout(() => {
      setPosition((old) => direction === "next" ? (old + 1) % deck.length : Math.max(0, old - 1));
      setRevealed(false);
      setMoving("");
    }, 180);
  };

  const reshuffle = (chosen = selected, source = allQuestions, nextLanguage = language) => {
    const pool = source.map((q, i) => chosen.includes(q.category) && isAvailableInLanguage(q, nextLanguage) ? i : -1).filter((i) => i >= 0);
    const languagePool = source.map((q, i) => isAvailableInLanguage(q, nextLanguage) ? i : -1).filter((i) => i >= 0);
    setDeck(shuffle(pool.length ? pool : languagePool));
    setPosition(0);
    setRevealed(false);
  };

  const changeLanguage = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    window.localStorage.setItem(LANGUAGE_KEY, nextLanguage);
    reshuffle(selected, allQuestions, nextLanguage);
  };

  const saveCustomQuestions = (next: Question[]) => {
    setCustomQuestions(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    reshuffle(selected, [...questions, ...next]);
  };

  const addQuestion = (event: FormEvent) => {
    event.preventDefault();
    if (!newQuestion.trim()) return;
    const card: Question = {
      id: Date.now(),
      text: newQuestion.trim(),
      wisdom: newWisdom.trim() || undefined,
      category: newCategory,
      custom: true,
    };
    saveCustomQuestions([...customQuestions, card]);
    setNewQuestion("");
    setNewWisdom("");
    setNotice(language === "tl" ? "Added na ang card—kasama na siya sa mix." : "Card added — it is now in the shuffle.");
  };

  const importQuestions = (event: FormEvent) => {
    event.preventDefault();
    try {
      const imported = parseQuestionSet(importText, importCategory);
      if (!imported.length) throw new Error("No readable questions found.");
      saveCustomQuestions([...customQuestions, ...imported]);
      setImportText("");
      setNotice(language === "tl" ? `${imported.length} card${imported.length === 1 ? "" : "s"} added sa deck.` : `${imported.length} card${imported.length === 1 ? "" : "s"} joined the deck.`);
    } catch {
      setNotice(language === "tl" ? "Check ulit ang set. Try one question per line or valid JSON." : "That set needs a second look. Try one question per line, or valid JSON.");
    }
  };

  const clearCustomQuestions = () => {
    saveCustomQuestions([]);
    setNotice(language === "tl" ? "Cleared na ang custom cards. Nandito pa rin ang built-in cards." : "Custom cards cleared. The built-in cards are still here.");
  };

  const toggleCategory = (id: number) => {
    setSelected((old) => old.includes(id) ? (old.length === 1 ? old : old.filter((x) => x !== id)) : [...old, id]);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (settingsOpen) return;
      if (event.key === "ArrowRight" || event.key === " ") move("next");
      if (event.key === "ArrowLeft") move("prev");
      if (event.key.toLowerCase() === "w") setRevealed((x) => !x);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <main className="app-shell" style={{"--card": palette[0], "--peek": palette[1]} as React.CSSProperties}>
      <header className="topbar">
        <div className="brand-lockup">
          <div className="wordmark" aria-label="Hmm"><span>HMM</span><i /></div>
          <span className="brand-note">QUESTIONS WORTH<br/>SITTING WITH</span>
        </div>
        <div className="header-actions">
          <div className="language-switch" role="group" aria-label="Question language">
            <button className={language === "en" ? "active" : ""} type="button" aria-pressed={language === "en"} onClick={() => changeLanguage("en")}>EN</button>
            <button className={language === "tl" ? "active" : ""} type="button" aria-pressed={language === "tl"} onClick={() => changeLanguage("tl")}>TL</button>
          </div>
          <button className="present-button" type="button" onClick={togglePresentMode}><b>{isPresenting ? "×" : "⛶"}</b><span>{isPresenting ? copy.exitFullScreen : copy.fullScreen}</span></button>
          <button className="menu-button" type="button" aria-label={copy.settings} onClick={() => { setSettingsOpen(true); setNotice(""); }}><span /><span /></button>
        </div>
      </header>

      <section className="stage" aria-label="Question card" onPointerDown={(e) => { touchStart.current = e.clientX; }} onPointerUp={(e) => { const distance = e.clientX - touchStart.current; if (Math.abs(distance) > 55) move(distance < 0 ? "next" : "prev"); }}>
        <div className="card-stack" aria-hidden="true"><i /><i /></div>
        <article ref={cardRef} className={`question-card ${moving ? `card-${moving}` : ""}`} aria-live="polite">
          <div className="card-meta">
            <span>{current.custom ? "Custom" : String(current.category + 1).padStart(2, "0")} · {categoryLabel}</span>
            <span>{position + 1} / {deck.length}</span>
          </div>

          {!revealed ? (
            <div className="question-face">
              <p className="eyebrow">{copy.ask}</p>
              <h1 ref={questionTextRef} className={questionSize} lang={language === "tl" ? "fil" : "en"}>{currentText}</h1>
              <button className="wisdom" type="button" onClick={() => setRevealed(true)}><span>✦</span> {copy.reveal}</button>
            </div>
          ) : (
            <div className="wisdom-face">
              <p className="eyebrow">{copy.wisdom}</p>
              <blockquote ref={wisdomTextRef} className={wisdomSize} lang={language === "tl" ? "fil" : "en"}>{currentWisdom}</blockquote>
              <p className="wisdom-note">{copy.note}</p>
              <button className="wisdom" type="button" onClick={() => setRevealed(false)}>← {copy.back}</button>
            </div>
          )}

          <div className="card-foot"><span>{copy.slow}</span><span>{copy.pass} ↗</span></div>
        </article>
      </section>

      <nav className="controls" aria-label="Deck controls">
        <button className="round-button" type="button" aria-label={copy.previous} onClick={() => move("prev")} disabled={position === 0}>←</button>
        <button className="next-button" type="button" onClick={() => move("next")}><span>{copy.next}</span><b>→</b></button>
        <button className="round-button shuffle-button" type="button" aria-label={language === "tl" ? "Haluin ang mga card" : "Shuffle deck"} onClick={() => reshuffle()}>↻<small>{copy.mix}</small></button>
      </nav>

      <div className="progress" aria-label={`${position + 1} of ${deck.length} cards`}><i style={{width: `${((position + 1) / deck.length) * 100}%`}} /></div>

      {settingsOpen && (
        <div className="sheet-wrap">
          <button className="sheet-backdrop" aria-label="Close settings" onClick={() => setSettingsOpen(false)} />
          <section className="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
            <div className="sheet-handle" />
            <div className="sheet-head">
              <div><p>QUESTION STUDIO</p><h2 id="sheet-title">{copy.studioHeading}</h2></div>
              <button onClick={() => setSettingsOpen(false)} aria-label="Close settings">×</button>
            </div>

            <div className="sheet-tabs" role="tablist" aria-label="Question settings">
              <button role="tab" aria-selected={settingsTab === "mix"} className={settingsTab === "mix" ? "active" : ""} onClick={() => { setSettingsTab("mix"); setNotice(""); }}>{copy.mixDeck}</button>
              <button role="tab" aria-selected={settingsTab === "add"} className={settingsTab === "add" ? "active" : ""} onClick={() => { setSettingsTab("add"); setNotice(""); }}>{copy.addOne}</button>
              <button role="tab" aria-selected={settingsTab === "import"} className={settingsTab === "import" ? "active" : ""} onClick={() => { setSettingsTab("import"); setNotice(""); }}>{copy.importSet}</button>
            </div>

            <div className="sheet-content">
              {settingsTab === "mix" && (
                <div className="tab-panel" role="tabpanel">
                  <p className="panel-intro">{copy.mixIntro}</p>
                  <div className="category-list">
                    {categories.map((cat, index) => {
                      const count = allQuestions.filter((item) => item.category === index && isAvailableInLanguage(item, language)).length;
                      const name = language === "tl" ? categoryNamesTl[index] : cat[0];
                      return <button key={cat[0]} className={selected.includes(index) ? "selected" : ""} onClick={() => toggleCategory(index)}><i style={{background: palettes[index][0]}} /><span><b>{name}</b><small>{count} {copy.questionUnit}</small></span><em>{selected.includes(index) ? "✓" : "+"}</em></button>;
                    })}
                  </div>
                  <button className="apply-button" onClick={() => { reshuffle(selected); setSettingsOpen(false); }}>{copy.shuffle} {allQuestions.filter((item) => selected.includes(item.category) && isAvailableInLanguage(item, language)).length} cards <span>→</span></button>
                </div>
              )}

              {settingsTab === "add" && (
                <form className="studio-form tab-panel" role="tabpanel" onSubmit={addQuestion}>
                  <p className="panel-intro">{copy.addIntro}</p>
                  <label>
                    <span>{copy.questionLabel}</span>
                    <textarea required value={newQuestion} onChange={(event) => setNewQuestion(event.target.value)} placeholder={copy.questionPlaceholder} rows={3} />
                  </label>
                  <label>
                    <span>{copy.wisdomLabel} <em>{copy.optional}</em></span>
                    <textarea value={newWisdom} onChange={(event) => setNewWisdom(event.target.value)} placeholder={copy.wisdomPlaceholder} rows={3} />
                  </label>
                  <label>
                    <span>{copy.category}</span>
                    <select value={newCategory} onChange={(event) => setNewCategory(Number(event.target.value))}>{categories.map((cat, index) => <option key={cat[0]} value={index}>{language === "tl" ? categoryNamesTl[index] : cat[0]}</option>)}</select>
                  </label>
                  {notice && <p className="form-notice" role="status">✦ {notice}</p>}
                  <button className="apply-button" type="submit">{copy.addButton} <span>＋</span></button>
                </form>
              )}

              {settingsTab === "import" && (
                <form className="studio-form tab-panel" role="tabpanel" onSubmit={importQuestions}>
                  <p className="panel-intro">{copy.importIntro}</p>
                  <label className="file-picker">
                    <input type="file" accept=".txt,.csv,.json,text/plain,application/json" onChange={async (event) => { const file = event.target.files?.[0]; if (file) { setImportText(await file.text()); setNotice(`${file.name} is ready to import.`); } }} />
                    <b>↑ {copy.chooseFile}</b>
                    <small>TXT, CSV, or JSON</small>
                  </label>
                  <label>
                    <span>{copy.questionSet}</span>
                    <textarea required value={importText} onChange={(event) => setImportText(event.target.value)} placeholder={"What makes you feel at home? | Home is often a person before it is a place.\nWhat are you ready to begin?"} rows={6} />
                    <small className="field-help">{copy.fieldHelp}</small>
                  </label>
                  <label>
                    <span>{copy.defaultCategory}</span>
                    <select value={importCategory} onChange={(event) => setImportCategory(Number(event.target.value))}>{categories.map((cat, index) => <option key={cat[0]} value={index}>{language === "tl" ? categoryNamesTl[index] : cat[0]}</option>)}</select>
                  </label>
                  {notice && <p className="form-notice" role="status">✦ {notice}</p>}
                  <div className="import-actions">
                    <button className="apply-button" type="submit">{copy.importButton} <span>→</span></button>
                    {customQuestions.length > 0 && <button className="clear-button" type="button" onClick={clearCustomQuestions}>{copy.clear} {customQuestions.length} {customQuestions.length === 1 ? copy.customCard : copy.customCards}</button>}
                  </div>
                  <p className="local-note">{copy.privateNote}</p>
                </form>
              )}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
