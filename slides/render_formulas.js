/**
 * render_formulas.js — Render LaTeX formulas to PNG using MathJax + Sharp
 */
const { mathjax } = require('mathjax-full/js/mathjax.js');
const { TeX } = require('mathjax-full/js/input/tex.js');
const { SVG } = require('mathjax-full/js/output/svg.js');
const { liteAdaptor } = require('mathjax-full/js/adaptors/liteAdaptor.js');
const { RegisterHTMLHandler } = require('mathjax-full/js/handlers/html.js');
const { AllPackages } = require('mathjax-full/js/input/tex/AllPackages.js');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const FORMULA_DIR = path.join(__dirname, 'formulas');

const FORMULAS = {
  cosine_sim: String.raw`\text{sim}(u,v) = \frac{\sum_{i} r_{u,i} \cdot r_{v,i}}{\|r_u\| \cdot \|r_v\|}`,
  user_cf_pred: String.raw`\hat{r}_{u,i} = \bar{r}_u + \frac{\sum_{v} \text{sim}(u,v)(r_{v,i} - \bar{r}_v)}{\sum_{v} |\text{sim}(u,v)|}`,
  item_cf: String.raw`\hat{r}_{u,i} = \frac{\sum_{j} \text{sim}(i,j) \cdot r_{u,j}}{\sum_{j} |\text{sim}(i,j)|}`,
  svd_pred: String.raw`\hat{r}_{u,i} = \mu + b_u + b_i + \mathbf{p}_u \cdot \mathbf{q}_i`,
  svd_decomp: String.raw`R_{m \times n} \approx P_{m \times k} \cdot Q_{k \times n}^T`,
  tfidf: String.raw`\text{TF-IDF}(t,d) = \text{TF}(t,d) \times \log\frac{N}{\text{DF}(t)}`,
  rmse: String.raw`\text{RMSE} = \sqrt{\frac{1}{N}\sum_{i=1}^{N}(\hat{y}_i - y_i)^2}`,
  mae: String.raw`\text{MAE} = \frac{1}{N}\sum_{i=1}^{N}|\hat{y}_i - y_i|`,
  precision: String.raw`\text{Precision@K} = \frac{|\text{relevant} \cap \text{top-K}|}{K}`,
  recall: String.raw`\text{Recall@K} = \frac{|\text{relevant} \cap \text{top-K}|}{|\text{relevant}|}`,
  f1: String.raw`F_1 = \frac{2 \cdot P \cdot R}{P + R}`,
  hybrid: String.raw`\text{Score}(u,i) = \alpha \cdot \text{SVD}(u,i) + (1-\alpha) \cdot \text{CB}(u,i)`,
  ndcg: String.raw`\text{NDCG@K} = \frac{DCG}{IDCG},\; DCG = \sum_{i=1}^{K}\frac{rel_i}{\log_2(i+1)}`,
};

async function renderFormula(latex, outputName) {
  const adaptor = liteAdaptor();
  RegisterHTMLHandler(adaptor);

  const tex = new TeX({ packages: AllPackages });
  const svg = new SVG({ fontCache: 'none' });
  const doc = mathjax.document('', { InputJax: tex, OutputJax: svg });

  const node = doc.convert(latex, { display: true });
  let svgStr = adaptor.innerHTML(node);

  // Parse viewBox or width/height
  const wMatch = svgStr.match(/width="([\d.]+)ex"/);
  const hMatch = svgStr.match(/height="([\d.]+)ex"/);
  const wEx = wMatch ? parseFloat(wMatch[1]) : 20;
  const hEx = hMatch ? parseFloat(hMatch[1]) : 4;

  const scale = 24; // pixels per ex
  const wPx = Math.ceil(wEx * scale);
  const hPx = Math.ceil(hEx * scale);

  // Replace ex units with px and ensure xmlns
  svgStr = svgStr
    .replace(/width="[\d.]+ex"/, `width="${wPx}px"`)
    .replace(/height="[\d.]+ex"/, `height="${hPx}px"`);

  if (!svgStr.includes('xmlns="http://www.w3.org/2000/svg"')) {
    svgStr = svgStr.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
  }

  const outputPath = path.join(FORMULA_DIR, `${outputName}.png`);

  // Write SVG to temp file first for debugging
  const svgPath = path.join(FORMULA_DIR, `${outputName}.svg`);
  fs.writeFileSync(svgPath, svgStr);

  try {
    await sharp(Buffer.from(svgStr), { density: 300 })
      .flatten({ background: { r: 255, g: 255, b: 255 } })
      .png()
      .toFile(outputPath);
    console.log(`  ✓ ${outputName} (${wPx}x${hPx})`);
  } catch (err) {
    console.error(`  ✗ ${outputName}: ${err.message}`);
    // Fallback: try reading from file
    try {
      await sharp(svgPath, { density: 300 })
        .flatten({ background: { r: 255, g: 255, b: 255 } })
        .png()
        .toFile(outputPath);
      console.log(`  ✓ ${outputName} (fallback file method)`);
    } catch (err2) {
      console.error(`  ✗✗ ${outputName} fallback also failed: ${err2.message}`);
    }
  }

  return outputPath;
}

async function renderAll() {
  if (!fs.existsSync(FORMULA_DIR)) fs.mkdirSync(FORMULA_DIR, { recursive: true });

  console.log('\n📐 Rendering LaTeX formulas to PNG...');
  for (const [name, latex] of Object.entries(FORMULAS)) {
    try {
      await renderFormula(latex, name);
    } catch (err) {
      console.error(`  ✗ ${name}: ${err.message}`);
    }
  }

  // Check results
  const pngs = fs.readdirSync(FORMULA_DIR).filter(f => f.endsWith('.png'));
  console.log(`\n✅ Generated ${pngs.length}/${Object.keys(FORMULAS).length} formula PNGs\n`);
}

module.exports = { renderAll, FORMULAS, FORMULA_DIR };

if (require.main === module) {
  renderAll().catch(console.error);
}
