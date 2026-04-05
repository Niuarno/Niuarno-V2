# 🎯 Futuristic Animated Portfolio + Client System

A premium, production-ready portfolio website with integrated real-time chat, client dashboard, and admin panel. Built with Next.js, Supabase, and cutting-edge animations.

## ✨ Features

### 🎨 Frontend
- **3D Hero Section** with Three.js interactive elements
- **Glassmorphism Design** with soft neon glow accents
- **Smooth Animations** using Framer Motion and GSAP
- **Fully Responsive** mobile-first design
- **SEO Optimized** with proper meta tags and semantic HTML

### 💬 Real-Time Communication
- **WebSocket-based Chat** system using Supabase Realtime
- **Auto-create Accounts** - no signup required for clients
- **Message History** with persistent storage
- **Typing Indicators** and notifications

### 📊 Client System
- **Client Dashboard** with project overview
- **File Upload System** with cloud storage
- **Message Management** with admin
- **Project Tracking** and status updates
- **File Download** and sharing capabilities

### 🧑‍💼 Admin Panel
- **Client Management** view all registered clients
- **Message Interface** respond to client inquiries
- **File Downloads** access client uploaded files
- **Real-Time Analytics** and visitor tracking
- **Dynamic Content Management** edit site content

### 📈 Analytics Dashboard
- **Real-Time Visitor Tracking** (requires analytics setup)
- **Device Type Distribution**
- **Geographic Data** (country tracking)
- **Visitor Timeline** and trends

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **3D**: Three.js, React Three Fiber
- **Backend**: Supabase (PostgreSQL, Realtime)
- **Authentication**: Supabase Auth (Magic Link)
- **Storage**: Supabase Storage (file uploads)
- **Hosting**: Vercel (production ready)
- **Version Control**: Git/GitHub

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (free tier available)
- Vercel account (for deployment)

### 1. Clone Repository
```bash
cd portfolio
npm install
```

### 2. Configure Supabase

#### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your `Project URL` and `Anon Key`

#### Create Database Tables
1. Go to SQL Editor in Supabase
2. Copy and paste the contents of `SUPABASE_SCHEMA.sql`
3. Execute all queries

#### Set Up Storage Bucket
1. Go to Storage in Supabase
2. Create a new bucket named `client-uploads`
3. Set the following policies:
   - **Upload**: Allow authenticated users
   - **Download**: Allow authenticated users

### 3. Configure Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_EMAIL=your-admin@email.com
NEXT_PUBLIC_CONTACT_EMAIL=contact@your-portfolio.com
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
portfolio/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Homepage with all sections
│   │   ├── layout.tsx               # Root layout
│   │   ├── globals.css              # Global styles
│   │   ├── client-dashboard/        # Client pages
│   │   │   ├── page.tsx
│   │   │   ├── messages/page.tsx
│   │   │   └── files/page.tsx
│   │   └── admin/                   # Admin pages
│   │       ├── page.tsx
│   │       ├── clients/page.tsx
│   │       ├── messages/page.tsx
│   │       └── analytics/page.tsx
│   ├── components/
│   │   ├── sections/
│   │   │   ├── Hero.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Skills.tsx
│   │   │   ├── Portfolio.tsx
│   │   │   ├── Services.tsx
│   │   │   └── Contact.tsx
│   │   ├── ClientDashboardLayout.tsx
│   │   ├── AdminDashboardLayout.tsx
│   │   └── Footer.tsx
│   ├── lib/
│   │   └── supabase.ts              # Supabase client setup
│   └── types/
│       └── database.ts              # TypeScript types
├── public/                          # Static assets
├── .env.local                       # Environment variables
├── SUPABASE_SCHEMA.sql             # Database schema
├── tailwind.config.ts              # Tailwind configuration
└── tsconfig.json                   # TypeScript configuration
```

## 🔐 Security Setup

### Row Level Security (RLS)
The system includes RLS policies for data protection:

- **Clients**: Can only view their own data
- **Messages**: Filtered by client_id
- **Files**: Accessible only by owner

### Admin Authentication
The admin panel checks for a specific admin email defined in `.env.local`:
```env
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
```

### File Upload Validation
- Maximum file size: 50MB
- Allowed types: Images, PDFs, Documents, ZIP files
- Files stored in user-specific folders

## 🎨 Customization

### Update Portfolio Content

Edit `src/components/sections/Portfolio.tsx`:
```typescript
const portfolioProjects = [
  {
    id: 1,
    title: "Your Project",
    description: "Description",
    technologies: ["Tech1", "Tech2"],
    // ... more fields
  }
];
```

### Update Services

Services are loaded from Supabase. Update them via:
1. Go to Supabase > SQL Editor
2. Run: `UPDATE services SET ... WHERE id = '...'`

Or edit `src/components/sections/Services.tsx`

### Change Colors & Theme

Edit `src/app/globals.css`:
```css
:root {
  --primary: #00d4ff;      /* Cyan */
  --secondary: #7c3aed;    /* Purple */
  --accent: #ec4899;       /* Pink */
}
```

## 📊 Analytics Setup

### Google Analytics (Optional)
1. Set up Google Analytics property
2. Add tracking ID to `.env.local`
3. Uncomment Google Analytics script in layout.tsx

### Real-Time Analytics with Supabase
Create a trigger to automatically log page visits:

```sql
CREATE OR REPLACE TRIGGER track_page_visit
AFTER INSERT ON analytics
FOR EACH ROW
EXECUTE FUNCTION update_analytics_summary();
```

## 🚀 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy

```bash
npm run build
# Vercel handles deployment automatically
```

### Production Checklist
- [ ] All environment variables set
- [ ] Supabase RLS policies configured
- [ ] Custom domain configured
- [ ] Email notifications set up
- [ ] Analytics integrated
- [ ] Backup strategy defined

## 🔔 Features in Development

Potential enhancements:
- [ ] Video consultation support
- [ ] Invoice generation
- [ ] Payment processing (Stripe)
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] AI-powered responses

## 📝 API Routes

The system uses Supabase Realtime for real-time updates:

```typescript
// Real-time chat subscription
supabase
  .channel('messages')
  .on('postgres_changes', {...})
  .subscribe()
```

## 🐛 Troubleshooting

### WebSocket Connection Issues
- Check Supabase project status
- Verify network allows WebSocket connections
- Check browser console for errors

### Authentication Issues
- Verify magic link email is configured
- Check Supabase auth settings
- Clear browser cookies and try again

### File Upload Failures
- Check file size (max 50MB)
- Verify bucket policies are set
- Ensure storage quota is available

## 📞 Support & Documentation

- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Framer Motion**: https://www.framer.com/motion/
- **Tailwind CSS**: https://tailwindcss.com/docs

## 📄 License

This project is open source and available under the MIT License.

## 🎯 Next Steps

1. ✅ Clone and set up the project
2. ✅ Configure Supabase database
3. ✅ Set environment variables
4. ✅ Test locally
5. ✅ Deploy to Vercel
6. ✅ Set up custom domain
7. ✅ Configure analytics
8. ✅ Launch!

---

Built with ❤️ for developers who want premium portfolios.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
