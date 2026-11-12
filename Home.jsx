import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Phone, MapPin, Mail, Star, Truck, ShieldCheck, Flame, MessageCircle } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import ProductCard from '../../components/ProductCard';
import ProductImage from '../../components/ProductImage';
import { testimonials } from '../../data/demoData';
import { buildWhatsAppUrl } from '../../utils/whatsapp';

export default function Home() {
  const { products, categories, settings } = useStore();
  const featured = products.filter((p) => p.featured && p.available).slice(0, 8);
  const heroDishes = products.filter((p) => p.available).slice(0, 3);
  const waUrl = buildWhatsAppUrl(settings.whatsapp, `Hello ${settings.restaurantName}, I would like to place an order.`);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-amber-50">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="container-page relative grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-2">
          <div className="animate-slide-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-brand-700 shadow-card">
              <Flame className="h-3.5 w-3.5" /> Fresh · Fast · Flavourful
            </span>
            <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-ink-900 sm:text-5xl lg:text-6xl">
              Delicious food, <span className="text-brand-500">delivered to your door</span>
            </h2>
            <p className="mt-5 max-w-lg text-lg text-ink-600">
              Hand-crafted burgers, wood-fired pizza and charcoal grills made with fresh ingredients. Order online or send
              your order straight through WhatsApp.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/menu" className="btn-primary btn-lg">
                Order now <ArrowRight className="h-5 w-5" />
              </Link>
              <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp btn-lg">
                <MessageCircle className="h-5 w-5" /> WhatsApp us
              </a>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
              {[
                ['4.9★', 'Average rating'],
                ['30 min', 'Avg. delivery'],
                ['24+', 'Menu items'],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="text-2xl font-extrabold text-ink-900">{v}</dt>
                  <dd className="text-xs text-ink-500">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mx-auto grid w-full max-w-md grid-cols-2 gap-4">
            {heroDishes.map((p, i) => (
              <div
                key={p.id}
                className={`group card animate-slide-up overflow-hidden ${i === 0 ? 'col-span-2 aspect-[16/9]' : 'aspect-square'}`}
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <ProductImage product={p} emojiSize={i === 0 ? 'text-8xl' : 'text-6xl'} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="container-page py-14">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { icon: Truck, title: 'Fast delivery', text: 'Hot food at your door in around 30 minutes, tracked from kitchen to doorstep.' },
            { icon: ShieldCheck, title: 'Fresh ingredients', text: 'Locally sourced produce and premium cuts prepared fresh every single day.' },
            { icon: MessageCircle, title: 'Order your way', text: 'Use our website or send your order via WhatsApp, whichever you prefer.' },
          ].map((f) => (
            <div key={f.title} className="card flex gap-4 p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
                <f.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold">{f.title}</h3>
                <p className="mt-1 text-sm text-ink-500">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container-page py-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="section-title">Popular categories</h2>
            <p className="mt-1 text-ink-500">Pick your craving and dive in.</p>
          </div>
          <Link to="/menu" className="btn-ghost btn-sm hidden sm:inline-flex">
            Full menu <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => {
            const count = products.filter((p) => p.category === c.id && p.available).length;
            return (
              <Link
                key={c.id}
                to={`/menu?category=${c.id}`}
                className="card group flex flex-col items-center p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-pop"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-4xl transition-transform group-hover:scale-110">
                  {c.emoji}
                </span>
                <span className="mt-3 text-sm font-bold">{c.name}</span>
                <span className="text-xs text-ink-400">{count} items</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured */}
      <section className="container-page py-14">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="section-title">Featured dishes</h2>
            <p className="mt-1 text-ink-500">Our customers’ all-time favourites.</p>
          </div>
          <Link to="/menu" className="btn-outline btn-sm">
            View all
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-16">
        <div className="container-page">
          <div className="mx-auto mb-10 max-w-xl text-center">
            <h2 className="section-title">Loved by our customers</h2>
            <p className="mt-1 text-ink-500">Real words from people who order with us every week.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.name} className="card p-6">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-ink-600">“{t.text}”</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700">
                    {t.name[0]}
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-ink-900">{t.name}</span>
                    <span className="block text-xs text-ink-400">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Hours + contact */}
      <section className="container-page py-16">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
                <Clock className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-extrabold">Opening hours</h2>
            </div>
            <ul className="mt-6 divide-y divide-ink-100">
              {settings.openingHours.map((h) => (
                <li key={h.day} className="flex items-center justify-between py-3 text-sm">
                  <span className="font-semibold text-ink-800">{h.day}</span>
                  <span className={h.closed ? 'font-semibold text-red-600' : 'text-ink-600'}>
                    {h.closed ? 'Closed' : `${h.open} – ${h.close}`}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <div className="card p-6 sm:p-8">
              <h2 className="text-xl font-extrabold">Contact us</h2>
              <ul className="mt-5 space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
                  <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="font-medium hover:text-brand-600">
                    {settings.phone}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
                  <a href={`mailto:${settings.email}`} className="font-medium hover:text-brand-600">
                    {settings.email}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
                  <span className="font-medium">{settings.address}</span>
                </li>
              </ul>
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 p-6 text-white shadow-card sm:p-8">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
              <h2 className="relative text-2xl font-extrabold text-white">Hungry right now?</h2>
              <p className="relative mt-2 text-brand-50">Browse the menu and get your food in about 30 minutes.</p>
              <div className="relative mt-5 flex flex-wrap gap-3">
                <Link to="/menu" className="btn bg-white text-brand-700 hover:bg-brand-50">
                  Start ordering
                </Link>
                <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn border border-white/40 text-white hover:bg-white/10">
                  Order on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
