import * as React from 'react';
import { parameterWrapped, type InjectedProps } from './ElementWrapper';
import { EnumParameter } from 'rabbitcontrol';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';

interface Props {
};

interface State {
};

export class ParameterHTMLSelectC extends React.Component<Props & InjectedProps, State> {

    constructor(props: Props & InjectedProps) {
        super(props);    
    }    


    handleChange = (_event: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element> | React.FocusEvent<Element, Element> | null, value: string | null) => {

        if (this.props.handleValue) {
            this.props.handleValue(value);
        }

        if (this.props.onSubmitCb) {
            this.props.onSubmitCb();
        }
    }

    render() {
        const value = this.props.value as string || "";
        let readOnly:boolean|undefined;
        let entries:string[]|undefined;
        // let multiSelect:boolean|undefined;

        const param = this.props.parameter;
        if (param) {
            readOnly = param.readonly;
        }

        if (param instanceof EnumParameter) {
            entries = param.enumDefinition.entries;
        }

        const { onSubmitCb, handleValue, ...filteredProps } = this.props;

        return (
            <Select
                {...filteredProps}
                defaultValue={value}
                variant='soft'
                onChange={this.handleChange}
                disabled={readOnly === true}
                className="test"
                value={value}
            >
                {this.renderOptions(param?.id ?? 0, value, entries)}
            </Select>      
        );
    }

    private renderOptions(id: number, _sel: string, entries?: string[]) {
        if (entries)
        {
            return entries.map((e, i) => {
                return <Option             
                    key={id + "_" + i}
                    value={e}>
                    {e}
                </Option>
            });
        }

        return "";
    }
};

export const ParameterHTMLSelect = parameterWrapped()(ParameterHTMLSelectC);