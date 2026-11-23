import { lazy, Suspense, useEffect, useState } from 'react';

const Viewer = lazy(() => import('./MarkdownViewerImpl'));

/** Teks polos sebagai cadangan sebelum TOAST UI Viewer selesai dimuat. */
function Fallback({ content }) {
    return (
        <div className="prose-post whitespace-pre-wrap" data-testid="markdown-fallback">
            {content}
        </div>
    );
}

/** Render Markdown memakai TOAST UI Viewer (dimuat malas agar halaman cepat tampil). */
export default function MarkdownViewer({ content }) {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const start = () => setReady(true);
        if ('requestIdleCallback' in window) {
            const id = window.requestIdleCallback(start, { timeout: 1500 });
            return () => window.cancelIdleCallback(id);
        }
        const id = window.setTimeout(start, 400);
        return () => window.clearTimeout(id);
    }, []);

    if (!ready) return <Fallback content={content} />;

    return (
        <Suspense fallback={<Fallback content={content} />}>
            <Viewer content={content} />
        </Suspense>
    );
}
