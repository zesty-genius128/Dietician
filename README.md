# Life Smart

A Health & Fitness app supercharged by Gemini AI. Easily log your food and workouts, receive AI-driven personalized exercise routines with proper form guidance, and discover custom recipes tailored to your dietary needs and cuisine preferences.

## Features

*   **Secure User Authentication:** Robust sign-up, login, and logout flow powered by Firebase Authentication.
*   **Personalized User Profile:** Users can set and update their health metrics, fitness level, activity level, dietary restrictions, and cuisine preferences.
*   **Food Logging:** Intuitive interface to log food items with details including date, meal type, food name, calories, protein, carbs, and fat.
*   **Exercise Logging:** Allows users to record their exercise sessions, including date, type, duration, and calories burned.
*   **Interactive Dashboard:** Provides a summary of today's logged calories and exercise duration, along with recent food and exercise log entries.
*   **AI Recipe Suggestions:** Integrates with the Google Gemini API to generate recipe ideas based on the user's profile preferences or custom input.
*   **AI Exercise Guide:** Utilizes the Google Gemini API to provide exercise recommendations tailored to the user's fitness level and target muscle group.

## Technology Stack

*   **Frontend:** React (built with Create React App)
    *   Hooks for state management and side effects.
    *   Component-based architecture for a modular and maintainable codebase.
*   **Styling:** Tailwind CSS
    *   Utility-first CSS framework for rapid UI development and responsive design.
*   **Backend-as-a-Service (BaaS):** Firebase
    *   Authentication: Handles user registration, login, and session management.
    *   Firestore: NoSQL cloud database used for storing user profiles, food logs, and exercise logs.
*   **Artificial Intelligence:** Google Gemini API
    *   Powers the recipe generation and exercise suggestion features based on user input and profile data.

## Project Structure

The core application code resides within the `ai-dietitian-app` directory:

```
ai-dietitian-app/
├── public/             # Public assets (HTML template, favicon, manifest)
├── src/                # Source code
│   ├── components/     # Reusable UI components (Layout, UI elements)
│   │   ├── layout/     # Navbar, Footer
│   │   └── ui/         # LoadingSpinner, Modal
│   ├── contexts/       # React Context for global state (AuthContext)
│   ├── pages/          # Page-level components (Auth, Features, Logging, User)
│   │   ├── auth/       # Login, Signup
│   │   ├── features/   # RecipeSuggestionPage, ExerciseGuidePage
│   │   ├── logging/    # FoodLogPage, ExerciseLogPage
│   │   └── user/       # ProfilePage
│   └── App.js          # Main application component and routing logic
│   └── firebaseInit.js # Firebase initialization and configuration
│   └── index.js        # Entry point of the React application
└── package.json        # Project dependencies and scripts
```

## Setup and Installation

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd Dietician/ai-dietitian-app
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Set up Firebase:**
    *   Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
    *   Add a web app to your Firebase project.
    *   Copy your Firebase configuration object.
    *   Update the `firebaseConfig` object in `src/firebaseInit.js` with your project's configuration.
    *   Enable **Firebase Authentication** (Email/Password and Anonymous sign-in methods).
    *   Enable **Firestore Database**. Start in test mode for simplicity during development.
4.  **Set up Google Gemini API:**
    *   Go to the [Google AI for Developers](https://ai.google.dev/) and get an API key for the Gemini API.
    *   Create a `.env` file in the `ai-dietitian-app` directory (at the same level as `package.json`).
    *   Add your Gemini API key to the `.env` file in the following format:
        ```env
        REACT_APP_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
        ```
        Replace `YOUR_GEMINI_API_KEY` with the key you obtained. *Make sure this file is included in your `.gitignore`* (it is already in the provided `.gitignore`).
5.  **Start the development server:**
    ```