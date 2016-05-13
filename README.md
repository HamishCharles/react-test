# react-test

## Intro
This project was created from the Yeoman template React Fullstack. It shows the use of simple hand coded datastore.

## Requirements
Requires node server with npm.

## To run
```npm install```

then

```npm start```

## To run tests
```npm test```

## Development Journey
The Yeoman template includes Express for the server and there are two paths - one to serve the index and the other the product data ````/api/products````. I used the npm library Superagent to simplify the handling of XMLHttpRequest from the client. The template includes Bootstrap making the implementation of a responsive design straightforward.

A simple handcoded datastore was created to handle the need for both the product catalog component and the basket component to interact with the basket data. It has a simple but effective sub/unsub mechanism to enable the React basket component to re-render when changes are made to the data. I did not create a datastore for the product data but in a real-life application this would be required.

I attempted to use the BigDecimal library to handle the math calculations to prevent floating point maths errors. I had some success with this but not in every case. So I went back to JS floating point maths and fixing the decimal points before display with ````toFixed(2)````. The obvious solution would be to convert all the prices to pence from pounds and shifting the decimal point before display so that maths was integer maths but I ran out of time to work on this.
