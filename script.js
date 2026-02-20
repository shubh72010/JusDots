document.addEventListener('DOMContentLoaded', () => {
    // =============================================
    //   CINEMATIC ENGINE — Editorial Edition
    // =============================================

    // --- Lenis Smooth Scroll ---
    let lenis;
    if (window.Lenis) {
        lenis = new Lenis({
            duration: 1.1,
            easing: (t) => 1 - Math.pow(1 - t, 3),  // cubic ease-out, much snappier
            wheelMultiplier: 1.0,
            touchMultiplier: 1.5,
            lerp: 0.1,              // how much it catches up per frame — higher = snappier
            infinite: false,
        });

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(60, 1000);

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
    const isPointerFine = window.matchMedia("(pointer: fine)").matches;

    if (cursor && trail && isPointerFine) {
        let mx = window.innerWidth / 2, my = window.innerHeight / 2;
        let tx = mx, ty = my;

        document.addEventListener('mousemove', (e) => {
            mx = e.clientX;
            my = e.clientY;
        });

        const tick = () => {
            tx += (mx - tx) * 0.12;
            ty += (my - ty) * 0.12;
            cursor.style.left = mx + 'px';
            cursor.style.top = my + 'px';
            trail.style.left = tx + 'px';
            trail.style.top = ty + 'px';
            requestAnimationFrame(tick);
        };
        tick();
    }

    // --- Intro Screen ---
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

        let counter = { val: 0 };
        tl.to(introLogo, { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' }, 0);
        tl.to(introLine, { scaleX: 1, duration: 2, ease: 'power2.inOut' }, 0.3);
        tl.to(counter, {
            val: 100,
            duration: 2,
            ease: 'power2.inOut',
            onUpdate: () => {
                if (introCounter) introCounter.textContent = Math.round(counter.val);
            }
        }, 0.3);

        // Elegant upward wipe
        tl.to(introScreen, {
            yPercent: -100,
            duration: 1.4,
            ease: 'expo.inOut',
            onComplete: () => {
                introScreen.style.display = 'none';
            }
        }, '+=0.4');
    };

    runIntro();

    // --- Hero Reveal ---
    const revealHero = () => {
        const heroLines = document.querySelectorAll('.hero-line');
        const eyebrow = document.querySelector('.hero-eyebrow');
        const sub = document.querySelector('.hero-sub');
        const scrollHint = document.querySelector('.scroll-hint');

        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

        if (eyebrow) {
            tl.to(eyebrow, { opacity: 1, y: 0, duration: 1 }, 0);
        }

        heroLines.forEach((line, i) => {
            tl.to(line, {
                opacity: 1,
                y: 0,
                duration: 2.0,
            }, 0.3 + i * 0.2);
        });

        if (sub) {
            tl.to(sub, { opacity: 1, y: 0, duration: 1.6 }, 0.9);
        }

        if (scrollHint) {
            tl.to(scrollHint, { opacity: 1, y: 0, duration: 1 }, 1.2);
        }

        // Fade scroll hint on scroll
        if (scrollHint) {
            window.addEventListener('scroll', () => {
                scrollHint.style.opacity = Math.max(0, 1 - window.scrollY / 300);
            }, { passive: true });
        }
    };

    // --- Scroll-Triggered Animations ---
    const initScrollAnimations = () => {
        if (!window.ScrollTrigger) return;

        // --- Section Numbers: fade in from below ---
        document.querySelectorAll('.section-number').forEach(num => {
            gsap.fromTo(num,
                { opacity: 0, y: 40 },
                {
                    opacity: 1, y: 0, duration: 1.8, ease: 'power3.out',
                    scrollTrigger: {
                        trigger: num.closest('.product-section'),
                        start: 'top 80%',
                        toggleActions: 'play none none reverse',
                    }
                }
            );
        });

        // --- Product Sections: info + visual reveals ---
        document.querySelectorAll('.product-section').forEach((section) => {
            const info = section.querySelector('.product-info');
            const visual = section.querySelector('.product-visual');
            const isReverse = section.classList.contains('layout-split-reverse');

            if (info) {
                gsap.fromTo(info,
                    { opacity: 0, y: 60 },
                    {
                        opacity: 1, y: 0, duration: 2.0, ease: 'power4.out',
                        scrollTrigger: {
                            trigger: section,
                            start: 'top 70%',
                            toggleActions: 'play none none reverse',
                        }
                    }
                );
            }

            if (visual) {
                gsap.fromTo(visual,
                    { opacity: 0, y: 80, scale: 0.97 },
                    {
                        opacity: 1, y: 0, scale: 1, duration: 2.2, ease: 'power4.out',
                        scrollTrigger: {
                            trigger: section,
                            start: 'top 65%',
                            toggleActions: 'play none none reverse',
                        }
                    }
                );

                // Subtle parallax on images during scroll
                gsap.to(visual, {
                    y: -40,
                    scrollTrigger: {
                        trigger: section,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 2,
                    }
                });
            }

            // Badge fade
            const badge = section.querySelector('.badge');
            if (badge) {
                gsap.fromTo(badge,
                    { opacity: 0, y: 15 },
                    {
                        opacity: 1, y: 0, duration: 1, ease: 'power2.out',
                        scrollTrigger: {
                            trigger: section,
                            start: 'top 75%',
                            toggleActions: 'play none none reverse',
                        }
                    }
                );
            }
        });

        // --- Interstitial Reveals ---
        document.querySelectorAll('.interstitial').forEach((section) => {
            const text = section.querySelector('.interstitial-text');
            const caption = section.querySelector('.interstitial-caption');
            const label = section.querySelector('.interstitial-label');

            if (text) {
                gsap.fromTo(text,
                    { opacity: 0, y: 40 },
                    {
                        opacity: 1, y: 0, duration: 1.8, ease: 'power2.out',
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
                    opacity: 1, y: 0, duration: 1.2, delay: 0.3, ease: 'power2.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 60%',
                        toggleActions: 'play none none reverse',
                    }
                });
            }

            if (label) {
                gsap.fromTo(label,
                    { opacity: 0, scale: 1.05 },
                    {
                        opacity: 0.1, scale: 1, duration: 2, ease: 'power1.out',
                        scrollTrigger: {
                            trigger: section,
                            start: 'top 80%',
                            toggleActions: 'play none none reverse',
                        }
                    }
                );
            }
        });

        // --- Team Cards Stagger ---
        const teamCards = document.querySelectorAll('.team-card');
        if (teamCards.length) {
            gsap.fromTo(teamCards,
                { opacity: 0, y: 50 },
                {
                    opacity: 1, y: 0, duration: 1.6, stagger: 0.2, ease: 'expo.out',
                    scrollTrigger: {
                        trigger: '.team-section',
                        start: 'top 70%',
                        toggleActions: 'play none none reverse',
                    }
                }
            );
        }

        // --- Marquee scroll speed ---
        document.querySelectorAll('.marquee-track').forEach(track => {
            gsap.to(track, {
                scrollTrigger: {
                    trigger: track,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 2,
                },
                x: track.classList.contains('marquee-reverse') ? 100 : -100,
                ease: 'none',
            });
        });
    };


    // --- Menu Logic ---
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

    // Initial states
    gsap.set([panel, ...preLayers], { xPercent: 100 });
    gsap.set(panelItems, { yPercent: 140, rotate: 5 });

    const playOpen = () => {
        if (isBusy) return;
        isBusy = true;
        menuWrapper.setAttribute('data-open', 'true');

        const tl = gsap.timeline({
            onComplete: () => { isBusy = false; }
        });

        // Pre-layers
        preLayers.forEach((layer, i) => {
            tl.fromTo(layer, { xPercent: 100 }, {
                xPercent: 0, duration: 0.6, ease: 'power4.out'
            }, i * 0.06);
        });

        // Panel
        tl.fromTo(panel, { xPercent: 100 }, {
            xPercent: 0, duration: 0.7, ease: 'power4.out'
        }, preLayers.length * 0.06 + 0.08);

        // Items stagger
        tl.to(panelItems, {
            yPercent: 0,
            rotate: 0,
            duration: 1.1,
            ease: 'power4.out',
            stagger: 0.08
        }, ">-0.4");

        // Number reveal
        tl.to(panel, { '--sm-num-opacity': 1, duration: 0.6 }, ">-0.8");

        // Icon rotate
        gsap.to(smIcon, { rotate: 225, duration: 0.8, ease: 'power4.out' });

        // Text toggle
        gsap.to(textInner, { yPercent: -50, duration: 0.6, ease: 'power4.out' });
    };

    const playClose = () => {
        if (isBusy) return;
        isBusy = true;

        const all = [...preLayers, panel];
        gsap.to(all, {
            xPercent: 100,
            duration: 0.45,
            ease: 'power3.in',
            stagger: { each: 0.04, from: 'end' },
            onComplete: () => {
                gsap.set(panelItems, { yPercent: 140, rotate: 5 });
                gsap.set(panel, { '--sm-num-opacity': 0 });
                menuWrapper.removeAttribute('data-open');
                isBusy = false;
            }
        });

        gsap.to(smIcon, { rotate: 0, duration: 0.4, ease: 'power3.inOut' });
        gsap.to(textInner, { yPercent: 0, duration: 0.4, ease: 'power4.out' });
    };

    if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            isOpen = !isOpen;
            if (isOpen) playOpen();
            else playClose();
        });
    }

    // Close on click outside
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
                if (lenis) {
                    lenis.scrollTo(target, { duration: 1.5 });
                } else {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // --- Bounce Cards (DotNotes) ---
    const bounceContainer = document.querySelector('.bounceCardsContainer');
    if (bounceContainer) {
        const cards = bounceContainer.querySelectorAll('.card');
        const transformStyles = [
            'rotate(8deg) translate(-160px)',
            'rotate(4deg) translate(-80px)',
            'rotate(-2deg)',
            'rotate(-8deg) translate(80px)',
            'rotate(2deg) translate(160px)'
        ];

        // Entrance
        gsap.fromTo(cards,
            { scale: 0 },
            {
                scale: 1,
                stagger: 0.1,
                ease: 'power4.out',
                duration: 1,
                delay: 0.3,
                scrollTrigger: {
                    trigger: bounceContainer,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                }
            }
        );

        const getNoRotationTransform = (transformStr) => {
            const hasRotate = /rotate\([\s\S]*?\)/.test(transformStr);
            if (hasRotate) {
                return transformStr.replace(/rotate\([\s\S]*?\)/, 'rotate(0deg)');
            } else if (transformStr === 'none') {
                return 'rotate(0deg)';
            }
            return `${transformStr} rotate(0deg)`;
        };

        const getPushedTransform = (baseTransform, offsetX) => {
            const translateRegex = /translate\(([-0-9.]+)px\)/;
            const match = baseTransform.match(translateRegex);
            if (match) {
                const currentX = parseFloat(match[1]);
                const newX = currentX + offsetX;
                return baseTransform.replace(translateRegex, `translate(${newX}px)`);
            }
            return baseTransform === 'none'
                ? `translate(${offsetX}px)`
                : `${baseTransform} translate(${offsetX}px)`;
        };

        const pushSiblings = (hoveredIdx) => {
            cards.forEach((card, i) => {
                gsap.killTweensOf(card);
                const baseTransform = transformStyles[i] || 'none';

                if (i === hoveredIdx) {
                    gsap.to(card, {
                        transform: getNoRotationTransform(baseTransform),
                        duration: 0.5,
                        ease: 'power3.out',
                        overwrite: 'auto'
                    });
                } else {
                    const offsetX = i < hoveredIdx ? -140 : 140;
                    gsap.to(card, {
                        transform: getPushedTransform(baseTransform, offsetX),
                        duration: 0.5,
                        ease: 'power3.out',
                        delay: Math.abs(hoveredIdx - i) * 0.04,
                        overwrite: 'auto'
                    });
                }
            });
        };

        const resetSiblings = () => {
            cards.forEach((card, i) => {
                gsap.killTweensOf(card);
                gsap.to(card, {
                    transform: transformStyles[i] || 'none',
                    duration: 0.5,
                    ease: 'power3.out',
                    overwrite: 'auto'
                });
            });
        };

        cards.forEach((card, idx) => {
            gsap.set(card, { transform: transformStyles[idx] || 'none' });
            card.addEventListener('mouseenter', () => pushSiblings(idx));
            card.addEventListener('mouseleave', resetSiblings);
        });
    }

    // --- Tilted Cards (JusBrowse / Mulberry) ---
    const containers = document.querySelectorAll('.app-image-container');
    containers.forEach(container => {
        const caption = container.querySelector('.tilted-card-caption');
        const cards = container.querySelectorAll('.tilted-card-inner');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();
                const offsetX = e.clientX - rect.left - rect.width / 2;
                const offsetY = e.clientY - rect.top - rect.height / 2;

                const rotateX = (offsetY / (rect.height / 2)) * -10;
                const rotateY = (offsetX / (rect.width / 2)) * 10;

                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;

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

    // --- Magnetic Effect ---
    const initMagneticEffect = () => {
        document.querySelectorAll('.magnetic-wrap').forEach((el) => {
            el.addEventListener('mousemove', function (e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                gsap.to(this, {
                    x: x * 0.25,
                    y: y * 0.25,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            });

            el.addEventListener('mouseleave', function () {
                gsap.to(this, {
                    x: 0,
                    y: 0,
                    duration: 0.7,
                    ease: 'power3.out'
                });
            });
        });
    };

    initMagneticEffect();
});
