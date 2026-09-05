import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { AIAssistedSection } from '@/components/sections/AIAssistedSection';
import { AnalyticsSection } from '@/components/sections/AnalyticsSection';
import { AsyncCalibrationSection } from '@/components/sections/AsyncCalibrationSection';
import { BiasReductionSection } from '@/components/sections/BiasReductionSection';
import { CTASection } from '@/components/sections/CTASection';
import { CustomizationSection } from '@/components/sections/CustomizationSection';
import { EcosystemSection } from '@/components/sections/EcosystemSection';
import { FeedbackQualitySection } from '@/components/sections/FeedbackQualitySection';
import { HeroSection } from '@/components/sections/HeroSection';
import { ProblemSection } from '@/components/sections/ProblemSection';
import { ProductScreenshotShowcase } from '@/components/sections/ProductScreenshotShowcase';
import { RealtimeIndicatorsSection } from '@/components/sections/RealtimeIndicatorsSection';
import { ThemePersonalizationButton } from '@/components/theme/ThemePersonalizationButton';

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <Header />
      <ThemePersonalizationButton />
      <main id="conteudo">
        <HeroSection />
        <ProblemSection />
        <AsyncCalibrationSection />
        <ProductScreenshotShowcase />
        <RealtimeIndicatorsSection />
        <AIAssistedSection />
        <BiasReductionSection />
        <FeedbackQualitySection />
        <CustomizationSection />
        <AnalyticsSection />
        <EcosystemSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
