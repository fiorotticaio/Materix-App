export default (sequelize, DataTypes) => {
  const Bom = sequelize.define("Bom", {
    parent_item_id: DataTypes.INTEGER,
    child_item_id: DataTypes.INTEGER,
    quantity: DataTypes.FLOAT
  }, {
    tableName: "bom",
    timestamps: false
  });

  Bom.associate = (models) => {
    Bom.belongsTo(models.Item, { foreignKey: "parent_item_id", as: "parent" });
    Bom.belongsTo(models.Item, { foreignKey: "child_item_id", as: "child" });
  };

  return Bom;
};