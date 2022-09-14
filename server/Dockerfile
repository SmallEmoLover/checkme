FROM node:18
COPY ./ /app
WORKDIR /app
RUN npm install
RUN mkdir /tasks /checks
RUN apt-get update
RUN xargs -a /app/test_packages.txt apt-get install
RUN pip install -r /app/test_python_dependencies.txt
CMD ["node", "app.js"]
