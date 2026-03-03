FROM node:23-slim

WORKDIR /app

COPY --from=build /app/package*.json ./

RUN npm install --production

COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/app.js"]