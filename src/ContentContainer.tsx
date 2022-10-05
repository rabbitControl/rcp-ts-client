import * as React from 'react';
import { GroupParameter } from 'rabbitcontrol';
import { Parameter, TabsWidget } from 'rabbitcontrol';
import ParameterWidget from './ParameterWidget';
import { ParameterTabsGroupC } from './ParameterTabsGroup';
import { WIDGET_CONTENT_SCROLLER } from './WidgetConfig';

interface Props {
    parameter: GroupParameter;
    onSubmitCb?: () => void;
    className?: string;
    selectedTab: number;
    tabId: number;
};

interface State {
    height: number;
    lastSelected: number;
};

export default class ContentContainer extends React.Component<Props, State> {

    private divElement: React.RefObject<HTMLDivElement>;

    constructor(props: Props) {
        super(props);

        this.divElement = React.createRef<HTMLDivElement>();        

        this.state = {
            height: 0,
            lastSelected: -1,
        };
    }

    updateHeight = () =>
    { 
        if (this.divElement.current)
        {            
            const top = this.divElement.current.offsetTop;
            const h = window.innerHeight - top;

            // console.log("----------------------");
            // console.log(this.props.parameter.userid + ": " + this.props.parameter.label);
            // console.log("TOP: " + top + " : " + window.innerHeight);
            // console.log("TOP2: " + top2);
            // console.log("HEIGHT: " + h);
            // console.log();
            
            this.setState({ height: h })
        }
        else
        {
            // no div-ref - thats fine
        }
    }

    componentDidMount()
    {
        // console.log(`CC MOUNT: ${this.props.parameter.label} (${this.props.id}) sel: ${this.props.selected} - last: ${this.state.lastSelected}`);        

        // calc height evertime the window changes size
        window.addEventListener("resize", this.updateHeight.bind(this));

        this.updateHeight();
    }

    onSubmit = () =>
    {
        if (this.props.onSubmitCb)
        {
            this.props.onSubmitCb();
        }
    }

    createChildWidgets(parameter: GroupParameter) 
    {
        if (parameter.widget instanceof TabsWidget) 
        {
            return (
                <ParameterTabsGroupC                    
                    key={"_" + parameter.id}
                    parameter={parameter}
                    value={undefined}
                    onSubmitCb={this.onSubmit}
                    tabId={this.props.tabId}
                    selectedTab={this.props.selectedTab}
                />
            );
        }


        return parameter.children
        .filter(param => 
        {
            const is_group = (param instanceof GroupParameter);
            var is_tabs = false;
            var parent_tabs = false;

            if (is_group)
            {
                is_tabs = param.widget instanceof TabsWidget;
            }

            if (param.parent !== undefined)
            {
                parent_tabs = param.parent.widget instanceof TabsWidget;
            }

            return !is_group || (!parent_tabs && !is_tabs);
        })
        .sort((a: Parameter, b: Parameter): number =>
        { 
            return ((a.order || 0) - (b.order || 0)); 
        })
        .map((param) =>
        {
            return <ParameterWidget
                key={param.id}
                parameter={param}
                onSubmitCb={this.onSubmit}
                tabId={this.props.tabId}
                selectedTab={this.props.selectedTab}
            />;
        });
    }
    
    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void
    {
        // console.log(`CC UPDATE: ${this.props.parameter.label} (${this.props.id}) sel: ${this.props.selected} - last: ${this.state.lastSelected}`);
        
        if (this.state.lastSelected !== this.props.selectedTab)
        {
            if (this.props.selectedTab === this.props.tabId)
            {                
                setTimeout(() => {
                    this.updateHeight();
                }, 0);            
            }

            this.setState({ lastSelected: this.props.selectedTab });
        }
    }

    render() {
        if (this.props.parameter.userid === WIDGET_CONTENT_SCROLLER) {
            return (
                <div className={(this.props.parameter.userid ? this.props.parameter.userid : "tab_group inner") + " " + (this.props.className || "")}
                    id={this.props.parameter.label ? this.props.parameter.label : "no_label"}
                    ref={this.divElement}
                    style={{
                        // border: "1px solid #d5f40b",
                        // background: "transparent",
                        height: this.state.height,
                        maxHeight: this.state.height,
                    }}>
                    {this.createChildWidgets(this.props.parameter)}
                </div>
            );
        }

        return (
            <div className={(this.props.parameter.userid ? this.props.parameter.userid : "tab_group inner") + " " + (this.props.className || "")}
                id={this.props.parameter.label ? this.props.parameter.label : "no_label"}
            >
                {this.createChildWidgets(this.props.parameter)}
            </div>
        );
    }
}