# VocabQuest — הגדרת שרת, Google Login, שמירה בענן ו-Google Play

## איפה מורידים את האפליקציה?

### אפליקציה אמיתית (Android — Google Play / APK)
ראי **`NATIVE-APP-HE.md`** — בניית APK/AAB עם Android Studio ופרסום ב-Google Play ($25).

זו **אפליקציה רגילה** — לא "הוסף למסך הבית" בדפדפן.

### אתר (דפדפן)
**כתובת:** https://vocabulary-proj.vercel.app

---

## למה Google Login לא עובד?

השגיאה `Server error — problem with the server configuration` = **חסרות משתני סביבה ב-Vercel**.

### שלב 1: Google Cloud Console
1. https://console.cloud.google.com/apis/credentials
2. **Create Credentials** → OAuth client ID → **Web application**
3. **Authorized redirect URIs:**
   ```
   https://vocabulary-proj.vercel.app/api/auth/callback/google
   ```
4. העתיקי **Client ID** ו-**Client Secret**

### שלב 2: NEXTAUTH_SECRET
ב-PowerShell:
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
```
העתיקי את התוצאה.

### שלב 3: Vercel → Project → Settings → Environment Variables

| Name | Value |
|------|--------|
| `GOOGLE_CLIENT_ID` | מה-Console |
| `GOOGLE_CLIENT_SECRET` | מה-Console |
| `NEXTAUTH_SECRET` | המחרוזת האקראית |
| `NEXTAUTH_URL` | `https://vocabulary-proj.vercel.app` |
| `DATABASE_URL` | מ-Neon (למטה) |

אחרי שמירה: **Deployments → Redeploy** (חובה!).

---

## שמירת התקדמות אמיתית (בענן)

**עד עכשיו:** ההתקדמות נשמרה רק בדפדפן (localStorage) — מחיקת cache / מכשיר אחר = איבוד.

**עכשיו בקוד:** התקדמות נשמרת ב-**PostgreSQL** כשמתחברים עם **Google** וה-DB מוגדר.

### שלב 1: מסד נתונים חינמי (Neon)
1. https://neon.tech — הרשמה חינם
2. Create project → העתיקי **Connection string** (PostgreSQL)
3. הוסיפי ב-Vercel כ-`DATABASE_URL`

### שלב 2: Redeploy ב-Vercel
ה-build מריץ `prisma db push` לא אוטומטי — **פעם אחת** מהמחשב:
```bash
npm install
npx prisma db push
```
(עם `DATABASE_URL` ב-.env.local)

### איך זה עובד למשתמש
1. **Continue with Google**
2. בכניסה — התקדמות נטענת מהענן
3. בכל שינוי — נשמר אוטומטית לשרת (תוך ~2 שניות)

**התחברות עם אימייל/סיסמה** — עדיין מקומית בדפדפן. לשמירה בענן השתמשי ב-Google.

---

## Google Play — אפליקציה בחנות

| אפשרות | עלות | הערות |
|--------|------|--------|
| **PWA (הוסף למסך הבית)** | חינם | מה שיש עכשיו — הכי מהיר |
| **Google Play** | **$25 פעם אחת** (דמי מפתח) | חובה לחשבון Developer |
| **APK לשיתוף ישיר** | חינם | חברים מתקינים ידנית (לא מהחנות) |

### פרסום ב-Google Play (TWA — עוטף לאתר)
1. חשבון [Google Play Console](https://play.google.com/console) — $25
2. כלי **[PWABuilder](https://www.pwabuilder.com/)** — הזיני `https://vocabulary-proj.vercel.app`
3. **Generate** → Android package (AAB)
4. העלו ל-Play Console → Internal testing (חינם, עד 100 בודקים)

### שיתוף APK בלי חנות (חינם)
1. PWABuilder → **Download APK**
2. שלחי לחברים ב-WhatsApp / Drive
3. במכשיר: Settings → Allow install from unknown sources

---

## סיכום מהיר

| רוצה | מה לעשות |
|------|-----------|
| **אפליקציה אמיתית (Android)** | `NATIVE-APP-HE.md` → Android Studio → APK / Google Play |
| Google Login | 4 משתנים ב-Vercel + Redeploy |
| התקדמות שלא נמחקת | `DATABASE_URL` (Neon) + Google Login |
| אתר בדפדפן | https://vocabulary-proj.vercel.app |
