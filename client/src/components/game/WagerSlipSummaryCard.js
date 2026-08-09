const SummaryCard = ({ label, value, sub, accent }) => {
  return (
    <div
      style={{
        background: '#0f1218',
        border: '1px solid #1a1e2a',
        borderRadius: '8px',
        padding: '16px 20px',
        flex: 1,
        minWidth: '120px',
      }}
    >
      <div
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: '10px',
          color: '#6b7a94',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: '6px',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: '28px',
          fontWeight: 700,
          color: accent || '#e2e8f0',
          lineHeight: 1,
          letterSpacing: '0.02em',
        }}
      >
        {value}
      </div>
      {sub && (
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '11px',
            color: '#5a6478',
            marginTop: '4px',
          }}
        >
          {sub}
        </div>
      )}
    </div>
  )
}
export default SummaryCard;