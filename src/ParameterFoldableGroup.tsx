import * as React from 'react';
import { type InjectedProps, parameterWrapped } from './ElementWrapper';
import { GroupParameter, Parameter } from 'rabbitcontrol';
import ParameterWidget from './ParameterWidget';
import { Add } from '@mui/icons-material';

import Accordion from '@mui/joy/Accordion';
import AccordionDetails from '@mui/joy/AccordionDetails';
import AccordionGroup from '@mui/joy/AccordionGroup';
import AccordionSummary, { accordionSummaryClasses } from '@mui/joy/AccordionSummary';


interface Props {
    style?: React.CSSProperties;
};

interface State {
    isOpen: boolean;
};

export class ParameterFoldableGroupC extends React.Component<Props & InjectedProps, State> {

    static readonly COMPONENT_DEFAULT_COLOR = "#ff0000";

    constructor(props: Props & InjectedProps) {
        super(props);
    
        this.state = {
            isOpen: false,
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
            }).map( (p) => { 
                return (
                    <ParameterWidget 
                        key={p.id}
                        parameter={p} 
                        onSubmitCb={this.onSubmit}
                    />
                );
            });
    }
    
    render()
    {
        let label = "no label";
        const param = this.props.parameter;
        if (param && param.label !== undefined) {
            label = param.label;
        }

        return (
            <div
                // style={this.props.style}
            >
                {/* <Stack 
                    sx={{
                        justifyContent: "center",
                        alignItems: "center",
                    }}                
                    style={{marginBottom: this.state.isOpen ? 5 : 0}}
                    direction="row"
                    onClick={this.handleButtonClick}
                >
                    {this.state.isOpen ? <Remove/> : <Add/>}
                    <div style={{marginLeft: 10}}/>
                    <p>{label}</p>
                </Stack> */}
                <AccordionGroup
                    sx={{
                    [`& .${accordionSummaryClasses.indicator}`]: {
                    transition: '0.2s',
                    },
                    [`& [aria-expanded="true"] .${accordionSummaryClasses.indicator}`]: {
                    transform: 'rotate(45deg)',
                    },
                }}
                >
                    <Accordion
                        expanded={this.state.isOpen}
                        onChange={(event, expanded) => {
                            this.setState({isOpen: expanded});
                        }}
                    >
                        <AccordionSummary indicator={<Add />}>{label}</AccordionSummary>
                        <AccordionDetails>
                            {this.renderChildren()}
                        </AccordionDetails>
                    </Accordion>
                </AccordionGroup>
            </div>
        );
    }

    private handleButtonClick = () => {
        this.setState({
            isOpen: !this.state.isOpen,
        });
    }
};

export const ParameterFoldableGroup = parameterWrapped({ignoreReadonly: true})(ParameterFoldableGroupC);