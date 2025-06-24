export default function Citation() {
  return (
    <div className="mt-8 p-4 border-t border-zinc-700 pt-8">
      <h3 className="text-sm font-semibold text-zinc-300 mb-3">데이터 출처 및 라이센스</h3>
      <div className="text-sm text-zinc-400 space-y-2">
        <p>
          <strong className="text-zinc-300">Citation:</strong>{' '}
          Epoch AI, 'AI Benchmarking Hub'. Published online at epoch.ai. 
          Retrieved from{' '}
          <a 
            href="https://epoch.ai/data/ai-benchmarking-dashboard" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            https://epoch.ai/data/ai-benchmarking-dashboard
          </a>
          {' '}[online resource]. Accessed 24 Jun 2025.
        </p>
        <p>
          <strong className="text-zinc-300">라이센스:</strong>{' '}
          이 데이터는 CC BY 라이센스 하에 제공됩니다.
        </p>
      </div>
    </div>
  );
} 