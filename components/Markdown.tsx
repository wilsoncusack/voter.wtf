import React from 'react';
import ReactMarkdown from 'react-markdown';

export function Markdown({ text }: { text: string }) {
  return (
    <div className="whitespace-pre-line">
      {' '}
      <ReactMarkdown
        components={{
          a: ({ ...props }) => (
            <a
              style={{
                wordBreak: 'break-word',
                textDecoration: 'underline',
              }}
              {...props}
            />
          ),
          blockquote: ({ ...props }) => (
            <blockquote
              className="pl-4 border-l-4 border-gray-400 italic"
              {...props}
            />
          ),
          p: ({ children, ...props }) => {
            const newChildren = [];
            children.forEach(child => {
              if (typeof child === 'string') {
                const parts = child.split(' ');
                parts.forEach((part, index) => {
                  if (part.length > 20) {
                    newChildren.push(
                      <span style={{ wordBreak: 'break-all' }}>{part}</span>
                    );
                  } else {
                    newChildren.push(part);
                  }
                  if (index !== parts.length - 1) {
                    newChildren.push(' ');
                  }
                });
              } else {
                newChildren.push(child);
              }
            });
            return <p {...props}>{newChildren}</p>;
          },
          code: ({ inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <pre style={{ whiteSpace: 'pre-wrap' }} {...props}>
                <code className={`language-${match[1]}`}>{children}</code>
              </pre>
            ) : (
              <code style={{ whiteSpace: 'pre-wrap' }} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
