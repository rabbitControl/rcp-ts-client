import * as React from 'react';
import { InjectedProps, parameterWrapped } from './ElementWrapper';
import { Button, Modal } from 'carbon-components-react';
import { ChevronLeft32, ChevronRight32 } from '@carbon/icons-react';

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

        const { onSubmitCb, handleValue, tabId, selectedTab, ...filteredProps } = this.props;

        return (
            <section>

                {/* deal with special labels "<" and ">" - use icons instead */}
                {
                    label === "<" ?
                        <Button
                            {...filteredProps}
                            onClick={this.handleClick}
                            hasIconOnly
                            renderIcon={ChevronLeft32}
                            iconDescription="previous group"
                        />

                        :

                        label === ">" ?
                            
                            <Button
                                {...filteredProps}
                                onClick={this.handleClick}
                                hasIconOnly
                                renderIcon={ChevronRight32}
                                iconDescription="next group"
                            />

                            :

                            <Button style={{whiteSpace: "nowrap", }}
                                {...filteredProps}
                                onClick={this.handleClick}
                            >
                                {ld ? "" : label}
                            </Button>
                }


                <Modal
                    className={`bp3-dark ${this.props.className}`}
                    // canEscapeKeyCancel={true}
                    // cancelButtonText="Cancel"
                    // confirmButtonText="Send"
                    // icon="warning-sign"
                    // intent={Intent.DANGER}
                    open={this.state.isOpen}
                    onSecondarySubmit={this.handleDialogCancel}
                    onRequestSubmit={this.handleDialogConfirm}

                    modalHeading={this.props.confirmationText ? this.props.confirmationText : `text ${label}?`}
                    modalLabel={(this.props.parameter && this.props.parameter.description) ? `(${this.props.parameter.description})` : ""}

                    primaryButtonText="Send"
                    secondaryButtonText="Cancel"
                >
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
