

export default function ListingViewSkeleton() {
  return (
    <div className="max-w-6xl mx-auto animate-pulse mt-4">
        {/* title */}
        <div className="h-8 w-3/4 bg-hairline rounded mb-6"/>

        {/* hero image */}
        <div className="w-full h-80 sm:h-110 lg:h-140 bg-hairline rounded-2xl mb-10"/>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* left content */}
            <div className="lg:col-span-2 space-y-8">
                {/* host info */}
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-hairline rounded-full"/>
                    <div className="space-y-2">
                        <div className="h-4 w-40 bg-hairline rounded"/>
                        <div className="h-3 w-24 bg-hairline rounded"/>
                    </div>
                </div>
              {/* stats */}
                <div className="h-4 w-64 bg-hairline rounded"/>

               {/* description */}
               <div className="space-y-3">
                 <div className="h-4 w-full bg-hairline rounded" />
              <div className="h-4 w-full bg-hairline rounded" />
              <div className="h-4 w-5/6 bg-hairline rounded" />
               </div>
            </div>

            {/* booking card skeleton */}
            <div className="border border-hairline rounded-2xl p-6 h-fit space-y-6">
                   <div className="h-6 w-32 bg-hairline rounded" />
            <div className="h-64 w-full bg-hairline rounded-xl" />
            <div className="h-10 w-full bg-hairline rounded-full" />
            </div>
        </div>
    </div>
  )
}
