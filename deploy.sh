echo "Switching to branch main"
git checkout main

echo "Building app..."
npm run build

echo "Deploying files to server..."
scp -r build/* rim@192.168.0.20:/var/www/192.168.0.20/

echo "Deploying backend files to server"
scp -r api/{api,models,constants}.py api/requirements.txt rim@192.168.0.20:~/TaskList/ 

echo "Done!"