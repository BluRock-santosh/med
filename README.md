# Medication Reminder App

A minimal, professional medication reminder app built with React, TypeScript, Vite, Zustand, Firebase, shadcn/ui, and Tailwind CSS. The app helps patients remember to take their medications and notifies caretakers if a dose is missed.

## Features

- **Authentication:** Secure signup/login with Firebase Auth
- **Role-based Access:** Patient and Caretaker roles (single account per household)
- **Medication Management:**
  - Caretaker: Add, edit, delete medications
  - Patient: Mark medications as taken for today
- **Dashboard:**
  - Medication stats (total, taken, not taken)
  - Responsive design for mobile & desktop
- **Notifications:**
  - Real-time reminders for missed medications
  - Caretaker sees alerts if patient misses a dose
- **Modern UI:**
  - Clean, accessible, and minimal interface using shadcn/ui and Tailwind CSS

## Tech Stack

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) (build tool)
- [Firebase](https://firebase.google.com/) (Auth & Firestore)
- [Zustand](https://zustand-demo.pmnd.rs/) (state management)
- [shadcn/ui](https://ui.shadcn.com/) (UI components)
- [Tailwind CSS](https://tailwindcss.com/) (utility-first CSS)

## Getting Started

1. **Clone the repo:**
   ```bash
   git clone <your-repo-url>
   cd med
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Firebase Setup:**
   - Create a Firebase project (Auth + Firestore enabled)
   - Get your Firebase config, encode it as Base64, and add to a `.env` file:
     ```env
     VITE_FIREBASE_CONFIG_BASE64=eyJhcGlLZXkiOiAiQU..."  # (your base64-encoded config)
     ```
4. **Start the app:**
   ```bash
   npm run dev
   ```

## Folder Structure

```
med/
  src/
    components/      # UI components (Dashboard, MedicationList, etc.)
    store/           # Zustand state management
    firebase/        # Firebase config and logic
    hooks/           # Custom React hooks
    assets/          # Static assets
    App.tsx          # Main app component
    main.tsx         # Entry point
```

## Notes
- All code is minimal, clean, and free of template/AI artifacts.
- Notifications for missed medications are in-app (real-time). For email/SMS.
- Designed for interview/assignment readiness: easy to read, extend, and maintain.

---


