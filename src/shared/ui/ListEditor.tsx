// Ô nhập danh sách mỗi dòng một mục; chỉ áp dụng khi bấm lưu để không làm gián đoạn ván đang chơi
'use client';

import { useEffect, useState } from 'react';
import { FaCheck } from 'react-icons/fa6';
import { parseLines } from '../lib/utils';
import Button from './Button';

interface ListEditorProps {
  items: string[];
  onSave: (items: string[]) => void;
  label: string;
  placeholder?: string;
  saveLabel?: string;
  unique?: boolean;
  disabled?: boolean;
}

export default function ListEditor({
  items,
  onSave,
  label,
  placeholder = 'Mỗi dòng một mục...',
  saveLabel = 'Cập nhật danh sách',
  unique = false,
  disabled = false,
}: ListEditorProps) {
  const [draft, setDraft] = useState(() => items.join('\n'));

  useEffect(() => {
    setDraft(items.join('\n'));
  }, [items]);

  const parsed = parseLines(draft, { unique });
  const isDirty = parsed.join('\n') !== items.join('\n');

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="eyebrow">{label}</span>
        {draft && !disabled && (
          <button type="button" onClick={() => setDraft('')} className="text-action hover:text-ramp-text-3">
            Xoá hết
          </button>
        )}
      </div>
      <textarea
        aria-label={label}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={5}
        className="field scrollbar-soft resize-y font-semibold leading-7"
      />
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-muted">{parsed.length} mục</span>
        <Button size="sm" disabled={disabled || !isDirty} onClick={() => onSave(parsed)}>
          <FaCheck className="h-3 w-3" />
          {saveLabel}
        </Button>
      </div>
    </div>
  );
}
