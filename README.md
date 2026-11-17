# TKD Bank

Your Training. Your Progress. Your Library.

A minimal, public Taekwondo resource library. No accounts. No uploads. Just training resources.

## How to add / update resources

Edit **only** this file:

```
data/resources.js
```

Add a new entry like this:

```js
{
  id: "unique-id",
  title: "Resource Title",
  category: "Taeguek Patterns",   // must match an existing category name
  videoUrl: "https://www.youtube.com/watch?v=XXXX",  // or null
  description: "Short description",
  dateAdded: "2026-11-17",
  type: "video",                  // "video" or "text"
  content: ""                     // optional technique notes (for text type)
}
```

Supported YouTube formats:
- `https://www.youtube.com/watch?v=ID`
- `https://youtu.be/ID`
- `https://www.youtube.com/embed/ID`
- `https://www.youtube.com/shorts/ID`

After editing, push to GitHub. If connected to Netlify or Vercel, the site rebuilds automatically.

## Deploy

This is a static site. Drop the folder on any static host:

- **Netlify**: drag & drop the folder, or connect the GitHub repo
- **Vercel**: connect the repo
- **GitHub Pages**: enable Pages on the repo

No build step required.

## Structure

```
tkdbank/
├── index.html
├── css/styles.css
├── js/app.js
├── data/resources.js   ← edit this
└── README.md
```
