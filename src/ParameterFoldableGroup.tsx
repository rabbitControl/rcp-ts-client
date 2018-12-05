import * as React from 'react';
import { InjectedProps, parameterWrapped } from './ElementWrapper';
import { Colors, Text, Collapse, ControlGroup, Button, Icon } from '@blueprintjs/core';

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
    
    render() {

        let label = "no label";
        const param = this.props.parameter;
        if (param && param.label !== undefined) {
            label = param.label;
        }

        return (
            <div style={this.props.style}>
                <ControlGroup vertical={false}>
                    <Icon 
                        icon={this.state.isOpen ? "remove" : "add"}
                        onClick={this.handleButtonClick}
                    />
                    <div style={{marginLeft: 10}}/>
                    <Text>{label}</Text>
                </ControlGroup>
                <Collapse isOpen={this.state.isOpen}>
                    {this.props.children}                
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