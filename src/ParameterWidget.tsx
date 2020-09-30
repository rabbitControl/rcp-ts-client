import { Colors } from '@blueprintjs/core';
import { BangParameter, BooleanParameter, EnumParameter, GroupParameter, ImageParameter, NumberDefinition, NumberParameter, Parameter, RGBAParameter, RGBParameter, SliderWidget, ValueParameter, Vector3F32Parameter, NumberboxWidget, Vector3F32Definition, Vector3I32Parameter, Vector2I32Parameter, Vector2F32Parameter, Vector2F32Definition, Vector4F32Parameter, Vector4I32Parameter, Vector4F32Definition, Range, RangeParameter, RangeDefinition, RcpTypes, TabsWidget, ListWidget, ListPageWidget, RadiobuttonWidget } from 'rabbitcontrol';
import * as React from 'react';
import { ParameterButtonC } from './ParameterButton';
import { ParameterCheckboxC } from './ParameterCheckbox';
import { ParameterColorInputC } from './ParameterColorInput';
import { ParameterFoldableGroupC } from './ParameterFoldableGroup';
import { ParameterHTMLSelectC } from './ParameterHTMLSelect';
import { ParameterNumericInputC } from './ParameterNumberInput';
import { ParameterSliderC } from './ParameterSlider';
import { ParameterTextInputC } from './ParameterTextInput';
import { ParameterTextWithLabelC } from './ParameterTextWithLabel';
import { ParameterSlider3C } from './ParameterSlider3';
import { ParameterNumericInput3C } from './ParameterNumberInput3';
import { ParameterSlider2C } from './ParameterSlider2';
import { ParameterNumericInput2C } from './ParameterNumberInput2';
import { ParameterSlider4C } from './ParameterSlider4';
import { ParameterNumericInput4C } from './ParameterNumberInput4';
import { ParameterRangeSliderC } from './ParameterRangeSlider'
import { ParameterTabsGroupC } from './ParameterTabsGroup';
import { ParameterRadioC } from './ParameterRadio';


interface Props {
    parameter: Parameter;
    onSubmitCb: () => void;
};

interface State {
    enabled: boolean;
    label?: string;
    description?: string;
    value: any;  
    dimensions: {
        width: -1,
        height: -1
    };  
};

