// This class represents the fretboard
class Fretboard {
  constructor(canvas, numberOfFrets = 24) {
    this.numberOfFrets = numberOfFrets;
    this.width = canvas.width;
    this.canvas = canvas;

    // this is an approxumation of the tempered scale
    // geometric progression ratio 2^(1/12)
    this.ratio = 0.94;
    this.frets = [];
    this.drawFretboard();
  }

  drawFret(entry) {
    entry.draw();
  }

  drawScale(scale, fromFret, fromString = 6, span = 8) {
    var pos = fromFret;
    var string = fromString - 1;
    var step = 0;

    do {
      if (step == 0) {
        this.frets[pos].mark(string, theme.fundamental);
      } else {
        this.frets[pos].mark(string);
      }
      pos += scale[step];
      step++;
      if (step >= scale.length) {
        step = 0;
      }
      if (pos > fromFret + 3) {
        pos -= (string == 2 ? 4 : 5);
        string--;
      }
    } while (string >= 0 && --span > 0);
  }
  // magic
  drawFretboard() {
    // inizializza i Frets
    var from = this.width;

    const resArrayOfWidthAndStart = [];
    for (let i = 0; i < this.numberOfFrets; i++) {
      var width = from * (1 - this.ratio);
      from -= width;
      resArrayOfWidthAndStart.push({ fretNumber: i + 1, width });
    }
    var test = resArrayOfWidthAndStart.reduce((accum, elem) => {
      accum += elem.width;
      return accum;
    }, 0);

    var from = this.width - 3;

    const updatedResArrayOfWidthAndStart = [];

    for (let i = resArrayOfWidthAndStart.length - 1; i >= 0; i--) {
      const elem = resArrayOfWidthAndStart[i];
      let newElem = { ...elem, start: this.width - from, };
      from -= elem.width;
      updatedResArrayOfWidthAndStart.push(newElem);
    }

    for (let i = this.numberOfFrets; i > 0; i--) {
      const NeededFret = updatedResArrayOfWidthAndStart.find((elem) => elem.fretNumber === i);
      const newFret = new Fret(NeededFret.start, NeededFret.width, this.canvas, i);
      // this.frets.push();
      if ([3, 5, 7, 9, 12, 15, 17, 19, 21, 24].indexOf(i) >= 0) {
        newFret.dot = true;
        if (i === 12 || i === 24) {
          newFret.doubleDot = true;
        }
      } else {
        newFret.pallino = false;
      }
      this.frets.push(newFret);
    }
    this.frets.forEach(this.drawFret);

    const ctx = this.canvas.getContext('2d');
    ctx.fillStyle = theme.fret;
    ctx.fillRect(0, 0, 3, this.canvas.height);
  }

  findClickedFretString(canvasCoords) {
    let { x, y } = canvasCoords;
    for (let i = 0; i < this.frets.length; i++) {

      if ((i + 1) === this.frets.length) {
        return this.frets[i].getStringFret(canvasCoords);
      }

      if ((this.frets[i].start <= x) && this.frets[i + 1].start > x) {
        return this.frets[i].getStringFret(canvasCoords);
      }
    }
  }

}

class Fret {
  constructor(start, width, canvas, fretNumber) {
    this.start = start;
    this.width = width;
    this.canvas = canvas;
    this.dot;
    this.doubleDot;
    this.fretNumber = fretNumber;
    this.ctx = canvas.getContext('2d');
    this.highlightedStrings = [];
    window.store.subscribe(() => {
      const newState = store.getState();
      console.log('stateUpdated', newState);
      newState.selectedFrets.forEach((elem) => {
        if (elem.fret === this.fretNumber && !this.highlightedStrings.includes(elem.string)) {
          this.renderStringSelection(elem.string, newState.colorSelectedFrets);
          this.highlightedStrings.push(elem.string);
        }
      });


    });
  }


  renderStringSelection(stringNumber, color) {
    this.ctx.fillStyle = color;
    const stringStartedDrawIndex = this.findString(stringNumber) - 7;
    this.ctx.fillRect(this.start, stringStartedDrawIndex, this.width - 3, 14);
  }

