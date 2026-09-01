/**
 * Precept — Native Interactive Engine
 * 100% Standalone, Zero Framer Runtime Dependencies
 */

document.addEventListener("DOMContentLoaded", () => {
    // =========================================================================
    // 1. SMOOTH SCROLLING (Lenis)
    // =========================================================================
    let lenis;
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
            infinite: false
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // =========================================================================
    // 2. HERO SECTION ANIMATIONS (Entrance Stagger, Mouse Glow & Scroll Converge)
    // =========================================================================
    const heroSection = document.getElementById('hero-section');
    if (heroSection) {
        // --- 2A. Letter Stagger Entrance on Page Load ---
        const letters = heroSection.querySelectorAll('h1 span span span');
        letters.forEach((letter, idx) => {
            letter.classList.add('hero-letter');
            letter.style.opacity = '0';
            letter.style.filter = 'blur(12px)';
            letter.style.transform = 'translateY(36px)';
            letter.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            
            setTimeout(() => {
                letter.style.opacity = '1';
                letter.style.filter = 'blur(0px)';
                letter.style.transform = 'translateY(0px)';
            }, 200 + idx * 65);
        });

        // --- 2B. Scroll Animation: "BUILD" and "BETTER" Move Closer Together ---
        const buildWrap = heroSection.querySelector('.framer-1chkusm');
        const betterWrap = heroSection.querySelector('.framer-1ectg7p');

        function updateHeroScroll() {
            // Replicate exact Framer scroll mapping
            const progress = Math.max(0, window.scrollY / (window.innerHeight || 900));
            const shift = Math.min(200, progress * 200); 

            if (buildWrap) {
                buildWrap.style.transform = `translateX(${shift.toFixed(1)}px)`;
            }
            if (betterWrap) {
                betterWrap.style.transform = `translateX(${-shift.toFixed(1)}px)`;
            }
        }

        window.addEventListener('scroll', updateHeroScroll, { passive: true });
        if (lenis) lenis.on('scroll', updateHeroScroll);

        // --- 2C. Mouse-Following DotReveal Glow Canvas (Full-Bleed Responsive) ---
        const heroCanvas = heroSection.querySelector('.framer-rjmmn8-container canvas') || heroSection.querySelector('canvas');
        if (heroCanvas) {
            const ctx = heroCanvas.getContext('2d');
            if (ctx) {
                const spacing = 16;
                const dotSize = 1.5;
                const baseOpacity = 0.11;
                const radius = 160;
                const maxRevealOpacity = 0.90;
                const smoothing = 0.4;
                const springC = 0.06 + (1 - Math.min(Math.max(smoothing, 0), 1)) * 0.34; // 0.264

                let targetX = -9999, targetY = -9999;
                let kx = -9999, ky = -9999;
                let ox = -9999, oy = -9999;
                let isMouseInside = false;
                let intensity = 0;

                function resizeHeroCanvas() {
                    const w = window.innerWidth;
                    const h = heroSection.offsetHeight || window.innerHeight;
                    if (heroCanvas.width !== w || heroCanvas.height !== h) {
                        heroCanvas.width = w;
                        heroCanvas.height = h;
                    }
                    heroCanvas.style.width = '100vw';
                    heroCanvas.style.height = '100%';
                    heroCanvas.style.position = 'absolute';
                    heroCanvas.style.top = '0';
                    heroCanvas.style.left = '0';
                }

                window.addEventListener('resize', resizeHeroCanvas, { passive: true });
                window.addEventListener('orientationchange', resizeHeroCanvas, { passive: true });
                window.addEventListener('load', resizeHeroCanvas, { passive: true });
                resizeHeroCanvas();

                heroSection.addEventListener('mousemove', (e) => {
                    const rect = heroSection.getBoundingClientRect();
                    targetX = e.clientX - rect.left;
                    targetY = e.clientY - rect.top;
                    if (!isMouseInside) {
                        kx = targetX; ky = targetY;
                        ox = targetX; oy = targetY;
                    }
                    isMouseInside = true;
                }, { passive: true });

                heroSection.addEventListener('mouseenter', () => { isMouseInside = true; });
                heroSection.addEventListener('mouseleave', () => { isMouseInside = false; });

                window.addEventListener('mousemove', (e) => {
                    const rect = heroSection.getBoundingClientRect();
                    if (e.clientY >= rect.top && e.clientY <= rect.bottom && e.clientX >= rect.left && e.clientX <= rect.right) {
                        targetX = e.clientX - rect.left;
                        targetY = e.clientY - rect.top;
                        if (!isMouseInside) {
                            kx = targetX; ky = targetY;
                            ox = targetX; oy = targetY;
                        }
                        isMouseInside = true;
                    } else if (isMouseInside && (e.clientY < rect.top || e.clientY > rect.bottom)) {
                        isMouseInside = false;
                    }
                }, { passive: true });

                function renderHeroGlow() {
                    // Always read dynamic dimensions
                    const w = heroCanvas.width || window.innerWidth;
                    const h = heroCanvas.height || heroSection.offsetHeight || window.innerHeight;

                    const targetIntensity = isMouseInside ? 1 : 0;
                    intensity += (targetIntensity - intensity) * 0.15;

                    kx += (targetX - kx) * springC;
                    ky += (targetY - ky) * springC;
                    ox += (kx - ox) * springC;
                    oy += (ky - oy) * springC;

                    ctx.clearRect(0, 0, w, h);

                    const cols = Math.ceil(w / spacing);
                    const rows = Math.ceil(h / spacing);
                    const offsetX = (w - cols * spacing) / 2 + spacing / 2;
                    const offsetY = (h - rows * spacing) / 2 + spacing / 2;
                    const halfDot = dotSize / 2;

                    // Draw full-bleed base dots and cursor-illuminated dots across the ENTIRE viewport width and height
                    for (let r = -2; r <= rows + 2; r++) {
                        const y = offsetY + r * spacing;
                        const dy = y - oy;

                        for (let c = -2; c <= cols + 2; c++) {
                            const x = offsetX + c * spacing;
                            const dx = x - ox;
                            const dist = Math.sqrt(dx * dx + dy * dy);

                            let alpha = baseOpacity;
                            if (intensity > 0.005 && dist < radius) {
                                const factor = 1 - (dist / radius);
                                const glow = factor * factor * (3 - 2 * factor) * maxRevealOpacity * intensity;
                                alpha = Math.min(1, baseOpacity + glow);
                            }

                            ctx.fillStyle = `rgba(237, 237, 237, ${alpha.toFixed(3)})`;
                            ctx.fillRect(x - halfDot, y - halfDot, dotSize, dotSize);
                        }
                    }

                    requestAnimationFrame(renderHeroGlow);
                }

                renderHeroGlow();
            }
        }
    }

    // =========================================================================
    // 3. PIXEL BUTTON HOVER ANIMATION (Authentic Framer Sweep Algorithm)
    // =========================================================================
    function hashPRNG(seed) {
        let t = (seed * 374761393 + 668265263) | 0;
        t = ((t ^ (t >> 13)) * 1274126177) | 0;
        return ((t ^ (t >> 16)) >>> 0) / 4294967295;
    }

    const pixelButtons = document.querySelectorAll('div:has(> canvas), a:has(> canvas)');
    pixelButtons.forEach((btnWrapper) => {
        const canvas = btnWrapper.querySelector('canvas');
        const textSpan = btnWrapper.querySelector('span');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const pixelSize = 6;
        const speed = 0.32;
        const hoverBg = '#c8fa00'; // Neon lime green
        const defaultTextColor = textSpan ? window.getComputedStyle(textSpan).color : '#ffffff';
        const hoverTextColor = '#111111';

        let rect = btnWrapper.getBoundingClientRect();
        let w = rect.width || 120;
        let h = rect.height || 48;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = '100%';
        canvas.style.height = '100%';

        const cols = Math.max(1, Math.ceil(w / pixelSize));
        const rows = Math.max(1, Math.ceil(h / pixelSize));

        const noiseMap = new Float32Array(cols * rows);
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const idx = y * cols + x;
                noiseMap[idx] = (x / Math.max(cols - 1, 1) * 0.65 + hashPRNG(idx) * 0.35) * 0.92;
            }
        }

        let isHovered = false;
        let progress = 0;
        let lastTime = performance.now();
        let animId;

        function draw(p) {
            ctx.clearRect(0, 0, w * dpr, h * dpr);
            if (p <= 0) return;

            ctx.save();
            ctx.scale(dpr, dpr);
            ctx.fillStyle = hoverBg;

            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    const threshold = noiseMap[y * cols + x];
                    if (p > threshold) {
                        ctx.globalAlpha = p - threshold < 0.12 ? 0.45 : 1.0;
                        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
                    }
                }
            }
            ctx.restore();
        }

        function step(now) {
            const dt = (now - lastTime) / 1000;
            lastTime = now;

            const target = isHovered ? 1 : 0;
            const rate = 1 / Math.max(speed, 0.1);

            if (isHovered) {
                progress = Math.min(progress + dt * rate, 1);
            } else {
                progress = Math.max(progress - dt * rate, 0);
            }

            draw(progress);

            if (textSpan) {
                textSpan.style.color = progress > 0.5 ? hoverTextColor : defaultTextColor;
            }

            if (progress !== target) {
                animId = requestAnimationFrame(step);
            }
        }

        btnWrapper.addEventListener('mouseenter', () => {
            isHovered = true;
            lastTime = performance.now();
            cancelAnimationFrame(animId);
            animId = requestAnimationFrame(step);
        });

        btnWrapper.addEventListener('mouseleave', () => {
            isHovered = false;
            lastTime = performance.now();
            cancelAnimationFrame(animId);
            animId = requestAnimationFrame(step);
        });
    });

    // =========================================================================
    // 4. PROCESS ORBIT (Sticky 500svh Interactive Section)
    // =========================================================================
    const orbitSection = document.querySelector('.poRncmkqop');
    if (orbitSection) {
        const stickyViewport = orbitSection.querySelector('.po-sticky-viewport') || orbitSection.firstElementChild;
        const svg = orbitSection.querySelector('svg');
        const svgGroup = svg ? svg.querySelector('g') : null;
        const bgImg = orbitSection.querySelector('img');

        const paths = svgGroup ? svgGroup.querySelectorAll('path') : [];
        const orbitPath = paths[0];
        const ticksPath = paths[1];
        const arrowsPath = svg ? svg.querySelector('path[stroke-width="1.25"]') : null;

        const numTrack = orbitSection.querySelector('.po-numbers-track') || orbitSection.querySelector('.poRncmkqop-num')?.parentElement;
        if (numTrack && !numTrack.classList.contains('po-numbers-track')) {
            numTrack.classList.add('po-numbers-track');
        }

        const centerDot = orbitSection.querySelector('div[style*="width: 9px"], div[style*="width:9px"]') || orbitSection.querySelector('div[style*="border-radius: 50%"]');
        const circleNumberEls = orbitSection.querySelectorAll('div[style*="font-size: 42px"], div[style*="font-size:42px"]');
        const numMaskBox = numTrack ? numTrack.parentElement : null;

        const descContainer = orbitSection.querySelector('div[style*="left: 772px"], div[style*="left:772px"]') ||
                              orbitSection.querySelector('div[data-text="Understand"]')?.closest('div[style*="height: 100%"]');
        const descBlocks = descContainer ? Array.from(descContainer.querySelectorAll(':scope > div')) : [];

        function makeArcPath(cx, cy, r, startAngle, endAngle) {
            let d = "", first = true;
            for (let deg = startAngle; deg <= endAngle + 0.001; deg += 2) {
                const rad = deg * Math.PI / 180;
                const x = (cx + r * Math.cos(rad)).toFixed(1);
                const y = (cy + r * Math.sin(rad)).toFixed(1);
                d += (first ? "M" : "L") + x + " " + y + " ";
                first = false;
            }
            return d;
        }

        function makeTicksPath(cx, cy, r, isMobile, startAngle, endAngle) {
            const shortLen = isMobile ? 1.5 : 2;
            const medLen = isMobile ? 4 : 6;
            const longLen = isMobile ? 8 : 12;
            let d = "";
            for (let deg = startAngle; deg <= endAngle + 0.001; deg += 0.5) {
                const is10 = Math.abs(deg % 10) < 0.001;
                const is5 = Math.abs(deg % 5) < 0.001;
                const tickLen = is10 ? longLen : is5 ? medLen : shortLen;
                const rad = deg * Math.PI / 180;
                const cos = Math.cos(rad);
                const sin = Math.sin(rad);
                const x1 = (cx + r * cos).toFixed(1);
                const y1 = (cy + r * sin).toFixed(1);
                const x2 = (cx + (r + tickLen) * cos).toFixed(1);
                const y2 = (cy + (r + tickLen) * sin).toFixed(1);
                d += `M${x1} ${y1}L${x2} ${y2} `;
            }
            return d;
        }

        function makeArrowsPath(cx, cy, r) {
            let d = "";
            for (const deg of [-10, 10]) {
                const rad = deg * Math.PI / 180;
                const cos = Math.cos(rad);
                const sin = Math.sin(rad);
                const x1 = cx + r * cos;
                const y1 = cy + r * sin;
                const x2 = cx + (r + 16) * cos;
                const y2 = cy + (r + 16) * sin;
                const sign = deg < 0 ? 1 : -1;
                const x3 = x2 + sign * 9 * -sin;
                const y3 = y2 + sign * 9 * cos;
                d += `M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}L${x3.toFixed(1)} ${y3.toFixed(1)} `;
            }
            return d;
        }

        function smoothstep(min, max, val) {
            const t = Math.max(0, Math.min(1, (val - min) / (max - min)));
            return t * t * (3 - 2 * t);
        }

        const DEG_PER_STEP = 20;
        const RADIUS_RATIO = 0.78;
        const CENTER_RATIO_DESK = 0.3;
        const NUM_OFFSET = 48;
        const GAP_TO_DESC = 56;
        const DESC_WIDTH = 460;
        const TOTAL_STEPS = 5;

        let curWidth = 0, curHeight = 0;
        let centerX = 0, centerY = 0, orbitRadius = 0, dotX = 0, dotY = 0;
        let isMobile = false;
        let smoothStepVal = 0;
        let activeStepIndex = -1;

        function resizeOrbit() {
            if (!stickyViewport) return;
            curWidth = stickyViewport.clientWidth || window.innerWidth;
            curHeight = stickyViewport.clientHeight || window.innerHeight;
            isMobile = curWidth < 640;

            dotX = isMobile ? curWidth * 0.1 : curWidth * CENTER_RATIO_DESK;
            dotY = curHeight * 0.5;
            orbitRadius = curHeight * RADIUS_RATIO;
            centerX = dotX - orbitRadius;
            centerY = dotY;

            if (svg) {
                svg.setAttribute('viewBox', `0 0 ${curWidth} ${curHeight}`);
            }
            if (orbitPath) {
                orbitPath.setAttribute('d', makeArcPath(centerX, centerY, orbitRadius, -180, 180));
            }
            if (ticksPath) {
                ticksPath.setAttribute('d', makeTicksPath(centerX, centerY, orbitRadius, isMobile, -180, 180));
            }
            if (arrowsPath) {
                arrowsPath.setAttribute('d', makeArrowsPath(centerX, centerY, orbitRadius));
            }

            if (centerDot) {
                centerDot.style.left = `${dotX}px`;
                centerDot.style.top = `${dotY}px`;
            }

            const numLeft = dotX + NUM_OFFSET;
            if (numMaskBox) {
                numMaskBox.style.left = `${numLeft}px`;
                numMaskBox.style.top = '50%';
                numMaskBox.style.transform = 'translateY(-50%)';
            }

            const descLeft = numLeft + 128 + GAP_TO_DESC;
            const descW = isMobile ? (curWidth - descLeft - 24) : DESC_WIDTH;
            if (descContainer) {
                descContainer.style.left = `${descLeft}px`;
                descContainer.style.right = 'auto';
                descContainer.style.width = `${descW}px`;
                descContainer.style.top = '0px';
                descContainer.style.height = '100%';
                descBlocks.forEach(b => {
                    b.style.width = `${descW}px`;
                    b.style.maxWidth = 'none';
                });
            }
        }

        window.addEventListener('resize', resizeOrbit, { passive: true });
        resizeOrbit();

        function getScrollProgress() {
            const rect = orbitSection.getBoundingClientRect();
            const totalScroll = orbitSection.offsetHeight - stickyViewport.clientHeight;
            if (totalScroll <= 0) return 0;
            return Math.max(0, Math.min(1, -rect.top / totalScroll));
        }

        function showDescription(idx, animate = true) {
            descBlocks.forEach((block, bIdx) => {
                const innerSpans = block.querySelectorAll('span > span');
                if (bIdx === idx) {
                    block.style.opacity = '1';
                    block.style.pointerEvents = 'auto';
                    block.style.transform = 'translateY(-50%)';
                    innerSpans.forEach((s, sIdx) => {
                        s.style.transition = animate ? `transform 760ms cubic-bezier(0.08,0.78,0.56,1) ${sIdx * 90}ms, opacity 760ms ease` : 'none';
                        s.style.transform = 'translateY(0px)';
                        s.style.opacity = '1';
                    });
                } else {
                    block.style.opacity = '0';
                    block.style.pointerEvents = 'none';
                    innerSpans.forEach(s => {
                        s.style.transition = animate ? 'transform 760ms cubic-bezier(0.08,0.78,0.56,1), opacity 760ms ease' : 'none';
                        s.style.transform = bIdx < idx ? 'translateY(-14px)' : 'translateY(14px)';
                        s.style.opacity = '0';
                    });
                }
            });
        }

        showDescription(0, false);

        function renderOrbit() {
            const rawProgress = getScrollProgress();
            const targetStep = rawProgress * (TOTAL_STEPS - 1);
            smoothStepVal += (targetStep - smoothStepVal) * 0.12;

            if (bgImg) {
                const scale = 1 + (1.25 - 1) * (smoothStepVal / (TOTAL_STEPS - 1));
                bgImg.style.transform = `scale(${scale.toFixed(4)})`;
            }

            if (svgGroup) {
                const rotDeg = -smoothStepVal * DEG_PER_STEP;
                svgGroup.setAttribute('transform', `rotate(${rotDeg.toFixed(3)} ${centerX} ${centerY})`);
            }

            if (numTrack) {
                const firstChild = numTrack.firstElementChild;
                const h = firstChild ? firstChild.offsetHeight : 64;
                numTrack.style.transform = `translateY(${(-smoothStepVal * h).toFixed(2)}px)`;
            }

            const radAngleStep = DEG_PER_STEP * Math.PI / 180;
            for (let i = 0; i < TOTAL_STEPS; i++) {
                const elem = circleNumberEls[i];
                if (!elem) continue;

                const angle = (i - smoothStepVal) * radAngleStep;
                const deg = angle * 180 / Math.PI;
                const dist = Math.abs(i - smoothStepVal);

                const px = centerX + (orbitRadius - 1.5) * Math.cos(angle);
                const py = centerY + (orbitRadius - 1.5) * Math.sin(angle);

                elem.style.transform = `translate(${px.toFixed(1)}px, ${py.toFixed(1)}px) rotate(${deg * 0.5}deg) translate(-50%, -50%)`;

                const op1 = smoothstep(0, 0.9, dist);
                const op2 = 1 - smoothstep(TOTAL_STEPS * 0.55, TOTAL_STEPS * 0.95, dist);
                elem.style.opacity = (op1 * op2 * 0.5).toFixed(3);
            }

            const nearestStep = Math.max(0, Math.min(TOTAL_STEPS - 1, Math.round(smoothStepVal)));
            if (nearestStep !== activeStepIndex) {
                activeStepIndex = nearestStep;
                showDescription(activeStepIndex, true);
            }

            requestAnimationFrame(renderOrbit);
        }

        renderOrbit();
    }

    // =========================================================================
    // 5. HERO SLIDER / PRODUCT SLIDER (Auto-advancing with Progress Bars)
    // =========================================================================
    const heroSlider = document.getElementById('hero-slider');
    if (heroSlider) {
        const heroSlides = [
            {
                title: "Precision Forging",
                body: "Solid 18K gold and platinum casting held to tolerances no mass-market jeweler can match — poured, forged, and finished in-house.",
                image: "https://framerusercontent.com/images/c62B6NlRrLeLeFpjsfnYjXPk4.webp?width=2400&height=1339",
                link: "./capabilities/precision-machining"
            },
            {
                title: "Flawless Calibration",
                body: "Microscopic light-return analysis on every single diamond. If a stone doesn't hit perfect optical symmetry, we reject it.",
                image: "https://framerusercontent.com/images/beXLw5CGj0UxKgQCcW95nzeGwqo.webp?width=2400&height=1339",
                link: "./capabilities/automated-inspection"
            },
            {
                title: "Bespoke Architecture",
                body: "Jewelry engineered around your vision, not a catalog. We build hyper-custom 3D CAD renders for your approval before casting.",
                image: "https://framerusercontent.com/images/qaKiCmraJXnTn4PGr4xp32TdrY.webp?width=2400&height=1339",
                link: "./capabilities/system-integration"
            },
            {
                title: "Master Micro-Pavé",
                body: "Accent stones set under extreme magnification — no misalignments, no drift. Absolute millimeter-perfect symmetry across every setting.",
                image: "https://framerusercontent.com/images/hT8qiWjBrT7LmsteVhBKP6P9YoY.webp?width=2400&height=1339",
                link: "./capabilities/robotic-assembly"
            }
        ];

        let currentHeroIdx = 1;
        const titleEl = heroSlider.querySelector('h2');
        const bodyEl = heroSlider.querySelector('p');
        const imgEl = heroSlider.querySelector('img');
        const ctaEl = heroSlider.querySelector('a[aria-label="Learn More"]');
        
        const barContainers = heroSlider.querySelectorAll('div[style*="position:absolute;left:32px;right:32px;bottom:32px"] > div');
        const fillBars = [];
        barContainers.forEach((bc, idx) => {
            const fill = bc.querySelector('div > div');
            if (fill) fillBars.push(fill);
            bc.style.cursor = 'pointer';
            bc.addEventListener('click', () => {
                goToHeroSlide(idx);
            });
        });

        let slideStartTime = Date.now();
        const SLIDE_DURATION = 5000;

        function updateHeroContent(idx) {
            const data = heroSlides[idx];
            if (!data) return;

            if (titleEl) titleEl.textContent = data.title;
            if (bodyEl) bodyEl.textContent = data.body;
            if (imgEl) {
                imgEl.style.transition = 'opacity 0.4s ease';
                imgEl.style.opacity = '0';
                setTimeout(() => {
                    imgEl.src = data.image;
                    imgEl.srcset = `${data.image} 2400w`;
                    imgEl.alt = data.title;
                    imgEl.style.opacity = '1';
                }, 200);
            }
            if (ctaEl) {
                ctaEl.setAttribute('href', data.link);
            }
        }

        function goToHeroSlide(idx) {
            currentHeroIdx = idx;
            slideStartTime = Date.now();
            updateHeroContent(idx);
        }

        function animateHeroProgress() {
            const elapsed = Date.now() - slideStartTime;
            const progress = Math.min(1, elapsed / SLIDE_DURATION);

            fillBars.forEach((bar, idx) => {
                if (idx < currentHeroIdx) {
                    bar.style.transform = 'scaleX(1)';
                } else if (idx === currentHeroIdx) {
                    bar.style.transform = `scaleX(${progress})`;
                } else {
                    bar.style.transform = 'scaleX(0)';
                }
            });

            if (progress >= 1) {
                currentHeroIdx = (currentHeroIdx + 1) % heroSlides.length;
                slideStartTime = Date.now();
                updateHeroContent(currentHeroIdx);
            }

            requestAnimationFrame(animateHeroProgress);
        }

        goToHeroSlide(currentHeroIdx);
        requestAnimationFrame(animateHeroProgress);
    }

    
    // =========================================================================
    // 6. CAPABLE INDUSTRIES CAROUSEL (Real-Time Drag & Smooth Transitions)
    // =========================================================================
    const indSection = document.querySelector('section[data-framer-name="Capable Industries"]');
    if (indSection) {
        const indSlides = [
            {
                badge: "1 / 5",
                headline: "CAD Architecture",
                body: "Where a fraction of a millimeter decides everything. We architect your reference designs into perfect 3D CAD renders, ensuring flawless structural integrity.",
                image: "https://framerusercontent.com/images/D5nt2AkR9QQoaZ3c0olkELQ34Vo.jpg?width=2324&height=3486"
            },
            {
                badge: "2 / 5",
                headline: "Massive Fancy Diamonds",
                body: "Access the unattainable. We source flawlessly calibrated 3 to 10 carat lab-grown diamonds, meticulously cut for maximum light return and fire.",
                image: "https://framerusercontent.com/images/NMwoGvpQ5oTbi6XtKG4qmTVBraw.webp?width=1920&height=2400"
            },
            {
                badge: "3 / 5",
                headline: "18K Precision Casting",
                body: "Solid 18K gold and platinum, forged in-house. Our metallurgical engineering ensures heavy, durable mountings that never warp or bend.",
                image: "https://framerusercontent.com/images/5DAvvfKDQbiPsAFdw2C8qXqZMSw.jpg?width=3349&height=4186"
            },
            {
                badge: "4 / 5",
                headline: "Micro-Pavé Setting",
                body: "Set by master jewelers under microscopy. Every accent stone is mathematically aligned to guarantee absolute symmetry and a flawless finish.",
                image: "https://framerusercontent.com/images/Kx5AS2wSUxoT9wwcU80d1hXi8.webp?width=2400&height=1600"
            },
            {
                badge: "5 / 5",
                headline: "Fully Insured Delivery",
                body: "Zero stress, absolute transparency. From the initial WhatsApp sketch to fully insured global delivery, we manage the entire commission privately.",
                image: "https://framerusercontent.com/images/zfeAVhfVFNDmGdSqrjd1uIZNMF8.webp?width=2400&height=1600"
            }
        ];

        let curIndIdx = 0;
        let isAnimating = false;
        const badgeEl = indSection.querySelector('span[style*="SF Mono"], span[style*="font-variant-numeric:tabular-nums"]');
        const headlineEl = indSection.querySelector('h3');
        const bodyEl = indSection.querySelector('p');
        const imgEl = indSection.querySelector('img');
        const prevBtn = indSection.querySelector('button[aria-label="Previous slide"]');
        const nextBtn = indSection.querySelector('button[aria-label="Next slide"]');
        const dragContainer = indSection.querySelector('.framer-poqq88-container') || indSection.querySelector('.framer-x0i8pu') || indSection;

        const ease = 'cubic-bezier(0.16, 1, 0.3, 1)';
        const textWrapper = headlineEl ? headlineEl.parentElement : null;
        const imgWrapper = imgEl ? imgEl.parentElement : null;

        function setIndustrySlide(idx, direction = 1) {
            if (isAnimating) return;
            isAnimating = true;

            curIndIdx = (idx + indSlides.length) % indSlides.length;
            const slide = indSlides[curIndIdx];

            if (textWrapper) {
                textWrapper.style.transition = `opacity 0.25s ${ease}, transform 0.25s ${ease}`;
                textWrapper.style.opacity = '0';
                textWrapper.style.transform = `translateY(${direction > 0 ? '-12px' : '12px'})`;
            }
            if (imgWrapper) {
                imgWrapper.style.transition = `opacity 0.25s ${ease}, transform 0.25s ${ease}`;
                imgWrapper.style.opacity = '0.4';
                imgWrapper.style.transform = 'scale(0.98)';
            }

            setTimeout(() => {
                if (badgeEl) badgeEl.innerHTML = `${curIndIdx + 1}&nbsp;/&nbsp;5`;
                if (headlineEl) headlineEl.textContent = slide.headline;
                if (bodyEl) bodyEl.textContent = slide.body;
                if (imgEl) {
                    imgEl.src = slide.image;
                    imgEl.srcset = '';
                    imgEl.alt = slide.headline;
                }

                if (textWrapper) {
                    textWrapper.style.transition = 'none';
                    textWrapper.style.transform = `translateY(${direction > 0 ? '12px' : '-12px'})`;
                }

                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        if (textWrapper) {
                            textWrapper.style.transition = `opacity 0.5s ${ease}, transform 0.5s ${ease}`;
                            textWrapper.style.opacity = '1';
                            textWrapper.style.transform = 'translateY(0px)';
                        }
                        if (imgWrapper) {
                            imgWrapper.style.transition = `opacity 0.5s ${ease}, transform 0.5s ${ease}`;
                            imgWrapper.style.opacity = '1';
                            imgWrapper.style.transform = 'scale(1)';
                        }
                        setTimeout(() => {
                            isAnimating = false;
                        }, 500);
                    });
                });
            }, 250);
        }

        if (prevBtn) prevBtn.addEventListener('click', (e) => { e.preventDefault(); setIndustrySlide(curIndIdx - 1, -1); });
        if (nextBtn) nextBtn.addEventListener('click', (e) => { e.preventDefault(); setIndustrySlide(curIndIdx + 1, 1); });

        // --- Real-Time Drag on Capable Industries Card ---
        if (dragContainer) {
            let isDragging = false;
            let startX = 0;
            let diffX = 0;

            dragContainer.style.cursor = 'grab';
            dragContainer.style.userSelect = 'none';
            dragContainer.style.touchAction = 'pan-y';

            dragContainer.addEventListener('pointerdown', (e) => {
                if (e.target.closest('button')) return;
                isDragging = true;
                startX = e.clientX;
                diffX = 0;
                dragContainer.style.cursor = 'grabbing';
            });

            window.addEventListener('pointermove', (e) => {
                if (!isDragging) return;
                diffX = e.clientX - startX;
                if (imgWrapper) {
                    imgWrapper.style.transition = 'none';
                    imgWrapper.style.transform = `translateX(${diffX * 0.4}px)`;
                }
            });

            const endDrag = (e) => {
                if (!isDragging) return;
                isDragging = false;
                dragContainer.style.cursor = 'grab';

                if (imgWrapper) {
                    imgWrapper.style.transition = `transform 0.4s ${ease}`;
                    imgWrapper.style.transform = 'translateX(0px)';
                }

                if (Math.abs(diffX) > 40) {
                    if (diffX < 0) {
                        setIndustrySlide(curIndIdx + 1, 1);
                    } else {
                        setIndustrySlide(curIndIdx - 1, -1);
                    }
                }
                diffX = 0;
            };

            window.addEventListener('pointerup', endDrag);
            window.addEventListener('pointercancel', endDrag);
        }
    }

    // =========================================================================
    // 7. TESTIMONIALS CAROUSEL (Visible Text Animation & Real-Time Drag)
    // =========================================================================
    const testSection = document.querySelector('section[data-framer-name="Testimonials"]');
    if (testSection) {
        const testimonials = [
            {
                badge: "1 / 4",
                source: "Axlon",
                quote: "“Every unit comes off the line exactly like the last. We stopped firefighting and got back to building.”"
            },
            {
                badge: "2 / 4",
                source: "Aerix",
                quote: "“In our work, close enough doesn't exist. I trust the line now more than the inspection that comes after it.”"
            },
            {
                badge: "3 / 4",
                source: "Cargon",
                quote: "“Peak season used to break us. Now the floor handles itself, and we get through it calm.”"
            },
            {
                badge: "4 / 4",
                source: "Voltan",
                quote: "“The robots go where we'd rather not send people. We catch problems early, and everyone gets home.”"
            }
        ];

        let curTestIdx = 0;
        let isTestAnimating = false;
        const badgeEl = testSection.querySelector('span[style*="font-variant-numeric:tabular-nums"]');
        const authorEl = testSection.querySelector('span[style*="text-transform:uppercase"]');
        
        // Target specifically the VISIBLE quote element (child 1 of max-width container)
        const quoteContainer = testSection.querySelector('div[style*="max-width:860px"]') || testSection.querySelector('div[style*="max-width: 860px"]');
        const quoteEl = quoteContainer && quoteContainer.children[1] ? quoteContainer.children[1] : (testSection.querySelector('div[style*="font-size:32px"]:not([aria-hidden="true"])') || testSection.querySelector('div[style*="color:rgb(17, 17, 17)"]'));
        
        const btns = testSection.querySelectorAll('button');
        const prevBtn = btns[0];
        const nextBtn = btns[1];

        const ease = 'cubic-bezier(0.16, 1, 0.3, 1)';

        function setTestimonial(idx, direction = 1) {
            if (isTestAnimating) return;
            isTestAnimating = true;

            curTestIdx = (idx + testimonials.length) % testimonials.length;
            const data = testimonials[curTestIdx];

            if (quoteEl) {
                quoteEl.style.transition = `opacity 0.25s ${ease}, transform 0.25s ${ease}`;
                quoteEl.style.opacity = '0';
                quoteEl.style.transform = `translateY(${direction > 0 ? '-14px' : '14px'})`;
            }

            setTimeout(() => {
                if (badgeEl) badgeEl.innerHTML = `${curTestIdx + 1}<!-- --> / <!-- -->4`;
                if (authorEl) authorEl.textContent = data.source;
                if (quoteEl) {
                    quoteEl.innerHTML = data.quote;
                    quoteEl.style.transition = 'none';
                    quoteEl.style.transform = `translateY(${direction > 0 ? '14px' : '-14px'})`;
                }

                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        if (quoteEl) {
                            quoteEl.style.transition = `opacity 0.5s ${ease}, transform 0.5s ${ease}`;
                            quoteEl.style.opacity = '1';
                            quoteEl.style.transform = 'translateY(0px)';
                        }
                        setTimeout(() => {
                            isTestAnimating = false;
                        }, 500);
                    });
                });
            }, 250);
        }

        if (prevBtn) prevBtn.addEventListener('click', (e) => { e.preventDefault(); setTestimonial(curTestIdx - 1, -1); });
        if (nextBtn) nextBtn.addEventListener('click', (e) => { e.preventDefault(); setTestimonial(curTestIdx + 1, 1); });

        // Real-time Drag on Testimonials
        let isDraggingTest = false;
        let startXTest = 0;
        let diffXTest = 0;

        testSection.style.cursor = 'grab';
        testSection.style.userSelect = 'none';
        testSection.style.touchAction = 'pan-y';

        testSection.addEventListener('pointerdown', (e) => {
            if (e.target.closest('button')) return;
            isDraggingTest = true;
            startXTest = e.clientX;
            diffXTest = 0;
            testSection.style.cursor = 'grabbing';
        });

        window.addEventListener('pointermove', (e) => {
            if (!isDraggingTest) return;
            diffXTest = e.clientX - startXTest;
            if (quoteEl) {
                quoteEl.style.transition = 'none';
                quoteEl.style.transform = `translateX(${diffXTest * 0.4}px)`;
            }
        });

        const endTestDrag = (e) => {
            if (!isDraggingTest) return;
            isDraggingTest = false;
            testSection.style.cursor = 'grab';

            if (quoteEl) {
                quoteEl.style.transition = `transform 0.4s ${ease}`;
                quoteEl.style.transform = 'translateX(0px)';
            }

            if (Math.abs(diffXTest) > 40) {
                if (diffXTest < 0) {
                    setTestimonial(curTestIdx + 1, 1);
                } else {
                    setTestimonial(curTestIdx - 1, -1);
                }
            }
            diffXTest = 0;
        };

        window.addEventListener('pointerup', endTestDrag);
        window.addEventListener('pointercancel', endTestDrag);
    }

    // =========================================================================
    // 8. STATS CARDS ("By the Numbers" Smooth Spring Physics Hover)
    // =========================================================================
    const statsGrid = document.querySelector('.framer-na8vbw');
    if (statsGrid) {
        const cards = statsGrid.querySelectorAll(':scope > div');
        cards.forEach((cardContainer) => {
            const card = cardContainer.querySelector('div[style*="border-radius:10px"], div[style*="border-radius: 10px"]');
            if (!card) return;

            card.classList.add('native-stat-card');
            const backCard = card.querySelector('div[style*="background-color: rgb(43, 43, 43)"], div[style*="background-color:rgb(43, 43, 43)"]');
            if (backCard) {
                backCard.classList.add('native-stat-back');
            }

            const iconContainer = card.querySelector('div[style*="border-radius: 50%"], div[style*="border-radius:50%"]');
            if (iconContainer) {
                iconContainer.classList.add('native-stat-icon');
            }

            card.addEventListener('click', () => {
                card.classList.toggle('active');
            });
        });
    }

    // =========================================================================
    // 9. CLIENTS TICKER (Seamless Infinite Marquee)
    // =========================================================================
    const tickerSection = document.querySelector('section[data-framer-name="Clients Ticker"]');
    if (tickerSection) {
        const track = tickerSection.querySelector('ul');
        if (track && !track.classList.contains('native-ticker-track')) {
            const items = Array.from(track.children);
            items.forEach((item) => {
                const clone = item.cloneNode(true);
                clone.setAttribute('aria-hidden', 'true');
                track.appendChild(clone);
            });
            track.classList.add('native-ticker-track');
        }
    }

    // =========================================================================
    // =========================================================================
    // 10. NEWSROOM SLIDESHOW (Real-Time Drag & Fluid Snapping Without Click Hijacking)
    // =========================================================================
    const slideshow = document.querySelector('.framer-slideshow');
    if (slideshow) {
        const track = slideshow.querySelector('ul');
        const prevBtn = slideshow.querySelector('button[aria-label="Previous"]');
        const nextBtn = slideshow.querySelector('button[aria-label="Next"]');
        const dotBtns = slideshow.querySelectorAll('button[aria-label^="Scroll to page"]');
        const slides = track ? Array.from(track.querySelectorAll(':scope > li > div')) : [];

        slides.forEach(s => s.style.visibility = 'visible');

        let curSlide = 0;
        const totalSlides = slides.length || 4;
        let isDragging = false;
        let startX = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let dragOffset = 0;
        let hasMoved = false;
        let autoPlayTimer = null;
        let isHovered = false;

        function getCardWidth() {
            return (slides[0] && slides[0].offsetWidth) ? slides[0].offsetWidth : 700;
        }
        const gap = 12;

        function updateSlideshow(pageIdx, animated = true) {
            curSlide = (pageIdx + totalSlides) % totalSlides;
            const cardWidth = getCardWidth();
            const offset = curSlide * (cardWidth + gap);
            currentTranslate = -offset;
            prevTranslate = currentTranslate;

            if (track) {
                track.style.transition = animated ? 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' : 'none';
                track.style.transform = `translateX(${currentTranslate}px)`;
            }

            dotBtns.forEach((dot, idx) => {
                if (idx === curSlide) {
                    dot.style.opacity = '1';
                    dot.style.transform = 'scale(1.2)';
                } else {
                    dot.style.opacity = '0.35';
                    dot.style.transform = 'scale(1)';
                }
            });
        }

        if (prevBtn) prevBtn.addEventListener('click', (e) => { e.preventDefault(); resetAutoPlay(); updateSlideshow(curSlide - 1); });
        if (nextBtn) nextBtn.addEventListener('click', (e) => { e.preventDefault(); resetAutoPlay(); updateSlideshow(curSlide + 1); });

        dotBtns.forEach((dot, idx) => {
            dot.style.cursor = 'pointer';
            dot.style.transition = 'all 0.3s ease';
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                resetAutoPlay();
                updateSlideshow(idx);
            });
        });

        // Real-Time Pointer Drag with Link Click Suppression
        if (track) {
            track.style.cursor = 'grab';
            track.style.userSelect = 'none';
            track.style.touchAction = 'pan-y';

            track.querySelectorAll('img, a').forEach(el => {
                el.setAttribute('draggable', 'false');
            });

            track.addEventListener('pointerdown', (e) => {
                if (e.target.closest('button')) return;
                isDragging = true;
                hasMoved = false;
                startX = e.clientX;
                dragOffset = 0;
                track.style.cursor = 'grabbing';
                track.style.transition = 'none';
                resetAutoPlay();
            });

            window.addEventListener('pointermove', (e) => {
                if (!isDragging) return;
                dragOffset = e.clientX - startX;
                if (Math.abs(dragOffset) > 6) {
                    hasMoved = true;
                }
                const pos = prevTranslate + dragOffset;
                track.style.transform = `translateX(${pos}px)`;
            });

            const endNewsDrag = (e) => {
                if (!isDragging) return;
                isDragging = false;
                track.style.cursor = 'grab';

                if (Math.abs(dragOffset) > 60) {
                    if (dragOffset < 0) {
                        updateSlideshow(curSlide + 1);
                    } else {
                        updateSlideshow(curSlide - 1);
                    }
                } else {
                    updateSlideshow(curSlide);
                }
                dragOffset = 0;
                setTimeout(() => {
                    hasMoved = false;
                }, 100);
            };

            window.addEventListener('pointerup', endNewsDrag);
            window.addEventListener('pointercancel', endNewsDrag);

            // Block clicks on <a> if dragging occurred
            track.addEventListener('click', (e) => {
                if (hasMoved) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    return false;
                }
            }, true);
        }

        function startAutoPlay() {
            if (autoPlayTimer) clearInterval(autoPlayTimer);
            autoPlayTimer = setInterval(() => {
                if (!isHovered && !isDragging) {
                    updateSlideshow(curSlide + 1);
                }
            }, 3500);
        }

        function resetAutoPlay() {
            startAutoPlay();
        }

        slideshow.addEventListener('mouseenter', () => { isHovered = true; });
        slideshow.addEventListener('mouseleave', () => { isHovered = false; });

        updateSlideshow(0, false);
        startAutoPlay();
    }

    // =========================================================================
    // DYNAMIC NAV THEME ADAPTATION ON SCROLL
    // =========================================================================
    const navPill = document.querySelector('nav.gnR7dqop');
    if (navPill) {
        // Sections that have light/white background
        const lightSections = [
            '.framer-180y0gn', // About Us
            'section[data-framer-name="Capable Industries"]',
            '.framer-16n3l3k', // Stats
            '.framer-na8vbw',
            'section[data-framer-name="Testimonials"]',
            '.framer-nbdfce'  // Newsroom
        ];

        function updateNavTheme() {
            const navRect = navPill.getBoundingClientRect();
            const checkY = navRect.top + navRect.height / 2;
            const checkX = navRect.left + navRect.width / 2;

            let isOverLight = false;
            for (const sel of lightSections) {
                const sec = document.querySelector(sel);
                if (sec) {
                    const rect = sec.getBoundingClientRect();
                    if (checkY >= rect.top && checkY <= rect.bottom && checkX >= rect.left && checkX <= rect.right) {
                        isOverLight = true;
                        break;
                    }
                }
            }

            if (isOverLight) {
                navPill.classList.add('theme-light');
            } else {
                navPill.classList.remove('theme-light');
            }
        }

        window.addEventListener('scroll', updateNavTheme, { passive: true });
        if (typeof lenis !== 'undefined' && lenis) lenis.on('scroll', updateNavTheme);
        updateNavTheme();
    }

