
var Discounts = {

  'bogof': function (item) {
    // Divide by two and go down to the next lowest integer
    // to get the amount that are free.
    return Math.floor( item.qty / 2 ) * item.price;
  },

  'qty-discount': function(item) {
    var discount = 0;
    if (item.qty >= item.discount.gteQty) {
      discount = (item.price - item.discount.price) * item.qty;
    }
    return discount;
  }
};

module.exports = Discounts;
