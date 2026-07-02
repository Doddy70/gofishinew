import HeroSearch from "./HeroSearch";

export default function Hero() {
  return (
    <div className="relative bg-gradient-to-b from-gray-50 to-white pt-16 pb-12 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Temukan Petualangan Mancing <br className="hidden md:block" />
            <span className="text-[#FF385C]">Terbaik Anda</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Sewa perahu, cari spot mancing, dan nikmati pengalaman tak terlupakan di seluruh Indonesia.
          </p>
        </div>
        
        <HeroSearch />
        
        {/* Trust Badges / Stats */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-12 opacity-50 grayscale hover:grayscale-0 transition-all">
            <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-gray-900">500+</span>
                <span className="text-sm font-semibold uppercase tracking-wider text-gray-500">Armada</span>
            </div>
            <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-gray-900">50+</span>
                <span className="text-sm font-semibold uppercase tracking-wider text-gray-500">Destinasi</span>
            </div>
            <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-gray-900">10k+</span>
                <span className="text-sm font-semibold uppercase tracking-wider text-gray-500">Angler</span>
            </div>
        </div>
      </div>
    </div>
  );
}
