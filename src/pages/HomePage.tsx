import HeroSection from '../components/home/HeroSection'
import WhyChooseUs from '../components/home/WhyChooseUs'
import PopularVehicles from '../components/home/PopularVehicles'
import ReviewPreview from '../components/home/ReviewPreview'
import CTABanner from '../components/home/CTABanner'

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <WhyChooseUs />
      <PopularVehicles />
      <ReviewPreview />
      <CTABanner />
    </div>
  )
}
