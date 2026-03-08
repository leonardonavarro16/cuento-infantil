'use client';

import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle, Transform, Vec3, Camera } from 'ogl';

type MetaBallsProps = {
  color?: string;
  speed?: number;
  enableMouseInteraction?: boolean;
  hoverSmoothness?: number;
  animationSize?: number;
  ballCount?: number;
  clumpFactor?: number;
  cursorBallSize?: number;
  cursorBallColor?: string;
  enableTransparency?: boolean;
  style?: React.CSSProperties;
};

function parseHexColor(hex: string): [number, number, number] {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;
  return [r, g, b];
}

function fract(x: number): number {
  return x - Math.floor(x);
}

function hash31(p: number): number[] {
  const r = [p * 0.1031, p * 0.103, p * 0.0973].map(fract);
  const r_yzx = [r[1], r[2], r[0]];
  const dotVal = r[0] * (r_yzx[0] + 33.33) + r[1] * (r_yzx[1] + 33.33) + r[2] * (r_yzx[2] + 33.33);
  for (let i = 0; i < 3; i++) r[i] = fract(r[i] + dotVal);
  return r;
}

function hash33(v: number[]): number[] {
  const p = [v[0] * 0.1031, v[1] * 0.103, v[2] * 0.0973].map(fract);
  const p_yxz = [p[1], p[0], p[2]];
  const dotVal = p[0] * (p_yxz[0] + 33.33) + p[1] * (p_yxz[1] + 33.33) + p[2] * (p_yxz[2] + 33.33);
  for (let i = 0; i < 3; i++) p[i] = fract(p[i] + dotVal);
  const p_xxy = [p[0], p[0], p[1]];
  const p_yxx = [p[1], p[0], p[0]];
  const p_zyx = [p[2], p[1], p[0]];
  return [0, 1, 2].map(i => fract((p_xxy[i] + p_yxx[i]) * p_zyx[i]));
}

const vertex = `#version 300 es
precision highp float;
layout(location = 0) in vec2 position;
void main() {
    gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
uniform vec3 iResolution;
uniform float iTime;
uniform vec3 iMouse;
uniform vec3 iColor;
uniform vec3 iCursorColor;
uniform float iAnimationSize;
uniform int iBallCount;
uniform float iCursorBallSize;
uniform vec3 iMetaBalls[50];
uniform float iClumpFactor;
uniform bool enableTransparency;
out vec4 outColor;

// ── Ruido para bordes tipo nube ──
float hash(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++) {
        v += amp * noise(p);
        p *= 2.1;
        amp *= 0.48;
    }
    return v;
}

float getMetaBallValue(vec2 c, float r, vec2 p) {
    vec2 d = p - c;
    float dist2 = dot(d, d);
    return (r * r) / dist2;
}

void main() {
    vec2 fc = gl_FragCoord.xy;
    float scale = iAnimationSize / iResolution.y;
    vec2 coord = (fc - iResolution.xy * 0.5) * scale;
    vec2 mouseW = (iMouse.xy - iResolution.xy * 0.5) * scale;

    // Ruido animado que distorsiona la forma
    float n = fbm(coord * 0.45 + iTime * 0.08);
    vec2 distort = coord + vec2(
        fbm(coord * 0.5 + vec2(iTime * 0.06, 1.7)),
        fbm(coord * 0.5 + vec2(3.2, iTime * 0.05))
    ) * 1.4;

    float m1 = 0.0;
    for (int i = 0; i < 50; i++) {
        if (i >= iBallCount) break;
        m1 += getMetaBallValue(iMetaBalls[i].xy, iMetaBalls[i].z, distort);
    }
    float m2 = getMetaBallValue(mouseW, iCursorBallSize, distort);
    float total = m1 + m2;

    // Umbral más bajo + ruido en el borde → aspecto de nube esponjosa
    float threshold = 0.9 + n * 0.25;
    float edge = total / threshold;
    float f = smoothstep(0.0, 1.0, edge - 0.6) * smoothstep(1.8, 0.85, edge * (1.0 - n * 0.15));

    // Variación interna de luminosidad (interior más brillante)
    float inner = smoothstep(0.0, 1.0, (total - threshold) * 0.6 + n * 0.3);

    vec3 cFinal = vec3(0.0);
    if (total > 0.0) {
        float alpha1 = m1 / total;
        float alpha2 = m2 / total;
        vec3 base = iColor * alpha1 + iCursorColor * alpha2;
        cFinal = mix(base * 0.75, base * 1.15 + 0.08, inner);
    }

    outColor = vec4(cFinal * f, enableTransparency ? f : 1.0);
}
`;

type BallParams = {
  st: number;
  dtFactor: number;
  baseScale: number;
  toggle: number;
  radius: number;
};

