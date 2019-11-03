export class MovingAverageProperty {
    setPeriod(period) {
        this.period = period;
    }

    setMAType(type) {
        this.type = type;
    }

    setColor(color) {
        this.color = color;
    }

    getChartAreaName() {
        return "mainChart";
    }

    formatType() {
        if (this.type == "Simple") {
            return "sma";
        }
        else if (this.type == "Exponential") {
            return "ema";
        }
    }

    formatName() {
        if (this.type == "Simple") {
            return "sma" + this.period;
        }
        else if (this.type == "Exponential") {
            return "ema" + this.period;
        }
    }

    formatLabel() {
        if (this.type == "Simple") {
            return "MA(S, " + this.period + ")";
        }
        else if (this.type == "Exponential") {
            return "MA(E, " + this.period + ")";
        }
    }

    formatParameters() {
        return { period: this.period, color: this.color };
    }
}

export class RSIProperty {
    setPeriod(period) {
        this.period = period;
    }

    setColor(color) {
        this.color = color;
    }

    getChartAreaName() {
        return this.formatName();
    }

    formatType() {
        return "rsi";
    }

    formatName() {
        return `rsi${this.period}`;
    }

    formatLabel() {
        return `RSI(${this.period})`;
    }

    formatParameters() {
        return { period: this.period, color: this.color };
    }
}
