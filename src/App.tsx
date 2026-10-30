import { useEffect, useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  BarChart3,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  FileCheck2,
  FileSpreadsheet,
  GraduationCap,
  Menu,
  Play,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Users,
  X,
  Zap,
  BellRing,
  CalendarDays,
  ArrowUpRight,
} from 'lucide-react';

type Icon = typeof Building2;
type Slide = {
  eyebrow: string;
  title: string;
  highlight: string;
  copy: string;
  primary: string;
  secondary: string;
  image: string;
  tone: 'light' | 'gradient';
};

const slides: Slide[] = [
  {
    eyebrow: 'বাংলাদেশের শিক্ষা প্রতিষ্ঠানের জন্য',
    title: 'এক প্ল্যাটফর্মে আপনার',
    highlight: 'সম্পূর্ণ ডিজিটাল সমাধান',
    copy: 'স্কুল, কলেজ ও মাদ্রাসার শিক্ষার্থী ব্যবস্থাপনা থেকে নম্বর এন্ট্রি, ফলাফল প্রস্তুত ও প্রকাশ—সবকিছু এখন এক জায়গায়।',
    primary: 'বিনামূল্যে শুরু করুন',
    secondary: 'ডেমো দেখুন',
    image: '/images/Connected_Education_Technology_Hub.png',
    tone: 'light',
  },
  {
    eyebrow: 'স্বয়ংক্রিয় ফলাফল প্রক্রিয়া',
    title: 'নির্ভুল ফলাফল,',
    highlight: 'মুহূর্তেই প্রস্তুত',
    copy: 'নম্বর থেকে গ্রেড, GPA ও ৪র্থ বিষয়ের বোনাস—শিক্ষা বোর্ডের নিয়ম অনুযায়ী হিসাব হবে স্বয়ংক্রিয়ভাবে।',
    primary: 'কীভাবে কাজ করে',
    secondary: 'ফিচারসমূহ',
    image: '/images/Digital_Education_Results_Verification_Dashboard.png',
    tone: 'light',
  },
  {
    eyebrow: '১০০% নির্ভরযোগ্য যাচাই',
    title: 'QR কোডে যাচাই করুন',
    highlight: 'মার্কশিটের সত্যতা',
    copy: 'প্রতিটি ডিজিটাল মার্কশিটে থাকবে একটি অনন্য QR কোড। স্ক্যান করলেই জানা যাবে ফলাফলটি অনুমোদিত ও আসল কি না।',
    primary: 'মার্কশিট যাচাই করুন',
    secondary: 'নমুনা দেখুন',
    image: '/images/QR_Markshet_Verification_Illustration.png',
    tone: 'light',
  },
  {
    eyebrow: 'ভূমিকাভিত্তিক নিয়ন্ত্রণ',
    title: 'প্রত্যেকের জন্য',
    highlight: 'আলাদা ড্যাশবোর্ড',
    copy: 'কেন্দ্রীয় অ্যাডমিন, অধ্যক্ষ, শিক্ষক, শিক্ষার্থী ও অভিভাবক—প্রত্যেকে কেবল নিজের প্রয়োজনীয় তথ্য দেখবেন।',
    primary: 'ড্যাশবোর্ড ঘুরে দেখুন',
    secondary: 'যোগাযোগ করুন',
    image: '/images/Secure_Education_Dashboard_Network.png',
    tone: 'light',
  },
];

