import asyncwrapper from "../middlewares/asyncwrapper.js";
import apperror from "../utils/apperror.js";
import Product from "../models/products.model.js";

// Senior Tip: Helper to prevent Regex Injection attacks
const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

const getProducts = asyncwrapper(async (req, res) => {
  const paginationnumber = parseInt(req.query.limit) || 100;
  const page = parseInt(req.query.page) || 1;

  const query = {};
  if (req.query.search) {
    const searchSafe = escapeRegex(req.query.search);
    query.name = { $regex: searchSafe, $options: "i" };
  }

  const products = await Product.find(query)
    .limit(paginationnumber)
    .skip((page - 1) * paginationnumber);
  res.status(200).json({ status: "success", data: { products } });
});

const addProduct = asyncwrapper(async (req, res) => {
  const { name, price, description, image, stock } = req.body;

  if (
    !name ||
    price === undefined ||
    !description ||
    !image ||
    stock === undefined
  ) {
    throw new apperror("missing fields ", 400, "fail");
  }

  const product = await Product.create({
    name,
    price,
    description,
    image,
    stock,
  });
  res.status(200).json({ status: "success", data: { product } });
});
const updateProduct = asyncwrapper(async (req, res) => {
  const { name, price, description, image, stock } = req.body;

  const updateData = {};
  if (name) updateData.name = name;
  if (price !== undefined) updateData.price = price;
  if (description) updateData.description = description;
  if (image) updateData.image = image;
  if (stock !== undefined) updateData.stock = stock;

  if (Object.keys(updateData).length === 0) {
    throw new apperror("No fields provided for update", 400, "fail");
  }

  const product = await Product.findByIdAndUpdate(
    req.params.productId,
    updateData,
    {
      new: true,
      runValidators: true,
    },
  ).select("-__v");
  if (!product) {
    throw new apperror("Product not found", 404, "fail");
  }
  res.status(200).json({ status: "success", data: { product } });
});
const deleteProduct = asyncwrapper(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.productId);
  if (!product) {
    throw new apperror("Product not found", 404, "fail");
  }
  res.status(200).json({ status: "success", data: { product } });
});
export { getProducts, addProduct, updateProduct, deleteProduct };
