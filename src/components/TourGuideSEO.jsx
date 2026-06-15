// src/components/TourGuideSEO.jsx
import React from 'react';

export default function TourGuideSEO({ slug }) {
  if (!slug) return null;

  return (
    <>
      {/* 🐪 1. GUÍA EXCLUSIVA: SAFARI EN CAMELLO 🐪 */}
      {slug === 'camel-safari-tour-cabo-san-lucas' && (
        <div className="border-t border-slate-200 pt-16 max-w-4xl mx-auto px-4 mt-12">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-8 leading-tight">
            Cabo Camel Ride Desert Safari: <span className="text-blue-600">The Ultimate Private Eco-Adventure</span>
          </h2>
          <div className="space-y-6 text-slate-600 text-lg leading-relaxed mb-12">
            <p>For luxury travelers seeking an extraordinary contrast to the typical beach resort lifestyle, venturing deep into the Baja outback presents a captivating opportunity. Where towering cacti and desert canyons dramatically roll into the rolling swells of the Pacific Ocean, Los Cabos offers a breathtaking desert landscape found nowhere else in the world.</p>
            <p>While standard group tours crowd dozens of tourists onto large buses, experiencing a Cabo camel ride desert safari via an exclusive, private charter ensures pristine comfort, privacy, and full schedule flexibility. At Ballard Tours, we remove the friction of commercial crowds. From round-trip transportation to a dedicated bilingual guide who orchestrates an intimate desert exploration paired with premium tequila tastings, we guarantee a sophisticated 5-star safari.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-blue-50 p-8 rounded-[2rem] border border-blue-100">
              <h3 className="text-xl font-bold text-blue-900 mb-4 uppercase tracking-wider">Unique Ecological Journey</h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                A camel beach ride in Cabo San Lucas stands out as one of the most unique excursions in North America. These gentle dromedaries are perfectly adapted to the desert climate, offering a serene, elevated vantage point along the pristine sand dunes of the Pacific shoreline.
              </p>
            </div>
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-wider">The Desert Safari Step-by-Step</h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                Mount your assigned dromedary for a peaceful caravan trail ride, traverse magnificent desert paths lined with cacti, and open directly onto an isolated Pacific beach. Conclude your safari with an expert-led tasting of ultra-premium artisanal tequilas beautifully paired with a gourmet buffet.
              </p>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-8 rounded-[2rem] mb-16 shadow-xl">
            <h3 className="text-xl font-bold mb-6 text-blue-400">Capitalizing on Perfect Desert Breezes</h3>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-slate-700 pb-4 gap-2">
                <span className="font-bold">Winter & Spring Peak (November to April)</span>
                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold w-fit">Crisp & cool air (Whale tracking bonus)</span>
              </div>
              <div className="flex flex-col md:flex-row justify-between md:items-center text-amber-400 pt-2 gap-2">
                <span className="font-bold">Summer & Autumn (May to October)</span>
                <span className="italic text-sm">Morning charters utilize the refreshing Pacific wind</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-100 p-8 md:p-10 rounded-[2.5rem] shadow-sm mb-16">
            <h3 className="text-2xl font-black text-slate-900 mb-8 border-b border-slate-100 pb-4">Frequently Asked Questions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-blue-900 mb-1">Are there weight or age limits?</h4>
                  <p className="text-sm text-slate-500">Yes, there is a maximum weight limit of 265 lbs (120 kg) per passenger to ensure animal welfare. The minimum age to participate is 5 years old.</p>
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 mb-1">Can we combine it with ATVs?</h4>
                  <p className="text-sm text-slate-500">Absolutely. This is the most popular combo. Many clients choose to pair this trail ride with our Off-Road ATV adventure to experience both speed and peace during a single private day deal.</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-blue-900 mb-1">Do camels bite or spit during the tour?</h4>
                  <p className="text-sm text-slate-500">Not at all. Our dromedaries are raised from birth with constant human interaction, making them docile, gentle, and incredibly friendly animals who love posing for safari photos.</p>
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 mb-1">What is included in the package?</h4>
                  <p className="text-sm text-slate-500">Our private day excursion covers round-trip transport, park entrance fees, private guided camel ride, eco-walk, premium tequila tasting, and a traditional gourmet buffet.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🏁 2. GUÍA EXCLUSIVA: AVENTURA OFF-ROAD ATV 🏁 */}
      {slug === 'atv-off-road-adventure-cabo' && (
        <div className="border-t border-slate-200 pt-16 max-w-4xl mx-auto px-4 mt-12">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-8 leading-tight">
            Off-Road ATV Tours Cabo: <span className="text-blue-600">The Ultimate Private Desert & Dunes Adventure</span>
          </h2>
          <div className="space-y-6 text-slate-600 text-lg leading-relaxed mb-12">
            <p>For adrenaline seekers and luxury travelers who want to conquer the rugged, untamed landscapes of Baja California Sur, nothing compares to the thrill of a premium off-road expedition. Where pristine white-sand dunes and deep desert canyons dramatically collide with the crashing waves of the Pacific Ocean, Los Cabos provides the ultimate natural playground for an all-terrain vehicle safari.</p>
            <p>While standard commercial tours force you into massive, dusty convoys with strict speed restrictions and slow-moving rental lines, experiencing off-road ATV tours in Cabo via an exclusive, private charter ensures unmatched freedom, premium safety, and full schedule flexibility. At Ballard Tours, we eliminate the friction of public tourist crowds.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-blue-50 p-8 rounded-[2rem] border border-blue-100">
              <h3 className="text-xl font-bold text-blue-900 mb-4 uppercase tracking-wider">Outback Adrenaline</h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                The coastal desert, specifically the world-famous Migriño Beach and canyon trails, features a shifting matrix of soft sand dunes, dry riverbeds, and narrow mountain passes lined with exotic rock formations and giant Cardón cacti.
              </p>
            </div>
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-wider">The Off-Road Safari Step-by-Step</h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                Fit yourself with premium safety gear, throttle through deep canyons, and navigate rocky mountain paths. Arrive at the spectacular Pacific sand dunes to experience drifting before cruising directly onto the isolated shores of Migriño Beach.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-100 p-8 md:p-10 rounded-[2.5rem] shadow-sm mb-16">
            <h3 className="text-2xl font-black text-slate-900 mb-8 border-b border-slate-100 pb-4">Frequently Asked Questions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-blue-900 mb-1">Do I need a driver's license?</h4>
                  <p className="text-sm text-slate-500">Yes, to operate an ATV as a primary driver, a valid international driver's license is required. Passengers can safely ride on the back of a double ATV.</p>
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 mb-1">What is the minimum age for kids?</h4>
                  <p className="text-sm text-slate-500">To ride as a passenger on a double ATV, children must be at least 8 years old and accompanied by an adult. Custom safety helmets are provided.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🦈 3. GUÍA EXCLUSIVA: TIBURÓN BALLENA 🦈 */}
      {slug === 'swim-with-whale-sharks-la-paz-cabo' && (
        <div className="border-t border-slate-200 pt-16 max-w-4xl mx-auto px-4 mt-12">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-8 leading-tight">
            The Ultimate Guide to Private Whale Shark Tours in La Paz: <span className="text-blue-600">A VIP Experience</span>
          </h2>
          <div className="space-y-6 text-slate-600 text-lg leading-relaxed mb-12">
            <p>For travelers seeking the extraordinary, few marine encounters match the sheer majesty of swimming alongside the largest fish in the ocean. A private whale shark excursion from Cabo San Lucas to the tranquil waters of La Paz is more than a simple day trip—it is a bucket-list journey into a pristine marine sanctuary.</p>
            <p>When you book a premium experience, you bypass the crowded commercial boats and strict constraints of standard group travel. At <strong>Ballard Tours</strong>, we transform this ecological marvel into a seamlessly coordinated, luxury excursion.</p>
          </div>
          
          {/* Aquí podrías agregar las tarjetas FAQ del tiburón ballena siguiendo la misma estructura superior */}
        </div>
      )}

      {/* 🏝️ 4. GUÍA EXCLUSIVA: ISLA ESPÍRITU SANTO 🏝️ */}
      {(slug === 'espiritu-santo-island-tour-from-cabo' || slug === 'espiritu-santo-island-tour-from-la-paz') && (
        <div className="border-t border-slate-200 pt-16 max-w-4xl mx-auto px-4 mt-12">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-8 leading-tight">
            Isla Espiritu Santo Private Tour: <span className="text-blue-600">The Ultimate Luxury Day Trip from Cabo</span>
          </h2>
          <div className="space-y-6 text-slate-600 text-lg leading-relaxed mb-12">
            <p>For discerning travelers seeking an untouched marine paradise, a journey to Espiritu Santo Island is the crown jewel of Baja California Sur. Located in the Sea of Cortez, this UNESCO World Heritage bio-reserve is a majestic sanctuary of dramatic red volcanic cliffs, turquoise waters, and thriving marine life.</p>
          </div>
        </div>
      )}

      {/* 🎨 5. GUÍA EXCLUSIVA: ART WALK 🎨 */}
      {slug === 'san-jose-del-cabo-art-walk-tour' && (
        <div className="border-t border-slate-200 pt-16 max-w-4xl mx-auto px-4 mt-12">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-8 leading-tight">
            San Jose del Cabo Art Walk Guide: <span className="text-blue-600">The Ultimate Private Cultural Tour</span>
          </h2>
          <div className="space-y-6 text-slate-600 text-lg leading-relaxed mb-12">
            <p>For luxury travelers seeking an elegant escape from the high-energy marina of Cabo San Lucas, the historic Gallery District of San Jose del Cabo offers a sophisticated cultural sanctuary. Every Thursday evening between November and May, the cobblestone streets behind the town’s iconic 18th-century mission church come alive with world-class artists, sculptors, and musicians.</p>
          </div>
        </div>
      )}

      {/* ⛵ 6. GUÍA EXCLUSIVA: BOTE TRANSPARENTE ⛵ */}
      {slug === 'clear-boat-tour-cabo-arch' && (
        <div className="border-t border-slate-200 pt-16 max-w-4xl mx-auto px-4 mt-12">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-8 leading-tight">
            Cabo San Lucas Arch Boat Tour: <span className="text-blue-600">The Ultimate Private Clear Boat Experience</span>
          </h2>
          <div className="space-y-6 text-slate-600 text-lg leading-relaxed mb-12">
            <p>No journey to the edge of the Baja Peninsula is truly complete without witnessing the majestic stone monolithic arch where the Sea of Cortez officially meets the Pacific Ocean. Known globally as Land's End, this dramatic geographical marvel is the undisputed icon of Los Cabos.</p>
            <p>While there are countless standard water taxis crowding the marina, experiencing a Cabo San Lucas Arch boat tour via an exclusive, 100% private clear boat tour is the definitive way to elevate this landmark excursion into a luxury adventure. At Ballard Tours, we remove the friction of public crowds.</p>
          </div>
          
          <div className="bg-slate-900 text-white p-8 rounded-[2rem] mb-16 shadow-xl mt-12">
            <h3 className="text-xl font-bold mb-6 text-blue-400">Best Light & Ocean Conditions</h3>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-slate-700 pb-4 gap-2">
                <span className="font-bold">Morning Charters (8:00 AM - 11:00 AM)</span>
                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold w-fit">Optimal visibility & Calmer sea conditions</span>
              </div>
              <div className="flex flex-col md:flex-row justify-between md:items-center text-amber-400 pt-2 gap-2">
                <span className="font-bold">Sunset Cruises (4:30 PM - 6:30 PM)</span>
                <span className="italic text-sm">Ideal for romance & dramatic photography</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🤿 7. GUÍA EXCLUSIVA: SNORKEL VIP 🤿 */}
      {slug === 'vip-snorkeling-sea-scooter-cabo-san-lucas' && (
        <div className="border-t border-slate-200 pt-16 max-w-4xl mx-auto px-4 mt-12">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-8 leading-tight">
            Best Snorkeling in Los Cabos: <span className="text-blue-600">The Ultimate Private Snorkel Charter Guide</span>
          </h2>
          <div className="space-y-6 text-slate-600 text-lg leading-relaxed mb-12">
            <p>For travelers wanting to immerse themselves in the pristine marine life of Baja California Sur, exploring the calm, azure bays of the Sea of Cortez is an absolute must. Dubbed the "Aquarium of the World" by legendary oceanographer Jacques Cousteau, the coastal waters of Los Cabos boast an incredible biodiversity.</p>
          </div>
        </div>
      )}

    </>
  );
}