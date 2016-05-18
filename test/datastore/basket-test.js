
describe('datastore basket', function () {
  var Basket, products;

  beforeEach(function() {
    Basket = require('../../client/scripts/datastore/datastore-Basket.js');
    products = require('../../server/data/products.json');
    localStorage.clear();
    localStorage.itemInsertionCallback = null;
    Basket.empty();
  });

  it('should correctly add and remove items from basket, retrieve basket and workout totals', function (done) {
    localStorage.clear();

    Basket.add(products[0]);
    Basket.add(products[0]);
    var basket = Basket.get();
    basket.items.length.should.equal(2);
    basket.total.toFixed(2).should.equal('3.11');
    basket.savings.toFixed(2).should.equal('3.11');

    Basket.add(products[0]);
    basket = Basket.get();
    basket.items.length.should.equal(3);
    basket.total.toFixed(2).should.equal('6.22');
    basket.savings.toFixed(2).should.equal('3.11');

    Basket.add(products[0]);
    basket = Basket.get();
    basket.items.length.should.equal(4);
    basket.total.toFixed(2).should.equal('6.22');
    basket.savings.toFixed(2).should.equal('6.22');

    Basket.remove(0);
    basket = Basket.get();
    basket.items.length.should.equal(3);
    basket.total.toFixed(2).should.equal('6.22');
    basket.savings.toFixed(2).should.equal('3.11');
    done();
  });

  it('should correctly empty basket', function (done) {
    Basket.add(products[0]);
    Basket.add(products[0]);
    Basket.empty();
    var basket = Basket.get();
    basket.items.length.should.equal(0);
    basket.total.should.equal(0);
    basket.savings.should.equal(0);
    done();
  });

  it('should correctly register/deregister and publish for subscribers', function (done) {
    var called = 0;
    function callback () {
      called++;
    }

    Basket.sub(this, callback);
    called.should.equal(0);

    Basket.add(products[0]);
    called.should.equal(1);

    Basket.remove(0);
    called.should.equal(2);

    Basket.unsub(this, callback);
    Basket.add(products[0]);
    called.should.equal(2);

    done();
  });

});
