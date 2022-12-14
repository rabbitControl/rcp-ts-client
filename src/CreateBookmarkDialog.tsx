import * as React from 'react';

import { Alert, InputGroup, ControlGroup, Text } from '@blueprintjs/core';
import { BookmarkProvider } from './BookmarkProvider';

type Props = {
    show: boolean;
    onCancel: () => void;
    host: string;
    port: number;
    serverName: string;
    onSuccess: () => void;
};

type State = {
    name: string;
};

export default class CreateBookmarkDialog extends React.Component<Props, State> {

    state: State = {
        name: ""
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
        if (prevProps.serverName !== this.props.serverName) {
            this.setState({
                name: this.props.serverName
            })
        }
    }

    setName = (event: any): void => {
        this.setState({
            name: event.currentTarget.value as string
        });
    }

    storeBookmark = () => {
        const bookmark: BookmarkProvider.Bookmark = {
            address: this.props.host,
            port: this.props.port,
            name: this.state.name
        };

        BookmarkProvider.storeBookmark(bookmark);
        this.props.onSuccess();
    }

    render(): React.ReactNode {
        return <Alert isOpen={ this.props.show }
            className={"bp3-dark"}
            icon="bookmark"
            confirmButtonText="Save bookmark"
            cancelButtonText="Cancel"
            onConfirm={ this.storeBookmark }
            onCancel={ this.props.onCancel }>

            <Text><strong>Bookmark this connection</strong></Text>
            <br/>
            <br/>
            <ControlGroup style={{alignItems: "center"}}>
                <Text>Name:&nbsp;</Text>
                <InputGroup
                    value={this.state.name}
                    type="text"
                    onChange={ this.setName }
                />
            </ControlGroup>
            <br/>
            <ControlGroup style={{alignItems: "center"}}>
                <Text>Host:&nbsp;</Text>
                <InputGroup
                    value={this.props.host}
                    type="text"
                    disabled={true}
                />
            </ControlGroup>
            <br/>
            <ControlGroup style={{alignItems: "center"}}>
                <Text>Port:&nbsp;</Text>                    
                <InputGroup
                    value={this.props.port.toFixed(0)}
                    type="number"
                    disabled={true}
                />
            </ControlGroup>
            <br/>
        </Alert>
    }

}
