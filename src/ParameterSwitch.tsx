import { Switch, Toggle } from 'carbon-components-react';
import * as React from 'react';
import { parameterWrapped, InjectedProps } from './ElementWrapper';

interface Props {
    labelDisabled?: boolean;
};

interface State {
};

export class ParameterSwitchC extends React.Component<Props & InjectedProps, State> {

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
        const value = this.props.value as boolean;    
        let readOnly:boolean|undefined;


        const param = this.props.parameter;
        if (param) {
            readOnly = param.readonly;        
        }

        const { onSubmitCb, handleValue, ...filteredProps } = this.props;

        return (
            <Toggle
                id={param?.id.toString() || "toggle"}
                labelA={this.props.labelDisabled === true ? "" : param ? param.label : ""}
                labelB=""
                {...filteredProps}
                toggled={value ? value : false}
                onChange={this.handleChange}
                disabled={readOnly === true || filteredProps.disabled === true}
            />
        );
    }
};

export const ParameterSwitch = parameterWrapped()(ParameterSwitchC);