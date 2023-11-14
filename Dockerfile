# Filename: Dockerfile

FROM node:slim

# Install Chromium dependencies
RUN apt-get update
RUN apt-get install -y libglib2.0-0 libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libgbm1 libasound2 libpangocairo-1.0-0 libxss1 libgtk-3-0

# Create working directory
WORKDIR /usr/src/app

# Copy files
COPY package.json ./
COPY index.js ./

# Install NPM dependencies for function
RUN npm install

# Set timezone
RUN rm -rf /etc/localtime; ln -s /usr/share/zoneinfo/America/Los_Angeles /etc/localtime

# Expose app
EXPOSE 4000

# Run app
CMD ["node", "index.js"]
