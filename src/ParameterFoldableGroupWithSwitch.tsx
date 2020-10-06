import * as React from 'react';
import { InjectedProps, parameterWrapped } from './ElementWrapper';
import { Colors, Text, Collapse, ControlGroup } from '@blueprintjs/core';
import { BooleanParameter, GroupParameter, Parameter, ValueParameter } from 'rabbitcontrol';
import ParameterWidget from './ParameterWidget';
import { ParameterCheckboxC } from './ParameterCheckbox';

interface Props {
    style?: React.CSSProperties;
};

interface State {
    isOpen: boolean;
    switchParameter?: BooleanParameter;
};

export class ParameterFoldableGroupSWC extends React.Component<Props & InjectedProps, State> {

    static readonly COMPONENT_DEFAULT_COLOR = Colors.GRAY1;

    private static TOGGLE_LABEL = "_onoff";

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
            .filter( (p) => 
            {
                return !(p instanceof BooleanParameter) && p.label !== ParameterFoldableGroupSWC.TOGGLE_LABEL;
            })
            .sort((a: Parameter, b: Parameter): number => 
            {
                return ((a.order || 0) - (b.order || 0));
            })           
            .map( (p) => { 
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

        if (this.state.switchParameter === undefined)
        {
            // iterate children - find a BooleanParameter with label "_onoff"
            (param as GroupParameter).children.forEach(element =>
            {
                if (element instanceof BooleanParameter
                    && element.label === ParameterFoldableGroupSWC.TOGGLE_LABEL)
                {
                    if (this.state.switchParameter != element)
                    {
                        this.setState({
                            isOpen: element.value,
                            switchParameter: element
                        });

                        element.addValueChangeListener((p) =>
                        {
                            this.setState({
                                isOpen: (p as BooleanParameter).value
                            });
                            
                        });
                    }
                }
            });
        }


        const { parameter, ...filteredProps } = this.props;

        return (
            <div style={this.props.style}>
                <ControlGroup 
                    style={{marginBottom: this.state.isOpen ? 5 : 0}}
                    vertical={false} 
                >
                    <Text>{label}</Text>
                    <div style={{flexGrow:1}}></div>
                    <ParameterCheckboxC
                            {...filteredProps}
                            parameter={this.state.switchParameter}
                            handleValue={this.handleToggleChange}
                            value={this.state.isOpen}
                            disabled={this.state.switchParameter === undefined}
                        />
                </ControlGroup>
                <Collapse isOpen={this.state.isOpen}>
                    {this.renderChildren()}
                </Collapse>
            </div>
        );
    }

    private handleToggleChange = (state: boolean) => 
    {        
        if (this.state.switchParameter)
        {
            this.state.switchParameter.value = state;
            this.onSubmit();
        }
    }
};

export const ParameterFoldableGroupSW = parameterWrapped({ignoreReadonly: true})(ParameterFoldableGroupSWC);