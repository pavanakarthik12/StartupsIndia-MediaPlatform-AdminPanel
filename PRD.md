I'll create a **very detailed admin panel specification** for you. Here it is:

---

# **Admin Panel Specification Document**

## **1. PROJECT OVERVIEW**

**Name:** Startups India Media Platform - Admin Dashboard  
**Type:** Web Application (React + TypeScript)  
**Purpose:** Manage notifications, articles, users, and analytics for the Flutter app  
**Firebase Project:** `startupsindia-mediaplatform` (same as mobile app)  
**Deployment:** Vercel or Firebase Hosting

---

## **2. TECH STACK**

```
Frontend:
- React 18+ with TypeScript
- Next.js 14+ (for SSR + routing)
- TailwindCSS or Material-UI for styling
- Chart.js or Recharts for analytics/graphs
- Firebase Admin SDK for backend
- Zustand or Jotai for state management

Backend/Database:
- Firebase Firestore (no separate backend needed)
- Firebase Authentication with email/password for admins
- Firebase Cloud Storage for images
- Firebase Cloud Functions (optional, for bulk operations)

Dev Tools:
- Vite or Next.js dev server
- ESLint + Prettier
- Jest for testing
- GitHub Actions for CI/CD
```

---

## **3. AUTHENTICATION & AUTHORIZATION**

### **Admin Login:**
```
- Email: admin@startupsindia.com
- Password: (stored in Firebase Auth)
- MFA: Optional (can be added later)
- Session: JWT token from Firebase, expires after 24 hours
- Roles: Super Admin (full access), Moderator (limited access)
```

### **Firestore Collection - `admins`:**
```json
{
  "uid": "admin_user_id",
  "email": "admin@startupsindia.com",
  "fullName": "Admin Name",
  "role": "super_admin", // "super_admin" or "moderator"
  "permissions": ["send_notifications", "create_articles", "view_analytics", "manage_users"],
  "createdAt": Timestamp,
  "lastLogin": Timestamp,
  "isActive": true
}
```

---

## **4. FEATURE SPECIFICATIONS**

### **4.1 DASHBOARD (Home Page)**

**Layout:** Sidebar + Main Content Area

**Left Sidebar:**
```
Logo
- Startups India Media

Navigation Menu:
- 📊 Dashboard (Home)
- 📨 Send Notifications
- 📰 Manage News/Articles
- 👥 Users Management
- 📈 Analytics & Reports
- ⚙️ Settings
- 🚪 Logout

Admin Name + Avatar (top right)
- Last login: [timestamp]
- Status: Online/Offline
```

**Main Dashboard Cards (Quick Stats):**
```
1. Total Users
   - Count: 1,234
   - Change: +12% from last week
   - Icon: 👥

2. Total Articles Published
   - Count: 456
   - Change: +8 this week
   - Icon: 📰

3. Notifications Sent (This Month)
   - Count: 89
   - Status: Active campaigns
   - Icon: 📬

4. Active Campaigns
   - Count: 5
   - Next scheduled: [timestamp]
   - Icon: 📢

5. User Engagement Rate
   - Percentage: 42.5%
   - Trend: Chart showing last 30 days
   - Icon: 📊

6. News Categories Distribution
   - Pie chart showing:
     - Trending: 30%
     - Technology: 25%
     - Finance: 20%
     - Politics: 15%
     - Other: 10%
```

**Recent Activity Feed:**
```
- New article published by [user] at [time]
- Notification sent to [count] users at [time]
- New user signup: [email] at [time]
- User [name] disabled at [time]
```

---

### **4.2 SEND NOTIFICATIONS**

**Page Route:** `/notifications`

**UI Layout:**
```
Header:
- Title: "Send Notifications"
- Breadcrumb: Dashboard > Notifications

Two Tabs:
1. "Compose New"
2. "Campaign History"
```

#### **TAB 1: Compose New**

**Form Section 1 - Message Content:**
```
Fields:
┌─────────────────────────────────────────────┐
│ Notification Title*                         │
│ [Text input - max 100 chars]               │
│ Character count: 0/100                      │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Notification Body*                          │
│ [Textarea - max 500 chars]                 │
│ Character count: 0/500                      │
│ Preview: [Live preview panel]              │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Image (Optional)                            │
│ [Upload file or URL]                       │
│ Supported: JPG, PNG (Max 2MB)              │
│ [Preview: thumbnail]                       │
└─────────────────────────────────────────────┘
```

