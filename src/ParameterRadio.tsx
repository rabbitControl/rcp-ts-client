import * as React from 'react';
import { parameterWrapped, InjectedProps } from './ElementWrapper';
import { RadioGroup, Radio } from '@blueprintjs/core';
import { EnumParameter } from 'rabbitcontrol';

interface Props {
};

interface State {
};

export class ParameterRadioC extends React.Component<Props & InjectedProps, State> {

    constructor(props: Props & InjectedProps)
    {
        
        super(props);    
        console.log("create radio parameter");
    }    

    handleChange = (event: React.FormEvent<HTMLInputElement>) => 
    {
        console.log("radio changed: "+ (event.target as HTMLInputElement).value);
        
        if (this.props.handleValue) {
            this.props.handleValue((event.target as HTMLInputElement).value);
        }

        if (this.props.onSubmitCb) {
            this.props.onSubmitCb();
        }
    }

    render() {
        const value = this.props.value as string;    
        let readOnly:boolean|undefined;
        let entries:string[]|undefined;
        let multiSelect:boolean|undefined;

        const param = this.props.parameter;
        if (param) {
            readOnly = param.readonly;
        }

        if (param instanceof EnumParameter) {
            entries = param.enumDefinition.entries;
        }

        console.log("entries: " + entries);
        

        const { onSubmitCb, handleValue, ...filteredProps } = this.props;

        return (
            <RadioGroup
                {...filteredProps}
                onChange={this.handleChange}
                disabled={readOnly === true}
                className="test"
                selectedValue={value}
            >
                {this.renderOptions(value, entries)}            
            </RadioGroup>      
        );
    }

    private renderOptions(sel: string, entries?: string[]) {
        if (entries) {            
            return entries.map( e => 
                {
                    return <Radio key={e} label={e} value={e} />
                });
        }
    }
};

export const ParameterRadio = parameterWrapped()(ParameterRadioC);