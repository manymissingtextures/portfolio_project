import { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import './portfolio.css';
const currentYear = new Date().getFullYear();

const pages = [
  ['Home', '/'],
  ['About', '/about'],
  ['Projects', '/projects'],
  ['Education', '/education'],
  ['Services', '/services'],
  ['Contact', '/contact'],
];

const projectSamples = [
  {
    number: '01',
    title: 'My First Big Web project for Blogging (blog-project)',
    category: 'WEB DESIGN / FULL STACK',
    image: '../src/assets/blog.png',
    alt: 'My first big web project.',
    description:
      'Social media website, full stack focused on user security, databasing user content, including hashed user credentials such as login and registration.',
    role: 'Full-stack Development, database management, and user auth',
    outcome:
      'Gaining an understanding for user security methods, and how to weave them in a full stack web application.',
    githubUrl: 'https://github.com/manymissingtextures/blog-project/',
    tags: ['HTML', 'CSS', 'JavaScript', 'Python', 'SQL'],
  },
  {
    number: '02',
    title: "Patrick's Self Control Application",
    category: 'Scheduling / Productivity',
    image: '../src/assets/lockin.png',
    alt: 'Notebook, pen, and calculator on a desk',
    description:
      'A simple web application that allows users to schedule their time and block distracting websites, helping them stay focused and productive.',
    role: 'Easy user experience with scheduling functionality that can effectively block distracting applications when open during a specified time.',
    outcome: '',
    githubUrl: 'https://github.com/manymissingtextures/patricks-self-control',
    tags: ['TypeScript', 'HTML', 'CSS', 'JSON', 'Electron'],
  },
  {
    number: '03',
    title: 'Simple Mod Extractor',
    category: 'BACK-END INVENTORY',
    image: '../src/assets/extract.png',
    alt: 'Simple mod extraction tool.',
    description:
      'A simple mod extraction tool designed to seemlessly extract mod files depending on the type of game selected.',
    role: 'Interface coding, extraction logic, and file management.',
    outcome: 'Understood file manipulation with python. Not a fan of tkinter.',
    githubUrl: 'https://github.com/manymissingtextures/extractionProject',
    tags: ['Python'],
  },
];

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className='site-header'>
      <Link
        className='brand'
        to='/'
        aria-label='Jake Szymanski, home'
        onClick={() => setMenuOpen(false)}
      >
        <span className='brand-mark' aria-hidden='true'>
          J.A.S.
        </span>
        <span>
          Jake Szymanski<span className='brand-period'>.</span>
        </span>
      </Link>
      <button
        className='menu-toggle'
        type='button'
        aria-expanded={menuOpen}
        aria-controls='primary-nav'
        aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span></span>
        <span></span>
      </button>
      <nav
        className={`primary-nav${menuOpen ? ' is-open' : ''}`}
        id='primary-nav'
        aria-label='Main navigation'
      >
        {pages.map(([label, path]) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className='site-footer'>
      <Link className='brand' to='/'>
        <span className='brand-mark' aria-hidden='true'>
          J.A.S.
        </span>
        <span>
          Jake Szymanski<span className='brand-period'>.</span>
        </span>
      </Link>
      <span>Portfolio Project · {currentYear}</span>
      <Link to='/contact'>
        Contact Me <span aria-hidden='true'>↗</span>
      </Link>
    </footer>
  );
}

function PageHeading({ eyebrow, description, children }) {
  return (
    <section className='page-heading'>
      <p className='eyebrow'>{eyebrow}</p>
      <h1>{children}</h1>
      <p className='page-lede'>{description}</p>
    </section>
  );
}

function HomePage() {
  const location = useLocation();
  const isSubmitted = new URLSearchParams(location.search).get('sent') === '1';
  const savedMessage =
    isSubmitted ? sessionStorage.getItem('portfolioMessage') : null;
  let firstName = '';
  if (savedMessage) {
    try {
      firstName = JSON.parse(savedMessage).firstName || '';
    } catch {
      firstName = '';
    }
  }
  const confirmation =
    isSubmitted ?
      `Thanks${firstName ? `, ${firstName}` : ''}! Your demo message was saved in this browser.`
    : '';

  useEffect(() => {
    if (isSubmitted) sessionStorage.removeItem('portfolioMessage');
  }, [isSubmitted]);

  return (
    <>
      {confirmation && (
        <div className='toast' role='status'>
          {confirmation}
        </div>
      )}
      <section className='home-hero page-shell'>
        <div className='hero-copy'>
          <p className='eyebrow'>
            <span className='status-dot'></span> AVAILABLE FOR OPPORTUNITIES
          </p>
          <h1>
            Hello!
            <br />
            <span>I'm Jake</span>
          </h1>
          <p className='hero-intro'>
            I am a student software engineer who enjoys learning new coding
            languages, concepts, and ideas, and turning those ideas into
            friendly and reliable experiences.
          </p>
          <div className='hero-actions'>
            <Link className='button button-dark' to='/about'>
              A little about me <span aria-hidden='true'>↗</span>
            </Link>
            <Link className='text-link' to='/projects'>
              Explore my work <span aria-hidden='true'>→</span>
            </Link>
          </div>
        </div>
        <div className='hero-art'>
          <img
            src='https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1100&q=85'
            alt="Laptop and notebook on a developer's desk"
          />
        </div>
      </section>
      <section className='intro-band'>
        <div className='page-shell intro-band-inner'>
          <p>
            This portfolio is a practice to test my front-end development skills
            Take a look around.
          </p>
          <Link
            className='round-link'
            to='/projects'
            aria-label='View selected projects'
          >
            ↗
          </Link>
        </div>
      </section>
    </>
  );
}

function AboutPage() {
  return (
    <div className='page-shell'>
      <PageHeading
        eyebrow='A LITTLE CONTEXT'
        description='What I care about, how I work, and where I’m headed.'
      >
        About <span>me.</span>
      </PageHeading>
      <section className='about-layout'>
        <figure className='portrait-frame'>
          <img src='../src/assets/selfpor.jpg' alt='Self Portrait' />
          <figcaption>Jake Szymanski · Ontario</figcaption>
        </figure>
        <div className='about-copy'>
          <p className='eyebrow'>HELLO, I’M</p>
          <h2>
            Jake
            <br />
            Szymanski<span className='brand-period'>.</span>
          </h2>
          <p>
            I’m a student, aspiring web developer and software engineer
            interested in making many different types of digital tools with a
            strong emphasis on usability.
          </p>
          <p>
            Right now, I’m currently growing my skills in Java, SQL, React, and
            JavaScript/TypeScript. I am patient, curious, and have a willingness
            to keep learning on every new interesting project.
          </p>
          <div className='about-facts'>
            <div>
              <span>FOCUS</span>
              <strong>Web Development & Databasing</strong>
            </div>
            <div>
              <span>BASED IN</span>
              <strong>Ontario</strong>
            </div>
            <div>
              <span>OPEN TO</span>
              <strong>Internships &amp; projects</strong>
            </div>
          </div>
          <a
            className='button button-dark'
            href='/resume.pdf'
            target='_blank'
            rel='noreferrer'
          >
            View my résumé <span aria-hidden='true'>↗</span>
          </a>
        </div>
      </section>
      <section className='values-section'>
        <div>
          <p className='eyebrow'>HOW I LIKE TO WORK</p>
          <h2>
            Good work starts
            <br />
            with good questions.
          </h2>
        </div>
        <div className='values-list'>
          <article>
            <span>01</span>
            <div>
              <h3>Listen first</h3>
              <p>
                Understand the goal and the people using the result before
                choosing a solution.
              </p>
            </div>
          </article>
          <article>
            <span>02</span>
            <div>
              <h3>Keep it clear</h3>
              <p>
                Use simple structure, readable content, and thoughtful
                interactions.
              </p>
            </div>
          </article>
          <article>
            <span>03</span>
            <div>
              <h3>Learn in public</h3>
              <p>
                Share progress, welcome feedback, and make the next version
                better.
              </p>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}

function ProjectsPage() {
  return (
    <div className='page-shell'>
      <PageHeading
        eyebrow='A FEW THINGS I’VE MADE'
        description='A small collection of projects that show how I think, build, and learn.'
      >
        Selected <span>work.</span>
      </PageHeading>
      <section className='project-grid'>
        {projectSamples.map((project) => (
          <article className='project-card' key={project.number}>
            <div className='project-image'>
              <img src={project.image} alt={project.alt} />
              <span className='project-number'>{project.number}</span>
            </div>
            <div className='project-details'>
              <div>
                <p className='eyebrow'>{project.category}</p>
                <h2>{project.title}</h2>
              </div>
              <p>
                {project.description} <strong>My role:</strong> {project.role}{' '}
                <strong>Outcome:</strong> {project.outcome}
              </p>
              <div className='tag-row'>
                {project.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
                {project.githubUrl && (
                  <a
                    className='project-source-link'
                    href={project.githubUrl}
                    target='_blank'
                    rel='noreferrer'
                    aria-label={`View ${project.title} on GitHub`}
                  >
                    View on GitHub <span aria-hidden='true'>↗</span>
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </section>
      <aside className='project-note'>
        <span className='note-icon' aria-hidden='true'>
          ✳
        </span>
        <Link className='text-link' to='/contact'>
          Have a project in mind? <span aria-hidden='true'>→</span>
        </Link>
      </aside>
    </div>
  );
}

function EducationPage() {
  return (
    <div className='page-shell'>
      <PageHeading
        eyebrow='THE LEARNING NEVER STOPS'
        description='A record of the education that continually shapes my work.'
      >
        Education &
        <br />
        <span>credentials.</span>
      </PageHeading>
      <section className='education-layout'>
        <div className='education-list'>
          <article className='education-entry'>
            <div className='education-date'>2025 — PRESENT</div>
            <div>
              <p className='eyebrow'>IN PROGRESS</p>
              <h2>Ontario College Diploma - Software Engineer Technician</h2>
              <p className='institution'>Centennial College</p>
              <p>
                Focus areas: web application development, programming
                fundamentals, database management, and software engineering
                principles.
              </p>
            </div>
            <span className='education-marker' aria-hidden='true'></span>
          </article>
          <article className='education-entry'>
            <div className='education-date'>2024</div>
            <div>
              <p className='eyebrow'>COMPLETED</p>
              <h2>MITx Python Certificate</h2>
              <p className='institution'>
                edX · A course of study offered by MITx, an online learning
                initiative of the Massachusetts Institute of Technology
              </p>
            </div>
            <span className='education-marker' aria-hidden='true'></span>
          </article>
          <article className='education-entry'>
            <div className='education-date'>2019 — 2023</div>
            <div>
              <p className='eyebrow'>COMPLETED · 2023</p>
              <h2>High School Diploma</h2>
              <p className='institution'>
                Centre Dufferin District High School · Shelburne, Ontario
              </p>
            </div>
            <span className='education-marker' aria-hidden='true'></span>
          </article>
        </div>
        <aside className='learning-panel'>
          <span className='panel-spark' aria-hidden='true'>
            ✳
          </span>
          <p className='eyebrow'>CURRENTLY EXPLORING</p>
          <h2>
            Learning by
            <br />
            making things.
          </h2>
          <p>
            My current focus is strengthening the fundamentals and putting them
            into practice through small, useful projects.
          </p>
          <div className='learning-tags'>
            <span>React & Vite</span>
            <span>Java</span>
            <span>SQL</span>
            <span>Git & GitHub</span>
          </div>
          <Link className='text-link' to='/projects'>
            See what I’m building <span aria-hidden='true'>→</span>
          </Link>
        </aside>
      </section>
    </div>
  );
}

function ServicesPage() {
  const services = [
    [
      '01',
      'Full-stack Development',
      'Clean, mobile-friendly pages built with semantic HTML and modern CSS, that connect seamlessly to a back-end database and/or server logic.',
    ],
    [
      '02',
      'Specific Front-end development',
      'Interactive interfaces with straightforward JavaScript and accessible controls.',
    ],
    [
      '03',
      'Website refreshes',
      'Thoughtful updates to layout, readability, and responsive behavior for existing sites (such as this site for example).',
    ],
    [
      '04',
      'Prototype to portfolio',
      'Help shaping a class project or early idea into a clear, presentable web experience.',
    ],
  ];
  return (
    <div className='page-shell'>
      <PageHeading
        eyebrow='WAYS I CAN HELP'
        description='Practical digital support for people and small teams. I’m growing these skills through coursework and hands-on projects.'
      >
        Small ideas,
        <br />
        <span>well made.</span>
      </PageHeading>
      <section className='services-hero'>
        <img
          src='https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1500&q=85'
          alt='A small team sharing ideas around a laptop'
        />
        <div>
          <p className='eyebrow'>COLLABORATIVE BY DEFAULT</p>
          <h2>
            Clear goals.
            <br />
            Steady progress.
          </h2>
          <p>
            I value good communication, useful feedback, and a result that works
            on real screens.
          </p>
        </div>
      </section>
      <section className='service-list' aria-label='Services offered'>
        {services.map(([number, title, description]) => (
          <article className='service-item' key={number}>
            <span className='service-index'>{number}</span>
            <div>
              <h2>{title}</h2>
              <p>{description}</p>
            </div>
            <span className='service-arrow' aria-hidden='true'>
              ↗
            </span>
          </article>
        ))}
      </section>
      <section className='services-cta'>
        <p>Have a small project or question?</p>
        <Link className='button button-light' to='/contact'>
          Let’s talk <span aria-hidden='true'>↗</span>
        </Link>
      </section>
    </div>
  );
}

function ContactPage() {
  const navigate = useNavigate();
  function handleSubmit(event) {
    event.preventDefault();
    const messageDetails = Object.fromEntries(
      new FormData(event.currentTarget).entries(),
    );
    sessionStorage.setItem('portfolioMessage', JSON.stringify(messageDetails));
    navigate('/?sent=1');
  }

  return (
    <div className='page-shell'>
      <PageHeading
        eyebrow='LET’S START WITH HELLO'
        description='Have a question, an opportunity, or a project taking shape? Send a note and tell me a little about it.'
      >
        Good things
        <br />
        <span>start here.</span>
      </PageHeading>
      <section className='contact-layout'>
        <aside className='contact-panel'>
          <p className='eyebrow'>CONTACT DETAILS</p>
          <h2>
            Find me
            <br />
            around here.
          </h2>
          <p className='contact-panel-intro'>
            I’m happy to hear about thoughtful projects, internships, and
            chances to learn together.
          </p>
          <div className='contact-detail'>
            <span>EMAIL</span>
            <a
              href='mailto:
jszyman1@my.centennialcollege.ca'
            >
              jszyman1@my.centennialcollege.ca
            </a>
          </div>
          <div className='contact-detail'>
            <span>LOCATION</span>
            <p>Shelburne, Ontario</p>
          </div>
        </aside>
        <form className='contact-form' onSubmit={handleSubmit}>
          <p className='eyebrow'>SEND A MESSAGE</p>
          <div className='form-row'>
            <label>
              First name
              <input name='firstName' autoComplete='given-name' required />
            </label>
            <label>
              Last name
              <input name='lastName' autoComplete='family-name' required />
            </label>
          </div>
          <div className='form-row'>
            <label>
              Email address
              <input type='email' name='email' autoComplete='email' required />
            </label>
            <label>
              Contact number <span className='optional'>OPTIONAL</span>
              <input type='tel' name='phone' autoComplete='tel' />
            </label>
          </div>
          <label>
            What would you like to talk about?
            <textarea name='message' rows='5' required />
          </label>
          <button className='button button-dark' type='submit'>
            Send message <span aria-hidden='true'>↗</span>
          </button>
          <p className='form-note'>
            Demo form: your message is saved in this browser, then you’ll return
            to the home page. Form service is NOT yet connected. Please contact
            me directly.
          </p>
        </form>
      </section>
    </div>
  );
}

function NotFoundPage() {
  return (
    <section className='page-shell not-found'>
      <p className='eyebrow'>PAGE NOT FOUND</p>
      <h1>That page isn’t here.</h1>
      <Link className='button button-dark' to='/'>
        Back to home <span aria-hidden='true'>↗</span>
      </Link>
    </section>
  );
}

function PortfolioLayout() {
  const location = useLocation();
  useEffect(() => {
    const pageName =
      pages.find(([, path]) => path === location.pathname)?.[0] ||
      'Page not found';
    document.title = `${pageName} | J.A.S. Portfolio`;
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <a className='skip-link' href='#main'>
        Skip to content
      </a>
      <SiteHeader />
      <main id='main'>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/about' element={<AboutPage />} />
          <Route path='/projects' element={<ProjectsPage />} />
          <Route path='/education' element={<EducationPage />} />
          <Route path='/services' element={<ServicesPage />} />
          <Route path='/contact' element={<ContactPage />} />
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </main>
      <SiteFooter />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <PortfolioLayout />
    </BrowserRouter>
  );
}

export default App;
