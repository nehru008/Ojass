const LoadingSpinner = ({ size = 24, className = '' }) => (
  <div
    className={`inline-block rounded-full ${className}`}
    style={{
      width: size,
      height: size,
      border: '2px solid rgba(255,255,255,0.15)',
      borderTopColor: 'var(--red)',
      animation: 'spin 1s linear infinite',
    }}
  />
);

export default LoadingSpinner;