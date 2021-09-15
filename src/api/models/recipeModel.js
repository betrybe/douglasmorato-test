const { ObjectId } = require('mongodb');

const collection = require('../config/mongoconfig');

class RecipeModel {
  static async findAll() {
    const collect = await collection('recipes');
    return collect.find({}).toArray();
  }

  static async deleteById(id) {
    const oId = new ObjectId(id);
    const collect = await collection('recipes');
    return collect.deleteOne({ _id: oId });
  }

  static async findById(id) {
    if (id.length !== 12 && id.length !== 24) {
      return undefined;
    }
    const oId = new ObjectId(id);
    const collect = await collection('recipes');
    const recipe = await collect.find({ _id: oId }).toArray();

    return recipe[0];
  }

  static async insertOrUpdate(param) {
    try {
      const data = param;
      const oId = ObjectId(data.userId);
      const collect = await collection('recipes');
      const id = data._id;
      delete data._id;

      const insertResult = id
        ? await collect.findOneAndUpdate(
            { _id: ObjectId(id) },
            { $set: { ...data, userId: oId } },
            { returnOriginal: false },
          )
        : await collect.insertOne({ ...data, userId: oId });
      const recipe = insertResult.ops ? { recipe: insertResult.ops[0] } : { ...insertResult.value };

      return recipe;
    } catch (error) {
      return { message: error };
    }
  }
}
module.exports = RecipeModel;
