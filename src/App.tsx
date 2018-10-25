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
  {
    business: {
      closes:string,
      is_open:boolean,
      is_open_24h_today:boolean,
      opens:string
    },
    circleclass:string,
    circlelabel:string,
    loaded:boolean,
    gifdone:boolean,
    showopenhours:boolean,
    system: {
      is_online: boolean,
      signups_allowed: boolean,
      system_time: string
    }}>
    {

  constructor(props: {}) {
    super(props);
    this.state = {
      business: {
        closes: "",
        is_open: false,
        is_open_24h_today: false,
        opens: ""
      }, // variables used to display
      circleclass: "",
      circlelabel: "",
      gifdone: false,
      loaded: false,
      showopenhours:false,
      system: {
        is_online: false,
        signups_allowed: false,
        system_time: ""
      } // variables used to display
    };

    this.systemStatus = this.systemStatus.bind(this)
    this.showOpeningHours = this.showOpeningHours.bind(this)
    this.changeTimeZone = this.changeTimeZone.bind(this)
    this.hideOpeningHours = this.hideOpeningHours.bind(this)

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


  public systemStatus() {
    const onlineStatus = this.state.system.is_online
    const signupsAllowed = this.state.system.signups_allowed

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
    // const circumference = 141;
    this.setState({
      showopenhours: true
    })

    if(this.state.business.is_open_24h_today){
      console.log("open")

      // wait .1s
      setTimeout(() => this.setState({circleclass: "percent-100"}), 100);

      // wait 1.5s for animation to complete
      setTimeout(() => this.setState({circlelabel: "24 hours"}), 1500);

    } else {
      // use moment to parse start and end time

      console.log("not open")
    }

  }
  public hideOpeningHours(){
    this.setState({
      circleclass: "",
      circlelabel: "",
      showopenhours: false
    })
  }

  public changeTimeZone(){
    alert("change timezone")
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
        <div className="App not-loaded">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1>System Machine</h1>
          </header>
          <div className="Main-card">
            <p className="sys-status">
              Our Servers are
              <b className={"sys-status-" + this.state.system.is_online}>
                {this.systemStatus()}
              </b>
            </p>
            <AnalogClock theme={Themes.dark} width={250} gmtOffset={strOffSet} />
            <p className="server-label">Server time</p>
            {secOffSet !== hqsecOffSet &&
              <p className="change-timezone">
                <a href="#" onClick={this.changeTimeZone}>Change to Toronto's timezone</a>
              </p>
            }
            <div className="opening-hours">
              {this.state.business && this.state.business.is_open &&
                <div className="open-container">
                  <span>We are open!</span><br/>
                </div>
              }
              {(!this.state.business || !this.state.business.is_open) &&
                <span>Sorry we are closed!</span>
              }

              {!this.state.showopenhours &&
                <a href="#" onClick={this.showOpeningHours}>See opening hours</a>
              }
              {this.state.showopenhours &&
                <a href="#" onClick={this.hideOpeningHours}>Hide opening hours</a>
              }
            </div>

            {this.state.showopenhours &&
              <div>
                <svg width="100" height="100" className="opening-hours-circle 24h-true">
                    <circle r="50" cx="50" cy="50" className="circle"/>
                    <circle id="pie" r="22.5" cx="50" cy="50" className={"circle " + this.state.circleclass}/>
                </svg>
                <p className="opening-hours-label">{this.state.circlelabel}</p>
              </div>
            }

          </div>
        </div>
      );
    } else {
      if(this.state.loaded && !this.state.gifdone){
        setTimeout(() => this.setState({gifdone: true}), 2500);
      }

      return (
        <div className="App loading">
          {!this.state.loaded &&
            <div className="loading-container">
              <img src={logo} className="loading-logo" alt="Akira MD" />
              <img src={loading} className="loading" alt="loading" />
              <span>Loading...</span>
            </div>
          }

          {!this.state.gifdone && this.state.loaded &&
            <div className="gif-container">
              <img src={logo} className="loading-logo loaded" alt="Akira MD" />
              <img src={done} className="done" alt="Done!" />
              <span>Loaded!</span>
            </div>
          }

        </div>
      )
    }
  }
}

export default App;
