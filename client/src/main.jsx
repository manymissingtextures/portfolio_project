import React, { useContext, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const AuthContext = React.createContext(null);
const apiBaseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

const api = async (path, options = {}) => {
  const token = localStorage.getItem('portfolio-token');
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('The API did not return JSON. Check the backend URL and deployment.');
  }
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
};

function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem('portfolio-auth');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (token, user) => {
    localStorage.setItem('portfolio-token', token);
    localStorage.setItem('portfolio-auth', JSON.stringify(user));
    setAuth(user);
  };
  const logout = () => {
    localStorage.removeItem('portfolio-token');
    localStorage.removeItem('portfolio-auth');
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

const emptyProject = { title: '', githubUrl: '', completion: '', description: '' };
const emptyQualification = { title: '', organization: '', completion: '', description: '' };
const emptyContact = { firstname: '', lastname: '', email: '', subject: '', content: '' };
const contactStatuses = ['Unread', 'In progress', 'Solved', 'Unresolved'];
const contactStatusClasses = {
  Unread: 'unread',
  'In progress': 'in-progress',
  Solved: 'solved',
  Unresolved: 'unresolved',
};

function FormField({ label, ...props }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input {...props} />
    </label>
  );
}

function AuthPage({ mode }) {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setMessage('');
    try {
      const path = mode === 'signup' ? '/api/users/register' : '/auth/signin';
      const data = await api(path, { method: 'POST', body: JSON.stringify(form) });
      login(data.token, data.user);
      setMessage(mode === 'signup' ? 'Account created.' : 'Signed in.');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <main className="page narrow">
      <h1>{mode === 'signup' ? 'Create account' : 'Sign in'}</h1>
      <p className="page-intro">
        {mode === 'signup'
          ? 'Create an account to keep track of your contact submissions.'
          : 'Sign in to view your contact submissions and manage your account.'}
      </p>
      <form className="card form" onSubmit={submit}>
        {mode === 'signup' && <FormField label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />}
        <FormField label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <FormField label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <button className="primary" type="submit">{mode === 'signup' ? 'Sign up' : 'Sign in'}</button>
        {message && <p className="message">{message}</p>}
      </form>
    </main>
  );
}

function ResourcePage({ type }) {
  const { auth } = useContext(AuthContext);
  const isProject = type === 'projects';
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(isProject ? emptyProject : emptyQualification);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const data = await api(`/api/${type}`);
      if (!Array.isArray(data)) throw new Error('The API returned an invalid resource list.');
      setItems(data);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => { load(); }, [type]);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const path = `/api/${type}${editing ? `/${editing}` : ''}`;
      await api(path, { method: editing ? 'PUT' : 'POST', body: JSON.stringify(form) });
      setForm(isProject ? emptyProject : emptyQualification);
      setEditing(null);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (id) => {
    try {
      await api(`/api/${type}/${id}`, { method: 'DELETE' });
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const edit = (item) => {
    setEditing(item._id);
    setForm(isProject ? {
      title: item.title || '',
      githubUrl: item.githubUrl || '',
      completion: item.completion ? item.completion.slice(0, 10) : '',
      description: item.description || '',
    } : {
      title: item.title || '',
      organization: item.organization || '',
      completion: item.completion ? item.completion.slice(0, 10) : '',
      description: item.description || '',
    });
  };

  return (
    <main className="page">
      <h1>{isProject ? 'Projects' : 'Qualifications'}</h1>
      <p className="page-intro">
        {isProject
          ? 'Explore my projects and visit their GitHub repositories.'
          : 'View my education, certificates, and ongoing studies.'}
      </p>
      {auth?.role === 'admin' && (
        <form className="card form" onSubmit={submit}>
          <FormField label={isProject ? 'Title' : 'Your title'} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          {!isProject && (
            <FormField label="Organization" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} required />
          )}
          {isProject && (
            <FormField
              label="GitHub repository URL"
              type="url"
              placeholder="https://github.com/owner/repository"
              value={form.githubUrl}
              onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
            />
          )}
          <FormField label="Completion date" type="date" value={form.completion} onChange={(e) => setForm({ ...form, completion: e.target.value })} />
          <label className="field"><span>Description</span><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
          <button className="primary" type="submit">{editing ? 'Update' : 'Add'} {isProject ? 'project' : 'qualification'}</button>
        </form>
      )}
      {error && <p className="error">{error}</p>}
      <div className="grid">
        {items.map((item) => (
          <article className="card" key={item._id}>
            <h2>{item.title}</h2>
            {isProject && item.githubUrl && (
              <a className="github-link" href={item.githubUrl} target="_blank" rel="noopener noreferrer">
                View on GitHub
              </a>
            )}
            {!isProject && <p><strong>Organization:</strong> {item.organization || 'Not specified'}</p>}
            <p>{item.description || 'No description provided.'}</p>
            {item.completion && <small>Completed: {new Date(item.completion).toLocaleDateString()}</small>}
            {auth?.role === 'admin' && (
              <div className="actions">
                <button onClick={() => edit(item)}>Edit</button>
                <button className="danger" onClick={() => remove(item._id)}>Delete</button>
              </div>
            )}
          </article>
        ))}
      </div>
    </main>
  );
}

