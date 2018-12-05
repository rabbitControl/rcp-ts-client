import * as React from 'react';
import { parameterWrapped, InjectedProps } from './ElementWrapper';
import { NumericInput, INumericInputProps, Position } from '@blueprintjs/core';
import { NumberDefinition, RcpTypes } from 'rabbitcontrol';

interface Props extends INumericInputProps {
};

interface State {
};

export class ParameterNumericInputC extends React.Component<Props & InjectedProps, State> {

    constructor(props: Props & InjectedProps) {
        super(props);
    
        this.state = {        
        };
    }    

    handleChange = (value: number, valueAsString: string) => {
        if (this.props.handleValue) {
            this.props.handleValue(value);
        }

        if (this.props.onSubmitCb) {
            this.props.onSubmitCb();
        }
    }

    render() {
        const value = this.props.value as number;
        let step = 1;
        let isFloat:boolean|undefined;
        let min:number|undefined;
        let max:number|undefined;  
        let readOnly:boolean|undefined;

        const param = this.props.parameter;
        if (param) {
            readOnly = param.readonly;
            isFloat = param.typeDefinition.datatype === RcpTypes.Datatype.FLOAT32 ||
                    param.typeDefinition.datatype === RcpTypes.Datatype.FLOAT64;

            const numdef = param.typeDefinition as NumberDefinition;

            if (numdef !== undefined && 
                numdef.minimum !== undefined && 
                numdef.maximum !== undefined)
            {
                min = numdef.minimum;
                max = numdef.maximum;

                const valueRange = (numdef.maximum - numdef.minimum);
                
                if (numdef.multipleof) {
                    step = numdef.multipleof;
                } else if (isFloat) {
                    // step = valueRange > 0 && this.state.dimensions.width > 0 ? valueRange / this.state.dimensions.width : 1
                }
            }
        }

        return (        
            <NumericInput
                {...this.props}
                value={value ? value : 0}
                min={min}
                max={max}
                stepSize={step}
                minorStepSize={isFloat ? 0.1 : 1}
                onValueChange={this.handleChange}
                disabled={readOnly === true}
                selectAllOnFocus={true}
                buttonPosition={Position.RIGHT}
                placeholder={"-"}
            />      
        );
    }
};

export const ParameterNumericInput = parameterWrapped()(ParameterNumericInputC);