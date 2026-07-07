import * as React from 'react';
import { ConnectionHistoryProvider } from './ConnectionHistoryProvider';
import SetNameOfPinnedItemDialog from './SetNameOfPinnedItemDialog';
import ShareConnectionDialog from './ShareConnectionDialog';
import Button from '@mui/joy/Button';
import { Delete, IosShare, PushPin, Tab } from '@mui/icons-material';
import { Box, IconButton, Stack, Typography } from '@mui/joy';

type ShareConnectionDialogIntent = {
    host: string;
    port: number;
}

type Props = {
    onConnectFromHistoryItem: (item: ConnectionHistoryProvider.HistoryItem) => void;
};

type State = {
    listEntries: Array<ConnectionHistoryProvider.HistoryItem>;
    entryForSetNameOfFavouriteDialog: ConnectionHistoryProvider.HistoryItem | undefined;
    shareConnectionDialogIntent: ShareConnectionDialogIntent | undefined;
};

export default class ConnectionHistoryList extends React.Component<Props, State> {
    
    constructor(props: Props) {
        super(props);

        this.state = {
            listEntries: this.getSortedList(),
            entryForSetNameOfFavouriteDialog: undefined,
            shareConnectionDialogIntent: undefined,
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

    showShareConnectionDialog = (host: string, port: number): void => {
        this.setState({
            shareConnectionDialogIntent: {
                host: host,
                port: port
            }
        })
    }

    render(): React.ReactNode {
        if (this.state.listEntries.length === 0) {
            return null;
        }
        
        return <Box>

            <Typography level="title-md">Connection history:</Typography>

            <Box
                className="connection_history_list"
            >
                
                { this.state.listEntries.map((entry, index) => {
                    return (
                    <Stack 
                        direction="row"
                        key={ index }
                        sx={{
                            display: 'flex',
                            border: '1px'
                        }}
                        className={ 'history_list_item' + (index % 2 === 0 ? ' even' : '')}
                    >
                        <Box
                            sx={{
                                flexGrow: 10,
                            }}
                        >
                            { entry.name !== '' && <Typography><strong>{ entry.name }</strong></Typography> }
                            <Typography
                                className='break-anywhere'
                            >
                                { entry.applicationId !== '' && entry.applicationId + ', ' }
                                { entry.address }:{ entry.port }
                                &nbsp;
                                { entry.tabsInRoot ? <Tab fontSize='small'/> : null }
                                &nbsp;&nbsp;
                            </Typography>
                        </Box>

                        <Stack
                            direction='row'
                            spacing={0.2}
                            sx={{
                                display: 'flex',
                                flexGrow: 0,
                            }}
                        >
                            <IconButton
                                    variant="solid"
                                    size="sm"
                                    onClick={ () => { this.deleteItemAtIndex(index) } }>
                                <Delete fontSize='small'/>
                            </IconButton>

                            <IconButton 
                                    variant="solid"
                                    size="sm"
                                    color={ entry.isFavourite ? "warning" : undefined }
                                    onClick={ () => { this.toggleIsFavouriteOnHistoryItem(index) } } >
                                <PushPin fontSize='small'/>
                            </IconButton>

                            <IconButton
                                    variant="solid"
                                    size="sm"
                                    onClick={ () => { this.showShareConnectionDialog(entry.address, entry.port) } } >
                                <IosShare fontSize='small'/>
                            </IconButton>

                            <Button 
                                    variant="soft"
                                    size="sm"
                                    onClick={ () => { this.props.onConnectFromHistoryItem(this.state.listEntries[index]) } }>
                                Connect
                            </Button>
                        </Stack>
                    </Stack>);
                }) }
            </Box>

            <SetNameOfPinnedItemDialog show={ this.state.entryForSetNameOfFavouriteDialog !== undefined }
                                       entry={ this.state.entryForSetNameOfFavouriteDialog }
                                       onSuccess={ this.onSetNameForFavourite } 
                                       onCancel={ this.onCancelSetNameForFavourite } />
            <ShareConnectionDialog show={ this.state.shareConnectionDialogIntent !== undefined }
                                   onClose={ () => { this.setState({ shareConnectionDialogIntent: undefined })}}
                                   host={ this.state.shareConnectionDialogIntent?.host ?? '' }
                                   port={ this.state.shareConnectionDialogIntent?.port ?? 0 } />
      
        </Box>
    }
} 
