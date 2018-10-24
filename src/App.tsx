import * as moment from 'moment';
import * as React from 'react';
import AnalogClock, {Themes} from 'react-analog-clock';
import './App.scss';

import logo from './logo.png';


class App extends React.Component<{},
{business: {}, loaded:boolean, system: {is_online: boolean, signups_allowed: boolean, system_time: null}}> {
  constructor(props: {}) {
    super(props);
    this.state = {
      business: {
        closes: null,
        is_open: false,
        is_open_24h_today: false,
        opens: null
      }, // variables used to display
      loaded: false,
      system: {
        is_online: false,
        signups_allowed: false,
        system_time: null
      } // variables used to display
    };

  }


  /*
    Calculates Offset between current time and system time
  */
  public calculateOffSet(currentTime:number) {
    const now = moment()
    console.log(now)
    return now
  }

  public systemStatus(onlineStatus:boolean, signupsAllowed:boolean) {
    // const onlineStatus = this.state.system.is_online
    // const signupsAllowed = this.state.business.signups_allowed

    let msg = "Our servers are "

    if(onlineStatus){
      msg += "Up!"

      if(signupsAllowed){
        msg += " Sign up today!"
      }
    } else {
      msg += "Down!"
    }

    return msg
  }

  public componentWillMount(){
    fetch("https://app.akira.md/api/system_status").then(response => {
      if(!response.ok){
        throw new Error(response.statusText)
      }

      response.json().then((data) => {
        console.log(data)
        /*
        const business:Business = new Business(data.is_open_for_business,
          data.is_open_24h_today, data.open_hours_today.open_at,
            data.open_hours_today.close_at, data.direct_signup_allowed)
        */
        // const system:System = new System(data.system_time, data.online)

        this.setState({
          business: {
            closes: data.open_hours_today.close_at,
            is_open: data.is_open_for_business,
            is_open_24h_today: data.is_open_24h_today,
            opens: data.open_hours_today.open_at
          },
          loaded: true,
          system: {
            is_online: data.online,
            signups_allowed: data.direct_signup_allowed,
            system_time: data.system_time
          }
        })


      })
    })
  }

  public render() {
    this.calculateOffSet(this.state.system.system_time)
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>System Status & Opening hours</h1>
        </header>
        <div className="Main-card">
          <p className="sys-status">
            {this.systemStatus(this.state.system.is_online, this.state.system.signups_allowed)}
          </p>
          <AnalogClock theme={Themes.dark} width={250} />
          <p className="server-label">Server time</p>
        </div>
      </div>
    );
  }
}

export default App;
