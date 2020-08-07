import * as React from 'react';
import { parameterWrapped, InjectedProps } from './ElementWrapper';
import { INumericInputProps, HTMLSelect } from '@blueprintjs/core';
import { EnumParameter } from 'rabbitcontrol';

interface Props extends INumericInputProps {
};

interface State {
};

export class ParameterHTMLSelectC extends React.Component<Props & InjectedProps, State> {

    constructor(props: Props & InjectedProps) {
        super(props);    
    }    

    handleChange = (event: React.FormEvent<HTMLElement>) => {

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

        const { onSubmitCb, handleValue, ...filteredProps } = this.props;

        return (
            <HTMLSelect
                {...filteredProps}
                onChange={this.handleChange}
                disabled={readOnly === true}
                className="test"
            >
                {this.renderOptions(value, entries)}            
            </HTMLSelect>      
        );
    }

    private renderOptions(sel: string, entries?: string[]) {
        if (entries) {
            return entries.map( e => { return <option {...e === sel ? "selected": null} key={e} value={e}>{e}</option>});
        }
    }
};

export const ParameterHTMLSelect = parameterWrapped()(ParameterHTMLSelectC);