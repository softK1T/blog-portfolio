# Portfolio & Blog Website

A professional portfolio and blog website built with Next.js, Firebase, and AWS S3. Features a clean design for showcasing projects and sharing development insights, perfect for HR professionals and potential employers.

## ✨ Features

- **Portfolio Showcase**: Display your projects with descriptions, technologies, and links
- **Development Blog**: Share your development process and technical insights
- **Development Logs**: Track your project development progress with detailed logs
- **Admin Panel**: Secure admin interface for managing content (Firebase Auth)
- **File Uploads**: AWS S3 integration for media uploads
- **Responsive Design**: Modern UI that works on all devices
- **Real-time Data**: Firebase Firestore for dynamic content management

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Firebase project
- AWS S3 bucket

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration (required)
NEXT_PUBLIC_FIREBASE_APIKEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTHDOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECTID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGEBUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID=your_messaging_sender_id
NEXT_PUBLIC_APP_ID=your_app_id
NEXT_PUBLIC_MEASUREMENTID=your_measurement_id

# AWS S3 Configuration (required for file uploads)
ENDPOINT=us-east-1
ACCESS_KEY_ID=your_aws_access_key
SECRET_ACCESS_KEY=your_aws_secret_key
BUCKET_NAME=your_s3_bucket_name

# Admin Configuration (required for admin access)
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
```

### Setup Steps

1. **Firebase Setup**:

   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create Firestore database
   - Get your project configuration and add to `.env.local`

2. **AWS S3 Setup**:

   - Create S3 bucket in your preferred region
   - Create IAM user with S3 access permissions
   - Generate access keys and add to `.env.local`

3. **Install and Run**:

```bash
# Clone and install
git clone <your-repo-url>
cd portfolio-blog
npm install

# Start development server
npm run dev
```

4. **Create Admin User**:
   - Set `NEXT_PUBLIC_ADMIN_EMAIL` in `.env.local`
   - Sign up with that email to get admin access
   - Use the admin panel to add your portfolio projects and blog posts

Visit `http://localhost:3000` to see your portfolio!

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── blog/              # Blog pages
│   ├── portfolio/         # Portfolio pages
│   └── context/           # React context
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   └── Navigation.tsx    # Main navigation
├── lib/                  # Utilities and services
│   ├── firebase.ts       # Firebase configuration
│   ├── s3.ts            # AWS S3 utilities
│   └── services.ts      # Data services
└── types/               # TypeScript type definitions
```

## 🎯 Usage

### Admin Panel (Full Setup)

1. Sign in at `/auth/signin` with your admin email
2. Access the admin panel at `/admin`
3. Add/edit portfolio projects and blog posts
4. Upload images using the S3 integration

### Portfolio Management

- Add projects with title, description, technologies
- Include GitHub and live demo links
- Upload project images
- Mark projects as featured or published

### Blog Management

- Create blog posts with title, content, and summary
- Add tags for categorization
- Upload featured images
- Publish or save as drafts

## 🎨 Customization

### Personal Information

Edit the hero section in `src/app/page.tsx`:

- Replace `[Your Name]` with your actual name
- Update the title and description
- Change the email and social media links

### Sample Data

Modify the sample data in `src/lib/services.ts`:

- Update portfolio projects with your actual work
- Change blog posts to reflect your expertise
- Customize technologies and skills

### Styling

- Modify `src/app/globals.css` for custom styles
- Update Tailwind configuration in `tailwind.config.js`
- Customize shadcn/ui components in `src/components/ui/`

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard (optional)
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform

## 💡 Demo Features

The application includes:

- **3 Sample Projects**: E-commerce platform, task manager, weather dashboard
- **2 Sample Blog Posts**: Next.js development, full-stack trends
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean, professional design with smooth animations
- **Admin Interface**: Ready for content management (when Firebase is configured)

## 🔒 Security

- Admin authentication with Firebase Auth
- Environment variable protection
- Input validation and sanitization
- Secure file uploads with S3

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🎯 Portfolio Value

This project demonstrates:

- Modern React patterns with hooks and context
- Next.js App Router and API routes
- Firebase integration (Auth + Firestore)
- AWS S3 file upload
- TypeScript for type safety
- Responsive design with Tailwind CSS
- Component-based architecture
- Clean code organization
- Real-world application structure
- Graceful fallbacks and error handling

Perfect for showcasing your full-stack development skills!
