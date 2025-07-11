"use client";

import dynamic from "next/dynamic";
import "suneditor/dist/css/suneditor.min.css";

// Dynamically load SunEditor (SSR-safe for Next.js App Router)
const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

export default function RichTextEditor({ content, setContent }) {
  return (
    <SunEditor
      defaultValue={content}
      setContents={content}
      onChange={setContent}
      height="300px"
      setOptions={{
        buttonList: [
          ["undo", "redo"],
          ["formatBlock"],
          ["bold", "italic", "underline", "strike"],
          ["fontSize", "fontColor", "hiliteColor"],
          ["align", "list", "table"],
          ["link", "image", "codeView"],
        ],
        fontSize: [12, 14, 16, 18, 24, 32],
        imageUploadUrl: "http://localhost:8080/api/upload", // Your Spring Boot endpoint
        imageUploadHeader: {}, // For JWT tokens if needed
      }}
    />
  );
}
