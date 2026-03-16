/**
 * Step 68: Tiling — Multi-Scale Rendering
 */
import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'

export default {
  title: 'Tiling — Multi-Scale Rendering',
  chapter: 6,

  math: `<div class="math-section">
<h3>Pattern Tiling</h3>
<p>Tiling renders the same simulation texture multiple times with different scales:</p>
<p>$$\\text{vUv}_{\\text{tiled}} = \\text{fract}(\\text{vUv} \\times \\text{tiles})$$</p>

<h4>Scale Relationships</h4>
<p>Different tile counts create different visual effects:</p>
<p>• **tiles = 1**: normal single view (scale = 1)</p>
<p>• **tiles = 2**: 2×2 repetition (scale = 0.5 per tile)</p>
<p>• **tiles = 4**: 4×4 repetition (scale = 0.25 per tile)</p>

<h4>Exploiting Periodic Boundaries</h4>
<p>Gray-Scott simulations use periodic boundary conditions, making patterns genuinely tileable.</p>
<p>The simulation wraps: left edge connects to right edge, top connects to bottom.</p>
<p>This mathematical property ensures seamless tiling without artifacts.</p>

<h4>Applications of Tiling</h4>
<p>Pattern tiling is useful for:</p>
<p>• **Texture generation**: seamless repeatable patterns for graphics</p>
<p>• **Wallpaper analysis**: studying translational symmetries</p>
<p>• **Material simulation**: bulk properties from unit cell patterns</p>
<p>• **Multi-scale visualization**: seeing both detail and large-scale structure</p>
</div>`,

  code: `<div class="code-section">
<h3>Tiling Implementation</h3>
<pre><code class="language-glsl">// Adding tiling uniform to VizShader:
uniform float uTiles;

void main() {
  // Tile the UV coordinates
  vec2 tiledUV = fract(vUv * uTiles);

  // Sample the simulation texture
  vec4 s = texture2D(uState, tiledUV);
  float u = s.r;

  // Apply visualization mode...
}</code></pre>

<h4>Three.js Texture Wrapping</h4>
<pre><code class="language-js">// Ensure texture wrapping is enabled:
const simTexture = new THREE.DataTexture(data, width, height, THREE.RGFormat, THREE.FloatType);
simTexture.wrapS = THREE.RepeatWrapping;
simTexture.wrapT = THREE.RepeatWrapping;
simTexture.magFilter = THREE.LinearFilter;
simTexture.minFilter = THREE.LinearFilter;</code></pre>

<h4>Interactive Tiling Control</h4>
<pre><code class="language-js">// Add tiling control to GUI:
const vizFolder = gui.addFolder('Visualization');
const tileCtrl = { tiles: 1 };
vizFolder.add(tileCtrl, 'tiles', 1, 8, 1)
  .name('tile count')
  .onChange(value => {
    vizShader.material.uniforms.uTiles.value = value;
  });</code></pre>

<h4>Multi-Scale Grid Layout</h4>
<pre><code class="language-glsl">// Alternative: render different scales in grid layout
vec2 gridPos = floor(vUv * 2.0);  // 2x2 grid
vec2 localUV = fract(vUv * 2.0);

float scale = 1.0;
if (gridPos.x == 1.0 && gridPos.y == 0.0) scale = 2.0;  // top-right: 2x zoom
if (gridPos.x == 0.0 && gridPos.y == 1.0) scale = 4.0;  // bottom-left: 4x zoom
if (gridPos.x == 1.0 && gridPos.y == 1.0) scale = 8.0;  // bottom-right: 8x zoom

vec4 s = texture2D(uState, fract(localUV * scale));</code></pre>
</div>`,

  init(container, state) {
    return startGPULoop(container, {
      params: { ...PRESETS.stripes },
      size: 256,
      stepsPerFrame: 8,
      vizMode: 'bw',
      showGui: true
    })
  }
}