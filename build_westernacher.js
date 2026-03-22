const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const { FaBrain, FaCogs, FaUsers, FaRocket, FaChartLine, FaCheckCircle, FaArrowRight } = require("react-icons/fa");

async function iconToBase64Png(IconComponent, color, size = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color, size: String(size) })
  );
  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + pngBuffer.toString("base64");
}

// ─── WESTERNACHER BRAND PALETTE ───────────────────────────────────
// Pixel-sampled directly from westernacher.com screenshot:
// Sky Blue card (#93CCEA), Lilac card (#CECAE5), Bronze card (#8B734D)
const W = {
  black:     "0A0A0A",
  white:     "FFFFFF",
  blue:      "93CCEA",   // Westernacher Blue — pixel-sampled from screenshot (light, use on dark bg)
  blueDark:  "1A6A9A",   // Darker version of the same hue — for text/accents on white/light bg
  offWhite:  "F7F7F7",
  lightGray: "E8E8E8",
  midGray:   "8A8A8A",
  darkGray:  "3A3A3A",
  // Section accent colors — pixel-sampled from screenshot
  skyBlue:   "93CCEA",   // Westernacher Blue (same — dominant card color)
  lavender:  "CECAE5",   // Lilac card (Belenos panel)
  warmGold:  "8B734D",   // Bronze card (Milliken panel)
};

// "Westernacher" logotype text — always black on light, white on dark
// The dot accent (•) is always in W.blue

