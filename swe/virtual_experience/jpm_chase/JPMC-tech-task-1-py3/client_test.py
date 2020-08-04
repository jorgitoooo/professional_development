import unittest
from client3 import getDataPoint, getRatio

class ClientTest(unittest.TestCase):
  def test_getDataPoint_calculatePrice(self):
    quotes = [
      {'top_ask': {'price': 121.2, 'size': 36}, 'timestamp': '2019-02-11 22:06:30.572453', 'top_bid': {'price': 120.48, 'size': 109}, 'id': '0.109974697771', 'stock': 'ABC'},
      {'top_ask': {'price': 121.68, 'size': 4}, 'timestamp': '2019-02-11 22:06:30.572453', 'top_bid': {'price': 117.87, 'size': 81}, 'id': '0.109974697771', 'stock': 'DEF'}
    ]
    """ ------------ Add the assertion below ------------ """
    quote_0 = quotes[0]
    quote_1 = quotes[1]

    stock_0, bid_price_0, ask_price_0, price_0 = getDataPoint(quote_0)
    stock_1, bid_price_1, ask_price_1, price_1 = getDataPoint(quote_1)

    self.assertEqual(price_0, (quote_0['top_ask']['price'] + quote_0['top_bid']['price']) / 2.)
    self.assertEqual(price_1, (quote_1['top_ask']['price'] + quote_1['top_bid']['price']) / 2.)

  def test_getDataPoint_calculatePriceBidGreaterThanAsk(self):
    quotes = [
      {'top_ask': {'price': 119.2, 'size': 36}, 'timestamp': '2019-02-11 22:06:30.572453', 'top_bid': {'price': 120.48, 'size': 109}, 'id': '0.109974697771', 'stock': 'ABC'},
      {'top_ask': {'price': 121.68, 'size': 4}, 'timestamp': '2019-02-11 22:06:30.572453', 'top_bid': {'price': 117.87, 'size': 81}, 'id': '0.109974697771', 'stock': 'DEF'}
    ]
    """ ------------ Add the assertion below ------------ """
    quote_0 = quotes[0]
    quote_1 = quotes[1]

    stock_0, bid_price_0, ask_price_0, price_0 = getDataPoint(quote_0)
    stock_1, bid_price_1, ask_price_1, price_1 = getDataPoint(quote_1)

    self.assertTrue(bid_price_0 > ask_price_0)
    self.assertFalse(bid_price_1 > ask_price_1)

  """ ------------ Add more unit tests ------------ """
  def test_getDataPoint_calculateDataPoints(self):
    quotes = [
      {'top_ask': {'price': 121.2, 'size': 36}, 'timestamp': '2019-02-11 22:06:30.572453', 'top_bid': {'price': 120.48, 'size': 109}, 'id': '0.109974697771', 'stock': 'ABC'},
      {'top_ask': {'price': 121.68, 'size': 4}, 'timestamp': '2019-02-11 22:06:30.572453', 'top_bid': {'price': 117.87, 'size': 81}, 'id': '0.109974697771', 'stock': 'DEF'}
    ]
    """ ------------ Add the assertion below ------------ """
    quote_0 = quotes[0]
    quote_1 = quotes[1]

    data_point_0 = (
      quote_0['stock'],
      quote_0['top_bid']['price'],
      quote_0['top_ask']['price'],
      (quote_0['top_ask']['price'] + quote_0['top_bid']['price']) / 2.
    )
    data_point_1 = (
      quote_1['stock'],
      quote_1['top_bid']['price'],
      quote_1['top_ask']['price'],
      (quote_1['top_ask']['price'] + quote_1['top_bid']['price']) / 2.
    )

    self.assertEqual(getDataPoint(quote_0), data_point_0)
    self.assertEqual(getDataPoint(quote_1), data_point_1)

  def test_getRatio_calculateRatio(self):
    quotes = [
      {'top_ask': {'price': 121.2, 'size': 36}, 'timestamp': '2019-02-11 22:06:30.572453', 'top_bid': {'price': 120.48, 'size': 109}, 'id': '0.109974697771', 'stock': 'ABC'},
      {'top_ask': {'price': 121.68, 'size': 4}, 'timestamp': '2019-02-11 22:06:30.572453', 'top_bid': {'price': 117.87, 'size': 81}, 'id': '0.109974697771', 'stock': 'DEF'}
    ]

    quote_0 = quotes[0]
    quote_1 = quotes[1]

    stock_0, bid_price_0, ask_price_0, price_0 = getDataPoint(quote_0)
    stock_1, bid_price_1, ask_price_1, price_1 = getDataPoint(quote_1)

    price_test_0 = (quote_0['top_ask']['price'] + quote_0['top_bid']['price']) / 2.
    price_test_1 = (quote_1['top_ask']['price'] + quote_1['top_bid']['price']) / 2.
    
    ratio_test = price_test_0 / price_test_1

    self.assertEqual(getRatio(price_0, price_1), ratio_test)

  def test_getRatio_zeroDenominator(self):
    self.assertEqual(getRatio(100, 0), None)
    self.assertEqual(getRatio(0, 0), None)

  def test_getRatio_zeroNumerator(self):
    self.assertEqual(getRatio(0, 10), 0)
    self.assertEqual(getRatio(0, -3), 0)

if __name__ == '__main__':
    unittest.main()
