const pptxgen = require("pptxgenjs");

let pres = new pptxgen();

// Global layout configuration
pres.layout = "LAYOUT_16x9";

// ==========================================
// MASTER SLIDES DEFINITIONS
// ==========================================

// 1. Title Master
pres.defineSlideMaster({
  title: "MASTER_TITLE",
  background: { color: "0F172A" }, // Dark slate
  objects: [
    { rect: { x: 0, y: 0, w: "100%", h: "100%", fill: { color: "0F172A" } } },
    { image: { path: "images/cover_illustration.png", x: "80%", y: -0.5, w: "40%", h: "130%", sizing: { type: "cover" }, transparency: 80 } },
    { rect: { x: 0, y: 0, w: 0.15, h: "100%", fill: { color: "0EA5E9" } } } // Accent bar left
  ]
});

// 2. Standard Master
pres.defineSlideMaster({
  title: "MASTER_STD",
  background: { color: "F8FAFC" }, // Light background
  objects: [
    { rect: { x: 0, y: 0, w: "100%", h: 0.1, fill: { color: "0EA5E9" } } }, // Top accent
    { rect: { x: 0, y: 7.2, w: "100%", h: 0.02, fill: { color: "CBD5E1" } } }, // Footer divider
    { text: { text: "Movie Recommender System Project  |  DevConnect", options: { x: 0.5, y: 7.25, w: 6, h: 0.2, fontSize: 10, color: "94A3B8", fontFace: "Helvetica" } } }
  ],
  slideNumber: { x: 9.5, y: 7.25, fontSize: 10, color: "0EA5E9", fontFace: "Helvetica", bold: true }
});

// 3. Diagram/Full Visual Master
pres.defineSlideMaster({
  title: "MASTER_VISUAL",
  background: { color: "FFFFFF" },
  objects: [
    { rect: { x: 0, y: 0, w: "100%", h: 0.8, fill: { color: "F1F5F9" } } }, // Light top header background
    { rect: { x: 0, y: 0, w: 0.1, h: "100%", fill: { color: "38BDF8" } } }
  ],
  slideNumber: { x: 9.5, y: 7.25, fontSize: 10, color: "94A3B8" }
});


// ==========================================
// HELPER FUNCTIONS
// ==========================================

function addTitleSlide(title, subtitle) {
  let slide = pres.addSlide({ masterName: "MASTER_TITLE" });
  slide.addText("MOVIE RECOMMENDER SYSTEM", {
    x: 1.0, y: 2.2, w: 8, h: 1, fontSize: 48, bold: true, color: "FFFFFF", fontFace: "Helvetica"
  });
  slide.addText(title, {
    x: 1.0, y: 3.3, w: 8, h: 0.5, fontSize: 24, color: "38BDF8", fontFace: "Helvetica"
  });
  slide.addText(subtitle, {
    x: 1.0, y: 3.8, w: 8, h: 0.5, fontSize: 18, color: "94A3B8", italic: true, fontFace: "Helvetica"
  });
  slide.addImage({ path: "images/cover_illustration.png", x: 6, y: 1.5, w: 3.5, h: 4.5, sizing: { type: "contain" } });
  return slide;
}

function addContentSlide(title, points, imagePath, reverse = false) {
  let slide = pres.addSlide({ masterName: "MASTER_STD" });
  
  // Title
  slide.addText(title, { x: 0.5, y: 0.3, w: 9, h: 0.8, fontSize: 32, bold: true, color: "0F172A", fontFace: "Helvetica" });
  
  let textX = reverse ? 4.5 : 0.5;
  let textW = imagePath ? 5.0 : 9.0;
  let imgX = reverse ? 0.3 : 5.8;
  
  // Add image inside a nice rounded rectangle illusion (since pptxgenjs doesn't support border-radius images directly, we use pure image)
  if(imagePath) {
    slide.addImage({ path: imagePath, x: imgX, y: 1.3, w: 3.8, h: 5.5, sizing: { type: "contain" } });
  }
  
  // Bullets
  let bulletOptions = { bullet: { type: "character", character: "•" }, color: "334155", fontFace: "Helvetica", fontSize: 20, breakLine: true, paraSpaceAfter: 24 };
  
  let formattedPoints = points.map(p => {
    if(p.startsWith("- ")) return { text: p.substring(2), options: { ...bulletOptions, indentLevel: 1, fontSize: 18, color: "64748B" } };
    return { text: p, options: bulletOptions };
  });

  slide.addText(formattedPoints, { x: textX, y: 1.5, w: textW, h: 5.0, valign: "top" });
  return slide;
}

