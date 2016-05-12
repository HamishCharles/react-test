var React = require('react');
var request = require('superagent');
var DatastoreBasket = require('../datastore/datastore-basket');

var Products = React.createClass({

  getInitialState: function () {
    return {
      products: []
    };
  },

  componentDidMount: function () {
    request
      .get('/api/products')
      .end(function(error, response) {
        this.setState({products: response.body});
      }.bind(this));
  },

  onAddClick: function(index) {
    DatastoreBasket.add(this.state.products[index]);
  },

  productRows: function() {
    return this.state.products.map( (product, index) =>
      <tr key={index}>
        <td>{product.code}</td>
        <td>
          {product.description}
          <img src={'/images/'+product.image} className="img-responsive" />
        </td>
        <td>£{product.price.toFixed(2)}</td>
        <td>{product.discount ? product.discount.description : ''}</td>
        <td><button className="btn btn-sm" onClick={this.onAddClick.bind(null, index)} >Add to basket</button></td>
      </tr>
    );
  },

	render: function() {
		return (
      <div className="col-md-8">
        <h4>Products</h4>
        <table className="table">
          <thead>
          <tr>
            <th>Code</th>
            <th>Description</th>
            <th>Price</th>
            <th>Offer</th>
            <th>&nbsp;</th>
          </tr>
          </thead>
          <tbody>
            {this.productRows()}
          </tbody>
        </table>
      </div>

		);
	}
});


module.exports = Products;
