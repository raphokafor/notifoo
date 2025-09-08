# Notifoo

A smart reminder service that accepts SMS messages and uses AI to create reminders.

## Environment Variables

The following environment variables are required for the SMS webhook functionality:

```
OPENAI_API_KEY=your_openai_api_key_here
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

## Pricing Thoughts

- $2.99
  - simple email notifications of reminder
- $4.99
  - emails and SMS notifications for U.S. phone numbers
- $9.99
  - all notifications and team members

# notifoo

# Blog System Documentation

This directory contains markdown files that are automatically converted into blog posts for your Next.js application.

## How It Works

1. **Add Markdown Files**: Place `.md` files in this directory
2. **Automatic Processing**: The system automatically reads all markdown files and generates blog pages
3. **Static Generation**: Blog posts are statically generated at build time for optimal performance

## Markdown File Structure

Each markdown file should follow this structure:

```markdown
---
title: "Your Blog Post Title"
description: "A brief description of your blog post"
author: "Author Name"
date: "YYYY-MM-DD"
tags: ["tag1", "tag2", "tag3"]
image: "https://example.com/image.jpg" (optional)
slug: "url-friendly-slug" (optional - will use filename if not provided)
---

# Your Blog Post Title

Your blog content goes here. You can use:

- **Bold text**
- _Italic text_
- [Links](https://example.com)
- Lists
- Headers
- Code blocks
- Images
- And all other standard markdown features

## Subheadings

Content under subheadings...
```

## Frontmatter Fields

- **title** (required): The title of your blog post
- **description** (required): A brief description shown in previews and meta tags
- **author** (required): The author's name
- **date** (required): Publication date in YYYY-MM-DD format
- **tags** (required): Array of tags for categorization
- **image** (optional): Featured image URL
- **slug** (optional): Custom URL slug (defaults to filename without .md)

## Adding New Blog Posts

1. Create a new `.md` file in this directory
2. Add the frontmatter at the top
3. Write your content in markdown
4. The post will automatically appear on `/blog` after the next build

## URLs

- Blog listing: `/blog`
- Individual posts: `/blog/[slug]`

## Features

- Automatic static generation
- SEO-friendly URLs
- Related posts based on tags
- Responsive design
- Social sharing ready
- Search engine optimized

## Tips

- Use descriptive filenames (they become the default slug)
- Include relevant tags for better post discovery
- Optimize images for web before linking
- Keep descriptions concise but informative
- Use proper markdown formatting for best results
