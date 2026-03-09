import HeroSection from '../components/home/HeroSection'
import SearchBar from '../components/home/SearchBar'
import WhyChooseUs from '../components/home/WhyChooseUs'
import PopularVehicles from '../components/home/PopularVehicles'
import ReviewPreview from '../components/home/ReviewPreview'
import CTABanner from '../components/home/CTABanner'

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <SearchBar />
      <WhyChooseUs />
      <PopularVehicles />
      <ReviewPreview />
      <CTABanner />
    </div>
  )
}
