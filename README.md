# Y-SSM - Uyku ve Stres Yönetim Sistemi

Bu repo, Y-SSM web arayüzünün statik scaffold'udur. İçerikleri `index.html` ve `assets/` altındaki dosyalarla modüler hale getirdim.

## Çalıştırma
1. `npm install`
2. `npm start`
3. Tarayıcıda `http://localhost:3000`

## Notlar
- `components/modals.html` dosyasına otomatik olarak orijinal modal içerikleri eklendi (kaynak: yüklediğiniz HTML).
- Gerçek kimlik doğrulama ve veri saklama için daha güvenli bir backend veritabanı ekleyin.


## Media
- Logo: assets/images/logo-1024.png
- Favicon: assets/images/favicon.ico
- Hero background: assets/images/hero-bg.jpg
- Audio samples: assets/audio/*.wav
- To add real videos place MP4 files into assets/videos/ and update components accordingly.

## Deploy to Render

1. Push this project to a new GitHub repository.
2. Go to [Render](https://render.com) and create an account (free tier available).
3. Click "New" → "Web Service".
4. Connect your GitHub account and select the repository.
5. Render will detect `render.yaml` and configure the service automatically.
6. Click "Create Web Service".
7. Wait for the build to finish; your app will be live at `https://<your-app>.onrender.com`.

**Note:** The SQLite database is stored in `./data/db.sqlite`. On free Render plans, files are not persistent across deploys; for persistence, use a Render Disk or a managed database.
