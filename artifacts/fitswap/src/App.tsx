import { type FormEvent, type ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { useCreateListing, useGetListing, useGetListings, useGetMarketplaceStats, useGetNearbyGyms, useHealthCheck, usePurchaseListing, useRegisterGym, getHealthCheckQueryKey, getGetListingQueryKey, getGetListingsQueryKey, getGetMarketplaceStatsQueryKey, getGetNearbyGymsQueryKey } from '@workspace/api-client-react';
import { Search, MapPin, ArrowRight, ArrowUpRight, Heart, SlidersHorizontal, ChevronDown, ShieldCheck, Zap, BadgeCheck, Menu, X, Dumbbell, Sparkles, Plus, Check, CreditCard, Star, LocateFixed, Building2, LayoutDashboard, Tag, RotateCcw, LoaderCircle } from 'lucide-react';
import { Link, Route, Switch, useLocation, useParams } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import NotFound from '@/pages/not-found';
import compactLogo from '@assets/WhatsApp_Image_2026-08-16_at_6.22.22_PM_1786885299773.jpeg';
import fullLogo from '@assets/WhatsApp_Image_2026-08-16_at_6.22.23_PM_(1)_1786885299774.jpeg';
import campaignImage from '@assets/WhatsApp_Image_2026-08-16_at_6.22.23_PM_(2)_1786885312650.jpeg';

const queryClient = new QueryClient();

type Flash = { tone: 'success' | 'error'; message: string } | null;
const categories = ['All', 'Gym', 'Yoga', 'Swimming', 'Sports'];
const fallbackImages = [campaignImage, campaignImage, campaignImage, campaignImage];
const listingImages: Record<string, string> = {
  gym: campaignImage,
  yoga: campaignImage,
  swimming: campaignImage,
  sports: campaignImage,
};

function money(value?: number) {
  return typeof value === 'number' ? `₹${value.toFixed(0)}` : '—';
}

function useFlash() {
  const [flash, setFlash] = useState<Flash>(null);
  const notify = (message: string, tone: 'success' | 'error' = 'success') => {
    setFlash({ message, tone });
    window.setTimeout(() => setFlash(null), 3800);
  };
  return { flash, notify };
}

function FlashMessage({ flash }: { flash: Flash }) {
  if (!flash) return null;
  return <div data-testid="status-flash" className={`fixed right-4 top-20 z-50 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold shadow-xl animate-rise ${flash.tone === 'success' ? 'bg-[#d6f7d4] text-[#174b29]' : 'bg-[#ffe0dd] text-[#8f211a]'}`}><span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/70">{flash.tone === 'success' ? <Check size={16} /> : <X size={16} />}</span>{flash.message}</div>;
}

function Logo({ compact = false }: { compact?: boolean }) {
  return <img data-testid="img-logo" src={compact ? compactLogo : fullLogo} alt="FitSwap" className={compact ? 'h-10 w-10 rounded-lg object-cover' : 'h-12 w-36 object-contain object-left'} />;
}

function Shell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const health = useHealthCheck({ query: { queryKey: getHealthCheckQueryKey() } });
  const links = [{ href: '/', label: 'Discover', icon: Sparkles }, { href: '/explore', label: 'Explore nearby', icon: MapPin }, { href: '/sell', label: 'Sell a membership', icon: Tag }, { href: '/register-gym', label: 'For venues', icon: Building2 }, { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }];
  const active = (href: string) => href === '/' ? location === '/' : location.startsWith(href);
  return <div className="noise min-h-[100dvh] bg-[#f3f8f4]">
    <header className="sticky top-0 z-40 border-b border-[#dbe9dd] bg-[#f3f8f4]/95 backdrop-blur-md">
      <div className="mx-auto flex h-[74px] max-w-[1440px] items-center justify-between px-5 lg:px-10">
        <Link href="/" data-testid="link-logo" className="flex items-center"><Logo /></Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {links.slice(0, 4).map(({ href, label, icon: Icon }) => <Link key={href} href={href} data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`} className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${active(href) ? 'bg-[#d9f3d5] text-[#245b35]' : 'text-[#53665e] hover:bg-white hover:text-[#172e29]'}`}><Icon size={16} strokeWidth={2.2} />{label}</Link>)}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/dashboard" data-testid="link-dashboard" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-[#53665e] hover:bg-white"><LayoutDashboard size={17} />Dashboard</Link>
          <Link href="/sell" data-testid="button-header-sell" className="flex items-center gap-2 rounded-xl bg-[#152d35] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5"><Plus size={17} />List a membership</Link>
        </div>
        <button data-testid="button-mobile-menu" className="rounded-xl p-2 text-[#152d35] hover:bg-white lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X /> : <Menu />}</button>
      </div>
      {mobileOpen && <div className="border-t border-[#dbe9dd] bg-[#f3f8f4] px-5 py-3 lg:hidden">{links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} onClick={() => setMobileOpen(false)} data-testid={`link-mobile-${label.toLowerCase().replaceAll(' ', '-')}`} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ${active(href) ? 'bg-[#d9f3d5] text-[#245b35]' : 'text-[#53665e]'}`}><Icon size={17} />{label}</Link>)}</div>}
    </header>
    <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
      <div className="flex items-center justify-between py-2 text-[11px] font-semibold uppercase tracking-[0.13em] text-[#75907c]"><span className="flex items-center gap-2"><span className={`h-1.5 w-1.5 rounded-full ${health.isError ? 'bg-[#cf4d3e]' : 'bg-[#55b958] animate-pulse-soft'}`} />{health.isError ? 'Service unavailable' : 'Marketplace live'}</span><span className="hidden sm:block">Secure swaps · local access · less waste</span></div>
    </div>
    <main>{children}</main>
    <footer className="mt-20 bg-[#152d35] text-[#d8e9db]"><div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-10"><div><Logo compact /><p className="mt-4 max-w-xs text-sm leading-6 text-[#a9c5b1]">The smarter way to swap memberships. Keep moving, even when life changes plans.</p></div><div><p className="mb-4 text-xs font-bold uppercase tracking-[.16em] text-[#71d06e]">Marketplace</p><Link href="/" className="mb-2 block text-sm hover:text-white">Discover memberships</Link><Link href="/explore" className="mb-2 block text-sm hover:text-white">Find nearby gyms</Link><Link href="/sell" className="block text-sm hover:text-white">Sell your membership</Link></div><div><p className="mb-4 text-xs font-bold uppercase tracking-[.16em] text-[#71d06e]">For venues</p><Link href="/register-gym" className="mb-2 block text-sm hover:text-white">Register your venue</Link><p className="text-sm text-[#a9c5b1]">Bring more active people through your doors.</p></div><div><p className="mb-4 text-xs font-bold uppercase tracking-[.16em] text-[#71d06e]">Built for better access</p><div className="flex gap-2"><span className="rounded-full border border-[#48635a] px-3 py-1 text-xs">Verified listings</span><span className="rounded-full border border-[#48635a] px-3 py-1 text-xs">Local first</span></div></div></div><div className="border-t border-[#304b44] px-5 py-5 text-center text-xs text-[#88a99a]">© 2026 FitSwap. Memberships in motion.</div></footer>
  </div>;
}

function SectionHeading({ eyebrow, title, body, action }: { eyebrow: string; title: string; body?: string; action?: ReactNode }) {
  return <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-[#49a950]">{eyebrow}</p><h2 className="font-display text-4xl font-bold uppercase leading-[.95] tracking-tight text-[#152d35] sm:text-5xl">{title}</h2>{body && <p className="mt-3 max-w-xl text-sm leading-6 text-[#667a70]">{body}</p>}</div>{action}</div>;
}

function ListingSkeleton() {
  return <div className="overflow-hidden rounded-2xl border border-[#dbe9dd] bg-white"><div className="h-44 animate-pulse bg-[#e1eee2]" /><div className="space-y-3 p-4"><div className="h-4 w-2/3 animate-pulse rounded bg-[#e1eee2]" /><div className="h-3 w-1/2 animate-pulse rounded bg-[#edf4ed]" /><div className="h-8 w-full animate-pulse rounded bg-[#edf4ed]" /></div></div>;
}

function ListingCard({ listing, index = 0, onSave }: { listing: any; index?: number; onSave?: (id: string) => void }) {
  const [saved, setSaved] = useState(false);
  const image = listingImages[listing.image] || listing.image || fallbackImages[index % fallbackImages.length];
  const toggle = () => { setSaved(!saved); onSave?.(listing.id); };
  return <article data-testid={`card-listing-${listing.id}`} className="group overflow-hidden rounded-2xl border border-[#dbe9dd] bg-white shadow-[0_10px_30px_rgba(20,54,40,.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#a9d6aa] hover:shadow-[0_18px_38px_rgba(20,54,40,.1)]">
    <div className="relative h-48 overflow-hidden bg-[#dcebdc]"><img data-testid={`img-listing-${listing.id}`} src={image} alt={listing.title || 'Membership listing'} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#102d34]/70 via-transparent to-transparent" /><div className="absolute left-3 top-3 rounded-full bg-[#d5f5d1] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#286b35]">{listing.category || 'Fitness'}</div><button data-testid={`button-save-${listing.id}`} aria-label="Save listing" onClick={toggle} className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm transition-colors ${saved ? 'bg-[#b8edb4] text-[#225f30]' : 'bg-white/85 text-[#334c44] hover:bg-white'}`}><Heart size={17} fill={saved ? 'currentColor' : 'none'} /></button><div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white"><span className="flex items-center gap-1.5 text-xs font-semibold"><MapPin size={13} />{listing.distance || 'Nearby'}</span><span className="rounded-md bg-[#152d35]/85 px-2 py-1 text-xs font-bold">{listing.savings || 0}% less</span></div></div>
    <div className="p-4"><div className="mb-3 flex items-start justify-between gap-2"><div><h3 className="line-clamp-1 text-[17px] font-bold text-[#172e29]">{listing.title}</h3><p className="mt-1 text-xs font-medium text-[#71847a]">{listing.venue} · {listing.location}</p></div><span className="flex shrink-0 items-center gap-1 text-xs font-bold text-[#456458]"><Star size={13} fill="#e1a52d" strokeWidth={0} />{listing.rating || '4.8'}</span></div><div className="flex items-end justify-between"><div><span className="text-2xl font-bold text-[#152d35]">{money(listing.price)}</span><span className="ml-1 text-xs text-[#9aa9a0] line-through">{money(listing.originalPrice)}</span></div><Link href={`/listing/${listing.id}`} data-testid={`link-listing-${listing.id}`} className="flex items-center gap-1 rounded-lg bg-[#eef8ed] px-3 py-2 text-xs font-bold text-[#2b7138] hover:bg-[#d8f2d5]">View <ArrowUpRight size={14} /></Link></div></div>
  </article>;
}

