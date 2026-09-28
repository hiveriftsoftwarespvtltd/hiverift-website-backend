import { Injectable, NotFoundException, OnModuleInit, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CaseStudy, CaseStudyDocument } from './entities/case-study.entity';
import { CreateCaseStudyDto } from './dto/create-case-study.dto';

const INITIAL_PORTFOLIO_SEEDS = [
  {
    projectId: "paitrik-homes",
    title: "Paitrik Homes",
    category: "web",
    categoryLabel: "Architecture & Turnkey Construction",
    description: "Architecture and turnkey construction platform featuring interactive 3D layout views, room specifications, and instant land verification workflows.",
    client: "Paitrik Homes Pvt Ltd",
    industry: "Real Estate, Architecture & Construction",
    timeline: "6 Weeks",
    services: ["Custom Web Engineering", "3D Interactive Floorplans", "Lead Capture Automation"],
    techStack: ["Next.js 15", "TypeScript", "Tailwind CSS", "Node.js", "Cloudflare CDN"],
    challenge: "Paitrik Homes struggled with high bounce rates and disjointed WhatsApp inquiries due to static PDF brochures and slow image-heavy pages, which cost them prospective homebuilders.",
    solution: "HiveRift engineered a lightning-fast Next.js architecture featuring progressive image rendering, interactive 3D layout viewers, land verification calculators, and automated CRM routing.",
    keyFeatures: [
      "Interactive 3D Floorplan & Elevation Viewer",
      "Instant Land Verification & Budget Calculator",
      "Multi-Step Turnkey Milestone Estimator",
      "Automated WhatsApp & CRM Routing",
      "Sub-Second Core Web Vitals Performance"
    ],
    howWeStarted: "When Paitrik Homes reached out to HiveRift, their founders were frustrated that high-intent homebuilders were dropping off before ever speaking to a consultant. Instead of treating this as a simple visual redesign, our senior engineering lead sat down with their sales and architecture teams in Noida. We walked through their customer inquiries and discovered that prospective homeowners felt overwhelmed by static CAD drawings and pricing opacity. We started by mapping a transparent 3D home discovery journey, ensuring every visitor could visualize floorplans interactively before submitting their inquiry.",
    humanTouchPoints: [
      {
        title: "Founder Discovery Session",
        description: "Spent 2 days on-site understanding their turnkey construction workflow, land acquisition queries, and homeowner expectations."
      },
      {
        title: "Interactive Co-Creation",
        description: "Prototyped floorplan selectors with live feedback from their on-ground construction managers and architectural draftsmen."
      },
      {
        title: "White-Glove Team Onboarding",
        description: "Conducted interactive walkthrough sessions with their sales team to integrate real-time WhatsApp inquiry handoffs."
      }
    ],
    image: "/case-studies/image_13.webp",
    projectUrl: "https://paitrik.homes/",
    order: 1,
    isPublished: true
  },
  {
    projectId: "ca-shobhit-jain",
    title: "CA Shobhit Jain",
    category: "web",
    categoryLabel: "NRI Financial Advisory & Taxation",
    description: "Corporate financial advisory and NRI compliance portal serving clients across UAE, USA, UK, Canada & Singapore with consultation booking funnels.",
    client: "CA Shobhit Jain & Associates",
    industry: "Corporate Finance & NRI Tax Compliance",
    timeline: "4 Weeks",
    services: ["Corporate Portal Design", "Consultation Booking Engine", "International Payment Gateway"],
    techStack: ["Next.js", "Tailwind CSS", "Stripe & Razorpay APIs", "PostgreSQL", "Node.js"],
    challenge: "Managing international NRI clients across different time zones resulted in back-and-forth email scheduling and missed consultation fee collection.",
    solution: "Built a secure, compliance-ready advisory portal with dynamic timezone calendar scheduling, upfront consultation payments, and automated document checklist delivery.",
    keyFeatures: [
      "Automated Multi-Timezone Consultation Booking",
      "Integrated NRI Advisory Funnels",
      "Secure Client Document Vault",
      "Cross-Border Payment Processing",
      "Instant WhatsApp & Email Reminders"
    ],
    howWeStarted: "The engagement began when CA Shobhit Jain reached out about lost international advisory opportunities. NRI clients across Dubai, Singapore, and London were struggling with timezone delays and confusing scheduling threads. Rather than recommending an off-the-shelf scheduler, our product team spent time understanding the legal compliance and tax advisory lifecycle. We designed a clear consultation onboarding flow that guides NRIs through specific service requirements and automated time-zone conversions before securing an advisory slot.",
    humanTouchPoints: [
      {
        title: "Practice Workflow Audit",
        description: "Analyzed client intake processes across cross-border taxation, FEMA regulations, and NRI wealth advisory."
      },
      {
        title: "Frictionless UX Workshop",
        description: "Created tailored booking flows that eliminate back-and-forth timezone confusion for international clients."
      },
      {
        title: "Direct Engineer Access",
        description: "Set up a dedicated communication channel to personally support the firm through initial client bookings."
      }
    ],
    image: "/case-studies/image_02.webp",
    projectUrl: "https://cashobhitjain.com/",
    order: 2,
    isPublished: true
  },
  {
    projectId: "jiyo-life-travel",
    title: "Jiyo Life Travel",
    category: "web",
    categoryLabel: "Tours, Flights & Luxury Holidays",
    description: "High-conversion holiday booking engine featuring flight search, luxury stay curation, live daily offers, and 24/7 travel concierge integration.",
    client: "Jiyo Life Travel Experiences",
    industry: "Tours, Travel & Luxury Hospitality",
    timeline: "5 Weeks",
    services: ["Custom Travel Portal", "Package Inquiry Funnels", "Mobile Responsive UX"],
    techStack: ["React", "Next.js", "Framer Motion", "Tailwind CSS", "REST APIs"],
    challenge: "Off-the-shelf travel themes were bloated, loaded slowly on mobile networks, and lacked flexible itinerary customization for luxury travelers.",
    solution: "HiveRift delivered an ultra-responsive, mobile-first booking portal with dynamic itinerary builders, seasonal package filters, and instant WhatsApp booking triggers.",
    keyFeatures: [
      "Dynamic Destination & Tour Filtering",
      "Real-Time Itinerary Request Form",
      "WhatsApp Concierge 1-Click Trigger",
      "Curated Luxury Stay Highlights",
      "High-Speed Image Optimization"
    ],
    howWeStarted: "When Jiyo Life Travel approached HiveRift, travel enthusiasts were calling in with broad inquiries, requiring travel consultants to manually prepare itineraries over several days. Our team sat alongside their itinerary planners to understand how customized tours are built. We engineered an intelligent trip planner that lets travelers select destinations, travel dates, and luxury preferences, automatically generating tailored holiday packages that consultants can review and finalize with the client.",
    humanTouchPoints: [
      {
        title: "Travel Consultant Shadowing",
        description: "Analyzed how their sales desk qualifies international and domestic luxury travel queries."
      },
      {
        title: "Customer Journey Mapping",
        description: "Designed visual destination explorers and transparent inquiry flows based on authentic traveler feedback."
      },
      {
        title: "Direct Go-Live Support",
        description: "Supervised booking workflows during seasonal holiday peaks with real-time technical assistance."
      }
    ],
    image: "/case-studies/image_08.webp",
    projectUrl: "https://jiyolifetravel.com/",
    order: 3,
    isPublished: true
  },
  {
    projectId: "buxaa-travel",
    title: "BUXAA Travel Gear",
    category: "ecommerce",
    categoryLabel: "D2C Luggage & Smart Travel Bags",
    description: "Modern D2C eCommerce store for smart travel bags, anti-theft backpacks, and modular luggage with custom bundles and instant checkout.",
    client: "BUXAA Innovations Pvt Ltd",
    industry: "D2C Retail & Travel Gear",
    timeline: "6 Weeks",
    services: ["eCommerce UI/UX", "Next.js Headless Store", "Payment Gateway Integration"],
    techStack: ["Next.js", "Node.js", "MongoDB", "Razorpay", "Tailwind CSS"],
    challenge: "Slow checkout flows and poor mobile product visualization were resulting in significant cart drop-offs on their previous platform.",
    solution: "Engineered a headless eCommerce storefront with 360-degree product showcases, instant mobile checkout, automated inventory sync, and one-click coupon validation.",
    keyFeatures: [
      "Sub-Second Page Transitions",
      "Multi-Angle Product Zoom & Inspection",
      "1-Click UPI & Card Checkout Funnel",
      "Smart Product Bundle Discounts",
      "Real-Time Delivery Pincode Checker"
    ],
    howWeStarted: "BUXAA's founder connected with HiveRift seeking to transition from marketplace dependence (Amazon/Flipkart) to an independent direct-to-consumer brand. In our kickoff strategy session, we examined customer return patterns and cart abandonment data. The human insight was evident: shoppers wanted to feel the durability, water-resistance, and internal organization of the bags before buying. We started by designing high-impact interactive product showcases, dynamic pack-size visualizations, and a friction-free one-page checkout.",
    humanTouchPoints: [
      {
        title: "D2C Brand Immersion",
        description: "Evaluated the physical product range, unboxing experience, and customer touchpoints to craft genuine storytelling."
      },
      {
        title: "Checkout Optimization Sprints",
        description: "Iterated mobile checkout flows directly with their logistics and fulfillment team."
      },
      {
        title: "Pre-Launch Stress Testing",
        description: "Simulated heavy flash-sale traffic conditions manually to ensure bulletproof server stability."
      }
    ],
    image: "/case-studies/image_03.webp",
    projectUrl: "https://buxaa.in/",
    order: 4,
    isPublished: true
  },
  {
    projectId: "adv-tushar-garg",
    title: "Adv. Tushar Garg",
    category: "web",
    categoryLabel: "Supreme Court & Corporate Legal Practice",
    description: "Corporate legal counsel and litigation portal showcasing Supreme Court practice areas, legal advisories, case consultations, and publication archives.",
    client: "Chambers of Adv. Tushar Garg",
    industry: "Legal Practice, Corporate Litigation & Supreme Court",
    timeline: "3 Weeks",
    services: ["Bespoke Legal Website", "Appointment Management", "Article & Judgments Archive"],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
    challenge: "Clients struggled to review past judgments and practice domains, creating repetitive introductory calls and scheduling delays.",
    solution: "Developed an authoritative, dignified digital presence with a comprehensive judgment archive, verified legal credentials, and a streamlined case consultation request system.",
    keyFeatures: [
      "Authoritative Practice Area Portfolios",
      "Searchable Judgments & Articles Library",
      "Confidential Consultation Intake Form",
      "Mobile-Optimized Clean Typography",
      "Bar Council Compliance Standards"
    ],
    howWeStarted: "Advocate Tushar Garg needed a professional digital presence reflecting his Supreme Court and High Court litigation practice. Given the strict Bar Council standards on legal representation, our team held multiple in-person discussions to ensure the platform adhered strictly to ethical guidelines while projecting legal authority. We crafted an elegant, dignified digital presence highlighting practice areas, landmark insights, and secure consultation intake for corporate and individual litigants.",
    humanTouchPoints: [
      {
        title: "Legal Compliance Consultation",
        description: "Reviewed regulatory guidelines to ensure all messaging respects professional legal ethics."
      },
      {
        title: "Discreet Client Intake",
        description: "Designed private, confidential consultation inquiry funnels for sensitive litigation matters."
      },
      {
        title: "Personalized Delivery",
        description: "Delivered a clean, high-performance static architecture hosted with bank-grade encryption."
      }
    ],
    image: "/case-studies/image_09.webp",
    projectUrl: "https://advocatetushargarg.com/",
    order: 5,
    isPublished: true
  },
  {
    projectId: "alibda-interiors",
    title: "Alibda Interiors",
    category: "web",
    categoryLabel: "Luxury Architecture & Interior Studio",
    description: "High-end interior architecture and turnkey design studio platform featuring full-screen project galleries, material palettes, and consultation bookings.",
    client: "Alibda Interiors Studio",
    industry: "Architecture, Luxury Interiors & Turnkey Fitouts",
    timeline: "5 Weeks",
    services: ["Luxury Brand Experience", "High-Resolution Image Pipeline", "Client Portfolio CMS"],
    techStack: ["Next.js", "React", "Tailwind CSS", "Framer Motion", "Cloudinary"],
    challenge: "High-resolution architectural photography slowed page speeds drastically, causing luxury clients to leave before viewing complete design portfolios.",
    solution: "Designed an editorial-style luxury experience with next-gen image compression, fluid page transitions, and interactive design inquiry flows.",
    keyFeatures: [
      "Full-Screen Architectural Lookbook",
      "Filtered Residential & Commercial Portfolios",
      "Material Finishes & Palette Inspection",
      "Direct Designer Consultation Request",
      "Flawless 60fps Mobile Scroll Experience"
    ],
    howWeStarted: "Alibda Interiors’ creative director reached out to us with an exceptional portfolio of luxury residential villas and commercial spaces, but a website that failed to convey their architectural craftsmanship. In our initial creative consultation, we reviewed physical mood boards, architectural blueprints, and material finishes. We decided that the digital platform needed to mirror the tactile sophistication of their physical projects through high-resolution portfolio curation, editorial typography, and full-screen immersive galleries.",
    humanTouchPoints: [
      {
        title: "Creative Vision Alignment",
        description: "Spent dedicated sessions understanding their architectural ethos, luxury client personas, and design philosophy."
      },
      {
        title: "Editorial Layout Curation",
        description: "Curated each project showcase hand-in-hand with their lead interior designers."
      },
      {
        title: "Performance Engineering",
        description: "Optimized high-resolution architectural imagery so pages load instantly on high-end mobile devices."
      }
    ],
    image: "/case-studies/image_07.webp",
    projectUrl: "https://alibdainteriors.com/",
    order: 6,
    isPublished: true
  },
  {
    projectId: "hiverift-desk",
    title: "HiveRift Desk",
    category: "software",
    categoryLabel: "Enterprise Workforce OS & CRM Platform",
    description: "Centralized internal operating system integrating real-time inquiry management, attendance tracking, project sprints, and team performance analytics.",
    client: "Enterprise SaaS & Internal Operations",
    industry: "Enterprise Software & Operations Management",
    timeline: "8 Weeks",
    services: ["Custom SaaS Architecture", "Real-Time WebSockets", "Role-Based Access Control"],
    techStack: ["Next.js", "Node.js", "PostgreSQL", "Socket.io", "Redis", "Docker"],
    challenge: "Fragmented third-party SaaS subscriptions caused disconnected customer data, delayed follow-ups, and expensive recurring seat licenses.",
    solution: "Engineered a unified, high-security enterprise workforce OS that centralizes client communications, automated OTP verification, and sprint tracking.",
    keyFeatures: [
      "Real-Time WebSocket Inquiry Dispatch",
      "Role-Based Security & Permissions Engine",
      "Multi-Branch Client Lead Tracking",
      "Custom Automated Reporting Pipelines",
      "Sub-Second Database Query Execution"
    ],
    howWeStarted: "HiveRift Desk was born out of real frustration within growing enterprise teams juggling six different fragmented tools for CRM, employee tracking, and task delegation. We started by conducting candid interviews with sales managers, field executives, and HR personnel. Listening directly to their day-to-day pain points revealed that excessive form-filling was driving low employee adoption. We designed a zero-clutter, role-based dashboard that automates status updates and provides real-time visibility without micro-management.",
    humanTouchPoints: [
      {
        title: "End-User Shadowing",
        description: "Shadowed sales representatives and department heads during active daily shifts to track friction points."
      },
      {
        title: "Iterative Sprint Demos",
        description: "Ran weekly demo walkthroughs with team leaders to fine-tune workflows before rolling out updates."
      },
      {
        title: "Continuous Human Support",
        description: "Maintained a dedicated engineering escalation channel ensuring rapid feature iteration based on actual staff feedback."
      }
    ],
    image: "/case-studies/image_05.webp",
    projectUrl: "https://desk.hiverift.com/",
    order: 7,
    isPublished: true
  },
  {
    projectId: "santhari-singh",
    title: "Santhari Singh",
    category: "ecommerce",
    categoryLabel: "Ayurvedic Healthcare & Herbal Storefront",
    description: "Direct-to-consumer Ayurvedic wellness storefront featuring herbal formulation discovery, clinical dosage guidance, and secure pan-India checkout.",
    client: "Santhari Singh Herbal Healthcare",
    industry: "Ayurveda, Health & Organic Wellness",
    timeline: "4 Weeks",
    services: ["eCommerce Engineering", "Herbal Formulation Finder", "Payment & Courier Integrations"],
    techStack: ["Next.js", "Tailwind CSS", "MongoDB", "Shiprocket API", "Cashfree"],
    challenge: "Customers needed guidance regarding specific health conditions and dosages, leading to hesitated purchases and low online conversion.",
    solution: "Engineered a consultative eCommerce storefront with a dynamic herbal formulation finder, symptom-based navigation, and automated order tracking.",
    keyFeatures: [
      "Symptom & Dosha Product Matcher",
      "Clean Ingredients & Clinical Usage Badges",
      "Pan-India Shipping Calculator",
      "One-Step WhatsApp Customer Support",
      "Automated Courier Tracking Webhooks"
    ],
    howWeStarted: "Santhari Singh's lineage of authentic Ayurvedic remedies faced a common challenge in the digital age: customers were hesitant to buy herbal formulations online without personal consultation. HiveRift started by meeting with their Ayurvedic practitioners. We integrated guided Dosha and symptom assessment flows that replicate an in-clinic consultation, recommending verified traditional formulations suited to each customer's wellness goals.",
    humanTouchPoints: [
      {
        title: "Traditional Medicine Alignment",
        description: "Consulted with Ayurvedic vaidyas to correctly categorize herbs, benefits, and usage instructions."
      },
      {
        title: "Consultative eCommerce UX",
        description: "Engineered guided discovery quizzes that build consumer confidence before checkout."
      },
      {
        title: "Secure Payment Integration",
        description: "Implemented seamless UPI and Cash-on-Delivery payment flows optimized for Indian wellness consumers."
      }
    ],
    image: "/case-studies/image_01.webp",
    projectUrl: "https://santharisingh.com/",
    order: 8,
    isPublished: true
  },
  {
    projectId: "the-games-carnival",
    title: "The Games Carnival",
    category: "web",
    categoryLabel: "Theme Party Games & Entertainment Setup",
    description: "Interactive gaming and party setup rental platform featuring package builders, venue booking calendars, and custom entertainment itineraries.",
    client: "The Games Carnival Event Co.",
    industry: "Events, Gaming & Entertainment Experiences",
    timeline: "3 Weeks",
    services: ["Interactive Experience Design", "Event Booking Calendar", "Instant Quotation Engine"],
    techStack: ["Next.js", "React", "Tailwind CSS", "Framer Motion"],
    challenge: "Event planners struggled with complex custom quotation phone calls, slowing down confirmations for weekend party dates.",
    solution: "Engineered a playful, interactive party package builder where planners select game setups, guest capacity, and instantly lock reservations.",
    keyFeatures: [
      "Interactive Game Rental Package Configurator",
      "Real-Time Event Date Availability Checker",
      "Instant WhatsApp Quotation PDF Dispatch",
      "Mobile-First Vibrant UI & Smooth Animations",
      "Corporate Event Inquiry Portal"
    ],
    howWeStarted: "The collaboration kicked off when the event organizers approached us with a high-stakes challenge: seasonal party bookings were causing front-desk chaos, double-bookings, and unanswered customer calls. We visited their gaming setup firsthand to experience how customers interact with their entertainment zones. This hands-on understanding enabled us to build an intuitive multi-player reservation portal with instant slot locking and dynamic pricing for corporate and birthday events.",
    humanTouchPoints: [
      {
        title: "On-Site Venue Discovery",
        description: "Spent an evening on-site observing customer check-in lines and game master coordination."
      },
      {
        title: "Live Prototype Validation",
        description: "Tested the mobile booking interface with real event attendees to eliminate confusion."
      },
      {
        title: "Staff Operations Training",
        description: "Provided in-person training for front-desk supervisors on managing live bookings and walk-ins."
      }
    ],
    image: "/case-studies/image_04.webp",
    projectUrl: "https://thegamescarnival.com/",
    order: 9,
    isPublished: true
  },
  {
    projectId: "ca-shambhu-kumar",
    title: "CA Shambhu Kumar & Co.",
    category: "web",
    categoryLabel: "Audit, GST Calculation & Compliance Portal",
    description: "Chartered accountancy portal offering automated GST calculation engines, business incorporation workflows, and direct consultation scheduling.",
    client: "Shambhu Kumar & Associates",
    industry: "Chartered Accountancy, Audits & Corporate Tax",
    timeline: "4 Weeks",
    services: ["Web Engineering", "Interactive Tax Calculators", "Lead Management"],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js"],
    challenge: "Routine compliance inquiries clogged phone lines, taking valuable senior partner time away from complex corporate advisory.",
    solution: "Integrated client self-service tools including automated GST calculators, compliance calendars, and pre-screened consultation forms.",
    keyFeatures: [
      "Dynamic GST & Corporate Tax Calculator",
      "Monthly Tax Due-Date Compliance Calendar",
      "Instant Consultation Booking Funnel",
      "Client Document Preparation Guides",
      "Fast-Loading Technical Architecture"
    ],
    howWeStarted: "CA Shambhu Kumar connected with HiveRift to modernize a 15-year-old financial consultancy practice. Their junior accountants were spending hours answering routine GST rate queries and document checklist requests over the phone. During our initial discovery sprint, we mapped out the most frequent client questions. We engineered an automated GST calculator and compliance knowledge base, freeing up the senior accounting team to focus on high-value corporate tax audits.",
    humanTouchPoints: [
      {
        title: "Compliance Practice Audit",
        description: "Reviewed regular client inquiries, document submission checklists, and tax filing timelines."
      },
      {
        title: "Collaborative Tool Design",
        description: "Collaborated with their senior chartered accountants to verify accuracy in tax calculation algorithms."
      },
      {
        title: "Staff Digital Enablement",
        description: "Provided structured guidance to ensure their staff could effortlessly update tax rates and advisories."
      }
    ],
    image: "/case-studies/image_06.webp",
    projectUrl: "https://cashambhukumar.com/",
    order: 10,
    isPublished: true
  },
  {
    projectId: "quickfix-bookkeeping",
    title: "QuickFix Bookkeeping",
    category: "software",
    categoryLabel: "QuickBooks Integration & Accounting OS",
    description: "Full-service outsourced bookkeeping platform featuring automated QuickBooks reconciliation, payroll support, and international tax filing services.",
    client: "QuickFix Global Bookkeeping LLC",
    industry: "Fintech, Outsourced Accounting & QuickBooks",
    timeline: "6 Weeks",
    services: ["Web Platform Engineering", "Workflow Automation", "Client Onboarding Portals"],
    techStack: ["Next.js", "React", "Tailwind CSS", "Node.js", "Stripe"],
    challenge: "Global clients across the US and UK needed clear transparency regarding secure accounting procedures, data encryption, and monthly deliverables.",
    solution: "Engineered a modern bookkeeping portal complete with transparent service tiers, secure onboarding flows, and automated tax calendar alerts.",
    keyFeatures: [
      "Self-Serve Bookkeeping Plan Configurator",
      "Intuit QuickBooks Partner Integration",
      "Encrypted Financial Document Uploader",
      "Multi-Currency Advisory Service Pages",
      "Client Testimonial & Case Study Sliders"
    ],
    howWeStarted: "QuickFix Bookkeeping served businesses in the US, UK, and Australia from Delhi NCR, but potential clients were hesitant due to concerns about international data confidentiality and QuickBooks synchronization. In our discovery workshops, we established trust architecture as the primary design mandate. We highlighted SOC-2 compliance, QuickBooks certified advisor badges, and integrated interactive audit request flows that demonstrate professional rigor from the very first click.",
    humanTouchPoints: [
      {
        title: "International Client Journey Audit",
        description: "Mapped out common reservations international SMBs have when outsourcing finance workflows."
      },
      {
        title: "Trust & Security Framework",
        description: "Engineered clear visual security credentials, NDA assurance modules, and multi-currency advisory calculators."
      },
      {
        title: "Ongoing Technical Guidance",
        description: "Provided continuous architectural advice as they introduced new payroll and tax integration services."
      }
    ],
    image: "/case-studies/image_10.webp",
    projectUrl: "https://quickfixbookkeeping.com/",
    order: 11,
    isPublished: true
  },
  {
    projectId: "infinity-luxe-spaces",
    title: "Infinity Luxe Spaces",
    category: "web",
    categoryLabel: "Ultra-Luxury Living & Residential Interiors",
    description: "Premium interior design portfolio showcasing penthouses, bespoke villas, and commercial spaces with interactive mood boards and video walk-throughs.",
    client: "Infinity Luxe Spaces LLP",
    industry: "Luxury Living, Penthouse Interiors & Architecture",
    timeline: "5 Weeks",
    services: ["Luxury Web Design", "Visual Storytelling", "High-Net-Worth Lead Funnels"],
    techStack: ["Next.js", "React", "Framer Motion", "Tailwind CSS"],
    challenge: "High-net-worth clients expected an exclusive digital experience matching the luxury finishes of penthouses and bespoke residential villas.",
    solution: "Crafted an editorial, dark-and-gold aesthetic featuring smooth parallax scrolling, immersive video hero headers, and direct architectural concierge booking.",
    keyFeatures: [
      "Ultra-Luxury Visual Aesthetic & Typography",
      "Interactive Villa & Penthouse Floorplan Demos",
      "Full-Screen Project Lookbooks",
      "Direct WhatsApp VIP Concierge Trigger",
      "Zero-Layout-Shift Performance Tuning"
    ],
    howWeStarted: "The leadership team at Infinity Luxe Spaces came to us seeking to position their interior design firm in the ultra-luxury market. High-net-worth clients expected a bespoke experience from the moment they discovered the brand. Our design team worked closely with their founders to understand the distinction between standard interior remodeling and ultra-luxury turnkey styling. We built an editorial, dark-and-gold visual universe that immediately distinguishes them from mainstream contractors.",
    humanTouchPoints: [
      {
        title: "Luxury Persona Discovery",
        description: "Defined the sensory and visual expectations of luxury penthouse and villa owners."
      },
      {
        title: "Interactive Project Walkthroughs",
        description: "Created fluid, gesture-friendly gallery sliders that highlight material details and textures."
      },
      {
        title: "Executive Onboarding",
        description: "Trained their marketing team on presenting interactive digital lookbooks during in-person client pitches."
      }
    ],
    image: "/case-studies/image_11.webp",
    projectUrl: "https://infinityluxespaces.com/",
    order: 12,
    isPublished: true
  },
  {
    projectId: "luxury-casino-rental",
    title: "Luxury Casino Setup",
    category: "web",
    categoryLabel: "Casino Night Entertainment & Party Rentals",
    description: "Theme entertainment rental portal offering Roulette, Blackjack, and Poker table bookings for private corporate galas and destination weddings.",
    client: "Luxury Casino Party Rentals",
    industry: "Entertainment, Corporate Galas & Casino Rentals",
    timeline: "4 Weeks",
    services: ["High-Conversion Website", "Package Builder", "Lead Dispatch Automation"],
    techStack: ["Next.js", "Tailwind CSS", "Framer Motion", "Vercel"],
    challenge: "Potential hosts needed quick quotes for customized table counts without waiting hours for manual sales calculations.",
    solution: "Engineered an interactive table rental package builder that calculates equipment, dealer staffing, and logistics instantly based on guest size.",
    keyFeatures: [
      "Interactive Game Table Selection Matrix",
      "Guest Count Capacity & Dealer Calculator",
      "Corporate Event Lookbook & Gallery",
      "Fast 1-Click WhatsApp Proposal Trigger",
      "Mobile-Optimized Clean Booking Engine"
    ],
    howWeStarted: "The founder of Luxury Casino Setup Rental was experiencing high call volumes for weekend parties, with staff spending excessive time explaining game types, table counts, and dealer availability. We joined them at an event setup to observe logistics firsthand. We engineered an interactive party package builder that lets event hosts select games (Roulette, Poker, Blackjack), specify guest counts, and receive a customized setup proposal in seconds.",
    humanTouchPoints: [
      {
        title: "Event Operations Review",
        description: "Observed live party setups and equipment logistics to understand packaging variations."
      },
      {
        title: "Custom Quotation Engine",
        description: "Engineered a dynamic package builder that eliminates back-and-forth price estimations."
      },
      {
        title: "Weekend Readiness Standby",
        description: "Maintained direct engineer standby during peak weekend event dates to guarantee zero downtime."
      }
    ],
    image: "/case-studies/image_12.webp",
    projectUrl: "https://luxurycasinosetup.com/",
    order: 13,
    isPublished: true
  },
  {
    projectId: "paras-yoga-mat",
    title: "Paras Yoga Mat",
    category: "ecommerce",
    categoryLabel: "Commercial Fitness & Sports Flooring",
    description: "B2B commercial playground flooring, gym interlocking tiles, and yoga mat manufacturing platform with bulk quotation calculators.",
    client: "Paras Rubber & Mat Industries",
    industry: "Manufacturing, Sports Flooring & Fitness",
    timeline: "5 Weeks",
    services: ["B2B Catalog Design", "Bulk Inquiry Automation", "Product Spec Sheets"],
    techStack: ["Next.js", "React", "Tailwind CSS", "Node.js"],
    challenge: "B2B institutional buyers found it tedious to request bulk manufacturing specs and container pricing through generic contact forms.",
    solution: "Developed a comprehensive industrial product portal with technical spec downloads, bulk order square-meter calculators, and sample request workflows.",
    keyFeatures: [
      "Interactive Flooring Area (Sq Ft) Calculator",
      "Technical Spec Sheet & Lab Report Downloads",
      "Wholesale / Container RFQ (Request for Quote) Form",
      "Sample Dispatch Request Automation",
      "Search Engine Optimized Product Categorization"
    ],
    howWeStarted: "Paras Yoga Mat manufactured world-class EVA foam flooring and commercial fitness mats, but their B2B digital footprint was virtually non-existent. International gym chains and school sports boards couldn't easily verify technical specs or request bulk container pricing. We sat with their factory production heads to translate complex material specifications into clear visual buyer guides and bulk RFQ (Request for Quote) workflows.",
    humanTouchPoints: [
      {
        title: "Factory Floor Discovery",
        description: "Toured manufacturing facilities to document tensile strength, density grades, and eco-certifications."
      },
      {
        title: "B2B Buyer Persona Flow",
        description: "Designed dedicated technical specification sheets and automated wholesale inquiry routing."
      },
      {
        title: "Export Market Enablement",
        description: "Structured the platform for international trade buyers with currency selectors and sample request funnels."
      }
    ],
    image: "/case-studies/image_14.webp",
    projectUrl: "https://parasyogamat.com/",
    order: 14,
    isPublished: true
  },
  {
    projectId: "mailpipes-automation",
    title: "MailPipes Automation",
    category: "software",
    categoryLabel: "Cold Outbound Email & Warmup SaaS",
    description: "High-volume transactional and outbound email delivery platform with automated inbox warmup, domain reputation monitoring, and REST APIs.",
    client: "MailPipes SaaS Platform",
    industry: "Developer Tools, SaaS & Marketing Automation",
    timeline: "8 Weeks",
    services: ["SaaS Architecture", "High-Concurrency Backend", "Real-Time Deliverability Telemetry"],
    techStack: ["Next.js", "Go / Node.js", "Redis", "ClickHouse", "Docker", "Tailwind CSS"],
    challenge: "Engineering scalable SMTP worker nodes and deliverability diagnostics capable of processing hundreds of thousands of daily emails without lag.",
    solution: "Built a reactive SaaS dashboard with live sending logs, automated domain DNS verification (DKIM/SPF), and smart inbox warmup schedules.",
    keyFeatures: [
      "Real-Time SMTP & API Dispatch Telemetry",
      "Automated IP & Custom Domain Warmup Schedules",
      "One-Click DKIM, SPF & DMARC DNS Checker",
      "Visual Campaign Sequence Builder",
      "Webhook Integrations for Zapier & Make"
    ],
    howWeStarted: "When the founders of MailPipes initiated discussions with HiveRift, they had built a core email delivery daemon but lacked a modern SaaS user experience that marketing teams could adopt without technical assistance. Our lead product architect embedded with their team for two intensive sprint cycles. We reimagined their dashboard from the ground up: replacing complex terminal commands with visual campaign workflows, automated IP warmup schedules, and live deliverability diagnostics.",
    humanTouchPoints: [
      {
        title: "Founder-Architect Pairing",
        description: "Embedded directly with technical founders to understand queue management and deliverability logic."
      },
      {
        title: "SaaS User Experience Redesign",
        description: "Transformed raw logs into human-readable deliverability insights and drag-and-drop campaign funnels."
      },
      {
        title: "Beta Customer Feedback Loops",
        description: "Interviewed early beta users to refine campaign setup wizards and eliminate usability hurdles."
      }
    ],
    image: "/case-studies/image_15.webp",
    projectUrl: "https://mailpipes.com/",
    order: 15,
    isPublished: true
  },
  {
    projectId: "infinity-luxe-kitchens",
    title: "Infinity Luxe - Kitchens",
    category: "web",
    categoryLabel: "Modular Kitchens & Architectural Joinery",
    description: "Specialized modular kitchen design platform featuring interactive layout guides, German hardware showcases, and in-home measurement scheduling.",
    client: "Infinity Luxe Modular Kitchens",
    industry: "Modular Kitchens, Interior Joinery & Home Renovation",
    timeline: "4 Weeks",
    services: ["Custom Web Engineering", "Modular Layout Selector", "Home Visit Scheduler"],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    challenge: "Homeowners felt overwhelmed by technical joinery jargon and needed a simple visual way to plan Island, L-Shape, or Parallel kitchen setups.",
    solution: "Engineered a step-by-step modular kitchen configurator educating homeowners on finishes (Acrylic, PU, Ceramic) and booking free 3D home consults.",
    keyFeatures: [
      "Interactive Modular Layout Configurator",
      "German Hardware (Blum/Hettich) Feature Explorer",
      "Instant Free 3D Site Visit Scheduler",
      "Material Durability & Warranty Guide",
      "Mobile-First Responsive Layout"
    ],
    howWeStarted: "Homeowners investing in custom modular kitchens often experience anxiety around material durability, cabinet ergonomics, and hidden costs. When Infinity Luxe’s modular kitchen division partnered with us, we recommended moving away from generic static photos. We co-created a modular kitchen configuration experience that educates homeowners on shutter finishes, ergonomic drawer systems, and German hardware mechanisms before booking a design visit.",
    humanTouchPoints: [
      {
        title: "Showroom Material Deep-Dive",
        description: "Inspected showroom kitchen setups to document hinge mechanics, carcass materials, and finishes."
      },
      {
        title: "Homeowner Education Journey",
        description: "Designed step-by-step layout guides (L-shaped, Island, Parallel) to assist homeowners in self-assessment."
      },
      {
        title: "Design Consultation Hand-off",
        description: "Integrated direct calendar bookings connecting homeowners directly with senior interior planners."
      }
    ],
    image: "/case-studies/image_16.webp",
    projectUrl: "https://infinityluxekitchens.com/",
    order: 16,
    isPublished: true
  }
];

