import * as React from 'react';
import { parameterWrapped, InjectedProps } from './ElementWrapper';
import { NumberDefinition, RcpTypes } from 'rabbitcontrol';
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

export class ParameterSliderC extends React.Component<Props & InjectedProps, State> {

    constructor(props: Props & InjectedProps) {
        super(props);
    
        this.state = {
            dimensions: {
                width: -1,
                height: -1
            },
        };
    }    

    handleChange = (value: SliderOnChangeArg) => {
        if (this.props.handleValue) {
            this.props.handleValue(value.value);
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

        const { onSubmitCb, handleValue, tabId, selectedTab, ...filteredProps } = this.props;

        return (        
            <Measure
                onResize={(contentRect) => {
                    this.setState({ dimensions: contentRect.entry })
                }}
            >
            {({ measureRef }) =>
                <div ref={measureRef}>
                    <Slider
                        id={param?.id.toString() || "slider"}
                        labelText={param?.label}
                        {...filteredProps}
                        value={value}
                        min={min || 0}
                        max={max || 1}
                        step={step}
                        onChange={this.handleChange}
                        onRelease={this.handleRelease}
                        disabled={readOnly === true}
                    />      
                </div>
            }
            </Measure>      
        );
    }
};

export const ParameterSlider = parameterWrapped()(ParameterSliderC);