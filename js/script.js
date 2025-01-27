document.addEventListener('DOMContentLoaded', () => {
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    savedNotes.forEach(note => addNoteToDOM(note.text, note.checked, note.date));

    document.getElementById('addButton').addEventListener('click', () => {
        const newNoteText = document.getElementById('newNote').value;
        if (newNoteText.trim() !== '') {
            const formattedDate = formatDate(new Date());
            addNoteToDOM(newNoteText, false, formattedDate);
            saveNotes();
            document.getElementById('newNote').value = '';
        }
    });
});

function addNoteToDOM(text, checked, date) {
    const notesDiv = document.getElementById('notes');
    const noteDiv = document.createElement('div');
    noteDiv.className = 'note';

    noteDiv.innerHTML = `
        <div class="note-header">
            <input type="checkbox" ${checked ? 'checked' : ''}>
            <input type="text" value="${text}" disabled ${checked ? 'class="checked"' : ''}>
            <button class="edit-button" style="background: transparent; color: white; border: none; ${checked ? 'display: none;' : ''}"><i class="fa fa-pencil"></i></button>
            <button style="background: transparent; color: white; border: none;"><i class="fa fa-trash"></i></button>
        </div>
        <div class="note-date">${date}</div>
    `;

    const checkbox = noteDiv.querySelector('input[type="checkbox"]');
    const noteInput = noteDiv.querySelector('input[type="text"]');
    const editButton = noteDiv.querySelector('.edit-button');
    const deleteButton = noteDiv.querySelector('button:last-of-type');

    checkbox.addEventListener('change', () => {
        noteInput.classList.toggle('checked', checkbox.checked);
        editButton.style.display = checkbox.checked ? 'none' : 'inline';
        saveNotes();
    });

    editButton.addEventListener('click', () => {
        noteInput.disabled = !noteInput.disabled;
        editButton.innerHTML = noteInput.disabled ? '<i class="fa fa-pencil"></i>' : '<i class="fa fa-check"></i>';
    });

    deleteButton.addEventListener('click', () => {
        notesDiv.removeChild(noteDiv);
        saveNotes();
    });

    notesDiv.appendChild(noteDiv);
}

function saveNotes() {
    const notes = Array.from(document.querySelectorAll('.note')).map(noteDiv => ({
        text: noteDiv.querySelector('input[type="text"]').value,
        checked: noteDiv.querySelector('input[type="checkbox"]').checked,
        date: noteDiv.querySelector('.note-date').innerText
    }));
    localStorage.setItem('notes', JSON.stringify(notes));
}

function formatDate(date) {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} - ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')} WIB`;
}