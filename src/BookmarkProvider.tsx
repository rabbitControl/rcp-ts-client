
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

    export function getBookmarks(): Array<Bookmark> {
        return bookmarkList;
    }

    export function storeBookmark(bookmark: Bookmark): void {
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