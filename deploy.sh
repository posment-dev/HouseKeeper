echo "Switching to branch main"
git checkout main

echo "Building app..."
npm run build

echo "Deploying files to server..."
scp -r build/* rim@192.168.0.26:/var/www/HouseKeeper/

echo "Deploying backend files to server"
scp -r api/{api,models,constants}.py api/requirements.txt api/.flaskenv rim@192.168.0.29:~/HouseKeeperApi/ 

echo "Done!"