export default function MetaBalls({
  color = '#ffffff',
  speed = 0.3,
  enableMouseInteraction = true,
  hoverSmoothness = 0.05,
  animationSize = 30,
  ballCount = 15,
  clumpFactor = 1,
  cursorBallSize = 3,
  cursorBallColor = '#ffffff',
  enableTransparency = false,
  style,
}: MetaBallsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const dpr = 1;
    const renderer = new Renderer({ dpr, alpha: true, premultipliedAlpha: false });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, enableTransparency ? 0 : 1);
    container.appendChild(gl.canvas);

    const camera = new Camera(gl, { left: -1, right: 1, top: 1, bottom: -1, near: 0.1, far: 10 });
    camera.position.z = 1;

    const geometry = new Triangle(gl);
    const [r1, g1, b1] = parseHexColor(color);
    const [r2, g2, b2] = parseHexColor(cursorBallColor);

    const metaBallsUniform: Vec3[] = [];
    for (let i = 0; i < 50; i++) metaBallsUniform.push(new Vec3(0, 0, 0));

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iTime:           { value: 0 },
        iResolution:     { value: new Vec3(0, 0, 0) },
        iMouse:          { value: new Vec3(0, 0, 0) },
        iColor:          { value: new Vec3(r1, g1, b1) },
        iCursorColor:    { value: new Vec3(r2, g2, b2) },
        iAnimationSize:  { value: animationSize },
        iBallCount:      { value: ballCount },
        iCursorBallSize: { value: cursorBallSize },
        iMetaBalls:      { value: metaBallsUniform },
        iClumpFactor:    { value: clumpFactor },
        enableTransparency: { value: enableTransparency },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    const scene = new Transform();
    mesh.setParent(scene);

    const effectiveBallCount = Math.min(ballCount, 50);
    const ballParams: BallParams[] = [];
    for (let i = 0; i < effectiveBallCount; i++) {
      const idx = i + 1;
      const h1 = hash31(idx);
      const st = h1[0] * (2 * Math.PI);
      const dtFactor = 0.1 * Math.PI + h1[1] * (0.4 * Math.PI - 0.1 * Math.PI);
      const baseScale = 5.0 + h1[1] * (10.0 - 5.0);
      const h2 = hash33(h1);
      const toggle = Math.floor(h2[0] * 2.0);
      const radiusVal = 0.5 + h2[2] * (2.0 - 0.5);
      ballParams.push({ st, dtFactor, baseScale, toggle, radius: radiusVal });
    }

    const mouseBallPos = { x: 0, y: 0 };
    let pointerInside = false;
    let pointerX = 0;
    let pointerY = 0;

    function resize() {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width * dpr, height * dpr);
      gl.canvas.style.width = `${width}px`;
      gl.canvas.style.height = `${height}px`;
      program.uniforms.iResolution.value.set(gl.canvas.width, gl.canvas.height, 0);
    }
    window.addEventListener('resize', resize);
    resize();

    function onPointerMove(e: PointerEvent) {
      if (!enableMouseInteraction || !container) return;
      const rect = container.getBoundingClientRect();
      pointerX = ((e.clientX - rect.left) / rect.width) * gl.canvas.width;
      pointerY = (1 - (e.clientY - rect.top) / rect.height) * gl.canvas.height;
    }
    function onPointerEnter() { if (enableMouseInteraction) pointerInside = true; }
    function onPointerLeave() { if (enableMouseInteraction) pointerInside = false; }

    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerenter', onPointerEnter);
    container.addEventListener('pointerleave', onPointerLeave);

    const startTime = performance.now();
    let rafId: number;

    function update(t: number) {
      rafId = requestAnimationFrame(update);
      const elapsed = (t - startTime) * 0.001;
      program.uniforms.iTime.value = elapsed;

      for (let i = 0; i < effectiveBallCount; i++) {
        const p = ballParams[i];
        const dt = elapsed * speed * p.dtFactor;
        const th = p.st + dt;
        metaBallsUniform[i].set(
          Math.cos(th) * p.baseScale * clumpFactor,
          Math.sin(th + dt * p.toggle) * p.baseScale * clumpFactor,
          p.radius
        );
      }

      let targetX: number, targetY: number;
      if (pointerInside) {
        targetX = pointerX;
        targetY = pointerY;
      } else {
        const cx = gl.canvas.width * 0.5;
        const cy = gl.canvas.height * 0.5;
        targetX = cx + Math.cos(elapsed * speed) * (gl.canvas.width * 0.15);
        targetY = cy + Math.sin(elapsed * speed) * (gl.canvas.height * 0.15);
      }
      mouseBallPos.x += (targetX - mouseBallPos.x) * hoverSmoothness;
      mouseBallPos.y += (targetY - mouseBallPos.y) * hoverSmoothness;
      program.uniforms.iMouse.value.set(mouseBallPos.x, mouseBallPos.y, 0);

      renderer.render({ scene, camera });
    }
    rafId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerenter', onPointerEnter);
      container.removeEventListener('pointerleave', onPointerLeave);
      if (container.contains(gl.canvas)) container.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [color, cursorBallColor, speed, enableMouseInteraction, hoverSmoothness, animationSize, ballCount, clumpFactor, cursorBallSize, enableTransparency]);

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', ...style }}
    />
  );
}
