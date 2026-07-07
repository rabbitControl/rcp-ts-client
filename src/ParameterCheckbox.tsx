import * as React from 'react';
import { parameterWrapped, type InjectedProps } from './ElementWrapper';
import Checkbox from '@mui/joy/Checkbox';

interface Props {
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
        // const v = this.props.value as boolean || false;
        let readOnly:boolean|undefined;

        const param = this.props.parameter;
        if (param) {
            readOnly = param.readonly;        
        }

        const { onSubmitCb, handleValue, value, ...filteredProps } = this.props;

        return (
            <Checkbox
                {...filteredProps}
                checked={value as boolean}
                onChange={this.handleChange}
                disabled={readOnly === true}
                label={this.props.parameter?.label}
                // alignIndicator={Position.LEFT}
                size="lg"
            />      
        );
    }
};

export const ParameterCheckbox = parameterWrapped()(ParameterCheckboxC);