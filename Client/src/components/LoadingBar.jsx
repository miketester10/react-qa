

const LoadingBar = () => {
  return (
    <div style={{ width: '100%', height: '6px', backgroundColor: '#f0f0f0', position: 'relative', overflow: 'hidden' }}>
      <div style={{ width: '100%', height: '100%', backgroundColor: '#4CAF50', position: 'absolute', top: '0', left: '-1%', animation: 'loading 1s linear infinite' }}></div>
      <style>{`
        @keyframes loading {
          0% { left: -100%; }
          50% { left: 100%; }
          100% { left: 100%; }
          
        }
      `}</style>
    </div>
  );
}

export default LoadingBar;


