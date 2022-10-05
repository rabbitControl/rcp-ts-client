import * as React from 'react';
import { parameterWrapped, InjectedProps } from './ElementWrapper';
import { EnumParameter } from 'rabbitcontrol';
import { RadioButton, RadioButtonGroup, RadioButtonGroupProps, RadioButtonValue } from 'carbon-components-react';

interface Props {
};

interface State {
};

export class ParameterRadioC extends React.Component<Props & InjectedProps, State> {

    constructor(props: Props & InjectedProps)
    {        
        super(props);    
    }    

    handleChange = (newSelection: RadioButtonValue, name: RadioButtonGroupProps["name"], event: React.ChangeEvent<HTMLInputElement>) => 
    {
        if (this.props.handleValue) {
            this.props.handleValue((event.target as HTMLInputElement).value);
        }

        if (this.props.onSubmitCb) {
            this.props.onSubmitCb();
        }
    }

    render() {
        const value = this.props.value as string || "";
        let readOnly:boolean|undefined;
        let entries:string[]|undefined;
        let multiSelect:boolean|undefined;

        const param = this.props.parameter;
        if (param) {
            readOnly = param.readonly;
        }

        if (param instanceof EnumParameter) {
            entries = param.enumDefinition.entries;

            // TODO: use a multiselectable RadioGroup
            multiSelect = param.enumDefinition.multiselect;
        }

        const { onSubmitCb, handleValue, tabId, selectedTab, ...filteredProps } = this.props;

        return (            
            <RadioButtonGroup
                {...filteredProps}
                name={param?.id.toString() || "radiogroup"}
                legendText={param?.label || ""}
                onChange={this.handleChange}
                disabled={readOnly === true}
                defaultSelected={value}
            >
                {this.renderOptions(value, entries)}            
            </RadioButtonGroup> 
        );
    }

    private renderOptions(sel: string, entries?: string[])
    {
        if (entries)
        {
            return entries.map( e => <RadioButton key={e} labelText={e} value={e} />);
        }
    }
};

export const ParameterRadio = parameterWrapped()(ParameterRadioC);