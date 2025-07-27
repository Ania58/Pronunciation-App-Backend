# SayRight Backend (Pronunciation Server)

The backend for **SayRight**, a full-featured English pronunciation learning platform that helps users improve their spoken English using real-time feedback, intelligent scoring, and AI-generated suggestions.

---

## 🌐 Overview

This Node.js + TypeScript backend serves as the core API for the SayRight app. It enables:

- 🔍 Word exploration with IPA transcriptions and categories
- 🎤 User pronunciation submission and intelligent feedback (via GPT + AssemblyAI)
- 🧠 Custom word tracking (mastered/practice status)
- 📊 Attempt tracking with daily limits
- 🔐 Secure authentication using Firebase
- 📬 Contact form via email

---

## 📁 Project Structure

```plaintext
src/
├── config/             # Database and cloud setup
├── controllers/        # Main logic (words, pronunciation, user, etc.)
├── data/               # Word lists and CMU dictionary
├── middleware/         # Auth middlewares
├── models/             # Mongoose models
├── routes/             # API routes
├── services/           # GPT feedback service
├── tools/              # Scripts for preprocessing data
├── types/              # Custom TypeScript types
├── utils/              # Firebase & scoring logic
└── index.ts            # App entry point

```



---

## 🚀 Features

### 📚 Word Management

- `GET /words`  
  Browse a curated list with pagination, filters, and search.

- `GET /words/all`  
  Explore the full dataset of 135,000+ English words.

- `GET /words/id/:id`  
  Get word details and audio via external API.

- `GET /words/:word`  
  Search by word string.

- `GET /words/random`  
  Returns a random word.

---

### 🔊 Pronunciation Attempts

- `POST /pronunciation/:id`  
  Submit a pronunciation attempt (score + feedback optional).  
  🔐 Requires Firebase Auth. Limit: 20/day.

- `GET /pronunciation/:id/attempts`  
  Get all attempts for a specific word (by ID).  

- `GET /pronunciation/user/attempts`  
  Get all attempts by the current user.  

- `PATCH /pronunciation/:id/feedback`  
  Update score or feedback.  

- `DELETE /pronunciation/:id`  
  Delete attempt and associated audio (Cloudinary).  

- `POST /pronunciation/:id/transcribe`  
  Transcribe submitted audio and receive GPT feedback + pronunciation score.

---

### ✅ Word Status Tracking

- `POST /words/:id/status`  
  Mark a word as `mastered` or `practice`.

- `GET /words/statuses`  
  Get all word statuses for the authenticated user.

- `DELETE /words/:id/status`  
  Remove a saved word status.

---

### 🔐 Authentication & User

- `DELETE /account/delete`  
  Deletes the user's account, attempts, statuses, and audio files.  
  🔐 Requires Firebase Auth.

---

### 📬 Contact Form

- `POST /contact`  
  Sends email from the website contact form to the site admin via Gmail SMTP.
---

## 🔧 Tech Stack

- **Node.js** + **Express**
- **TypeScript**
- **MongoDB** + Mongoose
- **Firebase Auth (Admin SDK)**
- **Cloudinary** – for audio file hosting
- **AssemblyAI** – for speech-to-text transcription
- **Feedback** is generated using a lightweight local LLM optimized for instruction-following tasks, ensuring privacy and speed without external API costs.
- **Nodemailer** – for contact form
- **dotenv** – for managing secrets

---

## 🔐 Environment Variables

Create a `.env` file with the following:

```env
PORT=3001
MONGO_URI=your_mongodb_connection
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
EMAIL_TO=your_destination_email

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...

ASSEMBLYAI_API_KEY=your_assemblyai_key
OPENAI_API_KEY=your_openai_key
