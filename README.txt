🌌 SOLARIS STUDIO_
High-Immersion Digital Architecture & Strategic Engineering
Solaris Studio is a premium, high-performance web environment built with a "Glass-UI" aesthetic. It features smooth motion transitions, neon-accented components, and a modular architecture designed for modern founders and digital-first brands.

🚀 Features
Glass-UI Design: Modern, translucent components with backdrop-blur effects.
Neural Transitions: Smooth page-entry animations and scroll-triggered reveals powered by framer-motion.
Adaptive Engine Cards: High-visibility feature cards with interactive hover states.
Secure Transmission Portal: A fully responsive contact system with integrated visual assets.
Parallax Environment: Immersive background depth using high-resolution space-tech imagery.
Mobile Optimized: Fully fluid layout that scales from 4K displays down to mobile devices.

🛠️ Technical Requirements
To run this project locally, ensure you have the following installed:

1. Core Environment
Node.js: Version 18.0.0 or higher.
npm or yarn package manager.

2. Dependencies
The project relies on these specific libraries:
React: Frontend framework.
Tailwind CSS: For the utility-first styling and neon effects.
Framer Motion: For the "Protocol" transitions and Hero animations.
Lucide React: For the high-tech iconography (Cpu, Shield, Zap, etc.).

3. Asset Structure
For the site to display correctly, your /public/assets folder must contain:
parallax-bg-01.jpg (Hero background)
about-01.jpg (Main Protocol image)
about-02.jpg (Secondary Protocol grid image)
parallax-bg-03.jpg (Tertiary Protocol grid image)
parallax-bg-04.jpg (Contact section image)

💻 Installation & Setup
Clone the Repository:

   Bash
git clone https://github.com/your-username/solaris-studio.git
cd solaris-studio
Install Dependencies:

   Bash
npm install
Required Libraries (if starting from scratch):

   Bash
npm install framer-motion lucide-react
Launch the Engine:

   Bash
npm run dev

📂 Project Structure
solaris-studio/
├── public/
│   └── assets/                # All your images (.jpg, .png, .svg)
│       ├── parallax-bg-01.jpg
│       ├── about-01.jpg
│       ├── about-02.jpg
│       ├── parallax-bg-03.jpg
│       └── parallax-bg-04.jpg
├── src/
│   ├── components/            # Reusable UI pieces
│   │   ├── Navbar.jsx         # The floating navigation
│   │   ├── Hero.jsx           # The "Build the Future" section
│   │   ├── Protocol.jsx       # The About/Strategic section
│   │   ├── Engine.jsx         # The Feature cards section
│   │   ├── Contact.jsx        # The Secure Transmission form
│   │   └── Footer.jsx         # Apps, Links, and Copyright
│   ├── styles/
│   │   └── index.css          # Tailwind imports & global animations
│   ├── App.jsx                # The Main Controller (Imports all components)
│   └── main.jsx               # React DOM Entry point
├── index.html                 # Main HTML wrapper
├── tailwind.config.js         # Custom neon colors & fonts
├── package.json               # Dependencies (framer-motion, lucide-react)
└── README.md                  # The project documentation we created

⚙️ Configuration
The site uses a custom color palette defined in the Tailwind configuration. Key shades include:
Deep Space: #020617
Solaris Blue: #3b82f6 (Neon glow)
Glass White: rgba(255, 255, 255, 0.05)

📜 License
© 2026 Solaris Technologies. All Systems Nominal. Built for high-immersion digital experiences.