import * as React from 'react';
import { InjectedProps, parameterWrapped } from './ElementWrapper';
import { Parameter, GroupParameter } from 'rabbitcontrol';
import ParameterWidget from './ParameterWidget';
import { Button, ButtonSet } from 'carbon-components-react';
import { ChevronLeft32, ChevronRight32 } from '@carbon/icons-react';

interface Props {
    style?: React.CSSProperties;
};

interface State {
    currentChild: number;    
};

export class ParameterTabsSwitcherC extends React.Component<Props & InjectedProps, State>
{
    private childNames: string[];
    private groupChildren: GroupParameter[];

    constructor(props: Props & InjectedProps) {
        super(props);

        this.state = {
            currentChild: 0
        };

        this.childNames = [];
        this.groupChildren = [];
    }

    onSubmit = () =>
    {
        if (this.props.onSubmitCb)
        {
            this.props.onSubmitCb();
        }
    }

    onNextChild = (event: React.MouseEvent<HTMLElement>) =>
    {
        let next = this.state.currentChild+1;
        if (next >= this.childNames.length)
        {
            next = 0;
        }

        this.setState({currentChild: next});
    }

    onPreviousChild = (event: React.MouseEvent<HTMLElement>) => 
    {
        let next = this.state.currentChild-1;
        if (next < 0)
        {
            next = this.childNames.length - 1;
        }
        this.setState({currentChild: next});
    }

    renderCurrentChildren()
    {
        // render non-group chilren of this GroupParameter
        const parameter = this.groupChildren[this.state.currentChild];

        if (parameter !== undefined)
        {
            return (parameter as GroupParameter).children
            .filter(param => !(param instanceof GroupParameter))
            .sort((a: Parameter, b: Parameter): number => ((a.order || 0) - (b.order || 0)))
            .map((p) =>
            { 
                return (
                    <ParameterWidget 
                        key={p.id}
                        parameter={p} 
                        onSubmitCb={this.onSubmit}
                    />
                );
            });
        }        
        
        return ("");
    }
    
    render() 
    {
        let label = "";
        const param = this.props.parameter;
        
        let current_name = "";

        if (param ) 
        {
            this.groupChildren = (this.props.parameter as GroupParameter).children                            
                                .filter(param => param instanceof GroupParameter)
                                .sort((a: Parameter, b: Parameter): number => ((a.order || 0) - (b.order || 0))) as GroupParameter[];

            this.childNames = this.groupChildren                        
                        .map((param, index) => 
                        {
                            const l = param.label !== undefined ? param.label : "";
                            if (index == this.state.currentChild)
                            {
                                current_name = l
                            }
                            return l;
                        });

            if (param.label !== undefined)
            {
                label = param.label;
            }
        }

        return (
            <div style={this.props.style}>

                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    // justifyContent: "center"
                }}>                    
                    <label style={{margin: "auto",marginLeft: 10, color: "lightgray",}}>{label}</label>
                    <label style={{margin: "auto",marginLeft: 10, }}>{current_name}</label>
                    <label style={{margin: "auto",marginLeft: 10, }}>{`(${this.state.currentChild+1}/${this.childNames.length})`}</label>
                    
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                    }}>
                        <Button hasIconOnly renderIcon={ChevronLeft32} iconDescription="previous group" onClick={this.onPreviousChild} disabled={this.childNames.length === 0}></Button>
                        <Button hasIconOnly renderIcon={ChevronRight32} iconDescription="next group" onClick={this.onNextChild} disabled={this.childNames.length === 0}></Button>
                    </div>
                </div>


                { this.renderCurrentChildren() }       
                {/* non-groupparameter children are ignored for now */}
            </div>
        );
    }

};

export const ParameterTabsSwitcher = parameterWrapped({ignoreReadonly: true})(ParameterTabsSwitcherC);