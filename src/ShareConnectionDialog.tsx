import * as React from 'react';

import { Alert, InputGroup, ControlGroup, Text, Button } from '@blueprintjs/core';

type Props = {
    show: boolean;
    host: string;
    port: number;
    onClose: () => void;
};

type State = {
};

export default class ShareConnectionDialog extends React.Component<Props, State> {

    state: State = {
    }
    
    private generateLink(): string {
        return 'http://client.rabbitcontrol.cc/#' + this.props.host + ':' + this.props.port
    }

    private copyLink = (): void => {
        navigator.clipboard.writeText(this.generateLink()).then(() => {
            console.log('did copy...');
        })
    }

    render(): React.ReactNode {
        return <Alert isOpen={ this.props.show }
            className={"bp3-dark"}
            icon="upload"
            confirmButtonText="Done"
            onClose={ this.props.onClose }
            canOutsideClickCancel={ true }
            canEscapeKeyCancel={ true }>

            <h4>Share this connection</h4>
            
            <Text className='bp3-text-small bp3-text-muted'>
                You can share this connection by passing the link below on to other people. When they 
                open this link, the connection will establish immediatly.
            </Text>
            <br/>

            <ControlGroup style={{alignItems: "center"}}>
                <Text>Link:</Text>&nbsp;
                <InputGroup
                    type="text"
                    readOnly={ true }
                    value={ this.generateLink() }
                />
                <Button icon="clipboard" 
                        onClick={ this.copyLink }/>
            </ControlGroup>
        </Alert>
    }
}
