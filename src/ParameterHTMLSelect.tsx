import * as React from 'react';
import { parameterWrapped, InjectedProps } from './ElementWrapper';
import { NumericInputProps, HTMLSelect } from '@blueprintjs/core';
import { EnumParameter } from 'rabbitcontrol';

interface Props extends NumericInputProps {
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
        }

        const { onSubmitCb, handleValue, ...filteredProps } = this.props;

        return (
            <HTMLSelect
                {...filteredProps}
                onChange={this.handleChange}
                disabled={readOnly === true}
                className="test"
                value={value}
            >
                {this.renderOptions(param?.id ?? 0, value, entries)}
            </HTMLSelect>      
        );
    }

    private renderOptions(id: number, sel: string, entries?: string[]) {
        if (entries)
        {
            return entries.map((e, i) => {
                return <option
                    key={id + "_" + i}
                    value={e}>
                    {e}
                </option>
            });
        }

        return "";
    }
};

export const ParameterHTMLSelect = parameterWrapped()(ParameterHTMLSelectC);