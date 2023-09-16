import * as React from 'react';
import { parameterWrapped, InjectedProps } from './ElementWrapper';
import { NumericInputProps, Position, Checkbox } from '@blueprintjs/core';

interface Props extends NumericInputProps {
};

interface State {
};

export class ParameterCheckboxC extends React.Component<Props & InjectedProps, State> {

    constructor(props: Props & InjectedProps) {
        super(props);
    
        this.state = {        
        };
    }    

    handleChange = (event: React.FormEvent<HTMLElement>) => {

        if (this.props.handleValue) {
            this.props.handleValue((event.target as HTMLInputElement).checked);
        }

        if (this.props.onSubmitCb) {
            this.props.onSubmitCb();
        }
    }

    render() {
        const value = this.props.value as boolean || false;
        let readOnly:boolean|undefined;


        const param = this.props.parameter;
        if (param) {
            readOnly = param.readonly;        
        }

        const { onSubmitCb, handleValue, ...filteredProps } = this.props;

        return (
            <Checkbox
                {...filteredProps}
                checked={value}
                onChange={this.handleChange}
                disabled={readOnly === true}
                alignIndicator={Position.LEFT}
                large={true}
            />      
        );
    }
};

export const ParameterCheckbox = parameterWrapped()(ParameterCheckboxC);