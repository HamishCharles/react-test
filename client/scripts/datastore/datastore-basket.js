var Discounts = require('./discounts');

var DatastoreBasket = function() {

  var basket = {
    items: [],
    total: 0,
    savings: 0
  },
      subs = [];

  // restore from storage if a previous session left anything
  storageRestore();

  function getBasket () {
    return basket;
  }

  function addToBasket (item) {
    basket.items.push(item);
    afterUpdate();
  }

  function removeFromBasket (index) {
    basket.items.splice(index,1);
    afterUpdate();
  }

  function emptyBasket () {
    basket.items = [];
    afterUpdate();
  }

  function basketSub (scope, fn) {
    subs.push({fn: fn, scope:scope});
  }

  function basketUnSub (scope, fn) {
    subs = subs.filter( sub => !(sub.fn === fn && sub.scope === scope) );
  }

  function basketPublish () {
    subs.forEach( sub => sub.fn.call(sub.scope, basket));
  }

  function basketComputeTotals () {

    var countItems = basket.items.reduce( (count, item) => {
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

    basket.total = grandTotal - discountTotal;
    basket.savings = discountTotal;

  }

  function storageSave () {

    localStorage.setItem('basket', JSON.stringify(basket));
  }

  function storageRestore () {
    var storedBasket;
    if (storedBasket = localStorage.getItem('basket')) {
      basket = JSON.parse(storedBasket);
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
