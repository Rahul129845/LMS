interface AlertProps {
  type: 'error' | 'success' | 'info';
  message: string;
}

const colors = {
  error: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', text: '#fca5a5' },
  success: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', text: '#6ee7b7' },
  info: { bg: 'rgba(108,99,255,0.1)', border: 'rgba(108,99,255,0.3)', text: '#a78bfa' },
};

export function Alert({ type, message }: AlertProps) {
  const c = colors[type];
  return (
    <div style={{
      background: c.bg,
      border: `1px solid ${c.border}`,
      borderRadius: '10px',
      padding: '12px 16px',
      color: c.text,
      fontSize: '14px',
      marginBottom: '16px',
    }}>
      {message}
    </div>
  );
}
