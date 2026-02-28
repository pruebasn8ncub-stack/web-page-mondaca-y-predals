/* =============================================
   MONCADA & PEDRALS — Redesign v2
   JavaScript — Animations, Slider, Navigation
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ========================================
    // PRELOADER
    // ========================================
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
                document.body.style.overflow = '';
                // Trigger hero animations after loader
                triggerHeroAnimations();
            }, 2200);
        });

        // Fallback
        setTimeout(() => {
            if (!preloader.classList.contains('hidden')) {
                preloader.classList.add('hidden');
                document.body.style.overflow = '';
                triggerHeroAnimations();
            }
        }, 4000);
    }

    // ========================================
    // HERO ANIMATIONS
    // ========================================
    function triggerHeroAnimations() {
        const heroElements = document.querySelectorAll('.hero .anim-up');
        heroElements.forEach((el, i) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, 200 + (i * 150));
        });
    }

    // ========================================
    // HERO SLIDER (CaSE-inspired)
    // ========================================
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-nav-dot');
    let currentSlide = 0;
    let slideInterval;

    function goToSlide(index) {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        goToSlide(next);
    }

    function startSlider() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    // Dot click
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            clearInterval(slideInterval);
            goToSlide(parseInt(dot.dataset.slide));
            startSlider();
        });
    });

    if (slides.length > 0) {
        startSlider();
    }

    // ========================================
    // NAVIGATION
    // ========================================
    const navbar = document.getElementById('navbar');
    const topbar = document.getElementById('topbar');
    const burger = document.getElementById('navbarBurger');
    const mobileOverlay = document.getElementById('mobileOverlay');
    let lastScroll = 0;

    // Scroll behavior
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Navbar scroll state
        if (scrollY > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide topbar on scroll
        if (topbar) {
            if (scrollY > 60) {
                topbar.classList.add('hidden');
            } else {
                topbar.classList.remove('hidden');
            }
        }

        lastScroll = scrollY;
    });

    // Burger toggle
    if (burger && mobileOverlay) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            mobileOverlay.classList.toggle('open');
            document.body.style.overflow = mobileOverlay.classList.contains('open') ? 'hidden' : '';
        });

        // Close on link click
        const mobileLinks = mobileOverlay.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                mobileOverlay.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-link');

    function updateActiveNavLink() {
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);

    // ========================================
    // SCROLL REVEAL ANIMATIONS
    // ========================================
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // ========================================
    // COUNTER ANIMATION (Arainco-inspired)
    // ========================================
    const counters = document.querySelectorAll('[data-count]');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;
        countersAnimated = true;

        counters.forEach(counter => {
            const target = parseInt(counter.dataset.count);
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(target * eased);

                counter.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    // Observe stats for counter trigger
    const statsBar = document.querySelector('.hero-stats-bar');
    if (statsBar) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        statsObserver.observe(statsBar);
    }

    // ========================================
    // PROJECT FILTER
    // ========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter projects
            projectItems.forEach(item => {
                const category = item.dataset.category;

                if (filter === 'all' || category === filter) {
                    item.classList.remove('hidden');
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';

                    setTimeout(() => {
                        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.classList.add('hidden');
                    }, 400);
                }
            });
        });
    });

    // ========================================
    // CONTACT FORM
    // ========================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = `
                <span>Enviando...</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="0">
                        <animate attributeName="stroke-dashoffset" values="0;120" dur="1s" repeatCount="indefinite"/>
                    </circle>
                </svg>
            `;
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.innerHTML = `
                    <span>¡Mensaje Enviado!</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 6L9 17l-5-5"/>
                    </svg>
                `;
                submitBtn.style.background = '#38a169';

                setTimeout(() => {
                    contactForm.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                }, 3000);
            }, 1500);
        });
    }

    // ========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const topbarHeight = topbar && !topbar.classList.contains('hidden') ? topbar.offsetHeight : 0;
                const offset = navHeight + topbarHeight;

                window.scrollTo({
                    top: targetEl.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // PARALLAX SUBTLE EFFECT ON HERO
    // ========================================
    const heroSection = document.querySelector('.hero');

    if (heroSection && window.matchMedia('(min-width: 768px)').matches) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (scrollY < window.innerHeight) {
                const heroContent = document.querySelector('.hero-content');
                if (heroContent) {
                    heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
                    heroContent.style.opacity = 1 - (scrollY / (window.innerHeight * 0.8));
                }
            }
        });
    }

});
