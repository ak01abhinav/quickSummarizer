# QuickSummarizer Project Details

QuickSummarizer is a modern, high-performance web application designed for rapid content summarization using AI. Built with a focus on speed, accessibility, and a premium user experience, it leverages the latest web technologies.

## 🚀 Core Tech Stack

| Technology | Purpose | Key Benefits |
| :--- | :--- | :--- |
| **Next.js 15+** | Full-stack Framework | Uses the **App Router** for modern routing and Server Components for performance. |
| **React 19** | UI Library | The latest version of React, providing a modular and declarative component structure. |
| **TypeScript** | Programming Language | Adds static typing to JavaScript, reducing bugs and improving developer experience. |
| **Tailwind CSS** | Styling | A utility-first CSS framework for rapid UI development and consistent design. |
| **shadcn/ui** | UI Components | Built on **Radix UI**, providing accessible and customizable UI components. |

## 🛠️ Specialized Libraries & Tools

*   **Icons**: [Lucide React](https://lucide.dev) and `react-icons` for a professional, consistent icon set.
*   **Markdown Processing**: [React Markdown](https://github.com/remarkjs/react-markdown) and `remark-gfm` to render formatted AI-generated summaries.
*   **Dark Mode**: [Next Themes](https://github.com/pacocoursey/next-themes) for automatic light/dark theme switching.
*   **Performance Utilities**: 
    *   `clsx` & `tailwind-merge`: For conflict-free Tailwind management.
    *   `class-variance-authority`: For variant-based UI components (CVA).

## 📂 Project Structure

The project is organized using a clean, domain-driven architecture within the `src/` directory:

- **`src/app/`**: Core application logic and routes (`api/chat`, `api/summarize`).
- **`src/components/`**: Modular UI components (Layout, Home, and UI/shadcn).
- **`src/lib/`**: Central utilities, shared constants, and mock data.
- **`src/styles/`**: Global theme and layout styles.
- **`src/types/`**: Project-wide TypeScript interface definitions.

## 🎯 Project Goals
1.  **Speed**: Deliver instant summaries for long-form content.
2.  **Precision**: Provide high-accuracy results powered by advanced AI models.
3.  **UI/UX**: Offer a sleek, responsive, and intuitive interface for any device.

---

*Last updated: March 30, 2026*
