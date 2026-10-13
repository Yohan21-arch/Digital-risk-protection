import React, { useEffect, useMemo, useState } from 'react';
import { BRAND_METADATA } from '../data/brandMetadata';
import { toAlphaNumeric } from '../lib/detectionEngine';
import {
  clearRuntimeProfile,
  getEffectiveBrandMetadata,
  RuntimeBrandProfile,
  runtimeProfileFromMetadata,
  storeRuntimeProfile,
} from '../lib/runtimeRegistry';

interface RuntimeRegistryPanelProps {
  brand: string;
  onSaved?: () => void;
  onToast: (message: string) => void;
}

const joinLines = (items: string[]) => items.join('\n');
const splitLines = (text: string) =>
  text
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);

export const RuntimeRegistryPanel: React.FC<RuntimeRegistryPanelProps> = ({
  brand,
  onSaved,
  onToast,
}) => {
  const key = toAlphaNumeric(brand);
  const builtIn = BRAND_METADATA[key];
  const [domains, setDomains] = useState('');
  const [publishers, setPublishers] = useState('');
  const [packages, setPackages] = useState('');
  const [handles, setHandles] = useState('');
  const [description, setDescription] = useState('');

  const reload = () => {
    const effective = getEffectiveBrandMetadata(brand);
    const profile = runtimeProfileFromMetadata(effective);
    setDomains(joinLines(profile.domains));
    setPublishers(joinLines(profile.officialPublishers));
    setPackages(joinLines(profile.officialPackages));
    setHandles(profile.officialHandles.map((item) => `${item.platform}:${item.handle}`).join('\n'));
    setDescription(profile.appDescription);
  };

  useEffect(() => reload(), [brand]);

  const parsedHandles = useMemo(() => {
    return splitLines(handles).map((entry) => {
      const separator = entry.indexOf(':');
      if (separator < 1) return { platform: 'Other', handle: entry };
      return {
        platform: entry.slice(0, separator).trim(),
        handle: entry.slice(separator + 1).trim(),
      };
    });
  }, [handles]);

  const save = () => {
    const profile: RuntimeBrandProfile = {
      domains: splitLines(domains),
      appDescription: description,
      officialPublishers: splitLines(publishers),
      officialPackages: splitLines(packages),
      officialHandles: parsedHandles,
    };
    storeRuntimeProfile(brand, profile);
    onSaved?.();
    onToast(`Saved local official-asset registry for ${brand}. Future scans will use these identifiers.`);
  };

  const reset = () => {
    clearRuntimeProfile(brand);
    reload();
    onSaved?.();
    onToast(
      builtIn
        ? `Restored built-in prototype registry for ${brand}.`
        : `Cleared local registry for ${brand}.`
    );
  };

  return (
    <section className="bg-white border border-[#c2c7ca]/70 rounded-xl p-4 sm:p-6 shadow-xs space-y-4">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 border-b border-[#eeeeed] pb-3">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2 py-0.5 rounded font-['JetBrains_Mono'] text-[10px] font-bold bg-[#cce5ff] text-[#002841]">
              PHASE 3 • LOCAL BRAND REGISTRY
            </span>
            <span className="text-[10px] font-['JetBrains_Mono'] text-[#515f74]">
              Browser-local source of truth
            </span>
          </div>
          <h2 className="font-['Noto_Serif',serif] text-base sm:text-lg font-bold text-[#1a1c1c]">
            Official Identity Registry
          </h2>
          <p className="text-xs text-[#515f74] mt-1 max-w-3xl">
            Edit the official domains, publishers, package IDs, handles and reference app description used by deterministic scoring. Data stays in this browser and does not claim external verification.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={reset}
            className="px-3 py-2 rounded-lg border border-[#c2c7ca] text-xs font-semibold text-[#515f74] hover:bg-[#f3f4f3]"
          >
            Reset
          </button>
          <button
            onClick={save}
            className="px-3.5 py-2 rounded-lg bg-[#0f2930] hover:bg-[#133942] text-white text-xs font-semibold shadow-xs"
          >
            Save Registry
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Field label="Official Domains" value={domains} onChange={setDomains} placeholder={'paytm.com\npaytmbank.com'} />
        <Field label="Official Publishers" value={publishers} onChange={setPublishers} placeholder={'One97 Communications Ltd.\nPaytm Payments Bank'} />
        <Field label="Official Packages / Bundle IDs" value={packages} onChange={setPackages} placeholder={'net.one97.paytm\ncom.paytm.business'} mono />
        <Field label="Official Social Handles" value={handles} onChange={setHandles} placeholder={'X:@paytm\nInstagram:@paytm'} mono />
      </div>

      <label className="block">
        <span className="block text-[11px] font-semibold text-[#515f74] mb-1.5">
          Official App / Brand Description
        </span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full max-w-full min-w-0 px-3 py-2.5 rounded-lg border border-[#c2c7ca] bg-[#f9f9f8] text-xs text-[#1a1c1c] focus:outline-none focus:border-[#2b94d7] resize-y"
          placeholder="Reference text used for deterministic description similarity."
        />
      </label>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center">
        <Stat label="Domains" value={splitLines(domains).length} />
        <Stat label="Publishers" value={splitLines(publishers).length} />
        <Stat label="Packages" value={splitLines(packages).length} />
        <Stat label="Handles" value={parsedHandles.length} />
        <Stat label="Mode" value={builtIn ? 'Demo + Local' : 'Local'} />
      </div>
    </section>
  );
};

const Field: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  mono?: boolean;
}> = ({ label, value, onChange, placeholder, mono }) => (
  <label className="block min-w-0">
    <span className="block text-[11px] font-semibold text-[#515f74] mb-1.5">{label}</span>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={4}
      placeholder={placeholder}
      className={`w-full max-w-full min-w-0 px-3 py-2.5 rounded-lg border border-[#c2c7ca] bg-[#f9f9f8] text-xs text-[#1a1c1c] focus:outline-none focus:border-[#2b94d7] resize-y ${
        mono ? "font-['JetBrains_Mono']" : ''
      }`}
    />
  </label>
);

const Stat: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="rounded-lg border border-[#eeeeed] bg-[#f9f9f8] px-2 py-2 min-w-0">
    <div className="font-['JetBrains_Mono'] text-[10px] uppercase text-[#72787a] truncate">{label}</div>
    <div className="font-['Manrope'] text-sm font-bold text-[#002841] truncate mt-0.5">{value}</div>
  </div>
);
