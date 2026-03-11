# FeedbackOS

FeedbackOS is an AI-powered product feedback analysis tool built on Cloudflare's platform. It aggregates user feedback and automatically categorizes it using AI to provide actionable sentiment and theme insights.

### Tech Stack
- **Hono**: Web framework for the API and frontend
- **Cloudflare D1**: SQL database for storing feedback
- **Cloudflare Workers AI**: AI models for extracting sentiment and themes (LLaMA 3) and generating embeddings
- **Cloudflare Vectorize**: Vector database for semantic search

---

## Running Locally

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the local server**
   ```bash
   npm run dev
   ```
   *(Note: This requires an internet connection, as it connects to a remote Vectorize index for semantic search).*

3. **View the dashboard**
   Open `http://localhost:8787` in your browser. Click **Seed Demo Data** to populate the database with sample feedback.