function ContactPage() {
  const { auth } = useContext(AuthContext);
  const [form, setForm] = useState(emptyContact);
  const [message, setMessage] = useState('');
  const [myContacts, setMyContacts] = useState([]);
  const [historyError, setHistoryError] = useState('');

  useEffect(() => {
    if (!auth) {
      setMyContacts([]);
      setHistoryError('');
      return undefined;
    }

    let cancelled = false;
    api('/api/contacts/mine')
      .then((contacts) => {
        if (!cancelled) setMyContacts(contacts);
      })
      .catch((error) => {
        if (!cancelled) setHistoryError(error.message);
      });

    return () => { cancelled = true; };
  }, [auth]);

  const submit = async (event) => {
    event.preventDefault();
    setMessage('');
    try {
      await api('/api/contacts', { method: 'POST', body: JSON.stringify(form) });
      setForm(emptyContact);
      setMessage('Thank you. Your message was submitted.');
      if (auth) {
        try {
          setMyContacts(await api('/api/contacts/mine'));
          setHistoryError('');
        } catch (error) {
          setHistoryError(`Your message was submitted, but the list could not be refreshed: ${error.message}`);
        }
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <main className="page narrow">
      <h1>Contact</h1>
      <p className="page-intro">
        Send me an inquiry. If you are signed in, you can review your submissions below.
      </p>
      <form className="card form" onSubmit={submit}>
        <div className="form-row">
          <FormField label="First name" value={form.firstname} onChange={(e) => setForm({ ...form, firstname: e.target.value })} required />
          <FormField label="Last name" value={form.lastname} onChange={(e) => setForm({ ...form, lastname: e.target.value })} required />
        </div>
        <FormField label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <FormField label="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
        <label className="field">
          <span>Content</span>
          <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
        </label>
        <button className="primary" type="submit">Send contact</button>
        {message && <p className="message">{message}</p>}
      </form>
      {auth && (
        <section className="card submission-history">
          <h2>Your contact submissions</h2>
          {historyError && <p className="error">{historyError}</p>}
          {myContacts.map((contact) => (
            <article className="submission" key={contact._id}>
              <h3>{contact.subject}</h3>
              <p>{contact.content}</p>
              <span className={`status-badge status-${contactStatusClasses[contact.status] || 'unread'}`}>
                {contact.status || 'Unread'}
              </span>
            </article>
          ))}
          {!historyError && myContacts.length === 0 && <p>You have no contact submissions yet.</p>}
        </section>
      )}
    </main>
  );
}

function App() {
  const { auth, logout } = useContext(AuthContext);
  const [route, setRoute] = useState(window.location.hash.slice(1) || '/');
  const [actionError, setActionError] = useState('');
  useEffect(() => {
    const handle = () => setRoute(window.location.hash.slice(1) || '/');
    window.addEventListener('hashchange', handle);
    return () => window.removeEventListener('hashchange', handle);
  }, []);

  const signOut = async () => {
    setActionError('');
    try {
      await api('/auth/signout', { method: 'GET' });
    } catch (error) {
      setActionError(`Signed out locally. ${error.message}`);
    } finally {
      logout();
    }
  };

  return (
    <>
      <nav>
        <a className="brand" href="#/" aria-label="Jake's Portfolio home">
          <svg className="brand-logo" viewBox="0 0 40 40" aria-hidden="true">
            <defs>
              <linearGradient id="brand-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4263eb" />
                <stop offset="100%" stopColor="#233fae" />
              </linearGradient>
            </defs>
            <rect x="1" y="1" width="38" height="38" rx="12" fill="url(#brand-gradient)" />
            <path d="M13 16h14v13H13zM17 16v-2.5a3 3 0 0 1 3-3h0a3 3 0 0 1 3 3V16M13 21h14M18 21v3h4v-3" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M28 11h3M29.5 9.5v3" stroke="#a9f0df" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span>Jake's Portfolio</span>
        </a>
        <div className="nav-links">
          <a href="#/projects">Projects</a>
          <a href="#/qualifications">Qualifications</a>
          <a href="#/contact">Contact</a>
          {auth ? (
            <>
              {auth.role === 'admin' && <a href="#/admin">Admin</a>}
              <button onClick={signOut}>Sign out</button>
            </>
          ) : (
            <>
              <a href="#/signin">Sign in</a>
              <a href="#/signup">Sign up</a>
            </>
          )}
        </div>
      </nav>
      {actionError && <p className="error page" role="status">{actionError}</p>}
      {route === '/projects' ? <ResourcePage type="projects" /> :
       route === '/qualifications' ? <ResourcePage type="qualifications" /> :
       route === '/contact' ? <ContactPage /> :
       route === '/signin' ? <AuthPage mode="signin" /> :
       route === '/signup' ? <AuthPage mode="signup" /> :
       route === '/admin' && auth?.role === 'admin' ? <AdminPage /> :
       <main className="hero home-hero">
         <div className="hero-copy">
           <p className="eyebrow">Web Application Developer</p>
           <h1>Building useful, thoughtful digital experiences.</h1>
           <p>Explore my projects and education, or send a message through the contact form.</p>
           <div className="hero-actions">
             <a className="primary" href="#/projects">View projects</a>
             <a className="secondary" href="#/contact">Contact me</a>
           </div>
         </div>
         <div className="hero-visual">
           <svg className="portfolio-illustration" viewBox="0 0 560 460" role="img" aria-labelledby="hero-illustration-title">
             <title id="hero-illustration-title">Illustration of a portfolio website and project cards</title>
             <defs>
               <linearGradient id="hero-blue" x1="0" y1="0" x2="1" y2="1">
                 <stop offset="0%" stopColor="#5576f6" />
                 <stop offset="100%" stopColor="#2948c7" />
               </linearGradient>
               <filter id="hero-shadow" x="-20%" y="-20%" width="140%" height="150%">
                 <feDropShadow dx="0" dy="12" stdDeviation="14" floodColor="#263a75" floodOpacity=".16" />
               </filter>
             </defs>
             <circle cx="284" cy="228" r="196" fill="#e6ecff" />
             <circle cx="463" cy="82" r="35" fill="#c9f3e5" />
             <path d="M52 300c25-26 57-28 84-9 24 17 42 21 63 9v82H52z" fill="#d9e2ff" />
             <g filter="url(#hero-shadow)">
               <rect x="68" y="58" width="424" height="300" rx="22" fill="white" />
               <path d="M90 58h380a22 22 0 0 1 22 22v31H68V80a22 22 0 0 1 22-22z" fill="#f8f9fd" />
               <circle cx="94" cy="86" r="5" fill="#ff8d8d" />
               <circle cx="112" cy="86" r="5" fill="#ffc85e" />
               <circle cx="130" cy="86" r="5" fill="#61c89b" />
               <rect x="91" y="130" width="112" height="199" rx="14" fill="#f2f5fc" />
               <circle cx="119" cy="158" r="13" fill="url(#hero-blue)" />
               <rect x="142" y="153" width="44" height="10" rx="5" fill="#bbc6e2" />
               <rect x="108" y="191" width="77" height="8" rx="4" fill="#d3daea" />
               <rect x="108" y="211" width="65" height="8" rx="4" fill="#d3daea" />
               <rect x="108" y="244" width="77" height="8" rx="4" fill="#d3daea" />
               <rect x="108" y="264" width="55" height="8" rx="4" fill="#d3daea" />
               <rect x="224" y="130" width="244" height="119" rx="16" fill="url(#hero-blue)" />
               <circle cx="421" cy="169" r="43" fill="white" fillOpacity=".1" />
               <path d="M389 186l20-20 15 13 22-24" fill="none" stroke="#d8e3ff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
               <rect x="245" y="273" width="104" height="12" rx="6" fill="#34415d" />
               <rect x="245" y="296" width="188" height="8" rx="4" fill="#d5dbea" />
               <rect x="245" y="314" width="150" height="8" rx="4" fill="#d5dbea" />
             </g>
             <g filter="url(#hero-shadow)">
               <rect x="306" y="333" width="214" height="84" rx="16" fill="white" />
               <circle cx="337" cy="375" r="15" fill="#dcf7ea" />
               <path d="M330 375l5 5 10-11" fill="none" stroke="#1b9b68" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
               <rect x="365" y="363" width="113" height="10" rx="5" fill="#53617b" />
               <rect x="365" y="382" width="83" height="8" rx="4" fill="#d5dbea" />
             </g>
             <circle cx="67" cy="391" r="9" fill="#8ea4fa" />
           </svg>
         </div>
       </main>}
    </>
  );
}

function AdminPage() {
  const { auth } = useContext(AuthContext);
  const [contacts, setContacts] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [userForm, setUserForm] = useState({ name: '', email: '' });
  const [error, setError] = useState('');

  const loadDashboard = async () => {
    try {
      const [contactData, userData] = await Promise.all([
        api('/api/contacts'),
        api('/api/users'),
      ]);
      setContacts(contactData);
      setUsers(userData);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => { loadDashboard(); }, []);

  const updateContactStatus = async (id, status) => {
    setError('');
    try {
      await api(`/api/contacts/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      await loadDashboard();
    } catch (err) {
      setError(err.message);
    }
  };

  const removeContact = async (id) => {
    if (!window.confirm('Permanently trash this contact submission?')) return;
    setError('');
    try {
      await api(`/api/contacts/${id}`, { method: 'DELETE' });
      await loadDashboard();
    } catch (err) {
      setError(err.message);
    }
  };

  const editUser = (user) => {
    setEditingUserId(user._id);
    setUserForm({ name: user.name || '', email: user.email || '' });
    setError('');
  };

  const saveUser = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await api(`/api/users/${editingUserId}`, {
        method: 'PUT',
        body: JSON.stringify(userForm),
      });
      setEditingUserId(null);
      setUserForm({ name: '', email: '' });
      await loadDashboard();
    } catch (err) {
      setError(err.message);
    }
  };

  const removeUser = async (user) => {
    if (user._id === auth?._id) {
      setError('You cannot delete the account currently signed in.');
      return;
    }
    if (!window.confirm(`Permanently delete the account for ${user.name}?`)) return;

    setError('');
    try {
      await api(`/api/users/${user._id}`, { method: 'DELETE' });
      await loadDashboard();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="page">
      <h1>Admin dashboard</h1>
      <p className="page-intro">
        Review contact submissions, update user accounts, and manage portfolio content.
      </p>
      {error && <p className="error">{error}</p>}
      <div className="grid">
        <section className="card">
          <h2>Contact submissions</h2>
          {contacts.map((contact) => (
            <div className="contact-row" key={contact._id}>
              <div>
                <p>{contact.firstname} {contact.lastname} - {contact.email}</p>
                <p><strong>Subject:</strong> {contact.subject || 'No subject'}</p>
                <p>{contact.content || 'No content provided.'}</p>
              </div>
              <div className="actions">
                <label className="field status-field">
                  <span>Status</span>
                  <select
                    className={`status-select status-${contactStatusClasses[contact.status] || 'unread'}`}
                    value={contact.status || 'Unread'}
                    onChange={(event) => updateContactStatus(contact._id, event.target.value)}
                  >
                    {contactStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                </label>
                <button className="danger" type="button" onClick={() => removeContact(contact._id)}>Trash</button>
              </div>
            </div>
          ))}
          {contacts.length === 0 && <p>No contact submissions yet.</p>}
        </section>
        <section className="card">
          <h2>Users</h2>
          {users.map((user) => (
            <div className="user-row" key={user._id}>
              {editingUserId === user._id ? (
                <form className="form user-edit-form" onSubmit={saveUser}>
                  <FormField label="Name" value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} required />
                  <FormField label="Email" type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} required />
                  <div className="actions">
                    <button className="primary" type="submit">Save user</button>
                    <button type="button" onClick={() => setEditingUserId(null)}>Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <div>
                    <p><strong>{user.name}</strong> - {user.role}</p>
                    <p>{user.email}</p>
                  </div>
                  <div className="actions">
                    <button type="button" onClick={() => editUser(user)}>Edit</button>
                    <button
                      className="danger"
                      type="button"
                      disabled={user._id === auth?._id}
                      title={user._id === auth?._id ? 'You cannot delete the account currently signed in.' : 'Delete account'}
                      onClick={() => removeUser(user)}
                    >
                      Delete account
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
          {users.length === 0 && <p>No user accounts found.</p>}
        </section>
      </div>
    </main>
  );
}

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <App />
  </AuthProvider>,
);
