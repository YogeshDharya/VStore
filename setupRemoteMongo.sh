# Setup file template to upload data to MongoDB Atlas
mongoimport --uri "mongodb://ac-bxypubc-shard-00-00.rbcs7e0.mongodb.net:27017,ac-bxypubc-shard-00-01.rbcs7e0.mongodb.net:27017,ac-bxypubc-shard-00-02.rbcs7e0.mongodb.net:27017/?replicaSet=atlas-103606-shard-0" --ssl --authenticationDatabase admin --username admin --password oNelEwcMnqYEErPn --drop --collection users --file data/export_qkart_users.json
mongoimport --uri "mongodb://ac-bxypubc-shard-00-00.rbcs7e0.mongodb.net:27017,ac-bxypubc-shard-00-01.rbcs7e0.mongodb.net:27017,ac-bxypubc-shard-00-02.rbcs7e0.mongodb.net:27017/?replicaSet=atlas-103606-shard-0" --ssl --authenticationDatabase admin --username admin --password oNelEwcMnqYEErPn --drop --collection products --file data/export_qkart_products.json 






