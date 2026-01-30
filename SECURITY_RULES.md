# Firestore Security Rules Guide

> For: ATS Resume Analyzer
> Created: 2026-01-30

## Overview

This document provides recommended Firestore security rules for the ATS Resume Analyzer application.

---

## Recommended Security Rules

Copy these rules to **Firebase Console → Firestore → Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ========================================
    // Helper Functions
    // ========================================
    
    // Check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Check if user is accessing their own document
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // ========================================
    // Users Collection
    // ========================================
    
    match /users/{userId} {
      // Users can read their own profile
      allow read: if isOwner(userId);
      
      // Users can only create their own profile (during signup)
      allow create: if isOwner(userId);
      
      // Users can update their own profile
      allow update: if isOwner(userId);
      
      // Users cannot delete their profile (admin only if needed)
      allow delete: if false;
    }
    
    // ========================================
    // Default: Deny all other access
    // ========================================
    
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## Quick Development Rules (Less Secure)

For development/testing only. **DO NOT use in production:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## How to Apply

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Firestore Database** → **Rules**
4. Replace the default rules with the recommended rules above
5. Click **Publish**

---

## Notes

- The ATS Resume Analyzer **does not store resumes** in Firestore
- Resume analysis is done client-side via Gemini API
- Only user profile data (email, name) is stored
- No sensitive data is persisted beyond the session
