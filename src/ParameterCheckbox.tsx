import { Checkbox } from 'carbon-components-react';
import * as React from 'react';
import { parameterWrapped, InjectedProps } from './ElementWrapper';

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

    handleChange = (checked: boolean, id: string, event: React.ChangeEvent<HTMLInputElement>) => {

        if (this.props.handleValue) {
            this.props.handleValue(checked);
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
                id={param?.id.toString() || "checkbox"}
                {...filteredProps}
                labelText={param?.label || ""}
                checked={value}
                onChange={this.handleChange}
                disabled={readOnly === true || filteredProps.disabled === true}
            />
        );
    }
};

export const ParameterCheckbox = parameterWrapped()(ParameterCheckboxC);