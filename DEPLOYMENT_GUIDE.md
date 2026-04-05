# 🚀 Deployment Guide

Complete guide to deploy your futuristic portfolio to production using Vercel and Supabase.

## Prerequisites

- GitHub account with the project pushed
- Vercel account (free tier available)
- Supabase project configured with database schema
- Custom domain (optional)

## Step 1: Prepare Your Repository

### 1.1 Push to GitHub

```bash
cd d:\portfolio
git init
git add .
git commit -m "Initial commit: Futuristic portfolio with client system"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git push -u origin main
```

### 1.2 Verify Environment Variables

Ensure `.env.local` is in `.gitignore`:
```bash
echo ".env.local" >> .gitignore
git add .gitignore
git commit -m "Add .env.local to gitignore"
```

## Step 2: Deploy to Vercel

### 2.1 Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Select your portfolio repository
5. Click "Import"

### 2.2 Configure Build Settings

Vercel should auto-detect Next.js. Verify:
- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 2.3 Add Environment Variables

In Vercel project settings, go to **Environment Variables**:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_API_URL=https://yourdomain.com
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
NEXT_PUBLIC_CONTACT_EMAIL=contact@yourdomain.com
```

### 2.4 Deploy

Click "Deploy" and wait for the build to complete (usually 2-3 minutes).

## Step 3: Configure Custom Domain

### 3.1 Add Domain to Vercel

1. In Vercel project settings, go to **Domains**
2. Click "Add"
3. Enter your domain name
4. Choose your DNS provider from the list

### 3.2 Update DNS Records

For most domain registrars, add these DNS records:

**For root domain (yourdomain.com):**
```
Type: ALIAS/ANAME
Name: @
Value: cname.vercel-dns.com
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 3.3 Verify Domain

- Vercel will auto-verify once DNS propagates (usually 5-48 hours)
- Check status in Vercel dashboard

## Step 4: Set Up SSL Certificate

Vercel provides free SSL certificates automatically:
1. Domain verification is complete
2. SSL certificate is issued within hours
3. All connections use HTTPS

## Step 5: Configure Supabase for Production

### 5.1 Update API URLs

In Supabase settings:
1. Go to **Project Settings**
2. Update **Site URL**: `https://yourdomain.com`
3. Update **Redirect URLs**: 
   ```
   https://yourdomain.com/auth/callback
   https://yourdomain.com/client-dashboard
   ```

### 5.2 Configure CORS

In Supabase **API Settings**, update **Allowed Origins**:
```
https://yourdomain.com
https://www.yourdomain.com
```

### 5.3 Security: Enable Row Level Security

In Supabase SQL Editor, run:

```sql
-- Create RLS policies for clients table
CREATE POLICY "Clients can view own data"
ON public.clients
FOR SELECT
USING (email = auth.email());

-- Create RLS policies for messages
CREATE POLICY "Users can view own messages"
ON public.messages
FOR SELECT
USING (client_id IN (
  SELECT id FROM public.clients WHERE email = auth.email()
));

-- Similar policies for other tables...
```

## Step 6: Set Up Email Verification

### 6.1 Configure Email Provider

In Supabase:
1. Go to **Authentication > Email Templates**
2. Customize email templates
3. Set "From" email address

### 6.2 Update Email Configuration

For production email (recommended to use SendGrid or similar):
1. In Supabase, go to **Integrations**
2. Configure email service
3. Set up authentication credentials

## Step 7: Monitor & Optimize

### 7.1 Monitor Performance

In Vercel Dashboard:
- Check build times
- Monitor function duration
- Track error rates

### 7.2 Analyze Core Web Vitals

1. Go to **Analytics** in Vercel
2. Monitor LCP, CLS, FID metrics
3. Optimize images and code splitting if needed

### 7.3 Enable Auto-scaling

Vercel automatically scales. To verify:
1. Check **Deployment > Serverless Functions**
2. Review memory limits
3. Adjust if needed

## Step 8: Set Up CI/CD Pipeline

### 8.1 Automatic Deployments

