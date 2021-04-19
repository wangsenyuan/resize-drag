import React from "react";
import {RecoilRoot} from 'recoil'

import StateTest from './state/state-test'

const App = () => {
    return (
        <RecoilRoot>
            <div>
                <StateTest/>
            </div>
        </RecoilRoot>
    );
};

export default App;