**Form Section 2 - Targeting:**
```
Radio Buttons (Select One):
○ Send to All Users
○ Send to Specific User Segment
○ Send to Topic Subscribers
○ Send to Single Device

If "Specific User Segment" selected:
┌─────────────────────────────────────────────┐
│ Filter by:                                  │
│ ☐ Country: [Dropdown]                      │
│ ☐ Preferred Topics: [Multi-select]         │
│   - Trending
│   - Technology
│   - Finance
│   - Politics
│   - Startups
│ ☐ Account Age: [Slider] X - Y days         │
│ ☐ Engagement Level: [Radio] All/High/Low   │
│                                             │
│ Estimated Reach: 1,234 users               │
└─────────────────────────────────────────────┘

If "Topic Subscribers" selected:
┌─────────────────────────────────────────────┐
│ Select Topic:                               │
│ ○ Trending
│ ○ Technology
│ ○ Finance
│ ○ Politics
│ ○ Startups
│ Subscribers: 342                            │
└─────────────────────────────────────────────┘

If "Single Device" selected:
┌─────────────────────────────────────────────┐
│ Device Token or User Email*                 │
│ [Text input]                               │
│ [Search button]                            │
│ Match Found: [User name]                   │
└─────────────────────────────────────────────┘
```

**Form Section 3 - Scheduling:**
```
Radio Buttons:
○ Send Immediately
○ Schedule for Later

If "Schedule for Later":
┌─────────────────────────────────────────────┐
│ Date: [Datepicker] MM/DD/YYYY              │
│ Time: [Timepicker] HH:MM (UTC)             │
│ Timezone: [Dropdown] (UTC, IST, etc.)      │
└─────────────────────────────────────────────┘
```

**Form Section 4 - Analytics:**
```
☐ Track engagement metrics
  - Impressions, clicks, opens
  - View report after sending

☐ Enable deep linking
  - Link to: [Dropdown]
    * Home Feed
    * Specific Article (if applicable)
    * URL: [Text input]
```

**Action Buttons:**
```
[Preview] [Save as Draft] [Send Now] [Schedule]
```

**Preview Modal:**
```
Title: "Notification Preview"

Device Previews (tabs):
- Android
- iOS
- Web

[Android Preview]
┌──────────────────────┐
│ Notification Title   │
│ Notification Body... │
│                      │
│ [Thumbnail Image]    │
└──────────────────────┘
```

#### **TAB 2: Campaign History**

**Table with Columns:**
```
┌─────────────────────────────────────────────────────────────────────┐
│ Campaign ID │ Title │ Sent At │ Status │ Reach │ Opens │ Actions  │
├─────────────────────────────────────────────────────────────────────┤
│ CAM_001     │ New... │ May 11  │ ✓ Sent │ 1,234 │ 342   │ View    │
│ CAM_002     │ Test...│ May 10  │ ⏱ Sched│ 500   │ -     │ Edit    │
│ CAM_003     │ Draft │ Draft   │ 📝 Draft│ -     │ -     │ Send/Del│
└─────────────────────────────────────────────────────────────────────┘

Filters:
[Dropdown: All/Sent/Scheduled/Draft] [Dropdown: Last 7 days/30/90]
[Search bar]

Row Actions:
- View: Show detailed stats + preview
- Edit: Re-edit (if draft/scheduled)
- Delete: Remove (if draft)
- Resend: Send to same segment again
- Analytics: View detailed metrics
```

---

### **4.3 MANAGE NEWS/ARTICLES**

**Page Route:** `/articles`

**Two Views:** Grid view / List view toggle

#### **LIST VIEW:**

**Header:**
```
Title: "Manage Articles"
[+ Create New Article Button]
[View toggle: Grid/List]
```

**Filters:**
```
[Dropdown: Category] [Dropdown: Author] [Dropdown: Status (Published/Draft/Pending)]
[Date Range Picker] [Search by headline]
```

