import './styles.css';
import { ScrollTrigger, initNav } from './core/motion.js';
import { initText } from './core/text.js';
import { initParticles } from './core/particles.js';
import { initHero } from './sections/hero.js';
import { initAbout } from './sections/about.js';
import { initCapabilities } from './sections/capabilities.js';
import { initPartners } from './sections/partners.js';
import { initDelivery } from './sections/delivery.js';
import { initContact } from './sections/contact.js';

// same order as the concept's script
initText();
initParticles();
initNav();
initHero();
initAbout();
initCapabilities();
initPartners();
initDelivery();
initContact();
document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh());
