# VocabQuest 🗺️📚

**Interactive Language Learning Journey with Gamified Vocabulary Progression**

VocabQuest is a modern, responsive web application that transforms language learning into an interactive adventure. Users progress through learning stations on a map, complete quizzes, and unlock new areas with gamified learning experiences.

## ✨ Features

- **Interactive Maps**: Explore South Korea through beautiful, interactive maps with learning stations
- **Structured Learning**: Progress through carefully designed stations, each containing 10 essential words
- **Gamified Progress**: Unlock new areas by completing quizzes and achieving 80%+ scores
- **Child-Friendly Design**: Colorful characters, engaging animations, and accessible UI
- **Multi-Media Learning**: Images, audio pronunciation, and example sentences for each word
- **Progress Tracking**: Monitor learning progress with detailed analytics
- **Achievement System**: Earn badges and rewards for milestones
- **Responsive Design**: Full mobile support with touch-friendly interactions

## 🏗️ Architecture

### Frontend
- **Next.js 14** with App Router
- **React 18** with TypeScript
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **Zustand** for state management
- **Radix UI** for accessible components

### Backend
- **Next.js API Routes** (can be replaced with NestJS)
- **PostgreSQL** database with Prisma ORM
- **Redis** for caching and sessions
- **MinIO** for local file storage (S3-compatible)

### Infrastructure
- **Docker Compose** for local development
- **PostgreSQL** for production database
- **AWS S3** + CloudFront for production media
- **Vercel/Netlify** for hosting

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Docker and Docker Compose
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd vocab-quest
```

### 2. Environment Setup
```bash
# Copy environment template
cp env.example .env

# Edit .env with your configuration
DATABASE_URL="postgresql://vocab_user:vocab_password@localhost:5432/vocab_quest"
NEXTAUTH_SECRET="your-secret-key-here"
```

### 3. Start with Docker (Recommended)
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Access the application
open http://localhost:3000
```

### 4. Manual Setup (Alternative)
```bash
# Install dependencies
npm install

# Start database
docker-compose up -d postgres redis minio

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:push

# Seed database with Korean vocabulary
npm run db:seed

# Start development server
npm run dev
```

## 📁 Project Structure

```
vocab-quest/
├── app/                          # Next.js 14 App Router
│   ├── (auth)/                   # Authentication routes
│   ├── (dashboard)/              # Protected user area
│   ├── map/                      # Map view routes
│   ├── station/                  # Station learning routes
│   ├── api/                      # API routes
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                    # React components
│   ├── ui/                       # Base UI components
│   ├── game/                     # Game-specific components
│   ├── layout/                   # Layout components
│   └── forms/                    # Form components
├── lib/                          # Utility libraries
│   ├── api.ts                    # API client
│   ├── store.ts                  # Zustand store
│   ├── audio.ts                  # Audio player utilities
│   └── auth.ts                   # Auth configuration
├── prisma/                       # Database
│   ├── schema.prisma             # Database schema
│   ├── migrations/               # Database migrations
│   └── seed.ts                   # Seed data
├── types/                        # TypeScript definitions
├── hooks/                        # Custom React hooks
├── middleware/                    # Next.js middleware
├── tests/                        # Test files
├── docs/                         # Documentation
├── docker-compose.yml            # Docker services
├── Dockerfile.dev                # Development Dockerfile
└── package.json                  # Dependencies
```

## 🎯 Core Components

### 1. MapCanvas
Interactive SVG-based map showing learning journey with:
- Station markers with lock/unlock states
- Character animations between stations
- Touch/click interactions
- Responsive design for all devices

### 2. StationCard
Individual word learning cards featuring:
- Three states: gray (not started), blue (in progress), green (learned)
- Word display with phonetics
- Media integration (image/audio)
- Progress indicators

### 3. QuizPanel
Interactive quiz interface with:
- Multiple question types (MCQ, audio-choice, image-word matching)
- Real-time scoring
- Progress tracking
- Accessibility support

### 4. WordModal
Detailed word learning interface including:
- Large image display
- Audio pronunciation playback
- Example sentences
- "Mark as learned" functionality

## 🗄️ Database Schema

The application uses a comprehensive database schema with the following main entities:

