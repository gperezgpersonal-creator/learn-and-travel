# Learn and Travel

Learn and Travel is a modern Next.js application designed to showcase educational travel programs. It connects students with global opportunities through a seamless, localized, and visually engaging platform.

## Features

-   **Multilingual Support**: Fully localized in English and Spanish using `next-intl`.
-   **Dynamic Content**: Program details and blog posts are dynamically rendered.
-   **Responsive Design**: Built with Tailwind CSS for a mobile-first experience.
-   **Animations**: Smooth entry animations using `framer-motion` (via a custom `FadeIn` component).
-   **Modern UI**: Clean, professional aesthetic with a focus on usability.

## Tech Stack

-   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Localization**: [next-intl](https://next-intl-docs.vercel.app/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites

-   Node.js 18+
-   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd learn-and-travel
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

-   `src/app`: App Router pages and layouts.
    -   `[locale]`: Localized routes.
-   `src/components`: Reusable UI components.
-   `src/messages`: Localization JSON files (`en.json`, `es.json`).
-   `src/lib`: Data utilities and static content definitions.
-   `src/navigation.ts`: Navigation configuration for `next-intl`.

## Collaboration

-   **Content Updates**: Update `src/messages/*.json` for text changes.
-   **New Programs**: Add entries to `src/lib/programs.ts` and corresponding translations in `ProgramsData`.
-   **New Blog Posts**: Add entries to `src/lib/blog.ts` and corresponding translations in `BlogData`.
