import { UtensilsCrossed } from 'lucide-react';

export default function Logo({ settings, light = false, size = 'md' }) {
  const box = size === 'lg' ? 'h-12 w-12' : 'h-10 w-10';
  return (
    <span className="inline-flex items-center gap-2.5">
      {settings.logo ? (
        <img src={settings.logo} alt={settings.restaurantName} className={`${box} rounded-xl bg-white object-cover`} />
      ) : (
        <span className={`${box} flex items-center justify-center rounded-xl bg-brand-500 text-white shadow-sm`}>
          <UtensilsCrossed className="h-5 w-5" />
        </span>
      )}
      <span className={`font-display text-lg font-extrabold tracking-tight ${light ? 'text-white' : 'text-ink-900'}`}>
        {settings.restaurantName}
      </span>
    </span>
  );
}
