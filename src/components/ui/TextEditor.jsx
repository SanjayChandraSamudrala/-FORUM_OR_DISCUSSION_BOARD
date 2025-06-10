import { useState, useRef } from 'react';
import { Smile } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

const TextEditor = ({ value, onChange, isResponse = false }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef(null);

  const insertFormat = (format) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    let prefix = '';
    let suffix = '';

    switch (format) {
      case 'bold':
        prefix = '**';
        suffix = '**';
        break;
      case 'italic':
        prefix = '_';
        suffix = '_';
        break;
      case 'list':
        prefix = '\n- ';
        break;
      case 'numbered-list':
        prefix = '\n1. ';
        break;
      case 'link':
        const url = prompt('Enter URL:');
        if (url) {
          prefix = '[';
          suffix = `](${url})`;
        }
        break;
      default:
        return;
    }

    const selectedText = text.substring(start, end);
    const beforeText = text.substring(0, start);
    const afterText = text.substring(end);

    const newText = beforeText + prefix + selectedText + suffix + afterText;
    const newCursorPos = start + prefix.length + selectedText.length + suffix.length;

    onChange(newText);

    // Set cursor position after format is applied
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const onEmojiClick = (emojiData) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const text = textarea.value;
    const newText = text.slice(0, start) + emojiData.emoji + text.slice(start);
    
    onChange(newText);
    setShowEmojiPicker(false);

    // Set cursor position after emoji
    setTimeout(() => {
      const newCursorPos = start + emojiData.emoji.length;
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-2 p-2 rounded-lg bg-gray-800/50">
        <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
          <PopoverTrigger asChild>
            <button
              className="text-gray-400 hover:text-white transition-colors"
              title="Insert emoji"
            >
              <Smile size={20} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 border-none">
            <EmojiPicker
              onEmojiClick={onEmojiClick}
              theme="dark"
              width="100%"
              height={400}
            />
          </PopoverContent>
        </Popover>
      </div>

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-h-[100px] bg-gray-800/30 rounded-lg p-3 text-white placeholder-gray-400 resize-y"
        placeholder={isResponse ? "Write your response..." : "Write your post..."}
      />
    </div>
  );
};

export default TextEditor; 