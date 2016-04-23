let _name = 'Common';

export class Common {
  constructor() {
    console.log(`>>> ${this.getName()} constructor`);
  }
  getName() {
    return _name;
  }
}