function addFlowSlide(title, imagePath) {
  let slide = pres.addSlide({ masterName: "MASTER_VISUAL" });
  slide.addText(title, { x: 0.5, y: 0.1, w: 9, h: 0.6, fontSize: 28, bold: true, color: "0F172A", fontFace: "Helvetica" });
  slide.addImage({ path: imagePath, x: 1.0, y: 1.0, w: 8.0, h: 6.0, sizing: { type: "contain" } });
  return slide;
}

// ==========================================
// GENERATE 22 SLIDES
// ==========================================

// SPEAKER 1
// Slide 1
addTitleSlide("Using Collaborative Filtering, SVD & Hybrid Approaches", "MovieLens 1M · 5 Algorithms · Web Demo");

// Slide 2
addContentSlide("What is a Recommender System?", [
  "Core Definition: AI algorithm designed to predict user preferences.",
  "The Challenge: Choice Overload",
  "- 800M videos on YouTube",
  "- 1.5B items on Shopee",
  "The Goal: Act as an intelligent filter to help users find the perfect item instantly."
], "images/choice_overload.png", false);

// Slide 3
addContentSlide("Why Movies? Why MovieLens?", [
  "Movies represent the ideal testing domain for RecSys.",
  "- Easier to evaluate than abstract products.",
  "- Rich contextual metadata (genres, directors).",
  "The Gold Standard dataset: MovieLens.",
  "- We chose the 1M Version (1 million ratings)",
  "- Balances computational speed with enough sparsity to challenge our algorithms."
], "images/movie_data_icons.png", true);

// Slide 4
addContentSlide("MovieLens 1M — Overview", [
  "Database consists of exactly 1,000,209 interactions.",
  "Scale:",
  "- 6,040 Users",
  "- 3,883 Movies",
  "- Ratings from 1 to 5 stars",
  "Sparsity: 95.5%",
  "- This means 95.5% of the user-movie matrix is empty.",
  "- Our goal is to accurately predict these empty spaces."
], "images/data_files_matrix.png", false);

// Slide 5
addContentSlide("Dataset Details: What's Inside?", [
  "File 1: ratings.dat",
  "- Col: userId, movieId, rating, timestamp",
  "File 2: movies.dat",
  "- Col: movieId, title, 18 distinct genres",
  "File 3: users.dat",
  "- Col: gender, 7 age groups, 21 occupation categories",
  "Each file uniquely feeds into different branches of our algorithms."
], null);

// Slide 6
addFlowSlide("Data Flow: File → Algorithm", "images/data_flow_diagram.png");

// Slide 7
addContentSlide("Setup & EDA Pipeline", [
  "Environment Built on Google Colab",
  "- Libraries: Pandas, Scikit-learn, Surprise",
  "Data Ingestion",
  "- Parsed custom '::' delimiters unique to MovieLens.",
  "Initial Pipeline Statistics",
  "- Average rating across system: 3.58",
  "- Cleaned and prepared dataframe for matrix creation."
], "images/scientist_charts.png", true);

// Slide 8
// Just content slide for EDA findings
let s8 = pres.addSlide({ masterName: "MASTER_VISUAL" });
s8.addText("EDA Key Findings", { x: 0.5, y: 0.1, w: 9, h: 0.6, fontSize: 28, bold: true, color: "0F172A", fontFace: "Helvetica" });

