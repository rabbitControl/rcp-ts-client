import * as React from 'react';
import { InjectedProps, parameterWrapped } from './ElementWrapper';
import { COMPONENT_DEFAULT_COLOR } from './Globals';

interface Props {
    style?: React.CSSProperties;
    defaultColor?: string;
};

interface State {
};

export class ParameterColorDivC extends React.Component<Props & InjectedProps, State>
{
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
                            COMPONENT_DEFAULT_COLOR);

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