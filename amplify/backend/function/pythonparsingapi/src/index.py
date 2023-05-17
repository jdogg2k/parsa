import json

#import count vectorize and tfidf vectorise
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer

vectorizer = TfidfVectorizer()
# X_productTypes = vectorizer.fit_transform()

def handler(event, context):
  print('received event:')
  print(event)

  data = json.loads(event['body'])
  customers = data['customers']
  products = data['products']
  revenue = data['revenue']

  X_customers = vectorizer.fit_transform(customers)
  X_products = vectorizer.fit_transform(products)
  X_revenue = vectorizer.fit_transform(revenue)

  # JLR to do - cluster everything above and send back to application

  return {
      'statusCode': 200,
      'headers': {
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
      },
      'body': 'ALL DONE'
  }