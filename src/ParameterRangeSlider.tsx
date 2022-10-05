import * as React from 'react';
import { parameterWrapped, InjectedProps } from './ElementWrapper';
import { NumberDefinition, RcpTypes, Range, RangeDefinition } from 'rabbitcontrol';
import Measure from 'react-measure';
import { Slider, SliderOnChangeArg } from 'carbon-components-react';

interface Props {
    continuous?: boolean;
    rangeValue?: Range;
};

interface State {
    dimensions: {
        width: -1,
        height: -1
    }; 
};

export class ParameterRangeSliderC extends React.Component<Props & InjectedProps, State> {

    constructor(props: Props & InjectedProps) {
        super(props);
    
        this.state = {
            dimensions: {
                width: -1,
                height: -1
            },
        };
    }    

    handleChange = (value: Range) => {
        if (this.props.handleValue) {
            this.props.handleValue(value);
        }

        if (this.props.continuous) {
            this.handleRelease(value);
        }
    }

    handleRelease = (value: Range) => {
        if (this.props.onSubmitCb) {
            this.props.onSubmitCb();
        }
    }

    render() {
        
        const value = this.props.value as Range;
        let step = 1;
        let isFloat:boolean = false;
        let min:number|undefined = undefined;
        let max:number|undefined = undefined;
        let default_value: Range;
        let readOnly:boolean = false;

        const param = this.props.parameter;
        if (param) {
            readOnly = param.readonly || false;
            const numdef = param.typeDefinition as RangeDefinition;
            const element_type = numdef.elementType as NumberDefinition;
            if (numdef !== undefined && 
                element_type.minimum !== undefined && 
                element_type.maximum !== undefined)
            {
                min = element_type.minimum;
                max = element_type.maximum;

                const valueRange = (max - min);                    
                isFloat = param.typeDefinition.datatype === RcpTypes.Datatype.FLOAT32 ||
                                param.typeDefinition.datatype === RcpTypes.Datatype.FLOAT64;

                if (element_type.multipleof) {
                    step = element_type.multipleof;
                } else if (isFloat) {
                    if (this.state !== undefined && this.state.dimensions !== undefined) {                        
                        step = valueRange > 0 && this.state.dimensions.width > 0 ? valueRange / this.state.dimensions.width : 1
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
                            id={param?.id.toString() || "slider1"}
                            labelText={"Value 1"}
                            min={min || 0}
                            max={max || 0}
                            step={step}
                            value={value.value1}
                            onChange={(v: SliderOnChangeArg) => { this.handleChange(new Range(v.value, value.value2)); }}
                            onRelease={(v: SliderOnChangeArg) => { }}
                        />
                        <Slider
                            id={param?.id.toString() || "slider2"}
                            labelText={"Value 2"}
                            min={min || 0}
                            max={max || 0}
                            step={step}
                            value={value.value2}
                            onChange={(v: SliderOnChangeArg) => { this.handleChange(new Range(value.value1, v.value)); }}
                        />
                </div>
            }
            </Measure>
        );
    }
};

export const ParameterRangeSlider = parameterWrapped()(ParameterRangeSliderC);