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
    circlelabel:string,
    circlerotation:number,
    circlewidth:number,
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
      circlelabel: "",
      circlerotation: 0,
      circlewidth: 0,
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

  public showOpeningHours(e: any){
    e.preventDefault()
    this.setState({
      showopenhours: true
    })

    const open24hours = this.state.business.is_open_24h_today

    if(open24hours){

      // wait .1s
      setTimeout(() => this.setState({circlewidth: 1}), 100);

      this.setState({circlelabel: "24 hours", circlerotation: -90})

    } else {
      // use moment to parse start and end time

      const openingtime = this.state.business.opens
      const closingtime = this.state.business.closes

      const parseOpeningtime = moment(openingtime)
      const startHour = Number(parseOpeningtime.format("H"))
      const startMinute = Number(parseOpeningtime.format("m"))

      let circlelabel = String("")
      if(startHour < 12){
        circlelabel += String(startHour)

        if(startMinute !== 0){
          circlelabel += ":" + startMinute
        }
        circlelabel += "am - "

      } else if(startHour === 12){
        circlelabel += String(startHour)

        if(startMinute !== 0){
          circlelabel += ":" + startMinute
        }
        circlelabel += "pm - "
      } else {

        circlelabel += String(startHour - 12)

        if(startMinute !== 0){
          circlelabel += ":" + startMinute
        }

        circlelabel += "pm - "
      }

      const parseClosingtime = moment(closingtime)
      const endHour = Number(parseClosingtime.format("H"))
      const endMinute = Number(parseClosingtime.format("m"))

      if(endHour < 12){
        circlelabel += String(endHour)

        if(endMinute !== 0){
          circlelabel += ":" + endMinute
        }

        circlelabel += "am"
      } else if(endHour === 12){
        circlelabel += String(endHour)

        if(endMinute !== 0){
          circlelabel += ":" + endMinute
        }

        circlelabel += "pm"
      } else {
        circlelabel += String(endHour - 12)

        if(endMinute !== 0){
          circlelabel += ":" + endMinute
        }

        circlelabel += "pm"
      }

      this.setState({
        "circlelabel": circlelabel
      })

      // calculate difference to find circle width
      const startMinuteFactor = startMinute/60
      const endMinuteFactor = endMinute/60

      const startTimeFactor = startHour + startMinuteFactor
      const endTimeFactor = endHour + endMinuteFactor

      const totaltime = Number((endTimeFactor - startTimeFactor).toFixed(2))
      const finalWidth = (totaltime * 0.1) - 0.1


      // get rotation angle
      let startAngle = -90

      if(startHour < 12){
        startAngle += 30 * startTimeFactor
      } else {
        startAngle += 30 * (startTimeFactor - 12)
      }



      this.setState({
        circlerotation: startAngle,
        circlewidth: finalWidth
      })

    }

  }
  public hideOpeningHours(e:any){
    e.preventDefault()
    this.setState({
      circlelabel: "",
      circlewidth: 0,
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

    if(this.state.loaded && this.state.gifdone){

      const myprop = {
        "strokeDasharray": String(141 * this.state.circlewidth) + " " + String(141),
        "transition": "stroke-dasharray 1s linear"
      } as React.CSSProperties

      let transformOutput = ""
      if(this.state.circlerotation !== 0){
        transformOutput = "rotate(" + String(this.state.circlerotation) + "deg" + ")"
      }

      const parentprop = {
        "transform": transformOutput
      } as React.CSSProperties

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
                <svg style={parentprop} width="100" height="100" className="opening-hours-circle">
                    <circle r="50" cx="50" cy="50" className="circle"/>
                    <circle id="pie" r="22.5" cx="50" cy="50" style={myprop} />
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
