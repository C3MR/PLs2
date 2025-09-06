import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import PropertyTypes from '@/components/PropertyTypes';
import PropertyListings from '@/components/PropertyListings';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import ContactSection from '@/components/ContactSection';
import InternalLinkingSystem from '@/components/InternalLinkingSystem';
import ContextualLinks from '@/components/ContextualLinks';

const Index = () => {
  return (
    <Layout showBreadcrumbs={false}>
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
      <ServicesSection />
      <PropertyTypes />
      <PropertyListings />
      
      {/* Internal Linking Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <InternalLinkingSystem currentPage="/" />
        </div>
      </section>
      
      <ContactSection />
    </Layout>
  );
};

export default Index;