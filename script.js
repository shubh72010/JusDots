document.addEventListener('DOMContentLoaded', () => {
    // =============================================
    //   CINEMATIC ENGINE
    // =============================================

    // --- Lenis Smooth Scroll ---
    let lenis;
    if (window.Lenis) {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            touchMultiplier: 2,
        });

        // Sync with GSAP ticker for smoother performance
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        // Disable GSAP's own smoothing to avoid conflicts with Lenis
        gsap.ticker.lagSmoothing(0);

        if (window.ScrollTrigger) {
            lenis.on('scroll', ScrollTrigger.update);
        }
    }

    // --- Register ScrollTrigger ---
    if (window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
    }

    // --- Custom Cursor ---
    const cursor = document.getElementById('cursor');
    const trail = document.getElementById('cursorTrail');
    if (cursor && trail) {
        let mx = window.innerWidth / 2, my = window.innerHeight / 2;
        let tx = mx, ty = my;

        const moveCursor = e => {
            mx = e.clientX;
            my = e.clientY;
        };
        document.addEventListener('mousemove', moveCursor);

        const tick = () => {
            tx += (mx - tx) * 0.15;
            ty += (my - ty) * 0.15;
            cursor.style.left = mx + 'px';
            cursor.style.top = my + 'px';
            trail.style.left = tx + 'px';
            trail.style.top = ty + 'px';
            requestAnimationFrame(tick);
        };
        tick();
    }

    // --- Intro Loading Screen ---
    const introScreen = document.getElementById('introScreen');
    const introCounter = document.getElementById('introCounter');
    const introLogo = document.querySelector('.intro-logo');
    const introLine = document.querySelector('.intro-line');

    const runIntro = () => {
        const tl = gsap.timeline({
            onComplete: () => {
                introScreen.style.pointerEvents = 'none';
                revealHero();
                initScrollAnimations();
            }
        });

        // Counter: 0 → 100
        let counter = { val: 0 };
        tl.to(introLogo, { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' }, 0);
        tl.to(introLine, { scaleX: 1, duration: 1.8, ease: 'power2.inOut' }, 0.2);
        tl.to(counter, {
            val: 100,
            duration: 1.8,
            ease: 'power2.inOut',
            onUpdate: () => {
                if (introCounter) introCounter.textContent = Math.round(counter.val);
            }
        }, 0.2);

        // Wipe away
        tl.to(introScreen, {
            yPercent: -100,
            duration: 1.2,
            ease: 'expo.inOut',
            onComplete: () => {
                introScreen.style.display = 'none';
            }
        }, '+=0.3');
    };

    runIntro();

    // --- Hero Reveal ---
    const revealHero = () => {
        const heroLines = document.querySelectorAll('.hero-line');
        const eyebrow = document.querySelector('.hero-eyebrow');
        const sub = document.querySelector('.hero-sub');
        const scrollHint = document.querySelector('.scroll-hint');

        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

        if (eyebrow) {
            tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.8 }, 0);
        }

        heroLines.forEach((line, i) => {
            tl.to(line, {
                opacity: 1,
                y: 0,
                duration: 1.2,
            }, 0.15 + i * 0.12);
        });

        if (sub) {
            tl.to(sub, { opacity: 1, y: 0, duration: 1 }, 0.6);
        }

        if (scrollHint) {
            tl.to(scrollHint, { opacity: 1, y: 0, duration: 0.8 }, 0.9);
        }

        // Scroll hint fade on scroll
        if (scrollHint) {
            window.addEventListener('scroll', () => {
                scrollHint.style.opacity = Math.max(0, 1 - window.scrollY / 300);
            }, { passive: true });
        }
    };

    // --- ScrollTrigger Section Reveals ---
    const initScrollAnimations = () => {
        if (!window.ScrollTrigger) return;

        // --- Interstitial Reveals (Quiet Moments) ---
        document.querySelectorAll('.interstitial').forEach((section) => {
            const text = section.querySelector('.interstitial-text');
            const caption = section.querySelector('.interstitial-caption');
            const label = section.querySelector('.interstitial-label');

            if (text) {
                gsap.fromTo(text,
                    { opacity: 0, y: 30, filter: 'blur(10px)' },
                    {
                        opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.5, ease: 'power2.out',
                        scrollTrigger: {
                            trigger: section,
                            start: 'top 60%',
                            toggleActions: 'play none none reverse',
                        }
                    }
                );
            }

            if (caption) {
                gsap.to(caption, {
                    opacity: 1, y: 0, duration: 1, delay: 0.5, ease: 'power2.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 60%',
                        toggleActions: 'play none none reverse',
                    }
                });
            }

            if (label) {
                gsap.fromTo(label,
                    { opacity: 0, scale: 1.1 },
                    {
                        opacity: 0.03, scale: 1, duration: 2, ease: 'power1.out',
                        scrollTrigger: {
                            trigger: section,
                            start: 'top 80%',
                            toggleActions: 'play none none reverse',
                        }
                    }
                );
            }
        });

        // Product sections: slide in from left/right
        document.querySelectorAll('.product-section').forEach((section, i) => {
            const info = section.querySelector('.product-info');
            const visual = section.querySelector('.product-visual');
            const isEven = i % 2 === 0;

            if (info) {
                gsap.fromTo(info,
                    { opacity: 0, x: isEven ? -60 : 60 },
                    {
                        opacity: 1, x: 0, duration: 1.4, ease: 'power3.out',
                        scrollTrigger: {
                            trigger: section,
                            start: 'top 75%',
                            toggleActions: 'play none none reverse',
                        }
                    }
                );
            }
            if (visual) {
                gsap.fromTo(visual,
                    { opacity: 0, x: isEven ? 60 : -60, scale: 0.95 },
                    {
                        opacity: 1, x: 0, scale: 1, duration: 1.6, ease: 'power3.out',
                        scrollTrigger: {
                            trigger: section,
                            start: 'top 70%',
                            toggleActions: 'play none none reverse',
                        }
                    }
                );
            }

            // Badge pop
            const badge = section.querySelector('.badge');
            if (badge) {
                gsap.fromTo(badge,
                    { opacity: 0, scale: 0.8, y: 20 },
                    {
                        opacity: 1, scale: 1, y: 0, duration: 1, ease: 'back.out(1.7)',
                        scrollTrigger: {
                            trigger: section,
                            start: 'top 80%',
                            toggleActions: 'play none none reverse',
                        }
                    }
                );
            }

            // High-energy hover effect logic (text shadow) is in CSS.
        });

        // Team cards stagger
        const teamCards = document.querySelectorAll('.team-card');
        if (teamCards.length) {
            gsap.fromTo(teamCards,
                { opacity: 0, y: 40, scale: 0.98 },
                {
                    opacity: 1, y: 0, scale: 1, duration: 1.2, stagger: 0.1, ease: 'power4.out',
                    scrollTrigger: {
                        trigger: '.team-section',
                        start: 'top 70%',
                        toggleActions: 'play none none reverse',
                    }
                }
            );
        }

        // Marquee speed change on scroll
        document.querySelectorAll('.marquee-track').forEach(track => {
            gsap.to(track, {
                scrollTrigger: {
                    trigger: track,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.5,
                },
                x: track.classList.contains('marquee-reverse') ? 150 : -150,
                ease: 'none',
            });
        });

        // Parallax background glow
        gsap.to('.bg-glow', {
            y: -150,
            scrollTrigger: {
                trigger: 'main',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 2,
            }
        });
        gsap.to('.bg-glow-2', {
            y: 150,
            scrollTrigger: {
                trigger: 'main',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 2,
            }
        });
    };


    // --- GSAP Staggered Menu Logic ---
    const menuWrapper = document.querySelector('.staggered-menu-wrapper');
    const toggleBtn = document.querySelector('.sm-toggle');
    const panel = document.querySelector('.staggered-menu-panel');
    const preLayers = document.querySelectorAll('.sm-prelayer');
    const textInner = document.querySelector('.sm-toggle-textInner');
    const smIcon = document.querySelector('.sm-icon');
    const panelItems = document.querySelectorAll('.sm-panel-itemLabel');
    const menuLinks = document.querySelectorAll('.sm-panel-item');

    let isOpen = false;
    let isBusy = false;


    if (!window.gsap) {
        console.error('GSAP is not loaded!');
        return;
    }

    // Set initial states
    gsap.set([panel, ...preLayers], { xPercent: 100 });
    gsap.set(panelItems, { yPercent: 140, rotate: 10 });

    const playOpen = () => {
        if (isBusy) return;
        isBusy = true;
        menuWrapper.setAttribute('data-open', 'true');

        const tl = gsap.timeline({
            onComplete: () => { isBusy = false; }
        });

        // Layer staggering
        preLayers.forEach((layer, i) => {
            tl.fromTo(layer, { xPercent: 100 }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07);
        });

        // Panel slide
        tl.fromTo(panel, { xPercent: 100 }, { xPercent: 0, duration: 0.65, ease: 'power4.out' }, preLayers.length * 0.07 + 0.08);

        // Item staggering
        tl.to(panelItems, {
            yPercent: 0,
            rotate: 0,
            duration: 1,
            ease: 'power4.out',
            stagger: 0.1
        }, ">-0.4");

        // Numbering opacity
        tl.to(panel, { '--sm-num-opacity': 1, duration: 0.6 }, ">-0.8");

        // Icon spin
        gsap.to(smIcon, { rotate: 225, duration: 0.8, ease: 'power4.out' });

        // Text cycle
        gsap.to(textInner, { yPercent: -50, duration: 0.6, ease: 'power4.out' });
    };

    const playClose = () => {
        if (isBusy) return;
        isBusy = true;

        const all = [...preLayers, panel];
        gsap.to(all, {
            xPercent: 100,
            duration: 0.4,
            ease: 'power3.in',
            stagger: { each: 0.05, from: 'end' },
            onComplete: () => {
                gsap.set(panelItems, { yPercent: 140, rotate: 10 });
                gsap.set(panel, { '--sm-num-opacity': 0 });
                menuWrapper.removeAttribute('data-open');
                isBusy = false;
            }
        });

        // Icon back
        gsap.to(smIcon, { rotate: 0, duration: 0.4, ease: 'power3.inOut' });

        // Text back
        gsap.to(textInner, { yPercent: 0, duration: 0.4, ease: 'power4.out' });
    };

    if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('Toggle Clicked');
            isOpen = !isOpen;
            if (isOpen) playOpen();
            else playClose();
        });
    }

    // Close on click away
    document.addEventListener('mousedown', (e) => {
        if (isOpen && panel && !panel.contains(e.target) && !toggleBtn.contains(e.target)) {
            isOpen = false;
            playClose();
        }
    });

    // Smooth scroll for menu links
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                isOpen = false;
                playClose();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // --- Bounce Cards Logic (DotNotes) ---
    const bounceContainer = document.querySelector('.bounceCardsContainer');
    if (bounceContainer) {
        const cards = bounceContainer.querySelectorAll('.card');
        const transformStyles = [
            'rotate(10deg) translate(-170px)',
            'rotate(5deg) translate(-85px)',
            'rotate(-3deg)',
            'rotate(-10deg) translate(85px)',
            'rotate(2deg) translate(170px)'
        ];

        // Entrance Animation
        gsap.fromTo(cards,
            { scale: 0 },
            {
                scale: 1,
                stagger: 0.08,
                ease: 'elastic.out(1, 0.8)',
                delay: 0.5
            }
        );

        const getNoRotationTransform = (transformStr) => {
            const hasRotate = /rotate\([\s\S]*?\)/.test(transformStr);
            if (hasRotate) {
                return transformStr.replace(/rotate\([\s\S]*?\)/, 'rotate(0deg)');
            } else if (transformStr === 'none') {
                return 'rotate(0deg)';
            } else {
                return `${transformStr} rotate(0deg)`;
            }
        };

        const getPushedTransform = (baseTransform, offsetX) => {
            const translateRegex = /translate\(([-0-9.]+)px\)/;
            const match = baseTransform.match(translateRegex);
            if (match) {
                const currentX = parseFloat(match[1]);
                const newX = currentX + offsetX;
                return baseTransform.replace(translateRegex, `translate(${newX}px)`);
            } else {
                return baseTransform === 'none' ? `translate(${offsetX}px)` : `${baseTransform} translate(${offsetX}px)`;
            }
        };

        const pushSiblings = (hoveredIdx) => {
            cards.forEach((card, i) => {
                gsap.killTweensOf(card);
                const baseTransform = transformStyles[i] || 'none';

                if (i === hoveredIdx) {
                    const noRotationTransform = getNoRotationTransform(baseTransform);
                    gsap.to(card, {
                        transform: noRotationTransform,
                        duration: 0.4,
                        ease: 'back.out(1.4)',
                        overwrite: 'auto'
                    });
                } else {
                    const offsetX = i < hoveredIdx ? -160 : 160;
                    const pushedTransform = getPushedTransform(baseTransform, offsetX);
                    const distance = Math.abs(hoveredIdx - i);
                    const delay = distance * 0.05;

                    gsap.to(card, {
                        transform: pushedTransform,
                        duration: 0.4,
                        ease: 'back.out(1.4)',
                        delay,
                        overwrite: 'auto'
                    });
                }
            });
        };

        const resetSiblings = () => {
            cards.forEach((card, i) => {
                gsap.killTweensOf(card);
                const baseTransform = transformStyles[i] || 'none';
                gsap.to(card, {
                    transform: baseTransform,
                    duration: 0.4,
                    ease: 'back.out(1.4)',
                    overwrite: 'auto'
                });
            });
        };

        cards.forEach((card, idx) => {
            // Apply initial transforms
            gsap.set(card, { transform: transformStyles[idx] || 'none' });

            card.addEventListener('mouseenter', () => pushSiblings(idx));
            card.addEventListener('mouseleave', resetSiblings);
        });
    }

    // --- Interactive Tilted Card Logic (Mulberry & JusBrowse) ---
    const containers = document.querySelectorAll('.app-image-container');
    const rotateAmplitude = 14;
    const scaleOnHover = 1.1;

    containers.forEach(container => {
        const caption = container.querySelector('.tilted-card-caption');
        const cards = container.querySelectorAll('.tilted-card-inner');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();
                const offsetX = e.clientX - rect.left - rect.width / 2;
                const offsetY = e.clientY - rect.top - rect.height / 2;

                const rotateX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
                const rotateY = (offsetX / (rect.width / 2)) * rotateAmplitude;

                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scaleOnHover})`;

                if (caption) {
                    caption.style.opacity = '1';
                    const relX = e.clientX - containerRect.left + 15;
                    const relY = e.clientY - containerRect.top + 15;
                    caption.style.transform = `translate(${relX}px, ${relY}px)`;
                    caption.textContent = card.getAttribute('data-caption') || '';
                }
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)`;
                if (caption) caption.style.opacity = '0';
            });
        });
    });


    // --- Grainient Background Logic (OGL) ---
    const grainContent = document.querySelector('.grainient-container');
    if (grainContent && window.ogl) {
        const { Renderer, Program, Mesh, Triangle } = window.ogl;

        const hexToRgb = hex => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            if (!result) return [1, 1, 1];
            return [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255];
        };

        const vertex = `#version 300 es
        in vec2 position;
        void main() { gl_Position = vec4(position, 0.0, 1.0); }`;

        const fragment = `#version 300 es
        precision highp float;
        uniform vec2 iResolution;
        uniform float iTime;
        uniform float uTimeSpeed;
        uniform float uColorBalance;
        uniform float uWarpStrength;
        uniform float uWarpFrequency;
        uniform float uWarpSpeed;
        uniform float uWarpAmplitude;
        uniform float uBlendAngle;
        uniform float uBlendSoftness;
        uniform float uRotationAmount;
        uniform float uNoiseScale;
        uniform float uGrainAmount;
        uniform float uGrainScale;
        uniform float uGrainAnimated;
        uniform float uContrast;
        uniform float uGamma;
        uniform float uSaturation;
        uniform vec2 uCenterOffset;
        uniform float uZoom;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        out vec4 fragColor;
        #define S(a,b,t) smoothstep(a,b,t)
        mat2 Rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);} 
        vec2 hash(vec2 p){p=vec2(dot(p,vec2(2127.1,81.17)),dot(p,vec2(1269.5,283.37)));return fract(sin(p)*43758.5453);} 
        float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);float n=mix(mix(dot(-1.0+2.0*hash(i+vec2(0.0,0.0)),f-vec2(0.0,0.0)),dot(-1.0+2.0*hash(i+vec2(1.0,0.0)),f-vec2(1.0,0.0)),u.x),mix(dot(-1.0+2.0*hash(i+vec2(0.0,1.0)),f-vec2(0.0,1.0)),dot(-1.0+2.0*hash(i+vec2(1.0,1.0)),f-vec2(1.0,1.0)),u.x),u.y);return 0.5+0.5*n;}
        void mainImage(out vec4 o, vec2 C){
          float t=iTime*uTimeSpeed;
          vec2 uv=C/iResolution.xy;
          float ratio=iResolution.x/iResolution.y;
          vec2 tuv=uv-0.5+uCenterOffset;
          tuv/=max(uZoom,0.001);
          float degree=noise(vec2(t*0.1,tuv.x*tuv.y)*uNoiseScale);
          tuv.y*=1.0/ratio;
          tuv*=Rot(radians((degree-0.5)*uRotationAmount+180.0));
          tuv.y*=ratio;
          float frequency=uWarpFrequency;
          float ws=max(uWarpStrength,0.001);
          float amplitude=uWarpAmplitude/ws;
          float warpTime=t*uWarpSpeed;
          tuv.x+=sin(tuv.y*frequency+warpTime)/amplitude;
          tuv.y+=sin(tuv.x*(frequency*1.5)+warpTime)/(amplitude*0.5);
          vec3 colLav=uColor1;
          vec3 colOrg=uColor2;
          vec3 colDark=uColor3;
          float b=uColorBalance;
          float s=max(uBlendSoftness,0.0);
          mat2 blendRot=Rot(radians(uBlendAngle));
          float blendX=(tuv*blendRot).x;
          float edge0=-0.3-b-s;
          float edge1=0.2-b+s;
          float v0=0.5-b+s;
          float v1=-0.3-b-s;
          vec3 layer1=mix(colDark,colOrg,S(edge0,edge1,blendX));
          vec3 layer2=mix(colOrg,colLav,S(edge0,edge1,blendX));
          vec3 col=mix(layer1,layer2,S(v0,v1,tuv.y));
          vec2 grainUv=uv*max(uGrainScale,0.001);
          if(uGrainAnimated>0.5){grainUv+=vec2(iTime*0.05);} 
          float grain=fract(sin(dot(grainUv,vec2(12.9898,78.233)))*43758.5453);
          col+=(grain-0.5)*uGrainAmount;
          col=(col-0.5)*uContrast+0.5;
          float luma=dot(col,vec3(0.2126,0.7152,0.0722));
          col=mix(vec3(luma),col,uSaturation);
          col=pow(max(col,0.0),vec3(1.0/max(uGamma,0.001)));
          col=clamp(col,0.0,1.0);
          o=vec4(col,1.0);
        }
        void main(){
          vec4 o=vec4(0.0);
          mainImage(o,gl_FragCoord.xy);
          fragColor=o;
        }`;

        const renderer = new ogl.Renderer({ webgl: 2, alpha: true, antialias: false, dpr: Math.min(window.devicePixelRatio || 1, 2) });
        const gl = renderer.gl;
        grainContent.appendChild(gl.canvas);

        const geometry = new ogl.Triangle(gl);
        const program = new ogl.Program(gl, {
            vertex,
            fragment,
            uniforms: {
                iTime: { value: 0 },
                iResolution: { value: new Float32Array([1, 1]) },
                uTimeSpeed: { value: 0.25 },
                uColorBalance: { value: 0.0 },
                uWarpStrength: { value: 1.0 },
                uWarpFrequency: { value: 5.0 },
                uWarpSpeed: { value: 2.0 },
                uWarpAmplitude: { value: 50.0 },
                uBlendAngle: { value: 0.0 },
                uBlendSoftness: { value: 0.1 },
                uRotationAmount: { value: 500.0 },
                uNoiseScale: { value: 2.0 },
                uGrainAmount: { value: 0.08 },
                uGrainScale: { value: 2.0 },
                uGrainAnimated: { value: 1.0 },
                uContrast: { value: 1.7 },
                uGamma: { value: 0.95 },
                uSaturation: { value: 1.3 },
                uCenterOffset: { value: new Float32Array([0, 0]) },
                uZoom: { value: 0.9 },
                uColor1: { value: new Float32Array(hexToRgb('#c06de8')) },
                uColor2: { value: new Float32Array(hexToRgb('#00aaff')) },
                uColor3: { value: new Float32Array(hexToRgb('#0a0a14')) }
            }
        });

        const mesh = new ogl.Mesh(gl, { geometry, program });

        const resize = () => {
            const width = grainContent.offsetWidth;
            const height = grainContent.offsetHeight;
            renderer.setSize(width, height);
            program.uniforms.iResolution.value[0] = gl.drawingBufferWidth;
            program.uniforms.iResolution.value[1] = gl.drawingBufferHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        const loop = t => {
            program.uniforms.iTime.value = t * 0.001;
            renderer.render({ scene: mesh });
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }

    const initMagneticEffect = () => {
        const magneticElements = document.querySelectorAll('.magnetic-wrap');

        magneticElements.forEach((el) => {
            el.addEventListener('mousemove', function (e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                gsap.to(this, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            });

            el.addEventListener('mouseleave', function () {
                gsap.to(this, {
                    x: 0,
                    y: 0,
                    duration: 0.6,
                    ease: 'elastic.out(1, 0.3)'
                });
            });
        });
    };

    initMagneticEffect();
});
