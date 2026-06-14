# VocabQuest — אפליקציה אמיתית ל-Android (Google Play)

זו **אפליקציה native** — קובץ APK/AAB שמותקן כמו כל אפליקציה, לא קיצור דרך בדפדפן.

הפרויקט משתמש ב-**Capacitor**: מעטפת Android אמיתית שטוענת את האתר מ-Vercel. כל הפיצ'רים (Google Login, שמירה בענן, משחקים) עובדים כי השרת נשאר באינטרנט.

---

## מה צריך

| דבר | עלות | הערות |
|-----|------|--------|
| **Android Studio** | חינם | https://developer.android.com/studio |
| **Java JDK 17+** | חינם | מגיע עם Android Studio |
| **Google Play Developer** | **$25 פעם אחת** | לפרסום בחנות |
| **Mac + Apple Developer** | $99/שנה | רק ל-iPhone (App Store) — לא ניתן לבנות מ-Windows |

---

## שלב 1: APK מוכן (GitHub Actions)

**הדרך הכי קלה** — בלי Android Studio:

1. GitHub → **Actions** → **Build Android APK** → **Run workflow**
2. אחרי ~5 דקות: לחצי על הריצה → **Artifacts** → **VocabQuest-debug-apk**
3. הורידי `app-debug.apk` ושלחי לטלפון

---

## שלב 1 (חלופי): פתיחה ב-Android Studio

```powershell
cd "C:\Users\...\vocabulary_proj"
npm install
npm run android:open
```

Android Studio ייפתח עם תיקיית `android/`.

---

## שלב 2: אייקון האפליקציה

1. Android Studio → **android/app** → לחיצה ימנית → **New → Image Asset**
2. **Launcher Icons** → בחרי `public/icons/icon-512.png`
3. Finish

---

## שלב 3: בניית APK לבדיקה (לשליחה לחברים)

1. **Build → Build Bundle(s) / APK(s) → Build APK(s)**
2. הקובץ: `android/app/build/outputs/apk/debug/app-debug.apk`
3. שלחי ב-WhatsApp / Drive
4. במכשיר: **הגדרות → אבטחה → התקנה ממקורות לא ידועים** (מותר ל-Chrome/Drive)

---

## שלב 4: פרסום ב-Google Play (AAB חתום)

### 4.1 חשבון מפתח
1. https://play.google.com/console — הרשמה ($25)
2. **Create app** → שם: VocabQuest

### 4.2 חתימה (Signing)
1. Android Studio → **Build → Generate Signed Bundle / APK**
2. **Android App Bundle (AAB)**
3. **Create new keystore** — שמרי את הקובץ והסיסמה (אבוד = לא ניתן לעדכן את האפליקציה!)
4. Build → `app-release.aab`

### 4.3 העלאה
1. Play Console → **Release → Production** (או Internal testing לבדיקה)
2. העלי את ה-AAB
3. מלאי: תיאור, צילומי מסך, מדיניות פרטיות (URL לאתר), דירוג תוכן
4. שלחי לבדיקה → פרסום

### 4.4 קישור Google Play באתר
אחרי שיש קישור בחנות, עדכני ב-`lib/nativeApp.ts`:
```typescript
export const GOOGLE_PLAY_URL = 'https://play.google.com/store/apps/details?id=com.vocabquest.app';
```

---

## פקודות שימושיות

```powershell
npm run android:sync    # מעדכן את android/ אחרי שינוי ב-capacitor.config.ts
npm run android:open    # פותח Android Studio
```

---

## iPhone (App Store)

מ-Windows **אי אפשר** לבנות IPA. אפשרויות:
1. Mac + Xcode + `npx cap add ios` (אפשר להוסיף מאוחר יותר)
2. שירות ענן (Codemagic, GitHub Actions + Mac runner)
3. חשבון Apple Developer — $99/שנה

---

## שאלות נפוצות

**זו באמת אפליקציה?**  
כן. מותקנת מ-Google Play, מופיעה ברשימת האפליקציות, עם אייקון משלה.

**למה לא PWA?**  
PWA = קיצור דרך בדפדפן. כאן יש קובץ `.apk`/`.aab` native.

**צריך אינטרנט?**  
כן — האפליקציה מתחברת ל-`https://vocabulary-proj.vercel.app` (login, מילים, משחקים).

**איך לשנות את כתובת השרת?**  
ערכי `server.url` ב-`capacitor.config.ts`, ואז `npm run android:sync`.
