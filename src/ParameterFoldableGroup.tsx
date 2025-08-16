import * as React from 'react';
import { InjectedProps, parameterWrapped } from './ElementWrapper';
import { Colors, Text, Collapse, ControlGroup, Icon } from '@blueprintjs/core';
import { GroupParameter, Parameter } from 'rabbitcontrol';
import ParameterWidget from './ParameterWidget';

interface Props {
    style?: React.CSSProperties;
};

interface State {
    isOpen: boolean;
};

export class ParameterFoldableGroupC extends React.Component<Props & InjectedProps, State> {

    static readonly COMPONENT_DEFAULT_COLOR = Colors.GRAY1;

    constructor(props: Props & InjectedProps) {
        super(props);
    
        this.state = {
            isOpen: false,
        };
    } 

    onSubmit = () =>
    {
        if (this.props.onSubmitCb)
        {
            this.props.onSubmitCb();
        }
    }

    renderChildren()
    {
        const parameter = this.props.parameter;

        if (parameter === undefined)
        {
            return ("");
        }

        return (parameter as GroupParameter).children
            .sort((a: Parameter, b: Parameter): number => 
            {
                return ((a.order || 0) - (b.order || 0));
            }).map( (p) => { 
                return (
                    <ParameterWidget 
                        key={p.id}
                        parameter={p} 
                        onSubmitCb={this.onSubmit}
                    />
                );
            });
    }
    
    render()
    {
        let label = "no label";
        const param = this.props.parameter;
        if (param && param.label !== undefined) {
            label = param.label;
        }

        return (
            <div style={this.props.style}>
                <ControlGroup 
                    style={{marginBottom: this.state.isOpen ? 5 : 0}}
                    vertical={false} 
                    onClick={this.handleButtonClick}
                >
                    <Icon icon={this.state.isOpen ? "remove" : "add"}/>
                    <div style={{marginLeft: 10}}/>
                    <Text>{label}</Text>
                </ControlGroup>
                <Collapse isOpen={this.state.isOpen}>
                    {this.renderChildren()}
                </Collapse>
            </div>
        );
    }

    private handleButtonClick = () => {
        this.setState({
            isOpen: !this.state.isOpen,
        });
    }
};

export const ParameterFoldableGroup = parameterWrapped({ignoreReadonly: true})(ParameterFoldableGroupC);