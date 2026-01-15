type FormattedMessageProps = {
  content: string;
};

const FormattedMessage = ({ content }: FormattedMessageProps) => {
  const formatText = (text: string) => {
    const lines = text.split("\n");
    const elements: JSX.Element[] = [];

    lines.forEach((line, index) => {
      let formattedLine = line;

      const bulletMatch = line.match(/^[\s]*[*\-•]\s+(.*)/);
      if (bulletMatch) {
        elements.push(
          <div key={index} className="flex gap-2 ml-2 my-1">
            <span className="text-violet-600 dark:text-violet-400 font-bold">
              •
            </span>
            <span
              className="flex-1"
              dangerouslySetInnerHTML={{
                __html: formatInlineMarkdown(bulletMatch[1]),
              }}
            />
          </div>
        );
        return;
      }

      const numberedMatch = line.match(/^[\s]*(\d+)\.\s+(.*)/);
      if (numberedMatch) {
        elements.push(
          <div key={index} className="flex gap-2 ml-2 my-1">
            <span className="text-violet-600 dark:text-violet-400 font-semibold">
              {numberedMatch[1]}.
            </span>
            <span
              className="flex-1"
              dangerouslySetInnerHTML={{
                __html: formatInlineMarkdown(numberedMatch[2]),
              }}
            />
          </div>
        );
        return;
      }

      if (line.trim() === "") {
        elements.push(<div key={index} className="h-2" />);
        return;
      }

      elements.push(
        <p
          key={index}
          className="my-1"
          dangerouslySetInnerHTML={{
            __html: formatInlineMarkdown(formattedLine),
          }}
        />
      );
    });

    return elements;
  };

  const formatInlineMarkdown = (text: string): string => {
    // Bold: **text** or __text__
    text = text.replace(
      /\*\*(.*?)\*\*/g,
      '<strong class="font-semibold text-neutral-900 dark:text-neutral-100">$1</strong>'
    );
    text = text.replace(
      /__(.*?)__/g,
      '<strong class="font-semibold text-neutral-900 dark:text-neutral-100">$1</strong>'
    );

    // Italic: *text* or _text_ (but not already processed)
    text = text.replace(
      /(?<!\*)\*([^*]+)\*(?!\*)/g,
      '<em class="italic">$1</em>'
    );
    text = text.replace(/(?<!_)_([^_]+)_(?!_)/g, '<em class="italic">$1</em>');

    // Inline code: `code`
    text = text.replace(
      /`([^`]+)`/g,
      '<code class="bg-neutral-200 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>'
    );

    return text;
  };

  return <div className="space-y-1">{formatText(content)}</div>;
};

export default FormattedMessage;
