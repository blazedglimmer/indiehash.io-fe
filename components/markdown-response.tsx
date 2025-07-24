
const MarkdownResponse = ({ content }: { content: string }) => {
  // Simple markdown-like rendering for bold, links, and bullets
  const lines = content.split('\n');
  return (
    <div className="prose prose-invert max-w-none text-gray-100">
      {lines.map((line, idx) => {
        if (line.startsWith('- ')) {
          // Bullet
          const match = line.match(/\*\*(.*?)\*\*/);
          const bold = match ? match[1] : null;
          const rest = line.replace(/- \*\*(.*?)\*\*/, '').trim();
          const linkMatch = line.match(/\[Watch here\]\((.*?)\)/);
          return (
            <li key={idx} className="mb-2">
              {bold && <span className="font-semibold text-white">{bold}</span>}{' '}
              <span>{rest.replace(/\[Watch here\]\(.*?\)/, '')}</span>
              {linkMatch && (
                <a
                  href={linkMatch[1]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-primary underline hover:text-primary-light"
                >
                  Watch here
                </a>
              )}
            </li>
          );
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return (
            <div key={idx} className="font-bold text-lg mt-6 mb-2 text-white">
              {line.replace(/\*\*/g, '')}
            </div>
          );
        }
        if (line.trim() === '') return null;
        return <div key={idx}>{line}</div>;
      })}
    </div>
  );
};

export default MarkdownResponse; 