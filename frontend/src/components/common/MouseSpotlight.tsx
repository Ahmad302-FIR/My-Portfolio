import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface WebNodeDef {
  baseX: number;
  baseY: number;
  radius: number;
  colorType: 'cyan' | 'teal' | 'violet';
  spring: number;
  lag: number;
  freq: number;
  phase: number;
}

interface WebStrandDef {
  from: number;
  to: number;
  colorType: 'cyan' | 'teal' | 'violet';
}

// 11 nodes defining the organic spider-web / neural mesh structure
const WEB_NODES: WebNodeDef[] = [
  // 0: Center anchor node
  { baseX: 0, baseY: 0, radius: 2.2, colorType: 'cyan', spring: 0.22, lag: 0.0, freq: 0.8, phase: 0 },
  // Inner ring (4 nodes)
  { baseX: 25, baseY: 7, radius: 1.8, colorType: 'cyan', spring: 0.17, lag: 0.05, freq: 1.1, phase: 0.5 },
  { baseX: -8, baseY: 29, radius: 1.8, colorType: 'teal', spring: 0.16, lag: 0.06, freq: 0.9, phase: 1.8 },
  { baseX: -27, baseY: -7, radius: 1.8, colorType: 'violet', spring: 0.17, lag: 0.05, freq: 1.2, phase: 3.1 },
  { baseX: 8, baseY: -31, radius: 1.8, colorType: 'cyan', spring: 0.16, lag: 0.06, freq: 1.0, phase: 4.4 },
  // Outer ring (6 nodes)
  { baseX: 58, baseY: 0, radius: 2.0, colorType: 'teal', spring: 0.12, lag: 0.12, freq: 0.7, phase: 1.2 },
  { baseX: 30, baseY: 56, radius: 2.0, colorType: 'cyan', spring: 0.11, lag: 0.13, freq: 0.8, phase: 2.5 },
  { baseX: -36, baseY: 43, radius: 2.0, colorType: 'violet', spring: 0.12, lag: 0.11, freq: 0.9, phase: 3.7 },
  { baseX: -65, baseY: -9, radius: 2.0, colorType: 'teal', spring: 0.11, lag: 0.14, freq: 0.7, phase: 5.0 },
  { baseX: -21, baseY: -56, radius: 2.0, colorType: 'cyan', spring: 0.12, lag: 0.12, freq: 0.8, phase: 0.9 },
  { baseX: 44, baseY: -44, radius: 2.0, colorType: 'violet', spring: 0.11, lag: 0.13, freq: 0.9, phase: 2.1 },
];

// Connecting lines forming the web: radials, inner ring, outer ring, and cross-braces
const WEB_STRANDS: WebStrandDef[] = [
  // Radials from center
  { from: 0, to: 1, colorType: 'cyan' },
  { from: 0, to: 2, colorType: 'teal' },
  { from: 0, to: 3, colorType: 'violet' },
  { from: 0, to: 4, colorType: 'cyan' },
  // Radials from inner to outer
  { from: 1, to: 5, colorType: 'teal' },
  { from: 1, to: 6, colorType: 'cyan' },
  { from: 2, to: 6, colorType: 'cyan' },
  { from: 2, to: 7, colorType: 'violet' },
  { from: 3, to: 7, colorType: 'violet' },
  { from: 3, to: 8, colorType: 'teal' },
  { from: 3, to: 9, colorType: 'cyan' },
  { from: 4, to: 9, colorType: 'cyan' },
  { from: 4, to: 10, colorType: 'violet' },
  { from: 4, to: 5, colorType: 'teal' },
  // Inner ring
  { from: 1, to: 2, colorType: 'cyan' },
  { from: 2, to: 3, colorType: 'teal' },
  { from: 3, to: 4, colorType: 'violet' },
  { from: 4, to: 1, colorType: 'cyan' },
  // Outer ring
  { from: 5, to: 6, colorType: 'teal' },
  { from: 6, to: 7, colorType: 'violet' },
  { from: 7, to: 8, colorType: 'teal' },
  { from: 8, to: 9, colorType: 'cyan' },
  { from: 9, to: 10, colorType: 'violet' },
  { from: 10, to: 5, colorType: 'cyan' },
  // Diagonal cross-web threads
  { from: 1, to: 10, colorType: 'violet' },
  { from: 2, to: 8, colorType: 'teal' },
];

