import { Button, Colors, Divider, Icon, Intent, Text } from '@blueprintjs/core';
import * as React from 'react';
import { BookmarkProvider } from './BookmarkProvider';
import { ConnectionHistoryProvider } from './ConnectionHistoryProvider';
import SetNameOfFavouriteDialog from './SetNameOfFavouriteDialog';

type Props = {
    onConnectFromBookmark: (bookmark: BookmarkProvider.Bookmark) => void;
};

type State = {
    listEntries: Array<ConnectionHistoryProvider.Bookmark>;
    entryForSetNameOfFavouriteDialog: ConnectionHistoryProvider.Bookmark | undefined;
};

export default class ConnectionHistoryList extends React.Component<Props, State> {
    
    constructor(props: Props) {
        super(props);

        this.state = {
            listEntries: this.getSortedList(),
            entryForSetNameOfFavouriteDialog: undefined,
        };
    }

    private getSortedList(): Array<ConnectionHistoryProvider.Bookmark> {
        return ConnectionHistoryProvider
            .getList()
            .sort((a, b): number => {
                return b.lastConnected.getTime() - a.lastConnected.getTime();
            })
            .sort((a, b): number => {
                if (a.isFavourite && !b.isFavourite) {
                    return -1;
                }
                if (!a.isFavourite && b.isFavourite) {
                    return 1;
                }
                return 0;
            });
    }

    componentDidMount = () => {
        window.addEventListener('rabbit-connection-history-storage-update', this.updateBookmarksList);
    }

    componentWillUnmount(): void {
        window.removeEventListener('rabbit-connection-history-storage-update', this.updateBookmarksList);
    }

    updateBookmarksList = () => {
        this.setState({ listEntries: this.getSortedList() });
    }

    deleteItemAtIndex = (index: number): void => {
        ConnectionHistoryProvider.deleteEntry(this.state.listEntries[index]);
    }

    toggleIsFavouriteOnHistoryItem = (index: number): void => {
        if (!this.state.listEntries[index].isFavourite) {
            this.setState({ 
                entryForSetNameOfFavouriteDialog: this.state.listEntries[index],
            });
        } else {
            ConnectionHistoryProvider.setName(this.state.listEntries[index], "");
        }

        ConnectionHistoryProvider.toggleIsFavourite(this.state.listEntries[index]);
    }

    onSetNameForFavourite = (name: string) => {
        if (this.state.entryForSetNameOfFavouriteDialog === undefined) {
            return;
        }

        ConnectionHistoryProvider.setName(this.state.entryForSetNameOfFavouriteDialog, name);
        this.setState({
            entryForSetNameOfFavouriteDialog: undefined
        })
    }

    onCancelSetNameForFavourite = (): void => {
        this.setState({
            entryForSetNameOfFavouriteDialog: undefined
        })
    }

    render() 
    {
        if (this.state.listEntries.length === 0) {
            return null;
        }

        const list = this.state.listEntries.map((entry, index) => {
            return <section key={ index } className={ 'bookmark_list_item' + (index % 2 === 0 ? ' even' : '') }>
                <div>
                    <Icon icon="caret-right" color={ Colors.GRAY1 } />
                    <div>
                        { entry.name != '' && <Text><strong>{ entry.name }</strong></Text> }
                        <Text><em>
                            { entry.applicationId != '' && entry.applicationId + ', ' }
                            { entry.address }:{ entry.port }
                            &nbsp;&nbsp;{ entry.tabsInRoot ? <Icon icon="segmented-control" color={ Colors.GRAY1 } /> : null }
                        </em></Text>
                    </div>
                </div>
                <div className="bookmark_item_ctas">
                    <Button text="" 
                            small={ true } 
                            icon="trash" 
                            onClick={ () => { this.deleteItemAtIndex(index) } } />
                    &nbsp;
                    <Button text="" 
                            small={ true } 
                            icon="star" 
                            intent={ entry.isFavourite ? Intent.WARNING : undefined }
                            onClick={ () => { this.toggleIsFavouriteOnHistoryItem(index) } } />
                    &nbsp;
                    <Button text="Connect" 
                            small={ true } 
                            onClick={ () => { this.props.onConnectFromBookmark(this.state.listEntries[index]) } }/>
                </div>
            </section>
        })
        
        return <section className="connection_history">
            <br />
            <Divider className='bp3-dark' />

            <h4>Connection history:</h4>
            { list }

            <SetNameOfFavouriteDialog show={ this.state.entryForSetNameOfFavouriteDialog !== undefined }
                                      entry={ this.state.entryForSetNameOfFavouriteDialog }
                                      onSuccess={ this.onSetNameForFavourite } 
                                      onCancel={ this.onCancelSetNameForFavourite } />
        </section>
    }
} 
