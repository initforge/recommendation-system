/**
 * slides_part1.js — Slides 1–11 (Intro, Dataset, EDA, Algorithms Part 1)
 * Layout: WIDE 13.33" × 7.5"
 */
const { C, FONT, SLIDE_W, SLIDE_H, addBg, addTitle, addBullets, addImageRight, addHighlightBox, addResultBadge, addTable } = require('./helpers');
const path = require('path');
const FDIR = path.join(__dirname, 'formulas');

function buildPart1(pptx) {
  // ══════ SLIDE 1: COVER ══════
  const s1 = pptx.addSlide();
  s1.background = { color: C.accent2 };
  s1.addShape('rect', { x: 0, y: 0, w: '100%', h: 0.14, fill: { color: C.coral } });
  s1.addShape('rect', { x: 0, y: SLIDE_H - 0.14, w: '100%', h: 0.14, fill: { color: C.coral } });
  s1.addImage({ path: path.join(__dirname, 'images/img_01_cover.png'), x: 7.5, y: 0.8, w: 5.3, h: 5.3 });
  s1.addText('Movie Recommender\nSystem', {
    x: 0.8, y: 1.5, w: 6.5, h: 2.2,
    fontSize: 42, fontFace: 'Segoe UI', bold: true, color: C.white, lineSpacingMultiple: 1.1,
  });
  s1.addText('Collaborative Filtering · SVD · Content-Based · Hybrid', {
    x: 0.8, y: 3.8, w: 6.5, h: 0.5,
    fontSize: 16, fontFace: 'Segoe UI', color: C.golden,
  });
  s1.addText('MovieLens 1M  ·  5 Algorithms  ·  Web Demo', {
    x: 0.8, y: 4.5, w: 6.5, h: 0.4,
    fontSize: 13, fontFace: 'Segoe UI', color: C.lightText, italic: true,
  });
  // Decorative dots
  [0.8, 1.4, 2.0].forEach((x, i) => {
    s1.addShape('ellipse', { x, y: 5.5, w: 0.35, h: 0.35, fill: { color: [C.coral, C.golden, C.teal][i] } });
  });

  // ══════ SLIDE 2: WHAT IS RECSYS ══════
  const s2 = pptx.addSlide();
  addBg(s2, { slideNum: 2, section: 'Introduction' });
  addTitle(s2, 'What is a Recommender System?');
  addBullets(s2, [
    'An information filtering system that predicts user preferences',
    'Solves the "information overload" problem',
    { text: 'YouTube: 800M+ videos — how to find the right one?', indent: 1 },
    { text: 'Spotify: 100M+ songs — what should you listen next?', indent: 1 },
    'Goal: Predict which items a user will like',
    'Used by Netflix, Amazon, TikTok, Shopee — everywhere',
  ], { w: 6.5 });
  addImageRight(s2, 'img_02_recsys.png');
  addHighlightBox(s2, 'Core: Analyze past behavior → Find patterns → Predict → Recommend');

  // ══════ SLIDE 3: WHY MOVIES ══════
  const s3 = pptx.addSlide();
  addBg(s3, { slideNum: 3, section: 'Introduction' });
  addTitle(s3, 'Why Movies? Why MovieLens?');
  addImageRight(s3, 'img_03_movies.png', { x: 8.0, y: 0.8, w: 4.8, h: 4.8 });
  addBullets(s3, [
    'MovieLens: Gold standard for RecSys research',
    '3 versions: 100K / 1M / 25M ratings',
    'We chose MovieLens 1M — large enough, fast enough',
  ], { w: 7.0, h: 2.5 });
  addTable(s3,
    ['Criteria', 'Movies', 'Books', 'Products', 'Music'],
    [
      ['Free dataset', '✅ MovieLens', '⏳', '❌', '⏳'],
      ['Clear features', '✅ Genres', '✅', '❌', '✅'],
      ['Easy to demo', '✅ Universal', '⏳', '⏳', '✅'],
      ['Research papers', '✅ Most popular', '⏳', '❌', '⏳'],
    ],
    { x: 0.5, y: 4.0, w: 7.0, colW: [1.5, 1.5, 1.0, 1.2, 0.8], rowH: 0.38 }
  );

  // ══════ SLIDE 4: DATASET OVERVIEW ══════
  const s4 = pptx.addSlide();
  addBg(s4, { slideNum: 4, section: 'Dataset', accentColor: C.coral });
  addTitle(s4, 'MovieLens 1M — Dataset Overview');
  addImageRight(s4, 'img_04_dataset.png', { x: 8.0, y: 0.8, w: 4.8, h: 4.5 });
  addBullets(s4, [
    '1,000,209 ratings from 6,040 users on 3,706 movies',
    'Rating scale: 1–5 stars (avg 3.58)',
    'Sparsity: 95.5% — most user-movie pairs unknown',
    'Collected 2000–2003 by GroupLens Research',
    'Three data files: ratings.dat · movies.dat · users.dat',
  ], { w: 7.0, h: 3.2 });
  // Stats badges
  const stats = [['6,040', 'Users'], ['3,706', 'Movies'], ['1,000,209', 'Ratings'], ['95.5%', 'Sparsity']];
  stats.forEach((s, i) => {
    const xPos = 0.5 + i * 3.1;
    s4.addShape('roundRect', { x: xPos, y: 5.3, w: 2.8, h: 1.3, fill: { color: i === 3 ? C.coral : C.teal }, rectRadius: 0.12 });
    s4.addText(s[0], { x: xPos, y: 5.35, w: 2.8, h: 0.7, fontSize: 24, bold: true, color: C.white, fontFace: 'Segoe UI', align: 'center' });
    s4.addText(s[1], { x: xPos, y: 6.05, w: 2.8, h: 0.45, fontSize: 13, color: C.white, fontFace: 'Segoe UI', align: 'center' });
  });

  // ══════ SLIDE 5: DATASET DETAILS ══════
  const s5 = pptx.addSlide();
  addBg(s5, { slideNum: 5, section: 'Dataset', accentColor: C.coral });
  addTitle(s5, "Dataset Details — What's Inside Each File?");
  addTable(s5,
    ['File', 'Columns', 'Rows', 'Used For'],
    [
      ['ratings.dat', 'userId, movieId, rating, timestamp', '1,000,209', 'CF, SVD, Evaluation'],
      ['movies.dat', 'movieId, title, genres (18 types)', '3,883', 'Content-Based, Hybrid'],
      ['users.dat', 'userId, gender, age, occupation, zip', '6,040', 'Context Analysis'],
    ],
    { x: 0.5, y: 1.2, w: 12.3, colW: [1.8, 4.0, 1.5, 5.0], rowH: 0.6 }
  );
  addBullets(s5, [
    'Rating 4★ is most common (~34%) — positive bias',
    '18 genres: Action, Drama, Comedy, Sci-Fi, Romance, ...',
    '7 age groups: Under 18, 18-24, 25-34, 35-44, 45-49, 50-55, 56+',
    '21 occupations: student, programmer, engineer, doctor, ...',
    'Timestamp → extractable temporal features (year, hour, weekday)',
  ], { y: 4.0, w: 12.0, h: 3.0 });

  // ══════ SLIDE 6: DATA FLOW ══════
  const s6 = pptx.addSlide();
  addBg(s6, { slideNum: 6, section: 'Dataset', accentColor: C.coral });
  addTitle(s6, 'Data Flow — Which File Feeds Which Algorithm?');
  s6.addImage({ path: path.join(__dirname, 'images/img_05_dataflow.png'), x: 1.5, y: 1.2, w: 10.3, h: 4.5 });
  const legend = [
    { label: 'ratings.dat → CF, SVD, Evaluation', color: C.teal },
    { label: 'movies.dat → Content-Based, Hybrid', color: C.coral },
    { label: 'users.dat → Context Features', color: C.purple },
  ];
  legend.forEach((l, i) => {
    const xPos = 0.5 + i * 4.2;
    s6.addShape('roundRect', { x: xPos, y: 6.0, w: 3.9, h: 0.65, fill: { color: l.color }, rectRadius: 0.1 });
    s6.addText(l.label, { x: xPos + 0.15, y: 6.0, w: 3.6, h: 0.65, fontSize: 11, color: C.white, fontFace: 'Segoe UI', align: 'center', valign: 'middle' });
  });

  // ══════ SLIDE 7: SETUP & EDA ══════
  const s7 = pptx.addSlide();
  addBg(s7, { slideNum: 7, section: 'EDA', accentColor: C.golden });
  addTitle(s7, 'Setup & Exploratory Data Analysis');
  addImageRight(s7, 'img_06_eda.png');
  addBullets(s7, [
    'Environment: Google Colab (free GPU/CPU)',
    'Libraries: pandas, numpy, matplotlib, scikit-surprise',
    'Load data: pd.read_csv(sep="::", engine="python")',
    'Basic stats:',
    { text: 'Avg rating: 3.58 ★', indent: 1 },
    { text: 'Ratings per user: min 20, median ~96', indent: 1 },
    { text: 'Most rated: "American Beauty" (3,428 ratings)', indent: 1 },
  ], { w: 7.0 });
  addHighlightBox(s7, 'Notebook: 01_setup_eda.ipynb → Load, clean, visualize, export stats');

  // ══════ SLIDE 8: EDA FINDINGS ══════
  const s8 = pptx.addSlide();
  addBg(s8, { slideNum: 8, section: 'EDA', accentColor: C.golden });
  addTitle(s8, 'EDA — Key Findings');
  addBullets(s8, [
    'Rating Distribution: 4★ most frequent (34%), 1★ rarest (6%)',
    '→ Users tend to rate positively (positive bias)',
    'Power-law in movie popularity — a few movies get most ratings',
    'Genre distribution: Drama > Comedy > Action dominate',
    'Each movie has 1.6 genres on avg (multi-label)',
    'Temporal span: 2000–2003 (3 years of data)',
  ], { w: 7.0 });
  // Right-side stat boxes
  const charts = [
    { title: 'Rating Distribution', desc: '4★ = 34%  |  3★ = 27%\n5★ = 21%  |  2★ = 11%\n1★ =  6%  (positive bias)' },
    { title: 'Top Genres', desc: 'Drama:  1,500+ movies\nComedy: 1,200+ movies\nAction:   900+ movies' },
    { title: 'User Activity', desc: 'Mean: 166 ratings/user\nMin: 20  |  Max: 2,314\nMedian: ~96 ratings' },
  ];
  charts.forEach((c, i) => {
    const xPos = 8.0;
    const yPos = 1.0 + i * 2.0;
    s8.addShape('roundRect', { x: xPos, y: yPos, w: 4.8, h: 1.8, fill: { color: C.lightGray }, line: { color: C.teal, width: 1 }, rectRadius: 0.1 });
    s8.addText(c.title, { x: xPos + 0.2, y: yPos + 0.1, w: 4.4, h: 0.35, fontSize: 12, bold: true, color: C.teal, fontFace: 'Segoe UI' });
    s8.addText(c.desc, { x: xPos + 0.2, y: yPos + 0.5, w: 4.4, h: 1.2, fontSize: 11, color: C.darkText, fontFace: 'Consolas', lineSpacingMultiple: 1.3 });
  });

  // ══════ SLIDE 9: ALGORITHM TAXONOMY ══════
  const s9 = pptx.addSlide();
  addBg(s9, { slideNum: 9, section: 'Algorithms', accentColor: C.purple });
  addTitle(s9, 'Algorithm Taxonomy — 5 Approaches');
  s9.addImage({ path: path.join(__dirname, 'images/img_07_taxonomy.png'), x: 7.8, y: 0.8, w: 5.2, h: 5.2 });
  const tree = [
    '┌─ Collaborative Filtering (CF)',
    '│  ├─ 1. User-Based CF     (find similar users)',
    '│  ├─ 2. Item-Based CF     (find similar items)',
    '│  └─ 3. SVD               (latent factors)',
    '│',
    '├─ 4. Content-Based        (TF-IDF on genres)',
    '│',
    '└─ 5. Hybrid               (SVD + Content-Based)',
  ].join('\n');
  s9.addText(tree, {
    x: 0.5, y: 1.5, w: 7.0, h: 4.0,
    fontFace: 'Consolas', fontSize: 13, color: C.accent2, lineSpacingMultiple: 1.6,
  });
  addHighlightBox(s9, 'Learning order: User-CF → Item-CF → SVD → Content-Based → Hybrid');

  // ══════ SLIDE 10: USER-BASED CF ══════
  const s10 = pptx.addSlide();
  addBg(s10, { slideNum: 10, section: 'Algorithms', accentColor: C.purple });
  addTitle(s10, 'Algorithm 1 — User-Based Collaborative Filtering');
  addBullets(s10, [
    'Idea: "Users with similar tastes like similar movies"',
    'Step 1: Represent each user as a rating vector',
    'Step 2: Compute Cosine Similarity between user pairs',
    'Step 3: Find K=20 nearest neighbors (KNN)',
    'Step 4: Predict rating via weighted average',
  ], { w: 7.0, h: 3.0 });
  // Formulas (centered in the middle area)
  s10.addText('Cosine Similarity:', { x: 0.5, y: 4.5, w: 4.0, h: 0.3, ...FONT.small, bold: true, fontSize: 11 });
  s10.addImage({ path: path.join(FDIR, 'cosine_sim.png'), x: 0.5, y: 4.85, w: 5.0, h: 0.85 });
  s10.addText('Prediction Formula:', { x: 6.5, y: 4.5, w: 4.0, h: 0.3, ...FONT.small, bold: true, fontSize: 11 });
  s10.addImage({ path: path.join(FDIR, 'user_cf_pred.png'), x: 6.5, y: 4.85, w: 6.0, h: 0.95 });
  // Pros/Cons box
  s10.addShape('roundRect', { x: 8.0, y: 1.0, w: 4.8, h: 2.5, fill: { color: C.lightGray }, rectRadius: 0.1 });
  s10.addText('✅ No content knowledge needed\n✅ Pure behavior-based\n\n❌ Slow for large user sets\n❌ Cold-start problem', {
    x: 8.2, y: 1.1, w: 4.4, h: 2.3, fontSize: 12, color: C.darkText, fontFace: 'Segoe UI', lineSpacingMultiple: 1.4,
  });
  addResultBadge(s10, 'RMSE', '0.9293');

  // ══════ SLIDE 11: ITEM-BASED CF ══════
  const s11 = pptx.addSlide();
  addBg(s11, { slideNum: 11, section: 'Algorithms', accentColor: C.purple });
  addTitle(s11, 'Algorithm 2 — Item-Based Collaborative Filtering');
  addBullets(s11, [
    'Idea: "Movies rated similarly by many users are similar"',
    'Compare items instead of users — more stable',
    'Netflix and Amazon use Item-Based CF in production',
    'Same KNN approach, but sim(item_i, item_j)',
  ], { w: 7.0, h: 2.5 });
  // Formula
  s11.addText('Prediction Formula:', { x: 0.5, y: 3.9, w: 4.0, h: 0.3, ...FONT.small, bold: true, fontSize: 11 });
  s11.addImage({ path: path.join(FDIR, 'item_cf.png'), x: 0.5, y: 4.25, w: 5.5, h: 0.9 });
  // Comparison table
  addTable(s11,
    ['Aspect', 'User-Based CF', 'Item-Based CF'],
    [
      ['Compares', 'Users', 'Items'],
      ['Stability', 'Low (users change)', 'High (items stable)'],
      ['Speed', 'Slower', 'Faster'],
      ['RMSE', '0.9293', '0.9293'],
    ],
    { x: 7.0, y: 1.2, w: 5.8, colW: [1.5, 2.15, 2.15], rowH: 0.45 }
  );
  addResultBadge(s11, 'RMSE', '0.9293');

  return pptx;
}

module.exports = { buildPart1 };
