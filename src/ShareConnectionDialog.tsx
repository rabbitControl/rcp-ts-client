import * as React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Box, DialogTitle, IconButton, Modal, ModalClose, ModalDialog, Stack, Typography } from '@mui/joy';
import { ContentCopy, Done } from '@mui/icons-material';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

type Props = {
    show: boolean;
    host: string;
    port: number;
    onClose: () => void;
};

type State = {
    didCopy: boolean;
    link: string;
};

export default class ShareConnectionDialog extends React.Component<Props, State>
{
    inputRef: React.RefObject<HTMLInputElement>

    constructor(props: Props) {
        super(props);
        this.inputRef = React.createRef();

        this.state = {
            didCopy: false,
            link: this.generateLink()
        }
    }

    private generateLink(): string
    {
        return window.location.protocol + '//' + window.location.host + '/#' + this.props.host + ':' + this.props.port
    }

    private select()
    {
        this.inputRef.current?.select()
    }

    componentDidUpdate = (prevProps: Readonly<Props>, prevState: Readonly<State>, _snapshot?: any): void =>
    {
        if (this.props.port !== prevProps.port ||
            this.props.host !== prevProps.host)
        {
            this.setState({
                link: this.generateLink()
            })
        }

        if (this.state.link !== prevState.link ||
            (this.props.show && !prevProps.show))
        {
            // NOTE: delay for a bit so it gets selected for sure
            // solves a problem when opening the alert for the first time
            setTimeout(() => this.select(), 10);
        }
    }    

    private copyLink = (): void => {
        try {
            navigator.clipboard.writeText(this.state.link).then(() => {
                this.setState({
                    didCopy: true
                });
            })
        } catch (e) {
            this.select();
        }
    }

    private onClose = (): void => {
        this.setState({ 
            didCopy: false,
        });
        this.props.onClose();
    }

    render(): React.ReactNode {
        return <Modal 
            open={ this.props.show }
            className={"share-connection-dialog"}
            // icon="upload"
            // confirmButtonText="Done"
            onClose={ this.onClose }
            // canOutsideClickCancel={ true }
            // canEscapeKeyCancel={ true }
            >
                

            <ModalDialog>
                <ModalClose />
                <DialogTitle>Share this connection</DialogTitle>
                
                <Typography color='neutral'>
                    You can share this connection by passing the link below on to other people. When they 
                    open this link, the connection will establish immediatly.
                </Typography>

                <Stack 
                    direction="row"
                    sx={{
                        p: 1,
                        border: '1px dashed grey',
                        display: "flex",
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center"
                    }}
                >
                    <Typography>Link:</Typography>&nbsp;
                    <Typography
                                // inputRef={ this.inputRef }
                                >
                                    { this.state.link }
                                    </Typography>
                    <IconButton onClick={ this.copyLink } >
                        {this.state.didCopy ? <Done/> : <ContentCopy/>}
                    </IconButton>
                </Stack>

                <Box className="qr-grid"
                sx={{
        display: 'flex',
        justifyContent: "center",
      }}                    
                >
                    <div className='qr-container'>
                        <QRCodeSVG value={ this.state.link } 
                                size={ 256 }
                                // bgColor={ Colors.BLACK } 
                                // fgColor={ Colors.LIGHT_GRAY5 }
                                />
                    </div>
                </Box>
            </ModalDialog>

        </Modal>
    }
}
