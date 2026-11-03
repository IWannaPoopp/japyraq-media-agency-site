import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { motion, useInView, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  ArrowUpRight,
  Camera,
  ChevronRight,
  Clapperboard,
  Clock,
  FileCheck,
  MapPin,
  Megaphone,
  Moon,
  MessageCircle,
  MousePointer2,
  Play,
  Repeat,
  Sparkles,
  Sun,
  Target,
  Users
} from "lucide-react";
import { LANGS, content, langFromPath } from "./content.js";
import "./styles.css";

gsap.registerPlugin(ScrollTrigger);

const LIGHT_LOGO = "/brand/japyraq-logo-light.png";
const DARK_LOGO = "/brand/japyraq-logo-dark.png";
const WHATSAPP_NUMBER = "77789800485";
function createWhatsAppUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function getInitialTheme() {
  if (typeof window === "undefined") return "light";
  const saved = window.localStorage.getItem("japyraq-theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

const serviceIcons = [Camera, Megaphone, Clapperboard, Target, MousePointer2, Play, Sparkles];
const starterIcons = [Play, Clapperboard, Camera];
const guaranteeIcons = [Clock, Repeat, FileCheck, Users, MapPin];

const caseMedia = [
  { kind: "EVENT", cover: "/cases/shymkent.jpg", video: "/cases/shymkent.mp4", href: "https://www.instagram.com/reel/DeFQ4IvB2De/" },
  { kind: "VIDEO", cover: "/cases/event.jpg", video: "/cases/event.mp4", href: "https://www.instagram.com/p/DQAI7mciO2k/" },
  { kind: "PHOTO", cover: "/cases/food.jpg", href: "https://www.instagram.com/p/DO9GmtIiBMs/?img_index=1" },
  { kind: "REELS", cover: "/cases/drone.jpg", video: "/cases/drone.mp4", href: "https://www.instagram.com/p/DPBVe1tCHcz/" },
  { kind: "3D", cover: "/cases/game.jpg", video: "/cases/game.mp4", href: "https://www.instagram.com/reel/DV_FsZPDETD/" },
  { kind: "SMM", cover: "/cases/chessinedu-avatar.jpg", fit: "logo", href: "https://www.instagram.com/chessinedu/" }
];

const heroIntroMedia = [
  { cover: "/cases/hero-cosmetic.jpg", video: "/cases/hero-cosmetic.mp4" },
  { cover: "/cases/hero-forte.jpg", video: "/cases/hero-forte.mp4" },
  { cover: "/cases/hero-expert.jpg", video: "/cases/hero-expert.mp4" }
];

const clients = [
  { name: "BI Group", logo: "/clients/bi-group.svg" },
  { name: "HONOR", logo: "/clients/honor.svg", size: "sm" },
  { name: "H&M", logo: "/clients/hm.svg" },
  { name: "Freedom", logo: "/clients/freedom.svg", size: "sm" },
  { name: "Salam Bro", logo: "/clients/salam-bro-color.png", tile: "#003d7b" },
  { name: "Hyundai", logo: "/clients/hyundai.svg" }
];

function withText(media, texts) {
  return media.map((item, index) => ({ ...item, ...texts[index] }));
}

function InstagramIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.6" cy="6.4" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function CaseMedia({ item }) {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduceMotion) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.45 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reduceMotion]);

  return (
    <>
      <img className="case-cover" src={item.cover} alt={item.name} loading="lazy" />
      {item.video && !reduceMotion && (
        <video
          ref={videoRef}
          className="case-cover case-video"
          src={item.video}
          poster={item.cover}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          onPlaying={(event) => event.currentTarget.classList.add("is-playing")}
        />
      )}
    </>
  );
}

const REEL_MS = 3400;

function HeroReel({ reels, t }) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (reduceMotion) return undefined;
    const slide = window.setInterval(() => setActive((i) => (i + 1) % reels.length), REEL_MS);
    const clock = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => {
      window.clearInterval(slide);
      window.clearInterval(clock);
    };
  }, [reduceMotion, reels.length]);

  const onMove = (event) => {
    const node = wrapRef.current;
    if (!node || window.matchMedia("(pointer: coarse)").matches) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty("--rx", `${((event.clientY - rect.top) / rect.height - 0.5) * -8}deg`);
    node.style.setProperty("--ry", `${((event.clientX - rect.left) / rect.width - 0.5) * 10}deg`);
  };

  const onLeave = () => {
    wrapRef.current?.style.setProperty("--rx", "0deg");
    wrapRef.current?.style.setProperty("--ry", "0deg");
  };

  const current = reels[active];
  const rec = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <div className="reel-stage" ref={wrapRef} onMouseMove={onMove} onMouseLeave={onLeave} data-parallax="-10">
      <div className="reel-glow" aria-hidden="true" />
      <div className="reel-phone">
        {reels.map((item, index) =>
          index === active && item.video && !reduceMotion ? (
            <video
              key={item.cover}
              className="reel-frame is-active"
              src={item.video}
              poster={item.cover}
              autoPlay
              muted
              loop
              playsInline
              aria-label={item.name}
            />
          ) : (
            <img
              key={item.cover}
              className={`reel-frame ${index === active ? "is-active" : ""}`}
              src={item.cover}
              alt={index === active ? item.name : ""}
            />
          )
        )}
        <div className="reel-shade" aria-hidden="true" />
        <div className="reel-bars" aria-hidden="true">
          {reels.map((item, index) => (
            <span key={item.cover} className={index < active ? "done" : ""}>
              {index === active && <i key={active} style={{ animationDuration: `${REEL_MS}ms` }} />}
            </span>
          ))}
        </div>
        <div className="reel-rec" aria-hidden="true">
          <b />
          REC {rec}
        </div>
        <div className="reel-caption" key={active}>
          <p>{current.label}</p>
          <strong>{current.name}</strong>
        </div>
      </div>
      <div className="reel-chip reel-chip-a">
        <Clock size={18} />
        <div>
          <b>{t.hero.chipA[0]}</b>
          <span>{t.hero.chipA[1]}</span>
        </div>
      </div>
      <div className="reel-chip reel-chip-b">
        <MapPin size={18} />
        <div>
          <b>{t.hero.chipB[0]}</b>
          <span>{t.hero.chipB[1]}</span>
        </div>
      </div>
      <div className="reel-chip reel-chip-c">
        <Play size={16} fill="currentColor" />
        <b>9:16</b>
      </div>
    </div>
  );
}

