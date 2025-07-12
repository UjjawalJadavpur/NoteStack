export function getNoteCategory(dateStr) {
  const noteDate = new Date(dateStr);
  const today = new Date();

  const noteDay = noteDate.toDateString();
  const todayDay = today.toDateString();

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayDay = yesterday.toDateString();

  if (noteDay === todayDay) return "Today";
  if (noteDay === yesterdayDay) return "Yesterday";
  return "Past";
}

export function groupNotes(notes) {
  return notes
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .reduce((groups, note) => {
      const category = getNoteCategory(note.createdAt);
      if (!groups[category]) groups[category] = [];
      groups[category].push(note);
      return groups;
    }, {});
}
