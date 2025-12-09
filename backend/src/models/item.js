export default (sequelize, DataTypes) => {
  const Item = sequelize.define("Item", {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    category: DataTypes.STRING,
    unit: DataTypes.STRING,
    is_base_component: DataTypes.BOOLEAN
  }, {
    tableName: "items",
    timestamps: false
  });

  Item.associate = (models) => {
    Item.hasMany(models.Bom, { foreignKey: "parent_item_id", as: "parent" });
    Item.hasMany(models.Bom, { foreignKey: "child_item_id", as: "children" });
  };

  return Item;
};