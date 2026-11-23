# Delcom Blog — Frontend (ReactJS + Vite + Tailwind)

SPA multi-tier. Rute: `/` & `/public`, `/posts/:slug`, `/login`, `/register`, `/author`, `/admin`.
Login memakai `#login-username`, `#login-password`, `#login-submit`. Akun seed: `admin`/(ADMIN_PASSWORD) dan `member`/`member123`.

```bash
npm install
cp .env.example .env     # isi VITE_API_BASE_URL dengan URL backend
npm run dev              # pengembangan (proxy /api -> localhost:8081)
npm run build            # hasil build ke dist/
npm start                # menjalankan HASIL BUILD (vite preview, 0.0.0.0:5174)
npm test                 # vitest + coverage
```
Catatan: `VITE_API_BASE_URL` ditanam saat `npm run build`; ubah nilainya berarti build ulang.
