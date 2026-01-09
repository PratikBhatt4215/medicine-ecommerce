# 🚀 Quick Start - Railway Deployment

## ✅ What's Been Configured

Your application is now ready for Railway deployment with **automatic environment switching**:

- ✅ Backend: Production properties file created
- ✅ Frontend: Environment variables configured
- ✅ CORS: Automatically uses correct origins
- ✅ Builds: Both tested and working
- ✅ Railway: Configuration files ready

## 🎯 How to Deploy (Quick Steps)

### 1. Push to GitHub
```bash
cd /Users/pratikkumar/IdeaProjects/LetsDoIT
git init
git add .
git commit -m "Ready for Railway deployment"
# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/medicine-ecommerce.git
git push -u origin main
```

### 2. Railway Setup
1. Go to [railway.app](https://railway.app) → Sign up with GitHub
2. New Project → Provision PostgreSQL
3. New Service → Select your GitHub repo
4. Configure Backend:
   - Root Directory: `medicine-ecommerce-backend`
   - Variables:
     ```
     SPRING_PROFILES_ACTIVE=prod
     DATABASE_URL=${{Postgres.DATABASE_URL}}
     JWT_SECRET=your-secure-secret-here
     FRONTEND_URL=https://TEMP
     ```
   - Generate Domain → Copy URL

5. New Service → Same GitHub repo
6. Configure Frontend:
   - Root Directory: `medicine-ecommerce-frontend`
   - Variables:
     ```
     VITE_API_BASE_URL=https://YOUR_BACKEND_URL/api
     ```
   - Generate Domain → Copy URL

7. Update Backend `FRONTEND_URL` with frontend URL

### 3. Done! 🎉
Your app is live at your frontend URL!

---

## 🔄 Local vs Production

### Running Locally (No Changes!)
```bash
./start-app.sh
```
- Uses local PostgreSQL automatically
- No environment variables needed

### Production (Automatic!)
- Railway sets `SPRING_PROFILES_ACTIVE=prod`
- Uses production database and settings
- No manual switching!

---

## 📝 Environment Variables Reference

### Backend (Railway)
| Variable | Value |
|----------|-------|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` |
| `JWT_SECRET` | Your secure secret key |
| `FRONTEND_URL` | Your frontend Railway URL |

### Frontend (Railway)
| Variable | Value |
|----------|-------|
| `VITE_API_BASE_URL` | Your backend Railway URL + `/api` |

---

## 💰 Cost: $0/month
Railway provides $5 free credit monthly - your app uses ~$3-4/month.

---

## 📚 Full Guide
See `railway_deployment_guide.md` for detailed step-by-step instructions.

---

## 🆘 Quick Troubleshooting

**Backend won't start?**
- Check build logs in Railway dashboard
- Verify `DATABASE_URL` is set

**Frontend can't connect?**
- Check `VITE_API_BASE_URL` is correct
- Verify backend is running

**CORS errors?**
- Update `FRONTEND_URL` in backend variables
- Must match exact frontend URL

---

## ✅ Files Created/Modified

### Backend
- ✅ `application-prod.properties` - Production config
- ✅ `application.properties` - Updated with comments
- ✅ `CorsConfig.java` - Environment-based CORS
- ✅ `railway.json` - Railway build config
- ✅ `.gitignore` - Git ignore rules

### Frontend
- ✅ `.env.production` - Production API URL
- ✅ `api.js` - Environment-based API URL
- ✅ `railway.json` - Railway build config
- ✅ `.gitignore` - Already exists

---

## 🎊 You're Ready!
Follow the steps above to deploy to Railway. Your app will be live in ~10 minutes!
