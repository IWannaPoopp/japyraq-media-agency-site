import React, { useEffect, useMemo, useRef, useState } from "react";
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
  AtSign,
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
  { name: "BI Group", logo: "/clients/bi-group.svg" },
  { name: "HONOR", logo: "/clients/honor.svg", size: "sm" },
  { name: "H&M", logo: "/clients/hm.svg" },
  { name: "Freedom", logo: "/clients/freedom.svg", size: "sm" },
  { name: "Salam Bro", logo: "/clients/salam-bro-color.png", tile: "#003d7b" },
  { name: "Hyundai", logo: "/clients/hyundai.svg" }
];

const starters = [
  {
    icon: Play,
    tag: "Reels",
    title: "Рилс-старт",
    text: "Три готовых вертикальных видео за один выезд: сценарии, съёмка до 2 часов, монтаж, цвет и субтитры. Готово за 5 рабочих дней.",
    message: "Здравствуйте! Хочу заказать Рилс-старт: 3 вертикальных видео."
  },
  {
    icon: Clapperboard,
    tag: "Мероприятия",
    title: "Экспресс-съёмка события",
    text: "Для презентаций, открытий и небольших ивентов: съёмка до 2 часов, фотоотчёт, рекап-ролик за 48 часов и сторис в день события.",
    message: "Здравствуйте! Хочу заказать экспресс-съёмку мероприятия."
  },
  {
    icon: Camera,
    tag: "Имидж",
    title: "Имиджевый ролик",
    text: "Ролик о компании, продукте или объекте для сайта, рекламы и соцсетей: сценарий, съёмка с дроном при необходимости, 60–90 сек и 2 нарезки.",
    message: "Здравствуйте! Хочу обсудить имиджевый ролик."
  }
];

const process = [
  { when: "День 1", title: "Бриф", text: "Созваниваемся на 20 минут, разбираем задачу, аудиторию и сроки." },
  { when: "1–2 дня", title: "План и договор", text: "Присылаем план съёмок, сценарии и договор. Вы утверждаете." },
  { when: "По графику", title: "Съёмка и монтаж", text: "Снимаем в вашем городе, монтируем и согласовываем с вами." },
  { when: "Каждый месяц", title: "Отчёт и рост", text: "Показываем цифры и предлагаем, что улучшить дальше." }
];

const cities = ["Алматы", "Астана", "Шымкент", "Караганда", "Актобе", "Атырау", "Павлодар", "Усть-Каменогорск"];

const faq = [
  {
    q: "В каких городах Казахстана вы снимаете?",
    a: "У нас есть свои операторы в 17+ регионах Казахстана: Алматы, Астана, Шымкент, Караганда, Актобе, Атырау, Павлодар, Усть-Каменогорск и других городах. Снимаем на месте без командировочных расходов, можно одновременно в нескольких городах."
  },
  {
    q: "Какие услуги оказывает Japyraq Media?",
    a: "Видео- и фотосъёмка для бизнеса, Reels и короткие видео для Instagram и TikTok, съёмка мероприятий, ведение соцсетей (SMM), таргетированная реклама и креативы, имиджевые ролики, 3D, VFX и AI-видео, создание сайтов."
  },
  {
    q: "Сколько стоит съёмка?",
    a: "Стоимость зависит от формата, объёма и города. Есть разовые форматы для первого знакомства и ежемесячные пакеты. Напишите задачу в WhatsApp, и в течение 24 часов мы пришлём коммерческое предложение под ваш бюджет."
  },
  {
    q: "Как быстро будет готов ролик с мероприятия?",
    a: "Рекап-ролик с мероприятия готовим за 48 часов. Сторис и короткие видео можем выдавать прямо во время события."
  },
  {
    q: "Можно ли начать с одного заказа, без абонемента?",
    a: "Да. Можно заказать Рилс-старт, экспресс-съёмку события или имиджевый ролик. Если в течение 30 дней вы подключите ежемесячный пакет, 100% стоимости разового заказа засчитываем в первый месяц."
  },
  {
    q: "Работаете ли вы официально с юрлицами?",
    a: "Да. Заключаем договор, выставляем счёт, акт выполненных работ и ЭСФ. Оплата безналичная, 100% предоплата до начала работ."
  },
  {
    q: "Что если результат не понравится?",
    a: "Перед съёмкой утверждаем с вами сценарий и план. Если результат не соответствует утверждённому сценарию, переснимем за свой счёт."
  }
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a }
  }))
};

