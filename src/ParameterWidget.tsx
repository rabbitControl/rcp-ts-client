import { Card } from '@blueprintjs/core';
import { BangParameter, BooleanParameter, EnumParameter, GroupParameter, ImageParameter, NumberDefinition, NumberParameter, Parameter, RGBAParameter, RGBParameter, SliderWidget, ValueParameter, Vector3F32Parameter, DefaultWidget, NumberboxWidget } from 'rabbitcontrol';
import * as React from 'react';
import { parameterLabelStyle } from './Globals';
import { ParameterButtonC } from './ParameterButton';
import { ParameterCheckboxC } from './ParameterCheckbox';
import { ParameterColorInputC } from './ParameterColorInput';
import { ParameterFoldableGroupC } from './ParameterFoldableGroup';
import { ParameterHTMLSelectC } from './ParameterHTMLSelect';
import { ParameterNumericInputC } from './ParameterNumberInput';
import { ParameterSliderC } from './ParameterSlider';
import { ParameterTextInputC } from './ParameterTextInput';
import { ParameterTextWithLabelC } from './ParameterTextWithLabel';


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
            value = this.props.parameter.value;
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
                        value: p.value
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

    createChildWidget(param: Parameter): any {
        return <ParameterWidget key={param.id}
                                parameter={param} 
                                onSubmitCb={this.props.onSubmitCb}/>;
    }

    renderChildren(parameter: Parameter) {
        if (parameter instanceof GroupParameter) {
            return parameter.children.map( (p) => { return this.createChildWidget(p); });
        }
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
                this.setState({ value: this.props.parameter.value });
            }
        }
    }

    handleButtonClick = () => {
        this.props.parameter.setDirty();
        this.props.onSubmitCb();        
    }

    renderValue(parameter: Parameter) {

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
                                <div style={parameterLabelStyle}>{parameter.label}</div>
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
                        return this.defaultWidet();
                    }
                } else {

                    // numeric input
                    return (
                        <div>
                            <div style={parameterLabelStyle}>{parameter.label}</div>
                            <ParameterNumericInputC
                                {...this.props}
                                value={this.state.value}
                                handleValue={this.handleValueChange}
                            />
                        </div>
                    );
                }
            } 
            else if (parameter instanceof Vector3F32Parameter) {
                return (
                    <div>vector</div>
                );
            }
            else if (parameter instanceof BooleanParameter) {
                return (
                    <div>
                        <div style={parameterLabelStyle}>{parameter.label}</div>
                        <br/>
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
                        <div style={parameterLabelStyle}>{parameter.label}</div>
                        <br/>
                        <ParameterColorInputC
                            {...this.props}
                            value={this.state.value}
                            handleValue={this.handleValueChange}
                        />
                    </div>
                );
            } 
            else if (parameter instanceof EnumParameter) {
                return (
                    <div>
                        <div style={parameterLabelStyle}>{parameter.label}</div>
                        <br/>
                        <ParameterHTMLSelectC
                            {...this.props}
                            value={this.state.value}
                            handleValue={this.handleValueChange}
                        />
                    </div>
                );
            }
            else if (parameter instanceof ImageParameter) {
                
                const blob = new Blob([parameter.value]);
                const url = window.URL.createObjectURL(blob);

                return (
                    <div>
                        <div style={parameterLabelStyle}>{parameter.label}</div>
                        <br/>
                        <img src={url} alt="IMAGE" height={200}/>
                    </div>
                );
            }
            else {
                return (
                    <div>
                        <div style={parameterLabelStyle}>{parameter.label}</div>
                        <br/>
                        <ParameterTextInputC
                            {...this.props}
                            value={this.state.value}
                            handleValue={this.handleValueChange}
                        />
                    </div>
                );

            }
        } else if (parameter instanceof GroupParameter) {
            return (
                <ParameterFoldableGroupC
                    {...this.props}
                    value={this.state.value}
                    handleValue={this.handleValueChange}
                >
                    {this.renderChildren(parameter)}
                </ParameterFoldableGroupC>
            );
        } else if (parameter instanceof BangParameter) {
            return (
                // <button onClick={this.handleButtonClick}>{`${parameter.label}`}</button>
                <ParameterButtonC
                    {...this.props}
                    value={this.state.value}
                    handleValue={this.handleButtonClick}
                />
            );
        }

        return;
    }

    render() {

        const parameter = this.props.parameter;

        if (!parameter) {
            console.error("no parameter");            
            return (
                <div>
                    no parameter
                </div>
            );
        }

        return (        
            <div style={{
                marginTop: 20,
                marginBottom: 0,
            }}>
                <Card interactive={false}>
                    {this.renderValue(parameter)}                    
                </Card>
            </div>
        );
    }

    private defaultWidet() {
        return (
            <ParameterTextWithLabelC
                {...this.props}
                value={this.state.value}
                
            />
        );
    }

}