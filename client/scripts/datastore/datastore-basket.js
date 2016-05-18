var Discounts = require('./discounts');
var Immutable = require('immutable');


var DatastoreBasket = function() {

  var basket = Immutable.Map({
    items: Immutable.List([]),
    total: 0,
    savings: 0
  }),
      subs = [];
  const BASKET = 'basket';

  // restore from storage if a previous session left anything
  storageRestore();

  function getBasket () {
    return basket.toJS();
  }

  function addToBasket (item) {    basket = basket.set('items', basket.get('items').push(item) );
    afterUpdate();
  }

  function removeFromBasket (index) {
    basket = basket.set('items', basket.get('items').delete(index) );
    afterUpdate();
  }

  function emptyBasket () {
    basket = basket.set('items', basket.get('items').clear() );
    afterUpdate();
  }

  function basketSub (scope, fn) {
    subs.push({fn: fn, scope:scope});
  }

  function basketUnSub (scope, fn) {
    subs = subs.filter( sub => !(sub.fn === fn && sub.scope === scope) );
  }

  function basketPublish () {
    subs.forEach( sub => sub.fn.call(sub.scope, getBasket()));
  }

  function basketComputeTotals () {
    var countItems = basket.get('items').reduce( (count, item) => {
      if (count[item.code]) {
        ++count[item.code].qty;
      } else {
        count[item.code] = item;
        count[item.code].qty = 1;
      }
      return count;
    }, {});

    var grandTotal = Object.keys(countItems).reduce( (total, key) => {
       return total += countItems[key].qty * countItems[key].price;
    },0);

    var discountTotal = Object.keys(countItems).reduce( (discount, key) => {
       var item = countItems[key];
       if (item.discount) {
         return discount += Discounts[item.discount.code](item);
       } else {
         return discount;
       }
    },0);

    basket = basket.set('total', grandTotal - discountTotal );
    basket = basket.set('savings', discountTotal );

  }

  function storageSave () {
    localStorage.setItem(BASKET, JSON.stringify(basket.toJS()));
  }

  function storageRestore () {
    var storedBasket;
    if (storedBasket = localStorage.getItem(BASKET)) {
      storedBasket = JSON.parse(storedBasket);
      storedBasket.items = Immutable.List(storedBasket.items);
      basket = Immutable.Map(storedBasket);
      basketPublish();
    }
  }

  function afterUpdate () {
    basketComputeTotals();
    storageSave();
    basketPublish();
  }

  // return the public methods
  return {
    get: getBasket,
    add: addToBasket,
    remove: removeFromBasket,
    empty: emptyBasket,
    sub: basketSub,
    unsub: basketUnSub
  };

}();

module.exports = DatastoreBasket;
