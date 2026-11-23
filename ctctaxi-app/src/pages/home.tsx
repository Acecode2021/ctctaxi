import { Hero } from '../components/Hero'; // Assuming you have a Hero.tsx in components
import { AppDownloadStrip, TwoApps } from '../components/Apps';
import { HowItWorks } from '../components/BelowFold';
import { Testimonials } from '../components/Close';

export default function Home() {
  return (
    <main>
      <Hero />
      <AppDownloadStrip />
      <TwoApps />
      <HowItWorks />
      <Testimonials />
    </main>
  );
}