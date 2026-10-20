import { FormEvent, ReactNode, useEffect, useRef, useState, type JSX } from "react";

type ColorKey = "Midnight Black" | "Dusk Maroon" | "Navy Blue" | "Sunburst Orange";

const colors: Record<ColorKey, { hex: string; asset: string; label: string; webLabel: string; watermark: [string, string] }> = {
  "Midnight Black": { hex: "#161616", asset: "/assets/official/pace-ar-black-front.svg", label: "Dark", webLabel: "Jet", watermark: ["JET", "BLACK"] },
  "Dusk Maroon": { hex: "#681F3C", asset: "/assets/official/pace-ar-maroon.svg", label: "Dusk", webLabel: "Dusk", watermark: ["DUSK", "MAROON"] },
  "Navy Blue": { hex: "#172746", asset: "/assets/official/pace-ar-navy-blue.svg", label: "Midnight", webLabel: "Midnight", watermark: ["MIDNIGHT", "BLUE"] },
  "Sunburst Orange": { hex: "#E65F26", asset: "/assets/official/pace-ar-orange.svg", label: "Dawn", webLabel: "Sunburst", watermark: ["SUNBURST", "ORANGE"] },
};

const finishSurfaces: Record<ColorKey, string> = {
  "Midnight Black": "#c8c9d1",
  "Dusk Maroon": "#e3bacb",
  "Navy Blue": "#bacde8",
  "Sunburst Orange": "#ffd1ac",
};

const features = [
  ["Accurate activity tracking", "Steps, calories and movement—made easy to understand.", "01", "wide dark", "pace-ar-accurate-activity-tracking-icon.svg"],
  ["Sleep monitoring", "Understand your rest and wake up ready.", "02", "light", "pace-ar-sleep-monitoring-icon.svg"],
  ["Heart-rate monitoring", "A live view of your everyday effort.", "03", "violet", "pace-ar-heart-rate-monitoring-icon.svg"],
  ["Stretch & warm-up guides", "Move better before every session.", "04", "light", "pace-ar-stretch-warm-up-guide-icon.svg"],
  ["Scannable AR fitness quests", "Turn any place into your next challenge.", "05", "wide quest", "pace-ar-web-icon.svg"],
  ["Daily streaks", "Build consistency with visible daily momentum.", "06", "light", "pace-ar-daily-streaks-icon.svg"],
  ["Competitions", "Make progress together through friendly challenges.", "07", "light", "pace-ar-competitions-icon.svg"],
  ["Mobile app integration", "Your activity and quests, connected.", "08", "dark", "pace-ar-mobile-app-icon.svg"],
  ["Run & strength support", "One companion for both cardio and training.", "09", "light", "pace-ar-run-and-strength-support-icon.svg"],
  ["No monthly subscription", "The full core experience. No recurring fee.", "10", "violet", "pace-ar-no-monthly-subscription-icon.svg"],
];

const faqs = [
  ["What is included with PACE AR?", "The ₱2,999 bundle includes the PACE AR Smartband, AR Quest Cards Deck, Magnetic USB Charger, and lifetime access to the companion app."],
  ["How do the AR quest cards work?", "Open the PACE AR app, scan a quest card, follow the displayed fitness challenge, and earn XP or badges after completing it."],
  ["Is there a subscription?", "No. PACE AR includes lifetime companion app access with no monthly subscription required."],
  ["What warranty is included?", "PACE AR includes a one-year limited prototype warranty covering manufacturing defects in the smartband and magnetic charger."],
  ["How long does delivery take?", "Prototype orders estimate 3–5 business days for Metro Manila and 5–8 business days for provincial delivery."],
  ["How to order PACE AR?", "Choose a band color, select Buy PACE AR, enter your shipping and payment details, then complete the ₱2,999 prototype order."],
  ["Is PACE AR safe for every activity?", "PACE AR supports general walking, running, sleep, and wellness tracking. Follow each quest’s safety guidance and consult a professional before beginning a new exercise program."],
];

function Button({ children, kind = "primary", onClick, type = "button", className = "", ariaLabel }: { children: ReactNode; kind?: "primary" | "secondary" | "light" | "ghost"; onClick?: () => void; type?: "button" | "submit"; className?: string; ariaLabel?: string }) {
  return <button className={`button button-${kind} ${className}`} onClick={onClick} type={type} aria-label={ariaLabel}>{children}</button>;
}

