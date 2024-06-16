FROM node:18
COPY ./ /app
WORKDIR /app
RUN npm install
RUN mkdir /checks
RUN apt-get update
RUN apt-get install docker.io libpq-dev libssl-dev python3.11-venv -y
RUN xargs -a /app/test_packages.txt apt-get install -y
RUN python3 -m venv /app/server_venv
ENV PATH="/app/server_venv/bin:$PATH"
RUN . /app/server_venv/bin/activate
RUN pip install -r /app/test_python_dependencies.txt
RUN pip install -r /app/app_python_dependencies.txt
RUN chmod +x start.sh
CMD ["./start.sh"]
