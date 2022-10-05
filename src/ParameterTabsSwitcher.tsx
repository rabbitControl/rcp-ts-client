import * as React from 'react';
import { InjectedProps, parameterWrapped } from './ElementWrapper';
import { Parameter, GroupParameter, TabsWidget } from 'rabbitcontrol';
import ParameterWidget from './ParameterWidget';
import { Button } from 'carbon-components-react';
import { ChevronLeft32, ChevronRight32 } from '@carbon/icons-react';
import { ParameterTabsGroupC } from './ParameterTabsGroup';

interface Props {
    style?: React.CSSProperties;
    selectedTab: number;
    tabId: number;
};

interface State {
    currentChild: number;
    lastSelected: number;
};

export class ParameterTabsSwitcherC extends React.Component<Props & InjectedProps, State>
{
    private childNames: string[];
    private groupChildren: GroupParameter[];

    constructor(props: Props & InjectedProps) {
        super(props);

        this.state = {
            currentChild: 0,
            lastSelected: -1
        };

        this.childNames = [];
        this.groupChildren = [];
    }

    componentDidMount(): void
    {
        if (this.props.selectedTab !== this.props.tabId)
        {         
            this.setState({ currentChild: -1 });
        }
    }

    onSubmit = () =>
    {
        if (this.props.onSubmitCb)
        {
            this.props.onSubmitCb();
        }
    }

    onNextChild = (event: React.MouseEvent<HTMLElement>) =>
    {
        let next = this.state.currentChild+1;
        if (next >= this.childNames.length)
        {
            next = 0;
        }

        this.setState({currentChild: next});
    }

    onPreviousChild = (event: React.MouseEvent<HTMLElement>) => 
    {
        let next = this.state.currentChild-1;
        if (next < 0)
        {
            next = this.childNames.length - 1;
        }
        this.setState({currentChild: next});
    }

    renderCurrentChildren()
    {
        if (this.state.currentChild >= 0)
        {            
            // render non-group chilren of this GroupParameter
            const parameter = this.groupChildren[this.state.currentChild];
    
            if (parameter !== undefined)
            {
                return (parameter as GroupParameter).children
                .filter(param => !(param instanceof GroupParameter))
                .sort((a: Parameter, b: Parameter): number => ((a.order || 0) - (b.order || 0)))
                .map((p) =>
                { 
                    return (
                        <ParameterWidget 
                            key={p.id}
                            parameter={p} 
                            onSubmitCb={this.onSubmit}
                        />
                    );
                });
            }
        }
        
        return ("");
    }

    renderChildren()
    {
        // render non-group chilren of this GroupParameter
        const parameter = this.props.parameter;

        if (parameter !== undefined)
        {
            return (parameter as GroupParameter).children
            .filter(param => !(param instanceof GroupParameter))
            .sort((a: Parameter, b: Parameter): number => ((a.order || 0) - (b.order || 0)))
            .map((p) =>
            { 
                return (
                    <ParameterWidget 
                        key={p.id}
                        parameter={p} 
                        onSubmitCb={this.onSubmit}
                    />
                );
            });
        }        
        
        return ("");
    }

    renderCurrentChildGroups()
    {
        if (this.state.currentChild >= 0)
        {
            const parameter = this.groupChildren[this.state.currentChild];
    
            if (parameter !== undefined)
            {
                if (parameter.widget instanceof TabsWidget &&
                    parameter instanceof GroupParameter)
                {                    
                    return (
                        <ParameterTabsGroupC
                            parameter={parameter}
                            value={undefined}
                            selectedTab={this.state.currentChild}
                            tabId={this.state.currentChild}
                        >
                        </ParameterTabsGroupC>
                    );
                }
    
                // else
                return (parameter as GroupParameter).children
                .filter(param => param instanceof GroupParameter)
                .sort((a: Parameter, b: Parameter): number => ((a.order || 0) - (b.order || 0)))
                .map((p, i) =>
                { 
                    return (
                        <ParameterWidget 
                            key={p.id}
                            parameter={p}
                            onSubmitCb={this.onSubmit}
                            tabId={i}
                            selectedTab={this.state.currentChild}
                        />
                    );
                });
            }
        }
        
        return ("");
    }

    componentDidUpdate(prevProps: Readonly<Props & InjectedProps>, prevState: Readonly<State>, snapshot?: any): void
    {
        // console.log(`PTSW UPDATE: ${this.props.parameter?.label} (${this.props.id}) sel: ${this.props.selected} - last: ${this.state.lastSelected}`);

        if (this.state.lastSelected !== this.props.selectedTab)
        {
            if (this.props.selectedTab === this.props.tabId) {

                if (this.state.currentChild < 0)
                {                    
                    this.setState({
                        currentChild: 0,
                    });
                }
            }
            else
            {
                this.setState({
                    currentChild: -1
                });
            }
            
            this.setState({ lastSelected: this.props.selectedTab });
        }
        
    }
    
    render() 
    {
        let label = "";
        const param = this.props.parameter;
        
        let current_name = "";

        if (param)
        {
            this.groupChildren = (this.props.parameter as GroupParameter).children                            
                                .filter(param => param instanceof GroupParameter)
                                .sort((a: Parameter, b: Parameter): number => ((a.order || 0) - (b.order || 0))) as GroupParameter[];

            this.childNames = this.groupChildren                        
                        .map((param, index) => 
                        {
                            const l = param.label !== undefined ? param.label : "";
                            if (index == this.state.currentChild)
                            {
                                current_name = l
                            }
                            return l;
                        });

            if (param.label !== undefined)
            {
                label = param.label;
            }
        }

        return (
            <div style={this.props.style}>

                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    // justifyContent: "center"
                }}>                    
                    <label style={{margin: "auto",marginLeft: 10, color: "lightgray",}}>{label}</label>
                    <label style={{margin: "auto",marginLeft: 10, }}>{current_name}</label>
                    <label style={{margin: "auto",marginLeft: 10, }}>{`(${this.state.currentChild+1}/${this.childNames.length})`}</label>
                    
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                    }}>
                        <Button hasIconOnly renderIcon={ChevronLeft32} iconDescription="L" onClick={this.onPreviousChild} disabled={this.childNames.length === 0}></Button>
                        <Button hasIconOnly renderIcon={ChevronRight32} iconDescription="R" onClick={this.onNextChild} disabled={this.childNames.length === 0}></Button>
                    </div>
                </div>


                {/* non-group parameter */}
                {this.renderCurrentChildren()}
                
                {/* group parameter */}
                {this.renderCurrentChildGroups()}

            </div>
        );
    }

};

export const ParameterTabsSwitcher = parameterWrapped({ignoreReadonly: true})(ParameterTabsSwitcherC);