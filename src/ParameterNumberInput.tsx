import * as React from 'react';
import { parameterWrapped, InjectedProps } from './ElementWrapper';
import { NumberDefinition, RcpTypes } from 'rabbitcontrol';
import { NumberInput } from 'carbon-components-react';

interface Props {
};

interface State {
};

export class ParameterNumericInputC extends React.Component<Props & InjectedProps, State> {

    constructor(props: Props & InjectedProps) {
        super(props);
    
        this.state = {        
        };
    }    

    handleChange = (e: any, direction: any, value: any) => {
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
                    }    
                }

                if (numdef.multipleof) {
                    step = numdef.multipleof;
                } else if (isFloat) {
                    step = 0.1;
                }
            }
        }

        const { onSubmitCb, handleValue, tabId, selectedTab, ...filteredProps } = this.props;
        
        return (        
            <NumberInput
                id={param?.id.toString() || "number"}
                label={param?.label}
                {...filteredProps}
                value={value}
                min={min}
                max={max}
                step={step}
                onChange={this.handleChange}
                disabled={readOnly === true}
                placeholder={"-"}
            />      
        );
    }
};

export const ParameterNumericInput = parameterWrapped()(ParameterNumericInputC);