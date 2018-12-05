import * as React from 'react';
import { InjectedProps, parameterWrapped } from './ElementWrapper';
import { Colors } from '@blueprintjs/core';

interface Props {
    style?: React.CSSProperties;
    defaultColor?: string;
};

interface State {
};

export class ParameterColorDivC extends React.Component<Props & InjectedProps, State> {

    static readonly COMPONENT_DEFAULT_COLOR = Colors.GRAY1;

    constructor(props: Props & InjectedProps) {
        super(props);
    
        this.state = {
        };
    } 
    
    render() {
        const value = this.props.value ? 
                        (this.props.value as string) : 
                        (this.props.defaultColor ? 
                            this.props.defaultColor : 
                            ParameterColorDivC.COMPONENT_DEFAULT_COLOR);

        return (
            <div style={{
                backgroundColor: value,
            }}>
                <div style={this.props.style}>
                    {this.props.children}                
                </div>     
                       
            </div>
        );
    }
};

export const ParameterColorDiv = parameterWrapped({ignoreReadonly: true})(ParameterColorDivC);