**Table Columns:**
```
┌──────────────────────────────────────────────────────────────────────────┐
│ Thumbnail │ Headline│ Author  │ Category│ Published │ Likes │ Actions  │
├──────────────────────────────────────────────────────────────────────────┤
│ [Image]   │ Title..│ John Doe│ Tech    │ May 11    │ 234   │ Edit/Del │
│ [Image]   │ Title..│ Jane D. │ Finance │ Draft     │ -     │ Edit/Pub │
└──────────────────────────────────────────────────────────────────────────┘

Actions per row:
- [Eye icon] View
- [Pencil icon] Edit
- [Pin icon] Mark as Trending (toggles isTrending)
- [Trash icon] Delete
- [More] (...) More options:
  * Duplicate
  * Change Author
  * Change Category
```

#### **GRID VIEW:**

**Cards Layout:**
```
[Thumbnail Image]
┌─────────────────────────┐
│ Headline (2 lines)      │
│ Author name             │
│ Category badge          │
│ Published: Date         │
│ ❤️ 234 likes           │
│ [Edit] [Delete] [More]  │
└─────────────────────────┘
```

---

### **4.4 CREATE/EDIT ARTICLE**

**Page Route:** `/articles/new` or `/articles/[id]/edit`

**Form Layout:**

```
Header:
- Title: "Create New Article" or "Edit Article"
- [Save Draft] [Publish] buttons (sticky top-right)

Main Form:
┌─────────────────────────────────────────────┐
│ BASIC INFORMATION                           │
├─────────────────────────────────────────────┤
│ Headline*                                   │
│ [Text input - max 200 chars]               │
│ Help text: "Catchy headline for the feed"  │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Category*                                   │
│ [Dropdown or Multi-select]                 │
│ Options:                                    │
│  - Trending                                 │
│  - Technology                               │
│  - Finance                                  │
│  - Politics                                 │
│  - Startups                                 │
│  - Other                                    │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Thumbnail/Cover Image*                      │
│ [Drag & drop or click to upload]           │
│ Supported: JPG, PNG (Recommended: 1200x600)│
│ [Preview: Show image]                      │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Article Body*                               │
│ [Rich text editor] (Markdown or WYSIWYG)   │
│ Formatting options:                         │
│ B I U S ~ → • « »                          │
│ [Text area - min 100 words]                │
│ Word count: 0/[Target]                     │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Author                                      │
│ [Dropdown - Pre-filled with current admin]  │
│ Can change to different user                │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ ADVANCED OPTIONS (Collapsible)              │
├─────────────────────────────────────────────┤
│ ☐ Mark as Trending                         │
│ ☐ Pin to top of feed                       │
│ Meta Description: [Text input]             │
│ Meta Keywords: [Tag input]                 │
│ Custom URL slug: [Text input]              │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ PUBLISHING                                  │
├─────────────────────────────────────────────┤
│ Status: ○ Draft ○ Published ○ Scheduled    │
│ If Scheduled:                               │
│  Date: [Datepicker]                        │
│  Time: [Timepicker]                        │
│ Visibility: ○ Public ○ Draft ○ Archived   │
└─────────────────────────────────────────────┘
```

---

### **4.5 USERS MANAGEMENT**

**Page Route:** users

**Header:**
```
Title: "Users Management"
[Dropdown: Filter by status] [Search bar]
```

**Table:**
```
┌──────────────────────────────────────────────────────────────────┐
│ Avatar │ Name      │ Email           │ Joined  │ Status  │ Actions│
├──────────────────────────────────────────────────────────────────┤
│ [IMG]  │ John Doe  │ john@email.com │ May 11  │ Active  │ View  │
│ [IMG]  │ Jane Doe  │ jane@email.com │ May 10  │ Pending │ View  │
│ [IMG]  │ Bob Smith │ bob@email.com  │ May 9   │ Blocked │ View  │
└──────────────────────────────────────────────────────────────────┘

Filters:
[Dropdown: All/Active/Pending/Blocked]
[Search by name/email]
[Date range: Joined between X and Y]
```

