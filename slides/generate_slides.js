const pptxgen = require('pptxgenjs');
const { buildPart1 } = require('./slides_part1');
const { buildPart2 } = require('./slides_part2');

let pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE'; // 13.33 x 7.5 inches, exactly like Movie_Recommender_v2.pptx

// Build slides
buildPart1(pptx);
buildPart2(pptx);

pptx.writeFile({ fileName: 'Movie_Recommender_Presentation.pptx' })
  .then(fileName => {
    console.log(`Created: ${fileName}`);
  });