// Custom chart block
s8.addShape(pres.ShapeType.rect, { x: 1, y: 1.5, w: 3.5, h: 4, fill: { color: "F8FAFC" }, line: { color: "CBD5E1", width: 1 } });
s8.addText("Rating Distribution:\n\n4-Star is the most common (34%).\nUsers lean towards positive ratings.", { x: 1.2, y: 1.8, w: 3.1, h: 3, fontSize: 18, color: "0F172A" });

s8.addShape(pres.ShapeType.rect, { x: 5.5, y: 1.5, w: 3.5, h: 4, fill: { color: "F8FAFC" }, line: { color: "CBD5E1", width: 1 } });
s8.addText("Long Tail Effect:\n\nTop 100 movies hold massive interaction volume.\nThousands of niche movies sit with <10 ratings.", { x: 5.7, y: 1.8, w: 3.1, h: 3, fontSize: 18, color: "0F172A" });


// SPEAKER 2
// Slide 9
addContentSlide("Algorithm Taxonomy", [
  "Our system implements multiple logic engines:",
  "1. Collaborative Filtering (CF)",
  "- User-Based CF",
  "- Item-Based CF",
  "- Singular Value Decomposition (SVD)",
  "2. Content-Based Filtering",
  "3. Hybrid Approach (Fusing multiple branches)"
], "images/algorithm_tree.png", false);

// Slide 10
addContentSlide("User-Based Collaborative Filtering", [
  "Concept: 'Similar users like similar movies'.",
  "Mechanism:",
  "- Calculate Cosine Similarity between users.",
  "- Select K=20 'Nearest Neighbors'.",
  "- Predict rating using weighted average of neighbors.",
  "Pros: Highly intuitive.",
  "Cons: Slow at scale, and suffers from 'Cold-Start'."
], null);

// Slide 11
addContentSlide("Item-Based Collaborative Filtering", [
  "Concept: 'Similar items get similar ratings'.",
  "Mechanism:",
  "- Match movies instead of users.",
  "- If Movie A and B get similar ratings from users, they are similar.",
  "Advantage over User-Based:",
  "- Item matrix is much more stable than the User matrix.",
  "- Less expensive to compute in production."
], null);

// Slide 12
addContentSlide("SVD — Matrix Factorization", [
  "Concept: Finding Latent Factors.",
  "- Decomposes massive matrix (R) into User Matrix (P) and Item Matrix (Q).",
  "- We configured 50 Latent Factors (k=50).",
  "Optimization: Stochastic Gradient Descent (SGD).",
  "Verdict:",
  "- Best performer among traditional algorithms.",
  "- Highly resilient against sparse data."
], "images/matrix_decomposition.png", true);


// SPEAKER 3
// Slide 13
addContentSlide("Content-Based Filtering", [
  "Concept: Matching movie metadata directly.",
  "Mechanism:",
  "- Extracted genres and titles.",
  "- Transformed text using TF-IDF (Term Frequency-Inverse Document Frequency) vectors.",
  "- Recommends films using cosine similarity of the content completely independent of other users.",
  "Massive Advantage: Completely solves the Cold-Start problem."
], "images/movie_tags_network.png", false);

// Slide 14
addContentSlide("Hybrid System (SVD + Content-Based)", [
  "Our Capstone Model: The best of both worlds.",
  "Weighted Equation:",
  "- Score = 0.6 × SVD + 0.4 × Content-Based",
  "Cascade Strategy:",
  "- If SVD lacks user history, Content-Based steps in.",
  "- Delivers high prediction accuracy while preserving niche diversity."
], "images/puzzle_pieces.png", true);

// Slide 15
addContentSlide("Why Evaluate? Two Types of Metrics", [
  "To prove scientific rigor, we evaluated exactly on an 80/20 train/test split.",
  "Category 1: Prediction Metrics",
  "- 'How close is our prediction to the true star rating?'",
  "- RMSE and MAE",
  "Category 2: Ranking Metrics",
  "- 'Did we put the right movies in the top 10 list?'",
  "- Precision@K, Recall, MAP, NDCG"
], "images/scientist_charts.png", false);

