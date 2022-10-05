import * as React from 'react';
import { BangParameter, BooleanParameter, EnumParameter, GroupParameter, ImageParameter, NumberDefinition, NumberParameter, Parameter, RGBAParameter, RGBParameter, SliderWidget, ValueParameter, Vector3F32Parameter, NumberboxWidget, Vector3F32Definition, Vector3I32Parameter, Vector2I32Parameter, Vector2F32Parameter, Vector2F32Definition, Vector4F32Parameter, Vector4I32Parameter, Vector4F32Definition, Range, RangeParameter, TabsWidget, ListWidget, ListPageWidget, RadiobuttonWidget, CustomWidget } from 'rabbitcontrol';
import { ParameterButtonC } from './ParameterButton';
import { ParameterCheckboxC } from './ParameterCheckbox';
import { ParameterColorInputC } from './ParameterColorInput';
import { ParameterFoldableGroupC } from './ParameterFoldableGroup';
import { ParameterHTMLSelectC } from './ParameterHTMLSelect';
import { ParameterNumericInputC } from './ParameterNumberInput';
import { ParameterSliderC } from './ParameterSlider';
import { ParameterTextInputC } from './ParameterTextInput';
import { ParameterTextWithLabelC } from './ParameterTextWithLabel';
import { ParameterSlider3C } from './ParameterSlider3';
import { ParameterNumericInput3C } from './ParameterNumberInput3';
import { ParameterSlider2C } from './ParameterSlider2';
import { ParameterNumericInput2C } from './ParameterNumberInput2';
import { ParameterSlider4C } from './ParameterSlider4';
import { ParameterNumericInput4C } from './ParameterNumberInput4';
import { ParameterRangeSliderC } from './ParameterRangeSlider'
import { ParameterTabsGroupC } from './ParameterTabsGroup';
import { ParameterRadioC } from './ParameterRadio';
import { ParameterImageC } from './ParameterImage';
import { ParameterTabsSwitcherC } from './ParameterTabsSwitcher';
import { ParameterFoldableGroupSWC } from './ParameterFoldableGroupWithSwitch';
import { WIDGET_GROUPWITHSWITCH_STR, WIDGET_TABSWITCHER_STR, WIDGET_HORIZONTALLAYOUT_STR, WIDGET_NOWIDGET_STR, WIDGET_SWITCH_STR, TOGGLE_LABEL } from './WidgetConfig';
import { ParameterGroupHorizontalLayoutC } from './ParameterGroupHorizontalLayout';
import { ParameterSwitchC } from './ParameterSwitch';

interface Props {
    parameter: Parameter;
    onSubmitCb: () => void;
    vertical?: boolean;
    className?: string;
    selectedTab?: number;
    tabId?: number;
};

interface State {
    enabled: boolean;
    label?: string;
    description?: string;
    value: any;  
    dimensions: {
        width: -1,
        height: -1
    };  
};

