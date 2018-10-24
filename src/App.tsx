import * as moment from 'moment';
// import * as momenttz from 'moment-timezone';
import * as React from 'react';
import AnalogClock, {Themes} from 'react-analog-clock';
import './App.scss';
import './Responsive.scss';

import done from "./done.gif";
import loading from './loading.svg';
import logo from './logo.png';


class App extends React.Component<{},
{business: {}, loaded:boolean, gifdone:boolean, system: {is_online: boolean, signups_allowed: boolean, system_time: null}}> {
  constructor(props: {}) {
    super(props);
    this.state = {
      business: {
        closes: null,
        is_open: false,
        is_open_24h_today: false,
        opens: null
      }, // variables used to display
      gifdone: false,
      loaded: false,
      system: {
        is_online: false,
        signups_allowed: false,
        system_time: null
      } // variables used to display
    };

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


  public systemStatus(onlineStatus:boolean, signupsAllowed:boolean) {
    // const onlineStatus = this.state.system.is_online
    // const signupsAllowed = this.state.business.signups_allowed

    let msg = ""

    if(onlineStatus){
      msg += " Up!"

      if(signupsAllowed){
        msg += " Sign up today!"
      }
    } else {
      msg += " Down! Thank you for your patience."
    }

    return msg
  }

  public showOpeningHours(){
    alert("opening hours")
  }

  public render() {
    /*
    if(this.state.system.system_time != null){
      this.calculateOffSet(this.state.system.system_time)
    }
    */
    // get offset and display that
    const secOffSet = moment.parseZone().utcOffset();
    const hqsecOffSet = moment.parseZone().utcOffset();

    let strOffSet = String(secOffSet/60);

    if(!strOffSet.includes(".")){
      strOffSet += ".0"
    }

    console.log(strOffSet)
    console.log(this.state.business)

    if(this.state.loaded && this.state.gifdone){
      return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1>System Machine</h1>
          </header>
          <div className="Main-card">
            <p className="sys-status">
              Our Servers are
              <b className={"sys-status-" + this.state.system.is_online}>
                {this.systemStatus(this.state.system.is_online, this.state.system.signups_allowed)}
              </b>
            </p>
            <AnalogClock theme={Themes.dark} width={250} gmtOffset={strOffSet} />
            <p className="server-label">Server time</p>
            {secOffSet !== hqsecOffSet &&
              <p className="change-timezone">
                <a href="#">Change to Toronto's timezone</a>
              </p>
            }
            <p className="opening-hours">
              {this.state.business &&
                <a href="#" onClick={this.showOpeningHours}>Show opening hours</a>
              }
              {!this.state.business &&
                <span>Sorry we are closed!</span>
              }
            </p>
          </div>
        </div>
      );
    } else {

      if(this.state.loaded && !this.state.gifdone){
        setTimeout(() => this.setState({gifdone: true}), 1100);
      }

      return (
        <div className="App loading">
          {!this.state.loaded && 
            <div className="loading-container">
              <img src={loading} className="loading" alt="loading" />
              <p>Loading...</p>
            </div>
          }

          {!this.state.gifdone && this.state.loaded &&
            <div className="gif-container">
              <img src={done} className="done" alt="Done!" />
              <p>Loaded!</p>
            </div>
          }

        </div>
      )
    }
  }
}

export default App;
