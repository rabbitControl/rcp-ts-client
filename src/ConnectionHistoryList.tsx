import { Button, Colors, Divider, Icon, Intent, Text } from '@blueprintjs/core';
import * as React from 'react';
import { ConnectionHistoryProvider } from './ConnectionHistoryProvider';
import SetNameOfPinnedItemDialog from './SetNameOfPinnedItemDialog';

type Props = {
    onConnectFromHistoryItem: (item: ConnectionHistoryProvider.HistoryItem) => void;
};

type State = {
    listEntries: Array<ConnectionHistoryProvider.HistoryItem>;
    entryForSetNameOfFavouriteDialog: ConnectionHistoryProvider.HistoryItem | undefined;
};

export default class ConnectionHistoryList extends React.Component<Props, State> {
    
    constructor(props: Props) {
        super(props);

        this.state = {
            listEntries: this.getSortedList(),
            entryForSetNameOfFavouriteDialog: undefined,
        };
    }

    private getSortedList = (): Array<ConnectionHistoryProvider.HistoryItem> => {
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

    componentDidMount = (): void => {        
        window.addEventListener(ConnectionHistoryProvider.RCP_HISTORY_UPDATE_KEY, this.updateItemsList);
    }

    componentWillUnmount = (): void => {
        window.removeEventListener(ConnectionHistoryProvider.RCP_HISTORY_UPDATE_KEY, this.updateItemsList);
    }

    updateItemsList = (): void => {
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

    onSetNameForFavourite = (name: string): void => {
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

    render(): React.ReactNode {
        if (this.state.listEntries.length === 0) {
            return null;
        }
        
        return <section className="connection_history">
            <br />
            <Divider className='bp3-dark' />

            <h4>Connection history:</h4>

            <div className="connection_history_list">
                { this.state.listEntries.map((entry, index) => {
                    return <section key={ index } className={ 'history_list_item' + (index % 2 === 0 ? ' even' : '') }>
                        <div>
                            { entry.name != '' && <Text><strong>{ entry.name }</strong></Text> }
                            <Text><em>
                                { entry.applicationId != '' && entry.applicationId + ', ' }
                                { entry.address }:{ entry.port }
                                &nbsp;&nbsp;{ entry.tabsInRoot ? <Icon icon="segmented-control" color={ Colors.GRAY1 } /> : null }
                            </em></Text>
                        </div>
                        <div className="history_item_ctas">
                            <Button text="" 
                                    small={ true } 
                                    icon="trash" 
                                    onClick={ () => { this.deleteItemAtIndex(index) } } />
                            <Button text="" 
                                    small={ true } 
                                    icon={ entry.isFavourite ? 'unpin' : 'pin' } 
                                    intent={ entry.isFavourite ? Intent.WARNING : undefined }
                                    onClick={ () => { this.toggleIsFavouriteOnHistoryItem(index) } } />
                            <Button text="Connect" 
                                    small={ true } 
                                    onClick={ () => { this.props.onConnectFromHistoryItem(this.state.listEntries[index]) } }/>
                        </div>
                    </section>
                }) }
            </div>

            <SetNameOfPinnedItemDialog show={ this.state.entryForSetNameOfFavouriteDialog !== undefined }
                                      entry={ this.state.entryForSetNameOfFavouriteDialog }
                                      onSuccess={ this.onSetNameForFavourite } 
                                      onCancel={ this.onCancelSetNameForFavourite } />
        </section>
    }
} 
