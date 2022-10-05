import * as React from 'react';
import { parameterWrapped, InjectedProps } from './ElementWrapper';
import { EnumParameter } from 'rabbitcontrol';
import { Dropdown, OnChangeData } from 'carbon-components-react';

interface Props {
};

interface State {
};

export class ParameterHTMLSelectC extends React.Component<Props & InjectedProps, State> {

    constructor(props: Props & InjectedProps) {
        super(props);    
    }    

    handleChange = (data: OnChangeData<string>) => {

        if (this.props.handleValue) {
            this.props.handleValue(data.selectedItem);
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

        const { onSubmitCb, handleValue, tabId, selectedTab, ...filteredProps } = this.props;

        return (
            <Dropdown
                id={param?.id.toString() || "dropdown"}
                {...filteredProps}
                titleText={param?.label}
                onChange={this.handleChange}
                disabled={readOnly === true}
                className="test"
                items={entries || []}
                label="label"
                selectedItem={value}
            >
                {/* {this.renderOptions(value, entries)} */}
            </Dropdown>      
        );
    }

    private renderOptions(sel: string, entries?: string[]) {
        if (entries)
        {
            return entries.map( e => 
            {               
                return <option 
                        {...e === sel ? "selected" : null} 
                        key={e}
                        value={e}>
                            {e}
                        </option>
            });
        }

        return "";
    }
};

export const ParameterHTMLSelect = parameterWrapped()(ParameterHTMLSelectC);