**User Detail Modal:**
```
Title: User Profile

Tabs: Overview | Activity | Posts | Engagement

[Overview Tab]
┌──────────────────────────────────────────┐
│ Avatar (large)                           │
│ Name: John Doe                           │
│ Email: john@email.com                    │
│ Phone: +91-XXXXXXXXXX                    │
│ Country: India                           │
│ Joined: May 11, 2026                     │
│ Last Active: 2 hours ago                 │
│ Status: Active ○ Pending ○ Blocked      │
│                                          │
│ Stats:                                   │
│ - Posts Published: 5                     │
│ - Followers: 123                         │
│ - Following: 45                          │
│ - Total Likes Received: 342              │
│                                          │
│ Actions:                                 │
│ [Block User] [Delete Account] [Send MSG] │
└──────────────────────────────────────────┘

[Activity Tab]
- List of recent activities (likes, follows, comments)

[Posts Tab]
- Grid of articles published by user

[Engagement Tab]
- Graph showing engagement over time
```

---

### **4.6 ANALYTICS & REPORTS**

**Page Route:** `/analytics`

**Date Range Selector (Top):**
```
[Dropdown: Last 7 days / 30 days / 90 days / Custom range]
[Datepicker: From - To]
[Compare with previous period: ☐]
```

**Tab Navigation:**
```
- Overview
- User Analytics
- Content Analytics
- Notification Performance
- Export Reports
```

#### **TAB 1: Overview**

**Cards:**
```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ Total Users     │  │ Active Today    │  │ New Signups     │
│ 1,234 (+2%)     │  │ 342 (-5%)       │  │ 23 (+8%)        │
│ [Chart]         │  │ [Chart]         │  │ [Chart]         │
└─────────────────┘  └─────────────────┘  └─────────────────┘

┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ Total Articles  │  │ Avg Engagement  │  │ Notifications   │
│ 456 (+12%)      │  │ 42.5% (+3%)     │  │ Sent: 89 (+15%) │
│ [Chart]         │  │ [Chart]         │  │ [Chart]         │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

**Main Charts:**
```
┌────────────────────────────────────────────────┐
│ User Growth (Line Chart)                       │
│ X-axis: Date                                   │
│ Y-axis: User count                             │
│ [Interactive line chart - hover for details]   │
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│ App Engagement (Area Chart)                    │
│ - Daily active users                           │
│ - Session count                                │
│ - Avg session duration                         │
│ [Stacked area chart]                           │
└────────────────────────────────────────────────┘
```

#### **TAB 2: User Analytics**

**Metrics:**
```
┌──────────────────────────────────────────────┐
│ User Retention Cohort                        │
│ Shows retention over time (table)             │
│                                              │
│ Example:                                     │
│ Cohort   │ Day 1 │ Day 7 │ Day 30 │ Day 90 │
│ May 1    │ 100%  │ 75%   │ 52%    │ 38%    │
│ May 2    │ 100%  │ 72%   │ 48%    │ -      │
└──────────────────────────────────────────────┘

Geographic Distribution (Map or Table):
- Top countries by users
- Country | Users | % | Trend

Device Type Distribution (Pie Chart):
- Android: 65%
- iOS: 30%
- Web: 5%

User Signup Trend (Bar Chart):
- Shows daily/weekly signups
```

#### **TAB 3: Content Analytics**

**Metrics:**
```
Top Articles by Engagement:
┌────────────────────────────────────────────┐
│ Rank │ Title      │ Views │ Likes │ Shares│
├────────────────────────────────────────────┤
│ 1    │ Article... │ 5,234 │ 342   │ 128   │
│ 2    │ Article... │ 4,123 │ 289   │ 95    │
└────────────────────────────────────────────┘

Category Performance:
- Bar chart showing engagement by category
- Category | Articles | Total Views | Avg Likes

Content Performance Over Time:
- Line chart: Views/Likes/Shares per day
```

#### **TAB 4: Notification Performance**

**Metrics:**
```
Campaign Performance Table:
┌──────────────────────────────────────────────┐
│ Campaign │ Sent   │ Delivered │ Opened │ CTR  │
├──────────────────────────────────────────────┤
│ Campaign │ 1,234  │ 1,200     │ 342    │ 28.5%│
│ Campaign │ 500    │ 498       │ 145    │ 29.1%│
└──────────────────────────────────────────────┘

Notification Delivery Rate (Gauge Chart):
- Target: 95%
- Actual: 97.3% ✓

CTR Over Time (Line Chart):
- Click-through rate trend
```

#### **TAB 5: Export Reports**

**Options:**
```
Report Type:
○ Daily Summary
○ Weekly Report
○ Monthly Report
○ Custom Report

