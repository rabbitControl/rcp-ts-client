import * as React from 'react';
import { parameterWrapped, InjectedProps } from './ElementWrapper';
import { RcpTypes, Vector4, Vector4F32Definition } from 'rabbitcontrol';
import Measure from 'react-measure';
import { Slider, SliderOnChangeArg } from 'carbon-components-react';

interface Props {
    continuous?: boolean;
};

interface State {
    dimensions: {
        width: -1,
        height: -1
    }; 
};

export class ParameterSlider4C extends React.Component<Props & InjectedProps, State> {

    constructor(props: Props & InjectedProps) {
        super(props);
    
        this.state = {
            dimensions: {
                width: -1,
                height: -1
            },
        };
    }    

    handleChangeX = (value: SliderOnChangeArg) => {

        const vec = (this.props.value as Vector4).clone();
        vec.x = value.value;

        if (this.props.handleValue) {
            this.props.handleValue(vec);
        }

        if (this.props.continuous) {
            this.handleRelease(value);
        }
    }
    handleChangeY = (value: SliderOnChangeArg) => {

        const vec = (this.props.value as Vector4).clone();
        vec.y = value.value;

        if (this.props.handleValue) {
            this.props.handleValue(vec);
        }

        if (this.props.continuous) {
            this.handleRelease(value);
        }
    }
    handleChangeZ = (value: SliderOnChangeArg) => {

        const vec = (this.props.value as Vector4).clone();
        vec.z = value.value;

        if (this.props.handleValue) {
            this.props.handleValue(vec);
        }

        if (this.props.continuous) {
            this.handleRelease(value);
        }
    }
    handleChangeT = (value: SliderOnChangeArg) => {

        const vec = (this.props.value as Vector4).clone();
        vec.t = value.value;

        if (this.props.handleValue) {
            this.props.handleValue(vec);
        }

        if (this.props.continuous) {
            this.handleRelease(value);
        }
    }

    handleRelease = (value: SliderOnChangeArg) => {
        if (this.props.onSubmitCb) {
            this.props.onSubmitCb();
        }
    }

    render() {
        const value = this.props.value as Vector4;
        let step = new Vector4(1, 1, 1, 1);
        let isFloat:boolean = false;
        let min:Vector4|undefined = undefined;
        let max:Vector4|undefined = undefined;  
        let readOnly:boolean = false;

        const param = this.props.parameter;
        if (param) {
            readOnly = param.readonly || false;
            const numdef = param.typeDefinition as Vector4F32Definition;
            if (numdef !== undefined && 
                numdef.minimum !== undefined && 
                numdef.maximum !== undefined)
            {
                min = numdef.minimum;
                max = numdef.maximum;

                const valueRange = numdef.maximum.clone().sub(numdef.minimum);
                    
                isFloat = param.typeDefinition.datatype === RcpTypes.Datatype.VECTOR2F32 ||
                                param.typeDefinition.datatype === RcpTypes.Datatype.VECTOR3F32 ||
                                param.typeDefinition.datatype === RcpTypes.Datatype.VECTOR4F32;

                if (numdef.multipleof) {
                    step = numdef.multipleof;
                } else if (isFloat) {
                    if (this.state !== undefined && this.state.dimensions !== undefined) {                        
                        step.x = valueRange.x > 0 && this.state.dimensions.width > 0 ? valueRange.x / this.state.dimensions.width : 1;
                        step.y = valueRange.y > 0 && this.state.dimensions.width > 0 ? valueRange.y / this.state.dimensions.width : 1;
                        step.z = valueRange.z > 0 && this.state.dimensions.width > 0 ? valueRange.z / this.state.dimensions.width : 1;
                        step.t = valueRange.t > 0 && this.state.dimensions.width > 0 ? valueRange.t / this.state.dimensions.width : 1;
                    }
                }
            }
        }

        const { onSubmitCb, handleValue, tabId, selectedTab, ...filteredProps } = this.props;

        return (        
            <Measure
                onResize={(contentRect) => {
                    this.setState({ dimensions: contentRect.entry })
                }}
            >
            {({ measureRef }) =>
                <div ref={measureRef}>
                    <label className="bx--label">{param?.label || ""}</label>
                    <Slider
                        id={param?.id.toString()+"_1" || "slider_1"}
                        {...filteredProps}
                        value={value ? value.x : 0}
                        min={min ? min.x : 0}
                        max={max ? max.x : 0}
                        step={step.x}
                        onChange={this.handleChangeX}
                        onRelease={this.handleRelease}
                        disabled={readOnly === true}
                    />
                    <Slider
                        id={param?.id.toString()+"_2" || "slider_2"}
                        {...filteredProps}
                        value={value ? value.y : 0}
                        min={min ? min.y : 0}
                        max={max ? max.y : 0}
                        step={step.y}
                        onChange={this.handleChangeY}
                        onRelease={this.handleRelease}
                        disabled={readOnly === true}
                    />
                    <Slider
                        id={param?.id.toString()+"_3" || "slider_3"}
                        {...filteredProps}
                        value={value ? value.z : 0}
                        min={min ? min.z : 0}
                        max={max ? max.z : 0}
                        step={step.z}
                        onChange={this.handleChangeZ}
                        onRelease={this.handleRelease}
                        disabled={readOnly === true}
                    />
                    <Slider
                        id={param?.id.toString()+"_4" || "slider_4"}
                        {...filteredProps}
                        value={value ? value.t : 0}
                        min={min ? min.t : 0}
                        max={max ? max.t : 0}
                        step={step.t}
                        onChange={this.handleChangeT}
                        onRelease={this.handleRelease}
                        disabled={readOnly === true}
                    />      
                </div>
            }
            </Measure>      
        );
    }
};

export const ParameterSlider4 = parameterWrapped()(ParameterSlider4C);