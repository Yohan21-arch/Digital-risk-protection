import React, { useMemo, useState } from 'react';
import { BRAND_CATALOG, BUILT_IN_BRANDS } from '../data/brandCatalog';

interface BrandCatalogPickerProps {
  currentBrand: string;
  onBrandChange: (brand: string) => void;
}

export const BrandCatalogPicker: React.FC<BrandCatalogPickerProps> = ({
  currentBrand,
  onBrandChange,
}) => {
  const [query, setQuery] = useState('');
  const normalized = query.trim().toLowerCase();

  const groups = useMemo(() => {
    if (!normalized) return BRAND_CATALOG;
    return BRAND_CATALOG.map((group) => ({
      ...group,
      brands: group.brands.filter((brand) =>
        `${brand} ${group.sector}`.toLowerCase().includes(normalized)
      ),
    })).filter((group) => group.brands.length > 0);
  }, [normalized]);

  return (
    <details className="mt-3 rounded-xl border border-[#c2c7ca]/70 bg-white/90 shadow-xs group">
      <summary className="list-none cursor-pointer px-3.5 py-2.5 flex items-center justify-between gap-3 select-none">
        <div className="flex items-center gap-2 min-w-0">
          <span className="material-symbols-outlined text-[#2b94d7] text-[18px] shrink-0">domain</span>
          <div className="min-w-0">
            <div className="font-['Manrope'] text-xs font-bold text-[#1a1c1c] truncate">
              Browse protected brands
            </div>
            <div className="font-['JetBrains_Mono'] text-[10px] text-[#515f74]">
              {BUILT_IN_BRANDS.length} protected brands • grouped by sector
            </div>
          </div>
        </div>
        <span className="material-symbols-outlined text-[#515f74] text-[18px] transition-transform group-open:rotate-180 shrink-0">
          expand_more
        </span>
      </summary>

      <div className="border-t border-[#eeeeed] p-3.5 space-y-3">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#72787a] text-[17px]">search</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search brand or sector..."
            className="w-full rounded-lg border border-[#c2c7ca] bg-[#f9f9f8] pl-9 pr-3 py-2 text-xs text-[#1a1c1c] focus:outline-none focus:border-[#2b94d7] focus:ring-1 focus:ring-[#2b94d7]/20"
          />
        </div>

        {groups.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#c2c7ca] px-3 py-4 text-center text-xs text-[#515f74]">
            No built-in brand matches that search. You can still type a custom brand in the main search field.
          </div>
        ) : (
          <div className="max-h-64 overflow-y-auto pr-1 space-y-3">
            {groups.map((group) => (
              <div key={group.sector} className="space-y-1.5">
                <div className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-wider text-[#72787a] font-bold">
                  {group.sector}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {group.brands.map((brand) => {
                    const selected = currentBrand.trim().toLowerCase() === brand.toLowerCase();
                    return (
                      <button
                        type="button"
                        key={brand}
                        onClick={() => onBrandChange(brand)}
                        className={`px-2.5 py-1 rounded-md border text-[11px] font-['Inter'] font-semibold transition-colors ${
                          selected
                            ? 'bg-[#0f2930] text-white border-[#0f2930]'
                            : 'bg-white text-[#002841] border-[#c2c7ca] hover:border-[#2b94d7] hover:bg-[#eef6f9]'
                        }`}
                      >
                        {brand}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-[10px] text-[#515f74] font-['Inter']">
          Select a built-in brand here, then use <span className="font-semibold text-[#002841]">Scan</span>. Custom brands remain supported through the Phase 3 local registry and candidate intake workflow.
        </div>
      </div>
    </details>
  );
};
