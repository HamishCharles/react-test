describe('discount calculator', function() {

  beforeEach(function() {
    Discount = require('../../client/scripts/datastore/discounts.js');
  });

  it('should correctly calculate discount for bogof', function(done) {

    var item = {
      "code": "FR1",
      "description": "Fruit tea",
      "price": 3.11,
      "discount": {
        "code": "bogof",
        "description": "Buy one get one free"
      },
      "image": "fruit-tea.jpg",
      "qty": 3
    };
    var discount = Discount[item.discount.code](item);
    discount.toFixed(2).should.equal('3.11');

    item.qty = 4;
    discount = Discount[item.discount.code](item);
    discount.toFixed(2).should.equal('6.22');

    done();
  });

  it('should correctly calculate discount for qty-discount', function(done) {

    var item = {
      "code": "SR1",
      "description": "Strawberries",
      "price": 5,
      "discount": {
        "code": "qty-discount",
        "description": "Buy 3 or more and price goes down to £4.50",
        "gteQty": 3,
        "price": 4.5
      },
      "image": "strawberries.jpg",
      "qty": 3
    };
    var discount = Discount[item.discount.code](item);
    discount.toFixed(2).should.equal('1.50');

    item.qty = 2;
    discount = Discount[item.discount.code](item);
    discount.toFixed(2).should.equal('0.00');

    item.qty = 99;
    discount = Discount[item.discount.code](item);
    discount.toFixed(2).should.equal('49.50');

    done();
  });



});
