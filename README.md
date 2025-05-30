# پروژه تشخیص گفتار

## دستورات مهم

### نصب وابستگی‌ها

```bash
npm install
```

### اجرای پروژه در محیط توسعه

```bash
npm run dev
```

### ساخت نسخه نهایی

```bash
npm run build
```

### بررسی خطاهای کد

```bash
npm run lint
```

### پیش‌نمایش نسخه نهایی

```bash
npm run preview
```

### دستورات Git

```bash
# اضافه کردن تغییرات
git add .

# ثبت تغییرات
git commit -m "پیام تغییرات"

# ارسال تغییرات به GitHub
git push origin main

# دریافت آخرین تغییرات
git pull origin main
```

### دستورات استقرار در GitHub Pages

```bash
# ساخت نسخه نهایی
npm run build

# ارسال تغییرات به GitHub
git add .
git commit -m "به‌روزرسانی برای استقرار"
git push origin main
```

## نکات مهم

-   قبل از ارسال تغییرات، حتماً از دستور `npm run lint` برای بررسی خطاها استفاده کنید
-   برای استقرار در GitHub Pages، کافیست تغییرات را به شاخه `main` پوش کنید
-   سایت در آدرس `https://YOUR_USERNAME.github.io/speech-recognition/` قابل دسترسی خواهد بود
