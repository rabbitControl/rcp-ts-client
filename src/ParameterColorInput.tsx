import * as React from 'react';
import { parameterWrapped, InjectedProps } from './ElementWrapper';
import { INumericInputProps, InputGroup } from '@blueprintjs/core';
import { ValueParameter } from 'rabbitcontrol';

interface Props extends INumericInputProps {
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
            this.props.handleValue((event.target as HTMLInputElement).value);
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
            if (this.props.parameter.setStringValue(this.props.value)) {
                if (this.props.onSubmitCb) {
                    this.props.onSubmitCb();
                }
            } else {
                console.error("could not set stringvalue...");
            }
        }
    }

    render() {
        const value = this.props.value as string;
        let readOnly:boolean|undefined;

        const param = this.props.parameter;
        if (param) {
            readOnly = param.readonly;            
        }

        return (     
            <InputGroup
                {...this.props}
                value={value}
                type="color"
                onChange={this.handleChange}
                disabled={readOnly === true}
            />     
        );
    }
    
};

export const ParameterColorInput = parameterWrapped()(ParameterColorInputC);