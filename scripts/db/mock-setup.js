/* eslint-disable no-console */
import path from 'path';
import Sequelize from 'sequelize';
import DbClient, { importModels } from '$/lib/db-client';

if (['development', 'staging'].indexOf(process.env.NODE_ENV) > -1) {
  const dbClient: Sequelize = DbClient(process.env.DATABASE_URL);
  const modelsPath = path.join(__dirname, '../../src/models');
  importModels(modelsPath, dbClient);

  console.log('\n>>> CREATING DB TABLES\n');
  console.log('\n>>> CREATING DB TABLES\n');

  dbClient.sync({ force: true })
    .then(() => {
      console.log('\n>>> DB TABLE SETUP IS COMPLETED\n');
      process.exit();
    })
    .catch((err) => {
      console.log('\n>>> DB TABLE SETUP FAILED!!!\n');
      console.log(err);
      process.exit(1);
    });
}
