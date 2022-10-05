import * as React from 'react';
import { InjectedProps, parameterWrapped } from './ElementWrapper';
import { GroupParameter, Parameter } from 'rabbitcontrol';
import ParameterWidget from './ParameterWidget';
import { WIDGET_EXPANDEDBYDEFAULT_STR, WIDGET_NOTFOLDABLE_STR } from './WidgetConfig';

interface Props {
    style?: React.CSSProperties;
};

interface State {
    isOpen: boolean;
};

export class ParameterGroupHorizontalLayoutC extends React.Component<Props & InjectedProps, State>
{
    constructor(props: Props & InjectedProps) {
        super(props);

        let is_open = false;
        if (props.parameter)
        {
            is_open = props.parameter.userid === WIDGET_EXPANDEDBYDEFAULT_STR;
        }
    
        this.state = {
            isOpen: is_open,
        };
    } 

    onSubmit = () =>
    {
        if (this.props.onSubmitCb)
        {
            this.props.onSubmitCb();
        }
    }

    renderChildren()
    {
        const parameter = this.props.parameter;

        if (parameter === undefined)
        {
            return ("");
        }

        return (parameter as GroupParameter).children
            .sort((a: Parameter, b: Parameter): number => 
            {
                return ((a.order || 0) - (b.order || 0));
            }).
            map( (p) => { 
                return (
                    <ParameterWidget
                        className="h_element"
                        key={p.id}
                        parameter={p}
                        onSubmitCb={this.onSubmit}
                        vertical={false}
                    />
                );
            });
    }
    
    render()
    {
        let foldable = true;
        const param = this.props.parameter;
        const label = param?.label || "no label";
        if (param)
        {
            foldable = param.userid !== WIDGET_NOTFOLDABLE_STR;
        }

        return (
            <div style={this.props.style}>
                <div
                    className={ "horizontallayout " + (param?.userid ? param.userid : "")}
                    style={{
                    display: "flex",
                    flexDirection: "row",
                }}>
                    {this.renderChildren()}
                </div>
            </div>
        );
    }

    private handleButtonClick = () => {
        this.setState({
            isOpen: !this.state.isOpen,
        });
    }
};

export const ParameterGroupHorizontalLayout = parameterWrapped({ignoreReadonly: true})(ParameterGroupHorizontalLayoutC);