Every push to `main` branch:
1. Vercel automatically builds
2. Runs build command
3. Deploys if successful
4. Rolls back if failed

### 8.2 Preview Deployments

Each pull request gets:
- Automatic preview URL
- Full environment available
- Shared with team members

### 8.3 Production Promotion

1. Create a pull request
2. Review preview deployment
3. Merge to main
4. Automatically deployed to production

## Step 9: Security Checklist

- [ ] All environment variables set (no hardcoded secrets)
- [ ] SSL certificate configured
- [ ] RLS policies enabled in Supabase
- [ ] Admin email protected
- [ ] File upload size limits enforced
- [ ] CORS properly configured
- [ ] Email verification enabled
- [ ] Rate limiting configured
- [ ] Backup strategy defined
- [ ] Monitoring alerts set up

## Step 10: Performance Optimization

### 10.1 Image Optimization

Use Next.js Image component:
```typescript
import Image from 'next/image'

<Image
  src="/portfolio-image.jpg"
  alt="Portfolio"
  width={800}
  height={600}
  priority
/>
```

### 10.2 Code Splitting

Next.js automatically code-splits, but verify bundle sizes:
```bash
npm run build
# Check .next/static/chunks for large files
```

### 10.3 Database Query Optimization

- Add indexes (done in SUPABASE_SCHEMA.sql)
- Use SELECT specific columns
- Implement pagination
- Cache queries when possible

## Step 11: Analytics Integration

### 11.1 Google Analytics

1. Create Google Analytics property
2. Get tracking ID (G-XXXXXXXXXX)
3. Add to `.env.local`:
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

4. Add Google Analytics script to layout.tsx:
```typescript
// In the Head or before </body>
<Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" />
<Script id="google-analytics" strategy="afterInteractive">
  {`window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');`}
</Script>
```

### 11.2 Monitor Real User Experience

- Track page load times
- Monitor error rates
- Analyze user behavior

## Step 12: Backup & Disaster Recovery

### 12.1 Database Backups

In Supabase:
1. Go to **Settings > Backups**
2. Enable point-in-time recovery
3. Configure backup frequency

### 12.2 Version Control

- Always keep git history clean
- Tag releases: `git tag -a v1.0.0 -m "Release 1.0"`
- Push tags: `git push origin --tags`

### 12.3 Snapshot Deployment

Create a snapshot for instant recovery:
```bash
# Export Supabase data
# Commit code and push tag
# Create release on GitHub
```

## Troubleshooting

### Build Fails on Vercel

1. Check build logs in Vercel dashboard
2. Verify environment variables are set
3. Test locally: `npm run build`
4. Check TypeScript errors: `npm run type-check`

### Database Connection Issues

1. Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
2. Check `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Verify Supabase project is active
4. Check network firewall/CORS

### Email Not Sending

1. Configure email provider in Supabase
2. Update "From" address
3. Check email template HTML
4. Verify domain DKIM/SPF records

### SSL Certificate Issues

1. Wait for DNS propagation (up to 48 hours)
2. Verify CNAME records are correct
3. Check Vercel domain settings
4. Contact Vercel support if issues persist

## Performance Targets

- **Core Web Vitals**:
  - LCP (Largest Contentful Paint): < 2.5s
  - CLS (Cumulative Layout Shift): < 0.1
  - FID (First Input Delay): < 100ms

- **Build Time**: < 5 minutes
- **Response Time**: < 200ms (p95)
- **Uptime**: > 99.9%

## Monitoring & Alerts

### Set Up Monitoring

1. **Vercel Analytics**: Track performance
2. **Supabase Monitoring**: Database health
3. **Google Analytics**: User behavior
4. **Error Tracking**: Sentry (optional)

### Configure Alerts

For critical issues:
- Deploy failures
- High error rate
- Database connection errors
- Performance degradation

## Conclusion

Your portfolio is now live and production-ready!

### Next Steps:
1. ✅ Monitor performance metrics
2. ✅ Gather user feedback
3. ✅ Implement analytics improvements
4. ✅ Scale as needed
5. ✅ Keep dependencies updated

---

For support:
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
