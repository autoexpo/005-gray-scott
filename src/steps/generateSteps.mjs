/**
 * Script to generate stub step files for steps 15-100.
 * Run: node src/steps/generateSteps.mjs
 */
import { writeFileSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const steps = [
  // Chapter 2 (steps 15-18)
  { n:15, ch:2, dir:'ch02', title:'1D Traveling Waves and Standing Patterns', preset:'spots', viz:'invert', gpu:false },
  { n:16, ch:2, dir:'ch02', title:'Effect of Changing f in 1D', preset:'spots', viz:'invert', gpu:false },
  { n:17, ch:2, dir:'ch02', title:'Effect of Changing Du and Dv in 1D', preset:'spots', viz:'invert', gpu:false },
  { n:18, ch:2, dir:'ch02', title:'Periodic vs Fixed Boundary Conditions in 1D', preset:'spots', viz:'invert', gpu:false },

  // Chapter 3 (steps 19-30)
  { n:19, ch:3, dir:'ch03', title:'Extending to 2D: Row-Major Layout', preset:'spots', viz:'invert', gpu:false },
  { n:20, ch:3, dir:'ch03', title:'2D Index Arithmetic', preset:'spots', viz:'invert', gpu:false },
  { n:21, ch:3, dir:'ch03', title:'The 5-Point Laplacian Stencil in 2D', preset:'spots', viz:'invert', gpu:false },
  { n:22, ch:3, dir:'ch03', title:'Implementing 5-Point Stencil (Periodic BC)', preset:'spots', viz:'invert', gpu:false },
  { n:23, ch:3, dir:'ch03', title:'Initial Conditions for 2D', preset:'spots', viz:'invert', gpu:false },
  { n:24, ch:3, dir:'ch03', title:'Running the 2D CPU Simulation', preset:'spots', viz:'invert', gpu:false },
  { n:25, ch:3, dir:'ch03', title:'Rendering 2D Output to Canvas ImageData', preset:'spots', viz:'invert', gpu:false },
  { n:26, ch:3, dir:'ch03', title:'Observing First Patterns: Spots from Noise', preset:'spots', viz:'invert', gpu:true },
  { n:27, ch:3, dir:'ch03', title:'The 9-Point Isotropic Laplacian', preset:'spots', viz:'invert', gpu:false },
  { n:28, ch:3, dir:'ch03', title:'5-Point vs 9-Point Laplacian Comparison', preset:'spots', viz:'invert', gpu:true },
  { n:29, ch:3, dir:'ch03', title:'Boundary Conditions in 2D', preset:'spots', viz:'invert', gpu:false },
  { n:30, ch:3, dir:'ch03', title:'CPU Performance: Why We Need the GPU', preset:'spots', viz:'invert', gpu:false },

  // Chapter 4 (steps 31-45)
  { n:31, ch:4, dir:'ch04', title:'WebGL Context and Extension Detection', preset:'spots', viz:'grayscale', gpu:false },
  { n:32, ch:4, dir:'ch04', title:'Framebuffer Objects (FBOs)', preset:'spots', viz:'grayscale', gpu:false },
  { n:33, ch:4, dir:'ch04', title:'Creating Float Textures (WebGL1/2)', preset:'spots', viz:'grayscale', gpu:false },
  { n:34, ch:4, dir:'ch04', title:'The Ping-Pong Pattern', preset:'spots', viz:'grayscale', gpu:false },
  { n:35, ch:4, dir:'ch04', title:'Full-Screen Quad Geometry', preset:'spots', viz:'grayscale', gpu:false },
  { n:36, ch:4, dir:'ch04', title:'The Vertex Shader: Pass-Through', preset:'spots', viz:'grayscale', gpu:false },
  { n:37, ch:4, dir:'ch04', title:'Fragment Shader: Neighbour Sampling', preset:'spots', viz:'grayscale', gpu:false },
  { n:38, ch:4, dir:'ch04', title:'5-Point Laplacian in GLSL', preset:'spots', viz:'grayscale', gpu:false },
  { n:39, ch:4, dir:'ch04', title:'Full Gray-Scott Update in GLSL', preset:'spots', viz:'grayscale', gpu:false },
  { n:40, ch:4, dir:'ch04', title:'Float Precision: Packing u and v into RGBA', preset:'spots', viz:'grayscale', gpu:false },
  { n:41, ch:4, dir:'ch04', title:'Visualization Pass: Screen Output', preset:'spots', viz:'grayscale', gpu:true },
  { n:42, ch:4, dir:'ch04', title:'Integrating GPU Pipeline with Three.js', preset:'spots', viz:'invert', gpu:true },
  { n:43, ch:4, dir:'ch04', title:'First GPU Simulation: Correctness Check', preset:'spots', viz:'invert', gpu:true },
  { n:44, ch:4, dir:'ch04', title:'The Simulation Loop: rAF and Sub-Stepping', preset:'spots', viz:'invert', gpu:true },
  { n:45, ch:4, dir:'ch04', title:'Passing Uniforms: f, k, Du, Dv, dt', preset:'spots', viz:'invert', gpu:true },

  // Chapter 5 (steps 46-58)
  { n:46, ch:5, dir:'ch05', title:'lil-gui Setup: Parameter Panel', preset:'spots', viz:'invert', gpu:true },
  { n:47, ch:5, dir:'ch05', title:'Live f and k Sliders', preset:'spots', viz:'invert', gpu:true },
  { n:48, ch:5, dir:'ch05', title:'Preset System: Named Configurations', preset:'spots', viz:'invert', gpu:true },
  { n:49, ch:5, dir:'ch05', title:'Preset: Spots (f=0.035, k=0.065)', preset:'spots', viz:'invert', gpu:true },
  { n:50, ch:5, dir:'ch05', title:'Preset: Stripes (f=0.060, k=0.062)', preset:'stripes', viz:'invert', gpu:true },
  { n:51, ch:5, dir:'ch05', title:'Preset: Worms (f=0.078, k=0.061)', preset:'worms', viz:'invert', gpu:true },
  { n:52, ch:5, dir:'ch05', title:'Preset: Mitosis (f=0.028, k=0.053)', preset:'mitosis', viz:'invert', gpu:true },
  { n:53, ch:5, dir:'ch05', title:'Preset: Bubbles (f=0.098, k=0.057)', preset:'bubbles', viz:'invert', gpu:true },
  { n:54, ch:5, dir:'ch05', title:'Preset: Coral (f=0.059, k=0.062)', preset:'coral', viz:'invert', gpu:true },
  { n:55, ch:5, dir:'ch05', title:'Preset: Solitons (Traveling Pulses)', preset:'solitons', viz:'invert', gpu:true },
  { n:56, ch:5, dir:'ch05', title:'The (f,k) Parameter Map', preset:'spots', viz:'invert', gpu:true },
  { n:57, ch:5, dir:'ch05', title:'Mouse Interaction: Drawing V', preset:'spots', viz:'invert', gpu:true },
  { n:58, ch:5, dir:'ch05', title:'Seeding Shader: GPU-Side Paint', preset:'coral', viz:'invert', gpu:true },

  // Chapter 6 (steps 59-70)
  { n:59, ch:6, dir:'ch06', title:'Grayscale Mapping: U to Luminance', preset:'spots', viz:'grayscale', gpu:true },
  { n:60, ch:6, dir:'ch06', title:'Inverted Grayscale: White Background', preset:'spots', viz:'invert', gpu:true },
  { n:61, ch:6, dir:'ch06', title:'False Color LUT (B&W Gradient)', preset:'stripes', viz:'invert', gpu:true },
  { n:62, ch:6, dir:'ch06', title:'Gradient Mapping: Two-Color Interpolation', preset:'worms', viz:'invert', gpu:true },
  { n:63, ch:6, dir:'ch06', title:'Multi-Band: Visualizing U and V Together', preset:'mitosis', viz:'dual', gpu:true },
  { n:64, ch:6, dir:'ch06', title:'Temporal Blending: Motion Blur', preset:'coral', viz:'invert', gpu:true },
  { n:65, ch:6, dir:'ch06', title:'Edge Detection: Sobel Filter', preset:'spots', viz:'edge', gpu:true },
  { n:66, ch:6, dir:'ch06', title:'Contour Lines: Iso-Value Rendering', preset:'stripes', viz:'contour', gpu:true },
  { n:67, ch:6, dir:'ch06', title:'Zoom and Pan: UV Offset/Scale Uniforms', preset:'spots', viz:'invert', gpu:true },
  { n:68, ch:6, dir:'ch06', title:'Tiling: Multi-Scale Rendering', preset:'coral', viz:'invert', gpu:true },
  { n:69, ch:6, dir:'ch06', title:'Stats.js: FPS and Timing', preset:'spots', viz:'invert', gpu:true },
  { n:70, ch:6, dir:'ch06', title:'Capturing Frames: PNG Export', preset:'spots', viz:'invert', gpu:true },

  // Chapter 7 (steps 71-80)
  { n:71, ch:7, dir:'ch07', title:'Stability Analysis: CFL Condition', preset:'spots', viz:'invert', gpu:false },
  { n:72, ch:7, dir:'ch07', title:'Numerical Instability Demo: dt Too Large', preset:'spots', viz:'invert', gpu:true },
  { n:73, ch:7, dir:'ch07', title:'RK4 Integration: Four-Stage Derivation', preset:'spots', viz:'invert', gpu:false },
  { n:74, ch:7, dir:'ch07', title:'RK4 on the GPU: Four Ping-Pong Passes', preset:'spots', viz:'invert', gpu:true },
  { n:75, ch:7, dir:'ch07', title:'Euler vs RK4: Accuracy Comparison', preset:'spots', viz:'invert', gpu:true },
  { n:76, ch:7, dir:'ch07', title:'Adaptive Time Stepping', preset:'spots', viz:'invert', gpu:true },
  { n:77, ch:7, dir:'ch07', title:'Spatial Resolution: 128 vs 512 vs 1024', preset:'spots', viz:'invert', gpu:true },
  { n:78, ch:7, dir:'ch07', title:'Anti-Aliasing: Bilinear vs Nearest Sampling', preset:'spots', viz:'invert', gpu:true },
  { n:79, ch:7, dir:'ch07', title:'Mass Conservation Check', preset:'spots', viz:'invert', gpu:true },
  { n:80, ch:7, dir:'ch07', title:'Convergence Study', preset:'spots', viz:'invert', gpu:true },

  // Chapter 8 (steps 81-90)
  { n:81, ch:8, dir:'ch08', title:'Anisotropic Diffusion Tensor', preset:'spots', viz:'invert', gpu:true },
  { n:82, ch:8, dir:'ch08', title:'Noise Perturbation: Gaussian Noise on U', preset:'spots', viz:'invert', gpu:true },
  { n:83, ch:8, dir:'ch08', title:'Spatially Varying f and k: Parameter Maps', preset:'spots', viz:'invert', gpu:true },
  { n:84, ch:8, dir:'ch08', title:'Multi-Scale Simulation', preset:'spots', viz:'invert', gpu:true },
  { n:85, ch:8, dir:'ch08', title:'3D Extension Concept: Volumetric RD', preset:'coral', viz:'invert', gpu:true },
  { n:86, ch:8, dir:'ch08', title:'3D Surface: Vertex Displacement by U', preset:'spots', viz:'invert', gpu:true },
  { n:87, ch:8, dir:'ch08', title:'Turing Instability Analysis: Linearization', preset:'spots', viz:'invert', gpu:false },
  { n:88, ch:8, dir:'ch08', title:'Pattern Wavelength: Dispersion Relation', preset:'spots', viz:'invert', gpu:false },
  { n:89, ch:8, dir:'ch08', title:'Symmetry Breaking: Sensitivity to ICs', preset:'spots', viz:'invert', gpu:true },
  { n:90, ch:8, dir:'ch08', title:'Coupling Two Gray-Scott Layers', preset:'spots', viz:'invert', gpu:true },

  // Chapter 9 (steps 91-100)
  { n:91, ch:9, dir:'ch09', title:'WebGL Performance Best Practices', preset:'worms', viz:'invert', gpu:true },
  { n:92, ch:9, dir:'ch09', title:'Sub-Stepping for Speed', preset:'worms', viz:'invert', gpu:true },
  { n:93, ch:9, dir:'ch09', title:'Web Worker CPU Fallback', preset:'spots', viz:'invert', gpu:false },
  { n:94, ch:9, dir:'ch09', title:'Responsive Layout: Resize and DPR', preset:'spots', viz:'invert', gpu:true },
  { n:95, ch:9, dir:'ch09', title:'URL Hash Navigation: Deep Linking', preset:'spots', viz:'invert', gpu:false },
  { n:96, ch:9, dir:'ch09', title:'Progress Persistence: localStorage', preset:'spots', viz:'invert', gpu:false },
  { n:97, ch:9, dir:'ch09', title:'Vite Production Build: Asset Hashing', preset:'spots', viz:'invert', gpu:false },
  { n:98, ch:9, dir:'ch09', title:'Cloudflare Pages Deployment', preset:'spots', viz:'invert', gpu:false },
  { n:99, ch:9, dir:'ch09', title:'Performance Audit: Lighthouse + WebGL', preset:'spots', viz:'invert', gpu:true },
  { n:100, ch:9, dir:'ch09', title:'Final Synthesis: Full Gray-Scott System', preset:'coral', viz:'invert', gpu:true },
]

// Short math/code content per step
const mathContent = {
  15: `<div class="math-section"><h3>1D Patterns</h3><p>In 1D, Gray-Scott produces traveling wave pulses and stationary patterns.
The specific dynamics depend on (f,k) and the 1D geometry — no spots or stripes form in 1D,
but the underlying chemistry is identical.</p></div>`,

  16: `<div class="math-section"><h3>Effect of Feed Rate f</h3>
<p>Increasing f speeds up U replenishment. Effect on patterns:</p>
<ul style="margin-left:16px;line-height:1.9">
<li>f too small → V starves, patterns die</li>
<li>f optimal → stable traveling pulses or standing waves</li>
<li>f too large → V grows unchecked, uniform coverage</li>
</ul></div>`,

  17: `<div class="math-section"><h3>Diffusion Ratio Du/Dv</h3>
<p>The ratio Du/Dv is critical for Turing instability. Standard: Du=0.2097, Dv=0.105 (ratio 2).</p>
<p>Reducing the ratio reduces pattern contrast; ratio below ~1.5 may prevent patterns.</p></div>`,

  18: `<div class="math-section"><h3>Boundary Conditions</h3>
<p><strong>Periodic:</strong> cell 0 neighbours cell N-1. Domain acts as a torus. No edge effects.</p>
<p><strong>Dirichlet:</strong> u=1, v=0 at boundaries (absorbing). Waves reflect differently.</p>
<p><strong>Neumann:</strong> zero flux at boundaries. ∂u/∂n = 0 → reflective walls.</p></div>`,

  19: `<div class="math-section"><h3>2D Grid Layout</h3>
<p>A 2D W×H grid is stored as a flat 1D array of length W×H.</p>
<div class="math-block">$$\\text{index}(r, c) = r \\times W + c$$</div>
<p>This row-major layout is cache-friendly for row-by-row access patterns.</p></div>`,

  20: `<div class="math-section"><h3>2D Index with Periodic Wrap</h3>
<div class="math-block">$$\\text{idx}(r,c) = \\bigl((r \\bmod H) + H\\bigr)\\bmod H \\times W + \\bigl((c \\bmod W) + W\\bigr)\\bmod W$$</div>
<p>The double-modulo pattern handles negative indices correctly in JavaScript.</p></div>`,

  21: `<div class="math-section"><h3>2D 5-Point Stencil</h3>
<div class="math-block">$$\\nabla^2 u_{i,j} = u_{i-1,j} + u_{i+1,j} + u_{i,j-1} + u_{i,j+1} - 4u_{i,j}$$</div>
<pre style="border:none;background:none;text-align:center;line-height:1.8">
       +1
  +1   −4   +1
       +1
</pre></div>`,

  22: `<div class="math-section"><h3>5-Point Stencil (Periodic)</h3>
<p>With periodic BCs, no special treatment at boundaries is needed.
The grid wraps in both x and y directions — it is topologically a torus.</p></div>`,

  23: `<div class="math-section"><h3>2D Initial Conditions</h3>
<p>Standard: U=1 everywhere, V=0 everywhere, with a small central square of V=1, U=0.
The square size controls how many "seeds" develop.</p></div>`,

  24: `<div class="math-section"><h3>2D CPU Step</h3>
<p>The 2D step is O(N²) per step, making it O(N²·T) total for T steps.
For N=256: 65,536 cells × 1000 steps = 65M operations — feasible on CPU but slow.</p></div>`,

  25: `<div class="math-section"><h3>ImageData Rendering</h3>
<p>CanvasRenderingContext2D.createImageData() creates a pixel buffer.
Each pixel is RGBA (4 bytes). We map u[i] → grayscale byte and write all four channels.</p></div>`,

  26: `<div class="math-section"><h3>Pattern Formation from Noise</h3>
<p>Starting from random perturbations, Gray-Scott self-organizes into spots within ~1000 steps.
The characteristic wavelength λ of the pattern is set by the parameters.</p></div>`,

  27: `<div class="math-section"><h3>9-Point Isotropic Laplacian</h3>
<div class="math-block">$$\\nabla^2 u \\approx \\frac{1}{6}\\sum_{\\text{cardinal}} + \\frac{1}{12}\\sum_{\\text{diagonal}} - \\frac{5}{6}u_{ij}$$</div>
<p>Correction weights make the stencil rotationally symmetric to O(h²), reducing directional bias.</p></div>`,

  28: `<div class="math-section"><h3>Stencil Comparison</h3>
<p>5-point stencil produces slightly diamond-shaped spots at low resolution.
9-point produces circular spots. The difference is visible at 64×64 but negligible at 256+.</p></div>`,

  29: `<div class="math-section"><h3>2D Boundary Conditions</h3>
<p>Periodic (torus), Dirichlet (fixed values), and Neumann (zero flux) all produce
different behavior at the domain edges. Most simulations use periodic for visual cleanliness.</p></div>`,

  30: `<div class="math-section"><h3>CPU Performance</h3>
<p>2D CPU simulation at 256×256: ~5ms/step in JS. At 8 steps/frame: ~40ms → 25fps.
At 512×512: ~20ms/step → 160ms → 6fps. GPU achieves 60fps at 512×512.</p></div>`,

  31: `<div class="math-section"><h3>WebGL Context</h3>
<p>Three.js creates a WebGLRenderer which internally initializes the GL context.
We detect capabilities using gl.getExtension().</p></div>`,

  32: `<div class="math-section"><h3>Framebuffer Objects</h3>
<p>An FBO is a render target — instead of drawing to the screen, we draw into a texture.
That texture can then be read as input on the next pass.</p></div>`,

  33: `<div class="math-section"><h3>Float Textures</h3>
<p>By default, WebGL textures store 8-bit integers per channel. For simulation accuracy
we need 32-bit floats. This requires OES_texture_float (WebGL1) or is built-in (WebGL2).</p></div>`,

  34: `<div class="math-section"><h3>Ping-Pong Pattern</h3>
<p>GPU shaders cannot read and write the same texture simultaneously.
Ping-pong uses two textures alternating as input/output each frame.</p>
<pre style="border:none;background:none;line-height:1.8">
  Frame N: read A → write B
  Frame N+1: read B → write A
  Frame N+2: read A → write B
  ...
</pre></div>`,

  35: `<div class="math-section"><h3>Full-Screen Quad</h3>
<p>A GPU "compute" pass uses a quad covering the entire NDC space [-1,1]².
Each fragment corresponds to one texel of the output texture.
The fragment shader computes one cell's new state per invocation.</p></div>`,

  36: `<div class="math-section"><h3>Pass-Through Vertex Shader</h3>
<p>The vertex shader for a full-screen quad just passes position through unchanged
and computes UV coordinates for the fragment shader to sample from.</p></div>`,

  37: `<div class="math-section"><h3>Sampling Neighbours</h3>
<p>In GLSL, texture2D(sampler, uv + offset) reads the value at a neighbouring texel.
With RepeatWrapping, this automatically handles periodic boundary conditions.</p></div>`,

  38: `<div class="math-section"><h3>GLSL 5-Point Laplacian</h3>
<p>The 5 texture lookups (center + 4 cardinal neighbours) are all done in a single
fragment shader invocation. Texture caches make these fast.</p></div>`,

  39: `<div class="math-section"><h3>Full Gray-Scott GLSL</h3>
<p>The fragment shader combines the Laplacian computation with the reaction-diffusion
equations and Euler integration, writing the new (u,v) to gl_FragColor.</p></div>`,

  40: `<div class="math-section"><h3>Float Encoding</h3>
<p>We store u in the R channel and v in the G channel of an RGBA float texture.
B and A are unused. This is efficient — no packing or unpacking needed.</p></div>`,

  41: `<div class="math-section"><h3>Visualization Pass</h3>
<p>After simulation, a second full-screen pass reads the (u,v) texture and
converts it to displayable RGB. This separation allows multiple viz modes.</p></div>`,

  42: `<div class="math-section"><h3>Three.js Integration</h3>
<p>Three.js WebGLRenderTarget wraps an FBO. We use RawShaderMaterial to write
pure GLSL without Three.js shader chunks. The renderer handles context management.</p></div>`,

  43: `<div class="math-section"><h3>GPU vs CPU Correctness</h3>
<p>Running both CPU and GPU with identical initial conditions for 200 steps,
the RMS difference in U should be below 1e-4 (floating-point precision).
Larger differences indicate a bug in the GLSL shader.</p></div>`,

  44: `<div class="math-section"><h3>Sub-Stepping</h3>
<p>We run multiple simulation steps per requestAnimationFrame call.
The GPU can do 8–32 steps per frame at 60fps for a 256×256 grid.</p></div>`,

  45: `<div class="math-section"><h3>Shader Uniforms</h3>
<p>Uniforms are values passed from JavaScript to GLSL each frame.
They allow parameter changes without recompiling the shader.</p></div>`,

  46: `<div class="math-section"><h3>lil-gui</h3>
<p>lil-gui creates interactive HTML controls bound to JavaScript objects.
Changes propagate to shader uniforms on the next frame — no recompilation needed.</p></div>`,

  47: `<div class="math-section"><h3>Real-Time Uniform Hot-Swap</h3>
<p>Moving the f or k sliders changes the corresponding uniform immediately.
The simulation adapts: patterns will gradually transition to the new parameter regime.</p></div>`,

  48: `<div class="math-section"><h3>Preset Loading</h3>
<p>A preset resets f, k, Du, Dv to known-good values and optionally resets the simulation grid.
Resetting the grid is needed when moving to a very different parameter regime.</p></div>`,

  49: `<div class="math-section"><h3>Spots Pattern</h3>
<p>f=0.035, k=0.065: Produces isolated circular spots (similar to leopard spots).
This is perhaps the most visually striking and stable pattern type.</p></div>`,

  50: `<div class="math-section"><h3>Stripes Pattern</h3>
<p>f=0.060, k=0.062: Produces labyrinthine stripe patterns. Similar to zebra stripes or coral brain patterns.
The stripes form with a characteristic wavelength determined by Du/Dv.</p></div>`,

  51: `<div class="math-section"><h3>Worms Pattern</h3>
<p>f=0.078, k=0.061: Long, worm-like domains that fill space. Intermediate between stripes and bubbles.
These patterns are highly dynamic and reorganize over time.</p></div>`,

  52: `<div class="math-section"><h3>Mitosis Pattern</h3>
<p>f=0.028, k=0.053: Self-replicating spots that divide like biological cells.
A spot grows elongated, then pinches off into two daughter spots.</p></div>`,

  53: `<div class="math-section"><h3>Bubbles Pattern</h3>
<p>f=0.098, k=0.057: Large bubble-like domains expanding outward.
High feed rate means V is well-supplied and forms macroscopic structures.</p></div>`,

  54: `<div class="math-section"><h3>Coral Pattern</h3>
<p>f=0.059, k=0.062: Dendritic, branching structures resembling coral.
Similar to diffusion-limited aggregation (DLA) patterns.</p></div>`,

  55: `<div class="math-section"><h3>Solitons</h3>
<p>f=0.030, k=0.057: Traveling wave pulses that maintain their shape.
"Soliton" because they pass through each other without dispersion.</p></div>`,

  56: `<div class="math-section"><h3>Phase Space Map</h3>
<p>The (f,k) plane is the master control surface. Different regions produce
qualitatively distinct attractors. The boundaries between regions are fractal-like.</p></div>`,

  57: `<div class="math-section"><h3>Mouse-Based Seeding</h3>
<p>Drawing V into the simulation by clicking/dragging injects activator locally.
Existing patterns are perturbed; new patterns nucleate from the drawn region.</p></div>`,

  58: `<div class="math-section"><h3>GPU Seeding Shader</h3>
<p>The seeding pass runs as an additional render pass before the simulation step.
It writes V=1, U=0 in a circular region centered on the mouse UV coordinate.</p></div>`,

  59: `<div class="math-section"><h3>Grayscale Mapping</h3>
<p>The simplest visualization: output = (u, u, u, 1). High food = bright white. Pattern regions where V is high and U is depleted appear dark.</p></div>`,

  60: `<div class="math-section"><h3>Inverted Grayscale</h3>
<p>output = (1-u, 1-u, 1-u, 1). Now pattern regions appear bright white on a black background. This is the most popular visualization for Gray-Scott.</p></div>`,

  61: `<div class="math-section"><h3>False Color</h3>
<p>Map u through a lookup table (LUT). A simple B&W gradient: low u → black, high u → white, with a non-linear mapping to enhance contrast in the pattern region.</p></div>`,

  62: `<div class="math-section"><h3>Two-Color Gradient</h3>
<p>Linearly interpolate between two colors (in B&W: two grays) as a function of u.
The effective range [0.3, 0.7] is where most pattern information lives.</p></div>`,

  63: `<div class="math-section"><h3>Dual Channel: U and V</h3>
<p>Visualize both species simultaneously: u contributes to brightness, v to a different visual channel. In B&W: output = u × 0.6 + v × 0.4.</p></div>`,

  64: `<div class="math-section"><h3>Motion Blur</h3>
<p>Blend the current frame with an accumulation buffer: out = 0.95 × prev + 0.05 × current.
Moving fronts leave a trail; stationary patterns remain sharp.</p></div>`,

  65: `<div class="math-section"><h3>Sobel Edge Detection</h3>
<p>The Sobel operator computes the gradient magnitude of u, highlighting boundaries between pattern and background.
$$|\\nabla u| = \\sqrt{G_x^2 + G_y^2}$$</p></div>`,

  66: `<div class="math-section"><h3>Contour Lines</h3>
<p>Iso-value lines are rendered by detecting zero-crossings of (u - threshold).
In GLSL: if fract(u × N) < 0.05, draw a line. Creates a topographic map effect.</p></div>`,

  67: `<div class="math-section"><h3>Zoom and Pan</h3>
<p>A UV offset and scale uniform in the visualization shader allows zooming into
regions of interest without changing the simulation resolution.</p></div>`,

  68: `<div class="math-section"><h3>Tiled Multi-Scale View</h3>
<p>Render multiple copies of the simulation at different UV scales in a grid.
Shows self-similarity of patterns across scale.</p></div>`,

  69: `<div class="math-section"><h3>Stats.js Performance Monitor</h3>
<p>Stats.js shows real-time FPS (panel 0), milliseconds per frame (panel 1),
and memory usage (panel 2). Essential for performance profiling.</p></div>`,

  70: `<div class="math-section"><h3>PNG Export</h3>
<p>canvas.toDataURL('image/png') captures the current frame.
For the WebGL canvas, this requires preserveDrawingBuffer: true.</p></div>`,

  71: `<div class="math-section"><h3>CFL Stability Condition</h3>
<p>The Courant-Friedrichs-Lewy condition for the diffusion equation:</p>
<div class="math-block">$$\\Delta t \\leq \\frac{h^2}{2D_{\\max}} \\quad \\text{(1D)}$$</div>
<div class="math-block">$$\\Delta t \\leq \\frac{h^2}{4D_{\\max}} \\quad \\text{(2D)}$$</div>
<p>With h=1, Du=0.2097: dt ≤ 2.38 (1D) or dt ≤ 1.19 (2D). Use dt=1.0 for safety.</p></div>`,

  72: `<div class="math-section"><h3>Instability from Large dt</h3>
<p>When dt exceeds the stability limit, the simulation "blows up" — values oscillate
wildly and quickly hit NaN. This demo sets dt=3.0 to show the blow-up phenomenon.</p></div>`,

  73: `<div class="math-section"><h3>Runge-Kutta 4th Order</h3>
<div class="math-block">$$k_1 = F(u), \\quad k_2 = F\\!\\left(u + \\frac{\\Delta t}{2}k_1\\right)$$</div>
<div class="math-block">$$k_3 = F\\!\\left(u + \\frac{\\Delta t}{2}k_2\\right), \\quad k_4 = F(u + \\Delta t \\cdot k_3)$$</div>
<div class="math-block">$$u^{t+1} = u^t + \\frac{\\Delta t}{6}(k_1 + 2k_2 + 2k_3 + k_4)$$</div>
<p>Fourth-order accuracy: error O(dt⁴). Allows larger dt than Euler.</p></div>`,

  74: `<div class="math-section"><h3>RK4 GPU Implementation</h3>
<p>Each of the 4 stages requires a separate FBO render pass.
RK4 needs 4 additional temporary FBOs: k1–k4 storage.
This is 4× more GPU memory and render calls than Euler.</p></div>`,

  75: `<div class="math-section"><h3>Euler vs RK4 Comparison</h3>
<p>At the same dt, RK4 is more accurate. At equal compute cost (RK4 uses 4× longer dt),
accuracy is similar but RK4 allows coarser time resolution for the same quality.</p></div>`,

  76: `<div class="math-section"><h3>Adaptive Time Stepping</h3>
<p>Compare the result of one large step vs two half-steps. If they differ by more
than a tolerance, halve dt. This automatically avoids instability while maximizing speed.</p></div>`,

  77: `<div class="math-section"><h3>Spatial Resolution</h3>
<p>Higher resolution reveals finer pattern detail but costs O(N²) per step.
The pattern wavelength is independent of resolution (determined by parameters),
but finer structures require finer grids to resolve correctly.</p></div>`,

  78: `<div class="math-section"><h3>Sampling and Anti-Aliasing</h3>
<p>Nearest-neighbour sampling (magnification) shows individual pixels — good for
seeing simulation state. Bilinear filtering smooths the display — better aesthetic.</p></div>`,

  79: `<div class="math-section"><h3>Mass Conservation</h3>
<p>The total concentration ∑(U+V) should decrease monotonically:
feed adds U, kill removes V, but net flux is slightly negative.
NaN or sudden jumps indicate numerical instability.</p></div>`,

  80: `<div class="math-section"><h3>Convergence Study</h3>
<p>Halve grid spacing h, halve time step dt (to maintain CFL).
If the O(h²) convergence rate holds, the solution error halves with each refinement.</p></div>`,

  81: `<div class="math-section"><h3>Anisotropic Diffusion</h3>
<p>Replace the scalar Du, Dv with 2×2 diffusion tensors D:
$$\\nabla \\cdot (D \\nabla u)$$
This allows directional diffusion — patterns oriented along a preferred axis.</p></div>`,

  82: `<div class="math-section"><h3>Stochastic Noise</h3>
<p>Adding Gaussian noise to U each step: $U \\leftarrow U + \\epsilon \\cdot \\mathcal{N}(0,1)$.
Small noise (ε=0.001) breaks symmetry and accelerates pattern formation.
Large noise disrupts existing patterns.</p></div>`,

  83: `<div class="math-section"><h3>Spatially Varying Parameters</h3>
<p>Store f(x,y) and k(x,y) as textures. The simulation shader samples these textures
alongside the state texture, allowing gradients and boundaries in parameter space.</p></div>`,

  84: `<div class="math-section"><h3>Multi-Scale Coupling</h3>
<p>Run a coarse and fine grid simultaneously. Coarse grid drives slow large-scale dynamics;
fine grid captures small-scale pattern detail. Downsampling/upsampling links the scales.</p></div>`,

  85: `<div class="math-section"><h3>3D Reaction-Diffusion</h3>
<p>Extend to 3D: store U(x,y,z) in a 3D texture. The Laplacian has 6 cardinal neighbours.
Patterns in 3D include: tubes, sheets, spherical shells, and gyroid-like structures.</p></div>`,

  86: `<div class="math-section"><h3>Surface Displacement</h3>
<p>Map U(x,y) from the simulation to vertex heights of a Three.js PlaneGeometry.
High U (food) → flat; low U (pattern) → raised. Creates a "chemical landscape".</p></div>`,

  87: `<div class="math-section"><h3>Turing Instability: Linear Analysis</h3>
<p>Linearize around the homogeneous steady state (u*, v*). Write u = u* + ũe^{iqx+σt}.
The growth rate σ(q) determines which wavenumbers q are unstable.
Instability occurs when Re(σ) > 0 for some q ≠ 0.</p></div>`,

  88: `<div class="math-section"><h3>Dispersion Relation</h3>
<p>The dispersion relation σ(q²) is a polynomial whose roots give the growth rates.
The wavenumber q* that grows fastest determines the pattern wavelength:
$$\\lambda^* = \\frac{2\\pi}{q^*}$$</p></div>`,

  89: `<div class="math-section"><h3>Sensitivity to Initial Conditions</h3>
<p>Turing patterns are attractors — the final pattern is insensitive to ICs.
But the nucleation process (which spots form first) is sensitive.
Two runs with slightly different noise give different but statistically identical patterns.</p></div>`,

  90: `<div class="math-section"><h3>Two-Layer Coupling</h3>
<p>Run two independent Gray-Scott systems and weakly couple them:
u₁ is influenced by u₂ and vice versa. The coupled system can produce
patterns impossible in a single layer.</p></div>`,

  91: `<div class="math-section"><h3>WebGL Performance</h3>
<p>Key optimizations: minimize GL state changes, reuse buffers, avoid unnecessary uploads.
Pre-allocate all textures. Use requestAnimationFrame, not setInterval.
Profile with chrome://tracing.</p></div>`,

  92: `<div class="math-section"><h3>Sub-Stepping Analysis</h3>
<p>The GPU is often underutilized at 1 step per frame. Sub-stepping runs
N simulation passes before rendering, maximizing GPU utilization.
Monitor with Stats.js — target &lt;16ms per frame total.</p></div>`,

  93: `<div class="math-section"><h3>Web Workers</h3>
<p>Web Workers run JavaScript in a separate thread, keeping the main thread free
for UI. The CPU simulation runs in a Worker; results are transfered via SharedArrayBuffer.</p></div>`,

  94: `<div class="math-section"><h3>Responsive Canvas</h3>
<p>On resize: update renderer.setSize(), update uniforms, preserve simulation state.
DPR (device pixel ratio) affects visual quality — high-DPR screens may need
a reduced simulation resolution to maintain 60fps.</p></div>`,

  95: `<div class="math-section"><h3>URL Hash Navigation</h3>
<p>window.location.hash = '#42' sets the URL without a page reload.
On load, parse the hash to restore the user's last-visited step.
Share a URL to send someone directly to any step.</p></div>`,

  96: `<div class="math-section"><h3>localStorage Persistence</h3>
<p>localStorage.setItem('gs-step', index) persists progress across sessions.
Read on startup to resume where the user left off.
~5KB budget for step index + UI state.</p></div>`,

  97: `<div class="math-section"><h3>Vite Production Build</h3>
<p>vite build produces: index.html + hashed JS bundle + hashed CSS.
Asset hashing ensures CDN caches are invalidated on updates.
Total bundle: ~150KB gzipped (Three.js dominates).</p></div>`,

  98: `<div class="math-section"><h3>Cloudflare Pages Deployment</h3>
<p>Push to main branch → GitHub Actions runs npm run build → wrangler pages deploy dist.
Cloudflare CDN serves from edge locations globally. Zero cold-start time (static files).
Custom domain via CNAME record in Cloudflare DNS.</p></div>`,

  99: `<div class="math-section"><h3>Performance Audit</h3>
<p>Lighthouse performance audit targets: FCP &lt;1s, TTI &lt;2s, CLS=0.
WebGL diagnostic: check renderer.info.memory for texture/geometry counts.
Set gl.getError() checks during development to catch GL errors early.</p></div>`,

  100: `<div class="math-section"><h3>Final Synthesis</h3>
<p>You now understand the complete Gray-Scott system — from the PDE derivation,
through numerical discretization, GPU acceleration, visualization, and deployment.
The simulation in the right column is the fully-featured implementation:
all parameters controllable, mouse seeding active, Stats.js monitoring performance.</p>
<p>Explore the parameter space. Every (f,k) pair in the pattern-forming region
produces a unique, beautiful structure. None of it is programmed — it all
emerges from two simple equations.</p></div>`,
}

const codeContent = (n) => `<div class="code-section"><h3>Step ${n} Code</h3>
<pre><code class="language-js">// See the source files for this step's implementation.
// Key files:
//   src/gpu/GPUSim.js      — GPU simulation pipeline
//   src/gpu/SimShader.js   — Gray-Scott GLSL compute shader
//   src/gpu/VizShader.js   — Visualization modes
//   src/gpu/PingPong.js    — Double-buffer FBO pair
//   src/cpu/Integrator.js  — CPU reference implementation
//   src/presets/parameters.js — Named parameter presets
</code></pre></div>`

// Generate step files
for (const s of steps) {
  const { n, ch, dir, title, preset, viz, gpu } = s

  // Create directory
  mkdirSync(join(__dirname, dir), { recursive: true })

  const content = `/**
 * Step ${n}: ${title}
 */
${gpu ? `import { startGPULoop } from '../../utils/gpuLoop.js'
import { PRESETS } from '../../presets/parameters.js'` : ''}

export default {
  title: '${title}',
  chapter: ${ch},

  math: \`${(mathContent[n] || `<div class="math-section"><h3>Step ${n}</h3><p>${title}</p></div>`).replace(/`/g, '\\`')}\`,

  code: \`${codeContent(n).replace(/`/g, '\\`')}\`,

  init(container, state) {
    ${gpu ? `return startGPULoop(container, {
      params: { ...PRESETS['${preset}'] },
      size: 256,
      stepsPerFrame: 8,
      vizMode: '${viz}',
    })` : `const div = document.createElement('div')
    div.style.cssText = 'padding:20px; font-family:SF Mono,monospace; font-size:10pt; overflow-y:auto; height:100%'
    div.innerHTML = '<pre style="border:none;background:none">Step ${n}: ${title.replace(/'/g, "\\'")}</pre>'
    container.appendChild(div)
    return () => { container.innerHTML = '' }`}
  }
}
`
  writeFileSync(join(__dirname, dir, `step${String(n).padStart(3, '0')}.js`), content)
  process.stdout.write(`Generated step ${n}\n`)
}

console.log('Done: generated', steps.length, 'step files')
