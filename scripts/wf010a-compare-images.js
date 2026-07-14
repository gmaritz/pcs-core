const fs = require('fs');
const { PNG } = require('pngjs');

async function main() {
  const { default: pixelmatch } = await import('pixelmatch');

  const [canonicalPath, refactorPath, diffPath] = process.argv.slice(2);

  if (!canonicalPath || !refactorPath || !diffPath) {
    throw new Error('Usage: node wf010a-compare-images.js <canonical.png> <refactor.png> <diff.png>');
  }

  const a = PNG.sync.read(fs.readFileSync(canonicalPath));
  const b = PNG.sync.read(fs.readFileSync(refactorPath));

  const width = Math.max(a.width, b.width);
  const height = Math.max(a.height, b.height);

  function normalize(source) {
    const output = new PNG({ width, height });
    output.data.fill(255);

    for (let y = 0; y < source.height; y += 1) {
      for (let x = 0; x < source.width; x += 1) {
        const srcIndex = (y * source.width + x) * 4;
        const outIndex = (y * width + x) * 4;

        output.data[outIndex] = source.data[srcIndex];
        output.data[outIndex + 1] = source.data[srcIndex + 1];
        output.data[outIndex + 2] = source.data[srcIndex + 2];
        output.data[outIndex + 3] = source.data[srcIndex + 3];
      }
    }

    return output;
  }

  const normalizedA = normalize(a);
  const normalizedB = normalize(b);

  const diff = new PNG({ width, height });
  const mismatch = pixelmatch(normalizedA.data, normalizedB.data, diff.data, width, height, {
    threshold: 0.05,
    includeAA: false,
  });

  fs.writeFileSync(diffPath, PNG.sync.write(diff));

  const total = width * height;
  const pct = (mismatch / total) * 100;

  console.log(JSON.stringify({
    width,
    height,
    canonical: { width: a.width, height: a.height },
    refactor: { width: b.width, height: b.height },
    heightDelta: b.height - a.height,
    mismatchPixels: mismatch,
    totalPixels: total,
    mismatchPercent: Number(pct.toFixed(4)),
    canonicalPath,
    refactorPath,
    diffPath,
  }, null, 2));
}

void main();
