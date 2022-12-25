
export namespace ConnectionHistoryProvider {

    export type Bookmark = {
        address: string;
        port: number;
        name: string;
        tabsInRoot: boolean;
        isFavourite: boolean;
        lastConnected: Date;
        applicationId: string;
    }

    var connectionList: Array<Bookmark> = loadList();

    function loadList(): Array<Bookmark> {
        const storedData = localStorage.getItem('rabbit-connection-history');

        if (storedData === null) {
            return [];
        }

        const parsedData = JSON.parse(storedData).map((entry: Bookmark) => {
            entry.lastConnected = new Date(entry.lastConnected);
            return entry;
        });

        return parsedData;
    }

    function persistList(): void {
        window.dispatchEvent(new Event('rabbit-connection-history-storage-update'));
        localStorage.setItem('rabbit-connection-history', JSON.stringify(connectionList));
    }

    export function getList(): Array<Bookmark> {
        return connectionList;
    }

    export function storeEntry(entry: Bookmark): void {
        connectionList.push(entry);

        persistList();
    }

    export function recordOrUpdateEntry(address: string, port: number, tabsInRoot: boolean): void {
        const identicalEntryIndex = connectionList.findIndex(entry => {
            return address === entry.address && port === entry.port && tabsInRoot === entry.tabsInRoot
        });

        const identicalEntryFound = identicalEntryIndex >= 0;
        if (identicalEntryFound) {
            connectionList[identicalEntryIndex].lastConnected = new Date();
            persistList();
            return;
        }

        const newEntry: Bookmark = {
            address: address,
            port: port,
            tabsInRoot: tabsInRoot,
            name: "",
            isFavourite: false,
            lastConnected: new Date(),
            applicationId: "",
        }

        connectionList.push(newEntry);
        persistList();
    }

    export function setApplicationIdForEntry(
        address: string, 
        port: number, 
        tabsInRoot: boolean,
        applicationId: string
    ): void {
        const entryIndex = connectionList.findIndex(entry => {
            return address === entry.address && port === entry.port && tabsInRoot === entry.tabsInRoot
        });
        
        if (entryIndex === -1) {
            console.warn('Failed to find entry to update');
            return;
        }

        connectionList[entryIndex].applicationId = applicationId;
        persistList();
    }

    export function deleteEntry(entry: Bookmark): void {
        const entryPosition = connectionList.indexOf(entry);
        
        if (entryPosition === -1) {
            console.warn('Failed to find entry to delete', entry);
            return;
        }

        connectionList.splice(entryPosition, 1);

        persistList();
    }

    export function toggleIsFavourite(entry: Bookmark): void {
        const entryPosition = connectionList.indexOf(entry);
        
        if (entryPosition === -1) {
            console.warn('Failed to find entry to update', entry);
            return;
        }

        connectionList[entryPosition].isFavourite = !connectionList[entryPosition].isFavourite;
        persistList();
    }

    export function setName(entry: Bookmark, name: string): void {
        const entryPosition = connectionList.indexOf(entry);
        
        if (entryPosition === -1) {
            console.warn('Failed to find entry to update', entry);
            return;
        }

        connectionList[entryPosition].name = name;
        persistList();
    }
}