import * as React from 'react';
import { parameterWrapped, InjectedProps } from './ElementWrapper';
import { Slider, SliderProps } from '@blueprintjs/core';
import { NumberDefinition, RcpTypes } from 'rabbitcontrol';
import Measure from 'react-measure';
import { DEFAULT_PRECISION } from './Globals';

interface Props extends SliderProps {
    continuous?: boolean;
};

interface State {
    dimensions: {
        width: -1,
        height: -1
    };
};

export class ParameterSliderC extends React.Component<Props & InjectedProps, State>
{
    private precision: number = DEFAULT_PRECISION;

    constructor(props: Props & InjectedProps) {
        super(props);

        if (props.parameter?.typeDefinition.datatype !== RcpTypes.Datatype.FLOAT32 &&
            props.parameter?.typeDefinition.datatype !== RcpTypes.Datatype.FLOAT64)
        {
            // int-type
            this.precision = 0;
        }
    
        this.state = {
            dimensions: {
                width: -1,
                height: -1
            },
        };
    }    

    handleChange = (value: number) => {
        if (this.props.handleValue) {
            this.props.handleValue(value);
        }

        if (this.props.continuous) {
            this.handleRelease(value);
        }
    }

    handleRelease = (value: number) => {
        if (this.props.onSubmitCb) {
            this.props.onSubmitCb();
        }
    }

    render() {
        const value = this.props.value as number || 0;
        let step = 1;
        let isFloat:boolean = false;
        let min:number|undefined = undefined;
        let max:number|undefined = undefined;
        let readOnly:boolean = false;

        const param = this.props.parameter;
        if (param) {
            readOnly = param.readonly || false;
            const numdef = param.typeDefinition as NumberDefinition;
            if (numdef !== undefined && 
                numdef.minimum !== undefined && 
                numdef.maximum !== undefined)
            {
                min = numdef.minimum;
                max = numdef.maximum;

                const valueRange = (numdef.maximum - numdef.minimum);                    
                isFloat = param.typeDefinition.datatype === RcpTypes.Datatype.FLOAT32 ||
                                param.typeDefinition.datatype === RcpTypes.Datatype.FLOAT64;

                if (numdef.multipleof) {
                    step = numdef.multipleof;
                } else if (isFloat) {
                    if (this.state !== undefined && this.state.dimensions !== undefined) {                        
                        step = valueRange > 0 && this.state.dimensions.width > 0 ? valueRange / this.state.dimensions.width : 1
                    }
                }
            }
        }

        if (this.precision === 0)
        {
            step = 1;
        }

        const { onSubmitCb, handleValue, ...filteredProps } = this.props;

        return (        
            <Measure
                onResize={(contentRect) => {
                    this.setState({ dimensions: contentRect.entry })
                }}
            >
            {({ measureRef }) =>
                <div ref={measureRef}>
                    <Slider
                        {...filteredProps}
                        value={value}
                        min={min}
                        max={max}
                        stepSize={step}
                        labelPrecision={isFloat ? this.precision : 0}
                        labelStepSize={max}
                        onChange={this.handleChange}
                        onRelease={this.handleRelease}
                        labelRenderer={this.renderLabel}
                        disabled={readOnly === true}
                    />      
                </div>
            }
            </Measure>      
        );
    }

    private renderLabel = (val: number) => {
        const param = this.props.parameter
        const value = val.toFixed(this.precision);
        let unit;
        if (param) {
            unit = (param.typeDefinition as NumberDefinition).unit
        }

        return <div style={{whiteSpace: "nowrap"}}>{unit ? `${value} ${unit}`: value}</div>
    }
};

export const ParameterSlider = parameterWrapped()(ParameterSliderC);