function Home() {
  const listingsQuery = useGetListings({}, { query: { queryKey: getGetListingsQueryKey({}) } });
  const statsQuery = useGetMarketplaceStats({ query: { queryKey: getGetMarketplaceStatsQueryKey() } });
  const [category, setCategory] = useState('All');
  const [heroSearch, setHeroSearch] = useState('');
  const { flash, notify } = useFlash();
  const listings = listingsQuery.data || [];
  const visible = listings.filter((listing: any) => category === 'All' || listing.category?.toLowerCase() === category.toLowerCase()).filter((listing: any) => !heroSearch || `${listing.title} ${listing.venue} ${listing.location}`.toLowerCase().includes(heroSearch.toLowerCase()));
  return <Shell><FlashMessage flash={flash} /><section className="relative overflow-hidden bg-[#152d35]"><div className="absolute -right-20 -top-24 h-[420px] w-[420px] rounded-full border-[52px] border-[#285944]/50" /><div className="absolute bottom-[-180px] left-[35%] h-[420px] w-[420px] rounded-full border-[68px] border-[#1c4340]/50" /><div className="relative mx-auto grid max-w-[1440px] items-center gap-10 px-5 py-16 sm:py-24 lg:grid-cols-[1.05fr_.95fr] lg:px-10 lg:py-28"><div className="animate-rise"><div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#416a54] bg-[#203f42] px-3 py-1.5 text-xs font-bold uppercase tracking-[.16em] text-[#9de198]"><span className="h-1.5 w-1.5 rounded-full bg-[#71d06e]" />Fitness access, swapped smarter</div><h1 className="max-w-2xl font-display text-[4.2rem] font-bold uppercase leading-[.86] tracking-[-.025em] text-[#f3f8f4] sm:text-[6.5rem]">Your next<br /><span className="text-[#71d06e]">workout</span><br />is already here.</h1><p className="mt-7 max-w-lg text-base leading-7 text-[#b8d2bf]">Buy local memberships at a better price — or turn the one you cannot use into cash. FitSwap keeps good fitness access moving.</p><div className="mt-8 flex max-w-xl items-center gap-2 rounded-2xl bg-[#f3f8f4] p-2 shadow-2xl"><Search className="ml-3 text-[#71847a]" size={20} /><input data-testid="input-hero-search" value={heroSearch} onChange={(e) => setHeroSearch(e.target.value)} placeholder="Search gyms, classes or locations" className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm font-medium text-[#172e29] outline-none placeholder:text-[#91a098]" /><Link href="/explore" data-testid="link-hero-search" className="rounded-xl bg-[#55b958] px-4 py-3 text-sm font-bold text-white hover:bg-[#449f4d] sm:px-6">Explore</Link></div></div><div className="relative mx-auto w-full max-w-[520px] animate-rise [animation-delay:120ms]"><div className="relative overflow-hidden rounded-[2rem] border-8 border-[#29444a] bg-[#e7f1e7] shadow-2xl"><img src={campaignImage} alt="FitSwap marketplace" className="h-[360px] w-full object-cover object-center sm:h-[470px]" /><div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-[#152d35]/90 p-4 text-white backdrop-blur-md"><div className="flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#83dc7b]">Right now on FitSwap</p><p className="mt-1 text-lg font-bold">Move more. Waste less.</p></div><ArrowUpRight className="text-[#71d06e]" /></div></div></div><div className="absolute -bottom-4 -left-5 hidden rounded-2xl bg-[#71d06e] px-4 py-3 text-xs font-bold text-[#15372b] shadow-lg sm:block">Save an average<br /><span className="text-2xl font-display">₹{statsQuery.data?.averageSavings || 38}</span> per swap</div></div></div></section>
    <section className="mx-auto max-w-[1440px] px-5 pt-14 lg:px-10"><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{[{ label: 'Active listings', value: statsQuery.data?.activeListings || '—' }, { label: 'Avg. saving', value: statsQuery.data?.averageSavings ? `${statsQuery.data.averageSavings}%` : '—' }, { label: 'Cities covered', value: statsQuery.data?.cities || '—' }, { label: 'Memberships swapped', value: statsQuery.data?.membershipsSwapped || '—' }].map((stat) => <div key={stat.label} data-testid={`stat-${stat.label.toLowerCase().replaceAll(' ', '-')}`} className="rounded-2xl border border-[#dbe9dd] bg-white p-4 sm:p-5"><p className="text-2xl font-bold text-[#152d35] sm:text-3xl">{stat.value}</p><p className="mt-1 text-[11px] font-bold uppercase tracking-[.12em] text-[#779080]">{stat.label}</p></div>)}</div></section>
    <section className="mx-auto max-w-[1440px] px-5 pb-10 pt-20 lg:px-10"><SectionHeading eyebrow="Find your fit" title="Popular right now" body="Good memberships should not sit idle. Browse verified local access and make your next session count." action={<Link href="/explore" data-testid="link-see-all-listings" className="flex items-center gap-2 text-sm font-bold text-[#2b7138]">See all listings <ArrowRight size={17} /> </Link>} /><div className="mb-6 flex gap-2 overflow-x-auto pb-1">{categories.map((item) => <button key={item} data-testid={`button-category-${item.toLowerCase()}`} onClick={() => setCategory(item)} className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition-colors ${category === item ? 'border-[#152d35] bg-[#152d35] text-white' : 'border-[#c9ddcc] bg-white text-[#557267] hover:border-[#55b958]'}`}>{item}</button>)}</div>{listingsQuery.isLoading ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{[1,2,3,4].map((i) => <ListingSkeleton key={i} />)}</div> : listingsQuery.isError ? <EmptyState title="Listings are taking a breather" body="We could not load the marketplace just now." action={<button data-testid="button-retry-listings" onClick={() => listingsQuery.refetch()} className="rounded-xl bg-[#152d35] px-4 py-2 text-sm font-bold text-white">Try again</button>} /> : visible.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{visible.slice(0, 8).map((listing: any, i: number) => <ListingCard key={listing.id} listing={listing} index={i} onSave={() => notify('Saved to your dashboard')} />)}</div> : <EmptyState title="No matches yet" body="Try a different search or explore every category." action={<Link href="/explore" className="rounded-xl bg-[#152d35] px-4 py-2 text-sm font-bold text-white">Explore nearby</Link>} />}</section>
    <section className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10"><div className="grid overflow-hidden rounded-[2rem] bg-[#d9f3d5] lg:grid-cols-[.8fr_1.2fr]"><div className="p-8 sm:p-12 lg:p-16"><p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-[#3e8c48]">The FitSwap promise</p><h2 className="max-w-md font-display text-5xl font-bold uppercase leading-[.9] text-[#152d35] sm:text-6xl">Keep the good stuff in motion.</h2><p className="mt-5 max-w-md text-sm leading-6 text-[#4f6d5b]">Plans change. Your membership still has value. Swap it with someone nearby, and keep the community active.</p><Link href="/sell" data-testid="link-promise-sell" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#152d35] px-5 py-3 text-sm font-bold text-white">List yours <ArrowRight size={17} /></Link></div><div className="relative min-h-[280px] overflow-hidden bg-[#b9e4b5]"><img src={campaignImage} alt="Memberships in motion" className="absolute inset-0 h-full w-full object-cover opacity-80 mix-blend-multiply" /><div className="absolute inset-0 bg-gradient-to-r from-[#d9f3d5] via-transparent to-transparent" /></div></div></section>
  </Shell>;
}

function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return <div data-testid="state-empty" className="rounded-2xl border border-dashed border-[#bcd7c0] bg-white/70 px-6 py-14 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e1f3df] text-[#4aa64e]"><Sparkles size={21} /></div><h3 className="mt-4 text-lg font-bold text-[#152d35]">{title}</h3><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#71847a]">{body}</p>{action && <div className="mt-5">{action}</div>}</div>;
}

function Explore() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('Bengaluru');
  const [radius, setRadius] = useState(15);
  const listingsQuery = useGetListings({ search: search || undefined, category: category || undefined, location: location || undefined }, { query: { queryKey: getGetListingsQueryKey({ search: search || undefined, category: category || undefined, location: location || undefined }) } });
  const gymsQuery = useGetNearbyGyms({ location, radius }, { query: { queryKey: getGetNearbyGymsQueryKey({ location, radius }) } });
  const [selectedGym, setSelectedGym] = useState<any>(null);
  const [view, setView] = useState<'list' | 'map'>('list');
  const { flash, notify } = useFlash();
  const gyms = gymsQuery.data || [];
  return <Shell><FlashMessage flash={flash} /><section className="bg-[#e4f1e3]"><div className="mx-auto max-w-[1440px] px-5 py-12 lg:px-10 lg:py-16"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#41954a]">Local access, your way</p><div className="mt-3 flex flex-col justify-between gap-5 lg:flex-row lg:items-end"><div><h1 className="font-display text-6xl font-bold uppercase leading-[.86] text-[#152d35] sm:text-7xl">Explore<br /><span className="text-[#4daa50]">nearby.</span></h1><p className="mt-5 max-w-lg text-sm leading-6 text-[#5f786b]">Find a membership that fits your route, your routine and your wallet.</p></div><div className="flex rounded-xl border border-[#c2ddc2] bg-white p-1"><button data-testid="button-view-list" onClick={() => setView('list')} className={`rounded-lg px-4 py-2 text-sm font-bold ${view === 'list' ? 'bg-[#152d35] text-white' : 'text-[#5d7769]'}`}>Listings</button><button data-testid="button-view-map" onClick={() => setView('map')} className={`rounded-lg px-4 py-2 text-sm font-bold ${view === 'map' ? 'bg-[#152d35] text-white' : 'text-[#5d7769]'}`}>Map view</button></div></div></div></section><section className="mx-auto max-w-[1440px] px-5 py-8 lg:px-10"><div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px]"><div><div className="mb-6 flex flex-col gap-3 rounded-2xl border border-[#dbe9dd] bg-white p-3 sm:flex-row"><div className="flex flex-1 items-center gap-2 rounded-xl bg-[#f2f7f1] px-3"><Search size={18} className="text-[#7b9280]" /><input data-testid="input-explore-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search memberships, venues..." className="w-full bg-transparent py-3 text-sm outline-none" /></div><div className="flex items-center gap-2 rounded-xl bg-[#f2f7f1] px-3"><MapPin size={17} className="text-[#4ca952]" /><input data-testid="input-explore-location" value={location} onChange={(e) => setLocation(e.target.value)} className="w-32 bg-transparent py-3 text-sm outline-none" /></div><button data-testid="button-explore-filter" onClick={() => setRadius(radius === 15 ? 5 : 15)} className="flex items-center justify-center gap-2 rounded-xl border border-[#dbe9dd] px-4 py-3 text-sm font-bold text-[#3e5b4d] hover:bg-[#f2f8f1]"><SlidersHorizontal size={16} /> {radius} mi</button></div><div className="mb-5 flex gap-2 overflow-x-auto">{categories.filter((x) => x !== 'All').map((item) => <button key={item} data-testid={`button-filter-${item.toLowerCase()}`} onClick={() => setCategory(category === item ? '' : item)} className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold ${category === item ? 'border-[#55b958] bg-[#d9f3d5] text-[#286b35]' : 'border-[#d4e4d6] bg-white text-[#60786b]'}`}>{item}</button>)}</div>{view === 'map' ? <MapPanel gyms={gyms} selected={selectedGym} onSelect={setSelectedGym} /> : listingsQuery.isLoading ? <div className="grid gap-5 sm:grid-cols-2">{[1,2,3,4].map((i) => <ListingSkeleton key={i} />)}</div> : listingsQuery.isError ? <EmptyState title="Could not load nearby listings" body="Check your connection and try again." action={<button data-testid="button-retry-explore" onClick={() => listingsQuery.refetch()} className="rounded-xl bg-[#152d35] px-4 py-2 text-sm font-bold text-white">Try again</button>} /> : listingsQuery.data?.length ? <div className="grid gap-5 sm:grid-cols-2">{listingsQuery.data.map((listing: any, i: number) => <ListingCard key={listing.id} listing={listing} index={i} onSave={() => notify('Saved to your dashboard')} />)}</div> : <EmptyState title="Nothing in that radius yet" body="Try widening your search or choose another category." action={<button onClick={() => { setRadius(30); setCategory(''); }} className="rounded-xl bg-[#152d35] px-4 py-2 text-sm font-bold text-white">Widen search</button>} />}</div><aside className="rounded-2xl border border-[#dbe9dd] bg-[#152d35] p-5 text-[#eff9ef] lg:sticky lg:top-28 lg:h-fit"><div className="flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#71d06e]">Venue finder</p><h2 className="mt-2 font-display text-4xl font-bold uppercase leading-none">Move close<br />to home.</h2></div><LocateFixed className="text-[#71d06e]" /></div><p className="mt-4 text-sm leading-6 text-[#b6d0bd]">Popular venues around {location || 'you'}.</p>{gymsQuery.isLoading ? <div className="mt-5 space-y-3">{[1,2,3].map((i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-[#26454a]" />)}</div> : gyms.length ? <div className="mt-5 space-y-2">{gyms.slice(0, 5).map((gym: any) => <button key={gym.id} data-testid={`button-gym-${gym.id}`} onClick={() => { setSelectedGym(gym); setView('map'); }} className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors ${selectedGym?.id === gym.id ? 'bg-[#2c5750]' : 'bg-[#1d3b40] hover:bg-[#26494a]'}`}><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#d5f5d1] text-[#2b7138]"><Dumbbell size={17} /></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold">{gym.name}</span><span className="mt-0.5 block truncate text-xs text-[#a8c9af]">{gym.category} · {gym.distance}</span></span><ArrowUpRight size={15} className="text-[#71d06e]" /></button>)}</div> : <p className="mt-6 rounded-xl bg-[#1d3b40] p-4 text-sm text-[#a8c9af]">No venues found here yet.</p>}<Link href="/register-gym" data-testid="link-register-venue" className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-[#426454] py-3 text-sm font-bold text-[#bceeb8] hover:bg-[#1d3b40]">Register a venue <ArrowRight size={15} /></Link></aside></div></section></Shell>;
}

function MapPanel({ gyms, selected, onSelect }: { gyms: any[]; selected: any; onSelect: (gym: any) => void }) {
  return (
    <div data-testid="panel-map" className="relative min-h-[550px] overflow-hidden rounded-2xl border border-[#c5dcc7] bg-[#d5e9d5]">
      <iframe
        title="Nearby fitness venues map"
        src="https://www.openstreetmap.org/export/embed.html?bbox=77.60%2C12.89%2C77.78%2C13.02&layer=mapnik"
        className="absolute inset-0 h-full w-full border-0 opacity-70"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-[#d5e9d5]/25" />
      <div className="absolute left-5 top-5 rounded-xl bg-white/90 px-4 py-3 shadow-lg backdrop-blur">
        <p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#4aa64e]">Map view</p>
        <p className="mt-1 text-sm font-bold text-[#152d35]">{gyms.length} venues nearby</p>
      </div>
      {gyms.map((gym: any, i: number) => (
        <button
          key={gym.id}
          data-testid={`map-marker-${gym.id}`}
          onClick={() => onSelect(gym)}
          className="absolute"
          style={{ left: `${18 + ((i * 23) % 67)}%`, top: `${24 + ((i * 29) % 58)}%` }}
        >
          <span className={`flex h-10 w-10 items-center justify-center rounded-full border-4 border-white shadow-lg transition-transform ${selected?.id === gym.id ? 'scale-125 bg-[#152d35] text-[#71d06e]' : 'bg-[#55b958] text-white'}`}>
            <MapPin size={18} fill="currentColor" />
          </span>
          {selected?.id === gym.id && <span className="absolute left-1/2 top-12 w-36 -translate-x-1/2 rounded-lg bg-[#152d35] px-2 py-1.5 text-center text-[11px] font-bold text-white shadow-xl">{gym.name}</span>}
        </button>
      ))}
    </div>
  );
}

function Sell() {
  const create = useCreateListing();
  const qc = useQueryClient();
  const { flash, notify } = useFlash();
  const [done, setDone] = useState<any>(null);
  const [form, setForm] = useState({ title: '', venue: '', category: 'Gym', location: '', originalPrice: '', price: '', validUntil: '', access: 'Full access', seller: 'FitSwap member', image: '' });
  const update = (key: string, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const submit = (e: FormEvent) => { e.preventDefault(); if (!form.title || !form.venue || !form.location || !form.price || !form.originalPrice || !form.validUntil) { notify('Add the required details before publishing', 'error'); return; } create.mutate({ data: { ...form, originalPrice: Number(form.originalPrice), price: Number(form.price) } }, { onSuccess: (listing) => { qc.invalidateQueries({ queryKey: getGetListingsQueryKey({}) }); setDone(listing); notify('Your membership is live'); }, onError: () => notify('We could not publish that listing', 'error') }); };
  if (done) return <Shell><div className="mx-auto max-w-3xl px-5 py-20 text-center lg:py-28"><div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#d5f5d1] text-[#399044]"><Check size={38} /></div><p className="mt-7 text-xs font-bold uppercase tracking-[.18em] text-[#4aa64e]">Listing published</p><h1 className="mt-3 font-display text-6xl font-bold uppercase leading-none text-[#152d35]">You are in motion.</h1><p className="mx-auto mt-5 max-w-md text-sm leading-6 text-[#6c8274]">Your {done.title} membership is now visible to local buyers.</p><div className="mt-8 flex justify-center gap-3"><Link href={`/listing/${done.id}`} data-testid="link-view-published" className="rounded-xl bg-[#152d35] px-5 py-3 text-sm font-bold text-white">View listing</Link><button data-testid="button-list-another" onClick={() => setDone(null)} className="rounded-xl border border-[#c8ddca] bg-white px-5 py-3 text-sm font-bold text-[#456458]">List another</button></div></div></Shell>;
  return <Shell><FlashMessage flash={flash} /><div className="mx-auto max-w-[1180px] px-5 py-12 lg:px-10 lg:py-20"><div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr]"><div className="lg:pt-8"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#4aa64e]">Turn unused into useful</p><h1 className="mt-3 font-display text-6xl font-bold uppercase leading-[.86] text-[#152d35] sm:text-7xl">Sell your<br /><span className="text-[#4aa64e]">membership.</span></h1><p className="mt-6 max-w-sm text-sm leading-6 text-[#688074]">Plans changed? No problem. Put your membership in front of someone who will use it — and recover some value along the way.</p><div className="mt-9 space-y-4">{[['01', 'Add the details', 'Tell buyers what they are getting.'], ['02', 'Set a fair price', 'Show the original price and your saving.'], ['03', 'Publish and swap', 'Interested buyers will take it from here.']].map(([n, title, body]) => <div key={n} className="flex gap-3"><span className="font-display text-2xl font-bold text-[#70c96c]">{n}</span><div><p className="text-sm font-bold text-[#2b4439]">{title}</p><p className="mt-0.5 text-xs text-[#7b9183]">{body}</p></div></div>)}</div></div><form onSubmit={submit} className="rounded-[2rem] border border-[#dbe9dd] bg-white p-5 shadow-[0_20px_50px_rgba(20,54,40,.06)] sm:p-8"><div className="mb-7 flex items-center justify-between"><div><h2 className="font-display text-3xl font-bold uppercase text-[#152d35]">Listing details</h2><p className="mt-1 text-xs text-[#7b9183]">Fields marked with * are required.</p></div><div className="rounded-full bg-[#e6f6e4] px-3 py-1.5 text-xs font-bold text-[#35833e]">Free to list</div></div><div className="grid gap-5 sm:grid-cols-2"><Field label="What are you selling? *" value={form.title} onChange={(v) => update('title', v)} placeholder="e.g. 3-month unlimited membership" test="input-sell-title" wide /><Field label="Venue / gym name *" value={form.venue} onChange={(v) => update('venue', v)} placeholder="e.g. Cult.fit Koramangala" test="input-sell-venue" /><Field label="Location *" value={form.location} onChange={(v) => update('location', v)} placeholder="e.g. Koramangala, Bengaluru" test="input-sell-location" /><SelectField label="Category" value={form.category} onChange={(v) => update('category', v)} options={categories.filter((x) => x !== 'All')} test="select-sell-category" /><Field label="Access included" value={form.access} onChange={(v) => update('access', v)} placeholder="e.g. All classes + equipment" test="input-sell-access" /><Field label="Original price (₹) *" value={form.originalPrice} onChange={(v) => update('originalPrice', v)} placeholder="12000" test="input-sell-original-price" type="number" /><Field label="Your price (₹) *" value={form.price} onChange={(v) => update('price', v)} placeholder="7500" test="input-sell-price" type="number" /><Field label="Valid until *" value={form.validUntil} onChange={(v) => update('validUntil', v)} placeholder="2026-12-31" test="input-sell-valid-until" type="date" /></div><button disabled={create.isPending} data-testid="button-submit-listing" className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#55b958] py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#439b4a] disabled:cursor-wait disabled:opacity-60">{create.isPending ? <><LoaderCircle className="animate-spin" size={17} /> Publishing...</> : <>Publish listing <ArrowRight size={17} /></>}</button><p className="mt-4 flex items-center justify-center gap-2 text-center text-[11px] text-[#8aa092]"><ShieldCheck size={14} className="text-[#4aa64e]" /> Your contact details stay private until a sale.</p></form></div></div></Shell>;
}

function Field({ label, value, onChange, placeholder, test, type = 'text', wide = false }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; test: string; type?: string; wide?: boolean }) {
  return <label className={wide ? 'sm:col-span-2' : ''}><span className="mb-2 block text-xs font-bold text-[#486458]">{label}</span><input data-testid={test} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-[#d5e5d6] bg-[#fbfdfb] px-3.5 py-3 text-sm text-[#172e29] outline-none transition-colors placeholder:text-[#a2b0a6] focus:border-[#55b958] focus:ring-2 focus:ring-[#55b958]/15" /></label>;
}

function SelectField({ label, value, onChange, options, test }: { label: string; value: string; onChange: (v: string) => void; options: string[]; test: string }) {
  return <label><span className="mb-2 block text-xs font-bold text-[#486458]">{label}</span><div className="relative"><select data-testid={test} value={value} onChange={(e) => onChange(e.target.value)} className="w-full appearance-none rounded-xl border border-[#d5e5d6] bg-[#fbfdfb] px-3.5 py-3 text-sm text-[#172e29] outline-none focus:border-[#55b958]">{options.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-3.5 text-[#789080]" size={17} /></div></label>;
}

function RegisterGym() {
  const register = useRegisterGym();
  const qc = useQueryClient();
  const { flash, notify } = useFlash();
  const [done, setDone] = useState<any>(null);
  const [form, setForm] = useState({ name: '', category: 'Gym', location: '', address: '', lat: '', lng: '' });
  const update = (key: string, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const submit = (e: FormEvent) => { e.preventDefault(); if (!form.name || !form.location || !form.address) { notify('Add your venue name, city and address', 'error'); return; } register.mutate({ data: { ...form, lat: Number(form.lat) || 12.9352, lng: Number(form.lng) || 77.6245 } }, { onSuccess: (gym) => { qc.invalidateQueries({ queryKey: getGetNearbyGymsQueryKey({}) }); setDone(gym); notify('Venue registered'); }, onError: () => notify('We could not register that venue', 'error') }); };
  if (done) return <Shell><div className="mx-auto max-w-3xl px-5 py-20 text-center lg:py-28"><div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#d5f5d1] text-[#399044]"><Building2 size={34} /></div><p className="mt-7 text-xs font-bold uppercase tracking-[.18em] text-[#4aa64e]">Venue registered</p><h1 className="mt-3 font-display text-6xl font-bold uppercase leading-none text-[#152d35]">Welcome to<br />the movement.</h1><p className="mx-auto mt-5 max-w-md text-sm leading-6 text-[#6c8274]">{done.name} is now discoverable by FitSwap members in {done.location}.</p><Link href="/explore" data-testid="link-explore-registered" className="mt-8 inline-flex rounded-xl bg-[#152d35] px-5 py-3 text-sm font-bold text-white">See nearby venues</Link></div></Shell>;
  return <Shell><FlashMessage flash={flash} /><div className="mx-auto max-w-[1180px] px-5 py-12 lg:px-10 lg:py-20"><div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr]"><div className="relative overflow-hidden rounded-[2rem] bg-[#152d35] p-8 text-[#f3f8f4] sm:p-12"><div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border-[35px] border-[#2d5b47]" /><p className="relative text-xs font-bold uppercase tracking-[.18em] text-[#71d06e]">For gyms, studios and clubs</p><h1 className="relative mt-4 font-display text-6xl font-bold uppercase leading-[.87] sm:text-7xl">Put your<br /><span className="text-[#71d06e]">doors</span><br />to work.</h1><p className="relative mt-6 max-w-sm text-sm leading-6 text-[#b5d0bb]">Meet members who are ready to train. Register your venue so buyers can find trusted local access on FitSwap.</p><div className="relative mt-12 grid grid-cols-2 gap-3"><div className="rounded-xl bg-[#203f42] p-4"><Zap className="mb-5 text-[#71d06e]" size={20} /><p className="text-sm font-bold">More visibility</p><p className="mt-1 text-xs text-[#9dbca5]">Reach active locals.</p></div><div className="rounded-xl bg-[#203f42] p-4"><BadgeCheck className="mb-5 text-[#71d06e]" size={20} /><p className="text-sm font-bold">Trusted access</p><p className="mt-1 text-xs text-[#9dbca5]">Clear, useful listings.</p></div></div></div><form onSubmit={submit} className="rounded-[2rem] border border-[#dbe9dd] bg-white p-5 sm:p-8"><h2 className="font-display text-4xl font-bold uppercase text-[#152d35]">Venue profile</h2><p className="mt-1 text-sm text-[#7b9183]">Tell the local community where to find you.</p><div className="mt-7 grid gap-5 sm:grid-cols-2"><Field label="Venue name *" value={form.name} onChange={(v) => update('name', v)} placeholder="e.g. The Yard Climbing" test="input-gym-name" wide /><SelectField label="Venue type" value={form.category} onChange={(v) => update('category', v)} options={categories.filter((x) => x !== 'All')} test="select-gym-category" /><Field label="City / area *" value={form.location} onChange={(v) => update('location', v)} placeholder="e.g. Manchester" test="input-gym-location" /><Field label="Street address *" value={form.address} onChange={(v) => update('address', v)} placeholder="12 Active Way, M1 1AA" test="input-gym-address" wide /><Field label="Latitude (optional)" value={form.lat} onChange={(v) => update('lat', v)} placeholder="51.5072" test="input-gym-lat" type="number" /><Field label="Longitude (optional)" value={form.lng} onChange={(v) => update('lng', v)} placeholder="-0.1276" test="input-gym-lng" type="number" /></div><button disabled={register.isPending} data-testid="button-submit-gym" className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#55b958] py-3.5 text-sm font-bold text-white hover:bg-[#439b4a] disabled:opacity-60">{register.isPending ? <><LoaderCircle className="animate-spin" size={17} /> Registering...</> : <>Register venue <ArrowRight size={17} /></>}</button></form></div></div></Shell>;
}

function ListingDetail() {
  const { id = '' } = useParams<{ id: string }>();
  const query = useGetListing(id, { query: { queryKey: getGetListingQueryKey(id), enabled: !!id } });
  const purchase = usePurchaseListing();
  const qc = useQueryClient();
  const { flash, notify } = useFlash();
  const [form, setForm] = useState({ buyerName: '', buyerEmail: '' });
  const [receipt, setReceipt] = useState<any>(null);
  const listing: any = query.data;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.buyerName || !form.buyerEmail) {
      notify('Add your name and email to continue', 'error');
      return;
    }
    purchase.mutate({ id, data: form }, {
      onSuccess: (result) => {
        setReceipt(result);
        qc.invalidateQueries({ queryKey: getGetListingQueryKey(id) });
        qc.invalidateQueries({ queryKey: getGetListingsQueryKey({}) });
        notify('Membership secured');
      },
      onError: () => notify('Purchase could not be completed', 'error'),
    });
  };

  if (query.isLoading) return <Shell><div className="mx-auto max-w-5xl px-5 py-20"><div className="h-96 animate-pulse rounded-[2rem] bg-[#deebdf]" /></div></Shell>;
  if (query.isError || !listing) return <Shell><div className="mx-auto max-w-3xl px-5 py-24"><EmptyState title="Listing not found" body="This membership may have already been swapped." action={<Link href="/explore" className="rounded-xl bg-[#152d35] px-4 py-2 text-sm font-bold text-white">Back to explore</Link>} /></div></Shell>;
  if (receipt) return <Shell><div className="mx-auto max-w-3xl px-5 py-20 text-center"><div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#d5f5d1] text-[#399044]"><Check size={38} /></div><p className="mt-7 text-xs font-bold uppercase tracking-[.18em] text-[#4aa64e]">Swap confirmed</p><h1 className="mt-3 font-display text-6xl font-bold uppercase leading-none text-[#152d35]">You are<br />good to go.</h1><p className="mx-auto mt-5 max-w-md text-sm leading-6 text-[#6c8274]">{receipt.message || 'Your membership is ready. Check your inbox for the next steps.'}</p><div className="mx-auto mt-7 max-w-sm rounded-2xl border border-[#dbe9dd] bg-white p-5 text-left"><p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#7b9183]">Confirmation ID</p><p data-testid="text-confirmation-id" className="mt-1 font-mono text-sm font-bold text-[#152d35]">{receipt.confirmationId}</p><div className="my-4 h-px bg-[#e5eee5]" /><p className="text-sm font-bold text-[#152d35]">{listing.title}</p><p className="mt-1 text-xs text-[#71847a]">{listing.venue} · {listing.location}</p></div><Link href="/dashboard" data-testid="link-view-dashboard" className="mt-8 inline-flex rounded-xl bg-[#152d35] px-5 py-3 text-sm font-bold text-white">Go to dashboard</Link></div></Shell>;

  const image = listingImages[listing.image] || listing.image || campaignImage;
  return <Shell>
    <FlashMessage flash={flash} />
    <div className="mx-auto max-w-[1180px] px-5 py-10 lg:px-10 lg:py-16">
      <Link href="/explore" data-testid="link-back-explore" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#527062]">← Back to explore</Link>
      <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <div className="relative overflow-hidden rounded-[2rem] bg-[#dcebdc]">
            <img data-testid="img-detail-listing" src={image} alt={listing.title} className="h-[360px] w-full object-cover sm:h-[520px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#102d34]/70 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="rounded-full bg-[#d5f5d1] px-3 py-1.5 text-xs font-bold text-[#286b35]">{listing.category}</span>
              <h1 className="mt-3 font-display text-5xl font-bold uppercase leading-[.9] sm:text-6xl">{listing.title}</h1>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              ['Access', listing.access || 'Full access'],
              ['Valid until', listing.validUntil || 'Flexible'],
              ['Location', listing.location],
            ].map(([label, value]) => <div key={label} className="rounded-xl border border-[#dbe9dd] bg-white p-3 sm:p-4"><p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#81958a]">{label}</p><p className="mt-2 line-clamp-2 text-sm font-bold text-[#29453a]">{value}</p></div>)}
          </div>
        </div>
        <div>
          <div className="rounded-[2rem] border border-[#dbe9dd] bg-white p-6 shadow-[0_20px_50px_rgba(20,54,40,.06)] sm:p-8">
            <div className="flex items-center justify-between"><span className="flex items-center gap-1.5 text-sm font-bold text-[#486458]"><Star size={16} fill="#e1a52d" strokeWidth={0} /> {listing.rating || '4.8'} rating</span><span className="rounded-full bg-[#e2f6df] px-3 py-1.5 text-xs font-bold text-[#2d7c39]">{listing.savings || 0}% saving</span></div>
            <div className="mt-6 border-b border-[#e6eee6] pb-6"><p className="text-xs font-bold uppercase tracking-[.12em] text-[#81958a]">Your price</p><div className="mt-1 flex items-end gap-2"><span data-testid="text-detail-price" className="text-5xl font-bold text-[#152d35]">{money(listing.price)}</span><span className="mb-1 text-sm text-[#9aa9a0] line-through">{money(listing.originalPrice)}</span></div><p className="mt-2 text-xs text-[#4c9a50]">You save {money((listing.originalPrice || 0) - (listing.price || 0))} on this swap</p></div>
            <form onSubmit={submit} className="mt-6">
              <h2 className="text-lg font-bold text-[#152d35]">Secure this membership</h2>
              <p className="mt-1 text-xs leading-5 text-[#7b9183]">No account needed. We will send your confirmation to your email.</p>
              <div className="mt-5 space-y-3"><Field label="Your name" value={form.buyerName} onChange={(v) => setForm({ ...form, buyerName: v })} placeholder="Alex Morgan" test="input-buyer-name" /><Field label="Email address" value={form.buyerEmail} onChange={(v) => setForm({ ...form, buyerEmail: v })} placeholder="alex@example.com" test="input-buyer-email" type="email" /></div>
              <button disabled={purchase.isPending} data-testid="button-purchase-listing" className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#55b958] py-3.5 text-sm font-bold text-white disabled:opacity-60">{purchase.isPending ? <><LoaderCircle className="animate-spin" size={17} /> Securing...</> : <><CreditCard size={17} /> Purchase for {money(listing.price)}</>}</button>
              <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-[#84988b]"><ShieldCheck size={14} className="text-[#4aa64e]" /> Safe and secure swap</div>
            </form>
          </div>
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#dbe9dd] bg-white p-4"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d9f3d5] text-sm font-bold text-[#2b7138]">{(listing.seller || 'FS').slice(0, 2).toUpperCase()}</div><div><p className="text-xs text-[#81958a]">Listed by</p><p className="text-sm font-bold text-[#29453a]">{listing.seller || 'FitSwap member'}</p></div><BadgeCheck className="ml-auto text-[#4aa64e]" size={18} /></div>
        </div>
      </div>
    </div>
  </Shell>;
}

function Dashboard() {
  const listingsQuery = useGetListings({}, { query: { queryKey: getGetListingsQueryKey({}) } });
  const statsQuery = useGetMarketplaceStats({ query: { queryKey: getGetMarketplaceStatsQueryKey() } });
  const listings = listingsQuery.data || [];
  return <Shell><div className="mx-auto max-w-[1440px] px-5 py-12 lg:px-10 lg:py-16"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#4aa64e]">Your FitSwap space</p><h1 className="mt-2 font-display text-6xl font-bold uppercase leading-[.86] text-[#152d35]">Dashboard.</h1><p className="mt-4 text-sm text-[#6c8274]">Keep track of the value you have put back in motion.</p></div><Link href="/sell" data-testid="link-dashboard-sell" className="flex w-fit items-center gap-2 rounded-xl bg-[#152d35] px-4 py-3 text-sm font-bold text-white"><Plus size={17} /> List a membership</Link></div><div className="mt-10 grid gap-4 sm:grid-cols-3"><div className="rounded-2xl bg-[#152d35] p-5 text-white"><p className="text-xs font-bold uppercase tracking-[.13em] text-[#9fc6a8]">Your active listings</p><p className="mt-5 font-display text-5xl font-bold">{listings.length}</p><p className="mt-1 text-xs text-[#a9c6af]">visible in the marketplace</p></div><div className="rounded-2xl border border-[#dbe9dd] bg-white p-5"><p className="text-xs font-bold uppercase tracking-[.13em] text-[#789080]">Marketplace average saving</p><p className="mt-5 font-display text-5xl font-bold text-[#2d7138]">{statsQuery.data?.averageSavings || '—'}<span className="text-3xl">%</span></p><p className="mt-1 text-xs text-[#789080]">more access for less</p></div><div className="rounded-2xl border border-[#dbe9dd] bg-[#d9f3d5] p-5"><p className="text-xs font-bold uppercase tracking-[.13em] text-[#56865c]">Community swaps</p><p className="mt-5 font-display text-5xl font-bold text-[#152d35]">{statsQuery.data?.membershipsSwapped || '—'}</p><p className="mt-1 text-xs text-[#56865c]">memberships kept moving</p></div></div><div className="mt-14"><SectionHeading eyebrow="Seller activity" title="Your listings" action={<Link href="/explore" data-testid="link-dashboard-explore" className="flex items-center gap-2 text-sm font-bold text-[#2b7138]">Browse marketplace <ArrowRight size={17} /></Link>} />{listingsQuery.isLoading ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{[1,2,3,4].map((i) => <ListingSkeleton key={i} />)}</div> : listings.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{listings.slice(0, 8).map((listing: any, i: number) => <ListingCard key={listing.id} listing={listing} index={i} />)}</div> : <EmptyState title="Your activity starts here" body="List a membership you are not using, or explore a new place to train." action={<Link href="/sell" className="rounded-xl bg-[#152d35] px-4 py-2 text-sm font-bold text-white">List a membership</Link>} />}</div><div className="mt-14 grid gap-5 md:grid-cols-2"><div className="rounded-2xl border border-[#dbe9dd] bg-white p-6"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#789080]">Buyer activity</p><h2 className="mt-2 text-xl font-bold text-[#152d35]">Ready for your next session?</h2></div><Dumbbell className="text-[#55b958]" /></div><p className="mt-3 text-sm leading-6 text-[#72877a]">Find a flexible membership near you and pay only for the access you need.</p><Link href="/explore" data-testid="link-dashboard-buy" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#eef8ed] px-4 py-2.5 text-sm font-bold text-[#2b7138]">Explore nearby <ArrowRight size={16} /></Link></div><div className="rounded-2xl border border-[#dbe9dd] bg-white p-6"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#789080]">Why FitSwap</p><h2 className="mt-2 text-xl font-bold text-[#152d35]">Fitness should stay flexible.</h2></div><RotateCcw className="text-[#55b958]" /></div><p className="mt-3 text-sm leading-6 text-[#72877a]">Local swaps create more choice for buyers, more value for sellers and less waste for everyone.</p><div className="mt-5 flex gap-2"><span className="rounded-full bg-[#e8f6e6] px-3 py-1.5 text-xs font-bold text-[#3b8644]">Local first</span><span className="rounded-full bg-[#e8f6e6] px-3 py-1.5 text-xs font-bold text-[#3b8644]">Secure</span></div></div></div></div></Shell>;
}

function Router() {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}><Switch><Route path="/" component={Home} /><Route path="/explore" component={Explore} /><Route path="/sell" component={Sell} /><Route path="/register-gym" component={RegisterGym} /><Route path="/listing/:id" component={ListingDetail} /><Route path="/dashboard" component={Dashboard} /><Route component={NotFound} /></Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><Router /></QueryClientProvider>;
}

export default App;