# QServers Deployment Guide (FinSchool Pro Suite)

This guide explains how to upload and launch your application on **QServers** (cPanel Hosting).

## 1. Prepare Files
1.  Ensure you have run `npm run build` (I have already started this for you).
2.  Zip the following files/folders from your project root:
    *   `dist/` (The frontend assets)
    *   `server/` (The backend code)
    *   `app.js` (The entry point)
    *   `package.json` & `package-lock.json`
    *   `.env` (Make sure `DATABASE_URL` is set to `file:server/prisma/dev.db`)

## 2. Upload via cPanel
1.  Log in to your **QServers cPanel**.
2.  Go to **File Manager** and upload the zip file to a folder (e.g., `/home/username/finschool`).
3.  Extract the zip file.

## 3. Create Node.js App
1.  In cPanel, search for **"Setup Node.js App"**.
2.  Click **"Create Application"**.
    *   **Node.js Version:** 18.x or 20.x
    *   **Application Mode:** Production
    *   **Application Root:** `finschool` (or whatever you named the folder)
    *   **Application URL:** Your domain (e.g., `portal.yourschool.com`)
    *   **Application Startup File:** `app.js`
3.  Click **CREATE**.

## 4. Install Dependencies
1.  Once created, click the **"Run npm install"** button in the Node.js Setup page.
2.  Wait for all packages to download.

## 5. Final Step
1.  Navigate to your domain in the browser. 
2.  The system will automatically detect it's a fresh installation and prompt the **Setup Wizard**.
3.  You are now live!

---

### Important Maintenance
*   **Database:** Your database is located in `server/prisma/dev.db`. You can download this file anytime for a local backup.
*   **Logs:** Check the "Node.js App" page in cPanel to view error logs if something doesn't load.