function Particles() {
  const canvasRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduceMotion) return undefined;
    const ctx = canvas.getContext("2d", { alpha: true });
    let frame = 0;
    let raf = 0;
    let width = 0;
    let height = 0;
    let particles = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = width < 700 ? 26 : 48;
      particles = Array.from({ length: count }, (_, index) => ({
        x: (index * 149 + Math.random() * width) % width,
        y: Math.random() * height,
        r: Math.random() * 1.8 + 0.8,
        vx: (Math.random() - 0.5) * 0.18,
        vy: Math.random() * 0.18 + 0.04,
        alpha: Math.random() * 0.34 + 0.16
      }));
    };

    const draw = () => {
      frame += 1;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(15, 127, 120, 0.28)";
      particles.forEach((p, index) => {
        p.x += p.vx + Math.sin((frame + index) * 0.01) * 0.05;
        p.y += p.vy;
        if (p.y > height + 8) p.y = -8;
        if (p.x < -8) p.x = width + 8;
        if (p.x > width + 8) p.x = -8;
        ctx.beginPath();
        ctx.globalAlpha = p.alpha;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reduceMotion]);

  return <canvas ref={canvasRef} className="particle-canvas" aria-hidden="true" />;
}

function useCountUp(value, suffix = "") {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!inView) return undefined;
    setDisplay(0);
    const target = { value: 0 };
    const tween = gsap.to(target, {
      value,
      duration: 1.7,
      ease: "power3.out",
      onUpdate: () => setDisplay(Math.round(target.value))
    });
    return () => tween.kill();
  }, [inView, value]);

  return { ref, label: `${display}${suffix}` };
}

function Counter({ value, suffix, label }) {
  const count = useCountUp(value, suffix);
  return (
    <div className="metric" ref={count.ref}>
      <strong>{count.label}</strong>
      <span>{label}</span>
    </div>
  );
}

