
export namespace BookmarkProvider {

    export type Bookmark = {
        address: string;
        port: number;
        name: string;
    }    

    var bookmarkList: Array<Bookmark> = loadList();

    function loadList(): Array<Bookmark> {
        const storedData = localStorage.getItem('rabbit-bookmarks');

        if (storedData === null) {
            return [];
        }

        return JSON.parse(storedData);
    }

    function persistList(): void {
        window.dispatchEvent(new Event('rabbit-bookmarks-storage-update'));
        localStorage.setItem('rabbit-bookmarks', JSON.stringify(bookmarkList));
    }

    export function bookmarkExists(bookmark: Bookmark): boolean {
        return bookmarkList.some(existingBookmark => {
            return existingBookmark.address === bookmark.address &&
                existingBookmark.port === bookmark.port &&
                existingBookmark.name === bookmark.name;
        })
    }

    export function getBookmarks(): Array<Bookmark> {
        return bookmarkList;
    }

    export function storeBookmark(bookmark: Bookmark): void {
        if (bookmarkExists(bookmark)) {
            return;
        }

        bookmarkList.push(bookmark);

        persistList();
    }

    export function deleteBookmark(bookmark: Bookmark): void {
        const bookmarkPosition = bookmarkList.indexOf(bookmark);
        
        if (bookmarkPosition === -1) {
            console.warn('Failed to find bookmark to delete', bookmark);
            return;
        }

        bookmarkList.splice(bookmarkPosition, 1);

        persistList();
    }
}