/**
 * Step 70: Capturing Frames — PNG Export
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Capturing Frames — PNG Export',
  chapter: 6,

  math: `<div class="math-section">
<h3>Frame Capture</h3>
<p>Canvas frame capture converts the current WebGL framebuffer to PNG:</p>
<p>$$\\text{canvas.toDataURL('image/png')} \\rightarrow \\text{base64 PNG}$$</p>

<h4>WebGL Requirements</h4>
<p>Frame capture requires **preserveDrawingBuffer: true** on the WebGL renderer.</p>
<p>Without this flag, the framebuffer is cleared after each render, making capture impossible.</p>

<h4>PNG Compression</h4>
<p>PNG is lossless and provides good compression for grayscale patterns:</p>
<p>• **Grayscale patterns**: ~3:1 compression ratio</p>
<p>• **High contrast B&W**: ~5:1 compression ratio</p>
<p>• **File size**: typically 50-200 KB for 512×512 patterns</p>

<h4>Image Sequence for Video</h4>
<p>For video generation, capture frame sequences:</p>
<p>$$\\text{video frames} = \\text{fps} \\times \\text{duration}$$</p>
<p>At 24 fps, a 10-second video needs 240 PNG files.</p>

<h4>Alternative Formats</h4>
<p>• **canvas.toDataURL()**: base64 string (larger, good for data URLs)</p>
<p>• **canvas.toBlob()**: binary blob (smaller, good for file download)</p>
<p>• **WebP**: better compression but less compatible</p>
</div>`,

  code: `<div class="code-section">
<h3>PNG Export Function</h3>
<pre><code class="language-js">// Complete PNG export implementation:
function exportFrame(canvas, filename = 'gray-scott-frame') {
  // Convert canvas to data URL
  const dataURL = canvas.toDataURL('image/png');

  // Create download link
  const link = document.createElement('a');
  link.download = \`\${filename}.png\`;
  link.href = dataURL;

  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}</code></pre>

<h4>PreserveDrawingBuffer in gpuLoop.js</h4>
<pre><code class="language-js">// From gpuLoop.js - renderer initialization:
const renderer = new THREE.WebGLRenderer({
  antialias: false,
  preserveDrawingBuffer: true  // Required for frame capture
});
renderer.setPixelRatio(1);
renderer.setSize(S, S);</code></pre>

<h4>GUI Button Integration</h4>
<pre><code class="language-js">// Adding PNG export button via onGui callback:
onGui: (gui, sim, params) => {
  const exportFolder = gui.addFolder('Export');
  exportFolder.add({
    savePNG: () => {
      const canvas = document.getElementById('three-canvas');
      exportFrame(canvas, \`gray-scott-\${Date.now()}\`);
    }
  }, 'savePNG').name('Save PNG');
}</code></pre>

<h4>Batch Export for Animation</h4>
<pre><code class="language-js">// Export numbered sequence:
let frameNumber = 0;

function exportFrameSequence() {
  const canvas = document.getElementById('three-canvas');
  const filename = \`frame-\${frameNumber.toString().padStart(4, '0')}\`;
  exportFrame(canvas, filename);
  frameNumber++;
}

// Call exportFrameSequence() in animation loop for automatic capture</code></pre>

<h4>Blob-Based Export (More Efficient)</h4>
<pre><code class="language-js">// Alternative using toBlob for better performance:
function exportFrameBlob(canvas, filename = 'gray-scott-frame') {
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = \`\${filename}.png\`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);  // Clean up
  }, 'image/png');
}</code></pre>
</div>`,

  init(container, state) {
    return startGPULoop(container, {
      params: { ...PRESETS.coral },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'bw',
      showGui: true,
      onGui: (gui, sim, params) => {
        const exportFolder = gui.addFolder('Export');
        exportFolder.add({
          savePNG: () => {
            const canvas = document.getElementById('three-canvas');
            if (canvas) {
              const dataURL = canvas.toDataURL('image/png');
              const link = document.createElement('a');
              link.download = `gray-scott-${Date.now()}.png`;
              link.href = dataURL;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }
          }
        }, 'savePNG').name('Save PNG');
      }
    })
  }
}