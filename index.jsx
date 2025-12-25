import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Code, 
  Cpu, 
  Mail, 
  ChevronRight, 
  ExternalLink,
  Layers,
  Sparkles,
  Briefcase,
  Camera,
  Terminal,
  Headphones,
  Gamepad2,
  Target,
  Brain,
  Rocket,
  Github,
  MessageCircle,
  Video,
  BookOpen,
  Globe,
  Instagram,
  ArrowUpRight,
  Calendar,
  MapPin,
  Clock,
  Coffee,
  Mic,
  Lightbulb,
  Search
} from 'lucide-react';

// --- 全局样式注入 ---
const AppleFontStyle = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    :root {
      --apple-font: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
    }
    body {
      font-family: var(--apple-font);
      -webkit-font-smoothing: antialiased;
      letter-spacing: -0.011em; 
      background-color: #f5f5f7;
    }
    .tracking-tighter-apple { letter-spacing: -0.04em !important; }
    .tracking-tight-apple { letter-spacing: -0.02em !important; }
    
    .scroll-section {
      scroll-margin-top: 100px; 
    }

    .glass-card {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.4);
    }
    .trait-card {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
      cursor: pointer;
    }
    
    .trait-card-id:hover {
      background: #f0fdf4; 
      border-color: #22c55e;
      box-shadow: 0 20px 40px rgba(34, 197, 94, 0.08);
    }
    .trait-card-ego:hover {
      background: #eff6ff; 
      border-color: #3b82f6;
      box-shadow: 0 20px 40px rgba(59, 130, 246, 0.08);
    }
    .trait-card-superego:hover {
      background: #fef2f2; 
      border-color: #ef4444;
      box-shadow: 0 20px 40px rgba(239, 68, 68, 0.08);
    }

    .social-card {
      background: #ffffff;
      border: 1px solid #f2f2f7;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .social-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 30px 60px -12px rgba(0,0,0,0.05);
      border-color: #d2d2d7;
    }
    
    .ripple-line {
      position: absolute;
      border: 1px solid rgba(59, 130, 246, 0.3);
      border-radius: 50%;
      pointer-events: none;
      box-shadow: 0 0 10px rgba(59, 130, 246, 0.05);
    }

    .project-card-image-container {
      transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    .project-card:hover .project-card-image-container {
      transform: scale(1.05);
    }

    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    .timeline-mask {
      mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
    }
    
    .timeline-container {
      scroll-snap-type: y mandatory;
    }
    .timeline-item {
      scroll-snap-align: center;
    }
  `}} />
);

// --- 时间轴组件 (已更新：上下结构、调大图片、缩小文字) ---
const ScrollTimeline = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);
  const itemHeight = 100;

  const timelineData = [
    { year: "2013", title: "初识代码", detail: "在大学实验室敲下第一行 C 语言，那种通过指令控制屏幕的瞬间，决定了我未来的底色。", color: "#94a3b8", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop", icon: <Terminal size={20} /> },
    { year: "2014", title: "逻辑之美", detail: "开始深入钻研算法与数据结构。在 LeetCode 的世界里寻找最优解，体会逻辑推导带来的纯粹快感。", color: "#facc15", image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=2070&auto=format&fit=crop", icon: <Lightbulb size={20} /> },
    { year: "2015", title: "开源初探", detail: "在 GitHub 提交了第一个 PR。意识到代码不仅仅是运行的逻辑，更是一种可以跨越国界的协作语言。", color: "#22c55e", image: "https://images.unsplash.com/photo-1618401471353-b98aade1555a?q=80&w=2070&auto=format&fit=crop", icon: <Github size={20} /> },
    { year: "2016", title: "Web 极客之旅", detail: "HTML/CSS 的即时反馈感让我着迷。开始构建各种古灵精怪的个人网页，并尝试理解浏览器的渲染流程。", color: "#60a5fa", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop", icon: <Globe size={20} /> },
    { year: "2017", title: "商业实习洗礼", detail: "第一次进入真正的互联网大厂实习。代码不再是个人的游戏，而是协作、规范与解决真实用户的痛点。", color: "#34d399", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop", icon: <Briefcase size={20} /> },
    { year: "2018", title: "React 深度觉醒", detail: "全面拥抱声明式 UI 范式。深入研究虚拟 DOM 与状态管理，开始在技术论坛撰写深入解析文章。", color: "#f472b6", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop", icon: <Layers size={20} /> },
    { year: "2019", title: "入职国企平台", detail: "身份转变。在超大规模架构中沉淀，学会如何在稳定运行的巨轮上精细化更新，并思考技术的人性价值。", color: "#fb923c", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop", icon: <MapPin size={20} /> },
    { year: "2020", title: "Rust 孤独探索", detail: "疫情元年，闭关学习 Rust。内存安全与所有权机制颠覆了我对系统的认知，完成了多个命令行工具开发。", color: "#f87171", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop", icon: <Cpu size={20} /> },
    { year: "2021", title: "镜头背后的思考", detail: "开启视频创作生涯。尝试用导演的视角解析技术代码，通过视觉化叙事让枯燥的逻辑变得生动感性。", color: "#818cf8", image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=2070&auto=format&fit=crop", icon: <Camera size={20} /> },
    { year: "2022", title: "百万流量博主", detail: "全网影响力爆发的一年。意识到“分享”本身就是一种强大的创造力，在与粉丝的交互中重塑了自我表达。", color: "#fbbf24", image: "https://images.unsplash.com/photo-1478720143034-8fa35672e47c?q=80&w=2070&auto=format&fit=crop", icon: <Video size={20} /> },
    { year: "2023", title: "播客与深度对话", detail: "启动《Vibe》播客。不再满足于单向输出，通过与跨界专家的深度对谈，试图拼凑出数字时代的生存图景。", color: "#2dd4bf", image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=2070&auto=format&fit=crop", icon: <Mic size={20} /> },
    { year: "2024", title: "AI 原生化重构", detail: "将 LLM 深度集成进每一个工作流程。不再是写代码，而是‘指导’代码，探索人工智能时代的协作上限。", color: "#3b82f6", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop", icon: <Rocket size={20} /> },
    { year: "2025", title: "寻找下一个奇点", detail: "专注开发 AI 驱动的原生应用。未来的代码可能是模糊的、感性的，我在寻找碳基与硅基共鸣的新奇点。", color: "#a855f7", image: "https://images.unsplash.com/photo-1614728263952-84ea206f2c40?q=80&w=2070&auto=format&fit=crop", icon: <Sparkles size={20} /> }
  ];

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    if (index >= 0 && index < timelineData.length && index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  const scrollToYear = (index) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: index * itemHeight,
        behavior: 'smooth'
      });
      setActiveIndex(index);
    }
  };

  const getStyleForIndex = (index) => {
    const distance = Math.abs(index - activeIndex);
    const opacity = Math.max(0.1, 1 - distance * 0.25);
    const scale = Math.max(0.7, 1.5 - distance * 0.2);
    const blur = Math.min(2, distance * 0.5);
    return { opacity, scale, filter: `blur(${blur}px)` };
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-white rounded-[3rem] border border-gray-100 shadow-inner overflow-hidden min-h-[650px]">
      {/* 左侧年份控制器 */}
      <div className="w-full md:w-1/4 h-24 md:h-full border-b md:border-b-0 md:border-r border-gray-100 relative flex items-center bg-gray-50/50">
        <div className="absolute inset-0 md:timeline-mask overflow-hidden">
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="timeline-container flex md:flex-col items-center gap-16 md:gap-0 h-full overflow-x-auto md:overflow-y-auto no-scrollbar md:py-[250px]"
          >
            {timelineData.map((item, index) => {
              const { opacity, scale, filter } = getStyleForIndex(index);
              return (
                <motion.div 
                  key={item.year} 
                  onClick={() => scrollToYear(index)}
                  animate={{ scale, opacity, filter }}
                  transition={{ type: "spring", stiffness: 350, damping: 40 }}
                  className="timeline-item shrink-0 cursor-pointer flex flex-col items-center justify-center relative"
                  style={{ height: `${itemHeight}px`, minWidth: '100px' }}
                >
                  <span className={`text-3xl md:text-4xl font-black font-mono tracking-tighter ${activeIndex === index ? 'text-gray-900' : 'text-gray-300'}`}>
                    {item.year}
                  </span>
                  {activeIndex === index && (
                    <motion.div 
                      layoutId="active-dot" 
                      className="w-1.5 h-1.5 rounded-full mt-2 absolute -bottom-1" 
                      style={{ backgroundColor: item.color }} 
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
        <div className="hidden md:block absolute right-[-1px] top-1/2 -translate-y-1/2 w-1.5 h-16 bg-blue-500 rounded-l-full z-10 shadow-[0_0_15px_rgba(59,130,246,0.6)]"></div>
      </div>

      {/* 右侧卡片内容：改为上下布局、增大图片、缩小文字 */}
      <div className="flex-1 h-full relative bg-white overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.98 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="absolute inset-0 p-6 md:p-8 flex flex-col"
          >
            {/* 上部：大图区域 */}
            <div className="relative w-full flex-1 min-h-0 rounded-[2rem] overflow-hidden shadow-xl border border-gray-100">
                <motion.img 
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.5 }}
                  src={timelineData[activeIndex].image} 
                  alt={timelineData[activeIndex].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60"></div>
                <div className="absolute top-6 left-6 text-white flex items-center gap-3">
                  <div className="p-2.5 bg-white/20 backdrop-blur-xl rounded-xl border border-white/30 shadow-lg">
                    {timelineData[activeIndex].icon}
                  </div>
                  <div className="bg-black/20 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/10">
                    <span className="text-[10px] font-mono tracking-widest uppercase opacity-70 block leading-none mb-1 text-gray-200">Year</span>
                    <span className="font-bold text-sm tracking-tight leading-none">{timelineData[activeIndex].year}</span>
                  </div>
                </div>
            </div>

            {/* 下部：精简后的文字内容 */}
            <div className="pt-8 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-0.5 w-10 rounded-full" style={{ backgroundColor: timelineData[activeIndex].color }}></div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100">
                  <Clock size={12} className="text-gray-400" />
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Milestone_{activeIndex + 1}</span>
                </div>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight-apple text-gray-900 leading-tight">
                {timelineData[activeIndex].title}
              </h3>
              
              <p className="text-gray-500 text-sm md:text-base leading-relaxed font-normal tracking-tight max-w-2xl">
                {timelineData[activeIndex].detail}
              </p>
              
              <div className="flex gap-2 items-center pt-2 opacity-30">
                <span className="text-[10px] font-mono text-gray-400 tracking-widest uppercase">System.Status: Normal</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- 以下内容完全保持不变 ---
const translations = {
  zh: {
    nav: { about: "关于我", skills: "来时路", projects: "整过啥", contact: "哪找我" },
    hero: { greeting: "你好, 我是", slogan: "狮子座 / INFJ / 但都不典型" },
    bento: {
      philosophy: { title: "我的理念", main: "注意力是你所需要的一切。", desc: "多和够之间的区别就在于，多字加上句号表示停顿，就是够。大多数时候，只要把精力专注于自己，就够了。" },
      interest: { label: "当前感兴趣", value: "听播客", status: "Now Streaming" },
      project: { label: "当前项目", prefix: "Vibe Coding", suffix: "自制解谜游戏", status: "In Development" },
      workspace: { label: "当前NPC人设", identities: [{ icon: <Briefcase size={16} />, text: "国企牛马" }, { icon: <Camera size={16} />, text: "自媒体主理人" }, { icon: <Terminal size={16} />, text: "AI屎山代码开发者" }] }
    },
    about: {
      title: "未来  ▪  时",
      bio: "你无法预知未来，你只能回顾过去，去串联生命中的每一个点。所以你必须相信这些点在未来会以某种方式连接起来。你必须对此抱持信念。",
      traits: [
        { id: "id", icon: <Target size={20} />, label: "本我", desc: "内部记分牌 ▪ 本我意识集合体" },
        { id: "ego", icon: <Brain size={20} />, label: "自我", desc: "自媒体矩阵 ▪ 自我表达放大器" },
        { id: "superego", icon: <Rocket size={20} />, label: "超我", desc: "AI  +  EI ▪ 超我极限想象力" }
      ],
      btn: "联系我"
    },
    skills: {
      title: "来时路",
      subtitle: "时间不是流逝，而是沉淀。滚动年份，回溯成长的每一个关键节点。",
    },
    projects: {
      sections: [
        { 
          id: "id", 
          title: "本我 / 内部记分牌", 
          desc: "", 
          items: [
            { title: "Lumina Engine", desc: "追求极致性能的 Web 渲染渲染引擎原型", tags: ["Rust", "Wasm"], link: "#", img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop" },
            { title: "Nexus CLI", desc: "让工作流提速 300% 的自动化工具集", tags: ["Node.js", "CLI"], link: "#", img: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=1974&auto=format&fit=crop" }
          ]
        },
        { 
          id: "ego", 
          title: "自我 / 自媒体矩阵", 
          desc: "", 
          items: [
            { title: "Vibe Podcasting", desc: "连接 10w+ 听众的沉浸式数字播客矩阵", tags: ["Media", "Design"], link: "#", img: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1974&auto=format&fit=crop" },
            { title: "Grid Portfolio", desc: "基于 Apple 视觉语言的响应式设计系统", tags: ["Figma", "React"], link: "#", img: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1964&auto=format&fit=crop" }
          ]
        },
        { 
          id: "superego", 
          title: "超我 / 极限想象力", 
          desc: "", 
          items: [
            { title: "Aether AI", desc: "具有共情能力的个人第二大脑系统", tags: ["LLM", "Python"], link: "#", img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1932&auto=format&fit=crop" },
            { title: "Bio-Link", desc: "探索碳基生物与硅基智能的交互边界", tags: ["Futuristic", "IoT"], link: "#", img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" }
          ]
        }
      ]
    },
    contact: {
      title: "欢迎交流合作",
      sub: "跨越数字海洋，寻找同频的回响。"
    },
    footer: "由 AlexZhang 精心构建"
  },
  en: {
    nav: { about: "About", skills: "Journey", projects: "Works", contact: "Connect" },
    hero: { greeting: "Hi, I'm", slogan: "Leo / INFJ / But neither is typical" },
    bento: {
      philosophy: { title: "Philosophy", main: "Attention is all you need.", desc: "The difference between 'More' and 'Enough' is just a pause." },
      interest: { label: "Interested In", value: "Podcasting", status: "Now Streaming" },
      project: { label: "Active Project", prefix: "Vibe Coding", suffix: "Indie Puzzle Game", status: "In Development" },
      workspace: { label: "Current NPC Role", identities: [{ icon: <Briefcase size={16} />, text: "State-owned Enterprise 'Ox'" }, { icon: <Camera size={16} />, text: "Social Media Mastermind" }, { icon: <Terminal size={16} />, text: "AI Legacy Code Creator" }] }
    },
    about: {
      title: "Future Tense",
      bio: "You can't connect the dots looking forward; you can only connect them looking backward.",
      traits: [
        { id: "id", icon: <Target size={20} />, label: "Id", desc: "Internal Scoreboard ▪ Collective of Id Consciousness" },
        { id: "ego", icon: <Brain size={20} />, label: "Ego", desc: "Social Media Matrix ▪ Self-Expression Amplifier" },
        { id: "superego", icon: <Rocket size={20} />, label: "Superego", desc: "AI  +  EI ▪ Extreme Imagination of Superego" }
      ],
      btn: "Contact Me"
    },
    skills: {
      title: "The Journey",
      subtitle: "Time doesn't pass, it accumulates. Scroll years to trace the milestones of my growth.",
    },
    projects: {
      sections: [
        { 
          id: "id", 
          title: "Id / Internal Scoreboard", 
          desc: "",
          items: [
            { title: "Lumina Engine", desc: "High-perf rendering engine prototype", tags: ["Rust", "Wasm"], link: "#", img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop" },
            { title: "Nexus CLI", desc: "Automation toolset boosting workflow", tags: ["Node.js", "CLI"], link: "#", img: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=1974&auto=format&fit=crop" }
          ]
        },
        { 
          id: "ego", 
          title: "Ego / Media Matrix", 
          desc: "",
          items: [
            { title: "Vibe Podcasting", desc: "Immersive podcast matrix for 100k listeners", tags: ["Media", "Design"], link: "#", img: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1974&auto=format&fit=crop" },
            { title: "Grid Portfolio", desc: "Responsive system with Apple design language", tags: ["Figma", "React"], link: "#", img: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1964&auto=format&fit=crop" }
          ]
        },
        { 
          id: "superego", 
          title: "Superego / Extreme Imagination", 
          desc: "",
          items: [
            { title: "Aether AI", desc: "Empathetic second brain system", tags: ["LLM", "Python"], link: "#", img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1932&auto=format&fit=crop" },
            { title: "Bio-Link", desc: "Intersection of biology and silicon intelligence", tags: ["Futuristic", "IoT"], link: "#", img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" }
          ]
        }
      ]
    },
    contact: {
      title: "Open for Collaboration",
      sub: "Bridging the digital divide to find resonance."
    },
    footer: "Built with Precision by AlexZhang"
  }
};

const springTransition = { type: "spring", stiffness: 100, damping: 20, mass: 1 };
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { ...springTransition, duration: 0.8 }
};

const RippleDecoration = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="ripple-line"
          initial={{ width: "0px", height: "0px", opacity: 0, left: "50%", top: "50%", x: "-50%", y: "-50%" }}
          animate={{ width: ["0px", "800px"], height: ["0px", "800px"], opacity: [0, 0.5, 0] }}
          transition={{ duration: 6, repeat: Infinity, delay: i * 1.5, ease: "easeOut" }}
        />
      ))}
    </div>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState('about');
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState('zh');

  const t = translations[lang];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tabs = [
    { id: 'about', label: t.nav.about, icon: <User size={18} /> },
    { id: 'skills', label: t.nav.skills, icon: <Clock size={18} /> },
    { id: 'projects', label: t.nav.projects, icon: <Layers size={18} /> },
    { id: 'contact', label: t.nav.contact, icon: <Mail size={18} /> },
  ];

  const socialPlatforms = [
    { name: "微信", id: "WeChat", icon: <MessageCircle size={24} />, color: "#07C160", link: "#", desc: "私域连接 / 即时通讯" },
    { name: "B站", id: "Bilibili", icon: <Video size={24} />, color: "#FB7299", link: "#", desc: "视频内容 / 创意记录" },
    { name: "小红书", id: "LittleRedBook", icon: <Camera size={24} />, color: "#ff2442", link: "#", desc: "生活美学 / 灵感发现" },
    { name: "抖音", id: "Douyin", icon: <Gamepad2 size={24} />, color: "#000000", link: "#", desc: "短视频 / 视觉表达" },
    { name: "GitHub", id: "GitHub", icon: <Github size={24} />, color: "#6F4E37", link: "#", desc: "开源项目 / 屎山代码" },
    { name: "Notion", id: "Notion", icon: <BookOpen size={24} />, color: "#007AFF", link: "#", desc: "知识库 / 个人数字花园" }
  ];

  const navigateTo = (tabId, sectionId = null) => {
    setActiveTab(tabId);
    if (!sectionId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setTimeout(() => {
      const element = document.getElementById(`project-section-${sectionId}`);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 300);
  };

  const getTraitClass = (id) => {
    switch (id) {
      case 'id': return 'trait-card-id';
      case 'ego': return 'trait-card-ego';
      case 'superego': return 'trait-card-superego';
      default: return '';
    }
  };

  const getIconColorClass = (id) => {
    switch (id) {
      case 'id': return 'group-hover:text-green-600 group-hover:bg-green-50';
      case 'ego': return 'group-hover:text-blue-600 group-hover:bg-blue-50';
      case 'superego': return 'group-hover:text-red-600 group-hover:bg-red-50';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] selection:bg-blue-100 selection:text-blue-600">
      <AppleFontStyle />
      
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/70 backdrop-blur-xl border-b border-gray-200 py-3' : 'bg-transparent py-6'}`}>
        <div className="max-w-5xl mx-auto px-6 flex justify-between items-center">
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => navigateTo('about')}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-200 to-gray-100 border border-gray-200/50 flex items-center justify-center overflow-hidden shadow-sm text-[10px] text-gray-400 font-bold tracking-widest">AZ</div>
            <span className="text-xl font-bold tracking-tight-apple bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 hidden sm:block">AlexZhang</span>
          </motion.div>

          <div className="flex gap-1 bg-gray-200/50 p-0.5 rounded-full backdrop-blur-md">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => navigateTo(tab.id)}
                className={`relative px-3 sm:px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === tab.id ? 'text-black' : 'text-gray-500 hover:text-gray-800'}`}
              >
                {activeTab === tab.id && (
                  <motion.div layoutId="active-pill" className="absolute inset-0 bg-white rounded-full shadow-sm" transition={springTransition} />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-gray-200/50 p-0.5 rounded-full flex items-center text-xs">
              <button onClick={() => setLang('zh')} className={`w-8 h-8 rounded-full font-bold transition-all ${lang === 'zh' ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-gray-600'}`}>中</button>
              <button onClick={() => setLang('en')} className={`w-8 h-8 rounded-full font-bold transition-all ${lang === 'en' ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-gray-600'}`}>EN</button>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'about' && (
              <motion.section key={`about-${lang}`} initial="initial" animate="animate" exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }} variants={fadeInUp} className="space-y-16">
                <div className="space-y-4 text-center md:text-left">
                  <motion.h1 className="text-6xl md:text-8xl font-bold tracking-tighter-apple leading-tight" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, ...springTransition }}>
                    {t.hero.greeting} <span className="text-blue-600">Alex</span>.
                  </motion.h1>
                  <p className="text-2xl md:text-3xl text-gray-400 max-w-2xl font-medium tracking-tight-apple">{t.hero.slogan}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-4 md:grid-rows-2 gap-4 h-auto md:h-[400px]">
                  <div className="col-span-2 row-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col justify-between group hover:shadow-xl transition-all duration-500 relative overflow-hidden">
                    <RippleDecoration />
                    <div className="relative z-10 flex justify-between items-start">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shadow-sm"><Sparkles /></div>
                      <div className="text-xs font-bold text-gray-300 tracking-widest uppercase">{t.bento.philosophy.title}</div>
                    </div>
                    <div className="relative z-10 space-y-4">
                      <h3 className="text-3xl font-bold tracking-tight-apple leading-snug">{t.bento.philosophy.main}</h3>
                      <p className="text-gray-500 leading-relaxed tracking-tight">{t.bento.philosophy.desc}</p>
                    </div>
                  </div>
                  <div className="col-span-2 row-span-1 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 glass-card rounded-[2.5rem] p-8 relative overflow-hidden group hover:shadow-lg transition-all duration-500 border border-gray-100">
                    <div className="absolute top-[-40%] right-[-10%] w-72 h-72 bg-purple-200/30 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
                    <div className="relative z-10 flex h-full flex-col justify-center">
                      <div className="text-xs font-bold text-indigo-400 tracking-widest uppercase mb-4">{t.bento.workspace.label}</div>
                      <div className="space-y-3">
                        {t.bento.workspace.identities.map((item, i) => (
                          <div key={i} className="flex items-center gap-3 text-lg font-semibold tracking-tight text-gray-700">
                            <span className="p-1.5 bg-white shadow-sm rounded-lg text-indigo-500">{item.icon}</span>
                            {item.text}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1 row-span-1 bg-orange-50/50 border border-orange-100/50 rounded-[2.5rem] p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-500">
                    <div className="flex justify-between items-center"><div className="p-2 bg-white rounded-xl shadow-sm"><Headphones size={20} className="text-orange-500" /></div><span className="text-[10px] uppercase text-orange-400 tracking-widest font-bold">{t.bento.interest.label}</span></div>
                    <div><div className="text-lg font-bold text-orange-900 tracking-tight leading-tight">{t.bento.interest.value}</div><div className="text-[9px] font-bold text-orange-400/60 tracking-widest uppercase">{t.bento.interest.status}</div></div>
                  </div>
                  <div className="col-span-1 row-span-1 bg-orange-50/50 border border-orange-100/50 rounded-[2.5rem] p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-500">
                    <div className="flex justify-between items-center"><div className="p-2 bg-white rounded-xl shadow-sm"><Gamepad2 size={20} className="text-orange-500" /></div><span className="text-[10px] uppercase text-orange-400 tracking-widest font-bold">{t.bento.project.label}</span></div>
                    <div><div className="text-lg font-bold text-orange-900 tracking-tight leading-tight">{t.bento.project.prefix}<br />{t.bento.project.suffix}</div><div className="text-[9px] font-bold text-orange-400/60 tracking-widest uppercase">{t.bento.project.status}</div></div>
                  </div>
                </div>

                <div className="pt-20 border-t border-gray-200">
                  <div className="grid lg:grid-cols-5 gap-16">
                    <div className="lg:col-span-2 space-y-8">
                      <h3 className="text-4xl font-bold tracking-tight-apple">{t.about.title}</h3>
                      <p className="text-gray-500 leading-relaxed tracking-tight">{t.about.bio}</p>
                      <button onClick={() => navigateTo('contact')} className="group bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-blue-600 transition-all flex items-center gap-2 shadow-lg shadow-gray-200">{t.about.btn} <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" /></button>
                    </div>
                    <div className="lg:col-span-3 grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-4">
                      {t.about.traits.map((trait, i) => (
                        <motion.div 
                          key={trait.id} 
                          onClick={() => navigateTo('projects', trait.id)}
                          className={`trait-card group p-6 rounded-[2rem] flex items-start gap-6 ${getTraitClass(trait.id)} transition-all duration-300 active:scale-95`}
                        >
                          <div className={`shrink-0 w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 transition-all duration-300 ${getIconColorClass(trait.id)}`}>{trait.icon}</div>
                          <div className="space-y-1">
                            <h4 className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                              {trait.label} 
                              <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
                            </h4>
                            <p className="text-gray-500 leading-snug">{trait.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.section>
            )}

            {activeTab === 'skills' && (
              <motion.section 
                key={`skills-${lang}`} 
                initial="initial" 
                animate="animate" 
                exit={{ opacity: 0, transition: { duration: 0.2 } }} 
                variants={fadeInUp} 
                className="relative min-h-[600px] flex flex-col items-center space-y-12"
              >
                <div className="text-center space-y-4">
                  <h2 className="text-5xl font-bold tracking-tight-apple">{t.skills.title}</h2>
                  <p className="text-gray-500 max-w-xl mx-auto">{t.skills.subtitle}</p>
                </div>
                
                <div className="w-full h-[650px]">
                  <ScrollTimeline />
                </div>
              </motion.section>
            )}

            {activeTab === 'projects' && (
              <motion.section key="projects" initial="initial" animate="animate" exit={{ opacity: 0, transition: { duration: 0.2 } }} variants={{
                animate: { transition: { staggerChildren: 0.1 } }
              }} className="space-y-24">
                {t.projects.sections.map((section) => (
                  <div 
                    key={section.id} 
                    id={`project-section-${section.id}`} 
                    className="scroll-section space-y-6"
                  >
                    <div className="space-y-2">
                       <h2 className="text-3xl font-bold tracking-tight-apple flex items-center gap-3">
                         <span className={`w-8 h-1 rounded-full ${section.id === 'id' ? 'bg-green-500' : section.id === 'ego' ? 'bg-blue-500' : 'bg-red-500'}`}></span>
                         {section.title}
                       </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {section.items.map((item, iIdx) => (
                        <motion.a
                          href={item.link}
                          key={iIdx}
                          variants={fadeInUp}
                          whileHover={{ y: -10 }}
                          className="project-card group block bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-500"
                        >
                          <div className="relative h-64 overflow-hidden">
                            <div 
                              className="project-card-image-container absolute inset-0 bg-cover bg-center"
                              style={{ backgroundImage: `url(${item.img})` }}
                            />
                            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                            <div className="absolute top-6 right-6 p-3 bg-white/20 backdrop-blur-md text-white rounded-full opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 shadow-lg">
                              <ArrowUpRight size={20} />
                            </div>
                          </div>

                          <div className="p-8 space-y-4">
                            <div className="flex gap-2">
                              {item.tags.map(tag => (
                                <span key={tag} className="text-[10px] uppercase font-bold text-gray-400 px-3 py-1 bg-gray-50 rounded-full group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <h3 className="text-2xl font-bold tracking-tight-apple">{item.title}</h3>
                            <p className="text-gray-500 leading-relaxed text-sm md:text-base line-clamp-2">
                              {item.desc}
                            </p>
                          </div>
                        </motion.a>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.section>
            )}

            {activeTab === 'contact' && (
              <motion.section key="contact" initial="initial" animate="animate" exit={{ opacity: 0, transition: { duration: 0.2 } }} variants={fadeInUp} className="space-y-16 py-10">
                <div className="text-center space-y-4">
                  <h2 className="text-5xl md:text-7xl font-bold tracking-tighter-apple">{t.contact.title}</h2>
                  <p className="text-xl text-gray-500 max-w-2xl mx-auto">{t.contact.sub}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {socialPlatforms.map((platform, i) => (
                    <motion.a
                      key={platform.id}
                      href={platform.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="social-card group p-8 rounded-[2.5rem] flex flex-col justify-between h-64 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                         {React.cloneElement(platform.icon, { size: 120 })}
                      </div>

                      <div className="flex justify-between items-start relative z-10">
                        <div 
                          className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg bg-white"
                          style={{ color: platform.color }}
                        >
                          {platform.icon}
                        </div>
                        <div className="p-2 rounded-full bg-gray-50 text-gray-300 group-hover:text-blue-500 transition-all duration-300">
                          <ExternalLink size={18} />
                        </div>
                      </div>

                      <div className="relative z-10 space-y-1">
                        <h4 
                          className="text-2xl font-bold tracking-tight-apple transition-colors duration-300"
                          style={{ color: platform.color }}
                        >
                          {platform.name}
                        </h4>
                        <p className="text-gray-400 text-sm font-medium">{platform.desc}</p>
                      </div>
                    </motion.a>
                  ))}
                </div>

                <div className="text-center pt-10">
                   <p className="text-gray-400 mb-4">或者直接通过邮件联系</p>
                   <a href="mailto:niligunzhangshifu@gmail.com" className="text-2xl font-medium border-b-2 border-black/10 hover:border-blue-500 hover:text-blue-500 transition-all pb-1">niligunzhangshifu@gmail.com</a>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="py-10 border-t border-gray-200 text-center text-sm text-gray-400">
        <p>© 2025 AlexZhang. {t.footer}.</p>
      </footer>
    </div>
  );
};

export default App;