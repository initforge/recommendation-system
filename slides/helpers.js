/**
 * helpers.js — Shared constants, colors, and reusable slide builders
 */
const path = require('path');

// ── Color Palette ──────────────────────────────────────────
const C = {
  coral:      'E8705A',
  teal:       '2A9D8F',
  golden:     'E9C46A',
  purple:     '7B68EE',
  darkText:   '2D3436',
  lightText:  '636E72',
  white:      'FFFFFF',
  cream:      'FFF8F0',
  lightGray:  'F5F5F5',
  darkBg:     '2D3436',
  accent1:    'E76F51',
  accent2:    '264653',
};

// ── Font Defaults ──────────────────────────────────────────
const FONT = {
  title:    { fontFace: 'Segoe UI', fontSize: 28, bold: true, color: C.darkText },
  subtitle: { fontFace: 'Segoe UI', fontSize: 16, color: C.lightText },
  body:     { fontFace: 'Segoe UI', fontSize: 13, color: C.darkText, lineSpacingMultiple: 1.3 },
  bullet:   { fontFace: 'Segoe UI', fontSize: 12, color: C.darkText, lineSpacingMultiple: 1.4 },
  small:    { fontFace: 'Segoe UI', fontSize: 10, color: C.lightText },
  formula:  { fontFace: 'Consolas', fontSize: 11, color: C.accent2 },
  code:     { fontFace: 'Consolas', fontSize: 10, color: C.accent2 },
  metric:   { fontFace: 'Segoe UI', fontSize: 14, bold: true, color: C.coral },
};

const IMG_DIR = path.join(__dirname, 'images');
const FORMULA_DIR = path.join(__dirname, 'formulas');

// ── Slide Background with decorative stripe ────────────────
// LAYOUT_WIDE = 13.33" × 7.5"
const SLIDE_W = 13.33;
const SLIDE_H = 7.5;

function addBg(slide, opts = {}) {
  slide.background = { color: opts.bgColor || C.cream };

  // Top accent bar
  slide.addShape('rect', {
    x: 0, y: 0, w: '100%', h: 0.1,
    fill: { color: opts.accentColor || C.teal },
  });

  // Bottom accent bar
  slide.addShape('rect', {
    x: 0, y: SLIDE_H - 0.1, w: '100%', h: 0.1,
    fill: { color: opts.accentColor || C.teal },
  });

  // Subtle side accent strip (left)
  slide.addShape('rect', {
    x: 0, y: 0.1, w: 0.06, h: SLIDE_H - 0.2,
    fill: { color: opts.accentColor || C.teal },
  });

  // Slide number
  if (opts.slideNum) {
    slide.addText(String(opts.slideNum), {
      x: SLIDE_W - 0.8, y: SLIDE_H - 0.5, w: 0.6, h: 0.3,
      fontSize: 9, color: C.lightText, fontFace: 'Segoe UI', align: 'right',
    });
  }

  // Section label (top-right)
  if (opts.section) {
    slide.addText(opts.section, {
      x: SLIDE_W - 4.0, y: 0.18, w: 3.5, h: 0.25,
      fontSize: 9, color: C.lightText, fontFace: 'Segoe UI', align: 'right', italic: true,
    });
  }
}

// ── Title + optional subtitle ──────────────────────────────
function addTitle(slide, title, subtitle) {
  slide.addText(title, {
    x: 0.5, y: 0.3, w: SLIDE_W - 5.0, h: 0.6,
    ...FONT.title,
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.5, y: 0.85, w: SLIDE_W - 5.0, h: 0.35,
      ...FONT.subtitle,
    });
  }
}

