import * as React from 'react';
import ToggleButton from './ToggleButton';

interface Props {
};

interface State {
};

export default class SMHeader extends React.Component<Props, State> {

    render() {

        return (
            <div className="smheader">

                <div className="header-empty">                    
                </div>

                <div className="header-line grow">                    
                    <img src='smlogo.svg' />
                    <label className='smlogofont'>SpaceMusic</label>
                    <div className='grow'></div>
                    <ToggleButton offsrc='/smsettings.svg' onsrc='/smsettings-on.svg'></ToggleButton>
                </div>

            </div>
        );
    }
}