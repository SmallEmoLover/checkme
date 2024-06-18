FROM node:18
COPY ./ /app
WORKDIR /app
RUN npm install
RUN mkdir /checks
RUN apt-get update
RUN apt-get install docker.io libpq-dev libssl-dev python3-venv python3-distutils -y
RUN xargs -a /app/test_packages.txt apt-get install -y
RUN python3 -m venv server_venv
RUN server_venv/bin/pip install -r /app/test_python_dependencies.txt
RUN server_venv/bin/pip install -r /app/app_python_dependencies.txt
RUN chmod +x start.sh
CMD ["./start.sh"]