async function buildPresentation() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.title = "Westernacher AI Council — Regional Summit 2026";
  pres.author = "Westernacher AI Council";

  const makeShadow = () => ({ type: "outer", blur: 6, offset: 2, angle: 135, color: "000000", opacity: 0.08 });

  // Pre-render icons
  const iconBrainBlue    = await iconToBase64Png(FaBrain,       "#" + W.blueDark);
  const iconCogsBlue     = await iconToBase64Png(FaCogs,        "#" + W.blueDark);
  const iconUsersBlue    = await iconToBase64Png(FaUsers,       "#" + W.blueDark);
  const iconRocketBlue   = await iconToBase64Png(FaRocket,      "#" + W.blueDark);
  const iconChartBlue    = await iconToBase64Png(FaChartLine,   "#" + W.blueDark);
  const iconCheckBlue    = await iconToBase64Png(FaCheckCircle, "#" + W.blueDark);
  const iconBrainWhite   = await iconToBase64Png(FaBrain,       "#FFFFFF");
  const iconCogsWhite    = await iconToBase64Png(FaCogs,        "#FFFFFF");
  const iconUsersWhite   = await iconToBase64Png(FaUsers,       "#FFFFFF");
  const iconRocketWhite  = await iconToBase64Png(FaRocket,      "#FFFFFF");
  const iconChartWhite   = await iconToBase64Png(FaChartLine,   "#FFFFFF");
  const iconCheckWhite   = await iconToBase64Png(FaCheckCircle, "#FFFFFF");

  // ── HELPER: add Westernacher logo to slide ──────────────────────
  const LOGO_DARK  = `image/png;base64,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`;
  const LOGO_WHITE = `image/png;base64,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`;

  function addLogo(s, dark = false) {
    s.addImage({
      data: dark ? LOGO_WHITE : LOGO_DARK,
      x: 0.45, y: 0.18, w: 1.85, h: 0.2
    });
  }

  // ── HELPER: blue dot headline ───────────────────────────────────
  function addDotHeadline(s, text, x, y, w, h, fontSize, dark = false) {
    s.addText([
      { text: text, options: { color: dark ? W.white : W.black } },
      { text: ".", options: { color: W.blue } }
    ], { x, y, w, h, fontSize, bold: true, fontFace: "Arial Black", margin: 0 });
  }

  // ─────────────────────────────────────────────────────────────────
  // SLIDE 1: TITLE — Black canvas, white text
  // ─────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: W.black };

    addLogo(s, true);

    // Blue horizontal rule
    s.addShape(pres.shapes.LINE, { x: 0.45, y: 0.65, w: 1.2, h: 0, line: { color: W.blue, width: 2 } });

    // Main title
    s.addText([
      { text: "AI Council", options: { color: W.white } },
      { text: ".", options: { color: W.blue } }
    ], {
      x: 0.45, y: 1.1, w: 9, h: 1.7,
      fontSize: 72, bold: true, fontFace: "Arial Black", margin: 0
    });

    // Subtitle
    s.addText("Regional Summit  2026", {
      x: 0.45, y: 2.9, w: 6, h: 0.5,
      fontSize: 20, color: W.midGray, fontFace: "Arial", margin: 0
    });

    s.addText("From curiosity to consulting multiplier.", {
      x: 0.45, y: 3.5, w: 7, h: 0.55,
      fontSize: 22, color: W.white, fontFace: "Arial", italic: true, margin: 0
    });

    // Region tags bottom right
    s.addText("India  ·  Middle East  ·  Asia Pacific", {
      x: 6.5, y: 5.1, w: 3.2, h: 0.35,
      fontSize: 11, color: W.midGray, align: "right", margin: 0
    });

    // Blue bottom accent line
    s.addShape(pres.shapes.LINE, { x: 0, y: 5.45, w: 10, h: 0, line: { color: W.blue, width: 3 } });
  }

  // ─────────────────────────────────────────────────────────────────
  // SLIDE 2: AGENDA — White canvas
  // ─────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: W.white };
    addLogo(s, false);
    s.addShape(pres.shapes.LINE, { x: 0.45, y: 0.65, w: 1.2, h: 0, line: { color: W.blue, width: 2 } });

    addDotHeadline(s, "30 Minutes. Three Acts", 0.45, 0.85, 8, 0.85, 42);

    const acts = [
      { num: "01", title: "The Strategy", sub: "Mission, model & what 2026 is really about", time: "~8 min", color: W.black },
      { num: "02", title: "Live Demo #1", sub: "AI tool built by our team — watch it work", time: "~8 min", color: W.blueDark },
      { num: "03", title: "Live Demo #2", sub: "Second prototype — different use case", time: "~8 min", color: W.blueDark },
    ];

    acts.forEach((act, i) => {
      const x = 0.45 + i * 3.15;

      // Card
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 2.0, w: 2.95, h: 3.1,
        fill: { color: i === 0 ? W.black : W.offWhite },
        shadow: makeShadow()
      });

      // Number with blue dot
      s.addText([
        { text: act.num, options: { color: i === 0 ? W.white : W.black } },
        { text: ".", options: { color: W.blue } }
      ], {
        x: x + 0.2, y: 2.15, w: 1.5, h: 0.65,
        fontSize: 32, bold: true, fontFace: "Arial Black", margin: 0
      });

      // Title
      s.addText(act.title, {
        x: x + 0.2, y: 2.9, w: 2.6, h: 0.5,
        fontSize: 20, bold: true, fontFace: "Arial",
        color: i === 0 ? W.white : W.black, margin: 0
      });

      // Sub
      s.addText(act.sub, {
        x: x + 0.2, y: 3.48, w: 2.6, h: 0.75,
        fontSize: 12, color: i === 0 ? W.midGray : W.darkGray, fontFace: "Arial", margin: 0
      });

      // Time badge
      s.addShape(pres.shapes.RECTANGLE, {
        x: x + 0.2, y: 4.62, w: 0.95, h: 0.28,
        fill: { color: i === 0 ? W.blue : W.lightGray }
      });
      s.addText(act.time, {
        x: x + 0.2, y: 4.62, w: 0.95, h: 0.28,
        fontSize: 10, bold: true, color: i === 0 ? W.white : W.darkGray,
        align: "center", valign: "middle", margin: 0
      });
    });

    s.addText("Plus: what we need from you before we close.", {
      x: 0.45, y: 5.22, w: 9, h: 0.3,
      fontSize: 12, color: W.midGray, italic: true, margin: 0
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // SLIDE 3: THE MOMENT — Black canvas
  // ─────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: W.black };
    addLogo(s, true);
    s.addShape(pres.shapes.LINE, { x: 0.45, y: 0.65, w: 1.2, h: 0, line: { color: W.blue, width: 2 } });

    s.addText("The moment\nwe're in", {
      x: 0.45, y: 0.9, w: 5.5, h: 1.8,
      fontSize: 52, bold: true, color: W.white, fontFace: "Arial Black", margin: 0
    });

    s.addText([
      { text: "AI won't replace consultants.", options: { color: W.white, bold: true } }
    ], {
      x: 0.45, y: 2.85, w: 5.7, h: 0.6,
      fontSize: 22, fontFace: "Arial", margin: 0
    });

    s.addText([
      { text: "Consultants using AI will replace those who don't", options: { color: W.blue } },
      { text: ".", options: { color: W.blue } }
    ], {
      x: 0.45, y: 3.5, w: 5.7, h: 0.75,
      fontSize: 22, fontFace: "Arial", italic: true, margin: 0
    });

    // Right column — three shifts
    const shifts = [
      { from: "Individual tinkering", to: "Shared tools & reuse" },
      { from: "Large AI visions", to: "Small, repeatable wins" },
      { from: "Someone will figure it out", to: "We play with it" },
    ];

    // Divider
    s.addShape(pres.shapes.LINE, { x: 6.3, y: 0.8, w: 0, h: 4.4, line: { color: W.darkGray, width: 1 } });

    shifts.forEach((sh, i) => {
      const y = 1.0 + i * 1.5;
      s.addText(sh.from, {
        x: 6.6, y, w: 3.1, h: 0.38,
        fontSize: 12, color: W.midGray, italic: true, fontFace: "Arial", margin: 0
      });
      s.addShape(pres.shapes.LINE, { x: 6.6, y: y + 0.44, w: 0.8, h: 0, line: { color: W.blue, width: 2 } });
      s.addText(sh.to, {
        x: 6.6, y: y + 0.6, w: 3.1, h: 0.45,
        fontSize: 16, bold: true, color: W.white, fontFace: "Arial", margin: 0
      });
    });

    s.addText("Our job: make Westernacher the firm that leads this shift.", {
      x: 0.45, y: 5.08, w: 9, h: 0.4,
      fontSize: 13, color: W.midGray, italic: true, margin: 0
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // SLIDE 4: THE AI COUNCIL — White canvas
  // ─────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: W.white };
    addLogo(s, false);
    s.addShape(pres.shapes.LINE, { x: 0.45, y: 0.65, w: 1.2, h: 0, line: { color: W.blue, width: 2 } });

    addDotHeadline(s, "The AI Council", 0.45, 0.85, 8, 0.75, 40);

    s.addText("What it is. What it isn't.", {
      x: 0.45, y: 1.65, w: 8, h: 0.45,
      fontSize: 18, color: W.midGray, fontFace: "Arial", margin: 0
    });

    // Mission strip
    s.addShape(pres.shapes.RECTANGLE, { x: 0.45, y: 2.25, w: 9.1, h: 0.72, fill: { color: W.offWhite } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.45, y: 2.25, w: 0.06, h: 0.72, fill: { color: W.blue } });
    s.addText("Mission: Deliver measurable profitability and operational improvements using AI — aligned to Westernacher's SAP + Supply Chain + Process strengths.", {
      x: 0.7, y: 2.3, w: 8.7, h: 0.62,
      fontSize: 13, fontFace: "Arial", color: W.darkGray, valign: "middle", margin: 0
    });

    // Three pillars
    const pillars = [
      { icon: iconRocketBlue, iconW: iconRocketWhite, title: "Revenue Factory", body: "Sellable offers, paid pilots,\npipeline velocity.\nNot free PoCs.", dark: true },
      { icon: iconCogsBlue,   iconW: iconCogsWhite,   title: "Delivery Factory", body: "Internal accelerators, reuse\nassets, delivery playbooks.\nFewer hours, better outcomes.", dark: false },
      { icon: iconUsersBlue,  iconW: iconUsersWhite,  title: "AI Allies Network", body: "Cross-org community.\nFunnels real use cases\ninto both factories.", dark: false },
    ];

    pillars.forEach((p, i) => {
      const x = 0.45 + i * 3.15;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 3.2, w: 2.95, h: 2.1,
        fill: { color: i === 0 ? W.black : W.offWhite },
        shadow: makeShadow()
      });
      s.addImage({ data: i === 0 ? p.iconW : p.icon, x: x + 0.22, y: 3.35, w: 0.36, h: 0.36 });
      s.addText(p.title, {
        x: x + 0.22, y: 3.82, w: 2.6, h: 0.42,
        fontSize: 15, bold: true, fontFace: "Arial",
        color: i === 0 ? W.white : W.black, margin: 0
      });
      s.addText(p.body, {
        x: x + 0.22, y: 4.3, w: 2.6, h: 0.85,
        fontSize: 11, fontFace: "Arial",
        color: i === 0 ? W.midGray : W.darkGray, margin: 0
      });
    });

    s.addText("Rule: If AI does not improve revenue, margin, or speed — we stop it.", {
      x: 0.45, y: 5.3, w: 9.1, h: 0.28,
      fontSize: 11, bold: true, color: W.blueDark, fontFace: "Arial", margin: 0
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // SLIDE 5: ROADMAP — White canvas, minimal timeline
  // ─────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: W.white };
    addLogo(s, false);
    s.addShape(pres.shapes.LINE, { x: 0.45, y: 0.65, w: 1.2, h: 0, line: { color: W.blue, width: 2 } });

    addDotHeadline(s, "2026 Roadmap", 0.45, 0.85, 8, 0.7, 40);
    s.addText("Build  →  Monetize  →  Scale  →  Standardize.", {
      x: 0.45, y: 1.6, w: 8, h: 0.42,
      fontSize: 16, color: W.darkGray, fontFace: "Arial", margin: 0
    });

    // Timeline line
    s.addShape(pres.shapes.LINE, { x: 0.75, y: 2.72, w: 8.5, h: 0, line: { color: W.lightGray, width: 2 } });

    const quarters = [
      { q: "Q1", label: "Foundation", active: true, items: ["AI literacy rollout", "Proposal Accelerator v1", "2 demos ready", "10 accounts briefed"] },
      { q: "Q2", label: "Monetize",   active: false, items: ["4 AI Value Sprints", "2 paid pilots signed", "Reusable Asset Library"] },
      { q: "Q3", label: "Scale",      active: false, items: ["Productize top 2 wins", "Reference kits", "Time-to-Value packages"] },
      { q: "Q4", label: "Standardize",active: false, items: ["Governance v1", "2027 pipeline locked", "AI Council as factory"] },
    ];

    quarters.forEach((q, i) => {
      const x = 0.55 + i * 2.35;

      // Circle on timeline
      s.addShape(pres.shapes.OVAL, {
        x: x + 0.62, y: 2.47, w: 0.5, h: 0.5,
        fill: { color: q.active ? W.blue : W.lightGray }
      });
      s.addText(q.q, {
        x: x + 0.62, y: 2.47, w: 0.5, h: 0.5,
        fontSize: 11, bold: true, color: W.white, align: "center", valign: "middle", margin: 0
      });

      // Card
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 3.05, w: 2.2, h: 2.3,
        fill: { color: q.active ? W.black : W.offWhite },
        shadow: makeShadow()
      });
      if (q.active) {
        s.addShape(pres.shapes.RECTANGLE, { x, y: 3.05, w: 2.2, h: 0.05, fill: { color: W.blue } });
      }
      s.addText(q.label, {
        x: x + 0.15, y: 3.18, w: 1.95, h: 0.38,
        fontSize: 14, bold: true, fontFace: "Arial",
        color: q.active ? W.white : W.black, margin: 0
      });
      q.items.forEach((item, j) => {
        s.addText([
          { text: "— ", options: { color: W.blue, bold: true } },
          { text: item, options: { color: q.active ? W.midGray : W.darkGray } }
        ], {
          x: x + 0.15, y: 3.65 + j * 0.4, w: 1.98, h: 0.38,
          fontSize: 10.5, fontFace: "Arial", margin: 0
        });
      });
    });

    // "We are here" marker
    s.addShape(pres.shapes.RECTANGLE, { x: 0.55, y: 1.95, w: 1.7, h: 0.32, fill: { color: W.blue } });
    s.addText("▼  We are here", {
      x: 0.55, y: 1.95, w: 1.7, h: 0.32,
      fontSize: 10, bold: true, color: W.black, align: "center", valign: "middle", margin: 0
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // SLIDE 6: Q1 PROGRESS — Off-white canvas
  // ─────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: W.offWhite };
    addLogo(s, false);
    s.addShape(pres.shapes.LINE, { x: 0.45, y: 0.65, w: 1.2, h: 0, line: { color: W.blue, width: 2 } });

    addDotHeadline(s, "What we shipped in Q1", 0.45, 0.85, 9, 0.7, 38);

    const items = [
      { title: "AI Literacy Launched",     body: "MIT AI 101 + prompting basics rolled out across consultant and sales tracks." },
      { title: "Enterprise Starter Kit",   body: "Reusable web UI + RAG agent base — used in every demo and sprint." },
      { title: "AI Value Sprint SOW",       body: "2-week fixed-fee prototype → paid pilot model. Ready to sell." },
      { title: "2 Demo Solutions Built",    body: "Both prototypes you'll see today. Built from scratch on real use cases." },
      { title: "AI Allies Network Live",    body: "Cross-org community active across India, ME and APAC regions." },
      { title: "10+ Accounts Briefed",      body: "Sales + domain leads running AI discovery sessions with target accounts." },
    ];

    items.forEach((item, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = 0.45 + col * 3.15;
      const y = 1.75 + row * 1.72;

      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: 2.95, h: 1.55,
        fill: { color: W.white }, shadow: makeShadow()
      });
      s.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.05, h: 1.55, fill: { color: W.blue } });
      s.addImage({ data: iconCheckBlue, x: x + 0.18, y: y + 0.18, w: 0.3, h: 0.3 });
      s.addText(item.title, {
        x: x + 0.6, y: y + 0.15, w: 2.2, h: 0.38,
        fontSize: 13, bold: true, fontFace: "Arial", color: W.black, margin: 0
      });
      s.addText(item.body, {
        x: x + 0.18, y: y + 0.6, w: 2.65, h: 0.8,
        fontSize: 11, fontFace: "Arial", color: W.darkGray, margin: 0
      });
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // SLIDE 7: 3 VALUE LANES — White canvas
  // ─────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: W.white };
    addLogo(s, false);
    s.addShape(pres.shapes.LINE, { x: 0.45, y: 0.65, w: 1.2, h: 0, line: { color: W.blue, width: 2 } });

    addDotHeadline(s, "Three lanes. All SAP-aligned", 0.45, 0.85, 9, 0.7, 38);
    s.addText("We don't do generic AI. Every offering anchors to Westernacher's core: SAP, supply chain, process transformation.", {
      x: 0.45, y: 1.62, w: 9.1, h: 0.42,
      fontSize: 13, color: W.midGray, fontFace: "Arial", margin: 0
    });

    // Three section cards — using the website section color language
    const lanes = [
      {
        num: "01", title: "Planning &\nDecision Support",
        anchor: "SAP IBP",
        bg: W.skyBlue,
        icon: iconChartWhite,
        bullets: ["Improved planning insight", "Scenario analysis & simulation", "Exception handling automation"],
      },
      {
        num: "02", title: "Process\nIntelligence",
        anchor: "SAP Signavio",
        bg: W.lavender,
        icon: iconBrainWhite,
        bullets: ["Process mining → recommendations", "Bottleneck identification", "Actionable remediation paths"],
      },
      {
        num: "03", title: "Consulting\nProductivity",
        anchor: "Pre-sales + Delivery",
        bg: W.black,
        icon: iconRocketWhite,
        bullets: ["30–50% faster proposal drafts", "Auto-generate workshop agendas", "Blueprint & SOW acceleration"],
      },
    ];

    lanes.forEach((lane, i) => {
      const x = 0.45 + i * 3.15;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 2.2, w: 2.95, h: 3.15,
        fill: { color: lane.bg }, shadow: makeShadow()
      });
      s.addImage({ data: lane.icon, x: x + 0.22, y: 2.35, w: 0.38, h: 0.38 });
      s.addText([
        { text: lane.num, options: { color: W.white } },
        { text: ".", options: { color: W.blue } }
      ], {
        x: x + 0.72, y: 2.32, w: 0.9, h: 0.45,
        fontSize: 22, bold: true, fontFace: "Arial Black", margin: 0
      });
      s.addText(lane.title, {
        x: x + 0.22, y: 2.85, w: 2.6, h: 0.72,
        fontSize: 18, bold: true, fontFace: "Arial", color: W.white, margin: 0
      });
      // Anchor tag
      s.addShape(pres.shapes.RECTANGLE, { x: x + 0.22, y: 3.63, w: 1.35, h: 0.26, fill: { color: W.blue } });
      s.addText(lane.anchor, {
        x: x + 0.22, y: 3.63, w: 1.35, h: 0.26,
        fontSize: 10, bold: true, color: W.white, align: "center", valign: "middle", margin: 0
      });
      lane.bullets.forEach((b, j) => {
        s.addText([
          { text: "— ", options: { color: W.white, bold: true } },
          { text: b, options: { color: W.white } }
        ], {
          x: x + 0.22, y: 4.05 + j * 0.37, w: 2.6, h: 0.35,
          fontSize: 11, fontFace: "Arial", margin: 0
        });
      });
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // ─────────────────────────────────────────────────────────────────
  // SLIDE 8: DEMO 1 — Consulting Productivity Agent
  // Large QR code (audience scan) + hyperlink button (presenter)
  // ─────────────────────────────────────────────────────────────────
  {
    const qrBlue = "data:image/png;base64,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";

    const s = pres.addSlide();
    s.background = { color: W.black };
    addLogo(s, true);
    s.addShape(pres.shapes.LINE, { x: 0.45, y: 0.65, w: 0.8, h: 0, line: { color: W.blue, width: 2 } });

    s.addText("LIVE DEMO  ·  01", {
      x: 0.45, y: 0.85, w: 5.8, h: 0.32,
      fontSize: 9.5, bold: true, color: W.blue, charSpacing: 2.5, fontFace: "Arial", margin: 0
    });

    // Title
    s.addText([
      { text: "AI Proposal Agent", options: { color: W.white } },
      { text: ".", options: { color: W.blue } }
    ], {
      x: 0.45, y: 1.22, w: 5.8, h: 0.85,
      fontSize: 40, bold: true, fontFace: "Arial Black", margin: 0
    });

    // Sub
    s.addText("Consulting Productivity", {
      x: 0.45, y: 2.12, w: 5.8, h: 0.4,
      fontSize: 15, color: "666666", fontFace: "Arial", margin: 0
    });

    // Three feature rows
    const feats = [
      { icon: "⚡", t: "Paste a client brief — get a full SOW in 30 seconds" },
      { icon: "📋", t: "Scope · Timeline · Value hypothesis · Risks — all structured" },
      { icon: "📤", t: "Export directly to Word or PowerPoint with one click" },
    ];
    feats.forEach((f, i) => {
      s.addShape(pres.shapes.RECTANGLE, { x: 0.45, y: 2.7 + i*0.62, w: 5.8, h: 0.54, fill: { color: i%2===0 ? "0D0D0D" : "111111" } });
      s.addShape(pres.shapes.RECTANGLE, { x: 0.45, y: 2.7 + i*0.62, w: 0.04, h: 0.54, fill: { color: W.blue } });
      s.addText(f.icon + "  " + f.t, {
        x: 0.62, y: 2.73 + i*0.62, w: 5.5, h: 0.48,
        fontSize: 12, color: "AAAAAA", fontFace: "Arial", valign: "middle", margin: 0
      });
    });

    // Presenter launch button
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.45, y: 4.72, w: 2.6, h: 0.52,
      fill: { color: W.blue },
      hyperlink: { url: "https://bindx-consulting.github.io/westernacher-ai-regional-meeting/wepulse.html" }
    });
    s.addText("▶   Launch Demo", {
      x: 0.45, y: 4.72, w: 2.6, h: 0.52,
      fontSize: 13, bold: true, color: W.black, align: "center", valign: "middle", fontFace: "Arial", margin: 0,
      hyperlink: { url: "https://bindx-consulting.github.io/westernacher-ai-regional-meeting/wepulse.html" }
    });
    s.addText("Click to open in browser", {
      x: 3.18, y: 4.78, w: 2.5, h: 0.4,
      fontSize: 10, color: "444444", fontFace: "Arial", italic: true, valign: "middle", margin: 0
    });

    // ── QR CODE PANEL (right side) ──
    s.addShape(pres.shapes.RECTANGLE, {
      x: 6.55, y: 0.75, w: 3.1, h: 4.75,
      fill: { color: "0D0D0D" }
    });
    s.addShape(pres.shapes.RECTANGLE, { x: 6.55, y: 0.75, w: 3.1, h: 0.04, fill: { color: W.blue } });

    // Audience label
    s.addText("SCAN TO TRY IT NOW", {
      x: 6.7, y: 0.9, w: 2.8, h: 0.35,
      fontSize: 10, bold: true, color: W.blue, charSpacing: 1.5, align: "center", fontFace: "Arial", margin: 0
    });

    // QR code image — centred in panel
    s.addImage({ data: qrBlue, x: 6.9, y: 1.35, w: 2.7, h: 2.7 });

    // URL below QR
    s.addText("bindx-consulting.github.io/westernacher-ai-regional-meeting/wepulse.html", {
      x: 6.7, y: 4.12, w: 2.8, h: 0.3,
      fontSize: 9, color: "555555", align: "center", fontFace: "Arial", margin: 0
    });

    // Audience instruction
    s.addShape(pres.shapes.RECTANGLE, { x: 6.7, y: 4.5, w: 2.7, h: 0.75, fill: { color: "141414" } });
    s.addText("Open on your phone or laptop\nAsk Westernacher anything\u2009\u2014 watch it answer live", {
      x: 6.75, y: 4.55, w: 2.6, h: 0.65,
      fontSize: 10.5, color: "888888", align: "center", fontFace: "Arial", margin: 0
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // SLIDE 9: DEMO 2 — Westernacher AI Desk
  // Large QR code (audience scan) + hyperlink button (presenter)
  // ─────────────────────────────────────────────────────────────────
  {
    const qrBlue2 = "data:image/png;base64,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";

    const s = pres.addSlide();
    s.background = { color: W.black };
    addLogo(s, true);
    s.addShape(pres.shapes.LINE, { x: 0.45, y: 0.65, w: 0.8, h: 0, line: { color: W.blue, width: 2 } });

    s.addText("LIVE DEMO  ·  02", {
      x: 0.45, y: 0.85, w: 5.8, h: 0.32,
      fontSize: 9.5, bold: true, color: W.blue, charSpacing: 2.5, fontFace: "Arial", margin: 0
    });

    // Title
    s.addText([
      { text: "Westernacher AI Desk", options: { color: W.white } },
      { text: ".", options: { color: W.blue } }
    ], {
      x: 0.45, y: 1.22, w: 5.8, h: 0.85,
      fontSize: 34, bold: true, fontFace: "Arial Black", margin: 0
    });

    s.addText("Ask anything. Get answers. Export instantly.", {
      x: 0.45, y: 2.12, w: 5.8, h: 0.4,
      fontSize: 14, color: W.blue, fontFace: "Arial", italic: true, margin: 0
    });

    // Three capability rows
    const caps = [
      { icon: "🧠", t: "55+ years of Westernacher knowledge — clients, capabilities, wins" },
      { icon: "💬", t: "Natural language Q&A — grounded in real content, no hallucination" },
      { icon: "📊", t: "Any answer exported to Excel, Word, or PowerPoint in seconds" },
    ];
    caps.forEach((c, i) => {
      s.addShape(pres.shapes.RECTANGLE, { x: 0.45, y: 2.7 + i*0.62, w: 5.8, h: 0.54, fill: { color: i%2===0 ? "0D0D0D" : "111111" } });
      s.addShape(pres.shapes.RECTANGLE, { x: 0.45, y: 2.7 + i*0.62, w: 0.04, h: 0.54, fill: { color: W.blue } });
      s.addText(c.icon + "  " + c.t, {
        x: 0.62, y: 2.73 + i*0.62, w: 5.5, h: 0.48,
        fontSize: 12, color: "AAAAAA", fontFace: "Arial", valign: "middle", margin: 0
      });
    });

    // Presenter launch button
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.45, y: 4.72, w: 2.6, h: 0.52,
      fill: { color: W.blue },
      hyperlink: { url: "https://bindx-consulting.github.io/westernacher-ai-regional-meeting/westernacher_ai_desk.html" }
    });
    s.addText("▶   Launch AI Desk", {
      x: 0.45, y: 4.72, w: 2.6, h: 0.52,
      fontSize: 13, bold: true, color: W.black, align: "center", valign: "middle", fontFace: "Arial", margin: 0,
      hyperlink: { url: "https://bindx-consulting.github.io/westernacher-ai-regional-meeting/westernacher_ai_desk.html" }
    });
    s.addText("Click to open in browser", {
      x: 3.18, y: 4.78, w: 2.5, h: 0.4,
      fontSize: 10, color: "444444", fontFace: "Arial", italic: true, valign: "middle", margin: 0
    });

    // ── QR CODE PANEL (right side) ──
    s.addShape(pres.shapes.RECTANGLE, {
      x: 6.55, y: 0.75, w: 3.1, h: 4.75,
      fill: { color: "0D0D0D" }
    });
    s.addShape(pres.shapes.RECTANGLE, { x: 6.55, y: 0.75, w: 3.1, h: 0.04, fill: { color: W.blue } });

    s.addText("SCAN TO TRY IT NOW", {
      x: 6.7, y: 0.9, w: 2.8, h: 0.35,
      fontSize: 10, bold: true, color: W.blue, charSpacing: 1.5, align: "center", fontFace: "Arial", margin: 0
    });

    s.addImage({ data: qrBlue2, x: 6.9, y: 1.35, w: 2.7, h: 2.7 });

    s.addText("bindx-consulting.github.io/westernacher-ai-regional-meeting", {
      x: 6.7, y: 4.12, w: 2.8, h: 0.3,
      fontSize: 9, color: "555555", align: "center", fontFace: "Arial", margin: 0
    });

    s.addShape(pres.shapes.RECTANGLE, { x: 6.7, y: 4.5, w: 2.7, h: 0.75, fill: { color: "141414" } });
    s.addText("Open on your phone or laptop\nAsk Westernacher anything\u2009\u2014 watch it answer live", {
      x: 6.75, y: 4.55, w: 2.6, h: 0.65,
      fontSize: 10.5, color: "888888", align: "center", fontFace: "Arial", margin: 0
    });
  }

  // SLIDE 10: AI ALLIES — White canvas
  // ─────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: W.white };
    addLogo(s, false);
    s.addShape(pres.shapes.LINE, { x: 0.45, y: 0.65, w: 1.2, h: 0, line: { color: W.blue, width: 2 } });

    addDotHeadline(s, "AI Allies Network", 0.45, 0.85, 8, 0.7, 40);

    s.addText("You don't have to build — but you should contribute.", {
      x: 0.45, y: 1.62, w: 8, h: 0.45,
      fontSize: 17, color: W.darkGray, fontFace: "Arial", margin: 0
    });

    // Quote
    s.addShape(pres.shapes.RECTANGLE, { x: 0.45, y: 2.2, w: 9.1, h: 0.82, fill: { color: W.offWhite } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.45, y: 2.2, w: 0.05, h: 0.82, fill: { color: W.blue } });
    s.addText('"Connect AI-curious and AI-skilled colleagues — foster a shared space to collect, exchange, and grow practical AI knowledge across the region."', {
      x: 0.68, y: 2.27, w: 8.7, h: 0.68,
      fontSize: 13, color: W.darkGray, italic: true, fontFace: "Arial", valign: "middle", margin: 0
    });

    // Three roles
    const roles = [
      { icon: iconUsersBlue,  iconW: iconUsersWhite,  title: "AI Promoters",       body: "Spot real use cases on projects.\nBring them to the council.", dark: true },
      { icon: iconBrainBlue,  iconW: iconBrainWhite,  title: "Domain SMEs",         body: "Validate prototypes.\nGive the demos business context.", dark: false },
      { icon: iconRocketBlue, iconW: iconRocketWhite, title: "Technical Champions", body: "Help build. Learn agent basics.\nSupport pilots.", dark: false },
    ];
    roles.forEach((role, i) => {
      const x = 0.45 + i * 3.15;
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: 3.22, w: 2.95, h: 2.0,
        fill: { color: i === 0 ? W.black : W.offWhite }, shadow: makeShadow()
      });
      s.addImage({ data: i === 0 ? role.iconW : role.icon, x: x + 0.22, y: 3.38, w: 0.36, h: 0.36 });
      s.addText(role.title, {
        x: x + 0.22, y: 3.85, w: 2.6, h: 0.4,
        fontSize: 15, bold: true, fontFace: "Arial",
        color: i === 0 ? W.white : W.black, margin: 0
      });
      s.addText(role.body, {
        x: x + 0.22, y: 4.3, w: 2.6, h: 0.75,
        fontSize: 12, fontFace: "Arial",
        color: i === 0 ? W.midGray : W.darkGray, margin: 0
      });
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // SLIDE 11: CLOSE / 3 ASKS — Black canvas
  // ─────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: W.black };
    addLogo(s, true);
    s.addShape(pres.shapes.LINE, { x: 0.45, y: 0.65, w: 1.2, h: 0, line: { color: W.blue, width: 2 } });

    s.addText([
      { text: "Three asks", options: { color: W.white } },
      { text: ".", options: { color: W.blue } }
    ], {
      x: 0.45, y: 0.9, w: 5.8, h: 1.5,
      fontSize: 58, bold: true, fontFace: "Arial Black", margin: 0
    });

    const asks = [
      { num: "1", text: "Nominate a use case from your project. One real pain point that AI could address." },
      { num: "2", text: "Connect us with one client who would benefit from an AI Value Sprint." },
      { num: "3", text: "Join AI Allies — or nominate someone from your team who should." },
    ];

    asks.forEach((ask, i) => {
      const y = 2.55 + i * 0.85;
      s.addShape(pres.shapes.OVAL, { x: 0.45, y: y, w: 0.44, h: 0.44, fill: { color: W.blue } });
      s.addText(ask.num, {
        x: 0.45, y: y, w: 0.44, h: 0.44,
        fontSize: 14, bold: true, color: W.white, align: "center", valign: "middle", margin: 0
      });
      s.addText(ask.text, {
        x: 1.05, y: y + 0.03, w: 5.2, h: 0.42,
        fontSize: 14, color: W.midGray, fontFace: "Arial", valign: "middle", margin: 0
      });
    });

    // KPI sidebar
    s.addShape(pres.shapes.RECTANGLE, {
      x: 6.6, y: 0.85, w: 3.05, h: 4.38,
      fill: { color: W.darkGray }, shadow: makeShadow()
    });
    s.addShape(pres.shapes.RECTANGLE, { x: 6.6, y: 0.85, w: 3.05, h: 0.05, fill: { color: W.blue } });
    s.addText("2026 KPIs", {
      x: 6.78, y: 1.0, w: 2.8, h: 0.4,
      fontSize: 13, bold: true, fontFace: "Arial", color: W.blue, margin: 0
    });
    const kpis = [
      { v: "2–4",    l: "Paid pilots per region" },
      { v: "30–50%", l: "Faster proposal drafts" },
      { v: "5",      l: "KPIs tracked (no more)" },
      { v: "1",      l: "Starter Kit reused in every sprint" },
    ];
    kpis.forEach((kpi, i) => {
      s.addText(kpi.v, {
        x: 6.78, y: 1.6 + i * 0.84, w: 2.8, h: 0.5,
        fontSize: 30, bold: true, fontFace: "Arial Black", color: W.white, margin: 0
      });
      s.addText(kpi.l, {
        x: 6.78, y: 2.08 + i * 0.84, w: 2.8, h: 0.35,
        fontSize: 11, color: W.midGray, fontFace: "Arial", margin: 0
      });
    });

    // Footer
    s.addShape(pres.shapes.LINE, { x: 0, y: 5.38, w: 10, h: 0, line: { color: W.blue, width: 2 } });
    s.addText("Westernacher  ·  India  ·  Middle East  ·  APAC  ·  2026", {
      x: 0, y: 5.27, w: 10, h: 0.32,
      fontSize: 11, color: W.midGray, align: "center", fontFace: "Arial", margin: 0
    });
  }

  await pres.writeFile({ fileName: "/home/claude/AI_Council_Summit_2026_Westernacher.pptx" });
  console.log("Done.");
}

buildPresentation().catch(console.error);
