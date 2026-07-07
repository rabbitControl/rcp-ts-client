import * as React from 'react';
import { parameterWrapped, type InjectedProps } from './ElementWrapper';
import { RcpTypes, Vector3F32Definition, Vector2, Vector2F32Definition } from 'rabbitcontrol';
import Measure from 'react-measure';
import { Slider } from '@mui/joy';

interface Props {
    continuous?: boolean;
};

interface State {
    dimensions: {
        width: -1,
        height: -1
    }; 
};

export class ParameterSlider2C extends React.Component<Props & InjectedProps, State> {

    constructor(props: Props & InjectedProps) {
        super(props);
    
        this.state = {
            dimensions: {
                width: -1,
                height: -1
            },
        };
    }    

    handleChangeX = (event: Event, value: number | Array<number>, activeThumb: number) => {
        const vec = (this.props.value as Vector2).clone();
        if (!(value instanceof Array))
        {
            vec.x = value;
        }
        else if (value.length > 0)
        {
            vec.x = value[0];
        }

        if (this.props.handleValue) {
            this.props.handleValue(vec);
        }

        if (this.props.continuous) {
            this.handleRelease(event, value);
        }
    }
    handleChangeY = (event: Event, value: number | Array<number>, activeThumb: number) => {

        const vec = (this.props.value as Vector2).clone();
        if (!(value instanceof Array))
        {
            vec.y = value;
        }
        else if (value.length > 0)
        {
            vec.y = value[0];
        }

        if (this.props.handleValue) {
            this.props.handleValue(vec);
        }

        if (this.props.continuous) {
            this.handleRelease(event, value);
        }
    }

    handleRelease = (event: React.SyntheticEvent | Event, value: number | Array<number>) => {
        if (this.props.onSubmitCb) {
            this.props.onSubmitCb();
        }
    }

    render() {
        let value = this.props.value as Vector2;
        let step = new Vector2(1, 1);
        let isFloat:boolean = false;
        let min:Vector2|undefined = undefined;
        let max:Vector2|undefined = undefined;  
        let readOnly:boolean = false;

        const param = this.props.parameter;
        if (param)
        {
            readOnly = param.readonly || false;
            const numdef = param.typeDefinition as Vector2F32Definition;
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
                    }
                }
            }
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
                        // {...filteredProps}
                        value={value ? value.x : 0}
                        min={min ? min.x : 0}
                        max={max ? max.x : 0}
                        step={step.x}
                        // labelPrecision={isFloat ? 2 : 0}
                        // labelStepSize={max ? max.x : 0}
                        onChange={this.handleChangeX}
                        onChangeCommitted={this.handleRelease}
                        // labelRenderer={this.renderLabel}
                        disabled={readOnly === true}
                    />
                    <Slider
                        // {...filteredProps}
                        value={value ? value.y : 0}
                        min={min ? min.y : undefined}
                        max={max ? max.y : undefined}
                        step={step.y}
                        // labelPrecision={isFloat ? 2 : 0}
                        // labelStepSize={max ? max.y : 0}
                        onChange={this.handleChangeY}
                        onChangeCommitted={this.handleRelease}
                        // labelRenderer={this.renderLabel}
                        disabled={readOnly === true}
                    />    
                </div>
            }
            </Measure>      
        );
    }

    private renderLabel = (val: number) => {
        const param = this.props.parameter
        const value = val.toFixed(2); // fixme for small numbers!
        let unit;
        if (param) {
            unit = (param.typeDefinition as Vector3F32Definition).unit
        }
        
        return <div style={{whiteSpace: "nowrap"}}>{unit ? `${value} ${unit}`: value}</div>
    }
};

export const ParameterSlider2 = parameterWrapped()(ParameterSlider2C);