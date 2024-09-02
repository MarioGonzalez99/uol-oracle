# UoL Oracle Chatbot

## Overview
UoL Oracle is a specialized chatbot application designed to assist University of London Computer Science students by providing quick and accurate answers to questions related to program regulations, course details, and other university-related information. The project uses cutting-edge technologies including Next.js, Supabase, Clerk, and OpenAI's API to deliver a responsive and user-friendly experience.

## Features
- **Authentication**: Secure user authentication with Clerk.
- **Chat Functionality**: Integration with OpenAI's API for natural language processing.
- **Persistent Chat History**: Store and retrieve chat history using Supabase.
- **Theme Toggle**: Switch between light and dark modes.
- **Credit Tracking**: Monitor usage credits with real-time updates.

## Getting Started:
### Prerequisites
- Node.js (v21 or higher)
- npm (v10 or higher)

### Installation
1. Clone the Repository:
```
git clone https://github.com/MarioGonzalez99/uol-oracle.git
cd uol-oracle
```
2. Install Dependencies:
```
npm install
```
3. Create a .env File: In the root directory, create a .env file and add the following key-value pairs:
```
DATABASE_URL=your_supabase_database_url
DIRECT_URL=your_supabase_direct_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-in
CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/chat
CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/chat
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini
```

### Running the Project Locally
1. Start the Development Server:
```
npm run dev
```
The application will be available at **http://localhost:3000**

2. Run Tests: To run the unit tests, use:
```
npm run test
```