- **User**: Authentication and basic info
- **Profile**: User preferences and display data
- **Language**: Supported languages (Korean, future expansions)
- **Map**: Visual journey maps for each language
- **Station**: Learning checkpoints (10 words each)
- **Word**: Vocabulary items with translations
- **MediaAsset**: Images, audio, video files
- **UserWordProgress**: Individual word learning status
- **StationAttempt**: Quiz attempts and scores
- **Achievement**: Available badges and rewards

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#2563EB) - Main brand color
- **Success**: Green (#10B981) - Completed/learned items
- **Muted**: Gray (#E5E7EB) - Not started items
- **Background**: Light (#F8FAFC) - Main background

### Typography
- **Headers**: Noto Sans KR Bold (Korean text)
- **Body**: Heebo Regular (Hebrew/English text)
- **Responsive**: Fluid typography with clamp()

### Components
- **Cards**: Rounded corners (16px), soft shadows
- **Buttons**: Hover effects, focus states
- **Animations**: Framer Motion with reduced motion support
- **Spacing**: 8px grid system (8, 16, 24, 32, 48, 64)

## 🔧 Development

### Available Scripts
```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:generate     # Generate Prisma client
npm run db:push         # Push schema to database
npm run db:seed         # Seed database with data
npm run db:studio       # Open Prisma Studio

# Testing
npm run test            # Run tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Generate coverage report

# Linting
npm run lint            # Run ESLint
npm run type-check      # Run TypeScript check
```

### Code Quality
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **TypeScript**: Type safety and IntelliSense
- **Husky**: Git hooks for quality checks

### Testing Strategy
- **Unit Tests**: Component and utility testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: User journey testing
- **Accessibility Tests**: WCAG compliance

## 🚀 Deployment

### Production Build
```bash
# Build the application
npm run build

# Start production server
npm run start
```

### Environment Variables
```bash
# Required
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="https://yourdomain.com"

# Optional
POSTHOG_API_KEY="..."
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
```

### Deployment Platforms
- **Vercel**: Recommended for Next.js
- **Netlify**: Alternative hosting
- **AWS**: Full control with S3 + CloudFront
- **DigitalOcean**: App Platform deployment

## 📱 Mobile & Accessibility

### Mobile Support
- **Responsive Design**: Mobile-first approach
- **Touch Interactions**: Optimized for touch devices
- **Progressive Web App**: Installable on mobile
- **Offline Support**: Service worker for offline learning

### Accessibility (WCAG AA)
- **Screen Reader**: ARIA labels and semantic HTML
- **Keyboard Navigation**: Full keyboard support
- **Color Contrast**: High contrast ratios
- **Focus Management**: Clear focus indicators
- **Reduced Motion**: Respects user preferences

## 🌍 Internationalization

### Current Support
- **Korean**: Primary language with Hebrew translations
- **Hebrew**: RTL support for translations
- **English**: UI language and translations

### Future Languages
- **Japanese**: Japanese map and vocabulary
- **Chinese**: Chinese map and vocabulary
- **Spanish**: Spanish map and vocabulary

## 📊 Analytics & Monitoring

### Learning Analytics
- **Progress Tracking**: Word completion rates
- **Quiz Performance**: Score analytics
- **Time Spent**: Learning session duration
- **User Engagement**: Feature usage patterns

### Technical Monitoring
- **Performance**: Lighthouse scores
- **Error Tracking**: Sentry integration
- **User Experience**: Real User Monitoring
- **Feature Flags**: LaunchDarkly integration

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Code Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Consistent formatting
- **Conventional Commits**: Standard commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Korean Language**: Native speakers for pronunciation
- **Design Inspiration**: Modern educational apps
- **Open Source**: Community libraries and tools
- **Accessibility**: WCAG guidelines and best practices

## 📞 Support

- **Documentation**: [docs.vocabquest.com](https://docs.vocabquest.com)
- **Issues**: [GitHub Issues](https://github.com/vocabquest/issues)
- **Discussions**: [GitHub Discussions](https://github.com/vocabquest/discussions)
- **Email**: support@vocabquest.com

---

**Made with ❤️ for language learners everywhere**

*VocabQuest - Where learning becomes an adventure*
