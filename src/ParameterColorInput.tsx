import * as React from 'react';
import { parameterWrapped, InjectedProps } from './ElementWrapper';
import { ValueParameter, RGBAParameter } from 'rabbitcontrol';

interface Props {
};

interface State {
};

export class ParameterColorInputC extends React.Component<Props & InjectedProps, State> {

    constructor(props: Props & InjectedProps) {
        super(props);
    
        this.state = {        
        };
    }    

    handleChange = (event: React.FormEvent<HTMLElement>) => {

        if (this.props.handleValue) {
            let value = (event.target as HTMLInputElement).value;

            // we only can handle RGB values, add alpha if needed
            if (this.props.parameter instanceof RGBAParameter) {
                while (value.length < 9) {
                    value += "f";
                }
            }
            this.props.handleValue(value);
        }

        if (this.props.onSubmitCb) {
            this.props.onSubmitCb();
        }
    }
    
    handleSubmit = (event: any) => {
        
        if (event && event.preventDefault) {
            event.preventDefault();
        }

        if (this.props.parameter instanceof ValueParameter) {
            if (this.props.parameter.setStringValue(this.props.value || "")) {
                if (this.props.onSubmitCb) {
                    this.props.onSubmitCb();
                }
            } else {
                console.error("could not set stringvalue...");
            }
        }
    }

    render() {
        let value = this.props.value as string || "#000000";
        let readOnly:boolean|undefined;

        // we only can handle RGB values
        if (value.length > 7) {
            value = value.substr(0, 7);
        }

        const param = this.props.parameter;
        if (param) {
            readOnly = param.readonly;            
        }

        const { onSubmitCb, handleValue, tabId, selectedTab, ...filteredProps } = this.props;

        return (
            <div>
                <label className="bx--label">{param?.label}</label>
                <div className="flex-h">
                    <input className="color-field"
                        {...filteredProps}
                        value={value}
                        type="color"
                        onChange={this.handleChange}
                        disabled={readOnly === true}
                    />
                    <label className="bx--label color-label">{value}</label>
                </div>
            </div>
        );
    }
    
};

export const ParameterColorInput = parameterWrapped()(ParameterColorInputC);