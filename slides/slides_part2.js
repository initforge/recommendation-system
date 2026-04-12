/**
 * slides_part2.js — Slides 12–22 (SVD, CB, Hybrid, Metrics, Context, Architecture, Demo)
 * Layout: WIDE 13.33" × 7.5"
 */
const { C, FONT, SLIDE_W, SLIDE_H, addBg, addTitle, addBullets, addImageRight, addHighlightBox, addResultBadge, addTable } = require('./helpers');
const path = require('path');
const FDIR = path.join(__dirname, 'formulas');

function buildPart2(pptx) {

  // ══════ SLIDE 12: SVD ══════
  const s12 = pptx.addSlide();
  addBg(s12, { slideNum: 12, section: 'Algorithms', accentColor: C.purple });
  addTitle(s12, 'Algorithm 3 — SVD (Matrix Factorization)');
  addImageRight(s12, 'img_08_svd.png', { x: 8.0, y: 0.8, w: 4.8, h: 4.5 });
  addBullets(s12, [
    'Problem: Rating matrix is 95.5% empty (sparse)',
    'Idea: Decompose R into P × Qᵀ (latent factors)',
    'Each user & movie → vector of k hidden features',
    'Model learns features automatically from data',
    'Trained via Stochastic Gradient Descent (SGD)',
  ], { w: 7.0, h: 3.0 });
  // Formulas in mid-section
  s12.addText('Decomposition:', { x: 0.5, y: 4.5, w: 3.5, h: 0.3, ...FONT.small, bold: true, fontSize: 11 });
  s12.addImage({ path: path.join(FDIR, 'svd_decomp.png'), x: 0.5, y: 4.8, w: 4.5, h: 0.7 });
  s12.addText('Prediction:', { x: 6.0, y: 4.5, w: 3.5, h: 0.3, ...FONT.small, bold: true, fontSize: 11 });
  s12.addImage({ path: path.join(FDIR, 'svd_pred.png'), x: 6.0, y: 4.8, w: 4.5, h: 0.65 });
  // Config badge
  s12.addShape('roundRect', { x: 0.5, y: 5.8, w: 5.0, h: 0.8, fill: { color: C.lightGray }, rectRadius: 0.1 });
  s12.addText('n_factors=50 · n_epochs=20 · μ=3.58 · b_u, b_i = bias terms', {
    x: 0.7, y: 5.85, w: 4.6, h: 0.7, fontSize: 11, color: C.darkText, fontFace: 'Consolas', valign: 'middle',
  });
  addResultBadge(s12, 'Best RMSE', '0.8706', { x: 7.0 });

  // ══════ SLIDE 13: CONTENT-BASED ══════
  const s13 = pptx.addSlide();
  addBg(s13, { slideNum: 13, section: 'Algorithms', accentColor: C.purple });
  addTitle(s13, 'Algorithm 4 — Content-Based Filtering');
  addImageRight(s13, 'img_09_contentbased.png', { x: 8.0, y: 0.8, w: 4.8, h: 4.5 });
  addBullets(s13, [
    'Idea: "If you liked Action movies, try more Action"',
    'Based on movie CONTENT (genres), not on other users',
    'Step 1: Convert genres → TF-IDF vectors',
    'Step 2: Compute Cosine Similarity (movie × movie)',
    'Step 3: Recommend movies similar to user\'s top-rated',
    'Solves Cold-Start — works even for new users!',
  ], { w: 7.0, h: 3.2 });
  // Formula
  s13.addText('TF-IDF Formula:', { x: 0.5, y: 4.5, w: 4.0, h: 0.3, ...FONT.small, bold: true, fontSize: 11 });
  s13.addImage({ path: path.join(FDIR, 'tfidf.png'), x: 0.5, y: 4.85, w: 5.5, h: 0.85 });
  // Pros/Cons
  s13.addShape('roundRect', { x: 7.0, y: 4.5, w: 5.8, h: 1.6, fill: { color: C.lightGray }, rectRadius: 0.1 });
  s13.addText('✅ No need for other users\' data\n✅ Solves cold-start problem\n✅ Explainable recommendations\n❌ Limited diversity (filter bubble)\n❌ Depends on metadata quality', {
    x: 7.2, y: 4.55, w: 5.4, h: 1.5, fontSize: 11, color: C.darkText, fontFace: 'Segoe UI', lineSpacingMultiple: 1.3,
  });
  addResultBadge(s13, 'Precision@10', '0.1163', { x: 0.5, w: 5.5 });

  // ══════ SLIDE 14: HYBRID ══════
  const s14 = pptx.addSlide();
  addBg(s14, { slideNum: 14, section: 'Algorithms', accentColor: C.purple });
  addTitle(s14, 'Algorithm 5 — Hybrid (SVD + Content-Based)');
  addImageRight(s14, 'img_10_hybrid.png', { x: 8.5, y: 0.8, w: 4.3, h: 4.3 });
  addBullets(s14, [
    'SVD: Accurate predictions, but has cold-start problem',
    'Content-Based: Handles cold-start, but limited diversity',
    'Hybrid = Best of both worlds!',
    'Weighted combination: α=0.6 (60% SVD + 40% CB)',
  ], { w: 7.5, h: 2.5 });
  // Formula
  s14.addText('Hybrid Score:', { x: 0.5, y: 4.0, w: 3.5, h: 0.3, ...FONT.small, bold: true, fontSize: 12 });
  s14.addImage({ path: path.join(FDIR, 'hybrid.png'), x: 0.5, y: 4.35, w: 6.5, h: 0.8 });
  // Strategies table
  addTable(s14,
    ['Strategy', 'How it Works', 'When to Use'],
    [
      ['Weighted', 'α×SVD + (1-α)×CB', 'Simple, default approach'],
      ['Switching', 'CF if enough data, else CB', 'Handle cold-start gracefully'],
      ['Cascade', 'SVD→100, CB→30, Rank→10', 'Multi-layer filtering'],
    ],
    { x: 0.5, y: 5.4, w: 12.3, colW: [2.0, 4.5, 5.8], rowH: 0.42 }
  );

  // ══════ SLIDE 15: WHY EVALUATE ══════
  const s15 = pptx.addSlide();
  addBg(s15, { slideNum: 15, section: 'Evaluation', accentColor: C.golden });
  addTitle(s15, 'Why Do We Need Evaluation Metrics?');
  addBullets(s15, [
    'Without metrics — "which algorithm is better?" is subjective',
    'Need concrete numbers to compare algorithms objectively',
    'Two types of evaluation:',
    { text: 'Prediction Metrics: How accurate is the rating prediction?', indent: 1 },
    { text: 'Ranking Metrics: How good is the recommendation list?', indent: 1 },
    'Train/Test Split: 80% train, 20% test (random or temporal)',
  ], { w: 7.0 });
  // Two comparison panels
  s15.addShape('roundRect', { x: 8.0, y: 1.0, w: 4.8, h: 2.6, fill: { color: 'E8F6F3' }, line: { color: C.teal, width: 1.5 }, rectRadius: 0.12 });
  s15.addText('PREDICTION METRICS', { x: 8.2, y: 1.1, w: 4.4, h: 0.4, fontSize: 14, bold: true, color: C.teal, fontFace: 'Segoe UI' });
  s15.addText('→ RMSE, MAE\n→ "How far off is the predicted rating?"\n→ Lower = Better', {
    x: 8.2, y: 1.55, w: 4.4, h: 1.8, fontSize: 12, color: C.darkText, fontFace: 'Segoe UI', lineSpacingMultiple: 1.4,
  });
  s15.addShape('roundRect', { x: 8.0, y: 3.9, w: 4.8, h: 2.6, fill: { color: 'FDF2E9' }, line: { color: C.coral, width: 1.5 }, rectRadius: 0.12 });
  s15.addText('RANKING METRICS', { x: 8.2, y: 4.0, w: 4.4, h: 0.4, fontSize: 14, bold: true, color: C.coral, fontFace: 'Segoe UI' });
  s15.addText('→ Precision@K, Recall@K, MAP, NDCG\n→ "How relevant is the top-K list?"\n→ Higher = Better', {
    x: 8.2, y: 4.45, w: 4.4, h: 1.8, fontSize: 12, color: C.darkText, fontFace: 'Segoe UI', lineSpacingMultiple: 1.4,
  });
  addHighlightBox(s15, 'Must evaluate on UNSEEN data (test set) — not training data!');

  // ══════ SLIDE 16: RMSE & MAE ══════
  const s16 = pptx.addSlide();
  addBg(s16, { slideNum: 16, section: 'Evaluation', accentColor: C.golden });
  addTitle(s16, 'Prediction Metrics — RMSE & MAE');
  // Left: RMSE
  s16.addShape('roundRect', { x: 0.5, y: 1.2, w: 6.0, h: 2.2, fill: { color: 'E8F6F3' }, rectRadius: 0.1 });
  s16.addText('RMSE — Root Mean Square Error:', { x: 0.7, y: 1.25, w: 5.6, h: 0.4, fontSize: 14, bold: true, color: C.teal, fontFace: 'Segoe UI' });
  s16.addImage({ path: path.join(FDIR, 'rmse.png'), x: 0.8, y: 1.75, w: 5.0, h: 0.9 });
  s16.addText('Penalizes large errors more → sensitive to outliers', { x: 0.8, y: 2.7, w: 5.0, h: 0.4, fontSize: 11, color: C.lightText, fontFace: 'Segoe UI' });
  // Left: MAE
  s16.addShape('roundRect', { x: 0.5, y: 3.6, w: 6.0, h: 2.0, fill: { color: 'FDF2E9' }, rectRadius: 0.1 });
  s16.addText('MAE — Mean Absolute Error:', { x: 0.7, y: 3.65, w: 5.6, h: 0.4, fontSize: 14, bold: true, color: C.coral, fontFace: 'Segoe UI' });
  s16.addImage({ path: path.join(FDIR, 'mae.png'), x: 0.8, y: 4.15, w: 4.5, h: 0.8 });
  s16.addText('Treats all errors equally → more robust', { x: 0.8, y: 5.0, w: 5.0, h: 0.35, fontSize: 11, color: C.lightText, fontFace: 'Segoe UI' });
  // Right: Worked example
  s16.addShape('roundRect', { x: 7.0, y: 1.2, w: 5.8, h: 3.5, fill: { color: C.lightGray }, rectRadius: 0.1 });
  s16.addText('Worked Example:', { x: 7.2, y: 1.3, w: 5.4, h: 0.4, fontSize: 13, bold: true, color: C.accent2, fontFace: 'Segoe UI' });
  s16.addText(
    'Predicted: [4.5, 3.0, 2.0, 5.0]\n' +
    'Actual:    [4.0, 3.5, 1.5, 4.5]\n' +
    'Errors:    [0.5,-0.5, 0.5, 0.5]\n\n' +
    'SSE = 0.25+0.25+0.25+0.25 = 1.0\n' +
    'MSE = 1.0 / 4 = 0.25\n' +
    'RMSE = √0.25 = 0.50 ★',
    { x: 7.2, y: 1.8, w: 5.4, h: 2.8, fontSize: 12, color: C.darkText, fontFace: 'Consolas', lineSpacingMultiple: 1.4 }
  );
  // Interpretation scale
  const interp = [
    { range: '< 0.8', label: 'Excellent', color: '27AE60' },
    { range: '0.8–1.0', label: 'Good', color: C.golden },
    { range: '1.0–1.5', label: 'Fair', color: 'E67E22' },
    { range: '> 1.5', label: 'Poor', color: C.coral },
  ];
  interp.forEach((item, i) => {
    const xPos = 7.0 + i * 1.45;
    s16.addShape('roundRect', { x: xPos, y: 5.0, w: 1.35, h: 1.0, fill: { color: item.color }, rectRadius: 0.08 });
    s16.addText(`${item.range}\n${item.label}`, {
      x: xPos, y: 5.0, w: 1.35, h: 1.0, fontSize: 11, bold: true, color: C.white, fontFace: 'Segoe UI', align: 'center', valign: 'middle',
    });
  });
  addHighlightBox(s16, 'Our best model (SVD): RMSE = 0.8706 → avg error of ~0.87 stars on a 1-5 scale');

  // ══════ SLIDE 17: RANKING METRICS ══════
  const s17 = pptx.addSlide();
  addBg(s17, { slideNum: 17, section: 'Evaluation', accentColor: C.golden });
  addTitle(s17, 'Ranking Metrics — Precision, Recall, MAP, NDCG');
  // 2x2 formula grid
  const fGrid = [
    { label: 'Precision@K', file: 'precision.png', x: 0.5, y: 1.2 },
    { label: 'Recall@K', file: 'recall.png', x: 6.9, y: 1.2 },
    { label: 'F1-Score', file: 'f1.png', x: 0.5, y: 2.8 },
    { label: 'NDCG@K', file: 'ndcg.png', x: 6.9, y: 2.8 },
  ];
  fGrid.forEach(f => {
    s17.addShape('roundRect', { x: f.x, y: f.y, w: 6.1, h: 1.4, fill: { color: C.lightGray }, rectRadius: 0.08 });
    s17.addText(f.label + ':', { x: f.x + 0.15, y: f.y + 0.08, w: 3.0, h: 0.3, fontSize: 11, bold: true, color: C.teal, fontFace: 'Segoe UI' });
    s17.addImage({ path: path.join(FDIR, f.file), x: f.x + 0.2, y: f.y + 0.4, w: 5.0, h: 0.85 });
  });
  // Results table
  addTable(s17,
    ['Algorithm', 'RMSE', 'MAE', 'P@10', 'MAP@10', 'NDCG@10'],
    [
      ['User-Based CF', '0.9293', '0.7383', '—', '—', '—'],
      ['Item-Based CF', '0.9293', '0.7383', '—', '—', '—'],
      ['SVD (k=50)', '0.8706', '0.6839', '—', '—', '—'],
      ['Content-Based', '—', '—', '0.1163', '0.0571', '0.1248'],
    ],
    { x: 0.5, y: 4.5, w: 12.3, colW: [2.6, 1.6, 1.6, 1.6, 2.0, 2.0], rowH: 0.4 }
  );
  addHighlightBox(s17, 'SVD wins on prediction accuracy · Content-Based provides ranking-based evaluation');

  // ══════ SLIDE 18: TEMPORAL ══════
  const s18 = pptx.addSlide();
  addBg(s18, { slideNum: 18, section: 'Context Features', accentColor: C.teal });
  addTitle(s18, 'Context Features — Temporal Analysis');
  addImageRight(s18, 'img_11_temporal.png');
  addBullets(s18, [
    'Extract from timestamp: year, month, day, hour',
    'Key Findings:',
    { text: 'Weekends → slightly higher ratings (+0.07)', indent: 1 },
    { text: 'Late night (9–11PM) → higher ratings', indent: 1 },
    { text: 'Slight decline in avg rating 2000→2003', indent: 1 },
    'Why it matters:',
    { text: 'Time-aware recommendations possible', indent: 1 },
    { text: 'User mood varies by time of day & week', indent: 1 },
  ], { w: 7.0 });
  addHighlightBox(s18, 'Notebook: 07_context_features.ipynb → temporal feature extraction & visualization');

  // ══════ SLIDE 19: DEMOGRAPHICS ══════
  const s19 = pptx.addSlide();
  addBg(s19, { slideNum: 19, section: 'Context Features', accentColor: C.teal });
  addTitle(s19, 'Context Features — Demographics Analysis');
  addBullets(s19, [
    'Gender: Female rates +0.06 higher than Male on average',
    'Age: Under 18 rates highest (~3.68), 25-34 lowest (~3.50)',
    'Genre preferences differ significantly:',
    { text: '♀ Female → Romance, Drama, Musical', indent: 1 },
    { text: '♂ Male → Action, War, Horror, Sci-Fi', indent: 1 },
  ], { w: 7.0, h: 3.0 });
  // Table
  addTable(s19,
    ['Group', 'Avg Rating', 'Top Genre', '# Users'],
    [
      ['Male', '3.56', 'Action', '~4,200'],
      ['Female', '3.62', 'Romance', '~1,840'],
      ['Under 18', '3.68', 'Animation', '~220'],
      ['25-34', '3.50', 'Drama', '~2,100'],
      ['56+', '3.55', 'War', '~230'],
    ],
    { x: 0.5, y: 4.5, w: 12.3, colW: [2.0, 2.5, 4.0, 3.8], rowH: 0.38 }
  );
  addHighlightBox(s19, 'Application: Cold-start fallback — recommend by demographics when no history exists');

  // ══════ SLIDE 20: PROJECT STRUCTURE ══════
  const s20 = pptx.addSlide();
  addBg(s20, { slideNum: 20, section: 'Architecture', accentColor: C.accent2 });
  addTitle(s20, 'Project Structure — Clean & Modular');
  const fileTree =
    'recommend-system/\n' +
    '├── docs/           ← 8 documentation files\n' +
    '├── notebooks/      ← 9 Colab notebooks\n' +
    '│   ├── 01_setup_eda.ipynb\n' +
    '│   ├── 02–06 (algorithms)\n' +
    '│   ├── 07_context · 08_evaluation\n' +
    '│   └── 00_full_pipeline.ipynb ← API\n' +
    '├── src/            ← 5 Python modules (~620 LOC)\n' +
    '│   ├── constants.py · data_loader.py\n' +
    '│   ├── models.py (5 algorithms)\n' +
    '│   ├── evaluation.py · context.py\n' +
    '├── frontend/       ← HTML/JS (Zen UI)\n' +
    '├── data/raw/ml-1m/ ← Dataset\n' +
    '└── results/        ← Charts + JSON reports';
  s20.addText(fileTree, {
    x: 0.5, y: 1.2, w: 7.0, h: 5.5,
    fontFace: 'Consolas', fontSize: 12, color: C.accent2, lineSpacingMultiple: 1.4,
  });
  // Dependency flow (right side)
  s20.addText('Module Dependency Flow:', { x: 8.0, y: 1.2, w: 4.8, h: 0.4, fontSize: 14, bold: true, color: C.darkText, fontFace: 'Segoe UI' });
  const deps = ['constants.py', 'data_loader.py', 'models.py', 'evaluation.py', 'context.py'];
  deps.forEach((d, i) => {
    const yPos = 2.0 + i * 1.0;
    s20.addShape('roundRect', { x: 8.5, y: yPos, w: 4.0, h: 0.55, fill: { color: C.teal }, rectRadius: 0.08 });
    s20.addText(d, { x: 8.5, y: yPos, w: 4.0, h: 0.55, fontSize: 12, color: C.white, fontFace: 'Consolas', align: 'center', valign: 'middle' });
    if (i < deps.length - 1) {
      s20.addText('↓', { x: 10.0, y: yPos + 0.55, w: 1.0, h: 0.4, fontSize: 16, color: C.lightText, fontFace: 'Segoe UI', align: 'center' });
    }
  });

  // ══════ SLIDE 21: SYSTEM ARCHITECTURE ══════
  const s21 = pptx.addSlide();
  addBg(s21, { slideNum: 21, section: 'Architecture', accentColor: C.accent2 });
  addTitle(s21, 'System Architecture — Colab + Cloudflare Pages');
  // Backend box
  s21.addShape('roundRect', { x: 0.5, y: 1.3, w: 5.2, h: 4.5, fill: { color: 'E8F6F3' }, line: { color: C.teal, width: 2.5 }, rectRadius: 0.15 });
  s21.addText('☁️ Google Colab (Backend)', { x: 0.5, y: 1.35, w: 5.2, h: 0.6, fontSize: 16, bold: true, color: C.teal, fontFace: 'Segoe UI', align: 'center' });
  s21.addText('• Load MovieLens 1M dataset\n• Train 5 recommendation models\n• FastAPI server (port 8000)\n• Serve predictions via REST API\n• Endpoint: /api/recommend', {
    x: 0.8, y: 2.1, w: 4.6, h: 3.2, fontSize: 12, color: C.darkText, fontFace: 'Segoe UI', lineSpacingMultiple: 1.5,
  });
  // Arrow (tunnel)
  s21.addShape('rect', { x: 5.8, y: 3.2, w: 1.7, h: 0.08, fill: { color: C.coral } });
  s21.addShape('rect', { x: 5.8, y: 3.5, w: 1.7, h: 0.08, fill: { color: C.coral } });
  s21.addText('ngrok tunnel', { x: 5.6, y: 3.7, w: 2.1, h: 0.5, fontSize: 11, color: C.coral, fontFace: 'Segoe UI', align: 'center', bold: true });
  // Frontend box
  s21.addShape('roundRect', { x: 7.6, y: 1.3, w: 5.2, h: 4.5, fill: { color: 'FDF2E9' }, line: { color: C.coral, width: 2.5 }, rectRadius: 0.15 });
  s21.addText('🌐 Cloudflare Pages (Frontend)', { x: 7.6, y: 1.35, w: 5.2, h: 0.6, fontSize: 16, bold: true, color: C.coral, fontFace: 'Segoe UI', align: 'center' });
  s21.addText('• Static HTML/CSS/JS (Zen UI)\n• JS fetch() → API calls to backend\n• Display movie recommendations\n• Algorithm selector dropdown\n• Prediction scores shown', {
    x: 7.9, y: 2.1, w: 4.6, h: 3.2, fontSize: 12, color: C.darkText, fontFace: 'Segoe UI', lineSpacingMultiple: 1.5,
  });
  addHighlightBox(s21, '1. Open web → 2. Paste ngrok URL → 3. Select user & algorithm → 4. Get predictions with scores');

  // ══════ SLIDE 22: DEMO & CONCLUSION ══════
  const s22 = pptx.addSlide();
  s22.background = { color: C.accent2 };
  s22.addShape('rect', { x: 0, y: 0, w: '100%', h: 0.14, fill: { color: C.golden } });
  s22.addShape('rect', { x: 0, y: SLIDE_H - 0.14, w: '100%', h: 0.14, fill: { color: C.golden } });
  s22.addImage({ path: path.join(__dirname, 'images/img_12_rocket.png'), x: 8.0, y: 0.8, w: 4.8, h: 4.8 });
  s22.addText('Live Demo\n& Future Work', {
    x: 0.8, y: 1.0, w: 7.0, h: 1.8,
    fontSize: 38, fontFace: 'Segoe UI', bold: true, color: C.white, lineSpacingMultiple: 1.1,
  });
  s22.addText('Try it now:', { x: 0.8, y: 3.0, w: 4.0, h: 0.5, fontSize: 16, bold: true, color: C.golden, fontFace: 'Segoe UI' });
  s22.addText(
    '1. Open Colab notebook → Run All\n' +
    '2. Copy ngrok URL\n' +
    '3. Visit the web frontend\n' +
    '4. Paste URL → Select algorithm → See results!',
    { x: 0.8, y: 3.5, w: 6.5, h: 1.8, fontSize: 13, color: C.white, fontFace: 'Segoe UI', lineSpacingMultiple: 1.5 }
  );
  s22.addText('Future Improvements:', { x: 0.8, y: 5.5, w: 6.0, h: 0.4, fontSize: 14, bold: true, color: C.golden, fontFace: 'Segoe UI' });
  s22.addText(
    '• Neural CF (deep learning)  • Implicit feedback (ALS)\n' +
    '• Docker deployment           • Richer metadata',
    { x: 0.8, y: 5.9, w: 7.0, h: 0.8, fontSize: 12, color: C.white, fontFace: 'Segoe UI', lineSpacingMultiple: 1.3 }
  );
  // Thank you badge
  s22.addShape('roundRect', { x: 8.0, y: 5.5, w: 4.8, h: 1.5, fill: { color: C.coral }, rectRadius: 0.15 });
  s22.addText('Thank You! 🎬🍿', {
    x: 8.0, y: 5.5, w: 4.8, h: 0.9, fontSize: 28, bold: true, color: C.white, fontFace: 'Segoe UI', align: 'center', valign: 'middle',
  });
  s22.addText('Questions?', {
    x: 8.0, y: 6.3, w: 4.8, h: 0.5, fontSize: 16, color: C.white, fontFace: 'Segoe UI', align: 'center', italic: true,
  });

  return pptx;
}

module.exports = { buildPart2 };
