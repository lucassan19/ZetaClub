import React, { useEffect } from 'react';
import HeroLanding from '../components/HeroLanding';
import PreviewsSection from '../components/PreviewsSection';
import PricingSection from '../components/PricingSection';
import PaymentMethods from '../components/PaymentMethods';
import TrustBadges from '../components/TrustBadges';
import HowItWorks from '../components/HowItWorks';
import FAQSection from '../components/FAQSection';
import FinalCTA from '../components/FinalCTA';

const SECTIONS = ['inicio', 'previas', 'planos', 'como-funciona', 'perguntas'];

const Home = () => {
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (SECTIONS.includes(hash)) {
      const t = setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      return () => clearTimeout(t);
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    }
  }, []);

  return (
    <div className="bg-slate-950">
      <HeroLanding />
      <PreviewsSection />
      <PricingSection />
      <PaymentMethods />
      <TrustBadges />
      <HowItWorks />
      <FAQSection />
      <FinalCTA />
    </div>
  );
};

export default Home;
