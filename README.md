# Apollo - Marketplace Platform

Apollo is a modern marketplace platform built with Next.js that connects service providers with clients through opportunities, proposals, and reviews. The platform features user onboarding, profile management, opportunity creation, and a comprehensive review system.

## 🚀 Technologies Used

### Core Framework

- **Next.js 13+** - React framework with App Router and API routes
- **TypeScript** - Strict typing throughout the application
- **React 18** - Modern React with hooks and functional components

### Database & Authentication

- **MongoDB** - Primary database with Mongoose ODM
- **NextAuth.js** - Authentication with custom providers
- **JWT** - Session management and token-based auth

### Styling & UI

- **Tailwind CSS** - Utility-first CSS framework (mobile-first approach)
- **Chakra UI** - Component library for consistent UI patterns
- **Custom Fonts** - Agrandir font family for branding

### Additional Libraries

- **SWR** - Data fetching and caching
- **Cloudinary** - Image upload and management
- **React Hook Form** - Form handling and validation

## 📁 Project Structure

```
src/
├── app/                    # Next.js 13+ App Router pages
├── components/             # Reusable UI components
│   ├── common/            # Shared utility components
│   ├── form/              # Custom form components
│   ├── onboardingSteps/   # Multi-step onboarding flow
│   ├── opportunities/     # Opportunity-related components
│   ├── profile/           # User profile components
│   └── sections/          # Page section components
├── constants/             # Application constants
├── context/              # React Context providers
├── hooks/                # Custom React hooks
├── lib/                  # Configuration and utilities
├── models/               # Database models and schemas
├── pages/                # Next.js pages (legacy structure)
│   └── api/              # API route handlers
├── services/             # External service integrations
├── styles/               # Global styles and CSS
├── theme/                # Chakra UI theme configuration
├── types/                # TypeScript type definitions
└── utils/                # Helper functions and utilities
```

## 🏗️ Core Features & Use Cases

### 1. User Management

- **Onboarding Flow**: Multi-step user registration with type selection
- **Profile Management**: Detailed profiles with portfolios and contact info
- **Authentication**: Secure login/signup with NextAuth.js

### 2. Opportunity System

- **Create Opportunities**: Clients post job opportunities with requirements
- **Browse Opportunities**: Service providers find relevant work
- **Proposal Submission**: Workers submit proposals for opportunities
- **Status Management**: Track opportunity lifecycle (open, in progress, closed)

### 3. Review & Rating System

- **User Reviews**: Comprehensive rating system for completed work
- **Review Statistics**: Aggregate ratings and performance metrics
- **Detailed Feedback**: Written reviews with star ratings

### 4. Marketplace Features

- **Worker Discovery**: Browse and filter service providers
- **Category System**: Organized service categories
- **Portfolio Showcase**: Visual work samples and case studies

## 🛠️ Code Conventions

### File Naming

- **Components**: PascalCase (`UserProfile.tsx`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Constants**: SCREAMING_SNAKE_CASE (`API_ENDPOINTS`)
- **Types**: PascalCase with descriptive names (`OpportunityStatus`)

### Component Architecture

```typescript
// Component structure pattern
import React from 'react';
import { ComponentProps } from './types';

interface Props {
  // Explicit prop typing
}

export const ComponentName: React.FC<Props> = ({ prop1, prop2 }) => {
  // Component logic
  return (
    <div>
      {/* JSX */}
    </div>
  );
};
```

### Import Organization

```typescript
// 1. React imports
import React from 'react';

// 2. Third-party libraries
import { NextPage } from 'next';
import { Button } from '@chakra-ui/react';

// 3. Internal components
import { Layout } from 'components/Layout';

// 4. Types and utilities
import { User } from 'types/user';
import { formatDate } from 'utils/helpers';
```

### State Management

- **Local State**: `useState` for component-specific state
- **Global State**: Context API for app-wide state (OnboardingContext)
- **Server State**: SWR for API data fetching and caching

## 🗄️ Database Schema

### Key Collections

- **Users**: User profiles, credentials, and metadata
- **Opportunities**: Job postings with requirements and status
- **Proposals**: Worker submissions for opportunities
- **Reviews**: User ratings and feedback
- **Categories**: Service classification system

### Data Relationships

- Users can create multiple Opportunities
- Opportunities receive multiple Proposals
- Completed work generates Reviews
- Users have Categories for service classification

## 🔧 API Structure

### Authentication Routes

- `POST /api/auth/signup` - User registration
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js handlers

### Core Entity Routes

- `GET/POST /api/opportunities` - Opportunity CRUD
- `GET/POST /api/proposals` - Proposal management
- `GET/POST /api/reviews` - Review system
- `GET /api/users` - User data retrieval

### Utility Routes

- `GET /api/catalogs/categories` - Service categories
- `POST /api/cloudinary` - Image upload handling

## 🎨 Styling Guidelines

### Tailwind CSS Approach

- **Mobile-first**: All designs start with mobile breakpoints
- **Utility Classes**: Prefer Tailwind utilities over custom CSS
- **Component Variants**: Use Tailwind for component state variations
- **Custom Theme**: Extended Tailwind config in `tailwind.config.ts`

### Chakra UI Integration

- **Form Components**: Custom form elements extending Chakra base
- **Layout Components**: Consistent spacing and typography
- **Theme Configuration**: Custom colors and fonts in `/src/theme/`

## 🚦 Development Workflow

### Setup

```bash
npm install
cp .env.example .env.local  # Configure environment variables
npm run dev                 # Start development server
```

### Environment Variables

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret
MONGODB_URI=mongodb://localhost:27017/apollo
CLOUDINARY_CLOUD_NAME=your-cloud-name
```

### Key Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run type-check` - TypeScript validation
- `npm run lint` - ESLint checking

## 🔒 Security Considerations

- **Input Validation**: All user inputs validated on client and server
- **Authentication**: Protected routes and API endpoints
- **Data Sanitization**: MongoDB injection prevention
- **Environment Variables**: Sensitive data in environment configuration

## 📱 Responsive Design

- **Mobile-first**: Primary development target is mobile devices
- **Breakpoint Strategy**: Tailwind CSS responsive utilities
- **Touch-friendly**: Optimized for mobile interactions
- **Progressive Enhancement**: Desktop features enhance mobile base

This marketplace platform demonstrates modern full-stack development with TypeScript, combining powerful backend capabilities with a polished user experience.
