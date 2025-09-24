# AI Development Rules for Link Hub Creator

This document outlines the rules and conventions for the AI assistant to follow when developing and modifying this application. The goal is to maintain code quality, consistency, and simplicity.

## Tech Stack Overview

This project is built with a modern, lightweight tech stack. Adhere to these technologies:

*   **Framework**: React, built with Vite.
*   **Language**: TypeScript for type safety and better developer experience.
*   **Routing**: `react-router-dom` is used for all client-side routing.
*   **Styling**: Tailwind CSS is the exclusive styling solution.
*   **UI Components**: The primary component library is **shadcn/ui**.
*   **Icons**: All icons should be sourced from the `lucide-react` library.
*   **State Management**: State is managed using React's built-in hooks (`useState`, `useEffect`, `useContext`) and the custom `useLocalStorage` hook for persistence.
*   **Code Structure**: The application follows a standard React structure with components in `src/components/`, pages in `src/pages/`, and hooks in `src/hooks/`.

## Development Rules & Library Usage

Follow these rules strictly to ensure consistency.

### 1. UI Components: Use shadcn/ui

*   **Rule**: For any new UI element (Buttons, Inputs, Cards, Dialogs, etc.), you **MUST** use a component from the shadcn/ui library.
*   **Reasoning**: This ensures a consistent design system, accessibility, and reduces the need to build and maintain custom components.
*   **Example**: Instead of creating a custom `<Button>` component, import and use the `Button` from `src/components/ui/button`.

### 2. Styling: Tailwind CSS Only

*   **Rule**: All styling **MUST** be done with Tailwind CSS utility classes. Do not write custom CSS files or use inline `style` objects unless it's for a dynamic property that cannot be handled by Tailwind (e.g., dynamic colors from user input).
*   **Reasoning**: Keeps styling co-located with the markup, making components self-contained and easier to manage.

### 3. Icons: Use `lucide-react`

*   **Rule**: For all icons, you **MUST** use the `lucide-react` library. Do not create new custom SVG icon components.
*   **Reasoning**: `lucide-react` provides a comprehensive, consistent, and tree-shakable set of icons.

### 4. Routing: `react-router-dom`

*   **Rule**: All routing logic, including defining new pages and navigation, **MUST** be handled using `react-router-dom`.
*   **Convention**: Keep all top-level route definitions within the `src/App.tsx` file for clarity.

### 5. State Management: Keep it Simple

*   **Rule**: Use React's built-in hooks for state management.
    *   Use `useState` for local component state.
    *   Use `useContext` for simple global state that needs to be shared across a few components.
    *   Use the existing `useLocalStorage` hook for data that needs to persist across browser sessions.
*   **Constraint**: Do **NOT** add complex state management libraries like Redux or Zustand without explicit user permission.

### 6. File Structure

*   **Components**: All reusable components go into `src/components/`.
*   **Pages**: All top-level page components should go into `src/pages/`.
*   **Hooks**: Custom hooks go into `src/hooks/`.
*   **Types**: TypeScript types should be defined in `src/types.ts`.
*   **Simplicity**: Prioritize creating small, focused files and components. Avoid creating "god components" that do too much.