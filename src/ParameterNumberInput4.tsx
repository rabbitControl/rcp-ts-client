import * as React from 'react';
import { parameterWrapped, InjectedProps } from './ElementWrapper';
import { NumericInput, INumericInputProps, Position, Intent } from '@blueprintjs/core';
import { RcpTypes, Vector3, Vector3F32Definition, Vector4, Vector4F32Definition } from 'rabbitcontrol';

interface Props extends INumericInputProps {
};

interface State {
};

export class ParameterNumericInput4C extends React.Component<Props & InjectedProps, State> {

    constructor(props: Props & InjectedProps) {
        super(props);
    
        this.state = {        
        };
    }    

    handleChangeX = (value: number, valueAsString: string) => {

        const vec = (this.props.value as Vector4).clone();
        vec.x = value;

        if (this.props.handleValue) {
            this.props.handleValue(vec);
        }

        if (this.props.onSubmitCb) {
            this.props.onSubmitCb();
        }
    }
    handleChangeY = (value: number, valueAsString: string) => {

        const vec = (this.props.value as Vector4).clone();
        vec.y = value;

        if (this.props.handleValue) {
            this.props.handleValue(vec);
        }

        if (this.props.onSubmitCb) {
            this.props.onSubmitCb();
        }
    }
    handleChangeZ = (value: number, valueAsString: string) => {

        const vec = (this.props.value as Vector4).clone();
        vec.z = value;

        if (this.props.handleValue) {
            this.props.handleValue(vec);
        }

        if (this.props.onSubmitCb) {
            this.props.onSubmitCb();
        }
    }
    handleChangeT = (value: number, valueAsString: string) => {

        const vec = (this.props.value as Vector4).clone();
        vec.t = value;

        if (this.props.handleValue) {
            this.props.handleValue(vec);
        }

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
        let intent:Intent = Intent.NONE;

        const param = this.props.parameter;
        if (param) {

            readOnly = param.readonly || false;

            isFloat = param.typeDefinition.datatype === RcpTypes.Datatype.VECTOR2F32 ||
                        param.typeDefinition.datatype === RcpTypes.Datatype.VECTOR3F32 ||
                        param.typeDefinition.datatype === RcpTypes.Datatype.VECTOR4F32;

            const numdef = param.typeDefinition as Vector4F32Definition;

            if (numdef !== undefined) {

                if (numdef.minimum !== undefined && 
                    numdef.maximum !== undefined)
                {

                    if (numdef.minimum.x < numdef.maximum.x &&
                        numdef.minimum.y < numdef.maximum.y &&
                        numdef.minimum.z < numdef.maximum.z &&
                        numdef.minimum.t < numdef.maximum.t)
                    {
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
                    step.x = 0.1;
                    step.y = 0.1;
                    step.z = 0.1;
                    step.t = 0.1;
                }
            }
        }

        const { onSubmitCb, handleValue, ...filteredProps } = this.props;

        return (
            <div>
                <NumericInput
                    {...filteredProps}
                    value={value ? value.x : 0}
                    min={min ? min.x : undefined}
                    max={max ? max.x : undefined}
                    stepSize={step.x}
                    minorStepSize={isFloat ? 0.1 : 1}
                    onValueChange={this.handleChangeX}
                    disabled={readOnly === true}
                    selectAllOnFocus={true}
                    buttonPosition={Position.RIGHT}
                    placeholder={"-"}
                    intent={intent}
                />
                <NumericInput
                    {...filteredProps}
                    value={value ? value.y : 0}
                    min={min ? min.y : undefined}
                    max={max ? max.y : undefined}
                    stepSize={step.y}
                    minorStepSize={isFloat ? 0.1 : 1}
                    onValueChange={this.handleChangeY}
                    disabled={readOnly === true}
                    selectAllOnFocus={true}
                    buttonPosition={Position.RIGHT}
                    placeholder={"-"}
                    intent={intent}
                />
                <NumericInput
                    {...filteredProps}
                    value={value ? value.z : 0}
                    min={min ? min.z : undefined}
                    max={max ? max.z : undefined}
                    stepSize={step.z}
                    minorStepSize={isFloat ? 0.1 : 1}
                    onValueChange={this.handleChangeZ}
                    disabled={readOnly === true}
                    selectAllOnFocus={true}
                    buttonPosition={Position.RIGHT}
                    placeholder={"-"}
                    intent={intent}
                />
                <NumericInput
                    {...filteredProps}
                    value={value ? value.t : 0}
                    min={min ? min.t : undefined}
                    max={max ? max.t : undefined}
                    stepSize={step.t}
                    minorStepSize={isFloat ? 0.1 : 1}
                    onValueChange={this.handleChangeT}
                    disabled={readOnly === true}
                    selectAllOnFocus={true}
                    buttonPosition={Position.RIGHT}
                    placeholder={"-"}
                    intent={intent}
                />
            </div>
        );
    }
};

export const ParameterNumericInput4 = parameterWrapped()(ParameterNumericInput4C);