/**
 * Step 67: Zoom and Pan — UV Offset/Scale Uniforms
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Zoom and Pan — UV Offset/Scale Uniforms',
  chapter: 6,

  math: `<div class="math-section">
<h3>UV Coordinate Transformation</h3>
<p>Zoom and pan are implemented by transforming UV coordinates before texture sampling:</p>
<p>$$\\text{vUv}_{\\text{transformed}} = \\text{vUv} \\times \\text{scale} + \\text{offset}$$</p>

<h4>Zoom Control</h4>
<p>The scale parameter controls zoom level:</p>
<p>• **scale > 1**: zoom out (see more of the simulation)</p>
<p>• **scale < 1**: zoom in (magnify a region)</p>
<p>• **scale = 1**: normal 1:1 view</p>

<h4>Pan Control</h4>
<p>The offset parameter shifts the view:</p>
<p>• **offset = (0, 0)**: centered view</p>
<p>• **offset = (0.25, 0)**: pan right by 25% of the domain</p>
<p>• **offset = (-0.1, 0.1)**: pan left and up</p>

<h4>Digital Zoom vs Simulation Resolution</h4>
<p>This is **digital zoom**: the simulation runs at full resolution (e.g., 256×256), but only the display viewport changes.</p>
<p>Benefits: no loss of simulation accuracy, real-time zoom/pan</p>
<p>Limitation: cannot see detail finer than the original simulation grid</p>
</div>`,

  code: `<div class="code-section">
<h3>UV Transform in Fragment Shader</h3>
<pre><code class="language-glsl">// Enhanced VizShader with zoom/pan uniforms:
uniform vec2 uOffset;   // pan offset
uniform float uScale;   // zoom scale

void main() {
  // Transform UV coordinates
  vec2 transformedUV = vUv * uScale + uOffset;

  // Sample simulation texture
  vec4 s = texture2D(uState, transformedUV);
  float u = s.r;

  // Apply visualization mode...
}</code></pre>

<h4>Mouse Wheel Zoom Implementation</h4>
<pre><code class="language-js">// Adding zoom controls to the renderer:
let scale = 1.0;
let offset = { x: 0.0, y: 0.0 };

canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  const zoomFactor = 1.1;
  if (e.deltaY < 0) {
    scale *= zoomFactor;  // zoom in
  } else {
    scale /= zoomFactor;  // zoom out
  }
  scale = Math.max(0.1, Math.min(5.0, scale));  // clamp
  vizShader.material.uniforms.uScale.value = scale;
});</code></pre>

<h4>Mouse Drag Pan Implementation</h4>
<pre><code class="language-js">// Pan with mouse drag:
let isDragging = false;
let lastMousePos = { x: 0, y: 0 };

canvas.addEventListener('mousedown', (e) => {
  isDragging = true;
  lastMousePos = { x: e.clientX, y: e.clientY };
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDragging) return;

  const deltaX = (e.clientX - lastMousePos.x) / canvas.width;
  const deltaY = (e.clientY - lastMousePos.y) / canvas.height;

  offset.x -= deltaX * scale;  // scale-aware panning
  offset.y += deltaY * scale;

  vizShader.material.uniforms.uOffset.value.set(offset.x, offset.y);
  lastMousePos = { x: e.clientX, y: e.clientY };
});</code></pre>
</div>`,

  init(container, state) {
    return startGPULoop(container, {
      params: { ...PRESETS.mitosis },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'bw',
      showGui: true
    })
  }
}