  getStringFret(coords) {
    console.log(this.fretNumber, 'coords ', coords);

    for (let string = 6; string > 0; string--) {

      if (coords.y === this.findString(string)) {
        return { fret: this.fretNumber, string };
      }

      console.log('string ', string, coords.y, this.findString(string));

      if (coords.y < this.findString(string)) {
        if (this.findString(string) - coords.y <= 7) {
          return { fret: this.fretNumber, string };
        }
      }

      if (coords.y > this.findString(string)) {


        if (coords.y - this.findString(string) <= 7) {
          return { fret: this.fretNumber, string };
        }
      }




      // if (string - 1 === 0) {
      //   return { fret: this.fretNumber, string };
      // }

      // console.log(this.findString(string), coords.y);

      // if (this.findString(string) <= coords.y && this.findString(string - 1) > coords.y) {
      //   return { fret: this.fretNumber, string };
      // }
    }

  }

  findCoordsTwoDots() {
    const firstValue = this.canvas.height / 2 + 18;
    const secondValue = this.canvas.height / 2 - 18;
    return { firstValue, secondValue };
  }

  draw() {
    // the neck
    this.ctx.fillStyle = theme.neck; //"#807050";
    // this.ctx.fillRect(this.start, 0, this.width, this.canvas.height);
    const texture = document.getElementById('image');
    this.ctx.drawImage(texture, this.start, 0, this.width - 3, this.canvas.height);

    // the dot
    if (this.dot == true) {
      if (this.doubleDot) {
        this.ctx.beginPath();
        this.ctx.fillStyle = theme.dot;
        const { firstValue, secondValue } = this.findCoordsTwoDots();
        this.ctx.arc(this.start + this.width / 2.2, firstValue, 4, 0, 2 * Math.PI);
        this.ctx.arc(this.start + this.width / 2.2, secondValue, 4, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.closePath();
        // debugger;
      } else {
        this.ctx.beginPath();
        this.ctx.fillStyle = theme.dot;
        this.ctx.arc(this.start + this.width / 2.2, this.canvas.height / 2, 4, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.closePath();
      }
    }
    // the nut
    this.ctx.fillStyle = theme.fret;
    this.ctx.fillRect(this.start + this.width - 3, 0, 3, this.canvas.height);
    var img = document.getElementById("image");
    // the strings
    this.ctx.fillStyle = theme.string;
    for (let string = 6; string > 0; string--) {
      this.ctx.fillRect(this.start, this.findString(string), this.width, (0.5 + (string / 4)));
    }
  }



  mark(string, color) {
    this.ctx.beginPath();
    color = (typeof color === 'undefined') ? theme.scale : color;
    this.ctx.fillStyle = color;
    this.ctx.arc(this.start + this.width / 2, this.findString(string), 7, 0, 2 * Math.PI);
    this.ctx.fill();
  }

  findString(number) {
    const newNumber = 7 - number;
    return -8 + 15 * newNumber;
  }
}

// theme based on burlywood http://www.colorhexa.com/deb887
const theme = {
  neck: '#221709',
  dot: '#808080',
  fret: '#e2c196',
  string: '#fcf8f3',
  fundamental: '#87deb8',
  scale: '#87adde'
};

const scale = {
  major: [2, 2, 1, 2, 2, 2, 1],
  jonian: [2, 2, 1, 2, 2, 2, 1],
  dorian: [2, 1, 2, 2, 2, 1, 2],
  phrygian: [1, 2, 2, 2, 1, 2, 2],
  lydian: [2, 2, 2, 1, 2, 2, 1],
  mixolydian: [2, 2, 1, 2, 2, 1, 2],
  eolian: [2, 1, 2, 2, 1, 2, 2],
  locrian: [1, 2, 2, 1, 2, 2, 2],
  hexatonic: [2, 2, 2, 2, 2, 2],
  minor: [2, 1, 2, 2, 1, 2, 2],
  jazz_minor: [2, 1, 2, 2, 2, 2, 1],
};


