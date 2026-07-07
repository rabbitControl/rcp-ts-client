import * as React from 'react';
import { type InjectedProps, parameterWrapped } from './ElementWrapper';
import { Button, Modal } from '@mui/joy';

interface Props {
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
    
    handleClick = (_event: React.MouseEvent<HTMLElement>) => {

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

        const label_disabled = this.props.labelDisabled;
        let label = this.props.label;

        if (this.props.parameter) {
            label = this.props.parameter.label;
        }

        const { onSubmitCb, handleValue, ...filteredProps } = this.props;

        return (
            <section>
                <Button style={{whiteSpace: "nowrap", }}
                    {...filteredProps}
                    onClick={this.handleClick}
                >
                    {label_disabled ? "" : label}
                </Button>

                <Modal
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    className={`${this.props.className}`}
                    // canEscapeKeyCancel={true}
                    // cancelButtonText="Cancel"
                    // confirmButtonText="Send"
                    // icon="warning-sign"
                    // intent={Intent.DANGER}
                    open={this.state.isOpen}
                    onClose={() => this.setState({ isOpen: false })}
                    // onCancel={this.handleDialogCancel}
                    // onConfirm={this.handleDialogConfirm}
                >
                    <p>
                        {this.props.confirmationText ? this.props.confirmationText : `text ${label}?`}
                        <br/>
                        {(this.props.parameter && this.props.parameter.description) ? `(${this.props.parameter.description})` : ""}
                    </p>
                </Modal>
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
