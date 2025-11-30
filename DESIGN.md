# LeadFlow Application Design Guide

This document outlines the design principles and styles used in the LeadFlow application. It serves as a guide to maintain a consistent user interface and to build similarly styled applications.

## 1. Overview

The design philosophy of LeadFlow is to provide a modern, visually engaging, and user-friendly interface for lead generation and management. The aesthetic is defined by a dark theme with vibrant ruby accents, translucent UI elements, and dynamic background effects.

## 2. Color Palette

The color scheme is managed through CSS custom properties (variables) in `src/app/globals.css`. The palette is built around a "ruby" accent color on a dark background.

### Core Theme Colors:

-   **Background**: A very dark, near-black color with a subtle red tint.
    -   `--background: 340 6% 10%;`
-   **Foreground**: An off-white color for primary text, providing clear contrast against the dark background.
    -   `--foreground: 0 0% 98%;`
-   **Primary (Accent)**: A vibrant ruby red used for interactive elements, highlights, and branding.
    -   `--primary: 340.4 79.3% 48%;`
-   **Card**: A semi-transparent dark color that creates a "glassmorphism" effect, allowing the background to be partially visible.
    -   `--card: 340 4% 15% / 0.3;`
-   **Input**: A dark gray color for form input fields.
    -   `--input: 340 4% 20%;`
-   **Border**: A semi-transparent dark color for borders, subtly separating UI elements.
    -   `--border: 340 4% 20% / 0.5;`

## 3. Typography

The application uses the "Inter" font for all text, which provides excellent readability for UI elements.

-   **Font Family**: `Inter`, `sans-serif`
-   **File**: The font is imported from Google Fonts in `src/app/layout.tsx`.

## 4. Component Styling

Components are built using **ShadCN UI** and styled with **Tailwind CSS**.

-   **Cards (`<Card />`)**:
    -   Feature a semi-transparent background (`backdrop-blur-sm`) to create a glass-like effect.
    -   Have rounded corners (`rounded-lg`) and a subtle border.
-   **Buttons (`<Button />`)**:
    -   Primary buttons use the ruby accent color.
    -   They have rounded corners and provide clear visual feedback on hover and focus states.
-   **Input Fields (`<Input />`, `<Textarea />`)**:
    -   Styled with a dark background to blend with the overall theme.
    -   They have a clear focus state with a ring in the primary ruby color.
-   **Tables (`<Table />`)**:
    -   Table headers (`<TableHead>`) use the primary ruby color (`text-primary`) to stand out.
    -   Rows have a hover effect to indicate interactivity.

## 5. Background Effect

The application features a dynamic, glowing background to add visual depth and interest.

-   **Effect**: A large radial gradient with the primary ruby color animates in a slow, swirling motion.
-   **Implementation**: This is achieved with pure CSS using a `::before` pseudo-element on a `div` with the `background-swirl` class. The styles and `@keyframes` animation are defined in `src/app/globals.css`.

## 6. Layout

-   **Main Structure**: A two-column layout for the dashboard.
-   **Navigation**: The header is sticky (`sticky top-0`) with a `z-index` of 10 to ensure it stays above all other content during scrolling.
-   **Responsiveness**: The app uses standard responsive design practices to adapt to different screen sizes.
