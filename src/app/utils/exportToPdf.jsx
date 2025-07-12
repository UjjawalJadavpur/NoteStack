"use client";

export async function exportNoteToPDF(note) {
  if (typeof window === "undefined") return; // Prevents SSR execution

  const html2pdf = (await import("html2pdf.js")).default;

  const element = document.createElement("div");
  element.innerHTML = `
    <h1>${note.title}</h1>
    <div>${note.content}</div>
    <p style="margin-top:20px;font-size:0.8rem;">Created at: ${new Date(
      note.createdAt
    ).toLocaleString()}</p>
  `;

  const options = {
    margin: 0.5,
    filename: `${note.title || "note"}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
  };

  html2pdf().from(element).set(options).save();
}
