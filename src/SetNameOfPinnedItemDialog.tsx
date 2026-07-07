import * as React from 'react';
import { ConnectionHistoryProvider } from './ConnectionHistoryProvider';
import { DialogTitle, Input, Modal, ModalClose, ModalDialog, Stack } from '@mui/joy';

type Props = {
    show: boolean;
    onCancel: () => void;
    onSuccess: (name: string) => void;
    entry: ConnectionHistoryProvider.HistoryItem | undefined;
};

type State = {
    name: string;
};

export default class SetNameOfPinnedItemDialog extends React.Component<Props, State> {

    state: State = {
        name: ""
    }

    inputRef: React.RefObject<HTMLInputElement>

    constructor(props: Props) {
        super(props);
        this.inputRef = React.createRef();
    }

    componentDidUpdate = (prevProps: Readonly<Props>, _prevState: Readonly<State>, _snapshot?: any): void => {
        if (prevProps.entry?.applicationId !== this.props.entry?.applicationId) {
            this.setState({
                name: this.props.entry?.applicationId ?? ""
            })
        }
        if (!prevProps.show && this.props.show) {
            requestAnimationFrame(() => {
                this.inputRef.current?.focus();
            })
        }
    }

    setName = (event: any): void => {
        this.setState({
            name: event.currentTarget.value as string
        });
    }

    confirm = (): void => {
        this.props.onSuccess(this.state.name);
    }

    handleEnterKey = (event: any): void => {
        if (event.key === 'Enter') {
            this.confirm();
        }
    }

    render(): React.ReactNode {
        return <Modal open={ this.props.show }
                    //   icon="pin"
                    //   confirmButtonText="Save"
                    //   cancelButtonText="Pin without name"
                    //   canOutsideClickCancel={ true }
                    //   canEscapeKeyCancel={ true }
                    //   onConfirm={ this.confirm }                    
                      onClose={ this.props.onCancel }
                >

            <ModalDialog>
                <ModalClose />
                <DialogTitle>Set name for pinned item</DialogTitle>
                
                <Stack direction="row">
                    <p>Name:&nbsp;</p>
                    <Input value={ this.state.name }
                                type="text"
                                // inputRef={ this.inputRef }
                                onChange={ this.setName } 
                                onKeyDown={ this.handleEnterKey }
                                />
                </Stack>
            </ModalDialog>            
        </Modal>
    }
}
