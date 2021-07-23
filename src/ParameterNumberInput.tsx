import * as React from 'react';
import { parameterWrapped, InjectedProps } from './ElementWrapper';
import { NumericInput, INumericInputProps, Position, Intent } from '@blueprintjs/core';
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
        const value = this.props.value as number || 0;
        let step = 1;
        let isFloat:boolean = false;        
        let readOnly:boolean = false;
        let intent:Intent = Intent.NONE;

        const numdef = this.props.parameter ? this.props.parameter.typeDefinition as NumberDefinition : undefined;

        let min:number|undefined = numdef ? numdef.typeMin() : undefined;
        let max:number|undefined = numdef ? numdef.typeMax() : undefined;

        const param = this.props.parameter;
        if (param) {
            readOnly = param.readonly || false;
            isFloat = param.typeDefinition.datatype === RcpTypes.Datatype.FLOAT32 ||
                    param.typeDefinition.datatype === RcpTypes.Datatype.FLOAT64;

            if (numdef !== undefined) {

                if (numdef.minimum !== undefined && 
                    numdef.maximum !== undefined)
                {
                    if (numdef.minimum < numdef.maximum) {
                        min = numdef.minimum;
                        max = numdef.maximum;
                    } else {
                        // error on min/max
                        console.error("NumberInput: minimum >= maximum");                
                        intent = Intent.DANGER;
                    }    
                }

                if (numdef.multipleof) {
                    step = numdef.multipleof;
                } else if (isFloat) {
                    step = 0.1;
                }
            }
        }

        const { onSubmitCb, handleValue, ...filteredProps } = this.props;
        
        return (        
            <NumericInput
                {...filteredProps}
                value={value}
                min={min}
                max={max}
                stepSize={step}
                minorStepSize={isFloat ? 0.1 : 1}
                onValueChange={this.handleChange}
                disabled={readOnly === true}
                selectAllOnFocus={true}
                buttonPosition={Position.RIGHT}
                placeholder={"-"}
                intent={intent}
            />      
        );
    }
};

export const ParameterNumericInput = parameterWrapped()(ParameterNumericInputC);