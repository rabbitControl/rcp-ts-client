import * as React from 'react';
import { parameterWrapped, InjectedProps } from './ElementWrapper';
import { InputGroup } from '@blueprintjs/core';
import { ValueParameter } from 'rabbitcontrol';

interface Props {
};

interface State {
};

export class ParameterTextInputC extends React.Component<Props & InjectedProps, State> {

    constructor(props: Props & InjectedProps) {
        super(props);
    
        this.state = {        
        };
    }    

    handleChange = (event: React.FormEvent<HTMLElement>) => {

        if (this.props.handleValue) {
            this.props.handleValue((event.target as HTMLInputElement).value);
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
            <form onSubmit={this.handleSubmit}>
                <InputGroup
                    {...this.props}
                    value={value}
                    onChange={this.handleChange}
                    disabled={readOnly === true}
                />  
            </form>    
        );
    }
    
};

export const ParameterTextInput = parameterWrapped()(ParameterTextInputC);