function Link({ href, children, className = "", onClick }: { href: string; children: ReactNode; className?: string; onClick?: () => void }) {
  return <a className={className} href={href} onClick={onClick}>{children}</a>;
}

function Heading({ level = 2, children, className = "" }: { level?: 1 | 2 | 3 | 4; children: ReactNode; className?: string }) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return <Tag className={className}>{children}</Tag>;
}

function Field({ label, name, type = "text", required = true }: { label: string; name: string; type?: string; required?: boolean }) {
  return <label className="field"><span>{label}</span><input name={name} type={type} required={required} /></label>;
}

function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <div className={`eyebrow ${light ? "eyebrow-light" : ""}`}><span />{children}</div>;
}

function ProductImage({ className = "", color = "Midnight Black", pose = "front", alt = "PACE AR fitness band" }: { className?: string; color?: ColorKey; pose?: "front" | "side"; alt?: string }) {
  const sideAssets: Record<ColorKey, string> = {
    "Midnight Black": "/assets/official/pace-ar-black-side.svg",
    "Sunburst Orange": "/assets/official/pace-ar-orange-three-quarter.png",
    "Dusk Maroon": "/assets/official/pace-ar-dusk-three-quarter.png",
    "Navy Blue": "/assets/official/pace-ar-midnight-three-quarter.png",
  };
  const asset = pose === "side" ? sideAssets[color] : colors[color].asset;
  return <img className={className} src={asset} alt={alt} />;
}

function App() {
  const [selectedColor, setSelectedColor] = useState<ColorKey>("Navy Blue");
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const buy = () => { setSubmitted(false); setModalOpen(true); };
  const submitOrder = (event: FormEvent) => { event.preventDefault(); setSubmitted(true); };
  useEffect(() => {
    if (!modalOpen) return;
    const previous = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";
    const focusable = () => Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button, input, textarea, a[href]') || []);
    focusable()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
      if (e.key === "Tab") {
        const items = focusable(); const first = items[0]; const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; document.removeEventListener("keydown", onKey); previous?.focus(); };
  }, [modalOpen, submitted]);
  return <div className="site-shell">
    <a className="skip-link" href="#dl-overview">Skip to content</a>
    <DesktopLanding selectedColor={selectedColor} setSelectedColor={setSelectedColor} openFaq={openFaq} setOpenFaq={setOpenFaq} onBuy={buy} />
    {modalOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && setModalOpen(false)}>
      <div ref={dialogRef} className="checkout-modal" role="dialog" aria-modal="true" aria-label="Prototype checkout">
        <div className="modal-head"><div><span>Prototype checkout</span><Heading level={2} className="checkout-title">Make it yours.</Heading></div><Button kind="ghost" onClick={() => setModalOpen(false)} ariaLabel="Close checkout">×</Button></div>
        <div className="prototype-note"><i /> Prototype only — no real payment will be processed.</div>
        {submitted ? <div className="inline-confirmation" role="status"><h3>Your demo is complete.</h3><p>{quantity} × PACE AR · {selectedColor} · ₱{(quantity * 2999).toLocaleString()}</p><p>No order was placed, no information was saved, and no payment was processed.</p><Button onClick={() => setModalOpen(false)}>Continue exploring</Button></div> : <form onSubmit={submitOrder}>
          <div className="checkout-layout">
            <div className="form-fields">
              <Field label="Full name" name="name" />
              <Field label="Email address" name="email" type="email" />
              <Field label="Contact number" name="contact" type="tel" />
              <Field label="City / Municipality" name="city" />
              <label className="field full"><span>Shipping address</span><textarea name="address" required rows={3} /></label>
              <Field label="Postal code" name="postal" />
              <div className="payment-options full"><span>Payment option</span><div>
                {["GCash", "Maya", "Credit / Debit", "Cash on Delivery"].map((payment, index) => <label key={payment}><input type="radio" name="payment" value={payment} defaultChecked={index === 0} /><i /><strong>{payment}</strong></label>)}
              </div></div>
            </div>
            <aside className="order-summary">
              <div className="summary-product"><ProductImage color={selectedColor} /><div><span>PACE AR Gamified Fitness Bundle</span><strong>{colors[selectedColor].label} · ₱2,999</strong></div></div>
              <div className="quantity-row"><span>Quantity</span><div><Button kind="ghost" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</Button><strong>{quantity}</strong><Button kind="ghost" onClick={() => setQuantity(quantity + 1)}>+</Button></div></div>
              <div className="summary-total"><span>Total</span><strong>₱{(2999 * quantity).toLocaleString()}</strong></div>
              <Button type="submit" className="place-order">Complete Order — ₱{(2999 * quantity).toLocaleString()} <span aria-hidden="true">→</span></Button>
            </aside>
          </div>
        </form>}
      </div>
    </div>}
  </div>;
}

