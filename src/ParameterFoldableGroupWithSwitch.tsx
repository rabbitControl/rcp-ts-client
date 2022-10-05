import * as React from 'react';
import { InjectedProps, parameterWrapped } from './ElementWrapper';
import { BooleanParameter, GroupParameter, Parameter } from 'rabbitcontrol';
import ParameterWidget from './ParameterWidget';
import { TOGGLE_LABEL } from './WidgetConfig';
import { ParameterSwitchC } from './ParameterSwitch';
import { Accordion, AccordionItem, Button, FormGroup, FormLabel, FormLabel as label, Switch, Toggle } from 'carbon-components-react';

interface Props {
    style?: React.CSSProperties;
};

interface State {
    isOpen: boolean;
    switchParameter?: BooleanParameter;
};

export class ParameterFoldableGroupSWC extends React.Component<Props & InjectedProps, State>
{
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
                return !(p instanceof BooleanParameter) && p.label !== TOGGLE_LABEL;
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
                    && element.label === TOGGLE_LABEL)
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

            <div>
                <Accordion
                    id={param?.id.toString() || "group"}
                    title="ParameterFoldableGroupSWC"
                >
                    <AccordionItem
                        className={param?.userid ? param.userid : ""}
                        title={label + "_ParameterFoldableGroupSWC"}
                        open={this.state.isOpen}
                        renderExpando={() =>
                            <div style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center"
                            }}>
                                <FormLabel className="grouplabel bx--label">{label}</FormLabel>
                                <div style={{flexGrow:100}}></div>
                                <ParameterSwitchC
                                    {...filteredProps}
                                    parameter={this.state.switchParameter}
                                    handleValue={this.handleToggleChange}
                                    value={this.state.isOpen}
                                    disabled={this.state.switchParameter === undefined}
                                    labelDisabled={true}
                                />
                            </div>
                        }
                    >
                        {this.renderChildren()}
                    </AccordionItem>
                </Accordion>
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