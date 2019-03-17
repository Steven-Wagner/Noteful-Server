const NotesService = {
    getAllNotes(knex) {
        return knex('noteful_notes')
            .select('*')
    },
    getNoteById(knex, id) {
        return knex('noteful_notes')
            .select('*')
            .where('id', id)
            .first()
    },
    postNewNote(knex, newNote) {
        return knex
            .into('noteful_notes')
            .insert(newNote)
            .returning('*')
            .then(note => {
                return note[0]
            })
    },
    patchNote(knex, id, update) {
        return knex('noteful_notes')
            .where('id', id)
            .update(update)
    },
    deleteById(knex, id) {
        return knex('noteful_notes')
            .where('id', id)
            .delete()
    }
}

module.exports = NotesService;