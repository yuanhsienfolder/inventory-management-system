# Inventory Management System

A full-stack inventory management dashboard built to practice modern web development — from database design and authentication to responsive, theme-aware UI.

## Features

- 🔐 **Authentication** — Email/password signup and login via Supabase Auth
- 🔒 **Per-user data isolation** — Row Level Security (RLS) policies ensure each user only sees their own inventory
- 📦 **Full CRUD** — Add, view, and delete inventory items in real time
- 📊 **Live dashboard stats** — Total items, total units, and low-stock alerts computed from live data
- 🔍 **Real-time search** — Filter inventory instantly as you type
- 🌗 **Dark / light mode** — Theme preference saved across sessions
- 🏷️ **Stock status badges** — Automatic In Stock / Low Stock / Out of Stock indicators
- ⏱️ **Auto-tracked timestamps** — Database trigger updates "Last Updated" on every change

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Astro](https://astro.build) |
| UI Library | React + TypeScript |
| Styling | SASS (SCSS) with CSS custom properties for theming |
| Backend / Database | [Supabase](https://supabase.com) (PostgreSQL, Auth, Row Level Security) |
| Version Control | Git / GitHub |

## Getting Started

### Prerequisites
- Node.js (LTS recommended)
- A free [Supabase](https://supabase.com) account

### Setup

1. Clone the repository
   \`\`\`bash
   git clone https://github.com/yuanhsienfolder/inventory-management-system.git
   cd inventory-management-system
   \`\`\`

2. Install dependencies
   \`\`\`bash
   npm install
   \`\`\`

3. Create a `.env` file in the project root with your Supabase credentials:
   \`\`\`
   PUBLIC_SUPABASE_URL=your-supabase-url
   PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   \`\`\`

4. Set up the database — in your Supabase project's SQL Editor, create an `items` table with the following columns: `id`, `name`, `quantity`, `storage_location`, `updated_at`, `user_id`, along with the appropriate RLS policies (see `/docs` or project notes for full schema).

5. Run the dev server
   \`\`\`bash
   npm run dev
   \`\`\`

## Screenshots

*(Add your screenshots here — light mode and dark mode)*

## What I Learned

Building this project helped me understand:
- How component-based UI architecture works in practice (props, state, lifting state up)
- Why database security (RLS) matters and how to implement per-user data isolation
- The tradeoffs between client-side and server-side data operations
- How to design a theming system using CSS custom properties instead of hardcoded values

## License

This project is for educational/portfolio purposes.