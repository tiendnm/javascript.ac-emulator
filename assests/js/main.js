/**
  * VARIABLE
  */
var intervalID = null;
const swingButton = document.getElementById("btn-toggle-swing");
const powerButton = document.getElementById("btn-toggle-power");
const swingElement = document.getElementById("swing");
const temperatureElement = document.getElementById("temperature");
const decreaseTemperatureButton = document.getElementById("btn-decrease-temp");
const increaseTemperatureButton = document.getElementById("btn-increase-temp");
/**
 * FUNCTION
 */
const intervalManager = (flag, animate, time) => {
    if (flag)
        intervalID = setInterval(animate, time);
    else
        clearInterval(intervalID);
}
/**
 * CLASS
 */

class AirConditioner {
    _swingDegree = 0
    _isSwing = true
    _isPowerOn = false
    _isSwingBack = false
    _maxTemperature = 30
    _minTemperature = 16
    _currentTemperature = 25
    constructor() {
        this.#setTemp()
    }
    #swing() {
        swingElement.style.transform = `rotateX(${this._swingDegree}deg)`;
    }
    #decreaseSwingDegree() {
        this._swingDegree -= 1;
        this.#swing();
    }
    #increaseSwingDegree() {
        this._swingDegree += 1;
        this.#swing();
    }
    #setTemp() {
        temperatureElement.textContent = this._currentTemperature
    }
    togglePower() {
        this._isPowerOn = !this._isPowerOn;
        this.#triggerRun();
    }
    toggleSwing() {
        if (this._isPowerOn) {
            this._isSwing = !this._isSwing;
        }
    }
    increaseTemperature() {
        if (this._currentTemperature < this._maxTemperature) {
            this._currentTemperature += 1;
            this.#setTemp()
        }
    }
    decreaseTemperature() {
        if (this._currentTemperature > this._minTemperature) {
            this._currentTemperature -= 1;
            this.#setTemp()
        }
    }
    #triggerRun() {
        intervalManager(false);
        //================================
        if (this._isPowerOn) {
            this.#powerOn();
        }
        //================================
        if (!this._isPowerOn) {
            this.#powerOff();
        }
    }
    #powerOn() {
        this._isSwingBack = false;
        intervalManager(true,
            () => {
                if (this._isSwing) {
                    if (this._isSwingBack) {
                        this.#decreaseSwingDegree();
                        if (this._swingDegree == 0) {
                            this._isSwingBack = false
                        }
                    }
                    if (!this._isSwingBack) {
                        this.#increaseSwingDegree();
                        if (this._swingDegree == 180) {
                            this._isSwingBack = true;
                        }
                    }
                }
            },
            7200 / 360
        )
    }
    #powerOff() {
        intervalManager(true,
            () => {
                if (this._swingDegree == 0) {
                    intervalManager(false);
                } else {
                    this.#decreaseSwingDegree()
                }
            },
            7200 / 360
        )
    }
}
/**
 * ================================================================================================================
 */
const myAirConditioner = new AirConditioner();
powerButton.addEventListener("click", () => {
    myAirConditioner.togglePower();
});
swingButton.addEventListener("click", () => {
    myAirConditioner.toggleSwing();
});
decreaseTemperatureButton.addEventListener("click", () => {
    myAirConditioner.decreaseTemperature();
});
increaseTemperatureButton.addEventListener("click", () => {
    myAirConditioner.increaseTemperature();
});