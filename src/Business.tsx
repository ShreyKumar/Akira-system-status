import {OpeningHours} from './OpeningHours'

export class Business {
  private openingHours: OpeningHours

  constructor(public isOpen: boolean, public is24hour: boolean, open: number, close:number, public signupsAllowed: boolean){
      this.openingHours = new OpeningHours(open, close)
  }

  public getTodayHours(){
    return this.openingHours
  }

}