// Add Pointer Swiping to Capable Industries
    const indSectionEl = document.querySelector('section[data-framer-name="Capable Industries"]');
    if (indSectionEl) {
        let pStartX = 0;
        indSectionEl.addEventListener('pointerdown', (e) => {
            if (e.target.closest('button')) return;
            pStartX = e.clientX;
        });
        indSectionEl.addEventListener('pointerup', (e) => {
            if (e.target.closest('button') || !pStartX) return;
            const pDiff = e.clientX - pStartX;
            if (pDiff < -40) {
                const nextB = indSectionEl.querySelector('button[aria-label="Next slide"]');
                if (nextB) nextB.click();
            } else if (pDiff > 40) {
                const prevB = indSectionEl.querySelector('button[aria-label="Previous slide"]');
                if (prevB) prevB.click();
            }
            pStartX = 0;
        });
    }

    // Add Pointer Swiping to Testimonials
    const testSectionEl = document.querySelector('section[data-framer-name="Testimonials"]');
    if (testSectionEl) {
        let tStartX = 0;
        testSectionEl.addEventListener('pointerdown', (e) => {
            if (e.target.closest('button')) return;
            tStartX = e.clientX;
        });
        testSectionEl.addEventListener('pointerup', (e) => {
            if (e.target.closest('button') || !tStartX) return;
            const tDiff = e.clientX - tStartX;
            const tBtns = testSectionEl.querySelectorAll('button');
            if (tDiff < -40 && tBtns[1]) {
                tBtns[1].click();
            } else if (tDiff > 40 && tBtns[0]) {
                tBtns[0].click();
            }
            tStartX = 0;
        });
    }
