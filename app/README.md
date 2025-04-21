# Trekyourworld - React Trekking Application

A modern React-based web application for browsing, searching, and filtering trekking experiences around the world. Built with React, Tailwind CSS, Heroicons, and Framer Motion for beautiful animations.

## Features

- **Home Page**:
  - Top treks for the current month displayed as cards
  - Application statistics (treks, guides, locations)
  - Interactive photo gallery with lightbox
  - Newsletter subscription

- **Treks Page**:
  - Real-time search with suggestion dropdown
  - Extensive filters (difficulty, duration, location, price)
  - Trek cards with key information

- **UI Components**:
  - Responsive design with mobile-first approach
  - Animated micro-interactions using Framer Motion
  - Modern UI with rounded corners, hover effects
  - Lazy loading for improved performance

## Tech Stack

- React (with Vite for fast development)
- Tailwind CSS for styling
- React Router for navigation
- Framer Motion for animations
- Heroicons for consistent iconography

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/trekyourworld.git
cd trekyourworld/frontend
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── assets/             # Static assets
│   └── images/         # Image files
├── components/
│   ├── home/           # Home page components
│   ├── layout/         # Layout components (header, footer)
│   ├── treks/          # Treks page components
│   └── ui/             # Reusable UI components
├── App.jsx             # Main app component with routing
└── main.jsx            # Entry point
```

## Future Enhancements

- User authentication and profiles
- Trek booking system
- User reviews and ratings
- Interactive maps for trek routes
- Blog section with travel tips

## License

This project is licensed under the MIT License.


Next items to target

v1.0
1. Admin dashboard for managing treks and users
    1.1 admin dashboard UI
    1.2 admin dashboard backend api
    1.3 admin dashboard integration with backend api
    1.4 admin dashboard authentication
    1.5 admin dashboard authorization
    1.6 admin dashboard user management
    1.7 admin dashboard trek management
    1.8 admin dashboard analytics
    1.9 admin dashboard settings
2. backend nodejs api implementation
    2.1 user authentication
    2.2 user authorization
    2.3 user management
    2.4 trek management
    2.5 trek booking
    2.6 trek reviews
    2.7 trek ratings
    2.8 trek routes
    2.9 trek locations
    2.10 trek statistics
    2.11 trek tips
    2.12 trek guides
    2.13 trek photos
    2.14 trek videos
    2.15 trek blog
    2.16 trek newsletter
    2.17 trek gallery
    2.18 trek map
    2.19 trek search
    2.20 trek filter
    2.21 trek sort
    2.22 trek pagination
    2.23 trek sorting
3. integration with backend api

v2.0
1. Add a blog section with travel tips and guides.
2. Implement user authentication and profiles.
3. Create an interactive map for trek routes.
4. Develop a trek booking system.
5. Add user reviews and ratings for treks.
6. Optimize performance for large datasets.
7. Implement a dark mode toggle.