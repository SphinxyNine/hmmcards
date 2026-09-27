"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
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
  en: { ask: "ASK THIS", reveal: "Reveal a little wisdom", wisdom: "A LITTLE WISDOM", note: "A thought to help the conversation go one layer deeper.", back: "Back to the question", slow: "NO RUSH.", pass: "PASS IT AROUND", next: "Next card", mix: "mix" },
  tl: { ask: "PAG-USAPAN ITO", reveal: "Tingnan ang munting gabay", wisdom: "MUNTING GABAY", note: "Isang kaisipang makatutulong para mas lumalim at luminaw ang usapan.", back: "Bumalik sa tanong", slow: "DAHAN-DAHAN LANG.", pass: "IPASA SA KATABI", next: "Susunod na card", mix: "halo" },
} as const;

const isAvailableInLanguage = (question: Question, language: Language) => language === "en" || Boolean(question.textTl) || Boolean(question.custom);

const categoryIndex = (value: unknown, fallback: number) => {
  if (typeof value === "number" && value >= 0 && value < categories.length) return value;
  if (typeof value === "string") {
    const exact = categories.findIndex((category) => category.some((name) => name.toLowerCase() === value.toLowerCase()));
    if (exact >= 0) return exact;
  }
  return fallback;
};

const parseQuestionSet = (source: string, fallbackCategory: number): Question[] => {
  const trimmed = source.trim();
  if (!trimmed) return [];

  const makeQuestion = (text: unknown, answer: unknown, category: unknown, index: number): Question | null => {
    if (typeof text !== "string" || !text.trim()) return null;
    return {
      id: Date.now() + index,
      text: text.trim().replace(/^\d+[.)]\s*/, ""),
      wisdom: typeof answer === "string" && answer.trim() ? answer.trim() : undefined,
      category: categoryIndex(category, fallbackCategory),
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

  const allQuestions = useMemo(() => [...questions, ...customQuestions], [customQuestions]);

  useEffect(() => {
    let stored: Question[] = [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) stored = parsed.filter((item) => item && typeof item.text === "string");
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
    ? current.wisdomTl || current.wisdom || questionWisdom[current.id] || wisdom[current.category][Math.abs(current.id - 1) % wisdom[current.category].length]
    : current.wisdom || questionWisdom[current.id] || wisdom[current.category][Math.abs(current.id - 1) % wisdom[current.category].length];
  const copy = cardCopy[language];
  const categoryLabel = language === "tl" ? categoryLabelsTl[current.category] : category[1];

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
    setNotice("Card added — it is now in the shuffle.");
  };

  const importQuestions = (event: FormEvent) => {
    event.preventDefault();
    try {
      const imported = parseQuestionSet(importText, importCategory);
      if (!imported.length) throw new Error("No readable questions found.");
      saveCustomQuestions([...customQuestions, ...imported]);
      setImportText("");
      setNotice(`${imported.length} card${imported.length === 1 ? "" : "s"} joined the deck.`);
    } catch {
      setNotice("That set needs a second look. Try one question per line, or valid JSON.");
    }
  };

  const clearCustomQuestions = () => {
    saveCustomQuestions([]);
    setNotice("Custom cards cleared. The built-in cards are still here.");
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
          <button className="present-button" type="button" onClick={togglePresentMode}><b>{isPresenting ? "×" : "⛶"}</b><span>{isPresenting ? (language === "tl" ? "Lumabas" : "Exit") : (language === "tl" ? "I-presenta" : "Present")}</span></button>
          <button className="menu-button" type="button" aria-label="Open deck settings" onClick={() => { setSettingsOpen(true); setNotice(""); }}><span /><span /></button>
        </div>
      </header>

      <section className="stage" aria-label="Question card" onPointerDown={(e) => { touchStart.current = e.clientX; }} onPointerUp={(e) => { const distance = e.clientX - touchStart.current; if (Math.abs(distance) > 55) move(distance < 0 ? "next" : "prev"); }}>
        <div className="card-stack" aria-hidden="true"><i /><i /></div>
        <article className={`question-card ${moving ? `card-${moving}` : ""}`} aria-live="polite">
          <div className="card-meta">
            <span>{current.custom ? (language === "tl" ? "Sariling card" : "Custom") : String(current.category + 1).padStart(2, "0")} · {categoryLabel}</span>
            <span>{position + 1} / {deck.length}</span>
          </div>

          {!revealed ? (
            <div className="question-face">
              <p className="eyebrow">{copy.ask}</p>
              <h1 className={currentText.length > 95 ? "question-long" : ""}>{currentText}</h1>
              <button className="wisdom" type="button" onClick={() => setRevealed(true)}><span>✦</span> {copy.reveal}</button>
            </div>
          ) : (
            <div className="wisdom-face">
              <p className="eyebrow">{copy.wisdom}</p>
              <blockquote className={currentWisdom.length > 230 ? "wisdom-long" : ""}>{currentWisdom}</blockquote>
              <p className="wisdom-note">{copy.note}</p>
              <button className="wisdom" type="button" onClick={() => setRevealed(false)}>← {copy.back}</button>
            </div>
          )}

          <div className="card-foot"><span>{copy.slow}</span><span>{copy.pass} ↗</span></div>
        </article>
      </section>

      <nav className="controls" aria-label="Deck controls">
        <button className="round-button" type="button" aria-label="Previous question" onClick={() => move("prev")} disabled={position === 0}>←</button>
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
              <div><p>QUESTION STUDIO</p><h2 id="sheet-title">Make it yours.</h2></div>
              <button onClick={() => setSettingsOpen(false)} aria-label="Close settings">×</button>
            </div>

            <div className="sheet-tabs" role="tablist" aria-label="Question settings">
              <button role="tab" aria-selected={settingsTab === "mix"} className={settingsTab === "mix" ? "active" : ""} onClick={() => { setSettingsTab("mix"); setNotice(""); }}>Mix deck</button>
              <button role="tab" aria-selected={settingsTab === "add"} className={settingsTab === "add" ? "active" : ""} onClick={() => { setSettingsTab("add"); setNotice(""); }}>Add one</button>
              <button role="tab" aria-selected={settingsTab === "import"} className={settingsTab === "import" ? "active" : ""} onClick={() => { setSettingsTab("import"); setNotice(""); }}>Import set</button>
            </div>

            <div className="sheet-content">
              {settingsTab === "mix" && (
                <div className="tab-panel" role="tabpanel">
                  <p className="panel-intro">{language === "tl" ? "Piliin kung anong klaseng kuwentuhan ang gusto ninyo." : "Choose what kind of conversation you feel like having."}</p>
                  <div className="category-list">
                    {categories.map((cat, index) => {
                      const count = allQuestions.filter((item) => item.category === index && isAvailableInLanguage(item, language)).length;
                      const name = language === "tl" ? categoryNamesTl[index] : cat[0];
                      return <button key={cat[0]} className={selected.includes(index) ? "selected" : ""} onClick={() => toggleCategory(index)}><i style={{background: palettes[index][0]}} /><span><b>{name}</b><small>{count} {language === "tl" ? "tanong" : "questions"}</small></span><em>{selected.includes(index) ? "✓" : "+"}</em></button>;
                    })}
                  </div>
                  <button className="apply-button" onClick={() => { reshuffle(selected); setSettingsOpen(false); }}>{language === "tl" ? "Ihalo" : "Shuffle"} {allQuestions.filter((item) => selected.includes(item.category) && isAvailableInLanguage(item, language)).length} cards <span>→</span></button>
                </div>
              )}

              {settingsTab === "add" && (
                <form className="studio-form tab-panel" role="tabpanel" onSubmit={addQuestion}>
                  <p className="panel-intro">Write the card you wish somebody would pull tonight.</p>
                  <label>
                    <span>Question</span>
                    <textarea required value={newQuestion} onChange={(event) => setNewQuestion(event.target.value)} placeholder="What have you been pretending not to know?" rows={3} />
                  </label>
                  <label>
                    <span>Little wisdom <em>optional</em></span>
                    <textarea value={newWisdom} onChange={(event) => setNewWisdom(event.target.value)} placeholder="Clarity has a habit of waiting behind honesty." rows={3} />
                  </label>
                  <label>
                    <span>Category</span>
                    <select value={newCategory} onChange={(event) => setNewCategory(Number(event.target.value))}>{categories.map((cat, index) => <option key={cat[0]} value={index}>{cat[0]}</option>)}</select>
                  </label>
                  {notice && <p className="form-notice" role="status">✦ {notice}</p>}
                  <button className="apply-button" type="submit">Add to the shuffle <span>＋</span></button>
                </form>
              )}

              {settingsTab === "import" && (
                <form className="studio-form tab-panel" role="tabpanel" onSubmit={importQuestions}>
                  <p className="panel-intro">Paste a list or choose a text/JSON file. One line becomes one card.</p>
                  <label className="file-picker">
                    <input type="file" accept=".txt,.csv,.json,text/plain,application/json" onChange={async (event) => { const file = event.target.files?.[0]; if (file) { setImportText(await file.text()); setNotice(`${file.name} is ready to import.`); } }} />
                    <b>↑ Choose a question file</b>
                    <small>TXT, CSV, or JSON</small>
                  </label>
                  <label>
                    <span>Question set</span>
                    <textarea required value={importText} onChange={(event) => setImportText(event.target.value)} placeholder={"What makes you feel at home? | Home is often a person before it is a place.\nWhat are you ready to begin?"} rows={6} />
                    <small className="field-help">Use <b>Question | Wisdom</b> per line. JSON can use question, wisdom, and category fields.</small>
                  </label>
                  <label>
                    <span>Default category</span>
                    <select value={importCategory} onChange={(event) => setImportCategory(Number(event.target.value))}>{categories.map((cat, index) => <option key={cat[0]} value={index}>{cat[0]}</option>)}</select>
                  </label>
                  {notice && <p className="form-notice" role="status">✦ {notice}</p>}
                  <div className="import-actions">
                    <button className="apply-button" type="submit">Import this set <span>→</span></button>
                    {customQuestions.length > 0 && <button className="clear-button" type="button" onClick={clearCustomQuestions}>Clear {customQuestions.length} custom card{customQuestions.length === 1 ? "" : "s"}</button>}
                  </div>
                  <p className="local-note">Saved privately in this browser. Nothing is uploaded.</p>
                </form>
              )}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
