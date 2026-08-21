"use client";

import { useEffect, useRef, useState } from "react";
import { categories, questions } from "./questions";

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

export default function Deck() {
  const [selected, setSelected] = useState<number[]>(categories.map((_, i) => i));
  const [deck, setDeck] = useState<number[]>(questions.map((_, i) => i));
  const [position, setPosition] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [moving, setMoving] = useState<"next" | "prev" | "">("");
  const touchStart = useRef(0);

  useEffect(() => {
    const key = window.setTimeout(() => setDeck(shuffle(questions.map((_, i) => i))), 0);
    return () => window.clearTimeout(key);
  }, []);

  const current = questions[deck[position] ?? 0];
  const category = categories[current.category];
  const palette = palettes[current.category];

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

  const reshuffle = (chosen = selected) => {
    const pool = questions.map((q, i) => chosen.includes(q.category) ? i : -1).filter((i) => i >= 0);
    setDeck(shuffle(pool));
    setPosition(0);
    setRevealed(false);
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
        <button className="menu-button" type="button" aria-label="Open deck settings" onClick={() => setSettingsOpen(true)}><span /><span /></button>
      </header>

      <section className="stage" aria-label="Question card" onPointerDown={(e) => { touchStart.current = e.clientX; }} onPointerUp={(e) => { const distance = e.clientX - touchStart.current; if (Math.abs(distance) > 55) move(distance < 0 ? "next" : "prev"); }}>
        <div className="card-stack" aria-hidden="true"><i /><i /></div>
        <article className={`question-card ${moving ? `card-${moving}` : ""}`} aria-live="polite">
          <div className="card-meta">
            <span>{String(current.category + 1).padStart(2, "0")} · {category[1]}</span>
            <span>{position + 1} / {deck.length}</span>
          </div>

          {!revealed ? (
            <div className="question-face">
              <p className="eyebrow">ASK THIS</p>
              <h1>{current.text}</h1>
              <button className="wisdom" type="button" onClick={() => setRevealed(true)}><span>✦</span> Reveal a little wisdom</button>
            </div>
          ) : (
            <div className="wisdom-face">
              <p className="eyebrow">A LITTLE WISDOM</p>
              <blockquote>“{wisdom[current.category][(current.id - 1) % wisdom[current.category].length]}”</blockquote>
              <p className="wisdom-note">Not the answer. Just a thought to toss into the middle.</p>
              <button className="wisdom" type="button" onClick={() => setRevealed(false)}>← Back to the question</button>
            </div>
          )}

          <div className="card-foot"><span>NO RUSH.</span><span>PASS IT AROUND ↗</span></div>
        </article>
      </section>

      <nav className="controls" aria-label="Deck controls">
        <button className="round-button" type="button" aria-label="Previous question" onClick={() => move("prev")} disabled={position === 0}>←</button>
        <button className="next-button" type="button" onClick={() => move("next")}><span>Next card</span><b>→</b></button>
        <button className="round-button shuffle-button" type="button" aria-label="Shuffle deck" onClick={() => reshuffle()}>↻<small>mix</small></button>
      </nav>

      <div className="progress" aria-label={`${position + 1} of ${deck.length} cards`}><i style={{width: `${((position + 1) / deck.length) * 100}%`}} /></div>

      {settingsOpen && (
        <div className="sheet-wrap">
          <button className="sheet-backdrop" aria-label="Close settings" onClick={() => setSettingsOpen(false)} />
          <section className="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
            <div className="sheet-handle" />
            <div className="sheet-head"><div><p>BUILD YOUR DECK</p><h2 id="sheet-title">Pick a mood.</h2></div><button onClick={() => setSettingsOpen(false)} aria-label="Close settings">×</button></div>
            <div className="category-list">
              {categories.map((cat, index) => <button key={cat[0]} className={selected.includes(index) ? "selected" : ""} onClick={() => toggleCategory(index)}><i style={{background: palettes[index][0]}} /><span><b>{cat[0]}</b><small>20 questions</small></span><em>{selected.includes(index) ? "✓" : "+"}</em></button>)}
            </div>
            <button className="apply-button" onClick={() => { reshuffle(selected); setSettingsOpen(false); }}>Shuffle {selected.length * 20} cards <span>→</span></button>
          </section>
        </div>
      )}
    </main>
  );
}