// =========================================================================
    // 11. NAVIGATION DRAWER CONTROLLER (Menu Toggle, Backdrop, Smooth Anims)
    // =========================================================================
    const allNavs = document.querySelectorAll('nav.gnR7dqop');
    allNavs.forEach((navEl) => {
        const menuBtn = navEl.querySelector('.gn-btn');
        let backdrop = document.querySelector('.gnR7dqop-backdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.className = 'gnR7dqop-backdrop';
            backdrop.style.display = 'none';
            document.body.appendChild(backdrop);
        }

        const setMenuState = (isOpen) => {
            if (isOpen) {
                navEl.classList.add('open');
                navEl.style.pointerEvents = 'auto';
                if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
                if (backdrop) backdrop.style.display = 'block';
            } else {
                navEl.classList.remove('open');
                navEl.style.pointerEvents = '';
                if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
                if (backdrop) backdrop.style.display = 'none';
            }
        };

        if (menuBtn) {
            menuBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const isOpen = navEl.classList.contains('open');
                setMenuState(!isOpen);
            });
        }

        if (backdrop) {
            backdrop.addEventListener('click', () => setMenuState(false));
        }

        // Close when clicking any nav link
        const navLinks = navEl.querySelectorAll('a, .gn-link-hit, .gn-link');
        navLinks.forEach((link) => {
            link.addEventListener('click', () => {
                setMenuState(false);
            });
        });

        // Close on Escape key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navEl.classList.contains('open')) {
                setMenuState(false);
            }
        });
    });