@Injectable()
export class CaseStudyService implements OnModuleInit {
  private readonly logger = new Logger(CaseStudyService.name);

  constructor(
    @InjectModel(CaseStudy.name)
    private readonly caseStudyModel: Model<CaseStudyDocument>,
  ) {}

  async onModuleInit() {
    try {
      const count = await this.caseStudyModel.countDocuments();
      if (count === 0) {
        this.logger.log('Seeding initial 16 portfolio projects into MongoDB...');
        await this.caseStudyModel.insertMany(INITIAL_PORTFOLIO_SEEDS);
        this.logger.log('Portfolio projects seeded successfully!');
      }
    } catch (err: any) {
      this.logger.error(`Error checking/seeding case studies: ${err.message}`);
    }
  }

  private parseJsonField<T>(field: any, defaultValue: T): T {
    if (!field) return defaultValue;
    if (typeof field === 'string') {
      try {
        return JSON.parse(field);
      } catch {
        // If it's a comma-separated string
        if (Array.isArray(defaultValue)) {
          return field.split(',').map((s: string) => s.trim()).filter(Boolean) as unknown as T;
        }
        return defaultValue;
      }
    }
    return field;
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async findAllPublished(): Promise<CaseStudy[]> {
    return this.caseStudyModel
      .find({ isPublished: true })
      .sort({ order: 1, createdAt: -1 })
      .exec();
  }

  async findAllAdmin(): Promise<CaseStudy[]> {
    return this.caseStudyModel
      .find()
      .sort({ order: 1, createdAt: -1 })
      .exec();
  }

  async findOne(idOrSlug: string): Promise<CaseStudy> {
    let item: CaseStudyDocument | null = null;
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      item = await this.caseStudyModel.findById(idOrSlug).exec();
    }
    if (!item) {
      item = await this.caseStudyModel.findOne({ projectId: idOrSlug }).exec();
    }
    if (!item) {
      throw new NotFoundException(`Case Study "${idOrSlug}" not found`);
    }
    return item;
  }

