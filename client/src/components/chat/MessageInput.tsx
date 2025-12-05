import React, { FormEvent, useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from '../../features/messagesSlice';
import { RootState } from '../../store/store';
import { useSocket } from '../../hooks/useSocket';
import { useTyping } from '../../hooks/useTyping';
import { EmojiPickerButton } from '../common/EmojiPicker';
import { FileUpload } from '../common/FileUpload';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

interface Props {
  channelId: string;
}

const MessageInput: React.FC<Props> = ({ channelId }) => {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const socket = useSocket();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const { emitTyping, stopTyping } = useTyping(channelId);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (e.target.value.trim()) {
      emitTyping();
    } else {
      stopTyping();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e as any);
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setText((prev) => prev + emoji);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleFileUploaded = (url: string) => {
    setAttachments((prev) => [...prev, url]);
  };

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    if ((!text.trim() && attachments.length === 0) || !user) return;

    const payload = {
      id: crypto.randomUUID(),
      content: text,
      channelId,
      senderId: user.id,
      attachments: attachments.length > 0 ? attachments : undefined,
      createdAt: new Date().toISOString(),
    };

    dispatch(addMessage(payload));
    socket?.emit('message:send', payload);
    setText('');
    setAttachments([]);
    stopTyping();
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  return (
    <div className="border-t border-gray-200 p-4">
      {attachments.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {attachments.map((url, index) => (
            <div key={index} className="relative">
              <img
                src={url}
                alt={`Attachment ${index + 1}`}
                className="h-20 w-20 object-cover rounded"
              />
              <button
                onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      <form onSubmit={handleSend} className="flex items-end space-x-2">
        <div className="flex-1 flex items-end space-x-2 border border-gray-300 rounded-lg p-2 focus-within:ring-2 focus-within:ring-blue-500">
          <EmojiPickerButton onEmojiClick={handleEmojiClick} />
          <FileUpload onFileUploaded={handleFileUploaded} />
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Message..."
            rows={1}
            className="flex-1 resize-none border-none focus:outline-none max-h-32 overflow-y-auto"
          />
        </div>
        <button
          type="submit"
          disabled={!text.trim() && attachments.length === 0}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PaperAirplaneIcon className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;

