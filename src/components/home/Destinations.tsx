import Image from "next/image";
import { LuAnchor, LuChevronRight } from "react-icons/lu";

const activeDestinations = [
  { 
    name: 'Marina Ancol', 
    image: 'https://images.unsplash.com/photo-1544551763-47a0159f9234?auto=format&fit=crop&w=800&q=80',
    type: 'Dermaga Utama'
  },
  { 
    name: 'Kepulauan Seribu', 
    image: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&w=800&q=80',
    type: 'Spot Populer'
  },
  { 
    name: 'Pantai Mutiara', 
    image: 'https://images.unsplash.com/photo-1517400508447-f8dd518b86db?auto=format&fit=crop&w=800&q=80',
    type: 'Dermaga Mewah'
  }
];

export default function Destinations() {
  return (
    <div className="bg-white py-20 border-t border-gray-100">
      <div className="max-w-[95%] md:w-[90%] mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2 group cursor-pointer">
              Destinasi Pilihan
              <LuChevronRight className="w-8 h-8 text-gray-900 group-hover:translate-x-1 transition-transform" />
            </h2>
            <p className="text-gray-500 font-light mt-2">
              Temukan spot mancing terbaik di seluruh penjuru negeri
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {activeDestinations.map((dest) => (
            <div key={dest.name} className="group relative aspect-[4/3] rounded-3xl overflow-hidden shadow-md border border-gray-100 bg-gray-50 cursor-pointer">
              <Image 
                src={dest.image} 
                alt={dest.name} 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-700" 
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
              
              {/* Info */}
              <div className="absolute bottom-6 left-6 right-6 text-white transition-all group-hover:bottom-8">
                <h4 className="text-2xl font-extrabold tracking-tight drop-shadow-md">{dest.name}</h4>
                <div className="flex items-center gap-2 opacity-95 mt-2">
                  <div className="w-8 h-8 rounded-full bg-[#FF385C] flex items-center justify-center shadow-lg">
                    <LuAnchor className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-bold tracking-wide uppercase">{dest.type}</span>
                </div>
              </div>
              
              {/* Badge */}
              <div className="absolute top-4 left-4 transform -translate-y-2 group-hover:translate-y-0 transition-transform">
                <span className="px-4 py-1.5 bg-white/95 backdrop-blur-md text-gray-900 text-[10px] font-black uppercase tracking-widest rounded-lg shadow-xl border border-white/50">
                  Lokasi Aktif
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
