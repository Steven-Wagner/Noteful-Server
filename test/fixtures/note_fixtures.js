function makeTestNotes() {
    return [
        {notes_name: 'Fogs',
        id: 1,
        content: 'I love Fogs',
        modified: "2019-03-17T21:22:26.221Z",
        folder_id: 1
        },
        {notes_name: 'Cats',
        id: 2,
        content: 'I love cats',
        modified: "2019-03-17T21:22:26.221Z",
        folder_id: 2
        },
        {notes_name: 'Pigs',
        id: 3,
        content: 'Pigs are cool',
        modified: "2019-03-17T21:22:26.221Z",
        folder_id: 3
        },
        {notes_name: 'Wombats',
        id: 4,
        content: 'Wombats are neither wombs nor bats',
        modified: "2019-03-17T21:22:26.221Z",
        folder_id: 1
        },
        {notes_name: 'Fish',
        id: 5,
        content: 'Fish can swim',
        modified: "2019-03-17T21:22:26.221Z",
        folder_id: 3
        },
    ]
}

function newNoteTest() {
    return {
    notes_name: 'Wilber',
    content: 'Wilber is a pig',
    folder_id: 3
    }
}

function updateNote() {
    return {
        notes_name: 'Update name',
        content: 'Updated content',
    }
}

function expectedUpdateNote() {
    return {
        notes_name: 'Update name',
        content: 'Updated content',
        modified: "2019-03-17T21:22:26.221Z",
        folder_id: 2,
        id: 2
    }
}

module.exports = {makeTestNotes, newNoteTest, updateNote, expectedUpdateNote}