function Reveal({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 34, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function TiltCard({ children, className = "" }) {
  const ref = useRef(null);

  const onMove = (event) => {
    const node = ref.current;
    if (!node || window.matchMedia("(pointer: coarse)").matches) return;
    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    node.style.transform = `perspective(900px) rotateX(${y * -5}deg) rotateY(${x * 6}deg) translateY(-6px)`;
  };

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div ref={ref} className={`tilt-card ${className}`} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </div>
  );
}

function App({ lang = "ru" }) {
  const t = content[lang] || content.ru;
  const services = withText(serviceIcons.map((icon) => ({ icon })), t.services.items);
  const starters = withText(starterIcons.map((icon) => ({ icon })), t.starters.items);
  const guarantees = withText(guaranteeIcons.map((icon) => ({ icon })), t.guarantees.items);
  const cases = withText(caseMedia, t.cases.items);
  const heroReels = [...withText(heroIntroMedia, t.heroIntro), ...cases.filter((item) => item.fit !== "logo")];
  const cityNames = t.cities.items.map((item) => item.city);
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: t.meta.htmlLang,
    mainEntity: t.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a }
    }))
  };
  const year = new Date().getFullYear();
  const reduceMotion = useReducedMotion();
  const [theme, setTheme] = useState(getInitialTheme);
  const isDark = theme === "dark";
  const logoSrc = isDark ? DARK_LOGO : LIGHT_LOGO;

  const handleLeadSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const contact = String(formData.get("contact") || "").trim();
    const city = String(formData.get("city") || "").trim();
    const service = String(formData.get("service") || "").trim();
    const task = String(formData.get("task") || "").trim();
    const message = [
      t.wa.default,
      name ? `${t.wa.name}: ${name}` : "",
      contact ? `${t.wa.contact}: ${contact}` : "",
      city ? `${t.wa.city}: ${city}` : "",
      service ? `${t.wa.service}: ${service}` : "",
      task ? `${t.wa.task}: ${task}` : ""
    ].filter(Boolean).join("\n");

    window.location.href = createWhatsAppUrl(message);
  };

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("japyraq-theme", theme);
  }, [theme]);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    const shouldResetTop = !window.location.hash;
    if (shouldResetTop) window.scrollTo(0, 0);
    const topReset = shouldResetTop
      ? [60, 180, 420, 900, 1300, 1900].map((delay) => window.setTimeout(() => window.scrollTo(0, 0), delay))
      : [];
    if (reduceMotion) {
      return () => topReset.forEach((timer) => window.clearTimeout(timer));
    }
    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.1,
      smoothWheel: true
    });
    const update = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    if (shouldResetTop) {
      lenis.scrollTo(0, { immediate: true });
      [220, 680, 1200, 1800].forEach((delay) => {
        topReset.push(window.setTimeout(() => lenis.scrollTo(0, { immediate: true }), delay));
      });
    }

    const ctx = gsap.context(() => {
      gsap.utils.toArray("[data-parallax]").forEach((item) => {
        gsap.to(item, {
          yPercent: Number(item.dataset.parallax),
          ease: "none",
          scrollTrigger: {
            trigger: item,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8
          }
        });
      });
    });

    return () => {
      topReset.forEach((timer) => window.clearTimeout(timer));
      ctx.revert();
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, [reduceMotion]);

  const marquee = t.marquee;
  const waUrl = createWhatsAppUrl(t.wa.default);

  return (
    <>
      <Particles />
      <header className="site-header">
        <a href={LANGS[lang].path} className="brand" aria-label="Japyraq Media Agency">
          <img src={logoSrc} alt="" />
        </a>
        <nav>
          <a href="#services">{t.nav.services}</a>
          <a href="#start">{t.nav.start}</a>
          <a href="#cases">{t.nav.cases}</a>
          <a href="#cities">{t.nav.cities}</a>
          <a href="#faq">{t.nav.faq}</a>
          <a href="#contact">{t.nav.contact}</a>
        </nav>
        <div className="header-actions">
          <div className="lang-switch" role="navigation" aria-label={t.ui.langLabel}>
            {Object.entries(LANGS).map(([code, item]) => (
              <a key={code} href={item.path} hrefLang={item.hreflang} className={code === lang ? "is-active" : ""} aria-current={code === lang ? "page" : undefined}>
                {item.label}
              </a>
            ))}
          </div>
          <button
            className="theme-toggle"
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={isDark ? t.ui.themeToLight : t.ui.themeToDark}
            title={isDark ? t.ui.themeLight : t.ui.themeDark}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <a className="header-link" href="https://www.instagram.com/japyraq.media.agency/" target="_blank" rel="noreferrer">
            <InstagramIcon size={18} />
            Instagram
          </a>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <Reveal>
              <p className="eyebrow">
                <Sparkles size={16} />
                {t.hero.eyebrow}
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <h1>{t.hero.titleStart}<span className="accent">{t.hero.titleAccent}</span>{t.hero.titleEnd || ""}</h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="hero-text">
                {t.hero.text}
              </p>
            </Reveal>
            <Reveal className="hero-actions" delay={0.24}>
              <a className="btn primary" href={waUrl} target="_blank" rel="noreferrer">
                {t.hero.cta}
                <ArrowUpRight size={18} />
              </a>
              <a className="btn ghost" href="#cases">
                {t.hero.ghost}
                <ChevronRight size={18} />
              </a>
            </Reveal>
          </div>

          <Reveal className="hero-visual" delay={0.18}>
            <HeroReel reels={heroReels} t={t} />
          </Reveal>
        </section>

        <div className="marquee" aria-hidden="true">
          <div>
            {[...marquee, ...marquee, ...marquee].map((item, index) => (
              <span key={`${item}-${index}`}>{item}</span>
            ))}
          </div>
        </div>

        <section className="metrics-section">
          <Reveal className="section-intro">
            <p className="eyebrow">{t.metrics.eyebrow}</p>
            <h2>{t.metrics.title}</h2>
          </Reveal>
          <div className="metrics-grid">
            {t.metrics.items.map((item) => (
              <Counter key={item.label} value={item.value} suffix={item.suffix} label={item.label} />
            ))}
          </div>
          <Reveal>
            <p className="city-row">
              <MapPin size={16} />
              {t.metrics.cityRow} {cityNames.slice(0, 8).join(", ")} {t.metrics.cityMore}
            </p>
          </Reveal>
        </section>

        <section className="services" id="services">
          <Reveal className="section-intro wide">
            <p className="eyebrow">{t.services.eyebrow}</p>
            <h2>{t.services.title}</h2>
          </Reveal>
          <div className="service-grid">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Reveal key={service.title} delay={index * 0.05}>
                  <TiltCard className="service-card">
                    <Icon size={26} />
                    <h3>{service.title}</h3>
                    <p>{service.text}</p>
                    <div className="tag-row">
                      {service.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </TiltCard>
                </Reveal>
              );
            })}
          </div>
        </section>

        <section className="starters" id="start">
          <Reveal className="section-intro wide">
            <p className="eyebrow">{t.starters.eyebrow}</p>
            <h2>{t.starters.title}</h2>
            <p>{t.starters.text}</p>
          </Reveal>
          <div className="starter-grid">
            {starters.map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title} delay={index * 0.06}>
                  <div className="starter-card">
                    <span className="starter-tag">
                      <Icon size={16} />
                      {item.tag}
                    </span>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                    <a className="btn ghost" href={createWhatsAppUrl(item.message)} target="_blank" rel="noreferrer">
                      {t.starters.button}
                      <ArrowUpRight size={18} />
                    </a>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <Reveal>
            <div className="credit-note">
              <strong>100%</strong>
              <p>{t.starters.credit}</p>
            </div>
          </Reveal>
        </section>

        <section className="cases" id="cases">
          <Reveal className="section-intro">
            <p className="eyebrow">{t.cases.eyebrow}</p>
            <h2>{t.cases.title}</h2>
          </Reveal>
          <div className="case-grid">
            {cases.map((item, index) => (
              <Reveal key={item.name} delay={index * 0.06}>
                <a className="case-link" href={item.href} target="_blank" rel="noreferrer" aria-label={`${t.cases.open} ${item.name}`}>
                  <article className={`case-tile ${item.fit === "logo" ? "case-tile-logo" : ""}`}>
                    <CaseMedia item={item} />
                    <div className="case-shade" />
                    <span className="case-kind">{item.kind}</span>
                    <span className="case-arrow">
                      <ArrowUpRight size={18} />
                    </span>
                    <div className="case-info">
                      <p>{item.label}</p>
                      <h3>{item.name}</h3>
                      <strong>{item.result}</strong>
                      <span>{item.text}</span>
                    </div>
                  </article>
                </a>
              </Reveal>
            ))}
          </div>
          <p className="case-more">
            {t.cases.more}{" "}
            <a href="https://www.instagram.com/japyraq.media.agency/" target="_blank" rel="noreferrer">
              @japyraq.media.agency
            </a>
          </p>
        </section>

        <section className="cities" id="cities">
          <Reveal className="section-intro wide">
            <p className="eyebrow">{t.cities.eyebrow}</p>
            <h2>{t.cities.title}</h2>
            <p>{t.cities.text}</p>
          </Reveal>
          <div className="city-grid">
            {t.cities.items.map((item, index) => (
              <Reveal key={item.city} delay={(index % 4) * 0.05}>
                <article className="city-card">
                  <MapPin size={20} />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <a href={createWhatsAppUrl(t.cities.message(item.city))} target="_blank" rel="noreferrer">
                    {t.cities.order}
                    <ArrowUpRight size={16} />
                  </a>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="trust" id="trust">
          <Reveal className="section-intro wide">
            <p className="eyebrow">{t.trust.eyebrow}</p>
            <h2>{t.trust.title}</h2>
            <p>{t.trust.text}</p>
          </Reveal>
          <Reveal>
            <div className="client-logo-marquee" aria-label={t.trust.aria}>
              <div>
                {[...clients, ...clients, ...clients].map((client, index) => (
                  <span className="client-logo-item" key={client.name + '-' + index}>
                    <span className={`client-logo-tile ${client.size || ""}`} style={client.tile ? { background: client.tile } : undefined}>
                      <img src={client.logo} alt={index < clients.length ? client.name : ""} loading="lazy" />
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        <section className="workflow" id="workflow">
          <Reveal className="workflow-copy">
            <p className="eyebrow">{t.process.eyebrow}</p>
            <h2>{t.process.title}</h2>
            <p>{t.process.text}</p>
          </Reveal>
          <div className="steps">
            {t.process.items.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.06}>
                <div className="step">
                  <span>{index + 1}</span>
                  <div>
                    <em>{step.when}</em>
                    <p>{step.title}</p>
                    <small>{step.text}</small>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="guarantees" id="guarantees">
          <Reveal className="section-intro">
            <p className="eyebrow">{t.guarantees.eyebrow}</p>
            <h2>{t.guarantees.title}</h2>
          </Reveal>
          <div className="guarantee-grid">
            {guarantees.map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title} delay={index * 0.05}>
                  <div className="guarantee-card">
                    <Icon size={24} />
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        <section className="faq" id="faq">
          <Reveal className="section-intro">
            <p className="eyebrow">{t.faq.eyebrow}</p>
            <h2>{t.faq.title}</h2>
          </Reveal>
          <div className="faq-list">
            {t.faq.items.map((item) => (
              <details key={item.q} className="faq-item">
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        </section>

        <section className="contact" id="contact">
          <Reveal className="contact-copy">
            <p className="eyebrow">{t.contact.eyebrow}</p>
            <h2>{t.contact.title}</h2>
            <p className="contact-lead">{t.contact.text}</p>
            <div className="contact-links">
              <a href="https://www.instagram.com/japyraq.media.agency/" target="_blank" rel="noreferrer">
                <InstagramIcon size={18} />
                @japyraq.media.agency
              </a>
              <a href={waUrl} target="_blank" rel="noreferrer">
                <MessageCircle size={18} />
                WhatsApp +7 778 980 04 85
              </a>
              <span>
                <MapPin size={18} />
                {t.ui.country}
              </span>
            </div>
          </Reveal>

          <Reveal className="form-shell" delay={0.08}>
            <form onSubmit={handleLeadSubmit}>
              <label>
                {t.contact.name[0]}
                <input name="name" type="text" placeholder={t.contact.name[1]} />
              </label>
              <label>
                {t.contact.contact[0]}
                <input name="contact" type="text" placeholder={t.contact.contact[1]} />
              </label>
              <label>
                {t.contact.city[0]}
                <input name="city" type="text" placeholder={t.contact.city[1]} />
              </label>
              <label>
                {t.contact.service[0]}
                <select name="service" defaultValue="">
                  <option value="" disabled>
                    {t.contact.service[1]}
                  </option>
                  {t.contact.options.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
              <label>
                {t.contact.task[0]}
                <textarea name="task" placeholder={t.contact.task[1]} />
              </label>
              <button className="btn primary" type="submit">
                {t.contact.submit}
                <MousePointer2 size={18} />
              </button>
            </form>
          </Reveal>
        </section>
      </main>

      <a className="wa-float" href={waUrl} target="_blank" rel="noreferrer" aria-label={t.ui.writeWa}>
        <MessageCircle size={26} />
      </a>

      <footer>
        <span>Japyraq Media Agency © {year}</span>
        <a href={waUrl} target="_blank" rel="noreferrer">
          <MessageCircle size={17} />
          {t.ui.writeWa}
        </a>
      </footer>
    </>
  );
}

export default App;

if (typeof document !== "undefined") {
  const root = document.getElementById("root");
  root.replaceChildren();
  createRoot(root).render(<App lang={langFromPath(window.location.pathname)} />);
}