// ── Bullet list on left side ───────────────────────────────
function addBullets(slide, items, opts = {}) {
  const x = opts.x || 0.5;
  const y = opts.y || 1.2;
  const w = opts.w || 6.5;
  const h = opts.h || 5.8;

  const textItems = items.map(item => {
    if (typeof item === 'string') {
      return { text: item, options: { bullet: { code: '25CF' }, indentLevel: 0, ...FONT.bullet, fontSize: 13, lineSpacingMultiple: 1.5 } };
    }
    return { text: item.text, options: { bullet: { code: '25CB' }, indentLevel: item.indent || 1, ...FONT.bullet, fontSize: 12, lineSpacingMultiple: 1.5 } };
  });

  slide.addText(textItems, { x, y, w, h, valign: 'middle' });
}

// ── Image on right side ────────────────────────────────────
function addImageRight(slide, imgName, opts = {}) {
  const imgPath = path.join(IMG_DIR, imgName);
  slide.addImage({
    path: imgPath,
    x: opts.x || 7.8,
    y: opts.y || 1.0,
    w: opts.w || 5.0,
    h: opts.h || 5.0,
    rounding: true,
  });
}

// ── Formula image ──────────────────────────────────────────
function addFormulaImage(slide, formulaName, opts = {}) {
  const fPath = path.join(FORMULA_DIR, formulaName);
  slide.addImage({
    path: fPath,
    x: opts.x || 0.8,
    y: opts.y || 4.2,
    w: opts.w || 4.5,
    h: opts.h || 0.6,
  });
}

// ── Highlight box (for formulas / key points) ──────────────
function addHighlightBox(slide, text, opts = {}) {
  const bx = opts.x || 0.5;
  const by = opts.y || 6.3;
  const bw = opts.w || (SLIDE_W - 1.0);
  const bh = opts.h || 0.7;
  slide.addShape('roundRect', {
    x: bx, y: by, w: bw, h: bh,
    fill: { color: 'F0F7F7' },
    line: { color: C.teal, width: 1.5 },
    rectRadius: 0.1,
  });
  slide.addText(text, {
    x: bx + 0.2, y: by + 0.05,
    w: bw - 0.4, h: bh - 0.1,
    ...FONT.formula, fontSize: 12,
    valign: 'middle',
  });
}

// ── Result badge ───────────────────────────────────────────
function addResultBadge(slide, label, value, opts = {}) {
  const x = opts.x || 8.5;
  const y = opts.y || 6.2;
  const w = opts.w || 4.3;
  slide.addShape('roundRect', {
    x, y, w, h: 0.8,
    fill: { color: C.coral },
    rectRadius: 0.1,
  });
  slide.addText(`${label}: ${value}`, {
    x: x + 0.1, y: y + 0.05, w: w - 0.2, h: 0.7,
    fontSize: 16, bold: true, color: C.white, fontFace: 'Segoe UI', align: 'center', valign: 'middle',
  });
}

// ── Table helper ───────────────────────────────────────────
function addTable(slide, headers, rows, opts = {}) {
  const tableRows = [];
  // Header row
  tableRows.push(headers.map(h => ({
    text: h, options: { bold: true, fontSize: 10, color: C.white, fill: { color: C.teal }, fontFace: 'Segoe UI', align: 'center', valign: 'middle' }
  })));
  // Data rows
  rows.forEach((row, i) => {
    tableRows.push(row.map(cell => ({
      text: String(cell), options: { fontSize: 10, color: C.darkText, fill: { color: i % 2 === 0 ? C.white : C.lightGray }, fontFace: 'Segoe UI', align: 'center', valign: 'middle' }
    })));
  });

  slide.addTable(tableRows, {
    x: opts.x || 0.6, y: opts.y || 1.5,
    w: opts.w || 8.8,
    border: { type: 'solid', pt: 0.5, color: 'CCCCCC' },
    rowH: opts.rowH || 0.4,
    colW: opts.colW,
  });
}

module.exports = { C, FONT, IMG_DIR, FORMULA_DIR, SLIDE_W, SLIDE_H, addBg, addTitle, addBullets, addImageRight, addFormulaImage, addHighlightBox, addResultBadge, addTable };
