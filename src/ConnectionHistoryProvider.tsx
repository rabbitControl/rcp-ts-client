
export namespace ConnectionHistoryProvider {

    export type HistoryItem = {
        address: string;
        port: number;
        name: string;
        tabsInRoot: boolean;
        isFavourite: boolean;
        lastConnected: Date;
        applicationId: string;
    }

    export const RCP_HISTORY_UPDATE_KEY = 'rabbit-connection-history-storage-update';
    const RCP_HISTORY_KEY = 'rabbit-connection-history';
    
    var connectionList: Array<HistoryItem> = loadList();

    function loadList(): Array<HistoryItem> {
        const storedData = localStorage.getItem(RCP_HISTORY_KEY);

        if (storedData === null) {
            return [];
        }

        const parsedData = JSON.parse(storedData).map((entry: HistoryItem) => {
            entry.lastConnected = new Date(entry.lastConnected);
            return entry;
        });

        return parsedData;
    }

    function persistList(): void {
        window.dispatchEvent(new Event(RCP_HISTORY_UPDATE_KEY));
        localStorage.setItem(RCP_HISTORY_KEY, JSON.stringify(connectionList));
    }

    export function getList(): Array<HistoryItem> {
        return connectionList;
    }

    export function storeEntry(entry: HistoryItem): void {
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

        const newEntry: HistoryItem = {
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

    export function deleteEntry(entry: HistoryItem): void {
        const entryPosition = connectionList.indexOf(entry);
        
        if (entryPosition === -1) {
            console.warn('Failed to find entry to delete', entry);
            return;
        }

        connectionList.splice(entryPosition, 1);

        persistList();
    }

    export function toggleIsFavourite(entry: HistoryItem): void {
        const entryPosition = connectionList.indexOf(entry);
        
        if (entryPosition === -1) {
            console.warn('Failed to find entry to update', entry);
            return;
        }

        connectionList[entryPosition].isFavourite = !connectionList[entryPosition].isFavourite;
        persistList();
    }

    export function setName(entry: HistoryItem, name: string): void {
        const entryPosition = connectionList.indexOf(entry);
        
        if (entryPosition === -1) {
            console.warn('Failed to find entry to update', entry);
            return;
        }

        connectionList[entryPosition].name = name;
        persistList();
    }
}