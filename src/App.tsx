import * as React from 'react';
import AnalogClock, {Themes} from 'react-analog-clock';
import {Business} from './Business';
import {System} from './System';

import './App.scss';

import logo from './logo.png';


class App extends React.Component {
  constructor(props: {}) {
    super(props);
    this.state = {
      business: null, // variables used to display
      loaded: false,
      system: null, // variables used to display
    };
  }


  public componentWillMount() {
    fetch("https://app.akira.md/api/system_status").then(response => {
      if(!response.ok){
        throw new Error(response.statusText)
      }

      response.json().then((data) => {
        console.log(data)
        const system = new System(data.system_time, data.online)
        const business = new Business(data.is_open_for_business,
          data.is_open_24h_today, data.open_hours_today.open_at,
            data.open_hours_today.close_at, data.direct_signup_allowed)
        console.log(system)
        console.log(business)
        this.setState({
          business: {business},
          system: {system}
        })
      })
    })
  }

  /*
    Calculates Offset between current time and system time
  */
  public calculateOffSet(currentTime:number) {
    return currentTime
  }

  public systemStatus(onlineStatus:boolean, signupsAllowed:boolean) {
    let msg = ""

    if(onlineStatus){
      msg += "Our servers are Up!"

      if(signupsAllowed){
        msg += " Sign up today!"
      }
    } else {
      msg += "Our servers are Down!"
    }

    return msg
  }

  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>System Status & Opening hours</h1>
        </header>
        <p className="App-intro">
          {this.systemStatus(this.state.system.online, this.state.business.signupsAllowed)}
        </p>
        <AnalogClock theme={Themes.dark} width={250} gmtOffset="-5.5" />
      </div>
    );
  }
}

export default App;
