'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useState, useEffect } from 'react';

const RichTextEditor = ({ value, onChange, placeholder = 'Write something...' }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4 rounded-lg',
      },
    },
  });

  // Update editor content when value changes externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  if (!isClient || !editor) {
    return (
      <div className="form-input" style={{ minHeight: '200px', padding: '1rem' }}>
        Loading editor...
      </div>
    );
  }

  return (
    <div className="rich-text-editor" style={{ 
      border: '1px solid var(--border-color)',
      borderRadius: '12px',
      overflow: 'hidden',
      background: 'var(--bg-color)'
    }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.3rem',
        padding: '0.5rem',
        borderBottom: '1px solid var(--border-color)',
        background: 'var(--bg-card)'
      }}>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'active' : ''}
          style={{
            padding: '0.3rem 0.6rem',
            borderRadius: '6px',
            border: '1px solid transparent',
            background: editor.isActive('bold') ? 'var(--primary-bg)' : 'transparent',
            color: editor.isActive('bold') ? 'var(--primary-color)' : 'var(--text-color)',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          <i className="fas fa-bold"></i>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'active' : ''}
          style={{
            padding: '0.3rem 0.6rem',
            borderRadius: '6px',
            border: '1px solid transparent',
            background: editor.isActive('italic') ? 'var(--primary-bg)' : 'transparent',
            color: editor.isActive('italic') ? 'var(--primary-color)' : 'var(--text-color)',
            cursor: 'pointer',
            fontStyle: 'italic'
          }}
        >
          <i className="fas fa-italic"></i>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? 'active' : ''}
          style={{
            padding: '0.3rem 0.6rem',
            borderRadius: '6px',
            border: '1px solid transparent',
            background: editor.isActive('strike') ? 'var(--primary-bg)' : 'transparent',
            color: editor.isActive('strike') ? 'var(--primary-color)' : 'var(--text-color)',
            cursor: 'pointer',
            textDecoration: 'line-through'
          }}
        >
          <i className="fas fa-strikethrough"></i>
        </button>
        <div style={{ width: '1px', background: 'var(--border-color)', margin: '0 0.3rem' }}></div>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'active' : ''}
          style={{
            padding: '0.3rem 0.6rem',
            borderRadius: '6px',
            border: '1px solid transparent',
            background: editor.isActive('heading', { level: 1 }) ? 'var(--primary-bg)' : 'transparent',
            color: editor.isActive('heading', { level: 1 }) ? 'var(--primary-color)' : 'var(--text-color)',
            cursor: 'pointer',
            fontWeight: 700
          }}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'active' : ''}
          style={{
            padding: '0.3rem 0.6rem',
            borderRadius: '6px',
            border: '1px solid transparent',
            background: editor.isActive('heading', { level: 2 }) ? 'var(--primary-bg)' : 'transparent',
            color: editor.isActive('heading', { level: 2 }) ? 'var(--primary-color)' : 'var(--text-color)',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'active' : ''}
          style={{
            padding: '0.3rem 0.6rem',
            borderRadius: '6px',
            border: '1px solid transparent',
            background: editor.isActive('heading', { level: 3 }) ? 'var(--primary-bg)' : 'transparent',
            color: editor.isActive('heading', { level: 3 }) ? 'var(--primary-color)' : 'var(--text-color)',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          H3
        </button>
        <div style={{ width: '1px', background: 'var(--border-color)', margin: '0 0.3rem' }}></div>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'active' : ''}
          style={{
            padding: '0.3rem 0.6rem',
            borderRadius: '6px',
            border: '1px solid transparent',
            background: editor.isActive('bulletList') ? 'var(--primary-bg)' : 'transparent',
            color: editor.isActive('bulletList') ? 'var(--primary-color)' : 'var(--text-color)',
            cursor: 'pointer'
          }}
        >
          <i className="fas fa-list-ul"></i>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'active' : ''}
          style={{
            padding: '0.3rem 0.6rem',
            borderRadius: '6px',
            border: '1px solid transparent',
            background: editor.isActive('orderedList') ? 'var(--primary-bg)' : 'transparent',
            color: editor.isActive('orderedList') ? 'var(--primary-color)' : 'var(--text-color)',
            cursor: 'pointer'
          }}
        >
          <i className="fas fa-list-ol"></i>
        </button>
        <div style={{ width: '1px', background: 'var(--border-color)', margin: '0 0.3rem' }}></div>
        <button
          onClick={() => {
            const url = prompt('Enter URL:');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          className={editor.isActive('link') ? 'active' : ''}
          style={{
            padding: '0.3rem 0.6rem',
            borderRadius: '6px',
            border: '1px solid transparent',
            background: editor.isActive('link') ? 'var(--primary-bg)' : 'transparent',
            color: editor.isActive('link') ? 'var(--primary-color)' : 'var(--text-color)',
            cursor: 'pointer'
          }}
        >
          <i className="fas fa-link"></i>
        </button>
        <button
          onClick={() => editor.chain().focus().unsetLink().run()}
          style={{
            padding: '0.3rem 0.6rem',
            borderRadius: '6px',
            border: '1px solid transparent',
            background: 'transparent',
            color: 'var(--text-color)',
            cursor: 'pointer'
          }}
        >
          <i className="fas fa-unlink"></i>
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent 
        editor={editor} 
        style={{
          padding: '0.5rem',
          minHeight: '200px',
          background: 'var(--bg-color)',
          color: 'var(--text-color)'
        }}
      />
    </div>
  );
};

export default RichTextEditor;
