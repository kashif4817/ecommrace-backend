import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import Product from "../models/addProduct.js";
import seedRoles from "../utils/seedRoles.js";
import Role from '../models/roles.js'
import user from "../models/user.js";
import { response } from "express";



export const sendResponse = (res, statusCode, message, data = null, error = null,) => {
  return res.status(statusCode).json({
    status: statusCode,
    message,
    data,
    error,
  });
};


export const signup = async (req, res) => {
  console.log('signUp clicked');

  try {
    const { firstName, lastName, email, password, confirmPassword, mobile } = req.body;

    // 1️⃣ Validation
    if (!email || !firstName || !lastName || !mobile || !password || !confirmPassword) {
      return sendResponse(res, 400, "All fields are required.", null, "Missing credentials");
    }

    if (password !== confirmPassword) {
      return sendResponse(res, 400, "Passwords do not match.", null, "Password mismatch");
    }

    // 2️⃣ Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendResponse(res, 409, "Email already registered.", null, "Duplicate email");
    }

    // 3️⃣ Get default role = "user"
    const userRole = await Role.findOne({ name: "user" });
    console.log("Default UserROle while signUp", userRole);
    if (!userRole) {
      return sendResponse(res, 500, "Default role not found. Please seed roles first.", null, "Missing role");
    }

    // 4️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5️⃣ Create user with default role
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      mobile,
      roleId: userRole._id,
    });

    // 6️⃣ Generate token (only essentials)
    // const accessToken = generateAccessToken({ id: newUser._id, roleName: userRole.name, roleId: userRole.id });

    // 7️⃣ Send Response
    console.log("userRole.name", userRole.name);

    return response.status(201).json({
      // accessToken,
      user: {
        userId: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        mobile: newUser.mobile,
        roleId: userRole._id,
        roleName: userRole.name,
      }
    })
    // return sendResponse(res, 201, "Signup successful ✅", {
    //   accessToken,
    //   user: {
    //     userId: newUser._id,
    //     firstName: newUser.firstName,
    //     lastName: newUser.lastName,
    //     email: newUser.email,
    //     mobile: newUser.mobile,
    //     roleId: userRole._id,
    //     roleName: userRole.name
    //   },
    // });

  } catch (error) {
    console.error("Signup error:", error);
    return sendResponse(res, 500, "Server error. Please try again later.", null, error.message);
  }
};



export const login = async (req, res) => {
  console.log("Login clicked")
  try {
    const { email, password } = req.body;
    const userRole = await Role.findOne({ name: "user" });
    console.log("Default UserROle while signUp", userRole);
    console.log(userRole.name);


    // 1️⃣ Check if both fields are provided
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // 2️⃣ Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials.", error: "invalid login details" }); // do NOT tell which one is wrong
    }

    // 3️⃣ Compare plain password with hashed one in DB 
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      return res.status(401).json({ message: "Invalid credentials.", error: "invalid login details" }); // do NOT tell which one is wrong
    }



    // 4️⃣ Generate tokens
    const accessToken = await generateAccessToken(user);
    console.log('accessToken', accessToken);

    // 6️⃣ Send response
    res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      user: {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roleId: user.roleId,
        roleName: userRole.name
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
}


export const logout = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
  res.json({ message: "Logged out successfully" });
};


export const home = async (req, res) => {
  res.send("hey i am in protected route");
};


export const refreshAccessToken = async (req, res) => {
  const token = req.cookies.refreshToken;

  // 1️⃣ Check if token exists
  if (!token) return res.status(401).json({ message: "No refresh token found" });

  try {
    // 2️⃣ Verify token using same secret used to sign refresh tokens
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // 3️⃣ Generate a new access token
    const accessToken = jwt.sign({
      id: decoded.id,
      email: decoded.email
    },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" },
    );

    // 4️⃣ Send new access token
    res.status(200).json({
      accessToken,
      message: "New access token issued.",
    });
  } catch (error) {
    console.error("Refresh error:", error);
    res.status(403).json({ message: "Invalid or expired refresh token." });
  }
};

// export const getProductById = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const product = await Product.findById(id);

//         if (!product) {
//             return res.status(404).json({
//                 status: 404,
//                 message: "Product not found",
//                 data: null,
//                 error: null
//             });
//         }

//         // Optional: check if owner is the same user (if needed)
//         if (product.owner?.toString() !== req.user.id) {
//             return res.status(403).json({
//                 status: 403,
//                 message: "Not authorized to view this product",
//                 data: null,
//                 error: null
//             });
//         }

//         res.status(200).json({
//             status: 200,
//             message: "Product fetched successfully",
//             data: product,
//             error: null
//         });
//     } catch (error) {
//         res.status(500).json({
//             status: 500,
//             message: "Server error",
//             data: null,
//             error: error.message
//         });
//     }
// };


// export const createProduct = async (req, res) => {
//     try {
//         const { name, price, image, category, description } = req.body;
//         const product = new Product({
//             name,
//             price,
//             image,
//             category,
//             description,
//             owner: req.user.id,
//         })
//         await product.save();
//         res.status(201).json({
//             status: 201,
//             message: "Product created successfully",
//             data: product,
//             error: null
//         })

//     } catch (error) {
//         res.status(500).json({
//             status: 500,
//             message: "Server error",
//             data: null,
//             error: error.message
//         });

//     }
// }

// export const getProducts = async (req, res) => {
//     try {
//         const products = await Product.find({ createdBy: req.user._id });
//         res.status(200).json(({
//             status: 200,
//             message: "Product fetched successfully",
//             data: products,
//             error: null
//         }))
//     } catch (error) {
//         console.log("Error", error)
//         res.status(500).json({
//             status: 500,
//             message: "Server Error",
//             data: null,
//             error: error.message
//         })
//     }
// }

// export const updateProduct = async (req, res) => {
//     console.log("update product")
//     try {
//         const { id } = req.params;
//         const { name, description, price, image, category } = req.body;

//         const product = await Product.findById(id);
//         if (!product) {
//             return res.status(404).json({
//                 status: 404,
//                 message: "Product not found",
//                 data: null,
//                 error: null
//             });
//         }

//         // Check ownership with "owner" field
//         if (product.owner?.toString() !== req.user.id) {
//             return res.status(403).json({
//                 status: 403,
//                 message: "Not authorized to update this product",
//                 data: null,
//                 error: null
//             });
//         }

//         // Update only the provided fields
//         if (name) product.name = name;
//         if (price) product.price = price;
//         if (image) product.image = image;
//         if (category) product.category = category;
//         if (description) product.description = description;

//         const updatedProduct = await product.save();

//         res.status(200).json({
//             status: 200,
//             message: "Product updated successfully",
//             data: updatedProduct,
//             error: null
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             status: 500,
//             message: "Server error",
//             data: null,
//             error: error.message
//         });
//     }
// };


// export const deleteProduct = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const product = await Product.findById(id);
//         console.log(product)

//         if (!product) {
//             return res.status(404).json({
//                 status: 404,
//                 message: "Product not found",
//                 data: null,
//                 error: null
//             });
//         }

//         // Check ownership using createdBy instead of user
//         if (!product.owner || product.owner.toString() !== req.user.id) {
//             return res.status(403).json({
//                 status: 403,
//                 message: "Not authorized to delete this product",
//                 data: null,
//                 error: null
//             });
//         }


//         await product.deleteOne();

//         res.status(200).json({
//             status: 200,
//             message: "Product deleted successfully",
//             data: null,
//             error: null
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             status: 500,
//             message: "Server error",
//             data: null,
//             error: error.message
//         });
//     }
// };


