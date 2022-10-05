import * as React from 'react';

interface Props {
    offsrc: string;
    onsrc: string;
};

interface State {
    on: boolean;
};

export default class ToggleButton extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            on: false
        };
    }

    toggle = () => {
        this.setState({ on: !this.state.on });
    }

    render() {
        return (
            <a onClick={this.toggle}>
                <img src={this.state.on ? this.props.onsrc : this.props.offsrc}>                    
                </img>
            </a>
        );
    }
}