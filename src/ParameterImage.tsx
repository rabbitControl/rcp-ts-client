import * as React from 'react';
import { InjectedProps, parameterWrapped } from './ElementWrapper';

interface Props {
};

type State = {
    isOpen: boolean;
};

export class ParameterImageC extends React.Component<Props & InjectedProps, State> {

    constructor(props: Props & InjectedProps) {
        super(props);
    
        this.state = {
            isOpen: false,
        };
    }

    render() {

        const param = this.props.parameter;
        const label = param?.label || "";
        
        const blob = new Blob([this.props.value]);
        const url = window.URL.createObjectURL(blob);

        const { onSubmitCb, handleValue, tabId, selectedTab, ...filteredProps } = this.props;

        return (
            <div>
                <label className="bx--label">{label}</label>
                <br/>
                <img src={url} alt={label || "image"} height={200}/>
            </div>
        );
    }
};

export const ParameterImage = parameterWrapped()(ParameterImageC);
