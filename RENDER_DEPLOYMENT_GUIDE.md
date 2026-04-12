# 🚀 Full Guide: Deploying EduTech Pro Suite to Render

This guide walks you through setting up a production-ready environment on Render using the changes we just made.

## 1. Prepare your GitHub Repository
Render works best when connected to a Git repository.
1.  **Commit the changes**: Ensure you commit the updated `Dockerfile`, `schema.prisma`, `vite.config.js`, and the refactored `src/` files.
2.  **Push to GitHub**: Send your code to a private or public repository.

## 2. Set Up the Database (PostgreSQL)
Since we switched to PostgreSQL, you need a database instance.
1.  Log in to [Render Dashboard](https://dashboard.render.com).
2.  Click **New +** > **Database**.
3.  **Name**: `edutech-db`
4.  **Database**: `edutech`
5.  **User**: `admin`
6.  **Region**: Choose the one closest to your users.
7.  Click **Create Database**.
8.  **Crucial**: Once it's created, find the **Internal Database URL**. Copy it.

## 3. Create the Web Service
This is the main application server.
1.  Click **New +** > **Web Service**.
2.  Select your repository from GitHub.
3.  **Name**: `edutech-portal`
4.  **Region**: Match the database region.
5.  **Runtime**: Select **Docker**. (Render will automatically detect your `Dockerfile`).
6.  **Plan**: The "Free" tier works, but "Starter" is recommended for schools.
7.  Click **Advanced** to add **Environment Variables**.

## 4. Environment Variables (The Key Step)
Add the following variables in the Render dashboard:

| Key | Value | Note |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgres://...` | Paste the **Internal Database URL** you copied in Step 2. |
| `JWT_SECRET` | (A random long string) | Used to secure user login tokens. |
| `NODE_ENV` | `production` | Tells the app to run in high-performance mode. |
| `VITE_API_BASE` | `/api` | Tells the frontend to talk to the backend relatively. |
| `PORT` | `3001` | Matches the `EXPOSE` port in your Dockerfile. |

## 5. Launch & Verify
1.  Click **Create Web Service**.
2.  Watch the **Logs**. You will see Render building your Docker image.
3.  **The Magic Moment**: In the logs, you should see:
    > `npx prisma db push`
    > `Prisma schema loaded from server/prisma/schema.prisma`
    > `Your database is now in sync with your Prisma schema.`
    > `EduTech Pro Suite running on port 3001`

4.  Once the status turns to **"Live"**, click the URL provided by Render (e.g., `https://edutech-portal.onrender.com`).

---

### 💡 Pro-Tips for Render
*   **Zero Downtime**: Render handles updates seamlessly. When you push new code to GitHub, Render builds a new version and only swaps it once it's healthy.
*   **Health Checks**: If the site shows a generic error, check the logs for `/api/health` success.
*   **Migrations**: Since we used `npx prisma db push` in the Dockerfile, you don't need to worry about manual database migrations for now.
