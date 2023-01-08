import * as React from 'react';

import { Alert, InputGroup, ControlGroup, Text, Button, IRefObject, Colors } from '@blueprintjs/core';
import { QRCodeSVG } from 'qrcode.react';

type Props = {
    show: boolean;
    host: string;
    port: number;
    onClose: () => void;
};

type State = {
    didCopy: boolean;
};

export default class ShareConnectionDialog extends React.Component<Props, State> {

    state: State = {
        didCopy: false,
    }

    inputRef: IRefObject<HTMLInputElement>

    constructor(props: Props) {
        super(props);
        this.inputRef = React.createRef();
    }

    componentDidUpdate = (prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void => {
        if (!prevProps.show) {
            this.inputRef.current?.select()
        }
    }
    
    private generateLink(): string {
        return window.location.protocol + '//' + window.location.host + '/#' + this.props.host + ':' + this.props.port
    }

    private copyLink = (): void => {
        try {
            navigator.clipboard.writeText(this.generateLink()).then(() => {
                this.setState({ didCopy: true });
            })
        } catch (e) {
            this.inputRef.current?.select();
        }
    }

    private onClose = (): void => {
        this.setState({ 
            didCopy: false,
        });
        this.props.onClose();
    }

    render(): React.ReactNode {
        return <Alert isOpen={ this.props.show }
            className={"bp3-dark share-connection-dialog"}
            icon="upload"
            confirmButtonText="Done"
            onClose={ this.onClose }
            canOutsideClickCancel={ true }
            canEscapeKeyCancel={ true }>

            <h4>Share this connection</h4>
            
            <Text className='bp3-text-small bp3-text-muted'>
                You can share this connection by passing the link below on to other people. When they 
                open this link, the connection will establish immediatly.
            </Text>

            <ControlGroup style={{alignItems: "center"}}>
                <Text>Link:</Text>&nbsp;
                <InputGroup type="text"
                            readOnly={ true }
                            value={ this.generateLink() }
                            inputRef={ this.inputRef } />
                <Button icon={ this.state.didCopy ? "tick-circle" : "clipboard" }
                        onClick={ this.copyLink }/>
            </ControlGroup>

            <div className="qr-grid">
                <div className='qr-container'>
                    <QRCodeSVG value={ this.generateLink() } 
                            size={ 256 }
                            bgColor={ Colors.BLACK } 
                            fgColor={ Colors.LIGHT_GRAY5 }/>
                </div>
            </div>
        </Alert>
    }
}
