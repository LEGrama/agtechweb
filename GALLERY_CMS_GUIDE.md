# Gallery CMS Setup & Usage Guide

## Overview
The gallery has been converted to a board-style system with an admin interface powered by Netlify CMS. This allows administrators to easily create, edit, and delete gallery posts without editing code.

## Features
- **Board-Style Layout**: List view (default) and grid view
- **Search Functionality**: Search posts by title, description, content, or tags
- **Category Filtering**: Filter by Laboratory, Events, or Research Activities
- **Sorting Options**: Sort by date or title
- **Pagination**: 10 posts per page
- **Admin Interface**: Easy-to-use CMS at `/admin`
- **Responsive Design**: Works on desktop, tablet, and mobile

## Setup Instructions

### Step 1: Deploy to Netlify (Recommended)

1. **Push your code to GitHub** (already done)
   ```bash
   git push origin main
   ```

2. **Create a Netlify account** at https://www.netlify.com

3. **Connect your GitHub repository**:
   - Click "New site from Git"
   - Choose GitHub
   - Select repository: `LEGrama/agtechweb`
   - Build settings: Leave empty (static site)
   - Click "Deploy site"

4. **Enable Netlify Identity**:
   - Go to Site Settings → Identity
   - Click "Enable Identity"
   - Under Registration preferences, select "Invite only"
   - Under External providers, enable GitHub (optional)

5. **Enable Git Gateway**:
   - Go to Site Settings → Identity → Services
   - Enable "Git Gateway"

### Step 2: Add Identity Widget to Your Site

Add the following script to ALL pages (or just gallery.html and admin/index.html):

```html
<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
```

This is already included in the admin page, but you may want to add it to gallery.html for user login/logout.

### Step 3: Invite Yourself as Admin

1. Go to Netlify Dashboard → Identity → Invite users
2. Enter your email address
3. Check your email and click the invitation link
4. Set your password

### Step 4: Access the Admin Interface

1. Visit `https://your-site.netlify.app/admin`
2. Log in with the credentials you just created
3. You can now create, edit, and delete gallery posts!

## Alternative: GitHub Backend (No Netlify Required)

If you prefer to use GitHub Pages without Netlify:

1. **Create a GitHub OAuth App**:
   - Go to GitHub Settings → Developer settings → OAuth Apps
   - Click "New OAuth App"
   - Application name: `AgTech Gallery CMS`
   - Homepage URL: `https://legrama.github.io/agtechweb`
   - Authorization callback URL: `https://api.netlify.com/auth/done`
   - Click "Register application"
   - Copy Client ID and Client Secret

2. **Update admin/config.yml**:
   ```yaml
   backend:
     name: github
     repo: LEGrama/agtechweb
     branch: main
   ```

3. **Use Netlify's OAuth provider**:
   - Even without hosting on Netlify, you can use their OAuth service
   - Follow: https://docs.netlify.com/visitor-access/oauth-provider-tokens/

## Using the CMS

### Creating a New Post

1. Visit `/admin` and log in
2. Click "Gallery Posts" in the sidebar
3. Click "New Gallery Posts"
4. Fill in the form:
   - **Title**: Post title (e.g., "ASABE Conference 2024")
   - **Publish Date**: When the post should appear
   - **Author**: Author name (defaults to "AgTech Lab")
   - **Category**: Choose from Laboratory, Events, or Research Activities
   - **Thumbnail Image**: Upload or select the main image
   - **Gallery Images**: Add multiple images (click "Add Image")
   - **Description**: Short description (appears in list view)
   - **Content**: Full content (Markdown supported)
   - **Tags**: Add relevant tags (optional)
   - **Published**: Toggle to show/hide the post
5. Click "Publish" (or "Save" for draft)

### Editing a Post

1. Go to `/admin`
2. Click "Gallery Posts"
3. Click on the post you want to edit
4. Make your changes
5. Click "Publish" to save

### Deleting a Post

1. Go to `/admin`
2. Click "Gallery Posts"
3. Click on the post you want to delete
4. Click "Delete entry"
5. Confirm deletion

### Publishing Workflow

When you save/publish a post in the CMS:
1. Netlify CMS creates a new Markdown file in `_posts/gallery/`
2. It commits the file to your GitHub repository
3. GitHub Pages automatically rebuilds your site
4. The new post appears on the gallery page within 1-2 minutes

## Data Structure

Posts are stored as Markdown files in `_posts/gallery/` with this format:

```markdown
---
title: "Post Title"
date: 2024-11-17T12:00:00Z
author: "AgTech Lab"
category: "event"
thumbnail: "/images/gallery/image.jpg"
images:
  - /images/gallery/image1.jpg
  - /images/gallery/image2.jpg
description: "Short description"
tags:
  - tag1
  - tag2
published: true
---

Full post content goes here. Supports **Markdown** formatting.

- Bullet points
- More features
```

## Current Static Data

The system currently has 5 sample posts hardcoded in `js/gallery.js`. These will be automatically replaced when you start creating posts through the CMS.

To add more static posts (without using the CMS), edit the `loadStaticPosts()` function in [js/gallery.js](js/gallery.js).

## Troubleshooting

### Can't access /admin
- Make sure you've enabled Netlify Identity
- Check that Git Gateway is enabled
- Verify you've been invited as a user

### Posts not appearing
- Check that `published: true` is set
- Verify the date is not in the future
- Check browser console for errors

### Images not loading
- Make sure images are uploaded to `images/gallery/`
- Check file paths are correct (relative to site root)
- Verify image file extensions match (case-sensitive)

## Customization

### Change Posts Per Page
Edit `postsPerPage` in [js/gallery.js:19](js/gallery.js#L19):
```javascript
const postsPerPage = 10; // Change to desired number
```

### Add New Categories
Edit [admin/config.yml:20](admin/config.yml#L20):
```yaml
- {label: "Category", name: "category", widget: "select", options: ["lab", "event", "research", "new-category"]}
```

And update [js/gallery.js:321-328](js/gallery.js#L321-L328):
```javascript
function getCategoryName(category) {
    const categories = {
        'lab': 'Laboratory',
        'event': 'Events',
        'research': 'Research Activities',
        'new-category': 'New Category Name'
    };
    return categories[category] || category;
}
```

### Modify Styling
Edit [css/style.css](css/style.css) - search for these sections:
- `.gallery-list-item` - List view styling (line 2331)
- `.post-modal` - Post detail modal (line 2493)
- `.pagination` - Pagination styling (line 2463)

## Support

For more information:
- Netlify CMS Documentation: https://www.netlifycms.org/docs/
- Netlify Identity: https://docs.netlify.com/visitor-access/identity/
- GitHub Pages: https://pages.github.com/

## Summary

You now have:
✅ Board-style gallery layout
✅ Search and filter functionality
✅ Pagination
✅ Admin CMS interface at `/admin`
✅ Easy post management (create, edit, delete)
✅ Image upload support
✅ Markdown content editor

Next steps:
1. Deploy to Netlify
2. Enable Identity & Git Gateway
3. Invite yourself as admin
4. Start creating posts at `/admin`!
