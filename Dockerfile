FROM nginx:alpine

COPY dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/templates/default.conf.template
