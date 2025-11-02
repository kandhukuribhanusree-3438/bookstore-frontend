# Bookstore Frontend

Angular frontend application for Simple Online Bookstore.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Update environment variables:
- Edit `src/environments/environment.prod.ts` with your backend API URL
- For local development, `environment.ts` points to `http://localhost:5000/api`

## Development

Run the development server:
```bash
ng serve
```

Navigate to `http://localhost:4200/`

## Build for Production

Build the application:
```bash
ng build --configuration production
```

Output will be in `dist/bookstore/`

## Deploy to Vercel

1. Build the app: `ng build --configuration production`
2. Push to GitHub
3. Import project on Vercel
4. Set Root Directory: `frontend`
5. Build Command: `npm run build:prod`
6. Output Directory: `dist/bookstore`
7. Add environment variable for API URL

