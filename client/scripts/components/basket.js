var React = require('react');
var DatastoreBasket = require('../datastore/datastore-basket');

var Basket = React.createClass({

  setBasket: function (data) {
    this.setState(data);
  },

  getInitialState: function () {
    return DatastoreBasket.get();
  },

  componentDidMount: function () {
    DatastoreBasket.sub(this, this.setBasket);
  },

  componentWillUnmount: function () {
    DatastoreBasket.unsub(this, this.setBasket);
  },

  onRemoveClick: function(index) {
    DatastoreBasket.remove(index);
  },

  onEmptyClick: function() {
    DatastoreBasket.empty();
  },

  basketItemRows: function () {
    return this.state.items.map( (item, index) =>
      <tr key={index}>
        <td>{item.description} <br /><small>{item.discount ? item.discount.description : ''}</small></td>
        <td className="text-right">£{item.price.toFixed(2)}</td>
        <td><button className="btn btn-sm" onClick={this.onRemoveClick.bind(null, index)} >Remove from basket</button></td>
      </tr>
    );
  },

  emptyBasketButton: function () {
    if(this.state.items.length) {
      return <button className="btn btn-sm" onClick={this.onEmptyClick} >Empty basket</button>
    }
  },

  totalRow: function () {
    if(this.state.total) {
      return <tr>
        <th className="text-right">Total:</th>
        <th className="text-right" className="text-right">£{this.state.total.toFixed(2)}</th>
        <th></th>
      </tr>
    }
  },

	render: function() {
		return (
      <div className="col-md-4" id="basket">
        <h4>Basket</h4>
        <table className="table">
          <thead>
          {this.totalRow()}
          <tr>
            <th>Item</th>
            <th>Price</th>
            <th>{this.emptyBasketButton()}</th>
          </tr>
          </thead>
          <tbody>
            {this.basketItemRows()}
          </tbody>
          <tfoot>
            {this.totalRow()}
            <tr>
              <th colSpan={2}>{ this.state.savings ? 'Savings of £' + this.state.savings.toFixed(2) + ' in this basket!' : ''}</th>
              <th>{this.emptyBasketButton()}</th>
            </tr>
          </tfoot>
        </table>
      </div>

		);
	}
});

module.exports = Basket;
