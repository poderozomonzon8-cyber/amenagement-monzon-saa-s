# Aménagement Monzon — System Documentation

## Project Overview
Aménagement Monzon is a complete SaaS platform for managing construction projects with integrated project management, billing, time tracking, employee management, and client portals.

## Tech Stack
- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Next.js Server Actions, Node.js
- **Database:** Supabase PostgreSQL with Row Level Security
- **Storage:** Supabase Storage for files and images
- **Authentication:** Supabase Auth with JWT
- **Deployment:** Vercel
- **Monitoring:** Vercel Analytics, Custom Error Logging
- **Email:** Resend or SendGrid (configurable)

## System Architecture

### User Roles
1. **Admin** - Full access to all features, manages company settings
2. **Employee** - Access to time tracking, projects, invoices
3. **Client** - View-only access to assigned projects, invoices, payments

### Core Modules
- Project Management - Create, edit, track projects
- Billing System - Create invoices, track payments
- Time Tracking - Log work hours, generate timesheets
- Employee Management - Manage team members
- Client Portal - Client-facing view of projects
- Invoice Designer - Customize invoice templates
- Reporting & Analytics - Revenue, project, employee metrics
- User Management - Role assignment, permissions
- Audit Logging - Track all user actions

### Database Schema
- `profiles` - User accounts with roles
- `employees` - Employee records
- `clients` - Client company records
- `projects` - Project records linked to clients
- `invoices` - Invoice records
- `payments` - Payment records
- `time_entries` - Time tracking entries
- `invitations` - User invitation tokens
- `company_settings` - Brand settings, colors, logo
- `audit_logs` - Compliance and audit trail
- `error_logs` - Error tracking

## Features Implemented

### Admin Dashboard
- Overview metrics (projects, invoices, revenue)
- Team management
- User access control
- Company settings
- Analytics and reporting

### Project Management
- Create/edit/delete projects
- Assign clients
- Track budget and timeline
- View project details with timeline
- Time entry management
- Invoice tracking

### Billing System
- Create invoices with line items
- Auto-calculate taxes (TPS 5%, TVQ 9.975%)
- Record payments (cash, bank transfer, e-transfer, card)
- Invoice preview and PDF export
- Payment tracking
- Send invoice to clients

### Employee App
- Clock in/out with timer
- Log work hours to projects
- Photo upload for evidence
- View earnings and hours
- Edit/delete own time entries
- Mobile-responsive PWA

### Client Portal
- View assigned projects
- Track project progress
- View invoices and payment status
- Timeline of activities
- Mobile-responsive

### Invoice Designer
- Upload company logo and signature
- Customize colors (primary/secondary)
- Edit company info (name, address, phone)
- Live preview of invoice design
- Direct Supabase Storage integration

### Reporting & Analytics
- Revenue metrics with trends
- Project metrics by status
- Employee hours and productivity
- Payment methods breakdown
- Date range filtering

## PWA Features
- Service Worker for offline support
- Push notifications ready
- Installable app icon
- Standalone display mode
- Works on iOS and Android

## Security Features
- Supabase Row Level Security (RLS)
- JWT authentication with expiry
- Email verification for signups
- Invitation tokens with expiry
- Audit logging of all actions
- HTTPS/TLS encryption
- CORS configuration
- Rate limiting on APIs
- Password hashing with bcrypt

## API Endpoints

### Authentication
- `POST /auth/sign-up` - Create account
- `POST /auth/sign-in` - Login
- `POST /auth/sign-out` - Logout
- `GET /auth/session` - Get current session
- `POST /auth/forgot-password` - Reset password

### Projects
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/projects/[id]` - Get project details
- `PATCH /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### Invoices
- `GET /api/invoices` - List invoices
- `POST /api/invoices` - Create invoice
- `GET /api/invoices/[id]` - Get invoice details
- `PATCH /api/invoices/[id]` - Update invoice
- `DELETE /api/invoices/[id]` - Delete invoice
- `POST /api/invoices/[id]/send` - Send invoice

