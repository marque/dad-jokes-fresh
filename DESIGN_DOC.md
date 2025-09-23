# Daily.Jokes - Design Document

## Project Overview

A minimalist daily dad jokes website with AI-generated cartoon images. Users can view today's joke, browse previous days, or see random jokes from the available collection.

## Core Requirements

### Functional Requirements

**Content Management**
- Pre-written dad jokes from existing online database
- 90 days (3 months) worth of content at any time
- Batch generation of 7 additional days when needed
- One joke per day, based on Eastern Time Zone
- Family-friendly content only

**Image Generation**
- Cartoon images generated with Google Imagen 3 based on joke content
- Images pre-generated and stored on Google Cloud Storage
- Cartoony, funny, cutesy art style
- Generic placeholder for failed generations

**User Interface**
- Single-page application (no page reloads)
- Mobile-first responsive design
- Minimalist, clean aesthetic with casual tone
- Three main navigation options:
  1. "Today" button (default view)
  2. "Previous Day" button (stops at oldest available content)
  3. "Random Day" button (shows unseen jokes when possible)

### Non-Functional Requirements

**Performance**
- Fast loading (images pre-cached)
- Responsive on both mobile and desktop
- Minimal loading states due to pre-generated content

**Technical**
- JSON file for data storage
- Deployed on Vercel
- Domain: haha.joke.com
- Eastern Time Zone for "today" determination

## System Architecture

### Data Structure

```json
{
  "jokes": [
    {
      "id": "2025-09-23",
      "date": "2025-09-23",
      "joke": "Why don't scientists trust atoms? Because they make up everything!",
      "imageUrl": "https://storage.googleapis.com/daily-jokes/2025-09-23.png",
      "category": "general"
    }
  ],
  "metadata": {
    "lastUpdated": "2025-09-23T00:00:00-04:00",
    "totalJokes": 90,
    "timezone": "America/Toronto"
  }
}
```

### Component Architecture

```
App
├── Header (Logo/Title)
├── JokeDisplay
│   ├── JokeImage (Google Cloud hosted)
│   ├── JokeText
│   └── DateIndicator
├── Navigation
│   ├── TodayButton
│   ├── PreviousDayButton
│   └── RandomDayButton
└── Footer (minimal)
```

### User State Management

**Browser LocalStorage:**
- `viewedJokes`: Array of joke IDs user has seen
- `currentJokeId`: Currently displayed joke
- `userTimezone`: For "today" calculation

### Image Generation Workflow

1. **Batch Process** (Manual trigger for now)
   - Select next 7 days worth of jokes from database
   - Generate Imagen 3 prompts: "Cartoon illustration of: [joke content], cute and funny style"
   - Generate images via Google Cloud AI API
   - Upload to Google Cloud Storage
   - Update JSON with new entries

2. **Image Serving**
   - Direct links to Google Cloud Storage
   - Images optimized for web (WebP format, ~800px max width)
   - Fallback to placeholder.png for failed generations

## User Experience Flow

### First Visit
1. User lands on haha.joke.com
2. Displays today's joke (Eastern Time)
3. Loads joke text + pre-generated image
4. Shows three navigation buttons

### Navigation Patterns
- **Today Button**: Jump to current day's joke
- **Previous Day**: Go back one day from current view
- **Random Day**: Show random joke from available collection, preferring unseen ones

### Edge Cases
- No content for today → Show latest available joke with note
- Network issues → Show cached content with error message
- Image load failure → Display placeholder with retry option

## Technical Implementation

### Frontend Stack
- **Framework**: Next.js (for Vercel optimization)
- **Styling**: Tailwind CSS (mobile-first)
- **State**: React Context + LocalStorage
- **Images**: Next.js Image component with Google Cloud CDN

### Backend/Data
- **Storage**: Static JSON file in public directory
- **Updates**: Manual batch generation scripts
- **Hosting**: Vercel static deployment

### External Services
- **Google Cloud AI Platform**: Imagen 3 for image generation
- **Google Cloud Storage**: Image hosting and CDN
- **Dad Jokes API**: Initial content source (to be researched)

## Content Strategy

### Initial Setup
- Source 90 high-quality dad jokes from existing database
- Generate initial batch of images
- Set up rolling 7-day generation reminder system

### Ongoing Maintenance
- Weekly batch generation of 7 new days
- Monthly review of joke quality and user feedback
- Quarterly expansion of content categories (future)

## Success Metrics

### Phase 1 (MVP)
- Fast page load times (<2 seconds)
- Mobile responsiveness across devices
- Successful daily content delivery
- User engagement with all three navigation options

### Future Considerations
- User analytics and favorite jokes
- Social sharing functionality
- Content categories and filtering
- User-submitted jokes moderation system

## Risk Mitigation

**Content Risks**
- Inappropriate jokes → Manual review process
- Copyright issues → Use only public domain or original content

**Technical Risks**
- Image generation failures → Robust placeholder system
- API rate limits → Batch processing with delays
- Storage costs → Monitor usage and optimize image sizes

**Operational Risks**
- Manual batch generation → Set calendar reminders
- Domain/hosting issues → Vercel reliability + backup plans

## Future Roadmap

### Phase 2
- Categories (food jokes, science jokes, etc.)
- User preferences and favorites
- Social sharing with custom preview images

### Phase 3
- User submissions and moderation
- Voting system for joke quality
- Analytics dashboard for content performance

---

*Document Version: 1.0*
*Last Updated: September 23, 2025*
*Owner: Mark Wang*