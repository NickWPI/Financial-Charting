# Financial Charting

## Overview
This is a financial charting demo written in Javascript. This demo showcases my charting library that allows you
create colorful and interactive financial charts. To illustrate this, this demo app pulls and displays historical cryptocurrency data.

*Note: This repository is a demo app showcasing the functionality of the underlying financial charting library that 
I have created.*

**This is a work in progress and I am continuing to refine the library and add new features**

<img src="https://raw.githubusercontent.com/NickWPI/Financial-Charting/master/screenshots/Capture2.PNG">

## Language and Technologies Used
- JavaScript
- React
- D3

## Features
### Graphs
Various graph types are supported, with plans to add more in the future. 

The current graph types are:
- Candlestick
- Line
- Bar
- RSI (if more indicators are added, more graph types will also be added)

### Interaction
The chart is interactive, and are both **zoomable** and **pannable**.

### Indicators
Indicators algorithms and graphs are supported. To showcase this, I have added support for two indicators: Simple Moving Average and 
the Relative Strength Index. More can be easily added in the future as the code is easily extensible for various
different graph types and algorithms.

### Labels
Interactive UI Labels rendered in SVG with support for clickable icons. These labels are great for displaying
the current financial indicators being presently displayed on the chart.

## Building & Running
Download this repository, navigate into the base directory of the app, open the command line, and type
**npm run build**. This assumes that npm is installed on your computer. From there, the project should be viewable
when typing **localhost:3000** in your browser.

The appbar (for demo purposes) contains 4 buttons. The first one is for choosing and customizing a financial indicator.
The second button is for selecting starting date range for the chart. The third one is for choosing a graph type for
the cryptocurrency pair. Currently, the two options are Candlestick and Line graphs. The last one is to search up the
coin pairs. 

*Note: Pairs should be searched using their symbol, with a line separating the two*

Here are examples of valid symbol pairs:
- BTC-USD (Bitcoin to dollars)
- ETH-BTC (Ethereum to Bitcoin)
- LTC-USDT (Litecoin to Tether)

## Data Provider
For this demo, I am using **Cryptocompare** to retrieve historical cryptocurrency data. All of the coins listed
on cryptocompare are searchable within this app. After searching various providers, Cryptocompare seems to be the
best provider avaliable, and the API is wonderful.

For more information on Cryptocompare, go to https://min-api.cryptocompare.com/

## The Future
This project has been very fun for me, and I am still adding new features. Here are some of my thoughts:
- Add endpoint axis annotations (very important)
- Full screen crosshairs at the mouse location (very important)
- Support streaming data (move the x-scale domain whenever new data is added, and only if the last
data point is visible) 
- Add support for more indicators (EMA, MACD, Bolinger Bands)
- Continue to clean up code and perform minor bug fixes

I know the UI for the demo is pretty bare-bones, but my focus is more on improving the charting library, rather than
creating the best UI. The UI was whipped up just to showcase the charting features.

## Gallery

<img src="https://raw.githubusercontent.com/NickWPI/Financial-Charting/master/screenshots/Capture.PNG">
<img src="https://raw.githubusercontent.com/NickWPI/Financial-Charting/master/screenshots/Capture3.PNG">
<img src="https://raw.githubusercontent.com/NickWPI/Financial-Charting/master/screenshots/Capture4.PNG">
<img src="https://raw.githubusercontent.com/NickWPI/Financial-Charting/master/screenshots/Capture5.PNG">
<img src="https://raw.githubusercontent.com/NickWPI/Financial-Charting/master/screenshots/Capture6.PNG">