function Logo() {
  return <img className="logo" src="/assets/branding/trailquest-logo.svg" alt="TrailQuest" />;
}

function DailyGoalCount() {
  const ref = useRef<HTMLElement>(null);
  const [value, setValue] = useState(0);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let frame = 0;
    let active = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.intersectionRatio >= .6 && !active) {
        active = true;
        if (reduced.matches) { setValue(82); return; }
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / 4500);
          // Keep a slow start, then reserve the final third for the last few numbers.
          const opening = Math.min(1, progress / .65);
          const finish = Math.max(0, (progress - .65) / .35);
          const eased = progress < .65
            ? .93 * opening * opening * (3 - 2 * opening)
            : .93 + .07 * (1 - Math.pow(1 - finish, 2));
          setValue(progress === 1 ? 82 : Math.floor(82 * eased));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      } else if (!entry.isIntersecting) {
        active = false;
        cancelAnimationFrame(frame);
        setValue(0);
      }
    }, { threshold: [0, .6] });
    observer.observe(node);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, []);
  return <strong ref={ref} className="daily-goal-count">{value}%</strong>;
}

function RollingMetric({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.intersectionRatio >= .6) setStarted(true);
      else if (!entry.isIntersecting) setStarted(false);
    }, { threshold: [0, .6] });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <span ref={ref} className="rolling-metric" role="img" aria-label={text}>
    {Array.from(text).map((char, index) => /[0-9]/.test(char) ?
      <i className="metric-digit" key={index} aria-hidden="true"><b className="metric-reel" style={{ transform: `translateY(-${started ? (20 + Number(char)) * 1.1 : 0}em)`, transitionDelay: started ? `${index * 45}ms` : "0ms", ...(started ? {} : { transition: "none" }) }}>
        {Array.from({ length: 30 }, (_, digit) => <em key={digit}>{digit % 10}</em>)}
      </b></i> : <i className="metric-char" key={index} aria-hidden="true">{char}</i>)}
  </span>;
}

function OrbitComet() {
  const ref = useRef<SVGGElement>(null);
  const count = 96;
  useEffect(() => {
    const group = ref.current;
    if (!group) return;
    const section = group.closest(".dl-final-cta");
    const track = group.ownerSVGElement?.querySelector<SVGEllipseElement>(".cta-orbit-track");
    const segments = Array.from(group.querySelectorAll<SVGPathElement>("path"));
    const head = group.querySelector("circle");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Map distance to angle so the comet moves at an even speed on the ellipse.
    const lengths = [0];
    for (let i = 1; i <= 720; i++) {
      const a = (i - 1) * Math.PI / 360, b = i * Math.PI / 360;
      lengths.push(lengths[i - 1] + Math.hypot(258 * (Math.cos(b) - Math.cos(a)), 163 * (Math.sin(b) - Math.sin(a))));
    }
    const perimeter = lengths[720];
    const point = (distance: number, halfWidth = 0) => {
      const target = ((distance % 1) + 1) % 1 * perimeter;
      let low = 0, high = 720;
      while (high - low > 1) { const mid = (low + high) >> 1; if (lengths[mid] <= target) low = mid; else high = mid; }
      const angle = (low + (target - lengths[low]) / (lengths[high] - lengths[low])) * Math.PI / 360;
      const nx = Math.cos(angle) / 258, ny = Math.sin(angle) / 163, normal = Math.hypot(nx, ny);
      return [260 + 258 * Math.cos(angle) + halfWidth * nx / normal, 165 + 163 * Math.sin(angle) + halfWidth * ny / normal];
    };
    let frame = 0;
    const draw = (time: number) => {
      const visible = section?.classList.contains("orbit-in-view");
      const startedAt = Number(section?.getAttribute("data-orbit-start") || time);
      const elapsed = visible ? Math.max(0, time - startedAt) : 0;
      const laps = elapsed / 5500;
      const phase = laps % 1;
      const tailLength = Math.min(.7, laps);
      group.style.opacity = visible ? "1" : "0";
      if (track) {
        track.style.strokeDashoffset = `${motion.matches ? 0 : 100 * (1 - Math.min(1, laps))}`;
        track.style.opacity = ".85";
      }
      segments.forEach((segment, i) => {
        const progress = (i + 1) / count;
        const start = phase - tailLength + tailLength * i / count;
        const end = Math.min(phase, phase - tailLength + tailLength * (i + 1.03) / count);
        const width = .08 + 2.55 * Math.pow(progress, 2.2);
        const middle = (start + end) / 2;
        const points = [point(start, width), point(middle, width), point(end, width), point(end, -width), point(middle, -width), point(start, -width)];
        segment.setAttribute("d", `M ${points.map(p => p.map(n => n.toFixed(2)).join(" ")).join(" L ")} Z`);
      });
      const [x, y] = point(phase);
      head?.setAttribute("cx", `${x}`); head?.setAttribute("cy", `${y}`);
      if (!motion.matches) frame = requestAnimationFrame(draw);
    };
    const start = () => { cancelAnimationFrame(frame); draw(performance.now()); };
    start(); motion.addEventListener("change", start);
    return () => { cancelAnimationFrame(frame); motion.removeEventListener("change", start); };
  }, []);
  return <g ref={ref} className="orbit-comet-traveler">
    {Array.from({ length: count }, (_, i) => {
      const progress = (i + 1) / count;
      return <path key={i} fill={`rgb(${Math.round(174 + 75 * progress)} ${Math.round(133 + 104 * progress)} 255)`} opacity={.015 + .985 * Math.pow(progress, 2.4)} />;
    })}
    <circle r="2.6" fill="#fff8ff" />
  </g>;
}

