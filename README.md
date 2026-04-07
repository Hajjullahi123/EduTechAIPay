# 🎒 FinSchool Standalone Payment Suite

I have successfully transformed the original server-side fee management logic into a **high-end, standalone desktop application**. This suite is designed for independent school use with a local-first, premium-user-experience approach.

---

## 💎 Design Philosophy & Core Features

The application now features a **Glassmorphic Obsidian** theme with high-end micro-animations and real-time financial monitoring. 

### 🌟 Key Transformations:

1.  **Native Desktop Experience**: Wrapped in **Electron**, the app runs as a dedicated desktop tool with its own lifecycle and local background process.
2.  **Zero-Configuration Database**: Uses a local **SQLite** ledger managed by **Prisma**. No external database servers are required—all financial data is stored securely and locally on the machine.
3.  **Ported Financial Logic**: Successfully migrated the complex `payment.js` logic (Arrears calculation, Scholarship overrides, Exam clearance gating) into a local background task.
4.  **Premium Dashboard**: Real-time analytics view showing "Total Revenue," "Expected Fees," "Outstanding Debt," and "Exam Clearance Status."
5.  **Secure Ledger Management**: A dedicated student ledger table with live search and a modal-driven payment recording system.

---

## 🚀 Quick Setup Instructions

1.  **Install Base Dependencies**:
    ```powershell
    npm install
    ```
2.  **Initialise the Standalone Ledger**:
    Run the setup file I created to prepare the database and seed it with demo data:
    ```powershell
    .\setup-standalone.bat
    ```
3.  **Start Development Mode**:
    This will launch both the background engine and the desktop window:
    ```powershell
    npm run electron:dev
    ```

---

> [!TIP]
> **Standalone Mode**: This app stores all data in `server/prisma/dev.db`. You can backup this single file to secure your entire school's financial record.
