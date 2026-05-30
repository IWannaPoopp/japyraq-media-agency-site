import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { motion, useInView, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  ArrowUpRight,
  BadgeCheck,
  Camera,
  ChevronRight,
  Clapperboard,
  AtSign,
  LineChart,
  MapPin,
  Megaphone,
  Moon,
  MessageCircle,
  MousePointer2,
  Play,
  Sparkles,
  Sun,
  Target
} from "lucide-react";
import "./styles.css";

gsap.registerPlugin(ScrollTrigger);

const LIGHT_LOGO = "/brand/japyraq-logo-light.png";
const DARK_LOGO = "/brand/japyraq-logo-dark.png";
const WHATSAPP_NUMBER = "77789800485";
const DEFAULT_WHATSAPP_MESSAGE = "Здравствуйте! Хочу обсудить проект с Japyraq Media Agency.";

function createWhatsAppUrl(message = DEFAULT_WHATSAPP_MESSAGE) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function getInitialTheme() {
  if (typeof window === "undefined") return "light";
  const saved = window.localStorage.getItem("japyraq-theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

const services = [
  {
    icon: Camera,
    title: "Контент-продакшн",
    text: "Фото, видео, рилс, сторис и визуальные системы, которые держат ленту живой и узнаваемой.",
    tags: ["Рилс", "Сторис", "Фото"]
  },
  {
    icon: Megaphone,
    title: "SMM под ключ",
    text: "Стратегия, контент-план, упаковка профиля, публикации и регулярная аналитика роста.",
    tags: ["Стратегия", "Постинг", "Аналитика"]
  },
  {
    icon: Clapperboard,
    title: "Съёмка мероприятий",
    text: "Оперативная съёмка событий для брендов: фото, видео, рилс, сторис и монтаж коротких роликов в день мероприятия.",
    tags: ["Ивенты", "Рекап", "Лайв"]
  },
  {
    icon: Target,
    title: "Запуски и реклама",
    text: "Креативы, воронки, таргет и посадочные сценарии, чтобы внимание превращалось в заявки.",
    tags: ["Реклама", "Воронки", "Заявки"]
  },
  {
    icon: MousePointer2,
    title: "Создание сайтов",
    text: "Лендинги и сайты под заявки: структура, дизайн, адаптив, анимации и понятный путь клиента до WhatsApp.",
    tags: ["Лендинг", "Дизайн", "Заявки"]
  },
  {
    icon: Play,
    title: "3D ролики и VFX",
    text: "Имиджевые 3D-визуалы, продуктовые анимации, VFX-вставки и ролики, которые выделяют бренд в ленте.",
    tags: ["3D", "VFX", "Motion"]
  },
  {
    icon: Sparkles,
    title: "AI ролики",
    text: "AI-видео для рекламы и соцсетей: генерация сцен, быстрые креативы, стилизация и адаптация под Reels.",
    tags: ["AI video", "Reels", "Креативы"]
  }
];

const cases = [
  {
    name: "Event coverage",
    label: "Фото + видео",
    result: "ивенты / форумы / бренды",
    kind: "VIDEO",
    text: "Репортажная съёмка мероприятий для брендов: короткие ролики, фотоотчёт, сторис и быстрый монтаж для Instagram в день события.",
    tags: ["репортаж", "reels", "stories"],
    gradient: "event",
    href: "https://www.instagram.com/p/DQAI7mciO2k/"
  },
  {
    name: "Food & product content",
    label: "Контент для бренда",
    result: "кафе / рестораны / товары",
    kind: "PHOTO",
    text: "Предметные и фуд-съёмки для ленты, меню, сторис и рекламных креативов: чистый визуал, детали продукта и продающие ракурсы.",
    tags: ["food", "product", "ads"],
    gradient: "food",
    href: "https://www.instagram.com/p/DO9GmtIiBMs/?img_index=1"
  },
  {
    name: "Drone & mobile reels",
    label: "Вертикальные видео",
    result: "дрон / мобилография / монтаж",
    kind: "REELS",
    text: "Динамичные вертикальные ролики для Instagram и TikTok: съёмка на площадке, дрон-кадры, монтаж и адаптация под соцсети.",
    tags: ["drone", "mobile", "shorts"],
    gradient: "drone",
    href: "https://www.instagram.com/p/DPBVe1tCHcz/"
  },
  {
    name: "@chessinedu",
    label: "Instagram-ведение",
    result: "шахматы в образовании / регионы РК",
    kind: "SMM",
    text: "Ведём Instagram проекта и собираем контент из разных регионов Казахстана: события, участники, образовательные инициативы и репортажи.",
    tags: ["smm", "education", "kazakhstan"],
    gradient: "chess",
    href: "https://www.instagram.com/chessinedu/"
  }
];

const clients = [
  { name: "Freedom Broker", wordmark: true },
  { name: "BI Group", logo: "/clients-mono/bi-group.png" },
  { name: "HONOR", logo: "/clients-mono/honor.png" },
  { name: "Salam Bro", logo: "/clients-mono/salam-bro.png" },
  { name: "H&M", logo: "/clients-mono/hm.png" },
  { name: "Flash Energy Drink", logo: "/clients-mono/flash-energy.png" }
];

const process = [
  "Бриф и аудит",
  "Стратегия и визуальная система",
  "Съёмка, монтаж, публикации",
  "Аналитика и рост"
];

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
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
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

function App() {
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
    const service = String(formData.get("service") || "").trim();
    const task = String(formData.get("task") || "").trim();
    const message = [
      "Здравствуйте! Хочу обсудить проект с Japyraq Media Agency.",
      name ? `Имя: ${name}` : "",
      contact ? `Контакт: ${contact}` : "",
      service ? `Направление: ${service}` : "",
      task ? `Задача: ${task}` : ""
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

  const marquee = useMemo(() => ["SMM", "КОНТЕНТ", "ИВЕНТЫ", "РИЛС", "РЕКЛАМА", "СТРАТЕГИЯ"], []);

  return (
    <>
      <Particles />
      <header className="site-header">
        <a href="#top" className="brand" aria-label="Clients of Japyraq Media Agency">
          <img src={logoSrc} alt="" />
        </a>
        <nav>
          <a href="#services">Услуги</a>
          <a href="#cases">Кейсы</a>
          <a href="#contact">Контакты</a>
        </nav>
        <div className="header-actions">
          <button
            className="theme-toggle"
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={isDark ? "Включить светлую тему" : "Включить тёмную тему"}
            title={isDark ? "Светлая тема" : "Тёмная тема"}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <a className="header-link" href="https://www.instagram.com/japyraq.media.agency/" target="_blank" rel="noreferrer">
            <AtSign size={18} />
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
                Креативное медиа-агентство
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <h1>Контент и SMM, которые делают бренд заметным каждый день</h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="hero-text">
                Japyraq Media Agency помогает бизнесу выглядеть уверенно в соцсетях: создаём контент, ведём Instagram,
                снимаем события и запускаем кампании, которые приводят заявки.
              </p>
            </Reveal>
            <Reveal className="hero-actions" delay={0.24}>
              <a className="btn primary" href={createWhatsAppUrl()} target="_blank" rel="noreferrer">
                Обсудить проект
                <ArrowUpRight size={18} />
              </a>
              <a className="btn ghost" href="#cases">
                Смотреть подход
                <ChevronRight size={18} />
              </a>
            </Reveal>
          </div>

          <Reveal className="hero-visual" delay={0.18}>
            <div className="phone-stack" data-parallax="-10">
              <div className="story-card story-a">
                <span>РИЛС</span>
                <strong>9:16</strong>
              </div>
              <div className="story-card story-b">
                <Play size={34} fill="currentColor" />
                <p>Рекап события</p>
              </div>
              <div className="insight-panel">
                <LineChart size={20} />
                <div>
                  <b>+62%</b>
                  <span>органический охват</span>
                </div>
              </div>
            </div>
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
            <p className="eyebrow">Почему это работает</p>
            <h2>Системный контент вместо случайных публикаций</h2>
          </Reveal>
          <div className="metrics-grid">
            <Counter value={100} suffix="+" label="реализованных проектов" />
            <Counter value={48} suffix="ч" label="на быстрый монтаж ивент-рекапа" />
            <Counter value={17} suffix="+" label="регионов Казахстана: у нас есть люди в городах по всей стране для съёмок, контента и ведения проектов" />
          </div>
        </section>

        <section className="services" id="services">
          <Reveal className="section-intro wide">
            <p className="eyebrow">Услуги</p>
            <h2>Собираем медиа-систему под вашу цель</h2>
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

        <section className="cases" id="cases">
          <Reveal className="section-intro">
            <p className="eyebrow">Кейсы из Instagram</p>
            <h2>Instagram-кейсы и контент из регионов Казахстана</h2>
          </Reveal>
          <div className="case-grid">
            {cases.map((item, index) => (
              <Reveal key={item.name} delay={index * 0.08}>
                <a className="case-link" href={item.href} target="_blank" rel="noreferrer" aria-label={`Открыть кейс ${item.name} в Instagram`}>
                  <TiltCard className="case-card">
                    <div className={`case-media case-media-${item.gradient}`}>
                      <div className="case-device">
                        <span>{item.kind}</span>
                        <strong>{String(index + 1).padStart(2, "0")}</strong>
                      </div>
                      <div className="case-play">
                        <ArrowUpRight size={20} />
                      </div>
                    </div>
                    <div className="case-copy">
                      <p>{item.label}</p>
                      <h3>{item.name}</h3>
                      <strong>{item.result}</strong>
                      <span>{item.text}</span>
                      <div className="case-tags">
                        {item.tags.map((tag) => (
                          <em key={tag}>#{tag}</em>
                        ))}
                      </div>
                    </div>
                  </TiltCard>
                </a>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="trust" id="trust">
          <Reveal className="section-intro wide">
            <p className="eyebrow">Нам доверяют</p>
            <h2>Снимаем мероприятия и контент для сильных брендов</h2>
            <p>В портфеле Japyraq Media Agency — съёмки и контент для крупных компаний. У нас есть люди в городах Казахстана: снимаем мероприятия, собираем рилс, сторис и фотоотчёты без привязки к одному городу.</p>
          </Reveal>
          <Reveal>
            <div className="client-logo-marquee" aria-label="??????? Japyraq Media Agency">
              <div>
                {[...clients, ...clients, ...clients, ...clients].map((client, index) => (
                  <span className="client-logo-item" key={client.name + '-' + index}>
                    {client.wordmark ? (
                      <strong className="freedom-wordmark">Freedom<br />Broker</strong>
                    ) : (
                      <img src={client.logo} alt={client.name} loading="lazy" />
                    )}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        <section className="workflow" id="workflow">
          <Reveal className="workflow-copy">
            <p className="eyebrow">Процесс</p>
            <h2>Прозрачно от первой идеи до отчёта</h2>
            <p>
              Команда заранее планирует съёмки, рубрики и рекламные гипотезы, поэтому контент выходит регулярно,
              а решения принимаются по цифрам.
            </p>
          </Reveal>
          <div className="steps">
            {process.map((step, index) => (
              <Reveal key={step} delay={index * 0.06}>
                <div className="step">
                  <span>{index + 1}</span>
                  <p>{step}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="proof">
          <Reveal>
            <div className="proof-card">
              <BadgeCheck size={30} />
              <blockquote>
                “Сильный Instagram сейчас выглядит не как витрина, а как медиа: регулярно, живо, понятно и с точкой
                входа для клиента.”
              </blockquote>
              <p>Japyraq Media Agency</p>
            </div>
          </Reveal>
        </section>

        <section className="contact" id="contact">
          <Reveal className="contact-copy">
            <p className="eyebrow">Заявка</p>
            <h2>Расскажите, какой результат нужен в соцсетях</h2>
            <div className="contact-links">
              <a href="https://www.instagram.com/japyraq.media.agency/" target="_blank" rel="noreferrer">
                <AtSign size={18} />
                @japyraq.media.agency
              </a>
              <a href={createWhatsAppUrl()} target="_blank" rel="noreferrer">
                <MessageCircle size={18} />
                WhatsApp +7 778 980 04 85
              </a>
              <span>
                <MapPin size={18} />
                Казахстан
              </span>
            </div>
          </Reveal>

          <Reveal className="form-shell" delay={0.08}>
            <form onSubmit={handleLeadSubmit}>
              <label>
                Имя
                <input name="name" type="text" placeholder="Как к вам обращаться?" />
              </label>
              <label>
                Контакт
                <input name="contact" type="text" placeholder="Instagram, WhatsApp или телефон" />
              </label>
              <label>
                Что нужно?
                <select name="service" defaultValue="">
                  <option value="" disabled>
                    Выберите направление
                  </option>
                  <option>SMM под ключ</option>
                  <option>Контент-съёмка</option>
                  <option>Съёмка мероприятий</option>
                  <option>Реклама и запуск</option>
                  <option>Создание сайта</option>
                  <option>3D ролик / VFX</option>
                  <option>AI ролик</option>
                </select>
              </label>
              <label>
                Задача
                <textarea name="task" placeholder="Коротко опишите бренд, нишу и цель" />
              </label>
              <button className="btn primary" type="submit">
                Написать в WhatsApp
                <MousePointer2 size={18} />
              </button>
            </form>
          </Reveal>
        </section>
      </main>

      <footer>
        <span>Japyraq Media Agency © {year}</span>
        <a href={createWhatsAppUrl()} target="_blank" rel="noreferrer">
          <MessageCircle size={17} />
          Написать в WhatsApp
        </a>
      </footer>
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