export default function MouseSpotlight() {
  const svgRef = useRef<SVGSVGElement>(null);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const circleRefs = useRef<(SVGCircleElement | null)[]>([]);

  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // Only enable on desktop with fine pointer and hover support, and without reduced motion
    const pointerFineQuery = window.matchMedia('(pointer: fine) and (hover: hover)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const checkSupport = () => {
      const isDesktop = pointerFineQuery.matches;
      const isReduced = reducedMotionQuery.matches;
      setIsEnabled(isDesktop && !isReduced);
    };

    checkSupport();

    pointerFineQuery.addEventListener('change', checkSupport);
    reducedMotionQuery.addEventListener('change', checkSupport);

    return () => {
      pointerFineQuery.removeEventListener('change', checkSupport);
      reducedMotionQuery.removeEventListener('change', checkSupport);
    };
  }, []);

  useEffect(() => {
    if (!isEnabled) return;

    // Simulation state
    let targetX = -1000;
    let targetY = -1000;
    let prevMouseX = -1000;
    let prevMouseY = -1000;
    let velocityX = 0;
    let velocityY = 0;

    let targetScale = 1.0;
    let currentScale = 1.0;

    let isVisible = false;
    let rafId: number;
    let startTime = performance.now();

    // Node live positions
    const nodePositions = WEB_NODES.map(() => ({ x: -1000, y: -1000 }));

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (prevMouseX !== -1000) {
        velocityX = (targetX - prevMouseX) * 0.4;
        velocityY = (targetY - prevMouseY) * 0.4;
      }
      prevMouseX = targetX;
      prevMouseY = targetY;

      // Check if a modal is open in the DOM
      const hasOpenModal = Boolean(
        document.querySelector('[role="dialog"], .fixed.z-50.inset-0')
      );

      if (hasOpenModal) {
        if (isVisible) {
          isVisible = false;
          if (svgRef.current) svgRef.current.style.opacity = '0';
        }
        return;
      }

      if (!isVisible) {
        isVisible = true;
        // Snap center on first reveal
        nodePositions.forEach((pos, idx) => {
          pos.x = targetX + WEB_NODES[idx].baseX;
          pos.y = targetY + WEB_NODES[idx].baseY;
        });
        if (svgRef.current) svgRef.current.style.opacity = '1';
      }

      // Check target element
      const target = e.target as HTMLElement | null;
      if (target) {
        // Form field: reduce opacity slightly for optimal readability
        const isFormField = Boolean(target.closest('input, textarea, select'));

        // Interactive element: subtle web contraction
        const isInteractive = Boolean(
          target.closest('a, button, [role="button"], [data-cursor-interactive], .interactive-hover')
        );

        targetScale = isInteractive ? 0.84 : 1.0;

        if (svgRef.current) {
          svgRef.current.style.opacity = isFormField ? '0.4' : '1';
        }
      }
    };

    const handleMouseLeave = () => {
      isVisible = false;
      if (svgRef.current) svgRef.current.style.opacity = '0';
    };

    const handleMouseEnter = () => {
      const hasOpenModal = Boolean(
        document.querySelector('[role="dialog"], .fixed.z-50.inset-0')
      );
      if (!hasOpenModal) {
        isVisible = true;
        if (svgRef.current) svgRef.current.style.opacity = '1';
      }
    };

    const handleScroll = () => {
      // When scrolling, check if a modal was opened or closed
      const hasOpenModal = Boolean(
        document.querySelector('[role="dialog"], .fixed.z-50.inset-0')
      );
      if (hasOpenModal && isVisible) {
        isVisible = false;
        if (svgRef.current) svgRef.current.style.opacity = '0';
      }
    };

    const animate = (time: number) => {
      const elapsed = (time - startTime) * 0.001;

      // Dampen velocity smoothly
      velocityX *= 0.88;
      velocityY *= 0.88;

      // Smooth scale transition on hover
      currentScale += (targetScale - currentScale) * 0.15;

      // Update Center Node 0
      nodePositions[0].x += (targetX - nodePositions[0].x) * WEB_NODES[0].spring;
      nodePositions[0].y += (targetY - nodePositions[0].y) * WEB_NODES[0].spring;

      // Update Surrounding Nodes (1 to 10)
      for (let i = 1; i < WEB_NODES.length; i++) {
        const def = WEB_NODES[i];

        // Micro organic oscillation when moving or stationary
        const organicX = Math.sin(elapsed * def.freq * 2.0 + def.phase) * 1.5;
        const organicY = Math.cos(elapsed * def.freq * 1.8 + def.phase) * 1.5;

        // Desired position = center + scaled base offset + organic float - velocity lag
        const desiredX =
          nodePositions[0].x +
          def.baseX * currentScale +
          organicX -
          velocityX * def.lag * 3.5;
        const desiredY =
          nodePositions[0].y +
          def.baseY * currentScale +
          organicY -
          velocityY * def.lag * 3.5;

        // Spring ease towards desired position
        nodePositions[i].x += (desiredX - nodePositions[i].x) * def.spring;
        nodePositions[i].y += (desiredY - nodePositions[i].y) * def.spring;
      }

      // Update DOM SVG elements directly
      if (isVisible) {
        // Update lines
        for (let k = 0; k < WEB_STRANDS.length; k++) {
          const strand = WEB_STRANDS[k];
          const lineEl = lineRefs.current[k];
          if (lineEl) {
            lineEl.setAttribute('x1', nodePositions[strand.from].x.toFixed(1));
            lineEl.setAttribute('y1', nodePositions[strand.from].y.toFixed(1));
            lineEl.setAttribute('x2', nodePositions[strand.to].x.toFixed(1));
            lineEl.setAttribute('y2', nodePositions[strand.to].y.toFixed(1));
          }
        }

        // Update node circles
        for (let j = 0; j < WEB_NODES.length; j++) {
          const circleEl = circleRefs.current[j];
          if (circleEl) {
            circleEl.setAttribute('cx', nodePositions[j].x.toFixed(1));
            circleEl.setAttribute('cy', nodePositions[j].y.toFixed(1));
          }
        }
      }

      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(rafId);
    };
  }, [isEnabled]);

  if (!isEnabled) return null;

  // Colors based on light vs dark theme
  const colors = {
    cyan: isLight ? 'rgba(8, 145, 178, 0.42)' : 'rgba(34, 211, 238, 0.32)',
    teal: isLight ? 'rgba(13, 148, 136, 0.38)' : 'rgba(45, 212, 191, 0.26)',
    violet: isLight ? 'rgba(124, 58, 237, 0.35)' : 'rgba(167, 139, 250, 0.28)',
    nodeCyan: isLight ? '#0891B2' : '#22D3EE',
    nodeTeal: isLight ? '#0D9488' : '#2DD4BF',
    nodeViolet: isLight ? '#7C3AED' : '#A78BFA',
  };

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-20 h-full w-full opacity-0 transition-opacity duration-300 ease-out"
      style={{ willChange: 'opacity' }}
    >
      <defs>
        <filter id="spiderweb-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor={isLight ? '#0891B2' : '#22D3EE'} floodOpacity="0.25" />
        </filter>
      </defs>

      <g filter="url(#spiderweb-glow)">
        {/* Connecting web lines */}
        {WEB_STRANDS.map((strand, idx) => (
          <line
            key={`strand-${idx}`}
            ref={(el) => {
              lineRefs.current[idx] = el;
            }}
            x1="-1000"
            y1="-1000"
            x2="-1000"
            y2="-1000"
            stroke={colors[strand.colorType]}
            strokeWidth="0.85"
            strokeLinecap="round"
          />
        ))}

        {/* Small node dots */}
        {WEB_NODES.map((node, idx) => {
          const fillColor =
            node.colorType === 'cyan'
              ? colors.nodeCyan
              : node.colorType === 'teal'
              ? colors.nodeTeal
              : colors.nodeViolet;
          return (
            <circle
              key={`node-${idx}`}
              ref={(el) => {
                circleRefs.current[idx] = el;
              }}
              cx="-1000"
              cy="-1000"
              r={node.radius}
              fill={fillColor}
              fillOpacity={idx === 0 ? 0.85 : 0.65}
            />
          );
        })}
      </g>
    </svg>
  );
}