export default class ParameterWidget extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        let value;
        if (this.props.parameter instanceof ValueParameter && 
            this.props.parameter.value != null)
        {
            value = this.props.parameter.valueConstrained();
        }

        this.state = {
            enabled: true,
            label: this.props.parameter.label,
            description: this.props.parameter.description,
            value: value,
            dimensions: {
                width: -1,
                height: -1
            }
        };
    }

    componentDidMount() {

        // setup callbacks
        const param = this.props.parameter;

        if (param instanceof ValueParameter) {

            param.addValueChangeListener((p) => 
            {
                if (p instanceof ValueParameter)
                {
                    this.setState({
                        value: p.valueConstrained()
                    });
                }
            });
        }

        param.addChangeListener((p) => {
            this.setState({
                label: p.label,
                description: p.description,
            })
        });
    }

    getWidth = () => {
        return 1;
    }

    handleValueChange = (value: any) => {

        // set parameter value
        if (this.props.parameter instanceof ValueParameter) {
            this.props.parameter.value = value;
        }

        this.setState({ value: value });
    }

    handleValueSubmit = (event: any) =>
    {
        //
        if (event && event.preventDefault) {
            event.preventDefault();
        }        
        if (this.props.parameter instanceof ValueParameter) {
            if (this.props.parameter.setStringValue(this.state.value)) {
                // call onsubmitcb to update client
                this.props.onSubmitCb();
            } else {
                // set string value failed... 
                console.error("could not set stringvalue...");                
                this.setState({ value: this.props.parameter.valueConstrained() });
            }
        }
    }

    handleButtonClick = () => {
        this.props.parameter.setDirty();
        this.props.onSubmitCb();        
    }

    renderValue(parameter: Parameter)
    {
        const { vertical, className, ...filteredProps } = this.props;
        const widget = parameter.widget;

        // check for special user-id
        if (parameter.userid === WIDGET_NOWIDGET_STR)
        {
            return (
                <div
                    className={parameter.userid ? parameter.userid : ""}
                    style={{
                    display: "flex",
                    flexDirection: this.props.vertical ? "column" : "row",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    marginRight: "1em",
                }}>
                    <label className="bx--label">{parameter?.label || ""}</label>
                    <div className={`${this.props.vertical !== true ? "spacer" : ""}`}/>
                    <ParameterTextWithLabelC
                        {...filteredProps}
                        value={this.state.value}
                        handleValue={this.handleValueChange}
                        labelDisabled={true}
                    />
                </div>

            );            
        }

        
        if (parameter instanceof ValueParameter) {

            if (parameter instanceof NumberParameter) {

                const numdef = parameter.typeDefinition as NumberDefinition;
                if (!(widget instanceof NumberboxWidget) &&
                    numdef !== undefined && 
                    numdef.minimum !== undefined && 
                    numdef.maximum !== undefined)
                { 
                    if (numdef.minimum < numdef.maximum) {

                        return ( 
                            <ParameterSliderC
                                {...filteredProps}
                                value={this.state.value}
                                handleValue={this.handleValueChange}
                                continuous={true}
                            />
                        );
                    }
                    else
                    {
                        console.error("ParameterWidget: minimum >= maximum");
                        return this.defaultWidget();
                    }
                }
                else
                {
                    // numeric input
                    return (
                        <ParameterNumericInputC
                            {...filteredProps}
                            value={this.state.value}
                            handleValue={this.handleValueChange}
                        />
                    );
                }
            }
            else if (parameter instanceof Vector2F32Parameter ||
                parameter instanceof Vector2I32Parameter) {

                const def = parameter.typeDefinition as Vector2F32Definition;
                
                if (!(widget instanceof NumberboxWidget) &&
                    def !== undefined && 
                    def.minimum !== undefined && 
                    def.maximum !== undefined)
                { 
                    if (def.minimum.x < def.maximum.x &&
                        def.minimum.y < def.maximum.y)
                    {
                        return (
                            <ParameterSlider2C
                                {...filteredProps}
                                value={this.state.value}
                                handleValue={this.handleValueChange}
                                continuous={true}
                            />
                        );
                    } else {
                        console.error("ParameterWidget: minimum >= maximum");
                        return this.defaultWidget();
                    }
                } else {
                    // numeric input
                    return (
                        <ParameterNumericInput2C
                            {...filteredProps}
                            value={this.state.value}
                            handleValue={this.handleValueChange}
                        />
                    );
                }
            }
            else if (parameter instanceof Vector3F32Parameter ||
                parameter instanceof Vector3I32Parameter) {

                const def = parameter.typeDefinition as Vector3F32Definition;
                
                if (!(widget instanceof NumberboxWidget) &&
                    def !== undefined && 
                    def.minimum !== undefined && 
                    def.maximum !== undefined)
                { 
                    if (def.minimum.x < def.maximum.x &&
                        def.minimum.y < def.maximum.y &&
                        def.minimum.z < def.maximum.z)
                    {
                        return ( 
                            <ParameterSlider3C
                                {...filteredProps}
                                value={this.state.value}
                                handleValue={this.handleValueChange}
                                continuous={true}
                            />
                        );
                    } else {
                        console.error("ParameterWidget: minimum >= maximum");
                        return this.defaultWidget();
                    }
                } else {
                    // numeric input
                    return (
                        <ParameterNumericInput3C
                            {...filteredProps}
                            value={this.state.value}
                            handleValue={this.handleValueChange}
                        />
                    );
                }
            }
            else if (parameter instanceof Vector4F32Parameter ||
                parameter instanceof Vector4I32Parameter) {

                const def = parameter.typeDefinition as Vector4F32Definition;
                
                if (!(widget instanceof NumberboxWidget) &&
                    def !== undefined && 
                    def.minimum !== undefined && 
                    def.maximum !== undefined)
                { 
                    if (def.minimum.x < def.maximum.x &&
                        def.minimum.y < def.maximum.y &&
                        def.minimum.z < def.maximum.z &&
                        def.minimum.t < def.maximum.t)
                    {
                        return ( 
                            <ParameterSlider4C
                                {...filteredProps}
                                value={this.state.value}
                                handleValue={this.handleValueChange}
                                continuous={true}
                            />
                        );
                    } else {
                        console.error("ParameterWidget: minimum >= maximum");
                        return this.defaultWidget();
                    }
                } else {
                    // numeric input
                    return (
                        <ParameterNumericInput4C
                            {...filteredProps}
                            value={this.state.value}
                            handleValue={this.handleValueChange}
                        />
                    );
                }
            }
            else if (parameter instanceof BooleanParameter)
            {
                const is_switch = parameter.userid === WIDGET_SWITCH_STR || parameter.label === TOGGLE_LABEL;

                if (is_switch)
                {
                    return (
                        <div>
                            <ParameterSwitchC
                                {...filteredProps}
                                value={this.state.value}
                                handleValue={this.handleValueChange}
                            />
                        </div>
                    );
                }                

                // default ceckbox
                return (
                    <ParameterCheckboxC
                        {...filteredProps}
                        value={this.state.value}
                        handleValue={this.handleValueChange}
                    />
                );
            } 
            else if (parameter instanceof RGBAParameter ||
                     parameter instanceof RGBParameter)
            {
                return (
                    <ParameterColorInputC
                        {...filteredProps}
                        value={this.state.value}
                        handleValue={this.handleValueChange}
                    />
                );
            } 
            else if (parameter instanceof EnumParameter)
            {
                if (parameter.widget instanceof RadiobuttonWidget)
                {
                    return (    
                        <ParameterRadioC
                            {...filteredProps}
                            value={this.state.value}
                            handleValue={this.handleValueChange}
                        />
                    );
                }
                else
                {
                    return (
                        <ParameterHTMLSelectC
                            {...filteredProps}
                            value={this.state.value}
                            handleValue={this.handleValueChange}
                        />
                    );
                }

            }
            else if (parameter instanceof ImageParameter)
            {
                return (
                    <ParameterImageC
                        {...filteredProps}
                        value={parameter.value}
                        handleValue={this.handleValueChange}
                    />
                );
            }
            else if (parameter instanceof RangeParameter)
            {
                return (
                    <ParameterRangeSliderC
                        {...filteredProps}
                        value={this.state.value}
                        handleValue={this.handleValueChange}
                        continuous={true}
                    />
                );
            }
            else {
                // everything else...
                return (
                        <ParameterTextInputC
                            {...filteredProps}
                            value={this.state.value}
                            handleValue={this.handleValueChange}
                        />
                );
            }

            // end: value parameter
        }
        else if (parameter instanceof BangParameter)
        {
            return (
                <ParameterButtonC
                    {...filteredProps}
                    value={this.state.value}
                    handleValue={this.handleButtonClick}
                />
            );
        }
        else if (parameter instanceof GroupParameter) 
        {
            if (parameter.widget instanceof TabsWidget)
            {
                return (
                    <ParameterTabsGroupC
                        {...filteredProps}
                        value={this.state.value}
                        handleValue={this.handleValueChange}
                        tabId={this.props.tabId || 0}
                        selectedTab={this.props.selectedTab || 0}
                    />
                );
            }
            else if (parameter.widget instanceof ListWidget)
            {
                // TODO
            }
            else if (parameter.widget instanceof ListPageWidget)
            {
                // ?
            }
            else if (parameter.widget instanceof CustomWidget
                    || parameter.userid)
            {
                var is_tab_switcher = false;
                var is_group_with_switch = false;
                var is_horizontal_layout = false;

                if (parameter.widget instanceof CustomWidget
                    && parameter.widget.uuid != undefined)
                {
                    is_tab_switcher = parameter.widget.uuid.compare("01299e6c-58f3-4c70-a0a5-3472ccb9ef0b");
                    is_group_with_switch = parameter.widget.uuid.compare("ec373dce-9489-4ecf-bf5b-29d83e07e1a2");
                }
                else
                {
                    is_tab_switcher = parameter.userid === WIDGET_TABSWITCHER_STR;
                    is_group_with_switch = parameter.userid === WIDGET_GROUPWITHSWITCH_STR;
                    is_horizontal_layout = parameter.userid === WIDGET_HORIZONTALLAYOUT_STR;
                }

                // console.log(`${parameter.label} (${parameter.userid}) : is_tab_switcher: ${is_tab_switcher}`);
                

                if (is_tab_switcher)
                {
                    // custom tab-widget - TabSwitcher
                    return (
                        <ParameterTabsSwitcherC
                            {...filteredProps}
                            value={this.state.value}
                            handleValue={this.handleValueChange}
                            tabId={this.props.tabId || 0}
                            selectedTab={this.props.selectedTab || 0}
                        />
                    );
                }
                else if (is_group_with_switch)
                {                   
                    // group with switch
                    return (
                        <ParameterFoldableGroupSWC 
                            {...filteredProps}
                            value={this.state.value}
                            handleValue={this.handleValueChange}  
                        />                            
                    );
                }
                else if (is_horizontal_layout)
                {
                    // horizontal layout
                    return (
                        <ParameterGroupHorizontalLayoutC 
                            {...filteredProps}
                            value={this.state.value}
                            handleValue={this.handleValueChange}  
                        />                            
                    );
                }
            }

            // default: foldable group
            return (
                <ParameterFoldableGroupC
                    {...filteredProps}
                    value={this.state.value}
                    handleValue={this.handleValueChange}
                />
            );
        }

        return;
    }

    render()
    {
        const parameter = this.props.parameter;

        if (!parameter) {
            console.error("no parameter");            
            return (
                <div>no parameter</div>
            );
        }
        

        // less framing for tabs widgets
        if (parameter.widget instanceof TabsWidget)
        {
            return (        
                <div className={"parameter-wrapper " + (this.props.className ? this.props.className : (parameter.userid ? parameter.userid : ""))}>
                    {this.renderValue(parameter)}
                </div>
            );
        }

        // default framing

        return (
            <div className={"parameter-wrapper " + (this.props.className ? this.props.className : (parameter.userid ? parameter.userid : ""))}>
                {this.renderValue(parameter)}
            </div>
        );
    }

    private defaultWidget()
    {
        const { vertical, className, ...filteredProps } = this.props;

        return (
            <div>
                <label className="bx--label">{this.props.parameter.label || ""}</label>
                <ParameterTextWithLabelC
                    {...filteredProps}
                    value={this.state.value.toString()}                
                />
            </div>
        );
    }

}