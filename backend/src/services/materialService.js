import models from "../models/index.js";
const { Item, Bom } = models;

export const resolveDetectedMaterials = async (detectedList) => {
  const finalResponse = [];

  for (const detected of detectedList) {

    const allItems = await Item.findAll();
    const matchedItem = allItems.find(item =>
      detected.toLowerCase().includes(item.name.toLowerCase())
    );

    if (!matchedItem) {
      finalResponse.push({
        name: detected,
        items: []
      });
      continue;
    }

    const components = await Bom.findAll({
      where: { parent_item_id: matchedItem.id },
      include: [
        {
          model: Item,
          as: "child",
          attributes: ["name", "unit"]
        }
      ]
    });

    finalResponse.push({
      name: matchedItem.name,
      items: components.map(c => ({
        item: c.child.name,
        qty: c.quantity,
        unit: c.child.unit
      }))
    });
  }

  return finalResponse;
};

export const getNonBaseItems = async () => {
  return await Item.findAll({
    where: { is_base_component: false }
  });
}