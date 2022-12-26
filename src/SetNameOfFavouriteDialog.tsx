import * as React from 'react';

import { Alert, InputGroup, ControlGroup, Text, IRefObject } from '@blueprintjs/core';
import { ConnectionHistoryProvider } from './ConnectionHistoryProvider';

type Props = {
    show: boolean;
    onCancel: () => void;
    onSuccess: (name: string) => void;
    entry: ConnectionHistoryProvider.HistoryItem | undefined;
};

type State = {
    name: string;
};

export default class SetNameOfFavouriteDialog extends React.Component<Props, State> {

    state: State = {
        name: ""
    }

    inputRef: IRefObject<HTMLInputElement>

    constructor(props: Props) {
        super(props);
        this.inputRef = React.createRef();
    }

    componentDidUpdate = (prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void => {
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
        return <Alert isOpen={ this.props.show }
                      className={"bp3-dark"}
                      icon="star"
                      confirmButtonText="Save"
                      cancelButtonText="Don't set name"
                      canOutsideClickCancel={ true }
                      canEscapeKeyCancel={ true }
                      onConfirm={ this.confirm }
                      onCancel={ this.props.onCancel }>

            <h4>Set name for favourite</h4>
            
            <ControlGroup style={{alignItems: "center"}}>
                <Text>Name:&nbsp;</Text>
                <InputGroup value={ this.state.name }
                            type="text"
                            inputRef={ this.inputRef }
                            onChange={ this.setName } 
                            onKeyDown={ this.handleEnterKey } />
            </ControlGroup>
        </Alert>
    }
}
