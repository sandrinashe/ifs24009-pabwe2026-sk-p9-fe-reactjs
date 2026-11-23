import { useId } from 'react';

/** Bentuk chrome cair dekoratif ala referensi HUSH. */
export function ChromeBlob({ className = '', tint = 'silver' }) {
    const id = useId().replace(/:/g, '');
    const stops =
        tint === 'pink'
            ? ['#fff0f5', '#f4a7c0', '#c9567f', '#ffe3ec']
            : ['#ffffff', '#c9cbd3', '#6f7280', '#f4f4f8'];
    return (
        <svg viewBox="0 0 200 200" className={`chrome-blob ${className}`} aria-hidden="true" focusable="false">
            <defs>
                <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor={stops[0]} />
                    <stop offset="0.35" stopColor={stops[1]} />
                    <stop offset="0.7" stopColor={stops[2]} />
                    <stop offset="1" stopColor={stops[3]} />
                </linearGradient>
            </defs>
            <path
                fill={`url(#${id})`}
                d="M38 118c-22-18-14-52 16-58 20-4 30 8 46 6 18-2 24-22 48-18 30 6 40 44 14 62-14 10-30 6-42 14-16 10-18 34-42 32-26-2-30-26-40-38Z"
            />
            <path fill="rgba(255,255,255,0.55)" d="M70 72c10-8 26-6 34 0-12-2-24 2-34 0Z" />
        </svg>
    );
}

const GRADIENTS = [
    'linear-gradient(135deg,#f9c9d9,#d9779a)',
    'linear-gradient(135deg,#fde7ef,#c9567f)',
    'linear-gradient(135deg,#f4f4f8,#c9cbd3)',
    'linear-gradient(135deg,#ffd6e3,#b8456e)',
    'linear-gradient(135deg,#fff0f5,#e58bab)',
    'linear-gradient(135deg,#ececf1,#f4a7c0)',
];

/** Sampul artikel: gambar asli atau seni gradien dengan blob chrome. */
export function CoverArt({ post, className = '', rounded = 'rounded-[2.5rem]' }) {
    const seed = (post.id ?? post.title.length) % GRADIENTS.length;

    return (
        <div className={`relative isolate overflow-hidden ${rounded} ${className}`} style={{ background: GRADIENTS[seed] }}>
            {post.cover_image_path ? (
                <img src={post.cover_image_path} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
            ) : (
                <ChromeBlob className="absolute left-1/2 top-1/2 h-3/4 w-3/4 -translate-x-1/2 -translate-y-1/2" tint={seed % 2 ? 'pink' : 'silver'} />
            )}
        </div>
    );
}

export function Avatar({ user, size = 40 }) {
    const initials = (user?.username ?? '?')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0].toUpperCase())
        .join('');

    return (
        <span
            aria-hidden="true"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-berry font-display text-sm font-bold text-white"
            style={{ width: size, height: size }}
        >
            {initials}
        </span>
    );
}