### Time Entries
- `GET /api/time-entries` - List entries
- `POST /api/time-entries` - Create entry
- `PATCH /api/time-entries/[id]` - Update entry
- `DELETE /api/time-entries/[id]` - Delete entry

### Users
- `GET /api/users` - List users
- `PATCH /api/users/[id]` - Update user role
- `DELETE /api/users/[id]` - Delete user
- `POST /api/users/invite` - Send invitation

## Server Actions

### Projects
- `getProjects()` - Fetch all projects
- `createProject()` - Create new project
- `updateProject()` - Update project
- `deleteProject()` - Delete project

### Billing
- `getInvoices()` - Fetch invoices
- `createInvoice()` - Create invoice
- `updateInvoice()` - Update invoice
- `getPayments()` - Fetch payments
- `createPayment()` - Record payment

### Users
- `getProfiles()` - List user profiles
- `updateUserRole()` - Change user role
- `createInvitation()` - Send invitation
- `acceptInvitation()` - Accept invite

### Analytics
- `getRevenueMetrics()` - Revenue data
- `getProjectMetrics()` - Project data
- `getEmployeeMetrics()` - Employee data
- `getPaymentMetrics()` - Payment data

## Deployment Instructions

1. **Create Supabase Project**
   - Go to supabase.com and create account
   - Create new project
   - Copy API URL and anon key

2. **Setup Vercel**
   - Connect GitHub repository
   - Link Supabase environment variables
   - Deploy

3. **Run Database Migrations**
   - Execute SQL migration scripts in Supabase SQL editor
   - Setup RLS policies
   - Create storage buckets

4. **Configure Services**
   - Setup email service (Resend/SendGrid)
   - Configure push notifications (VAPID keys)
   - Setup analytics tracking

5. **Test Production**
   - Test login/signup
   - Create test project
   - Generate test invoice
   - Verify emails sending
   - Test PWA installation

## Common Tasks

### Add New User
1. Go to Utilisateurs section
2. Click "Inviter"
3. Enter email, select role, optionally assign project
4. Copy invitation link
5. Share with user
6. User clicks link and creates account

### Create Invoice
1. Go to Facturation
2. Click "Nouvelle facture"
3. Select project/client
4. Add line items
5. System calculates taxes automatically
6. Review preview
7. Save and send to client

### Track Employee Hours
1. Employee logs in to Employee App
2. Clicks clock in to start timer
3. Selects project working on
4. Clicks clock out when done
5. Adds description and photo if needed
6. Submits hours

### View Analytics
1. Go to Rapports
2. Select date range
3. Choose metric to analyze
4. View charts and trends
5. Export data if needed

## Troubleshooting

### Login Issues
- Clear browser cache and cookies
- Verify email is confirmed
- Check Supabase auth settings
- Verify JWT secret is set

### Invoice Not Sending
- Verify email service is configured
- Check SMTP credentials
- Verify client email is correct
- Check spam/junk folder

### PWA Not Installing
- Verify HTTPS is enabled
- Check manifest.json is valid
- Clear browser cache
- Try on Chrome/Edge (better PWA support)

### Time Entries Not Saving
- Verify user is authenticated
- Check project is selected
- Verify database connection
- Check browser console for errors

## Future Enhancements

1. **Mobile App** - Native iOS/Android apps
2. **Payment Integration** - Accept online payments via Stripe
3. **Accounting Integration** - QuickBooks, Xero sync
4. **CRM Integration** - Pipedrive, HubSpot sync
5. **Document Management** - Contract and proposal builder
6. **Advanced Scheduling** - Calendar and resource planning
7. **Budget Forecasting** - ML-based predictions
8. **Team Collaboration** - Real-time collaboration tools
9. **WhatsApp Integration** - Send updates via WhatsApp
10. **Multi-language** - Spanish, French, Portuguese support

## Support & Feedback

- Email: support@amenagement-monzon.com
- Phone: +1 (555) 123-4567
- Bug Reports: GitHub Issues
- Feature Requests: Feedback form on marketing site

---

**Version:** 1.0.0  
**Last Updated:** March 26, 2024  
**Maintainer:** Development Team
