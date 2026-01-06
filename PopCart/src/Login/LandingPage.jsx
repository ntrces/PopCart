import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

export const LandingPage = () => {
  
  const benefits = [
    {
      id: 1,
      title: "Vast Collection",
      description:
        "Browse through thousands of albums across all genres and eras.",
      bgClass: "bg-indigo",
      icon: (
        <div className="icon-wrap">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M28 28H0V0H28V28Z" /> <path d="M10.5 21V5.83333L24.5 3.5V18.6667" stroke="#4F46E5" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 24.5C8.933 24.5 10.5 22.933 10.5 21C10.5 19.067 8.933 17.5 7 17.5C5.067 17.5 3.5 19.067 3.5 21C3.5 22.933 5.067 24.5 7 24.5Z" stroke="#4F46E5" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round"/> <path d="M21 22.167C22.933 22.167 24.5 20.6 24.5 18.667C24.5 16.734 22.933 15.167 21 15.167C19.067 15.167 17.5 16.734 17.5 18.667C17.5 20.6 19.067 22.167 21 22.167Z" stroke="#4F46E5" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
        </div>
      ),
    },
    {
      id: 2,
      title: "Curated Picks",
      description:
        "Handpicked recommendations based on your music taste and preferences.",
      bgClass: "bg-amber",
      icon: (
        <div className="icon-wrap">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M28 28H0V0H28V28Z"/><path d="M22.1666 16.3333C23.9049 14.63 25.6666 12.5883 25.6666 9.91667C25.6666 8.21486 24.9905 6.58276 23.7872 5.3794C22.5838 4.17604 20.9517 3.5 19.2499 3.5C17.1966 3.5 15.7499 4.08333 13.9999 5.83333C12.2499 4.08333 10.8033 3.5 8.74992 3.5C7.04811 3.5 5.41601 4.17604 4.21265 5.3794C3.00929 6.58276 2.33325 8.21486 2.33325 9.91667C2.33325 12.6 4.08325 14.6417 5.83325 16.3333L13.9999 24.5L22.1666 16.3333Z" stroke="#F59E0B" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

        </div>
      ),
    },
    {
      id: 3,
      title: "Easy Shopping",
      description:
        "Simple checkout process with secure payment options and instant access.",
      bgClass: "bg-green",
      icon: (
        <div className="icon-wrap">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M28 28H0V0H28V28Z" /><path d="M9.33341 25.6663C9.97775 25.6663 10.5001 25.144 10.5001 24.4997C10.5001 23.8553 9.97775 23.333 9.33341 23.333C8.68908 23.333 8.16675 23.8553 8.16675 24.4997C8.16675 25.144 8.68908 25.6663 9.33341 25.6663Z" stroke="#16A34A" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round"/> <path d="M22.1667 25.6663C22.811 25.6663 23.3333 25.144 23.3333 24.4997C23.3333 23.8553 22.811 23.333 22.1667 23.333C21.5223 23.333 21 23.8553 21 24.4997C21 25.144 21.5223 25.6663 22.1667 25.6663Z" stroke="#16A34A" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round"/> <path d="M2.3916 2.3916H4.72494L7.82827 16.8816C7.94211 17.4123 8.23738 17.8867 8.66326 18.2231C9.08915 18.5595 9.61899 18.737 10.1616 18.7249H21.5716C22.1026 18.7241 22.6175 18.5421 23.0311 18.2091C23.4448 17.876 23.7324 17.4119 23.8466 16.8933L25.7716 8.22493H5.97327" stroke="#16A34A" strokeWidth="2.33333" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

        </div>
      ),
    },
  ];

  const albums = [
    {
      id: 1,
      title: "Album Title",
      artist: "Artist Name",
      gradient:
        "linear-gradient(225deg,rgba(255,107,107,1)_0%,rgba(78,205,196,1)_100%)",
    },
    {
      id: 2,
      title: "Album Title",
      artist: "Artist Name",
      gradient:
        "linear-gradient(225deg,rgba(78,205,196,1)_0%,rgba(85,98,112,1)_100%)",
    },
    {
      id: 3,
      title: "Album Title",
      artist: "Artist Name",
      gradient:
        "linear-gradient(225deg,rgba(247,151,30,1)_0%,rgba(255,210,0,1)_100%)",
    },
    {
      id: 4,
      title: "Album Title",
      artist: "Artist Name",
      gradient:
        "linear-gradient(225deg,rgba(102,126,234,1)_0%,rgba(118,75,162,1)_100%)",
    },
  ];

  const metrics = [
    { value: "50K+", label: "Albums Available" },
    { value: "12K+", label: "Active Users" },
    { value: "200+", label: "Featured Artists" },
    { value: "15+", label: "Music Genres" },
  ];

  const footerSections = [
    { title: "Explore", links: ["Browse Albums", "Genres", "New Releases"] },
    { title: "Company", links: ["About Us", "Contact", "Blog"] },
    { title: "Legal", links: ["Privacy Policy", "Terms of Service"] },
  ];

  const testimonialData = {
    quote:
      "PopCart has completely transformed how I discover and collect music. The interface is intuitive and the selection is incredible!",
    author: { name: "Alex Johnson", title: "Music Enthusiast" },
  };

  return (
    <div className="popcart-landing">
      <header className="nav-header">
        <div className="brand">
          <div className="logo" role="img" aria-label="Pop Cart Logo">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 30V8.33333L35 5V26.6667" stroke="#9810FA" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 35C12.7614 35 15 32.7614 15 30C15 27.2386 12.7614 25 10 25C7.23858 25 5 27.2386 5 30C5 32.7614 7.23858 35 10 35Z" stroke="#9810FA" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round"/><path d="M30 31.667C32.7614 31.667 35 29.4284 35 26.667C35 23.9056 32.7614 21.667 30 21.667C27.2386 21.667 25 23.9056 25 26.667C25 29.4284 27.2386 31.667 30 31.667Z" stroke="#9810FA" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
          </div>
          <div className="brand-name">Pop Cart</div>
        </div>

        <nav className="auth-nav" aria-label="User authentication">
          <Link className="btn btn-ghost" to="/signin">Sign In</Link>
          <Link className="btn btn-primary" to="/signup-buyer">Sign Up</Link>
        </nav>
      </header>

      <section className="intro-hero">
        <div className="hero-inner">
          <h1>Your Music Collection<br/>Starts Here</h1>
          <p>Discover, collect, and enjoy albums from artists around the world.<br/>Your centralized shop for all things music.</p>
        </div>
      </section>

      <section className="key-metrics" aria-label="Key Metrics">
        <div className="metrics-inner">
          {metrics.map((m, i) => (
            <div key={i} className="metric">
              <div className="metric-value">{m.value}</div>
              <div className="metric-label">{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="benefits">
        <header className="benefits-header">
          <h2>Why Choose PopCart</h2>
          <p>Everything you need to build your perfect music collection</p>
        </header>

        <div className="benefits-grid">
          {benefits.map((b) => (
            <article key={b.id} className="benefit-card">
              <div className={`benefit-icon ${b.bgClass}`} aria-hidden>
                {b.icon}
              </div>
              <div className="benefit-body">
                <h3>{b.title}</h3>
                <p>{b.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="featured-albums">
        <h2>Featured Albums</h2>
        <div className="albums-grid">
          {albums.map((album) => (
            <article key={album.id} className="album-card">
              <div className="album-art" style={{ background: album.gradient }} role="img" aria-label={`${album.title} album cover`} />
              <div className="album-body">
                <h3>{album.title}</h3>
                <p>{album.artist}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="testimonial" aria-label="User Testimonial">
        <div className="quote-mark">"</div>
        <div className="testimonial-inner">
          <blockquote>{testimonialData.quote}</blockquote>
          <figcaption>
            <div className="author">{testimonialData.author.name}</div>
            <div className="author-title">{testimonialData.author.title}</div>
          </figcaption>
        </div>
      </section>

      <section className="cta">
        <div className="cta-inner">
          <h2>Start Your Collection Today</h2>
          <p>Join thousands of music lovers and build your perfect album library</p>
          <div className="cta-actions">
            <Link className="cta-btn" to="/signup-buyer">Sign Up Now</Link>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="logo-small" aria-hidden>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 30V8.33333L35 5V26.6667" stroke="#9810FA" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 35C12.7614 35 15 32.7614 15 30C15 27.2386 12.7614 25 10 25C7.23858 25 5 27.2386 5 30C5 32.7614 7.23858 35 10 35Z" stroke="#9810FA" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round"/><path d="M30 31.667C32.7614 31.667 35 29.4284 35 26.667C35 23.9056 32.7614 21.667 30 21.667C27.2386 21.667 25 23.9056 25 26.667C25 29.4284 27.2386 31.667 30 31.667Z" stroke="#9810FA" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
            </div>
            <div className="brand-name-white">Pop Cart</div>
            <p className="footer-desc">Your centralized shop for albums.<br/>Discover music, build collections.</p>
          </div>

          <div className="footer-links">
            {footerSections.map((section, i) => (
              <nav key={i} aria-label={section.title} className="footer-column">
                <h3>{section.title}</h3>
                {section.links.map((l, idx) => (
                  <a key={idx} href="#">{l}</a>
                ))}
              </nav>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 PopCart. All rights reserved.</p>
          <div className="footer-icons" aria-hidden>
            <svg width="128" height="20" viewBox="0 0 128 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 20H0V0H20V20Z" />
<path d="M18.3334 3.33368C18.3334 3.33368 17.7501 5.08368 16.6667 6.16701C18.0001 14.5003 8.83341 20.5837 1.66675 15.8337C3.50008 15.917 5.33341 15.3337 6.66675 14.167C2.50008 12.917 0.416748 8.00034 2.50008 4.16701C4.33341 6.33368 7.16675 7.58368 10.0001 7.50034C9.25008 4.00034 13.3334 2.00034 15.8334 4.33368C16.7501 4.33368 18.3334 3.33368 18.3334 3.33368Z" stroke="#9CA3AF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>
      </footer>

      
    
    </div>
  );
};

export default LandingPage;
