"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

export default function RichTextEditor({ content, setContent }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  return (
    <div className="border border-gray-300 rounded-md p-2">
      {editor && (
        <div className="flex gap-2 mb-2">
          <button onClick={() => editor.chain().focus().toggleBold().run()} className="px-2 py-1 border rounded hover:bg-gray-200">Bold</button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()} className="px-2 py-1 border rounded hover:bg-gray-200">Italic</button>
          <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="px-2 py-1 border rounded hover:bg-gray-200">List</button>
          <button onClick={() => editor.chain().focus().setParagraph().run()} className="px-2 py-1 border rounded hover:bg-gray-200">Paragraph</button>
        </div>
      )}
      <EditorContent editor={editor} className="min-h-[150px]" />
    </div>
  );
}
