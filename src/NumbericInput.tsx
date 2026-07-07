import React from "react";
import type { InjectedProps } from "./ElementWrapper";
import Input from '@mui/joy/Input';

interface Props {
    min: number | undefined;
    max: number | undefined;
    step: number | undefined;
    disabled: boolean | undefined;
    placeholder?: string;
    onValueChange: (value: number) => void | undefined;
};

interface State {

};

export class NumericInput extends React.Component<Props & InjectedProps, State>
{
    setValue(value: string) {

        const val = parseFloat(value);

        if (isNaN(val))
        {
            return;
        }

        if (this.props.onValueChange)
        {
            this.props.onValueChange(val);
        }
    }

    render() {

        return (
            <Input
                slotProps={{
                input: {
                    // ref: inputRef,
                    min: this.props.min,
                    max: this.props.max,
                    step: this.props.step,
                },
                }}
                value={this.props.value}
                type="number"
                onChange={(event) => this.setValue(event.target.value)}                
                // value={value.toFixed(this.precision)}
                // minorStepSize={isFloat ? (this.precision > 0 ? 0.01 : 1) : 1}
                // majorStepSize={isFloat ? 1 : 10}
                // onValueChange={this.handleChange}
                // disabled={readOnly === true}
                // selectAllOnFocus={true}
                // buttonPosition={Position.RIGHT}
                // placeholder={this.props.placeholder}
                // intent={intent}
            />      
        );
    }
}