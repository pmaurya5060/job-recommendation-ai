# Quick Setup Guide

## 1. Install Dependencies

```bash
npm install
```

## 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# At least one AI API key is required
GROQ_API_KEY=your_groq_api_key_here
# OR
OPENAI_API_KEY=your_openai_api_key_here
# OR
GOOGLE_API_KEY=your_google_api_key_here
```

### Getting API Keys:

- **Groq** (Recommended - Fast & Free): https://console.groq.com
- **OpenAI**: https://platform.openai.com
- **Google Gemini**: https://makersuite.google.com/app/apikey

## 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 4. Test the Application

1. Go to `/upload` page
2. Either:
   - Upload a PDF or DOCX resume, OR
   - Click "Try with Sample Resume" to test without uploading
3. Wait for processing (extraction → analysis → matching)
4. View results on `/results` page

## Notes

- The app processes files directly (no UploadThing required for basic functionality)
- UploadThing is configured if you want to add file storage later
- Job dataset is in `/data/jobs.json` - you can modify it
- All AI calls are server-side for security

## Troubleshooting

- **"No AI provider configured"**: Make sure at least one API key is set in `.env.local`
- **File upload errors**: Ensure file is PDF or DOCX, under 4MB
- **TypeScript errors**: Run `npm install` to ensure all types are installed

