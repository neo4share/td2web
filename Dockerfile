# Stage 1: Compile and Build angular codebase

# Use official node image as the base image
FROM node:latest as build

# Set the working directory
WORKDIR /opt/app/td2web

# Add the source code to app
COPY . .

# Install all the dependencies
RUN npm install

# Generate the build of the application
RUN npm run build

# Stage 2: Serve app with Apache2 server

# Use official httpd image as the base image
FROM httpd:latest

# Copy the build output to replace the default apache contents.
COPY --from=build /opt/app/td2web/dist/td2web /usr/local/apache2/htdocs/

# Expose port 80
EXPOSE 443
