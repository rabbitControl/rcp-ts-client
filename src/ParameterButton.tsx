import * as React from 'react';
import { InjectedProps, parameterWrapped } from './ElementWrapper';
import { Button, Intent, Alert, IButtonProps } from '@blueprintjs/core';

interface Props extends IButtonProps {
    className?: string;
    label?: string;
    labelDisabled?: boolean;
    confirmationText?: string;
};

type State = {
    isOpen: boolean;
};

export class ParameterButtonC extends React.Component<Props & InjectedProps, State> {

    constructor(props: Props & InjectedProps) {
        super(props);
    
        this.state = {
            isOpen: false,
        };
    }
    
    handleClick = (event: React.MouseEvent<HTMLElement>) => {

        const parameter = this.props.parameter;
        let confirmation = false;

        if (parameter && parameter.widget) {
            confirmation = parameter.widget.needsConfirmation ? true : false;
        }

        if (confirmation) {
            // open dialog
            this.handleDialogOpen();
        } else {
            // directly send
            this.doSendBang();        
        }
    }

    render() {

        const ld = this.props.labelDisabled;
        let label = this.props.label;

        if (this.props.parameter) {
            label = this.props.parameter.label;
        }

        return (
            <section>
                <Button style={{whiteSpace: "nowrap", }}
                    {...this.props}
                    text={ld ? "" : label}
                    onClick={this.handleClick}
                />

                <Alert
                    className={`bp3-dark ${this.props.className}`}
                    canEscapeKeyCancel={true}
                    cancelButtonText="Cancel"
                    confirmButtonText="Send"
                    icon="warning-sign"
                    intent={Intent.DANGER}
                    isOpen={this.state.isOpen}
                    onCancel={this.handleDialogCancel}
                    onConfirm={this.handleDialogConfirm}
                >
                    <p>
                        {this.props.confirmationText ? this.props.confirmationText : `text ${label}?`}
                        <br/>
                        {(this.props.parameter && this.props.parameter.description) ? `(${this.props.parameter.description})` : ""}
                    </p>
                </Alert>
            </section>
        );

    }

    private handleDialogOpen = () => this.setState({ isOpen: true });
    private handleDialogConfirm = () => {
        this.setState({ isOpen: false });
        this.doSendBang();
    };
    private handleDialogCancel = () => this.setState({ isOpen: false });

    private doSendBang() {
        if (this.props.handleValue) {
            this.props.handleValue(null);
        }
    }
};

export const ParameterButton = parameterWrapped()(ParameterButtonC);
