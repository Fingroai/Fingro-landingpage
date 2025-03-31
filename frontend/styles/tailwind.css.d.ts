// Declaraciones de tipo para directivas de Tailwind CSS
declare module 'tailwindcss/tailwind.css' {
  const styles: any;
  export default styles;
}

// Soporte para directivas @tailwind y @apply en CSS
interface CSSAtRule {
  '@tailwind': any;
  '@apply': any;
  '@layer': any;
  '@variants': any;
  '@responsive': any;
  '@screen': any;
}

// Soporte para clases de Tailwind
interface CSSProperties {
  [key: string]: any;
}
