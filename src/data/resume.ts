import type { ResumeData } from "../types";

export const RESUME: ResumeData = {
  name: "ALEXANDAR CASTANEDA",
  title: "SENIOR ENGINEER · WEB + MOBILE · CALM FROM CHAOS",
  tagline: "Welcome. Select option and explore.",

  sections: {
    about: {
      id: "about",
      title: "ABOUT",
      content: `Senior engineer with 8+ years shipping web and mobile products. I write the code, architect the systems, and help engineers level up.

Skilled in React, React Native, TypeScript, and Node.js, with experience in BFF services, scalable architecture, REST/GraphQL APIs, and Agile workflows.

I've led teams, mentored devs, untangled legacy spaghetti, and turned chaos into calm.`,
      navOptions: [
        { id: "home", label: "back", description: "Return to main menu" },
        {
          id: "experience",
          label: "experience",
          description: "Where I've worked",
        },
        { id: "skills", label: "skills", description: "What I know" },
      ],
    },

    experience: {
      id: "experience",
      title: "EXPERIENCE",
      content: `HINGE HEALTH — Senior Software Engineer
Remote | Aug 2019 – May 2022 & Dec 2022 – May 2025
- Led multiple project teams (2–4 devs) using NestJS, GraphQL, REST, React Native, and TypeScript
- Moved business logic server-side, boosting engagement 30% and cutting updates from weeks to same-day
- Designed a server-driven UI microservice with NestJS and REST APIs
- Built BFF layers with NestJS, GraphQL, & REST. Prototyped motion tracking with React Native & OpenCV 
- Partnered cross-functionally to shape spike processes, ticket structure, and sprint planning across the org

LESSEN — Senior Software Engineer
Remote | May 2022 – Dec 2022
- Delivered full-stack across a Kafka-integrated Koa BFF and React web portal
- Reduced shopping time and operational overhead by enabling managers to better coordinate gig workers
- Implemented CI/CD with automated testing and release gates to stabilize deployments
- Partnered across BFFs, backend services, frontend, and product to define API contracts and coordinate timelines

MOOVEL NA — Software Engineer
Portland, OR | Jul 2018 – Aug 2019
- Built a React/Redux tool to ingest CSVs and update client accounts via REST APIs and SQL
- Cut fare change turnaround from ~1 month to 1 day by shifting control to product
- Refactored global state to Redux for better maintainability and faster feature development

JAGUAR LAND ROVER — Frontend Developer
Portland, OR | Mar 2018 – May 2018
- Developed a React touchscreen UI for an in-vehicle app, deployed to cabin displays via Node
- Integrated Google Maps and other APIs, collaborated with designer and product manager
- Delivered a location-aware UX based on music, search, and context`,
      navOptions: [
        { id: "home", label: "back", description: "Return to main menu" },
        { id: "skills", label: "skills", description: "What I know" },
        { id: "education", label: "education", description: "Where I studied" },
      ],
    },

    skills: {
      id: "skills",
      title: "SKILLS",
      content: `LANGUAGES & FRAMEWORKS
JavaScript, TypeScript, React, React Native, Next, Node, Express, Koa, Nest, Svelte, Vite, Rust, Ruby on Rails, HTML, CSS, Tailwind

LIBRARIES & TESTING
Redux, Apollo Client, XState, Jest, Cypress, React Testing Library

DEVOPS & TOOLING
CI/CD pipelines, Docker, GitHub Actions, AWS, Jira, Datadog, Sentry

AI & LLMs
OpenAI, Claude, Gemini, prompt engineering, RAG, tool calling

DATABASES & APIs
PostgreSQL, MongoDB, SQL, Redis, REST, GraphQL, WebSockets`,
      navOptions: [
        { id: "home", label: "back", description: "Return to main menu" },
        {
          id: "experience",
          label: "experience",
          description: "Where I've worked",
        },
        { id: "contact", label: "contact", description: "Get in touch" },
      ],
    },

    education: {
      id: "education",
      title: "EDUCATION",
      content: `UCLA
B.F.A. & M.F.A., Film and Theater, 2007

EPICODUS CODE SCHOOL
Full-stack development bootcamp, 2015`,
      navOptions: [
        { id: "home", label: "back", description: "Return to main menu" },
        {
          id: "experience",
          label: "experience",
          description: "Where I've worked",
        },
        { id: "contact", label: "contact", description: "Get in touch" },
      ],
    },

    contact: {
      id: "contact",
      title: "CONTACT",
      content: `[G] GITHUB
github.com/alexthedar

[L] LINKEDIN
linkedin.com/in/alexandarcastaneda

Open to interesting conversations and new opportunities.
Don't hesitate to reach out.`,
      navOptions: [
        { id: "home", label: "back", description: "Return to main menu" },
      ],
    },
  },
};