  async create(dto: CreateCaseStudyDto, file?: any): Promise<CaseStudy> {
    const data: any = { ...dto };

    if (!data.projectId || !data.projectId.trim()) {
      data.projectId = this.slugify(data.title);
    } else {
      data.projectId = this.slugify(data.projectId);
    }

    // Check duplicate slug
    const existing = await this.caseStudyModel.findOne({ projectId: data.projectId }).exec();
    if (existing) {
      data.projectId = `${data.projectId}-${Date.now().toString().slice(-4)}`;
    }

    if (file && file.filename) {
      data.image = `/api/v1/uploads/${file.filename}`;
    }

    data.services = this.parseJsonField<string[]>(data.services, []);
    data.techStack = this.parseJsonField<string[]>(data.techStack, []);
    data.keyFeatures = this.parseJsonField<string[]>(data.keyFeatures, []);
    data.humanTouchPoints = this.parseJsonField<any[]>(data.humanTouchPoints, []);

    if (data.isPublished !== undefined) {
      data.isPublished = String(data.isPublished) === 'true' || data.isPublished === true;
    }
    if (data.order !== undefined) {
      data.order = parseInt(String(data.order), 10) || 0;
    }

    const created = new this.caseStudyModel(data);
    return created.save();
  }

  async update(id: string, dto: Partial<CreateCaseStudyDto>, file?: any): Promise<CaseStudy> {
    const data: any = { ...dto };

    if (file && file.filename) {
      data.image = `/api/v1/uploads/${file.filename}`;
    }

    if (data.services !== undefined) {
      data.services = this.parseJsonField<string[]>(data.services, []);
    }
    if (data.techStack !== undefined) {
      data.techStack = this.parseJsonField<string[]>(data.techStack, []);
    }
    if (data.keyFeatures !== undefined) {
      data.keyFeatures = this.parseJsonField<string[]>(data.keyFeatures, []);
    }
    if (data.humanTouchPoints !== undefined) {
      data.humanTouchPoints = this.parseJsonField<any[]>(data.humanTouchPoints, []);
    }

    if (data.isPublished !== undefined) {
      data.isPublished = String(data.isPublished) === 'true' || data.isPublished === true;
    }
    if (data.order !== undefined) {
      data.order = parseInt(String(data.order), 10) || 0;
    }

    const updated = await this.caseStudyModel
      .findByIdAndUpdate(id, { $set: data }, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException(`Case Study with ID "${id}" not found`);
    }
    return updated;
  }

  async togglePublish(id: string): Promise<CaseStudy> {
    const item = await this.findOne(id);
    item.isPublished = !item.isPublished;
    return (item as CaseStudyDocument).save();
  }

  async delete(id: string): Promise<{ success: boolean; message: string }> {
    const result = await this.caseStudyModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Case Study with ID "${id}" not found`);
    }
    return { success: true, message: 'Case Study deleted successfully' };
  }
}
