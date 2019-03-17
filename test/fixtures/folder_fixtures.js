function makeTestFolders() {
    return [
        {name: 'Important',
        id: 1
        },
        {name: 'Super',
        id: 2
        },
        {name: 'Spangley',
        id: 3
        }
    ]
}

function newFolderTest() {
    return {
        name: 'New Folder'
    }
}

function badNewFolderTest(){
    return {
        name: ''
    }
}

module.exports = {makeTestFolders, newFolderTest, badNewFolderTest}