Date Range:
[Datepicker: From - To]

Format:
○ PDF ○ CSV ○ Excel

Content to include:
☐ User metrics
☐ Content metrics
☐ Notification metrics
☐ Custom metrics

[Generate Report]
```

---

### **4.7 SETTINGS**

**Page Route:** `/settings`

**Tabs:**
```
- Admin Profile
- Manage Admins
- App Configuration
- API Keys
- Webhooks
```

#### **Admin Profile Tab:**
```
Display current admin info:
- Name: [Edit input]
- Email: [Read-only]
- Avatar: [Upload]
- Password: [Change Password button]

[Save Changes]
```

#### **Manage Admins Tab:**
```
List of all admins:
[+ Add New Admin]

Table:
┌────────────────────────────────────────────┐
│ Email         │ Role        │ Status │ Actn│
├────────────────────────────────────────────┤
│ admin@...     │ Super Admin │ Active │ Edit│
│ mod@...       │ Moderator   │ Active │ Edit│
└────────────────────────────────────────────┘

Create Admin Modal:
- Email*
- Password*
- Full Name*
- Role: [Dropdown: Super Admin / Moderator]
- Permissions: [Checkboxes]
  ☐ Send Notifications
  ☐ Create/Edit Articles
  ☐ Manage Users
  ☐ View Analytics

[Create] [Cancel]
```

#### **App Configuration Tab:**
```
- App Name
- App Description
- Support Email
- Support Phone
- Website URL
- Terms & Privacy URLs
- Maintenance Mode: [Toggle]
  (When ON, shows maintenance message to users)
```

---

## **5. FIRESTORE SCHEMA (Collections & Documents)**

```
### admins
{
  uid: string (PK)
  email: string
  fullName: string
  role: "super_admin" | "moderator"
  permissions: string[]
  createdAt: Timestamp
  lastLogin: Timestamp
  isActive: boolean
}

### users (Already exists)
{
  uid: string (PK)
  email: string
  username: string
  fullName: string
  displayName: string
  phone: string
  avatarUrl: string
  country: string
  status: "active" | "pending" | "blocked"
  createdAt: Timestamp
  lastLogin: Timestamp
  followersCount: number
  followingCount: number
}

### articles (Already exists)
{
  id: string (PK)
  headline: string
  body: string
  thumbnailAsset: string
  sourceLogoAsset: string
  category: string
  authorId: string
  sourceName: string
  createdAt: Timestamp
  updatedAt: Timestamp
  isTrending: boolean
  isPinned: boolean
  likesCount: number
  likedBy: string[]
  bookmarkedBy: string[]
  status: "published" | "draft" | "archived"
  metaDescription: string
  metaKeywords: string[]
}

### notifications
{
  campaignId: string (PK)
  title: string
  body: string
  imageUrl: string (optional)
  targetType: "all_users" | "segment" | "topic" | "device"
  targetFilter: {
    countries: string[]
    topics: string[]
    minAccountAge: number
    maxAccountAge: number
    engagementLevel: "all" | "high" | "low"
  }
  estimatedReach: number
  actualReach: number
  sentAt: Timestamp
  status: "draft" | "scheduled" | "sent" | "failed"
  scheduledFor: Timestamp (if scheduled)
  deepLink: string (optional)
  trackingEnabled: boolean
  analytics: {
    impressions: number
    clicks: number
    opens: number
    ctr: number // click-through rate
  }
  createdBy: string (admin uid)
  createdAt: Timestamp
}

### analytics (Optional - could use Firestore directly or Google Analytics)
{
  date: string (YYYY-MM-DD) (PK)
  activeUsers: number
  newSignups: number
  sessionsCount: number
  totalViews: number
  avgEngagementRate: number
}
```

---

## **6. KEY FIRESTORE RULES**

```javascript
match /admins/{document=**} {
  allow read, write: if request.auth.uid != null && 
                       exists(/databases/$(database)/documents/admins/$(request.auth.uid));
}

match /notifications/{document=**} {
  allow read, write: if request.auth.uid != null && 
                       exists(/databases/$(database)/documents/admins/$(request.auth.uid));
}

match /articles/{document=**} {
  allow read: if true;
  allow create, update, delete: if request.auth.uid != null && 
                                  exists(/databases/$(database)/documents/admins/$(request.auth.uid));
}

