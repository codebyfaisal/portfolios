const data = `
{
  "about_me": { "description": "I create fast, responsive, and user-friendly websites using modern technologies like HTML, CSS, JavaScript, and React. Whether building from scratch or enhancing an existing site, I deliver solutions tailored to your goals. Let's bring your vision to life!", "cv": "https://codebyfaisal.netlify.app/muhammad-faisal.pdf" },
  "skills": ["HTML5", "CSS3", "JavaScript", "Bootstrap", "TailwindCSS", "React", "Node.js", "Express", "PostgreSQL", "Prisma", "MongoDB"],
  "services": {
    "Full Stack Web Development": "Building complete web apps with React, Node.js, and Express.",
    "Database Management/Integration": "Managing PostgreSQL, MongoDB, and Prisma for optimized data flow.",
    "MongoDB Database Solutions": "Designing scalable MongoDB databases for performance and reliability.",
    "API Development with Node.js": "Creating secure RESTful APIs using Node.js and Express.",
    "Figma to Full Stack Implementation": "Turning Figma designs into functional websites and applications.",
    "E-commerce Development": "Developing secure, scalable e-commerce platforms with payment and admin features.",
    "Cloud Deployment": "Deploying apps on Heroku, AWS, and Vercel for reliable performance.",
    "Business Management System": "Building robust management systems using Node.js, Express, and PostgreSQL."
  },
  "contact_info": {
    "location": "Peshawar, Pakistan", "whatsapp": "+92 320 9396952", "email": "codebyfaisal@gmail.com",
    "social_links": {
      "LinkedIn": "https://www.linkedin.com/in/codebyfaisal",
      "GitHub": "https://github.com/codebyfaisal",
      "Twitter": "https://twitter.com/codebyfaisal",
      "Facebook": "https://www.facebook.com/codesbyfaisal",
      "Whatsapp": "https://api.whatsapp.com/send/?phone=923209396952&text&type=phone_number&app_absent=1"
    }
  },
  "projects": [
    {
      "name": "e-store-pos", "repo_link": "https://github.com/codebyfaisal/e-store-pos",
      "description": "A full business management system (POS) with online store support for sales, inventory, and customer tracking. Built with React, Node.js/Express, and PostgreSQL.", "live_preview": "https://e-store-pos.vercel.app/", "created_at": "2025-07-20"
    },
    {
      "name": "devlumen-chatbot", "repo_link": "https://github.com/codebyfaisal/devlumen-chatbot",
      "description": "An AI chatbot using the Groq API that helps users explore my portfolio with intelligent, context-aware responses.", "live_preview": "You are the preview", "created_at": "2025-02-16"
    },
    {
      "name": "gadgethub", "repo_link": "https://github.com/codebyfaisal/gadgethub",
      "description": "A lightweight e-commerce site for small businesses featuring a dynamic cart and custom CSS modules.", "live_preview": "https://gadgethub.netlify.app", "created_at": "2025-01-31"
    },
    {
      "name": "devdeepblog", "repo_link": "https://github.com/codebyfaisal/devdeepblog",
      "description": "A full-stack personal blog with a modern design, CRUD support, subscriptions, and email notifications.", "live_preview": "https://devdeepblog.netlify.app", "created_at": "2025-01-29"
    },
    {
      "name": "statefullapi", "repo_link": "https://github.com/codebyfaisal/statefullapi",
      "description": "A URL shortening service built with Node.js and MongoDB.", "live_preview": "https://statefullapi.vercel.app", "created_at": "2025-01-28"
    },
    {
      "name": "streamverse-ai", "repo_link": "https://github.com/codebyfaisal/streamverse-ai",
      "description": "A YouTube-inspired multipage React site built in one day using Cursor AI tools.", "live_preview": "https://streamverse-ai.netlify.app", "created_at": "2025-01-22"
    },
    {
      "name": "eliteestate", "repo_link": "https://github.com/codebyfaisal/eliteestate",
      "description": "A modern, single-page React landing page for a real estate agency with animations and a contact form.", "live_preview": "https://eliteestate-agency.netlify.app", "created_at": "2024-12-15"
    },
    {
      "name": "woodyhouse", "repo_link": "https://github.com/codebyfaisal/woodyhouse",
      "description": "A stylish, responsive furniture landing page built with the Blue Wish Bootstrap theme.", "live_preview": "https://codebyfaisal.github.io/woodyhouse", "created_at": "2024-12-06"
    },
    {
      "name": "primebazar", "repo_link": "https://github.com/codebyfaisal/primebazar",
      "description": "A full-stack e-commerce app offering seamless shopping with product and order management.", "live_preview": "https://primebazar.vercel.app", "created_at": "2024-10-17"
    },
    {
      "name": "ezitech", "repo_link": "https://github.com/codebyfaisal/ezitech",
      "description": "A UI clone of select ezitech.org pages showcasing clean, modern design.", "live_preview": "https://ezitechbyfaisal.netlify.app", "created_at": "2024-09-04"
    },
    {
      "name": "sunrisecafe", "repo_link": "https://github.com/codebyfaisal/sunrisecafe",
      "description": "A vibrant café website built with Bootstrap 5 and JavaScript, featuring sliders, menus, and reservations.", "live_preview": "https://codebyfaisal.github.io/sunrisecafe", "created_at": "2024-07-09"
    },
    {
      "name": "portfolios", "repo_link": "https://github.com/codebyfaisal/portfolios",
      "description": "A collection of portfolio templates including dark and multi-theme versions.",
      "live_preview": "https://codebyfaisal.github.io/portfolios/simpledarkportfolio and https://codebyfaisal. .io/portfolios/multiple-them-portfolio", "created_at": "2024-06-21"
    },
    {
      "name": "justinnovation", "repo_link": "https://github.com/codebyfaisal/justinnovation",
      "description": "My first full website built with HTML and CSS for an IT company, featuring five main pages.", "live_preview": "https://codebyfaisal.github.io/justinnovation", "created_at": "2023-11-11"
    }
  ],
  "faq": [
    { "ques": "What services do you offer?", "ans": "Full stack web development, MongoDB solutions, API development, Figma-to-code, e-commerce, and cloud deployment." },
    { "ques": "What technologies do you use?", "ans": "HTML5, CSS3, JavaScript, Bootstrap, TailwindCSS, React, Node.js, MongoDB, Express." },
    { "ques": "Where are you located?", "ans": "Peshawar, Pakistan." },
    { "ques": "How can I contact you?", "ans": "Email: codebyfaisal@gmail.com, WhatsApp: +92 320 9396952, or connect via LinkedIn, GitHub, Twitter, Facebook." },
    { "ques": "Can I see examples of your work?", "ans": "Yes, view projects on GitHub or live demos on my portfolio — including devdeepblog, devlumen-chatbot, eliteestate, and more." },
    { "ques": "What is your experience in web development?", "ans": "Experienced in front-end and back-end development using modern frameworks and tools." },
    { "ques": "Do you offer custom solutions?", "ans": "Yes, tailored web solutions for individual project needs." },
    { "ques": "How do I get started?", "ans": "Reach out via email or WhatsApp to discuss your project details and timeline." }
  ]
}
`;

export default data;
