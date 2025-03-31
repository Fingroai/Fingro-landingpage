// Type declarations for Tailwind CSS directives
declare module 'tailwindcss' {
  const tailwindcss: any;
  export default tailwindcss;
}

// CSS Module declarations
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

// Add support for @tailwind and @apply directives in CSS
interface CSSRule {
  '@tailwind': string;
  '@apply': string;
  '@layer': string;
}
