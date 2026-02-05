# Deployment Fixes for 401 Unauthorized Error

## Problem

The application was experiencing 401 Unauthorized errors when deployed on render.com due to CORS and cookie configuration issues.

## Root Cause

1. **CORS Configuration Mismatch**: Frontend was deployed at `https://new-chatbot-voice1-1-frontend.onrender.com` but backend CORS only allowed this URL, while frontend was configured to use `https://new-chatbot-voice1.onrender.com` as serverUrl.

2. **Cookie Security Settings**: In production, cookies need `sameSite: "none"` and `secure: true` for cross-origin requests to work properly.

## Fixes Applied

### Backend Changes (`backend/controllers/auth.controllers.js`)

- ✅ Updated cookie settings for all auth functions (signUp, Login, googleAuth)
- ✅ Set `sameSite: process.env.NODE_ENV === 'production' ? "none" : "strict"`
- ✅ Set `secure: process.env.NODE_ENV === 'production'`

### Backend Changes (`backend/index.js`)

- ✅ Added both frontend URLs to CORS allowed origins:
  - `https://new-chatbot-voice1-1-frontend.onrender.com`
  - `https://new-chatbot-voice1.onrender.com`

### Frontend Changes (`frontend/src/context/UserContext.jsx`)

- ✅ Confirmed serverUrl is set to `https://new-chatbot-voice1.onrender.com`

## Deployment Steps

1. **Deploy Backend First**:
   - Push the backend changes to your repository
   - Redeploy the backend on render.com
   - Ensure `NODE_ENV=production` is set in render.com environment variables

2. **Deploy Frontend**:
   - Push the frontend changes to your repository
   - Redeploy the frontend on render.com

3. **Verify Environment Variables**:
   - Ensure backend has `NODE_ENV=production`
   - Ensure all required API keys and database connections are set

## Testing

After deployment:

1. Try logging in to the application
2. Check browser developer tools for any CORS errors
3. Verify that API calls are working (check Network tab)
4. Test authentication flow end-to-end

## Additional Notes

- The CORS configuration temporarily allows all origins for debugging (`callback(null, true)`)
- Consider tightening CORS settings once everything is working
- Ensure HTTPS is enabled on both frontend and backend deployments
