import * as React from 'react';

import { Alert, InputGroup, ControlGroup, Text } from '@blueprintjs/core';
import { ConnectionHistoryProvider } from './ConnectionHistoryProvider';

type Props = {
    show: boolean;
    onCancel: () => void;
    onSuccess: (name: string) => void;
    entry: ConnectionHistoryProvider.Bookmark | undefined;
};

type State = {
    name: string;
};

export default class SetNameOfFavouriteDialog extends React.Component<Props, State> {

    state: State = {
        name: ""
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
        if (prevProps.entry?.applicationId !== this.props.entry?.applicationId) {
            this.setState({
                name: this.props.entry?.applicationId ?? ""
            })
        }
    }

    setName = (event: any): void => {
        this.setState({
            name: event.currentTarget.value as string
        });
    }

    render(): React.ReactNode {
        return <Alert isOpen={ this.props.show }
                      className={"bp3-dark"}
                      icon="star"
                      confirmButtonText="Save name"
                      cancelButtonText="Cancel"
                      onConfirm={ () => { this.props.onSuccess(this.state.name) } }
                      onCancel={ this.props.onCancel }>

            <h4>Set name for favourite</h4>
            
            <ControlGroup style={{alignItems: "center"}}>
                <Text>Name:&nbsp;</Text>
                <InputGroup value={ this.state.name }
                            type="text"
                            onChange={ this.setName } />
            </ControlGroup>
        </Alert>
    }
}
