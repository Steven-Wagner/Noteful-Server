const FoldersService = {
    getAllFolders(knex) {
        return knex('noteful_folders')
            .select('*')
    },
    getFolderById(knex, id) {
        return knex('noteful_folders')
            .select('*')
            .where('id', id)
            .first()
    },
    postNewFolder(knex, newFolder) {
        return knex
            .into('noteful_folders')
            .insert(newFolder)
            .returning('*')
            .then(folder => {
                return folder[0]
            })
    },
    patchFolder(knex, id, update) {
        return knex('noteful_folders')
            .where('id', id)
            .update(update)
    },
    deleteById(knex, id) {
        return knex('noteful_folders')
            .where('id', id)
            .delete()
    }
}

module.exports = FoldersService;