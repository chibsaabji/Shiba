import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { LiquidNav } from './LiquidNav';
import { LiquidPanel } from './LiquidPanel';

gsap.registerPlugin(ScrollTrigger);

export const Overlay = () => {
  const heroRef = useRef();

  const welcomeFinished = useRef(false);

  useGSAP(() => {
    // Lock scroll natively
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    gsap.set('.liquid-nav', { xPercent: -50, x: -scrollbarWidth / 2 });

    const welcomeTl = gsap.timeline({
      paused: true,
      onComplete: () => {
        // Unlock scroll
        document.body.style.overflow = "auto";
        document.body.style.paddingRight = "0px";
        gsap.set('.liquid-nav', { clearProps: 'all' });
        gsap.set('.welcome-screen', { display: 'none' });
      }
    });

    // Premium Cinematic Intro Animations
    // 1. Title and Subtitle gently shrink and fade
    welcomeTl.to('.hero-title-top', { autoAlpha: 0, scale: 0.8, y: -20, duration: 0.6, ease: 'power3.inOut' }, 0);
    welcomeTl.to('.hero-sub', { autoAlpha: 0, scale: 0.9, y: 20, duration: 0.6, ease: 'power3.inOut' }, 0);

    // 2. SHIBA and CAFE text dramatically split, scale up, and blur out as if flying past the camera
    welcomeTl.to('.hero-left', { x: '-40vw', scale: 2.5, autoAlpha: 0, filter: 'blur(15px)', duration: 1.2, ease: 'power3.inOut' }, 0.2);
    welcomeTl.to('.hero-right', { x: '40vw', scale: 2.5, autoAlpha: 0, filter: 'blur(15px)', duration: 1.2, ease: 'power3.inOut' }, 0.2);

    // 3. The entire liquid glass overlay scales up slightly and dissolves
    welcomeTl.to('.welcome-screen', { autoAlpha: 0, scale: 1.1, duration: 1.2, ease: 'power3.inOut' }, 0.4);

    // 3. One-time trigger function
    const triggerWelcome = () => {
      if (welcomeFinished.current) return;
      welcomeFinished.current = true;
      welcomeTl.play();

      // Clean up listeners immediately
      window.removeEventListener('wheel', triggerWelcome);
      window.removeEventListener('touchmove', triggerWelcome);
      window.removeEventListener('keydown', triggerWelcomeKeys);
    };

    const triggerWelcomeKeys = (e) => {
      if (['ArrowDown', 'PageDown', ' ', 'Enter'].includes(e.key)) {
        triggerWelcome();
      }
    };

    // Attach listeners
    window.addEventListener('wheel', triggerWelcome, { passive: false });
    window.addEventListener('touchmove', triggerWelcome, { passive: false });
    window.addEventListener('keydown', triggerWelcomeKeys);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('wheel', triggerWelcome);
      window.removeEventListener('touchmove', triggerWelcome);
      window.removeEventListener('keydown', triggerWelcomeKeys);
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
      gsap.set('.liquid-nav', { clearProps: 'all' });
    };
  });

  return (
    <>
      <LiquidNav />

      <main className="scroll-container">
        <header className="section hero" id="home" ref={heroRef}>
          <LiquidPanel className="fullscreen-liquid welcome-screen">
            <h2 className="hero-title-top">Welcome to</h2>
            <h1 className="hero-split">
              <span className="hero-left">SHIBA</span>
              <span className="hero-right">CAFE</span>
            </h1>
            <p className="hero-sub">The warmest, fluffiest place to enjoy a cup of coffee. Scroll down to explore our world!</p>
          </LiquidPanel>

          <LiquidPanel className="hero-new-text">
            <h3>The Fluffiest Experience</h3>
            <p>Meet our resident dogs and enjoy artisan coffee in a perfectly crafted environment.</p>
          </LiquidPanel>
        </header>

        <section className="section section-left" id="menu">
          <LiquidPanel style={{ padding: '40px', borderRadius: '20px' }}>
            <h2>Our Menu</h2>
            <p>Freshly baked treats, aromatic coffee, and special doggy-safe snacks for your furry friends. Every bite is made with love.</p>
            <br />
            <button className="liquid-button"><span>View Menu</span></button>
          </LiquidPanel>
        </section>

        <section className="section section-right" id="dogs">
          <LiquidPanel style={{ padding: '40px', borderRadius: '20px' }}>
            <h2>Meet the Dogs</h2>
            <p>Our resident Shibas are here to brighten your day. Learn about our cafe rules to ensure everyone has a pawsitive experience.</p>
            <br />
            <button className="liquid-button"><span>Cafe Rules</span></button>
          </LiquidPanel>
        </section>

        <section className="footer" id="info">
          <LiquidPanel style={{ padding: '40px', borderRadius: '20px', width: '80%', maxWidth: '800px' }}>
            <h2>See you soon!</h2>
            <div className="footer-links">
              <a href="#policy">Privacy Policy</a>
              <a href="#terms">Terms and Conditions</a>
              <a href="#info">Contact Us</a>
            </div>
            <p className="rights">&copy; {new Date().getFullYear()} Shiba Cafe. All Rights Reserved.</p>
          </LiquidPanel>
        </section>
      </main>
    </>
  );
};
