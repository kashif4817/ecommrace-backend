import Product from "../models/addProduct.js";
import Category from "../models/productCategory.js";
import Role from "../models/roles.js";
import user from "../models/user.js";
import userProduct from "../models/userProduct.js";
import seedRoles from "../utils/seedRoles.js";

export const sendResponse = (res, statusCode, message, data = null, error = null) => {
    return res.status(statusCode).json({
        status: statusCode,
        message,
        data,
        error,
    });
};


export const createProduct = async (req, res) => {
    try {
        const { name, price, image, category, description, ishot, discountedItem, color, size } = req.body;
        console.log(req.body);
        // const userRole = await Role.findOne({ name: "user" });
        const id = req.user.userId;


        // if (req.user.role == userRole._id) 
        //     return sendResponse(res, 400, "Not Authorised to create product", null, null)
        // }
        const productCategory = await Category.create({
            size,
            discountedItem,
            color,
            hotItem: ishot,
        })
        console.log("productCategory;;;;;;", productCategory._id);
        console.log(productCategory)
        const newProduct = await Product.create({
            name,
            price,
            image,
            category,
            description,
            categoryId: productCategory._id
        })
        console.log(newProduct)
        console.log('product._id', newProduct._id);
        await userProduct.create(
            {
                user: req.user.userId,
                product: newProduct._id,
            },
            console.log(userProduct)
        )
        return sendResponse(res, 201, "Product created successfully", newProduct)

    } catch (error) {
        console.error();
        return sendResponse(res, 500, "Server error", null, error.message)
    }
};


export const getProducts = async (req, res) => {
    try {
        const products = await userProduct
            .find({ user: req.user.userId })
            .populate({
                path: "product",
                populate: {
                    path: "categoryId",   // 👈 product ke andar jo ref hai usko populate karega
                    // model: "Category"     // 👈 optional but ensures correct model
                }
            });


        // const category = await Product.find().populate('categoryId')
        // console.log("category",category)
        // .find({new:Category})
        // .populate("Category")
        // .populate('categoryId')
        // .populate("product.categoryId")
        console.log(products);

        if (!products || products.length === 0) {
            return sendResponse(res, 404, "No products found", [])
        }
        const userProducts = products.map(item => item.product).filter(p => p !== null)
        return sendResponse(res, 200, "Product fetched successfully", userProducts, null)
    } catch (error) {
        console.error("Error fetching products:", error);
        return sendResponse(res, 500, "Internal Server Error", null, error.message)
    }
};

//so this is my new line to push 
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) return sendResponse(res, 404, "Product not found")
        return sendResponse(res, 200, "Product found", product, null)

    } catch (error) {
        console.error("Error fetching products:", error);
        return sendResponse(res, 500, "Internal Server Error", null, error.message)
    }
};



export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) return sendResponse(res, 404, "Product not found")
        await product.deleteOne();
        return sendResponse(res, 200, "Product deleted successfully")

    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, "Internal Server Error", null, error.message)
    };
}



export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('req.params', req.params);
        const { name, description, price, image, category, ishot, discounted, color, size } = req.body;

        const product = await Product.findById(id).populate('categoryId')
        console.log(product)
        if (!product) return sendResponse(res, 404, "Product not found")

        // Update only the provided fields
        if (name) product.name = name;
        if (price) product.price = price;
        if (image) product.image = image;
        if (category) product.category = category;
        if (description) product.description = description;
        if (ishot) product.categoryId.hotItem = ishot;
        if (discounted) product.categoryId.discounted = discounted;
        if (color) product.categoryId.color = color;
        if (size) product.categoryId.size = size;

        const updatedProduct = await product.save();
        console.log(product.categoryId.color)
        console.log(updateProduct);


        return sendResponse(res, 200, "Product updated successfully", updatedProduct, null)

    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, "Internal Server Error", null, error.message)
    }
};