function HardwareConnectors() {
  const ref = useRef<SVGSVGElement>(null);
  const [paths, setPaths] = useState<string[]>([]);
  useEffect(() => {
    const stage = ref.current?.parentElement;
    if (!stage) return;
    let frame = 0;
    const measure = () => {
      const box = stage.getBoundingClientRect();
      const watch = stage.querySelector("img")?.getBoundingClientRect();
      if (!watch || !box.width) return;
      const centerX = watch.left + watch.width / 2 - box.left;
      const centerY = watch.top + watch.height / 2 - box.top;
      const next = Array.from(stage.querySelectorAll<HTMLElement>(".callout")).map((label, index) => {
        const b = label.getBoundingClientRect();
        const left = index < 3;
        const startX = (left ? b.right + 12 : b.left - 12) - box.left;
        const startY = b.top + b.height / 2 - box.top;
        const watchEdgeGap = 12;
        // Compensate for the watch artwork’s slightly off-center silhouette on the right only.
        const expanded = stage.closest(".hardware")?.classList.contains("active");
        const hoverGapCorrection = expanded ? 0 : 10;
        const rightEdgeCorrection = left ? 0 : Math.min(7, watch.width * .009) + hoverGapCorrection;
        const endX = centerX + (left ? -1 : 1) * (watch.width * .09 + watchEdgeGap) - rightEdgeCorrection;
        const endY = centerY + ((index % 3) - 1) * watch.height * .12;
        const delta = endX - startX;
        const bendX = startX + delta * .55;
        return `M ${startX} ${startY} L ${startX + delta * .3} ${startY} Q ${bendX} ${startY} ${bendX} ${(startY + endY) / 2} Q ${bendX} ${endY} ${startX + delta * .8} ${endY} L ${endX} ${endY}`;
      });
      setPaths(next);
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure); };
    const observer = new ResizeObserver(schedule);
    observer.observe(stage);
    stage.querySelectorAll(".callout, img").forEach(el => observer.observe(el));
    stage.addEventListener("transitionend", schedule);
    window.addEventListener("resize", schedule);
    document.fonts.ready.then(schedule);
    schedule();
    return () => { observer.disconnect(); cancelAnimationFrame(frame); stage.removeEventListener("transitionend", schedule); window.removeEventListener("resize", schedule); };
  }, []);
  return <svg ref={ref} className="hardware-connectors" aria-hidden="true">
    {paths.map((d, i) => <g key={i} style={{ "--connector-delay": `${i * .15}s` } as React.CSSProperties}>
      <path className="connector-track" d={d} pathLength={100} />
      <path className="connector-pulse" d={d} pathLength={100} />
    </g>)}
  </svg>;
}

