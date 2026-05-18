# Admin Panel Handoff

This folder contains reference files from the Flutter app for building a separate admin web project against the same Firebase project.

The admin panel should not import these Dart files directly unless it is also a Dart/Flutter project. For a React, Next.js, or other web admin project, use them as the source of truth for Firestore collection names, document fields, and expected app behavior.

## Firebase Project

- Project ID: `startupsindia-mediaplatform`
- Auth domain: `startupsindia-mediaplatform.firebaseapp.com`
- Storage bucket: `startupsindia-mediaplatform.firebasestorage.app`

Use the same Firebase project in the admin web app.

## Reference Files

- `reference_files/firestore_repository.dart`
  - Shows current Firestore collection names and operations.
  - Current collections: `users`, `articles`, `user_topics`, `users/{uid}/notifications`.
  - Includes article create/read/search, like/bookmark toggles, user profile save, topic follow/unfollow, and Cloudinary image upload.

- `reference_files/news_article_model.dart`
  - Source of truth for current `articles/{articleId}` document fields.

- `reference_files/user_model.dart`
  - Source of truth for current `users/{uid}` document fields.

- `reference_files/app_notification.dart`
  - Source of truth for `users/{uid}/notifications/{notificationId}` fields.

- `reference_files/home_mock_data.dart`
  - Shows the home modules that should eventually become admin-managed collections: featured stories, events, courses, communities, leaderboard, and funding cards.

## Current Firestore Schemas

### `articles/{articleId}`

```ts
{
  authorId: string,
  category: string,
  headline: string,
  sourceName: string,
  sourceId: string,
  sourceLogoAsset: string,
  thumbnailAsset: string,
  timeAgo: string,
  body: string,
  likesCount: number,
  commentsCount: number,
  isSourceFollowing: boolean,
  isBookmarked: boolean,
  isLiked: boolean,
  isTrending: boolean,
  likedBy: string[],
  bookmarkedBy: string[],
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

Admin panel should add moderation/status fields:

```ts
{
  status: "draft" | "pending" | "published" | "rejected" | "archived",
  publishedAt: Timestamp | null,
  reviewedBy: string | null,
  reviewedAt: Timestamp | null,
  rejectionReason: string
}
```

### `users/{uid}`

```ts
{
  uid: string,
  username: string,
  fullName: string,
  email: string,
  phone: string,
  displayName: string,
  bio: string,
  avatarUrl: string,
  websiteUrl: string,
  followersCount: number,
  followingCount: number,
  newsCount: number,
  role: string,
  interests: string[],
  onboardingCompleted: boolean,
  fcmTokens: string[],
  updatedAt: Timestamp
}
```

Admin panel should add admin/account fields:

```ts
{
  accountStatus: "active" | "suspended" | "deleted",
  adminRole: "user" | "author" | "moderator" | "admin",
  isVerified: boolean,
  createdAt: Timestamp,
  lastLoginAt: Timestamp
}
```

### `user_topics/{uid}`

```ts
{
  topics: string[],
  updatedAt: Timestamp
}
```

### `users/{uid}/notifications/{notificationId}`

```ts
{
  type: "news" | "follow" | "interaction",
  title: string,
  subtitle: string,
  createdAt: Timestamp,
  avatarLabel: string,
  isRead: boolean,
  payload: string | null
}
```

## Admin Modules To Build

1. Admin auth and access guard
2. Articles CMS
3. Article moderation queue
4. User management
5. Topics/categories management
6. Sources/authors management
7. Notification campaigns
8. Comments moderation
9. Home modules CMS:
   - Featured stories
   - Funding opportunities
   - Events
   - Courses
   - Communities
   - Startup leaderboard

## Security Notes

- Do not trust client-side checks for admin access.
- Prefer Firebase Auth custom claims like `admin: true`.
- Alternatively, use a locked `admin_users/{uid}` collection.
- Sending push notifications must happen through Firebase Admin SDK, Cloud Functions, or a server route. Do not send FCM from the browser client SDK.