export default class ParameterWidget extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        let value;
        if (this.props.parameter instanceof ValueParameter && 
            this.props.parameter.value != null)
        {
            value = this.props.parameter.valueConstrained();
        }

        this.state = {
            enabled: true,
            label: this.props.parameter.label,
            description: this.props.parameter.description,
            value: value,
            dimensions: {
                width: -1,
                height: -1
            }
        };
    }

    componentDidMount() {

        // setup callbacks
        const param = this.props.parameter;

        if (param instanceof ValueParameter) {

            param.addValueChangeListener((p) => {
                if (p instanceof ValueParameter) {
                    this.setState({
                        value: p.valueConstrained()
                    });
                }
            });
        }

        param.addChangeListener((p) => {
            this.setState({
                label: p.label,
                description: p.description,
            })
        });
    }

    getWidth = () => {
        return 1;
    }

    handleValueChange = (value: any) => {

        // set parameter value
        if (this.props.parameter instanceof ValueParameter) {
            this.props.parameter.value = value;
        }

        this.setState({ value: value });
    }

    handleValueSubmit = (event: any) => {
        //
        console.log("submit");
        if (event && event.preventDefault) {
            event.preventDefault();
        }        
        if (this.props.parameter instanceof ValueParameter) {
            if (this.props.parameter.setStringValue(this.state.value)) {
                // call onsubmitcb to update client
                this.props.onSubmitCb();
            } else {
                // set string value failed... 
                console.error("could not set stringvalue...");                
                this.setState({ value: this.props.parameter.valueConstrained() });
            }
        }
    }

    handleButtonClick = () => {
        this.props.parameter.setDirty();
        this.props.onSubmitCb();        
    }

    renderValue(parameter: Parameter)
    {
        const widget = parameter.widget;        
        
        if (widget instanceof SliderWidget) {
            console.log("SLIDER WIDGET");
        } else if (widget instanceof NumberboxWidget) {
            console.log("NUMBERBOX WIDGET");
        }

        
        if (parameter instanceof ValueParameter) {

            if (parameter instanceof NumberParameter) {

                const numdef = parameter.typeDefinition as NumberDefinition;
                if (!(widget instanceof NumberboxWidget) &&
                    numdef !== undefined && 
                    numdef.minimum !== undefined && 
                    numdef.maximum !== undefined)
                { 
                    if (numdef.minimum < numdef.maximum) {

                        return ( 
                            <div>
                                <div className="parameter-label">{parameter.label}</div>
                                <ParameterSliderC
                                    {...this.props}
                                    value={this.state.value}
                                    handleValue={this.handleValueChange}
                                    continuous={true}
                                />
                            </div>
                        );
                    } else {
                        console.error("ParameterWidget: minimum >= maximum");
                        return this.defaultWidget();
                    }
                } else {

                    // numeric input
                    return (
                        <div>
                            <div className="parameter-label">{parameter.label}</div>
                            <ParameterNumericInputC
                                {...this.props}
                                value={this.state.value}
                                handleValue={this.handleValueChange}
                            />
                        </div>
                    );
                }
            }
            else if (parameter instanceof Vector2F32Parameter ||
                parameter instanceof Vector2I32Parameter) {

                const def = parameter.typeDefinition as Vector2F32Definition;
                
                if (!(widget instanceof NumberboxWidget) &&
                    def !== undefined && 
                    def.minimum !== undefined && 
                    def.maximum !== undefined)
                { 
                    if (def.minimum.x < def.maximum.x &&
                        def.minimum.y < def.maximum.y)
                    {
                        return ( 
                            <div>
                                <div className="parameter-label">{parameter.label}</div>
                                <ParameterSlider2C
                                    {...this.props}
                                    value={this.state.value}
                                    handleValue={this.handleValueChange}
                                    continuous={true}
                                />
                            </div>
                        );
                    } else {
                        console.error("ParameterWidget: minimum >= maximum");
                        return this.defaultWidget();
                    }
                } else {
                    // numeric input
                    return (
                        <div>
                            <div className="parameter-label">{parameter.label}</div>
                            <ParameterNumericInput2C
                                {...this.props}
                                value={this.state.value}
                                handleValue={this.handleValueChange}
                            />
                        </div>
                    );
                }
            }
            else if (parameter instanceof Vector3F32Parameter ||
                parameter instanceof Vector3I32Parameter) {

                const def = parameter.typeDefinition as Vector3F32Definition;
                
                if (!(widget instanceof NumberboxWidget) &&
                    def !== undefined && 
                    def.minimum !== undefined && 
                    def.maximum !== undefined)
                { 
                    if (def.minimum.x < def.maximum.x &&
                        def.minimum.y < def.maximum.y &&
                        def.minimum.z < def.maximum.z)
                    {
                        return ( 
                            <div>
                                <div className="parameter-label">{parameter.label}</div>
                                <ParameterSlider3C
                                    {...this.props}
                                    value={this.state.value}
                                    handleValue={this.handleValueChange}
                                    continuous={true}
                                />
                            </div>
                        );
                    } else {
                        console.error("ParameterWidget: minimum >= maximum");
                        return this.defaultWidget();
                    }
                } else {
                    // numeric input
                    return (
                        <div>
                            <div className="parameter-label">{parameter.label}</div>
                            <ParameterNumericInput3C
                                {...this.props}
                                value={this.state.value}
                                handleValue={this.handleValueChange}
                            />
                        </div>
                    );
                }
            }
            else if (parameter instanceof Vector4F32Parameter ||
                parameter instanceof Vector4I32Parameter) {

                const def = parameter.typeDefinition as Vector4F32Definition;
                
                if (!(widget instanceof NumberboxWidget) &&
                    def !== undefined && 
                    def.minimum !== undefined && 
                    def.maximum !== undefined)
                { 
                    if (def.minimum.x < def.maximum.x &&
                        def.minimum.y < def.maximum.y &&
                        def.minimum.z < def.maximum.z &&
                        def.minimum.t < def.maximum.t)
                    {
                        return ( 
                            <div>
                                <div className="parameter-label">{parameter.label}</div>
                                <ParameterSlider4C
                                    {...this.props}
                                    value={this.state.value}
                                    handleValue={this.handleValueChange}
                                    continuous={true}
                                />
                            </div>
                        );
                    } else {
                        console.error("ParameterWidget: minimum >= maximum");
                        return this.defaultWidget();
                    }
                } else {
                    // numeric input
                    return (
                        <div>
                            <div className="parameter-label">{parameter.label}</div>
                            <ParameterNumericInput4C
                                {...this.props}
                                value={this.state.value}
                                handleValue={this.handleValueChange}
                            />
                        </div>
                    );
                }
            }
            else if (parameter instanceof BooleanParameter) {
                return (
                    <div>
                        <div className="parameter-label">{parameter.label}</div>
                        <ParameterCheckboxC
                            {...this.props}
                            value={this.state.value}
                            handleValue={this.handleValueChange}
                        />
                    </div>
                );
            } 
            else if (parameter instanceof RGBAParameter ||
                     parameter instanceof RGBParameter)
            {
                return (
                    <div>
                        <div className="parameter-label">{parameter.label}</div>
                        <ParameterColorInputC
                            {...this.props}
                            value={this.state.value}
                            handleValue={this.handleValueChange}
                        />
                    </div>
                );
            } 
            else if (parameter instanceof EnumParameter)
            {
                if (parameter.widget instanceof RadiobuttonWidget)
                {
                    return (
                        <div>
                            <div className="parameter-label">{parameter.label}</div>
                            <ParameterRadioC
                                {...this.props}
                                value={this.state.value}
                                handleValue={this.handleValueChange}
                            />
                        </div>
                    );
                }
                else
                {
                    return (
                        <div>
                            <div className="parameter-label">{parameter.label}</div>
                            <ParameterHTMLSelectC
                                {...this.props}
                                value={this.state.value}
                                handleValue={this.handleValueChange}
                            />
                        </div>
                    );
                }

            }
            else if (parameter instanceof ImageParameter) {
                
                const blob = new Blob([parameter.value]);
                const url = window.URL.createObjectURL(blob);

                return (
                    <div>
                        <div className="parameter-label">{parameter.label}</div>
                        <img src={url} alt="IMAGE" height={200}/>
                    </div>
                );
            }
            else if (parameter instanceof RangeParameter) {
                
                const Range = parameter.value;

                return (
                    <div>
                        <div className="parameter-label">{parameter.label}</div>
                        <ParameterRangeSliderC                        
                            {...this.props}
                            value={this.state.value}
                            handleValue={this.handleValueChange}
                        />
                    </div>
                );
            }
            else {
                // everything else...
                return (
                    <div>
                        <div className="parameter-label">{parameter.label}</div>
                        <ParameterTextInputC
                            {...this.props}
                            value={this.state.value}
                            handleValue={this.handleValueChange}
                        />
                    </div>
                );
            }

            // end: value parameter
        }
        else if (parameter instanceof BangParameter)
        {
            return (
                <ParameterButtonC
                    {...this.props}
                    value={this.state.value}
                    handleValue={this.handleButtonClick}
                />
            );
        }
        else if (parameter instanceof GroupParameter) 
        {
            if (parameter.widget instanceof TabsWidget)
            {
                return (
                    <ParameterTabsGroupC
                        {...this.props}
                        value={this.state.value}
                        handleValue={this.handleValueChange}  
                    />                            
                );
            }
            else if (parameter.widget instanceof ListWidget)
            {
            }
            else if (parameter.widget instanceof ListPageWidget)
            {
                // ?
            }

            // default: foldable group
            return (
                <ParameterFoldableGroupC
                    {...this.props}
                    value={this.state.value}
                    handleValue={this.handleValueChange}
                />
            );
        }

        return;
    }

    render()
    {
        const parameter = this.props.parameter;

        if (!parameter) {
            console.error("no parameter");            
            return (
                <div>no parameter</div>
            );
        }

        // less framing for tabs widgets
        if (parameter.widget instanceof TabsWidget)
        {
            return (        
                <div className="parameter-wrapper">                    
                    {this.renderValue(parameter)}
                </div>
            );
        }

        // default framing
        return (        
            <div className="parameter-wrapper">
                
                <div className="inner" style={{                    
                    border: (parameter instanceof GroupParameter) ? "1px solid #454545" : "1px solid #353535",
                    background: (parameter instanceof GroupParameter) ? "transparent" : Colors.DARK_GRAY3
                }}>
                    {this.renderValue(parameter)}
                </div>
            </div>
        );
    }

    private defaultWidget() {
        return (
            <ParameterTextWithLabelC
                {...this.props}
                value={this.state.value.toString()}                
            />
        );
    }

}