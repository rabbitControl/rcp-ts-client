import * as React from 'react';
import { InjectedProps, parameterWrapped } from './ElementWrapper';
import { Colors, Tabs, Tab, TabId, ControlGroup, Label, Button, ButtonGroup } from '@blueprintjs/core';
import { Parameter, GroupParameter, TabsWidget } from 'rabbitcontrol';
import ParameterWidget from './ParameterWidget';

interface Props {
    style?: React.CSSProperties;
};

interface State {
    currentChild: number;    
};

export class ParameterTabsSwitcherC extends React.Component<Props & InjectedProps, State> {

    static readonly COMPONENT_DEFAULT_COLOR = Colors.GRAY1;

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

                <ControlGroup 
                    style={{
                        alignItems: "center",
                        
                    }}
                    fill={false}
                >
                    <Label style={{margin: "inherit",marginLeft: 10, color: "lightgray",}}>{label}</Label>
                    <Label style={{margin: "inherit",marginLeft: 10, fontSize: "120%",}}>{current_name}</Label>
                    <Label style={{margin: "inherit",marginLeft: 10, fontSize: "80%",}}>{`(${this.state.currentChild+1}/${this.childNames.length})`}</Label>
                    <ButtonGroup style={{marginLeft: 10,}}                        >
                        <Button icon="caret-left" onClick={this.onPreviousChild} disabled={this.childNames.length === 0}></Button>
                        <Button icon="caret-right" onClick={this.onNextChild} disabled={this.childNames.length === 0}></Button>
                    </ButtonGroup>
                </ControlGroup>

                { this.renderCurrentChildren() }       
                {/* non-groupparameter children are ignored for now */}
            </div>
        );
    }

};

export const ParameterTabsSwitcher = parameterWrapped({ignoreReadonly: true})(ParameterTabsSwitcherC);