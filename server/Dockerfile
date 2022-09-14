FROM node:18
COPY ./ /app
WORKDIR /app
RUN npm install
RUN mkdir /checks
RUN apt-get update
RUN xargs -a /app/test_packages.txt apt-get install -y
RUN pip install -r /app/test_python_dependencies.txt
RUN pip install -r /app/app_python_dependencies.txt
CMD ["node", "app.js"]
