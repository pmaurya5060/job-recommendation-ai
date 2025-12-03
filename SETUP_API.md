# API Setup Guide

## JSearch API Key Setup

You've added your API key to `.env.local`. Here's what to do next:

### 1. Verify Your .env.local File

Make sure your `.env.local` file in the root directory contains:

```env
JSEARCH_API_KEY=ak_bg92jubuxerd229jrw52zbu5fgak7fhzecua12j2mot0q5x
```

**Note:** The key format you provided (`ak_...`) looks like it might be from Adzuna API. If you're using JSearch from RapidAPI, the key format is different (usually longer, alphanumeric).

### 2. Restart Your Dev Server

**Important:** Environment variables are only loaded when the server starts. You must restart:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### 3. Test the Integration

1. Go to `/upload` page
2. Upload a resume or click "Try Sample Resume"
3. The app will:
   - Extract your skills
   - Fetch real jobs from India using your API key
   - Match them with AI

### 4. Check the Console

If there are any API errors, check:
- Browser console (F12)
- Terminal/Server logs

### 5. If Using Adzuna Instead

If your key is actually from Adzuna, update `.env.local`:

```env
ADZUNA_APP_ID=your_app_id
ADZUNA_APP_KEY=ak_bg92jubuxerd229jrw52zbu5fgak7fhzecua12j2mot0q5x
```

### Troubleshooting

- **"API key not found"**: Make sure `.env.local` exists in the root directory
- **"JSearch API error"**: Check if the key is valid and has proper permissions
- **No jobs returned**: The API might be rate-limited or the query didn't match any jobs
- **Still seeing mock data**: The API call failed, so it's using fallback data

### Getting a JSearch API Key (RapidAPI)

If you need a JSearch API key:
1. Go to https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
2. Subscribe to the API
3. Copy your RapidAPI key (starts with a long alphanumeric string)
4. Add it to `.env.local` as `JSEARCH_API_KEY`

