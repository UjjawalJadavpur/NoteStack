"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function RichTextEditor({
  content,
  setContent,
  readOnly = false,
  placeholder = "Write your note here...",
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content || "",
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (html !== content) {
        setContent(html);
      }
    },
  });

  // Keep TipTap state in sync with `content` prop
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false); // false = no history entry
    }
  }, [content, editor]);

  if (!editor) return <div className="text-gray-400">Loading editor...</div>;

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
      <EditorContent
        editor={editor}
        className={`p-3 prose prose-sm max-w-none ${readOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
      />
    </div>
  );
}