const guarantees = [
  { icon: Clock, title: "Сроки в договоре", text: "Рекап мероприятия за 48 часов, ролики по утверждённому графику." },
  { icon: Repeat, title: "Переснимем за свой счёт", text: "Если результат не соответствует утверждённому сценарию." },
  { icon: FileCheck, title: "Договор и ЭСФ", text: "Работаем официально: договор, счёт, акт и ЭСФ для бухгалтерии." },
  { icon: Users, title: "Один менеджер", text: "Один контакт и один договор на все города и форматы." },
  { icon: MapPin, title: "Без командировочных", text: "Местные операторы в 17+ регионах: билеты и гостиницы не входят в смету." }
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
    const city = String(formData.get("city") || "").trim();
    const service = String(formData.get("service") || "").trim();
    const task = String(formData.get("task") || "").trim();
    const message = [
      "Здравствуйте! Хочу обсудить проект с Japyraq Media Agency.",
      name ? `Имя: ${name}` : "",
      contact ? `Контакт: ${contact}` : "",
      city ? `Город: ${city}` : "",
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
          <a href="#start">Быстрый старт</a>
          <a href="#cases">Кейсы</a>
          <a href="#faq">FAQ</a>
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
                Продакшн и SMM по всему Казахстану
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <h1>Снимаем контент, который приводит <span className="accent">клиентов</span></h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="hero-text">
                Видео, фото, Reels и ведение соцсетей для бизнеса и мероприятий. Местные команды в 17+ регионах:
                снимаем в вашем городе без командировочных расходов.
              </p>
            </Reveal>
            <Reveal className="hero-actions" delay={0.24}>
              <a className="btn primary" href={createWhatsAppUrl()} target="_blank" rel="noreferrer">
                Подобрать формат за 24 часа
                <ArrowUpRight size={18} />
              </a>
              <a className="btn ghost" href="#cases">
                Смотреть кейсы
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
                <Clock size={20} />
                <div>
                  <b>48 часов</b>
                  <span>на рекап после события</span>
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
            <p className="eyebrow">Почему Japyraq</p>
            <h2>Одна команда на весь Казахстан</h2>
          </Reveal>
          <div className="metrics-grid">
            <Counter value={100} suffix="+" label="реализованных проектов" />
            <Counter value={48} suffix="ч" label="на быстрый монтаж ивент-рекапа" />
            <Counter value={17} suffix="+" label="регионов Казахстана: у нас есть люди в городах по всей стране для съёмок, контента и ведения проектов" />
          </div>
          <Reveal>
            <p className="city-row">
              <MapPin size={16} />
              Снимаем в городах: {cities.join(", ")} и ещё 8+ регионах
            </p>
          </Reveal>
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

        <section className="starters" id="start">
          <Reveal className="section-intro wide">
            <p className="eyebrow">Быстрый старт</p>
            <h2>Начните с одного проекта</h2>
            <p>Оцените качество и скорость на небольшом заказе, прежде чем подключать ежемесячную работу.</p>
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
                      Узнать стоимость
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
              <p>стоимости разового заказа засчитываем в первый месяц любого пакета, если вы подключите его в течение 30 дней. Оплаченное не сгорает, а переходит в абонемент.</p>
            </div>
          </Reveal>
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
            <div className="client-logo-marquee" aria-label="Клиенты Japyraq Media Agency">
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
            <p className="eyebrow">Процесс</p>
            <h2>От заявки до результата</h2>
            <p>
              Каждый этап с понятным сроком: вы всегда знаете, что происходит и что будет дальше.
            </p>
          </Reveal>
          <div className="steps">
            {process.map((step, index) => (
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
            <p className="eyebrow">Гарантии</p>
            <h2>Работаем по договору и отвечаем за результат</h2>
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
            <p className="eyebrow">Вопросы и ответы</p>
            <h2>Частые вопросы о съёмке</h2>
          </Reveal>
          <div className="faq-list">
            {faq.map((item) => (
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
            <p className="eyebrow">Заявка</p>
            <h2>Подберём формат за 24 часа</h2>
            <p className="contact-lead">Напишите задачу и город. Ответим в WhatsApp, предложим формат, сроки и стоимость под ваш бюджет.</p>
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
                Город
                <input name="city" type="text" placeholder="Где нужна съёмка?" />
              </label>
              <label>
                Что нужно?
                <select name="service" defaultValue="">
                  <option value="" disabled>
                    Выберите направление
                  </option>
                  <option>Разовая съёмка</option>
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

      <a className="wa-float" href={createWhatsAppUrl()} target="_blank" rel="noreferrer" aria-label="Написать в WhatsApp">
        <MessageCircle size={26} />
      </a>

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

export default App;

if (typeof document !== "undefined") {
  const root = document.getElementById("root");
  root.replaceChildren();
  createRoot(root).render(<App />);
}