function DesktopLanding({ selectedColor, setSelectedColor, openFaq, setOpenFaq, onBuy }: {
  selectedColor: ColorKey;
  setSelectedColor: (color: ColorKey) => void;
  openFaq: number | null;
  setOpenFaq: (index: number | null) => void;
  onBuy: () => void;
}) {
  const [activeSection, setActiveSection] = useState("dl-overview");
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [stepHovered, setStepHovered] = useState(false);
  const [stepFocused, setStepFocused] = useState(false);
  const [howVisible, setHowVisible] = useState(false);
  const stepStarted = useRef(0);
  const chooseStep = (step: number) => {
    if (step !== activeStep) { stepStarted.current = performance.now(); setActiveStep(step); }
  };
  useEffect(() => {
    if (!howVisible || stepHovered || stepFocused) return;
    const elapsed = (performance.now() - stepStarted.current) % 4000;
    const timer = window.setTimeout(() => {
      stepStarted.current = performance.now();
      setActiveStep(step => (step + 1) % 3);
    }, 4000 - elapsed);
    return () => window.clearTimeout(timer);
  }, [activeStep, howVisible, stepHovered, stepFocused]);


  useEffect(() => {
    const sectionIds = ["dl-overview", "dl-features", "dl-how", "dl-colors", "dl-faq"];
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveSection(visible.target.id);
    }, { rootMargin: "-25% 0px -65% 0px", threshold: [0, .25, .5] });
    sectionIds.forEach(id => {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = document.getElementById("dl-how");
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      section.classList.toggle("how-in-view", entry.isIntersecting);
      if (entry.isIntersecting) stepStarted.current = performance.now();
      setHowVisible(entry.isIntersecting);
    }, { threshold: .15 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = document.querySelector(".dl-final-cta");
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) section.setAttribute("data-orbit-start", `${performance.now()}`);
      section.classList.toggle("orbit-in-view", entry.isIntersecting);
    }, { threshold: .2 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const featureModes = [
    ["Track every move.", "Precision sensors turn steps, heart rate, sleep, and daily activity into clear progress."],
    ["Turn movement into quests.", "Scan physical AR cards and transform ordinary walks into guided fitness challenges."],
    ["Progress you can feel.", "Haptic milestones, XP, streaks, and badges make every completed activity rewarding."],
  ];

  return <div className="desktop-landing">
    <header className="dl-navbar">
      <nav aria-label="Main navigation">
        <a className="dl-brand" href="#dl-overview"><Logo /><strong>PACE AR</strong></a>
        <div className="dl-nav-links">
          {[["dl-overview", "Overview"], ["dl-features", "Features"], ["dl-how", "How It Works"], ["dl-colors", "Colors"], ["dl-faq", "FAQ"]].map(([id, label]) => <a className={activeSection === id ? "active" : ""} href={`#${id}`} key={id}>{label}</a>)}
        </div>
        <button className="dl-buy" onClick={onBuy}><img src="/assets/official/pace-ar-cart-icon.svg" alt="" />Buy PACE AR</button>
      </nav>
    </header>

    <main>
      <section className="dl-hero" id="dl-overview">
        <div className="dl-container dl-hero-grid">
          <div className="dl-hero-copy">
            <div className="dl-intro-brand"><span>Introducing</span><strong>PACE AR</strong></div>
            <Heading level={1}>Level up<br />your walk.</Heading>
            <p>Stop just counting steps. Start earning experience points (XP) and unlocking real-life health rewards.</p>
            <div className="dl-actions"><button className="hero-buy" onClick={onBuy}><svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h3l2.4 11.4a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 2-1.6L22 7H6"/><circle cx="10" cy="21" r="1"/><circle cx="19" cy="21" r="1"/></svg><span>Buy PACE AR · ₱2,999</span></button><a href="#dl-features">Explore Features</a></div>
          </div>
          <div className="dl-hero-visual">
            <div className="dl-hero-glow" />
            <img className="dl-hero-watch" src="/assets/official/pace-ar-orange.svg" alt="Sunburst Orange PACE AR watch" />
            <div className="dl-goal-badge"><span>Daily Goal</span><DailyGoalCount /></div>
          </div>
        </div>
      </section>

      <section className="dl-colors-section" id="dl-colors" style={{ "--finish-surface": finishSurfaces[selectedColor], "--finish-glow": `${colors[selectedColor].hex}20` } as React.CSSProperties}>
        <div className="dl-container">
          <div className="dl-section-heading"><Heading>Choose your pace.</Heading><p>Four expressive finishes. The same complete PACE AR experience.</p><small className="demo-label">Concept specifications and activity figures shown for academic demonstration.</small></div>
          <div className="dl-color-layout">
            <div className="dl-color-controls">
              {(Object.keys(colors) as ColorKey[]).map(color => <button style={{ "--finish-color": colors[color].hex } as React.CSSProperties} aria-pressed={selectedColor === color} className={selectedColor === color ? "active" : ""} onClick={() => setSelectedColor(color)} key={color}><i style={{ background: colors[color].hex }} /><span>{colors[color].webLabel}</span></button>)}
              <button className="dl-color-buy" onClick={onBuy}>Buy {colors[selectedColor].webLabel} · ₱2,999</button>
            </div>
            <div className={`dl-color-display ${selectedColor === "Midnight Black" ? "jet" : ""}`}>
              <div className="dl-color-watermark"><span>{colors[selectedColor].watermark[0]}</span><span>{colors[selectedColor].watermark[1]}</span></div>
              <ProductImage key={selectedColor} pose="side" color={selectedColor} alt={`${colors[selectedColor].webLabel} PACE AR watch`} />
            </div>
          </div>
          <div className="dl-metrics">
            <article><RollingMetric text="50,000+" /><p>Quests Completed</p></article>
            <article><RollingMetric text="98.4%" /><p>Habit Consistency</p></article>
            <article><RollingMetric text="14 Days" /><p>Battery Endurance</p></article>
          </div>
        </div>
      </section>

      <section className="dl-features-section" id="dl-features">
        <div className="dl-container">
          <div className="dl-section-heading centered"><Heading>More than a fitness tracker.</Heading><p>PACE AR makes staying active feel less like a routine—and more like an adventure.</p></div>
          <div className={`dl-editorial-grid ${activeFeature !== null ? "expanded" : ""}`}>
            <button className={`dl-editorial-card hardware ${activeFeature === 0 ? "active" : ""}`} onClick={() => setActiveFeature(activeFeature === 0 ? null : 0)}>
              <div className="dl-editorial-hardware">
                <HardwareConnectors />
                <ProductImage color="Midnight Black" alt="Jet Black PACE AR hardware view" />
                <i className="callout c1"><strong>Heart-rate sensor</strong><small>PPG effort and zone monitoring.</small></i>
                <i className="callout c2"><strong>Haptic feedback</strong><small>Feel milestones without checking.</small></i>
                <i className="callout c3"><strong>Step tracking</strong><small>Accurate movement throughout the day.</small></i>
                <i className="callout c4"><strong>Route display</strong><small>Minimal guidance for active quests.</small></i>
                <i className="callout c5"><strong>Voice commands</strong><small>Hands-free connected actions.</small></i>
                <i className="callout c6"><strong>Sleep monitoring</strong><small>Overnight rest and recovery insights.</small></i>
              </div>
              <div className="dl-editorial-copy"><Heading level={3}>Track every move.</Heading><p>{featureModes[0][1]}</p></div>
              <small>Click or hover to expand</small>
            </button>
            <button className={`dl-editorial-card quests ${activeFeature === 1 ? "active" : ""}`} onClick={() => setActiveFeature(activeFeature === 1 ? null : 1)}>
              <span>02 / AR Quests</span>
              <div className="dl-quest-ticket"><span>QUEST CARD</span><strong>Find your<br />pace.</strong><b>+250 XP</b></div>
              <div className="dl-card-hover-details"><div><strong>AR card scanner</strong><small>Recognizes physical quest cards.</small></div><div><strong>Guided challenges</strong><small>Clear movement instructions.</small></div><div><strong>Instant sync</strong><small>Sends the quest to your band.</small></div></div>
              <div className="dl-editorial-copy"><Heading level={3}>Turn movement<br />into quests.</Heading><p>{featureModes[1][1]}</p></div>
              <small>Click or hover to expand</small>
            </button>
            <button className={`dl-editorial-card progress ${activeFeature === 2 ? "active" : ""}`} onClick={() => setActiveFeature(activeFeature === 2 ? null : 2)}>
              <span>03 / Momentum</span>
              <div className="dl-progress-visual"><i>82%</i><div><span><b>3,480 XP</b><em>5,000</em></span><strong /></div><small>5K</small><small>7D</small><small>AR</small></div>
              <div className="dl-card-hover-details"><div><strong>XP progress</strong><small>See every completed challenge add up.</small></div><div><strong>Achievement badges</strong><small>Collect meaningful fitness milestones.</small></div><div><strong>Daily momentum</strong><small>Keep habits visible and rewarding.</small></div></div>
              <div className="dl-editorial-copy"><Heading level={3}>Progress you can feel.</Heading><p>{featureModes[2][1]}</p></div>
              <small>Click or hover to expand</small>
            </button>
          </div>
        </div>
      </section>

      <section className="dl-personas">
        <div className="dl-container">
          <div className="dl-section-heading centered"><Heading>However you move,<br />PACE AR moves with you.</Heading></div>
          <div className="dl-persona-grid">
            <article><img className="persona-flight-attendant" src="/assets/campaign/persona-flight-attendant.jpeg" alt="Flight attendant standing inside an airplane cabin" /><div><span>Sophia Reyes · Quezon City</span><Heading level={3}>Every run becomes a story worth sharing.</Heading><p>Flight attendant and content creator, age 21.</p></div></article>
            <article><img className="persona-business-owner" src="/assets/campaign/persona-business-owner.png" alt="Professional working on a laptop at a desk" /><div><span>Paolo De Guzman · Makati</span><Heading level={3}>Fitness that works around a full day.</Heading><p>Business owner and corporate manager, age 29.</p></div></article>
          </div>
        </div>
      </section>

      <section className="dl-how-section" id="dl-how">
        <div className="dl-moving-light" />
        <div className="dl-container">
          <div className="dl-section-heading centered light"><Heading>Scan. Move.<br />Complete the quest.</Heading></div>
          <div className="dl-steps" onMouseLeave={() => setStepHovered(false)}>
            <article className={activeStep === 0 ? "is-current" : ""} tabIndex={0} onMouseEnter={() => { setStepHovered(true); chooseStep(0); }} onFocus={() => { setStepFocused(true); chooseStep(0); }} onBlur={() => setStepFocused(false)}><span>01</span><div className="dl-step-visual scan"><div><i /><i /><i /><i /></div><strong>TRAIL QUEST</strong><small>Scanning...</small></div><Heading level={3}>Scan a quest card</Heading><p>Point your camera at any PACE AR card.</p></article>
            <article className={activeStep === 1 ? "is-current" : ""} tabIndex={0} onMouseEnter={() => { setStepHovered(true); chooseStep(1); }} onFocus={() => { setStepFocused(true); chooseStep(1); }} onBlur={() => setStepFocused(false)}><span>02</span><div className="dl-step-visual move"><i /><i /><i /><strong>1.0</strong><b>KM</b><small>ACTIVE QUEST</small></div><Heading level={3}>Complete the activity</Heading><p>Follow the guided movement at your pace.</p></article>
            <article className={activeStep === 2 ? "is-current" : ""} tabIndex={0} onMouseEnter={() => { setStepHovered(true); chooseStep(2); }} onFocus={() => { setStepFocused(true); chooseStep(2); }} onBlur={() => setStepFocused(false)}><span>03</span><div className="dl-step-visual earn"><i>Q</i><strong>+250 XP</strong><small>QUEST COMPLETE</small></div><Heading level={3}>Earn XP and badges</Heading><p>Finish strong and build your quest record.</p></article>
          </div>
        </div>
      </section>

      <section className="dl-benefits">
        <div className="dl-container">
          <div className="dl-section-heading"><Heading>Benefits that keep<br />you moving.</Heading></div>
          <div className="dl-benefit-grid">{features.map(([title, text, number, style, icon]) => <article className={style} tabIndex={0} key={title}><span>{number}</span><img src={`/assets/official/${icon}`} alt="" /><div><Heading level={3}>{title}</Heading><p>{text}</p></div></article>)}</div>
        </div>
      </section>

      <section className="dl-reviews">
        <div className="dl-container">
          <div className="dl-section-heading"><Heading>Real quests.<br />Real reviews.</Heading></div>
          <div className="dl-review-grid">
            {[
              {
                name: "Sophia Reyes", initials: "SR", role: "Flight Attendant & Fitness Content Creator", location: "Quezon City",
                title: "Finally, a fitness tracker that doesn't feel like a chore!",
                quote: "As a runner and flight attendant, I used to hate boring step counters. Scanning AR quest cards during my morning runs in QC makes habit tracking feel like a real game. Plus, my IG followers love seeing the XP badges I share on Reels!",
              },
              {
                name: "Paolo De Guzman", initials: "PD", role: "Corporate Manager & Business Owner", location: "Makati",
                title: "No hidden monthly fees & fits my busy Makati schedule.",
                quote: "I was tired of smartwatches charging ₱1,000+ yearly subscriptions just to unlock health data. PACE AR gives me accurate heart rate and sleep tracking with NO monthly fees. The 10-minute daily quests are super easy to squeeze between meetings.",
              },
              {
                name: "Alex Mendoza", initials: "AM", role: "Verified Buyer", location: "Metro Manila",
                title: "Turned my boring daily commute into an RPG quest!",
                quote: "I used to barely reach 3,000 steps a day. After getting the Midnight edition, I actually look forward to walking home to earn XP and build my daily streak. Hit my first 250 XP reward badge on week one!",
              },
            ].map(({ name, role, location, title, quote, initials }) => <article tabIndex={0} key={name}>
              <div className="dl-review-stars" role="img" aria-label="5 out of 5 stars">{[0, 1, 2, 3, 4].map(i => <i key={i} />)}</div>
              <h3 className="dl-review-title">“{title}”</h3>
              <p>“{quote}”</p>
              <div className="dl-review-author"><span aria-hidden="true">{initials}</span><strong>{name}<small>{role}<br />{location}</small></strong></div>
            </article>)}
          </div>
        </div>
      </section>

      <section className="dl-faq" id="dl-faq">
        <div className="dl-container dl-faq-grid">
          <div><Heading>Questions?<br />We have answers.</Heading></div>
          <div>{faqs.map(([question, answer], index) => <article className={openFaq === index ? "open" : ""} key={question}><button aria-expanded={openFaq === index} aria-controls={`faq-answer-${index}`} onClick={() => setOpenFaq(openFaq === index ? null : index)}><span>{question}</span><i /></button><p id={`faq-answer-${index}`}>{answer}</p></article>)}</div>
        </div>
      </section>

      <section className="dl-final-cta">
        <div className="dl-container">
          <div><div className="dl-eyebrow">Your next quest starts here</div><Heading>Ready to level up<br />your walk?</Heading><button onClick={onBuy}><img src="/assets/official/pace-ar-cart-icon.svg" alt="" />Buy PACE AR · ₱2,999</button></div>
          <div className="dl-cta-orbit"><svg className="cta-orbit-ring" viewBox="0 0 520 330" preserveAspectRatio="none" aria-hidden="true">
            <ellipse className="cta-orbit-track" cx="260" cy="165" rx="258" ry="163" pathLength="100" /><OrbitComet />
          </svg><svg className="cta-orbit-ring cta-orbit-front" viewBox="0 0 520 330" preserveAspectRatio="none" aria-hidden="true">
            <ellipse className="cta-orbit-track" cx="260" cy="165" rx="258" ry="163" pathLength="100" /><OrbitComet />
          </svg><ProductImage pose="side" color="Midnight Black" alt="Jet Black PACE AR side view" /></div>
        </div>
      </section>
    </main>

    <footer className="dl-footer">
      <div className="dl-container">
        <div className="dl-footer-brand"><a className="dl-footer-identity" href="#dl-overview"><Logo /><Heading level={3}>TrailQuest Inc.</Heading></a><p>Turn every walk into an adventure with fitness gamified.</p></div>
        <div><span>Explore</span>{[["Overview", "dl-overview"], ["Features", "dl-features"], ["How It Works", "dl-how"], ["Colors", "dl-colors"], ["FAQ", "dl-faq"]].map(([label, id]) => <a href={`#${id}`} key={id}>{label}</a>)}</div>
        <div><span>About this project</span><p className="footer-note">PACE AR is a conceptual fitness product by TrailQuest. Campaign personas, reviews and activity figures are illustrative.</p></div>
        <div><span>Contact</span><a href="mailto:help@trailquest.com"><img src="/assets/official/pace-ar-email-icon.svg" alt="" />help@trailquest.com</a><a href="https://www.trailquest.com"><img src="/assets/official/pace-ar-web-icon.svg" alt="" />www.trailquest.com</a></div>
      </div>
      <div className="dl-footer-bottom"><span>Copyright © 2026 TrailQuest Inc.</span><div><span>Academic prototype · No real purchases</span><a href="#dl-overview">Back to top ↑</a></div></div>
    </footer>
  </div>;
}


export default App;
