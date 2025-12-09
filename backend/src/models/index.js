import Sequelize from "sequelize";
import ItemModel from "./item.js";
import BomModel from "./bom.js";

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false
});

const models = {};

models.Item = ItemModel(sequelize, Sequelize.DataTypes);
models.Bom = BomModel(sequelize, Sequelize.DataTypes);

// rodar associações
Object.values(models)
  .filter((model) => typeof model.associate === "function")
  .forEach((model) => model.associate(models));

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;