# SuiFest Card Generator

A Next.js application that allows users to authenticate with X (Twitter) and generate personalized card templates as PNG images.

## Features

- **X (Twitter) Authentication**: Secure login using OAuth 2.0
- **Template Selection**: Choose from various pre-designed card templates
- **Personalized Cards**: Templates automatically populate with user's name and X username
- **PNG Export**: Generate and download cards as high-quality PNG images
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## How It Works

1. **Login**: Users authenticate with their X (Twitter) account
2. **Profile Data**: System retrieves user's name, username, and avatar
3. **Template Selection**: Users browse and select from available card templates
4. **Customization**: Templates are automatically populated with user information
5. **Generation**: Convert the customized template to a downloadable PNG image

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm package manager
- X (Twitter) Developer Account with OAuth 2.0 credentials

### Installation

1. **Windows users only**: Configure git line endings

   ```bash
   git config --global core.eol lf
   git config --global core.autocrlf input
   ```

2. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd SuiFest-Card
   ```

3. **Install pnpm globally** (if not already installed)

   ```bash
   npm install -g pnpm
   ```

4. **Install dependencies**

   ```bash
   pnpm install
   ```

5. **Environment Setup**
   - Copy `.env.example` to `.env.local`
   - Add your X (Twitter) OAuth credentials:
     ```env
     TWITTER_CLIENT_ID="your-twitter-client-id"
     TWITTER_CLIENT_SECRET="your-twitter-client-secret"
     NEXTAUTH_SECRET="your-nextauth-secret"
     NEXTAUTH_URL="http://localhost:3000"
     ```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Authentication**: NextAuth.js with X (Twitter) Provider
- **Styling**: Tailwind CSS
- **Image Generation**: HTML Canvas to PNG conversion
- **TypeScript**: Full type safety

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
│   └── auth/           # Authentication components
├── api/                # API utilities and clients
├── hooks/              # Custom React hooks
└── types/              # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
