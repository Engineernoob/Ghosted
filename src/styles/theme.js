export const theme = {
  colors: {
    bg: '#0a0a0f',
    surface: '#13131d',
    border: '#24243a',
    textPrimary: '#f3f4f6',
    textSecondary: '#9ca3af',
    accentGradient: 'linear-gradient(135deg, #8b5cf6, #6366f1, #3b82f6)',
    fresh: '#10b981',
    warming: '#3b82f6',
    cold: '#f59e0b',
    ghosted: '#ef4444'
  },
  radius: {
    md: '12px',
    lg: '16px'
  },
  shadow: '0 10px 30px rgba(0, 0, 0, 0.35)'
};

export const baseStyles = `
:root {
  --bg: #0a0a0f;
  --surface: #13131d;
  --border: #24243a;
  --text-primary: #f3f4f6;
  --text-secondary: #9ca3af;
  --accent-gradient: linear-gradient(135deg, #8b5cf6, #6366f1, #3b82f6);
  --fresh: #10b981;
  --warming: #3b82f6;
  --cold: #f59e0b;
  --ghosted: #ef4444;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  background: radial-gradient(circle at top right, #1f1442 0%, var(--bg) 40%);
  color: var(--text-primary);
}
button, input, select, textarea { font: inherit; }
`;