const features: { icon: Icon; title: string; copy: string }[] = [
  { icon: Building2, title: 'মাল্টি-ইনস্টিটিউশন সাপোর্ট', copy: 'স্কুল, কলেজ ও মাদ্রাসা নিবন্ধন করে পাবে নিজস্ব রেজাল্ট পোর্টাল।' },
  { icon: Users, title: 'শিক্ষার্থী ও শিক্ষক ব্যবস্থাপনা', copy: 'ভর্তি তথ্য, রোল, শ্রেণি, শাখা ও শিক্ষক বরাদ্দ সহজে পরিচালনা করুন।' },
  { icon: FileSpreadsheet, title: 'বাল্ক ইমপোর্ট', copy: 'Excel বা CSV থেকে শিক্ষার্থী ও নম্বর একসঙ্গে ইমপোর্ট করুন।' },
  { icon: FileCheck2, title: 'নম্বর যাচাই ব্যবস্থা', copy: 'পূর্ণমানের বেশি নম্বর, অনুপস্থিতি ও অসম্পূর্ণ তথ্য ধরা পড়বে।' },
  { icon: BarChart3, title: 'স্বয়ংক্রিয় গ্রেড ও GPA', copy: 'Letter Grade, Grade Point, GPA ও ৪র্থ বিষয়ের বোনাস হিসাব।' },
  { icon: ShieldCheck, title: 'দ্বি-স্তরীয় অনুমোদন', copy: 'অধ্যক্ষ যাচাই করে অনুমোদন দিলে তবেই ফলাফল প্রকাশ হবে।' },
];

const steps = [
  ['নিবন্ধন করুন', 'আপনার প্রতিষ্ঠানের তথ্য দিয়ে নিবন্ধন করুন এবং পোর্টাল চালু করুন।'],
  ['তথ্য সাজান', 'শিক্ষাবর্ষ, শ্রেণি, শাখা, বিষয় এবং শিক্ষার্থী ও শিক্ষক যুক্ত করুন।'],
  ['নম্বর এন্ট্রি দিন', 'শিক্ষকগণ নিজ নিজ বিষয়ের নম্বর এন্ট্রি বা ইমপোর্ট করবেন।'],
  ['যাচাই ও অনুমোদন', 'অধ্যক্ষ নম্বর যাচাই করে ফলাফল অনুমোদন করবেন।'],
  ['ফলাফল প্রকাশ', 'মার্কশিট, মেধাতালিকা ও ট্যাবুলেশন শিট তৈরি হবে।'],
];

const faqs = [
  ['সমগ্র কোন কোন প্রতিষ্ঠান ব্যবহার করতে পারবে?', 'স্কুল, কলেজ, মাদ্রাসা ও অন্যান্য শিক্ষা প্রতিষ্ঠান।'],
  ['এক প্রতিষ্ঠানের তথ্য কি অন্যরা দেখতে পারবে?', 'না, প্রতিটি প্রতিষ্ঠানের ডেটা সম্পূর্ণ আলাদা রাখা হয়।'],
  ['GPA ও ৪র্থ বিষয়ের হিসাব কীভাবে হয়?', 'সংশ্লিষ্ট শিক্ষা বোর্ডের নিয়ম অনুযায়ী কনফিগার করে স্বয়ংক্রিয়ভাবে।'],
  ['ফলাফল প্রকাশের আগে কি অনুমোদন লাগে?', 'হ্যাঁ, অনুমোদন ছাড়া কোনো ফলাফল প্রকাশ হয় না।'],
];