// Slide 16
let s16 = pres.addSlide({ masterName: "MASTER_STD" });
s16.addText("Prediction Metrics: RMSE Focus", { x: 0.5, y: 0.3, w: 9, h: 0.8, fontSize: 32, bold: true, color: "0F172A", fontFace: "Helvetica" });

s16.addShape(pres.ShapeType.roundRect, { x: 1, y: 1.5, w: 8, h: 2, fill: { color: "0EA5E9" }, line: { color: "0284C7", width: 1 }, rectRadius: 0.1 });
s16.addText("SVD achieved RMSE = 0.87 (The lowest error)", { x: 1, y: 1.5, w: 8, h: 2, fontSize: 28, bold: true, color: "FFFFFF", align: "center" });

s16.addText([
  { text: "Comparison:\n", options: { bold: true } },
  { text: "• User-Based CF: 0.9293\n" },
  { text: "• Item-Based CF: 0.9293\n" },
  { text: "• SVD: 0.8706\n\n" },
  { text: "Root Mean Square Error heavily penalizes large mistakes, ensuring our system avoids making terrible movie recommendations." }
], { x: 1, y: 4.0, w: 8, h: 2, fontSize: 20, color: "334155" });

// Slide 17
addContentSlide("Ranking Metrics: Top-K Assessment", [
  "Content-Based performance:",
  "- Precision@10 = 0.1163",
  "- NDCG@10 = 0.1248",
  "Interpretation:",
  "- Out of 3,800 movies, effectively placing relevant items in the strict top 10 is challenging.",
  "- Our NDCG score proves the ranked order closely aligns with user preferences."
], null);


// SPEAKER 4
// Slide 18
addContentSlide("Temporal Analysis Context", [
  "Extracted timestamps to analyze behavior across time.",
  "Findings:",
  "- Users provide slightly higher ratings on weekends.",
  "- Peak engagement window: 9 PM to 11 PM.",
  "Application:",
  "- Allows the platform to dynamically boost high-rated weekend recommendations."
], "images/clock_calendar_trends.png", true);

// Slide 19
let s19 = addContentSlide("Demographics & Cold-Start Fallback", [
  "Examining the users.dat file:",
  "- Gender differences: Females rate slightly higher (+0.06 stars).",
  "- Strong genre splits:",
  "  → Males dominant in Action & Sci-Fi",
  "  → Females dominant in Drama & Romance",
  "Application:",
  "- This demographic data serves as the perfect fallback layout for brand-new users before we gather their history."
], null);

// Slide 20
addContentSlide("Project Structure & Codebase", [
  "Our codebase utilizes strict modularization.",
  "- docs/ : All research and writing modules.",
  "- notebooks/ : Jupyter experimentation.",
  "- frontend/ : 'Zen UI' codebase.",
  "- src/ : Pure Python modules.",
  "Data Flow in Code:",
  "constants → data_loader → models → evaluation"
], null);

// Slide 21
addContentSlide("System Architecture: Decoupled Deploy", [
  "Backend (Google Colab)",
  "- Hosts the heavy Machine Learning models.",
  "- Exposes a FastAPI endpoint.",
  "- Bridged to the internet via an ngrok tunnel.",
  "Frontend (Cloudflare Pages)",
  "- Static 'Zen UI' deployed completely free.",
  "- Calls the Colab backend dynamically via Javascript fetch API."
], "images/data_flow_diagram.png", false);

// Slide 22
addContentSlide("Live Demo & Future Work", [
  "Future Work Pipeline",
  "1. Neural Collaborative Filtering",
  "2. Processing Implicit Data (clicks, views vs explicit star ratings)",
  "3. Dockerizing backend for robust cloud server hosting.",
  "",
  "Thank you for listening!",
  "Q&A Session is now open."
], "images/rocket_launch.png", true);

// Write File
pres.writeFile({ fileName: "Movie_Recommender_Presentation.pptx" }).then(fileName => {
  console.log(`Created: ${fileName}`);
});
