# Job AI – Smart Job Recommendations

A beautiful, production-ready SaaS platform that uses AI to analyze resumes and match candidates with the perfect job opportunities.

## Features

- 📄 **Resume Upload**: Drag-and-drop PDF/DOCX resume upload
- 🤖 **AI-Powered Analysis**: Extracts skills, tech stack, experience level, and keywords
- 🎯 **Smart Matching**: Semantic matching using LLMs to score job relevance
- 🎨 **Beautiful UI**: Premium design with glassmorphic effects, smooth animations, and modern gradients
- ⚡ **Fast Results**: Get personalized job recommendations in seconds

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Framer Motion** (animations)
- **UploadThing** (file uploads)
- **AI APIs**: Groq (default), OpenAI, or Google Gemini

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# At least one AI API key is required
GROQ_API_KEY=your_groq_api_key_here
# OR
OPENAI_API_KEY=your_openai_api_key_here
# OR
GOOGLE_API_KEY=your_google_api_key_here

# Optional: UploadThing (for file uploads)
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

1. **Upload Resume**: Users upload their resume (PDF or DOCX)
2. **Text Extraction**: The system extracts text from the resume
3. **AI Analysis**: An LLM analyzes the resume and extracts:
   - Skills
   - Tech stack
   - Experience level
   - Roles
   - Summary
   - Keywords
4. **Job Matching**: Each job in the dataset is scored using semantic matching
5. **Results Display**: Jobs are displayed sorted by relevance score

## Project Structure

```
├── app/
│   ├── api/uploadthing/    # UploadThing API routes
│   ├── upload/              # Resume upload page
│   ├── results/             # Job matches results page
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── ResumeUploader.tsx   # Resume upload component
│   ├── JobCard.tsx          # Job card component
│   └── ResultsList.tsx      # Results list component
├── lib/
│   ├── ai.ts                # AI API wrappers
│   ├── parser.ts            # Resume text extraction
│   └── match.ts             # Job matching logic
└── data/
    └── jobs.json            # Job dataset (35 jobs)
```

## API Keys

### Required: AI Provider (Choose One)
- **Groq** (Recommended): Fast and free tier available - https://console.groq.com
- **OpenAI**: Uses GPT-4o-mini - https://platform.openai.com
- **Google Gemini**: Uses Gemini Pro - https://makersuite.google.com/app/apikey

### Optional: Job APIs (For Real Job Listings)
- **JSearch API** (Recommended for India): Get from RapidAPI - https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
- **Adzuna API**: Alternative job API - https://developer.adzuna.com/

### OpenAI
- Uses GPT-4o-mini
- Get your key at: https://platform.openai.com

### Google Gemini
- Uses Gemini Pro
- Get your key at: https://makersuite.google.com/app/apikey

## Customization

- **Job Dataset**: Edit `/data/jobs.json` to add/modify job listings
- **AI Prompts**: Modify prompts in `/lib/ai.ts` and `/lib/match.ts`
- **Styling**: Customize colors in `app/globals.css` and `tailwind.config.ts`

## Production Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy to Vercel, Netlify, or your preferred platform

3. Set environment variables in your deployment platform

## License

MIT

