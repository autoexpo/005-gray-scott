import{a as e,c as t,d as n,f as r,i,l as a,n as o,o as s,r as c,s as l,t as u,u as d}from"./parameters-Lm_51_Zf.js";import{t as f}from"./index-DZsyYT-_.js";var p=r(c(),1),m={title:`3D Surface: Vertex Displacement`,chapter:8,math:`<div class="math-section"><h3>3D Surface Displacement</h3>
<p>Map U(x,y) to vertex height Z in a Three.js PlaneGeometry.</p>
<div class="math-block">$$z(x,y) = A \\cdot (1 - U(x,y))$$</div>
<p>Regions of high V (low U) — the pattern — are elevated; the background (high U) is flat.
This creates a "chemical landscape" that evolves in real time.</p>
</div>
<div class="math-section"><h3>GPU Readback</h3>
<p>To displace vertices on the CPU, we must read back the simulation texture from the GPU.
renderer.readRenderTargetPixels() downloads the float data each frame — expensive but manageable for 64×64.</p>
<p>Alternative: use a vertex shader that samples the simulation texture directly (no readback needed).
This keeps everything on the GPU.</p>
</div>`,code:`<div class="code-section"><h3>Vertex Displacement</h3>
<pre><code class="language-js">// After each sim step, update mesh vertices:
const pixels = new Float32Array(res * res * 4)
renderer.readRenderTargetPixels(sim.pp.read, 0, 0, res, res, pixels)

const pos = geometry.attributes.position
for (let i = 0; i < res * res; i++) {
  const u = pixels[i * 4]    // R channel = u
  pos.setZ(i, (1 - u) * 30)  // height = 30 * (1-u)
}
pos.needsUpdate = true
geometry.computeVertexNormals()
</code></pre></div>`,init(r,c){let m=new i({antialias:!0,preserveDrawingBuffer:!0});m.setPixelRatio(window.devicePixelRatio),m.setSize(r.clientWidth,r.clientHeight),r.appendChild(m.domElement);let h=new p.default;h.dom.style.cssText=`position:absolute;top:4px;left:4px;`,r.appendChild(h.dom),r.style.position=`relative`;let g=new n,_=new a(45,r.clientWidth/r.clientHeight,.1,500);_.position.set(0,-120,80),_.lookAt(0,0,0);let v=new d(100,100,63,63),y=new t({wireframe:!1,side:2}),b=new l(v,y);g.add(b),g.add(new e(16777215,.5));let x=new s(16777215,1);x.position.set(50,50,100),g.add(x);let S=new o(m,64,`5pt`),C={...u.spots};S.reset(C);let w=new Float32Array(4096*4),T=f.create(r).addFolder(`Params`);T.add(C,`f`,.01,.12,.001),T.add(C,`k`,.04,.075,.001),T.open();let E=new ResizeObserver(()=>{m.setSize(r.clientWidth,r.clientHeight),_.aspect=r.clientWidth/r.clientHeight,_.updateProjectionMatrix()});E.observe(r);let D,O=0,k=()=>{D=requestAnimationFrame(k),h.begin(),S.step(C,4),m.readRenderTargetPixels(S.pp.read,0,0,64,64,w);let e=v.attributes.position;for(let t=0;t<4096;t++){let n=w[t*4];e.setZ(t,(1-n)*25)}e.needsUpdate=!0,v.computeVertexNormals(),b.rotation.z=O*.001,O++,m.setRenderTarget(null),m.render(g,_),h.end()};return k(),()=>{cancelAnimationFrame(D),E.disconnect(),S.dispose(),v.dispose(),y.dispose(),m.dispose(),r.innerHTML=``}}};export{m as default};