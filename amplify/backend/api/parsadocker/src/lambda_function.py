import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans

def customer_clustering(bodyVal):
    table_data = []
    data = json.loads(bodyVal)
    table_data = json.loads(data['rowData'])

    # Extract column names as features
    features = list(table_data[0].keys())
    features.remove("Customer Name")  # Remove the customer name column

    # Extract feature values from table data
    data = []
    for row in table_data:
        values = [str(row[feature]) for feature in features]
        data.append(" ".join(values))

    # Create customer vectors using TF-IDF encoding
    vectorizer = TfidfVectorizer()
    X = vectorizer.fit_transform(data)

    # Apply PCA to reduce the dimensionality of the feature space
    pca = PCA(n_components=0.9, random_state=42)
    X_pca = pca.fit_transform(X.toarray())

    # Apply K-means clustering to the PCA-transformed data
    kmeans = KMeans(n_clusters=5, random_state=42)
    kmeans.fit(X_pca)

    # Get cluster labels
    cluster_labels = kmeans.predict(X_pca)
    clusters = []
    for i in range(5):
        customers_in_cluster = []
        for row, label, pcaVal in zip(table_data, cluster_labels, X_pca):
            if label == i:
                dRow = row
                dRow['x_plot'] = pcaVal[0]
                dRow['y_plot'] = pcaVal[1]
                customers_in_cluster.append(dRow)

        clusters.append({"label": f"Cluster {i}", "customers": customers_in_cluster})

    return clusters

def handler(event, context):

    clusters = customer_clustering(event['body'])

    #json_result = json.dumps(clusters.tolist())

    json_result = json.dumps(clusters)

    return {
        'statusCode': 200,
        'headers': {
            'Content-type': 'application/json',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        'body': json_result
    }