function App() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(0);
  const [dashboardTab, setDashboardTab] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setActiveSlide((current) => (current + 1) % slides.length), 6000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('main > section:not(.hero), footer'));
    sections.forEach((s) => s.classList.add('scroll-reveal'));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
 if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -60px' });

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const slide = slides[activeSlide];
  const dashboard = useMemo<[string, string, string[]]>(() => [
    ['কেন্দ্রীয় অ্যাডমিন', 'সব প্রতিষ্ঠান, ব্যবহারকারী ও নিবন্ধন অনুমোদন এক জায়গা থেকে নিয়ন্ত্রণ করুন।', ['সিস্টেম সেটিংস', 'প্রতিষ্ঠান অনুমোদন', 'প্ল্যাটফর্ম পরিসংখ্যান']],
    ['অধ্যক্ষ', 'নম্বর যাচাই, ফলাফল অনুমোদন ও প্রতিষ্ঠানের পূর্ণ চিত্র দেখুন।', ['ফলাফল অনুমোদন', 'মেধাতালিকা', 'ট্যাবুলেশন শিট']],
    ['শিক্ষক', 'নির্ধারিত বিষয় ও শ্রেণির নম্বর এন্ট্রি করুন, খসড়া সংরক্ষণ করুন এবং জমা দিন।', ['নম্বর এন্ট্রি', 'খসড়া সংরক্ষণ', 'বাল্ক ইমপোর্ট']],
    ['শিক্ষার্থী ও অভিভাবক', 'প্রকাশিত ফলাফল, বিষয়ভিত্তিক নম্বর, GPA ও মার্কশিট যেকোনো সময় দেখুন।', ['ফলাফল দেখা', 'মার্কশিট ডাউনলোড', 'নোটিফিকেশন']],
  ][dashboardTab] as [string, string, string[]], [dashboardTab]);

  const changeSlide = (direction: number) => setActiveSlide((activeSlide + direction + slides.length) % slides.length);

  const [scrollProgress, setScrollProgress] = useState(0);
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="app light-mode">
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />
      <header className="site-header">
        <div className="container nav-wrap">
          <a className="brand" href="#home" aria-label="সমগ্র হোম">
            <span className="brand-mark"><Sparkles size={19} /></span>
            <span><strong>সমগ্র</strong><small>সব শিক্ষা, এক প্ল্যাটফর্মে</small></span>
          </a>
          <nav className={menuOpen ? 'main-nav open' : 'main-nav'}>
            {['হোম', 'ফিচারসমূহ', 'কীভাবে কাজ করে', 'ড্যাশবোর্ড', 'নোটিশ', 'যোগাযোগ'].map((item, index) => <a key={item} className={index === 0 ? 'active' : ''} href={['#home', '#features', '#how', '#dashboard', '#notice', '#contact'][index]} onClick={() => setMenuOpen(false)}>{item}</a>)}
            <div className="nav-actions mobile-actions"><a className="button button-outline" href="#/login">লগইন</a><button className="button button-gradient">প্রতিষ্ঠান নিবন্ধন</button></div>
          </nav>
          <div className="nav-actions desktop-actions"><a className="button button-outline" href="#/login">লগইন</a><button className="button button-gradient">নিবন্ধন করুন</button></div>
          <button className="menu-button" aria-label="মেনু" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        </div>
      </header>

      <main>
        <section id="home" className={`hero hero-${slide.tone}`}>
          <div className="hero-image" style={{ backgroundImage: `url(${slide.image})` }} />
          <div className="hero-glow" />
          <div className="container hero-content">
            <div className="hero-copy" key={activeSlide}>
              <span className="eyebrow">{slide.eyebrow}</span>
              <h1>{slide.title}<br /><em>{slide.highlight}</em></h1>
              <p>{slide.copy}</p>
              <div className="hero-actions"><button className="button button-gradient">{slide.primary} <ArrowRight size={18} /></button><button className="button button-ghost"><Play size={17} /> {slide.secondary}</button></div>
            </div>
          </div>
          <button className="slider-arrow left" aria-label="আগের স্লাইড" onClick={() => changeSlide(-1)}><ChevronLeft /></button><button className="slider-arrow right" aria-label="পরের স্লাইড" onClick={() => changeSlide(1)}><ChevronRight /></button>
          <div className="slider-controls"><div className="dots">{slides.map((item, index) => <button key={item.image} aria-label={`${index + 1} নম্বর স্লাইড`} className={index === activeSlide ? 'dot active' : 'dot'} onClick={() => setActiveSlide(index)} />)}</div><div className="progress"><span style={{ width: `${((activeSlide + 1) / slides.length) * 100}%` }} /></div></div>
        </section>

        <section className="stats-section"><div className="container stats-grid">{[['৫০০+', 'নিবন্ধিত প্রতিষ্ঠান'], ['২,০০,০০০+', 'শিক্ষার্থীর তথ্য'], ['১০,০০০+', 'প্রকাশিত ফলাফল'], ['৯৯.৯%', 'হিসাবের নির্ভুলতা']].map(([number, label]) => <div className="stat" key={label}><strong>{number}</strong><span>{label}</span></div>)}</div></section>

        <section className="section about-section"><div className="container split-grid"><div className="about-visual"><div className="about-photo-frame"><img src="https://images.pexels.com/photos/5306480/pexels-photo-5306480.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="শিক্ষক ট্যাবলেট ব্যবহার করে শ্রেণিকক্ষে শিক্ষার্থীর সঙ্গে কাজ করছেন" /></div><div className="floating-card"><Zap size={20} /><strong>৭০%</strong><span>সময় বাঁচান</span></div><div className="mini-chart"><span /><span /><span /><span /><span /></div></div><div className="section-copy"><span className="eyebrow">কেন সমগ্র?</span><h2>শিক্ষা প্রতিষ্ঠানের জন্য <em>সহজ, নির্ভুল</em> ও নিরাপদ ব্যবস্থাপনা</h2><p>ভর্তি, শ্রেণি ও বিষয় ব্যবস্থাপনা, পরীক্ষা, নম্বর এন্ট্রি, অনুমোদন, ফলাফল প্রকাশ এবং মার্কশিট—সবকিছু এক প্ল্যাটফর্মে।</p><ul className="check-list">{['প্রতিটি প্রতিষ্ঠানের ডেটা সম্পূর্ণ আলাদা ও সুরক্ষিত', 'ফলাফল প্রকাশের আগে অনুমোদন বাধ্যতামূলক', 'Excel/CSV থেকে এক ক্লিকে ডেটা ইমপোর্ট', 'বোর্ডের নিয়ম অনুযায়ী GPA কনফিগারযোগ্য'].map((item) => <li key={item}><Check size={17} />{item}</li>)}</ul><button className="button button-outline">আরও জানুন <ArrowRight size={17} /></button></div></div></section>

        <section id="features" className="section dark-section"><div className="container"><div className="section-heading center"><span className="eyebrow">প্রধান সুবিধাসমূহ</span><h2>যা আপনার প্রতিষ্ঠানকে করবে <em>আরও দক্ষ</em></h2><p>ভর্তি থেকে ফলাফল—প্রতিটি ধাপের জন্য শক্তিশালী টুল</p></div><div className="feature-grid">{features.map(({ icon: FeatureIcon, title, copy }) => <article className="feature-card" key={title}><div className="icon-box"><FeatureIcon size={24} /></div><h3>{title}</h3><p>{copy}</p><ArrowRight className="card-arrow" size={18} /></article>)}</div><div className="center-button"><button className="button button-gradient">সব ৩০টি ফিচার দেখুন <ArrowRight size={18} /></button></div></div></section>

        <section id="how" className="section how-section"><div className="container"><div className="section-heading center"><span className="eyebrow">কার্যপ্রণালি</span><h2>মাত্র ৫টি সহজ ধাপে <em>ফলাফল প্রকাশ</em></h2></div><div className="steps-grid">{steps.map(([title, copy], index) => <div className="step" key={title}><div className="step-number">০{index + 1}</div><h3>{title}</h3><p>{copy}</p></div>)}</div><div className="center-button"><button className="button button-gradient">এখনই শুরু করুন <ArrowRight size={18} /></button></div></div></section>

        <section id="dashboard" className="section dashboard-section"><div className="container"><div className="section-heading center"><span className="eyebrow">ড্যাশবোর্ড</span><h2>আপনার ভূমিকা অনুযায়ী সাজানো <em>ড্যাশবোর্ড</em></h2></div><div className="tabs">{['কেন্দ্রীয় অ্যাডমিন', 'অধ্যক্ষ', 'শিক্ষক', 'শিক্ষার্থী ও অভিভাবক'].map((tab, index) => <button key={tab} className={dashboardTab === index ? 'tab active' : 'tab'} onClick={() => setDashboardTab(index)}>{tab}</button>)}</div><div className="dashboard-showcase"><div className="dashboard-copy"><span className="eyebrow">{dashboard[0]}</span><h3>{dashboard[1]}</h3><ul className="check-list">{dashboard[2].map((item) => <li key={item}><Check size={17} />{item}</li>)}</ul><button className="button button-gradient">এই ড্যাশবোর্ড চালু করুন <ArrowRight size={18} /></button></div><div className="mock-dashboard"><div className="mock-top"><span><Sparkles size={16} /> সমগ্র</span><span className="mock-pill">লাইভ</span></div><div className="mock-stats"><div><small>মোট শিক্ষার্থী</small><strong>১২,৪৮০</strong></div><div><small>পাশের হার</small><strong>৯৮.৬%</strong></div><div><small>নোটিশ</small><strong>২৪</strong></div></div><div className="mock-bars">{[52, 76, 60, 88, 70, 94, 82].map((height, index) => <span key={index} style={{ height: `${height}%` }} />)}</div></div></div></div></section>

        <section className="section result-section"><div className="container split-grid result-grid"><div className="section-copy"><span className="eyebrow">ডিজিটাল মার্কশিট</span><h2>পেশাদার মার্কশিট, <em>প্রিন্টের জন্য প্রস্তুত</em></h2><p>প্রতিষ্ঠানের লোগো, বিষয়ভিত্তিক ফলাফল, GPA, গ্রেডিং স্কেল ও মেধাক্রমসহ মার্কশিট তৈরি করুন।</p><ul className="check-list"><li><Check size={17} />মার্কশিট, ট্যাবুলেশন শিট ও মেধাতালিকা</li><li><Check size={17} />QR কোডে মার্কশিটের সত্যতা যাচাই</li><li><Check size={17} />PDF ডাউনলোড ও সরাসরি প্রিন্ট</li></ul><div className="hero-actions"><button className="button button-gradient">নমুনা দেখুন</button><button className="button button-outline">PDF ডাউনলোড</button></div></div><div className="marksheet"><div className="marksheet-head">সমগ্র <span>ফলাফল ২০২৬</span></div><h3>বার্ষিক পরীক্ষার ফলাফল</h3><div className="student-line"><span>নাম: সাদিয়া রহমান</span><span>রোল: ১০২৪</span></div><div className="marks-table">{['বাংলা', 'ইংরেজি', 'গণিত', 'বিজ্ঞান'].map((subject, index) => <div key={subject}><span>{subject}</span><b>{['৯২', '৮৮', '৯৬', '৯০'][index]}</b><strong>A+</strong></div>)}</div><div className="marksheet-foot"><strong>GPA ৫.০০</strong><div className="qr-pattern"><span /><span /><span /><span /></div></div></div></div></section>

        <section className="section notice-section" id="notice"><div className="container"><div className="notice-header"><div className="section-heading"><span className="eyebrow">নোটিশ বোর্ড</span><h2>সর্বশেষ নোটিশ ও <em>ঘোষণা</em></h2><p>আপনার প্রতিষ্ঠানের গুরুত্বপূর্ণ খবর, সময়সূচি ও নির্দেশনা এক জায়গায়।</p></div><button className="button button-outline">সব নোটিশ দেখুন <ArrowRight size={17} /></button></div><div className="notice-modern-grid"><article className="notice-featured"><div className="notice-featured-top"><span className="notice-icon"><BellRing size={22} /></span><span className="notice-label">জরুরি ঘোষণা</span><span className="notice-date">০৮ জুন ২০২৬</span></div><h3>বার্ষিক পরীক্ষার ফলাফল প্রকাশের সময়সূচি ঘোষণা</h3><p>প্রতিষ্ঠান প্রধান ও শিক্ষকদের জন্য ফলাফল প্রস্তুতি, যাচাই ও প্রকাশের নতুন সময়সূচি প্রকাশ করা হয়েছে। বিস্তারিত নির্দেশনা দেখে কাজের পরিকল্পনা তৈরি করুন।</p><a href="#contact">বিস্তারিত পড়ুন <ArrowUpRight size={17} /></a></article><div className="notice-timeline">{['নম্বর এন্ট্রির শেষ তারিখ সম্পর্কিত নির্দেশনা', 'নতুন প্রতিষ্ঠান নিবন্ধন শুরু', 'ডিজিটাল মার্কশিট যাচাই সেবা চালু'].map((notice, index) => <article className="timeline-item" key={notice}><div className="timeline-date"><strong>{index === 0 ? '০৯' : index === 1 ? '১০' : '১২'}</strong><span>জুন</span></div><div><span>সাধারণ আপডেট</span><h3>{notice}</h3><p>সমগ্র প্ল্যাটফর্মের সর্বশেষ গুরুত্বপূর্ণ আপডেট।</p></div><ArrowUpRight size={18} /></article>)}</div><aside className="notice-side-card"><CalendarDays size={29} /><span>এই মাসের আপডেট</span><strong>১২</strong><p>নতুন ঘোষণা ও পরিবর্তন</p><div className="notice-side-line"><span /></div><small>সর্বশেষ আপডেট: আজ</small></aside></div></div></section>

        <section className="section faq-section" id="faq"><div className="container faq-grid"><div className="section-heading"><span className="eyebrow">সহায়তা</span><h2>সচরাচর <em>জিজ্ঞাসিত প্রশ্ন</em></h2><p>সমগ্র সম্পর্কে আপনার সাধারণ প্রশ্নগুলোর উত্তর এখানে পাবেন।</p></div><div className="faq-list">{faqs.map(([question, answer], index) => <div className={faqOpen === index ? 'faq-item open' : 'faq-item'} key={question}><button onClick={() => setFaqOpen(faqOpen === index ? -1 : index)}><span>{question}</span>{faqOpen === index ? <X size={19} /> : <span className="plus">+</span>}</button>{faqOpen === index && <p>{answer}</p>}</div>)}</div></div></section>

        <section className="cta-section" id="contact"><div className="cta-orb one" /><div className="cta-orb two" /><div className="container cta-inner"><div><span className="eyebrow">আজই শুরু করুন</span><h2>আপনার প্রতিষ্ঠানকে <strong>ডিজিটাল করুন</strong></h2><p>সহজ, নির্ভুল ও স্বচ্ছ ফলাফল ব্যবস্থাপনার যাত্রা শুরু হোক সমগ্রের সঙ্গে।</p><div className="hero-actions"><button className="button button-dark">বিনামূল্যে নিবন্ধন করুন <ArrowRight size={18} /></button><button className="button button-ghost">যোগাযোগ করুন</button></div></div><GraduationCap className="cta-icon" size={132} /></div></section>
      </main>

      <footer className="site-footer"><div className="container footer-grid"><div className="footer-brand"><a className="brand" href="#home"><span className="brand-mark"><Sparkles size={19} /></span><span><strong>সমগ্র</strong><small>সব শিক্ষা, এক প্ল্যাটফর্মে</small></span></a><p>স্কুল, কলেজ ও মাদ্রাসার জন্য অল-ইন-ওয়ান ম্যানেজমেন্ট ও রেজাল্ট পোর্টাল।</p></div><div><h3>দ্রুত লিংক</h3><a href="#features">ফিচারসমূহ</a><a href="#how">কীভাবে কাজ করে</a><a href="#dashboard">ড্যাশবোর্ড</a><a href="#notice">নোটিশ বোর্ড</a></div><div><h3>সহায়তা</h3><a href="#faq">সাধারণ জিজ্ঞাসা</a><a href="#contact">ব্যবহার নির্দেশিকা</a><a href="#contact">মার্কশিট যাচাই</a><a href="#contact">প্রতিষ্ঠান নিবন্ধন</a></div><div><h3>যোগাযোগ</h3><p><Search size={16} /> সিলেট, বাংলাদেশ</p><p><Smartphone size={16} /> ০১XXX-XXXXXX</p><p><CircleHelp size={16} /> info@shomogro.com</p></div></div><div className="container footer-bottom"><span>© ২০২৬ সমগ্র। সর্বস্বত্ব সংরক্ষিত।</span><span>গোপনীয়তা নীতি&nbsp;&nbsp; | &nbsp;&nbsp;ব্যবহারের শর্তাবলি</span></div></footer>
      <a className="back-top" href="#home" aria-label="উপরে যান"><ArrowDown size={19} /></a>
    </div>
  );
}

export default App;