// =========================================================================
    // 12. FOOTER MOUSE-FOLLOWING DOTREVEAL GLOW CANVAS
    // =========================================================================
    const footerSection = document.querySelector('footer, .framer-ZEYvg, .framer-1m3vhtb');
    if (footerSection) {
        const footerCanvas = footerSection.querySelector('.framer-1hlpczo-container canvas') || footerSection.querySelector('canvas');
        if (footerCanvas) {
            const ctx = footerCanvas.getContext('2d');
            if (ctx) {
                const spacing = 16;
                const dotSize = 1.5;
                const baseOpacity = 0.11;
                const radius = 160;
                const maxRevealOpacity = 0.90;
                const smoothing = 0.4;
                const springC = 0.06 + (1 - Math.min(Math.max(smoothing, 0), 1)) * 0.34;

                let targetX = -9999, targetY = -9999;
                let kx = -9999, ky = -9999;
                let ox = -9999, oy = -9999;
                let isMouseInside = false;
                let intensity = 0;

                function resizeFooterCanvas() {
                    const w = footerSection.offsetWidth || window.innerWidth;
                    const h = footerSection.offsetHeight || 600;
                    if (footerCanvas.width !== w || footerCanvas.height !== h) {
                        footerCanvas.width = w;
                        footerCanvas.height = h;
                    }
                    footerCanvas.style.width = '100%';
                    footerCanvas.style.height = '100%';
                }

                window.addEventListener('resize', resizeFooterCanvas, { passive: true });
                window.addEventListener('load', resizeFooterCanvas, { passive: true });
                resizeFooterCanvas();

                footerSection.addEventListener('mousemove', (e) => {
                    const rect = footerSection.getBoundingClientRect();
                    targetX = e.clientX - rect.left;
                    targetY = e.clientY - rect.top;
                    if (!isMouseInside) {
                        kx = targetX; ky = targetY;
                        ox = targetX; oy = targetY;
                    }
                    isMouseInside = true;
                }, { passive: true });

                footerSection.addEventListener('mouseleave', () => { isMouseInside = false; });

                function renderFooterGlow() {
                    const w = footerCanvas.width || footerSection.offsetWidth || window.innerWidth;
                    const h = footerCanvas.height || footerSection.offsetHeight || 600;

                    const targetIntensity = isMouseInside ? 1 : 0;
                    intensity += (targetIntensity - intensity) * 0.15;

                    kx += (targetX - kx) * springC;
                    ky += (targetY - ky) * springC;
                    ox += (kx - ox) * springC;
                    oy += (ky - oy) * springC;

                    ctx.clearRect(0, 0, w, h);

                    const cols = Math.ceil(w / spacing);
                    const rows = Math.ceil(h / spacing);
                    const offsetX = (w - cols * spacing) / 2 + spacing / 2;
                    const offsetY = (h - rows * spacing) / 2 + spacing / 2;
                    const halfDot = dotSize / 2;

                    for (let r = -2; r <= rows + 2; r++) {
                        const y = offsetY + r * spacing;
                        const dy = y - oy;

                        for (let c = -2; c <= cols + 2; c++) {
                            const x = offsetX + c * spacing;
                            const dx = x - ox;
                            const dist = Math.sqrt(dx * dx + dy * dy);

                            let alpha = baseOpacity;
                            if (intensity > 0.005 && dist < radius) {
                                const factor = 1 - (dist / radius);
                                const glow = factor * factor * (3 - 2 * factor) * maxRevealOpacity * intensity;
                                alpha = Math.min(1, baseOpacity + glow);
                            }

                            ctx.fillStyle = `rgba(237, 237, 237, ${alpha.toFixed(3)})`;
                            ctx.fillRect(x - halfDot, y - halfDot, dotSize, dotSize);
                        }
                    }

                    requestAnimationFrame(renderFooterGlow);
                }

                renderFooterGlow();
            }
        }
    }
});