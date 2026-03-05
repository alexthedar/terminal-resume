import type { ResumeData } from "../types";

export const RESUME: ResumeData = {
  name: "ALEXANDAR CASTANEDA",
  title: "SENIOR ENGINEER · WEB + MOBILE · CALM FROM CHAOS",
  tagline: "Welcome. Select an option to explore my professional profile.",

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
- Led multiple project teams (2–4 devs) using NestJS, Redis, GraphQL, REST, React Native, Redux, and TypeScript
- Boosted engagement 30%, reduced dev overhead, enabled same-day updates by moving business logic server-side
- Designed a schema-driven NestJS microservice with REST APIs for product-owned UI and server-driven rendering
- Built BFF APIs with NestJS, GraphQL, and REST. Created a motion-tracking prototype using React Native and OpenCV
- Collaborated across backend, frontend, product, and design. Helped define company-wide spike workflows and sprint planning

LESSEN — Senior Software Engineer
Remote | May 2022 – Dec 2022
- Owned full-stack delivery across a Koa + TypeScript BFF (Kafka-integrated) and a React + TypeScript web portal
- Reduced shopping time and operational overhead by enabling managers to better coordinate gig workers
- Built CI/CD with automated checks and release workflows to standardize deployments and reduce regressions
- Partnered across BFFs, backend services, frontend, and product to define API contracts and coordinate timelines

MOOVEL NA — Software Engineer
Portland, OR | Jul 2018 – Aug 2019
- Built a React and Redux tool that ingested CSVs and used REST APIs and SQL to update client account data
- Cut fare change turnaround from ~1 month to 1 day by shifting control to product
- Refactored global state to Redux for better maintainability and faster feature development

JAGUAR LAND ROVER — Frontend Developer
Portland, OR | Mar 2018 – May 2018
- Built a React frontend for an experimental in-car touchscreen app, served via Node and deployed to cabin screens
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
      content: `GITHUB
github.com/alexthedar

LINKEDIN
linkedin.com/in/alexandarcastaneda

Open to interesting conversations and new opportunities.
Don't hesitate to reach out.`,
      navOptions: [
        { id: "home", label: "back", description: "Return to main menu" },
      ],
    },
  },
};
