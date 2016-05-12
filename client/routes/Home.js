var React = require('react');
var Products = require('../scripts/components/products');
var Basket = require('../scripts/components/basket');

var Home = React.createClass({
	render: function() {
		return (
			<div className="row">
				<Products />
				<Basket />
			</div>
		);
	}
});

module.exports = Home;