match /users/{document=**} {
  allow read: if request.auth.uid != null && 
               exists(/databases/$(database)/documents/admins/$(request.auth.uid));
  allow update: if request.auth.uid != null && 
                 exists(/databases/$(database)/documents/admins/$(request.auth.uid));
}
```

---

## **7. FEATURES BREAKDOWN (Detailed)**

### **7.1 Send Notifications**
- [ ] Compose new notification with title, body, image
- [ ] Preview notification on Android/iOS/Web
- [ ] Target all users
- [ ] Target specific segments (country, topics, account age)
- [ ] Target topic subscribers
- [ ] Send to single device
- [ ] Schedule notifications for later
- [ ] Deep linking (link to specific article or URL)
- [ ] View campaign history
- [ ] View analytics per campaign (impressions, opens, clicks)
- [ ] Resend notifications

### **7.2 Manage Articles**
- [ ] List all articles with filters (category, author, status)
- [ ] Create new article with rich text editor
- [ ] Edit existing articles
- [ ] Delete articles
- [ ] Mark article as trending/pinned
- [ ] Change article category
- [ ] Change article author
- [ ] Publish/Draft/Archive article
- [ ] View article statistics (likes, comments, views)
- [ ] Duplicate article

### **7.3 Users Management**
- [ ] List all users
- [ ] Filter users (status, country, join date)
- [ ] View user profile with detailed stats
- [ ] Block/Unblock users
- [ ] Delete user account
- [ ] Send message to user
- [ ] View user activity history
- [ ] View user posts
- [ ] View user engagement metrics

### **7.4 Analytics**
- [ ] Overall dashboard with key metrics
- [ ] User growth chart
- [ ] App engagement metrics
- [ ] User retention cohorts
- [ ] Geographic distribution
- [ ] Device type breakdown
- [ ] Top articles by engagement
- [ ] Category performance
- [ ] Notification campaign performance
- [ ] Export analytics reports (PDF/CSV)
- [ ] Date range filtering
- [ ] Comparison with previous period

### **7.5 Admin Management**
- [ ] Create new admin accounts
- [ ] Assign roles (Super Admin, Moderator)
- [ ] Set granular permissions
- [ ] View all admins and their status
- [ ] Disable/Enable admin accounts
- [ ] View admin activity logs

---

## **8. UI/UX REQUIREMENTS**

**Design System:**
- Color Scheme: Professional dark/light mode toggle
- Typography: Modern, readable fonts (e.g., Inter, Roboto)
- Spacing: Consistent padding/margin system
- Icons: Lucide React or Heroicons
- Responsive: Mobile + Tablet + Desktop

**Components to Build:**
- Sidebar Navigation with collapse
- Data Tables with sorting/filtering
- Modal Dialogs
- Toast/Snackbar notifications
- Rich Text Editor
- Charts (Line, Bar, Pie, Area)
- Date/Time Pickers
- Image Upload with Preview
- Loading Skeletons
- Error/Success States

**Accessibility:**
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- High contrast mode option

---

## **9. SECURITY REQUIREMENTS**

- [ ] Admin authentication with Firebase
- [ ] Session management (24-hour expiry)
- [ ] HTTPS only
- [ ] Rate limiting on API calls
- [ ] Input sanitization (XSS prevention)
- [ ] CSRF protection
- [ ] Admin activity logging
- [ ] Encrypted sensitive data
- [ ] Two-factor authentication (optional)

---

## **10. PERFORMANCE**

- [ ] Page load time < 3 seconds
- [ ] Charts render in < 1 second
- [ ] Pagination for large lists (50 items per page)
- [ ] Lazy loading for images
- [ ] Caching strategies (Firebase client-side)
- [ ] Debouncing for search/filters

---

## **11. DEPLOYMENT**

**Option 1 - Vercel:**
```bash
# Clone repo
git clone [repo-url]
cd admin-panel

# Install dependencies
npm install

# Environment variables (.env.local)
NEXT_PUBLIC_FIREBASE_API_KEY=xxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxxxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=startupsindia-mediaplatform
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxxxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxxxx

# Deploy to Vercel
npm run build
vercel deploy
```

**Option 2 - Firebase Hosting:**
```bash
npm run build
firebase deploy --only hosting
```

---

## **12. FILE STRUCTURE**

```
admin-panel/
├── public/
│   ├── logo.png
│   └── icons/
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── MainLayout.tsx
│   │   ├── Dashboard/
│   │   │   ├── StatCard.tsx
│   │   │   ├── Chart.tsx
│   │   │   └── ActivityFeed.tsx
│   │   ├── Notifications/
│   │   │   ├── ComposeForms.tsx
│   │   │   ├── CampaignHistory.tsx
│   │   │   └── NotificationPreview.tsx
│   │   ├── Articles/
│   │   │   ├── ArticleTable.tsx
│   │   │   ├── ArticleForm.tsx
│   │   │   └── ArticleGrid.tsx
│   │   ├── Users/
│   │   │   ├── UserTable.tsx
│   │   │   ├── UserModal.tsx
│   │   │   └── UserStats.tsx
│   │   ├── Analytics/
│   │   │   ├── ChartComponent.tsx
│   │   │   ├── MetricsCard.tsx
│   │   │   └── ReportExport.tsx
│   │   └── Common/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       ├── Table.tsx
│   │       └── Toast.tsx
│   ├── pages/
│   │   ├── index.tsx (Dashboard)
│   │   ├── login.tsx
│   │   ├── notifications/
│   │   │   └── index.tsx
│   │   ├── articles/
│   │   │   ├── index.tsx
│   │   │   ├── [id]/edit.tsx
│   │   │   └── new.tsx
│   │   ├── users/
│   │   │   └── index.tsx
│   │   ├── analytics/
│   │   │   └── index.tsx
│   │   └── settings/
│   │       └── index.tsx
│   ├── services/
│   │   ├── firebase.ts (Firebase initialization)
│   │   ├── authService.ts
│   │   ├── notificationService.ts
│   │   ├── articleService.ts
│   │   ├── userService.ts
│   │   └── analyticsService.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useNotifications.ts
│   │   ├── useArticles.ts
│   │   └── useAnalytics.ts
│   ├── store/
│   │   ├── authStore.ts
│   │   ├── articleStore.ts
│   │   └── uiStore.ts
│   ├── types/
│   │   ├── index.ts
│   │   ├── notification.ts
│   │   ├── article.ts
│   │   ├── user.ts
│   │   └── analytics.ts
│   ├── styles/
│   │   ├── globals.css
│   │   └── theme.css
│   └── utils/
│       ├── validators.ts
│       ├── formatters.ts
│       └── constants.ts
├── .env.local (example)
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
```

---

## **13. AUTHENTICATION FLOW**

```
1. Admin visits dashboard
2. Redirected to /login if not authenticated
3. Email + Password login
4. Firebase auth validates credentials
5. JWT token generated
6. Token stored in localStorage
7. Redirect to dashboard
8. Token refreshed on each request
9. Logout clears token
```

---

## **14. KEY APIs/Methods Needed**

**Firebase Services:**
```typescript
// Auth
signInWithEmail(email, password)
signOut()
getCurrentAdmin()
refreshToken()

// Notifications
createNotification(data)
sendNotification(campaignId)
scheduleNotification(campaignId, timestamp)
getNotificationMetrics(campaignId)

// Articles
createArticle(data)
updateArticle(id, data)
deleteArticle(id)
getArticles(filters, pagination)
getArticleStats(id)

// Users
getUsers(filters, pagination)
blockUser(uid)
unblockUser(uid)
deleteUserAccount(uid)
getUserStats(uid)

// Analytics
getUserMetrics(dateRange)
getContentMetrics(dateRange)
getNotificationMetrics(dateRange)
generateReport(type, dateRange, format)
```

---

## **15. TESTING CHECKLIST**

- [ ] Authentication (login/logout)
- [ ] Create/Edit/Delete notifications
- [ ] Send notifications to different target segments
- [ ] Create/Edit/Delete articles
- [ ] Upload images
- [ ] User management (block/delete)
- [ ] Analytics charts render correctly
- [ ] Export reports
- [ ] Responsive design on mobile/tablet
- [ ] Performance metrics
- [ ] Error handling
- [ ] Firebase permissions

---

**This is your comprehensive spec. Build this and integrate it with your Firebase project!** 🚀