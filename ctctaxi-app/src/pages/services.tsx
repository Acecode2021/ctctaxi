import { Airport, Corporate, Safety } from '../components/BelowFold';
import { Services as ServicesOverview } from '../components/Sections';

export default function Services() {
  return (
    <main className="pt-20"> {/* padding for fixed navbar */}
      <ServicesOverview />
      <Airport />
      <Corporate />
      <Safety />
    </main>
  );
}